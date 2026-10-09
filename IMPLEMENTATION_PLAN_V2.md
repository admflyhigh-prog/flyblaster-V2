# Implementation Plan — Fly Blaster V2 Enhancements (Updated)

This is a **Major Change** to the system. It introduces database schema migrations (join tables, new contact fields), a new security/authentication layer (Supabase Auth), core logic alterations in the n8n blast loops, a new messaging channel (Email), and structural layout modifications for mobile devices.

---

## Proposed Changes

### 1. Mobile Responsiveness (UI & Layout)
We will transition the desktop-first layout into a modern, responsive design using media queries in CSS.

#### [MODIFY] [style-blast.css](file:///Users/rasidmaasom/Downloads/fly-blaster-ui/style-blast.css)
*   Add a mobile navigation bar or a collapsible drawer (hamburger menu) for screen widths under `768px`.
*   Convert the two-column sidebar layout into a single-column layout on smaller screens.
*   Introduce `.table-container` wrapper with `overflow-x: auto` to prevent tables from breaking margins on mobile views.
*   Make all modals and popups full-width slide-up drawers on mobile devices.

#### [MODIFY] [index.html](file:///Users/rasidmaasom/Downloads/fly-blaster-ui/index.html)
*   Add a mobile header bar containing the logo and a sidebar toggle button.

---

### 2. User Authentication (Username & Password)
We will add a secure authentication layer using Supabase Auth.

#### [MODIFY] [app-blast.js](file:///Users/rasidmaasom/Downloads/fly-blaster-ui/app-blast.js)
*   Implement a login screen overlay that displays if no active user session exists.
*   Use `supabaseClient.auth.signInWithPassword()` for user logins and `signOut()` for logouts.
*   Protect all dashboard sync operations so they only run when a user is authenticated.
*   Add a "Log Out" button at the bottom of the sidebar.

---

### 3. Dynamic Sender WAHA Session & Live Limit Settings
We will remove any hardcoded configurations and let n8n detect the session and limit directly from the settings.

#### [DATABASE SETUP] (Supabase SQL)
*   Create a settings table `system_settings` to hold the limits and session configs:
    ```sql
    CREATE TABLE system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    INSERT INTO system_settings (key, value) VALUES ('daily_group_limit', '5'), ('waha_session', 'Tester');
    ```

#### [MODIFY] [app-blast.js](file:///Users/rasidmaasom/Downloads/fly-blaster-ui/app-blast.js)
*   Add **WAHA Session Name** and **Daily Group Limit** inputs inside the Settings page.
*   Query `system_settings` on startup to load these settings dynamically into the frontend UI.
*   Pass the configured session in the start webhook payload sent to n8n when a campaign is launched:
    ```json
    {
      "campaign_id": "...",
      "waha_session": "Tester"
    }
    ```

---

### 4. Group-Based Daily Limits
*   **The Concept**: To prevent account bans, the daily limit can be based on the **number of unique groups** that receive messages today, rather than individual contact numbers.
*   **Database Implementation**:
    *   We will modify the PostgreSQL tracking logic. Instead of logging every single message count, the database check will look at the number of unique `group_id` values sent to today.
    *   The `can_send_messages` check will block execution if the number of unique groups targeted today exceeds the daily settings limit.

---

### 5. Multi-Group Campaign Blasts
We will change the database and frontend models to allow selecting multiple contact groups for a single campaign.

#### [DATABASE SETUP] (Supabase SQL)
*   Create a join table `campaign_groups` in Supabase:
    ```sql
    CREATE TABLE campaign_groups (
      campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
      group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
      PRIMARY KEY (campaign_id, group_id)
    );
    ```

#### [MODIFY] [app-blast.js](file:///Users/rasidmaasom/Downloads/fly-blaster-ui/app-blast.js)
*   Update the **Create Campaign Modal** to render a checklist of all available groups instead of a single dropdown.
*   Update campaign insertion logic to insert a row for each selected group into `campaign_groups`.

---

### 6. Email Blaster Integration
We will add email capabilities alongside the WhatsApp blaster.

#### [DATABASE SETUP] (Supabase SQL)
*   Add an `email` column to the `contacts` table to store email addresses.
*   Add `channel` (`whatsapp` or `email`) columns to the `templates` and `campaigns` tables.

#### [MODIFY] [app-blast.js](file:///Users/rasidmaasom/Downloads/fly-blaster-ui/app-blast.js)
*   Add a **Channel Selection** (WhatsApp / Email) in the Template and Campaign creation modals.
*   Render email templates with dedicated Subject fields.
*   Update the Contacts view to support adding/importing email addresses from CSV.

---

## Required n8n Workflow Changes

You will need to adjust the following nodes in your n8n workflow canvas:

### 1. `Check Daily Limit` Node (PostgreSQL Query)
Update the SQL query to check the limit using your dynamic settings table:
```sql
SELECT * FROM can_send_groups(
  (SELECT value::integer FROM system_settings WHERE key = 'daily_group_limit')
);
```

### 2. `Get Campaign & Recipients` Node (PostgreSQL Query)
Update the query to join through the new `campaign_groups` table so it aggregates contacts from multiple groups:
```sql
SELECT DISTINCT 
  camp.name AS campaign_name,
  camp.channel, -- whatsapp or email
  t.name AS template_name,
  t.message_text,
  t.media_url,
  t.media_type,
  t.email_subject, -- email subject if channel is email
  rec.name AS recipient_name,
  rec.phone AS recipient_phone,
  rec.email AS recipient_email, -- email address
  camp.id AS campaign_id,
  rec.id AS contact_id
FROM campaigns camp
JOIN templates t ON camp.template_id = t.id
JOIN campaign_groups cg ON camp.id = cg.campaign_id
JOIN group_contacts gc ON cg.group_id = gc.group_id
JOIN contacts rec ON gc.contact_id = rec.id
WHERE camp.id = '{{ $('start-campaign').first().json.campaign_id }}';
```

### 3. WhatsApp Nodes (`WAHA Send Text` and `HTTP Request` Send Image)
Update the **`Session`** input box in both nodes to use the dynamic session name passed from the frontend:
*   **Session**: `{{ $('start-campaign').first().json.waha_session }}`

### 4. Add a `Channel Router` Node (Switch Node)
1. Add a **`Switch`** node in n8n immediately after the `Get Campaign & Recipients` node.
2. Route based on the campaign channel:
   *   **Path 1 (WhatsApp)**: Connect to your existing `Loop Contacts` node.
   *   **Path 2 (Email)**: Connect to a new `Loop Emails` node.
3. In the Email path, add an email node (e.g. Gmail, SMTP, or Resend) to send messages using:
   *   **To**: `{{ $json.recipient_email }}`
   *   **Subject**: `{{ $json.email_subject }}`
   *   **Body**: `{{ $json.message_text }}`

---

## Verification Plan

### Automated Tests
*   Verify frontend authentication state persistence on page reloads.
*   Run database queries to verify contact lists are correctly aggregated from multiple groups.
*   Test email delivery routing inside the n8n workflow interface.

### Manual Verification
*   Test responsive layouts on simulated mobile viewports (Chrome DevTools).
*   Verify group-based daily limits block campaign launch once the unique group limit is reached.
