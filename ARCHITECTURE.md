# Fly Blaster - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (Browser)                      │
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Groups  │  │Templates │  │Campaigns │  │  Campaign Status  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │             │              │                  │              │
└───────┼─────────────┼──────────────┼──────────────────┼──────────────┘
        │             │              │                  │
        └─────────────┴──────────────┴──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │    SUPABASE       │
                    │    (Database)     │
                    │                   │
                    │  • contacts       │
                    │  • groups         │
                    │  • templates      │
                    │  • campaigns      │
                    │  • message_logs   │
                    │  • daily_counter  │
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │     n8n           │
                    │  (Automation)     │
                    │                   │
                    │  [Webhook]        │
                    │       ↓           │
                    │  [Check Limit]    │
                    │       ↓           │
                    │  [Get Campaign]   │
                    │       ↓           │
                    │  [Loop Contacts]  │
                    │       ↓           │
                    │  [Send via WAHA]  │
                    │       ↓           │
                    │  [Update Status]  │
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │      WAHA         │
                    │  (WhatsApp API)   │
                    │                   │
                    │  • QR Scanner     │
                    │  • Send Messages  │
                    │  • Send Media     │
                    │  • Get Status     │
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │    WhatsApp       │
                    │   (Recipients)    │
                    │                   │
                    └───────────────────┘
```

## Data Flow

### Flow 1: Create Group

```
User Action: Create "SPM Parents 2026"
    ↓
Frontend: Submit form
    ↓
Supabase: INSERT INTO groups (name)
    ↓
Supabase: INSERT INTO contacts (name, phone)
    ↓
Supabase: INSERT INTO group_contacts (group_id, contact_id)
    ↓
Frontend: Refresh groups list
```

### Flow 2: Create Template

```
User Action: Create "Exam Reminder" template
    ↓
Frontend: Submit form (with optional media URL)
    ↓
Supabase: INSERT INTO templates (name, message_text, media_url)
    ↓
Frontend: Refresh templates list
```

### Flow 3: Create Campaign

```
User Action: Create campaign
    ↓
Frontend: Select group + template
    ↓
Supabase: INSERT INTO campaigns (name, group_id, template_id, status='pending')
    ↓
Frontend: Campaign appears with "Pending" status
```

### Flow 4: Start Campaign (Main Blast Flow)

```
User Action: Click "Start Campaign" button
    ↓
Frontend: POST to n8n webhook
    {
      "campaign_id": "uuid-here"
    }
    ↓
┌─────────────────────────────────────────────────────────┐
│                    n8n WORKFLOW                         │
│                                                         │
│  1. Check Daily Limit (Supabase)                       │
│     SELECT * FROM can_send_messages(100)               │
│        ↓                                                │
│     [IF limit reached]                                 │
│        → STOP & Send Alert                             │
│        → Return error to user                          │
│                                                         │
│  2. Get Campaign Data (Supabase)                       │
│     SELECT campaigns, templates, groups                │
│        ↓                                                │
│  3. Get Recipients (Supabase)                          │
│     SELECT * FROM get_campaign_recipients(uuid)        │
│        Returns: [{name, phone}, {name, phone}, ...]    │
│        ↓                                                │
│  4. Update Campaign Status (Supabase)                  │
│     UPDATE campaigns SET status='sending'              │
│        ↓                                                │
│  5. Create Message Logs (Supabase)                     │
│     INSERT INTO message_logs                           │
│     (campaign_id, contact_id, phone, status='pending') │
│        ↓                                                │
│  6. LOOP: For Each Contact                             │
│     │                                                   │
│     ├─► Check limit again (in loop)                    │
│     │   IF reached → STOP                              │
│     │                                                   │
│     ├─► Format phone: "+60123456789" → "+60123..."    │
│     │                                                   │
│     ├─► Send via WAHA                                  │
│     │   POST http://waha:3000/api/sendText            │
│     │   {                                              │
│     │     "session": "default",                        │
│     │     "chatId": "+60123456789@c.us",              │
│     │     "text": "Hello..."                          │
│     │   }                                              │
│     │      ↓                                           │
│     │   [Success]                                      │
│     │      ├─► Update message_logs: status='sent'     │
│     │      └─► Increment daily_message_count          │
│     │                                                   │
│     │   [Error]                                        │
│     │      └─► Update message_logs: status='failed'   │
│     │                                                   │
│     └─► Wait 2-3 seconds (anti-ban delay)             │
│                                                         │
│  7. Update Campaign Stats (Supabase)                   │
│     UPDATE campaigns SET                               │
│       sent_count = (SELECT COUNT(...) WHERE sent),     │
│       failed_count = (SELECT COUNT(...) WHERE failed)  │
│        ↓                                                │
│  8. Mark Complete (Supabase)                           │
│     UPDATE campaigns SET status='completed'            │
│                                                         │
└─────────────────────────────────────────────────────────┘
    ↓
Frontend: Poll or subscribe to updates
    ↓
Frontend: Show final status
```

### Flow 5: View Campaign Status

```
User Action: Click "View" on campaign
    ↓
Frontend: Navigate to campaign detail page
    ↓
Supabase: SELECT * FROM message_logs WHERE campaign_id=?
    ↓
Frontend: Display table with:
    • Contact name
    • Phone number
    • Status (Pending/Sent/Failed)
    • Sent timestamp
    ↓
[Optional] Real-time updates via Supabase Realtime
```

## Safety Mechanism

### Daily Limit Protection

```
┌─────────────────────────────────────────┐
│         EVERY MESSAGE SEND              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ Check Daily Limit  │
        │ (Supabase Function)│
        └─────────┬──────────┘
                  │
         ┌────────▼─────────┐
         │  messages_sent   │
         │  < 100?          │
         └────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
     [YES]               [NO]
        │                   │
        ▼                   ▼
   ┌─────────┐        ┌──────────┐
   │  SEND   │        │   STOP   │
   │ MESSAGE │        │ & ALERT  │
   └────┬────┘        └──────────┘
        │
        ▼
   ┌─────────────────┐
   │  INCREMENT      │
   │  daily_counter  │
   └─────────────────┘
```

### Warning System

```
Messages Sent Today: X / 100

┌────────────────────────────────────────┐
│  0-79 messages: ✅ Safe to send        │
│  Display: "X/100 messages sent"        │
│  Status: Normal (green)                │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  80-99 messages: ⚠️ Warning            │
│  Display: "Warning: X/100 messages"    │
│  Status: Warning banner (orange)       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  100+ messages: 🛑 Limit Reached        │
│  Display: "Daily limit reached!"       │
│  Status: Danger banner (red)           │
│  Action: Block new campaigns           │
└────────────────────────────────────────┘
```

## Component Interaction Matrix

```
┌──────────┬───────────┬──────────┬───────────┬─────────┐
│          │ Supabase  │   n8n    │   WAHA    │ Frontend│
├──────────┼───────────┼──────────┼───────────┼─────────┤
│ Supabase │     -     │  READ    │     -     │  R/W    │
│ n8n      │   R/W     │    -     │  TRIGGER  │  HOOK   │
│ WAHA     │     -     │  CALL    │     -     │    -    │
│ Frontend │   R/W     │ TRIGGER  │     -     │    -    │
└──────────┴───────────┴──────────┴───────────┴─────────┘

Legend:
R/W = Read & Write
READ = Read Only
TRIGGER = Triggers action
CALL = Makes API calls
HOOK = Webhook endpoint
```

## Technology Stack

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                       │
│                                                 │
│  • HTML5 + CSS3 (No framework)                 │
│  • Vanilla JavaScript                          │
│  • Inter Font (Google Fonts)                   │
│  • Local Storage (for demo/testing)            │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│                 DATABASE                        │
│                                                 │
│  • PostgreSQL (Supabase)                       │
│  • Row Level Security (RLS)                    │
│  • PL/pgSQL Functions                          │
│  • Realtime subscriptions (optional)           │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│               AUTOMATION                        │
│                                                 │
│  • n8n (Self-hosted or Cloud)                  │
│  • Workflow automation                         │
│  • Webhook triggers                            │
│  • Error handling & retries                    │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│             WHATSAPP API                        │
│                                                 │
│  • WAHA (Docker container)                     │
│  • HTTP API                                    │
│  • QR Code authentication                      │
│  • Media support (images/docs)                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development Setup

```
┌──────────────────────────────────────────────┐
│           Local Machine (MacOS)              │
│                                              │
│  ┌────────────┐  ┌────────────┐            │
│  │  Frontend  │  │   WAHA     │            │
│  │ (Browser)  │  │ (Docker)   │            │
│  │ :file://   │  │ :3000      │            │
│  └─────┬──────┘  └──────┬─────┘            │
│        │                │                   │
│        └────────┬───────┘                   │
│                 │                           │
└─────────────────┼───────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐  ┌────────▼────────┐
│   Supabase     │  │      n8n        │
│   (Cloud)      │  │   (Docker)      │
│   :443         │  │   :5678         │
└────────────────┘  └─────────────────┘
```

### Production Setup

```
┌──────────────────────────────────────────────┐
│              Internet Users                  │
└─────────────────┬────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │   Cloudflare CDN   │
        │   (SSL + Cache)    │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │   Your VPS/Server  │
        │                    │
        │  ┌──────────────┐  │
        │  │  Frontend    │  │
        │  │  (Static)    │  │
        │  └──────────────┘  │
        │                    │
        │  ┌──────────────┐  │
        │  │    WAHA      │  │
        │  │  (Docker)    │  │
        │  └──────────────┘  │
        │                    │
        │  ┌──────────────┐  │
        │  │     n8n      │  │
        │  │  (Docker)    │  │
        │  └──────────────┘  │
        │                    │
        └────────┬───────────┘
                 │
        ┌────────▼───────────┐
        │    Supabase        │
        │    (Managed)       │
        └────────────────────┘
```

## Security Considerations

### 1. API Keys Protection

```
Frontend → Environment Variables
- SUPABASE_URL (public)
- SUPABASE_ANON_KEY (public, row-level security enforced)

n8n → Credentials Manager
- SUPABASE_SERVICE_KEY (private, full access)
- WAHA_API_URL (private, internal network only)
```

### 2. Authentication Flow

```
User Login
    ↓
Supabase Auth (email/password or OAuth)
    ↓
JWT Token issued
    ↓
Token included in all API requests
    ↓
Row Level Security validates token
    ↓
Access granted to user's own data
```

### 3. Rate Limiting Layers

```
Layer 1: Application Level (Daily Counter)
    ↓
Layer 2: n8n Workflow (Check before each send)
    ↓
Layer 3: WAHA (Built-in WhatsApp limits)
    ↓
Layer 4: WhatsApp Server (External limits)
```

## Monitoring & Logging

### What to Monitor

```
1. Campaign Status
   - Pending count
   - Sending progress
   - Completion rate
   - Failure rate

2. Daily Limits
   - Messages sent today
   - Remaining quota
   - Approaching threshold

3. System Health
   - WAHA session status
   - n8n workflow errors
   - Database performance
   - API response times

4. User Activity
   - Campaigns created
   - Templates used
   - Groups modified
```

### Logging Strategy

```
Supabase (Database Logs)
├─ message_logs table (every message sent)
├─ campaigns table (campaign lifecycle)
└─ daily_message_count (daily quotas)

n8n (Workflow Logs)
├─ Execution history
├─ Error stack traces
└─ Performance metrics

WAHA (WhatsApp Logs)
├─ Session status changes
├─ Message delivery status
└─ API call logs
```

## Scaling Considerations

### Horizontal Scaling

```
Current: 1 WAHA instance = 1 WhatsApp number
    ↓
Scale: Multiple WAHA instances = Multiple numbers

┌─────────────┐
│    n8n      │
│  Workflow   │
└──────┬──────┘
       │
  ┌────┴────┐
  │         │
  ▼         ▼
┌────┐   ┌────┐
│WAHA│   │WAHA│
│ #1 │   │ #2 │
└────┘   └────┘
  │         │
  ▼         ▼
[Number1] [Number2]

Strategy:
- Round-robin message distribution
- Session-specific campaigns
- Load balancing across instances
```

### Vertical Scaling

```
Database: Supabase auto-scales
n8n: Increase worker threads
WAHA: More resources per container
```

---

This architecture is designed to be:
- ✅ Simple to understand
- ✅ Easy to deploy
- ✅ Safe with built-in limits
- ✅ Scalable when needed
- ✅ Cost-effective for small to medium use
