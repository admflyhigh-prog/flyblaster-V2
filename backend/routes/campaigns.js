/* Campaign engine — replaces the n8n workflow:
   Webhook start -> check limit -> set sending -> loop recipients ->
   send via WAHA (text/image) -> log -> increment counter -> throttle -> complete
   Supports "only prior interactions" filter (new feature).
*/
const { Router } = require('express');
const { app, pool, wahaRequest, cleanPhone, phoneToJid, authRequired } = require('../server');

const router = Router();
router.use(authRequired);

// A tiny in-process queue to run one campaign at a time (avoids overlapping sends)
let running = false;
const queue = [];

/* ================= Campaign execution ================= */
// POST /api/campaigns/:id/start  ->  triggers the send engine (async; returns immediately)
router.post('/campaigns/:id/start', async (req, res) => {
  try {
    const { waha_session, is_test, test_phone } = req.body || {};
    queue.push({ campaignId: Number(req.params.id), waha_session, is_test, test_phone });
    res.json({ ok: true, message: 'Campaign queued for sending' });
    processQueue();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function processQueue() {
  if (running || queue.length === 0) return;
  running = true;
  const job = queue.shift();
  try {
    await runCampaign(job);
  } catch (e) {
    console.error('Campaign run failed:', e);
  } finally {
    running = false;
    if (queue.length > 0) processQueue();
  }
}

async function runCampaign({ campaignId, waha_session, is_test, test_phone }) {
  const session = waha_session || (await getSetting('waha_session')) || 'Tester';

  // 1. Load campaign + template
  const [campRows] = await pool.query(
    `SELECT c.*, t.message_text, t.media_url, t.media_type, t.channel AS template_channel
     FROM campaigns c JOIN templates t ON c.template_id = t.id WHERE c.id = ?`, [campaignId]);
  if (campRows.length === 0) throw new Error('Campaign not found');
  const camp = campRows[0];

  // 2. Daily limit check (groups sent today < limit)
  const limit = parseInt(await getSetting('daily_group_limit') || '5', 10);
  const [limitRows] = await pool.query(
    `SELECT COUNT(DISTINCT cg.group_id) AS sent_today
     FROM campaigns c
     JOIN campaign_groups cg ON c.id = cg.campaign_id
     WHERE DATE(c.started_at) = CURDATE() AND c.status IN ('sending','completed')`
  );
  const sentToday = limitRows[0].sent_today || 0;
  if (sentToday >= limit) {
    await pool.query('UPDATE campaigns SET status = ? WHERE id = ?', ['failed', campaignId]);
    console.log(`[campaign ${campaignId}] Daily limit reached (${sentToday}/${limit}), marked failed.`);
    return;
  }

  // 3. Set status to sending
  await pool.query('UPDATE campaigns SET status = ?, started_at = NOW() WHERE id = ?', ['sending', campaignId]);

  // 4. Gather recipients (optionally only those with prior interactions)
  const onlyInteractions = !!camp.only_interactions;
  const [recipientRows] = await pool.query(
    `SELECT DISTINCT c.id AS contact_id, c.name, c.phone
     FROM campaign_groups cg
     JOIN group_contacts gc ON cg.group_id = gc.group_id
     JOIN contacts c ON gc.contact_id = c.id
     WHERE cg.campaign_id = ?`, [campaignId]
  );

  let recipients = recipientRows;
  if (onlyInteractions) {
    const filtered = [];
    for (const r of recipients) {
      const [inter] = await pool.query('SELECT id FROM contact_interactions WHERE phone = ? LIMIT 1', [cleanPhone(r.phone)]);
      if (inter.length > 0) filtered.push(r);
    }
    recipients = filtered;
  }

  // Test mode: only send to the test phone
  if (is_test && test_phone) {
    const tp = cleanPhone(test_phone);
    recipients = recipients.filter(r => cleanPhone(r.phone) === tp);
  }

  // 5. Loop & send
  let sentCount = 0, failedCount = 0;
  for (const r of recipients) {
    const chatId = phoneToJid(r.phone);
    try {
      const hasMedia = !!(camp.media_url && camp.media_url.trim());
      if (hasMedia) {
        await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/sendImage`, {
          method: 'POST',
          body: { chatId, file: camp.media_url, caption: camp.message_text }
        });
      } else {
        await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/sendText`, {
          method: 'POST',
          body: { chatId, text: camp.message_text }
        });
      }
      await pool.query(
        'INSERT INTO message_logs (campaign_id, contact_id, phone, contact_name, channel, status, sent_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [campaignId, r.contact_id, r.phone, r.name || '', camp.channel || 'whatsapp', 'sent']
      );
      sentCount++;
    } catch (e) {
      await pool.query(
        'INSERT INTO message_logs (campaign_id, contact_id, phone, contact_name, channel, status, error) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [campaignId, r.contact_id, r.phone, r.name || '', camp.channel || 'whatsapp', 'failed', e.message]
      );
      failedCount++;
    }

    // throttle
    const delay = Math.max(1, camp.delay_seconds || 15) * 1000;
    await sleep(delay);
  }

  // 6. Increment daily counter
  await pool.query(
    `INSERT INTO daily_message_count (stat_date, message_count, last_message_at)
     VALUES (CURDATE(), ?, NOW())
     ON DUPLICATE KEY UPDATE message_count = message_count + ?, last_message_at = NOW()`,
    [sentCount, sentCount]
  );

  // 7. Mark completed
  await pool.query(
    `UPDATE campaigns SET status = ?, completed_at = NOW(),
       sent_count = ?, failed_count = ?, total_recipients = ?
     WHERE id = ?`,
    ['completed', sentCount, failedCount, recipients.length, campaignId]
  );
  console.log(`[campaign ${campaignId}] done. sent=${sentCount} failed=${failedCount} of ${recipients.length}`);
}

/* ================= Helpers ================= */
async function getSetting(key) {
  const [rows] = await pool.query('SELECT setting_value FROM system_settings WHERE setting_key = ?', [key]);
  return rows.length ? rows[0].setting_value : null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

app.use('/api', router);
