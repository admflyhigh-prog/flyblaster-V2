# Fly Blaster - WhatsApp Blast System Implementation Guide

## 📋 Overview

This guide will help you implement the complete WhatsApp blast system with:
- **Frontend**: Complete UI (already built - see `index-blast.html`)
- **Backend**: Supabase database
- **Automation**: n8n workflow with WAHA

---

## 🎯 User Flow

```
1. CREATE GROUP
   └─> User creates "SPM Parents 2026"
   └─> Adds contacts: Ahmad (+60123...), Siti (+60129...)

2. CREATE TEMPLATE
   └─> User creates "Exam Reminder" message
   └─> Optionally adds image

3. CREATE CAMPAIGN
   └─> Selects group: "SPM Parents 2026"
   └─> Selects template: "Exam Reminder"
   └─> Campaign status: "Pending"

4. START CAMPAIGN
   └─> User clicks "Start" button
   └─> Frontend calls n8n webhook
   └─> n8n sends messages via WAHA
   └─> Status updates in real-time

5. VIEW STATUS
   └─> See Pending/Sent/Failed counts
   └─> Daily limit warning: "85/100 messages sent"
```

---

## 📦 Step 1: Setup Supabase Database

### 1.1 Create a Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Note your:
   - Project URL: `https://xxxxx.supabase.co`
   - API Key (anon/public): `eyJhbGci...`

### 1.2 Run Database Schema

Go to **SQL Editor** in Supabase and run this:

```sql
-- ============================================
-- CONTACTS & GROUPS
-- ============================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  phone VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_contacts (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, contact_id)
);

-- ============================================
-- MESSAGE TEMPLATES
-- ============================================

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  message_text TEXT NOT NULL,
  media_url TEXT,
  media_type VARCHAR(20), -- 'image', 'video', 'document', null
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGNS
-- ============================================

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sending, completed, stopped
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ============================================
-- MESSAGE LOGS
-- ============================================

CREATE TABLE message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  phone VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY SAFETY TRACKING
-- ============================================

CREATE TABLE daily_message_count (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  is_blocked BOOLEAN DEFAULT FALSE
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_message_logs_campaign ON message_logs(campaign_id);
CREATE INDEX idx_message_logs_status ON message_logs(status);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_group_contacts_group ON group_contacts(group_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get all contacts in a campaign
CREATE OR REPLACE FUNCTION get_campaign_recipients(campaign_uuid UUID)
RETURNS TABLE (
  contact_id UUID,
  name VARCHAR,
  phone VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.phone
  FROM campaigns camp
  JOIN group_contacts gc ON gc.group_id = camp.group_id
  JOIN contacts c ON c.id = gc.contact_id
  WHERE camp.id = campaign_uuid;
END;
$$ LANGUAGE plpgsql;

-- Check if we can send messages safely
CREATE OR REPLACE FUNCTION can_send_messages(message_limit INTEGER DEFAULT 100)
RETURNS TABLE (
  can_send BOOLEAN,
  messages_sent_today INTEGER,
  messages_remaining INTEGER,
  warning_message TEXT
) AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT message_count 
  INTO v_count
  FROM daily_message_count 
  WHERE date = CURRENT_DATE;
  
  IF v_count IS NULL THEN
    INSERT INTO daily_message_count (date, message_count) 
    VALUES (CURRENT_DATE, 0);
    v_count := 0;
  END IF;
  
  RETURN QUERY
  SELECT 
    v_count < message_limit AS can_send,
    v_count AS messages_sent_today,
    GREATEST(0, message_limit - v_count) AS messages_remaining,
    CASE 
      WHEN v_count >= message_limit THEN 'Daily limit reached!'
      WHEN v_count >= (message_limit * 0.8) THEN 'Warning: Approaching daily limit'
      ELSE 'Safe to send'
    END AS warning_message;
END;
$$ LANGUAGE plpgsql;

-- Increment message count
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_message_count (date, message_count, last_message_at)
  VALUES (CURRENT_DATE, 1, NOW())
  ON CONFLICT (date) 
  DO UPDATE SET 
    message_count = daily_message_count.message_count + 1,
    last_message_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### 1.3 Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_logs ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow all for authenticated users
CREATE POLICY "Allow all for authenticated" ON contacts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated" ON groups
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated" ON group_contacts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated" ON templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated" ON campaigns
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated" ON message_logs
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🤖 Step 2: Setup WAHA (WhatsApp HTTP API)

### 2.1 Install WAHA with Docker

```bash
docker run -d \
  --name waha \
  -p 3000:3000 \
  -e WHATSAPP_HOOK_URL=https://your-n8n.com/webhook/waha-status \
  devlikeapro/waha
```

### 2.2 Start WhatsApp Session

```bash
# Get QR code
curl http://localhost:3000/api/sessions/default/start

# Open browser: http://localhost:3000/api/sessions/default/qr
# Scan with WhatsApp mobile app
```

### 2.3 Test WAHA

```bash
# Check status
curl http://localhost:3000/api/sessions/default/status

# Test send message
curl -X POST http://localhost:3000/api/sendText \
  -H "Content-Type: application/json" \
  -d '{
    "session": "default",
    "chatId": "+60123456789@c.us",
    "text": "Hello from WAHA!"
  }'
```

---

## 🔄 Step 3: Setup n8n Workflow

### 3.1 Install n8n

```bash
# Using Docker
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Or with npm
npm install n8n -g
n8n start
```

Access n8n at: http://localhost:5678

### 3.2 Install WAHA Node

In n8n:
1. Go to **Settings** → **Community Nodes**
2. Install: `@waha/n8n-nodes-waha`

### 3.3 Create Credentials

**Supabase Credential:**
1. Go to **Credentials** → **New**
2. Select **Supabase**
3. Add:
   - Host: `https://xxxxx.supabase.co`
   - Service Role Key: (from Supabase settings)

**WAHA Credential:**
1. Go to **Credentials** → **New**
2. Select **HTTP Request Auth** (or WAHA if available)
3. Add WAHA base URL: `http://localhost:3000`

### 3.4 Import Workflow

Create a new workflow in n8n with these nodes:

**Simple Flow Structure:**

```
[Webhook] 
  ↓
[Supabase: Check Daily Limit]
  ↓
[IF: Can Send?]
  ↓ (Yes)
[Supabase: Get Campaign + Recipients]
  ↓
[Supabase: Update Campaign status = 'sending']
  ↓
[Loop Each Contact]
  ↓
[WAHA: Send Message]
  ↓
[Supabase: Update message_logs]
  ↓
[Supabase: Increment Daily Counter]
  ↓
[Wait 2 seconds]
  ↓
[Supabase: Mark Campaign as 'completed']
```

### 3.5 Configure Webhook Node

```json
{
  "parameters": {
    "path": "start-campaign",
    "method": "POST",
    "responseMode": "onReceived"
  }
}
```

Webhook URL will be: `https://your-n8n.com/webhook/start-campaign`

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Frontend API Calls

In your `app-blast.js`, replace mock data with Supabase calls:

```javascript
// At the top of app-blast.js
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const N8N_WEBHOOK = 'https://your-n8n.com/webhook/start-campaign';

// Example: Load groups from Supabase
async function loadGroups() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/groups?select=*,group_contacts(contact:contacts(*))`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return await response.json();
}

// Example: Start campaign
async function startCampaign(campaignId) {
  await fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaign_id: campaignId })
  });
}
```

### 4.2 Real-time Updates (Optional)

Use Supabase Realtime to update campaign status automatically:

```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Subscribe to campaign updates
supabase
  .channel('campaigns')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'campaigns'
  }, payload => {
    console.log('Campaign updated:', payload);
    renderPage(); // Refresh UI
  })
  .subscribe();
```

---

## ⚠️ Step 5: Safety & Rate Limiting

### 5.1 Daily Limits

Default: **100 messages/day**

To change limit:
```sql
-- In your n8n workflow, change the function call:
SELECT * FROM can_send_messages(200); -- 200 messages/day
```

### 5.2 Message Delay

In n8n "Wait" node:
- Minimum: **2 seconds** between messages
- Recommended: **3 seconds** for safer sending

### 5.3 Warning Thresholds

- **80% (80 messages)**: Show warning banner
- **100% (100 messages)**: Block new campaigns

---

## 🧪 Step 6: Testing

### Test Checklist

1. **Create Group**
   - [ ] Add group with 2-3 contacts
   - [ ] Verify saved in Supabase

2. **Create Template**
   - [ ] Text-only template
   - [ ] Template with image
   - [ ] Verify saved

3. **Create Campaign**
   - [ ] Select group & template
   - [ ] Campaign shows as "Pending"

4. **Start Campaign (Small Test)**
   - [ ] Click "Start" button
   - [ ] Check n8n workflow executes
   - [ ] Messages sent via WAHA
   - [ ] Status updates to "Completed"
   - [ ] Daily counter increments

5. **View Campaign Status**
   - [ ] See Sent/Failed counts
   - [ ] View individual message logs

6. **Daily Limit Warning**
   - [ ] Set limit to 5 messages (for testing)
   - [ ] Send 4 messages
   - [ ] Warning appears at 4/5
   - [ ] Blocked at 5/5

---

## 📊 Database Queries for Testing

### Check Current Data

```sql
-- View all groups with contact counts
SELECT g.*, COUNT(gc.contact_id) as contact_count
FROM groups g
LEFT JOIN group_contacts gc ON gc.group_id = g.id
GROUP BY g.id;

-- View campaign status
SELECT 
  c.name,
  c.status,
  c.sent_count,
  c.total_recipients,
  g.name as group_name,
  t.name as template_name
FROM campaigns c
LEFT JOIN groups g ON g.id = c.group_id
LEFT JOIN templates t ON t.id = c.template_id;

-- Check today's message count
SELECT * FROM daily_message_count WHERE date = CURRENT_DATE;

-- View message logs
SELECT 
  ml.*,
  c.name as campaign_name,
  con.name as contact_name
FROM message_logs ml
LEFT JOIN campaigns c ON c.id = ml.campaign_id
LEFT JOIN contacts con ON con.id = ml.contact_id
ORDER BY ml.created_at DESC;
```

---

## 🚀 Deployment Checklist

### Production Setup

- [ ] Use production Supabase project
- [ ] Enable SSL for n8n (use Cloudflare Tunnel or ngrok)
- [ ] Set appropriate daily limits (100-200/day)
- [ ] Enable Supabase RLS policies
- [ ] Add authentication to frontend
- [ ] Monitor WAHA session status
- [ ] Set up error alerts (email/Slack)
- [ ] Test with small campaigns first
- [ ] Document your WhatsApp number backup plan

---

## 📱 WhatsApp Best Practices

1. **Start Small**: Test with 5-10 messages first
2. **Gradual Increase**: Don't jump from 10 to 1000 messages
3. **Warm Up Number**: New numbers should send <50/day for first week
4. **Vary Content**: Don't send identical messages
5. **Response Handling**: Reply to messages you receive
6. **Business Account**: Consider WhatsApp Business API for higher limits
7. **Backup Number**: Have a backup ready if primary gets banned

---

## 🆘 Troubleshooting

### Frontend Issues

**Groups not loading:**
- Check browser console for errors
- Verify Supabase URL and API key
- Check CORS settings in Supabase

### n8n Workflow Issues

**Workflow not triggering:**
- Test webhook URL with curl
- Check n8n is accessible from internet
- Verify webhook path matches

**Messages not sending:**
- Check WAHA session status
- Verify phone numbers format (+60...)
- Check WAHA logs: `docker logs waha`

### WAHA Issues

**QR code expired:**
```bash
# Restart session
curl -X POST http://localhost:3000/api/sessions/default/stop
curl -X POST http://localhost:3000/api/sessions/default/start
```

**Session disconnected:**
- Check WAHA container is running
- Restart WAHA container
- Re-scan QR code

---

## 📞 Support

If you need help:

1. Check browser console for errors
2. Check n8n execution logs
3. Check WAHA logs
4. Review Supabase logs
5. Test each component individually

---

## 🎉 You're Ready!

You now have:
✅ Complete UI for Groups, Templates & Campaigns
✅ Supabase database schema
✅ n8n automation workflow
✅ WAHA WhatsApp integration
✅ Safety limits and warnings

**Next Steps:**
1. Set up Supabase database
2. Install and configure WAHA
3. Create n8n workflow
4. Connect frontend to backend
5. Test with small campaigns
6. Scale gradually

Good luck with your WhatsApp blast system! 🚀
