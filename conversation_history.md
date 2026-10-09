# Fly Blaster V2.0 — Complete Migration, Conversation, & Code Integration History

This file documents the complete roadmap, user requests, codebase enhancements, database migrations, and n8n workflow structures developed for **Fly Blaster V2.0**.

---

## 🔀 Section 1: Version Comparison (V1 vs. V2)

| Feature | Version 1.0 (Legacy State) | Version 2.0 (Enhanced State) |
| :--- | :--- | :--- |
| **Authentication** | None (Publicly open frontend dashboard) | **Supabase Auth** (Glassmorphic login overlay, secure session handling, Logout button) |
| **Campaign Targets** | Single Group selection (`group_id` column in `campaigns`) | **Multi-Group Selection** (Select multiple target groups, saved in `campaign_groups` join table) |
| **Channels Supported** | WhatsApp Only | **WhatsApp & Email** (Custom selectors, layout badges, live email previews, conditional loops) |
| **Sender Session** | Hardcoded WAHA Session name ("Suffian Flyhigh" / "Tester") | **Dynamic settings-configured session name** (`waha_session` pulled from database settings) |
| **Safety Limits** | Hardcoded limit inside n8n workflow (e.g. 50/100 messages) | **Dynamic system settings limit** based on number of groups targetable per day (`can_send_groups()`) |
| **Responsiveness** | Desktop-focused layout (table overflow/shrinkage) | **Mobile Optimized** (Horizontal scrolling tables, off-canvas sliding sidebar, card-based modals) |

---

## 💾 Section 2: Database Schema & Supabase Setup (PostgreSQL)

We executed the following SQL commands to align the Supabase database with the new V2.0 features:

### 2.1 Mappings for Multi-Group Campaigns
```sql
-- Create a join table linking a campaign to multiple groups
CREATE TABLE campaign_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, group_id)
);
```

### 2.2 System Configurations & Limit Settings
```sql
-- Table to store key-value configurations like limits and session names
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial configuration settings
INSERT INTO system_settings (key, value) VALUES 
('daily_group_limit', '5'),
('waha_session', 'Suffian Flyhigh');
```

### 2.3 Quota Checking Functions
```sql
-- Enforce dynamic limits based on the number of groups processed per day
CREATE OR REPLACE FUNCTION can_send_groups()
RETURNS TABLE (can_send BOOLEAN, groups_count INTEGER, max_limit INTEGER) AS $$
DECLARE
  daily_limit INTEGER;
  sent_today INTEGER;
BEGIN
  -- Fetch the limit from settings (defaults to 5 if missing)
  SELECT COALESCE(value::INTEGER, 5) INTO daily_limit 
  FROM system_settings 
  WHERE key = 'daily_group_limit';

  -- Count campaigns that started sending today
  SELECT COUNT(DISTINCT cg.group_id)::INTEGER INTO sent_today
  FROM campaigns c
  JOIN campaign_groups cg ON c.id = cg.campaign_id
  WHERE c.started_at::DATE = CURRENT_DATE 
    AND c.status IN ('sending', 'completed');

  RETURN QUERY SELECT (sent_today < daily_limit), sent_today, daily_limit;
END;
$$ LANGUAGE plpgsql;
```

---

## 💻 Section 3: Detailed Frontend Code Enhancements

### 3.1 Custom Multi-Select Dropdown Picker (`app-blast.js`)
Replaced the plain checkboxes list with a premium custom multi-select selector:
- Clicking `#group-select-trigger` toggles `#group-select-dropdown`.
- Selected groups are rendered inside the input box as **chips/badges** with an `(x)` remove button.
- Cleaned up global click handlers to auto-close the dropdown when clicking outside.

### 3.2 List Filters & Badges (`app-blast.js` & `style-blast.css`)
- Added tabs at the top of the **Templates** and **Campaigns** lists: **All**, **WhatsApp**, and **Email**.
- Re-styled channel badges to show a sleek, compact, mixed-case bordered pill design (`WhatsApp` vs `Email`) placed directly below the name row.

### 3.3 Supabase Authentication listener
- Placed a dark-theme glassmorphism card covering the layout when no Supabase Auth session is active.
- Added a `Logout` button at the bottom of the navigation sidebar.

---

## ⚙️ Section 4: n8n Workflow Configurations

### 4.1 "Check Daily Limit" postgres Node
- **Old SQL Query**: `SELECT * FROM can_send_messages(50);`
- **New SQL Query**: `SELECT * FROM can_send_groups();`

### 4.2 "Get Campaign & Recipients" postgres Node
Updated to joins campaign groups, templates, and contact email fields:
```sql
SELECT DISTINCT 
  camp.name AS campaign_name,
  camp.channel AS campaign_channel,
  t.message_text,
  t.email_subject,
  t.media_url,
  t.media_type,
  rec.name AS recipient_name,
  rec.phone AS recipient_phone,
  rec.email AS recipient_email,
  camp.id AS campaign_id,
  rec.id AS contact_id
FROM campaigns camp
JOIN templates t ON camp.template_id = t.id
JOIN campaign_groups cg ON camp.id = cg.campaign_id
JOIN group_contacts gc ON cg.group_id = gc.group_id
JOIN contacts rec ON gc.contact_id = rec.id
WHERE camp.id = '{{ $('start-campaign').item.json.body.campaign_id }}';
```

### 4.3 Webhook dynamic session changes
Updated WAHA session mapping from a hardcoded string to the dynamic webhook body payload value:
```javascript
{{ $('start-campaign').first().json.body.waha_session }}
```

---

## 💬 Section 5: Chronological Requests Transcript

1. **Request**: Make app mobile responsive, add username/password login, make WAHA sessions dynamic, add email blaster, support multi-group campaign targets.
   - *Implementation*: Added Supabase auth overlay, restructured layout nodes, updated database migrations.
2. **Request**: How to test without public sign-up?
   - *Implementation*: Explained Supabase Auth console user provisioning protocol to restrict public access.
3. **Request**: Guide me step-by-step to fix n8n nodes.
   - *Implementation*: Provided the exact variable syntax mapping rules and resolved the double-equals (`==`) parser glitches.
4. **Request**: Change campaigns groups checklist to a dropdown list with selected items badges/chips.
   - *Implementation*: Built the custom clientside tag selector.
5. **Request**: Add channel filtering views to both campaigns and templates.
   - *Implementation*: Added the clean top filter tab bars.
6. **Request**: Tweak name sizes and place channel badge under campaign names.
   - *Implementation*: Repositioned badges below campaign name.
