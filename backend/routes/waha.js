/* WAHA integration routes — new features:
   - Session QR scan (scan sender in Fly Blaster settings, not WAHA directly)
   - Import WhatsApp group chat (members) into a Fly Blaster group
   - Detect prior interactions (received/replied) for individual + group chats
*/
const { Router } = require('express');
const { app, pool, wahaRequest, cleanPhone, phoneToJid, normalizeJidToPhone, authRequired } = require('../server');

const router = Router();
router.use(authRequired);

/* ================= Senders (session management, like WAHA list) ================= */

// GET /api/senders  ->  list all saved sender sessions (with live status)
router.get('/senders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM senders ORDER BY is_default DESC, name ASC');
    const out = [];
    for (const s of rows) {
      let connected = false, phone = s.phone || null, error = null;
      try {
        const info = await wahaRequest(`/api/sessions/${encodeURIComponent(s.waha_session)}/status`);
        connected = !!(info && (info.status === 'WORKING' || info.connected));
        if (!phone && info && (info.me?.id || info.user?.id)) {
          phone = normalizeJidToPhone(info.me?.id || info.user?.id);
        }
      } catch (e) {
        error = e.message;
      }
      out.push({
        id: s.id,
        name: s.name,
        wahaSession: s.waha_session,
        phone,
        isDefault: !!s.is_default,
        connected,
        error,
        created: s.created_at,
        updated: s.updated_at
      });
    }
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/senders  { name, wahaSession? }  ->  save a new sender (session name = name if not given)
router.post('/senders', async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Sender name is required' });
    const session = (req.body.wahaSession || '').trim() || name;
    const [existing] = await pool.query('SELECT id FROM senders WHERE waha_session = ?', [session]);
    if (existing.length > 0) return res.status(400).json({ error: 'A sender with this session name already exists' });
    const [result] = await pool.query(
      'INSERT INTO senders (name, waha_session) VALUES (?, ?)',
      [name, session]
    );
    res.json({ id: result.insertId, name, wahaSession: session });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/senders/:id  ->  update (e.g. mark as default, update phone)
router.patch('/senders/:id', async (req, res) => {
  try {
    const { name, wahaSession, phone, isDefault } = req.body || {};
    const sets = [];
    const vals = [];
    if (name !== undefined) { sets.push('name = ?'); vals.push(String(name).trim()); }
    if (wahaSession !== undefined) { sets.push('waha_session = ?'); vals.push(String(wahaSession).trim()); }
    if (phone !== undefined) { sets.push('phone = ?'); vals.push(phone || null); }
    if (isDefault !== undefined) { sets.push('is_default = ?'); vals.push(isDefault ? 1 : 0); }
    if (sets.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    if (isDefault) {
      await pool.query('UPDATE senders SET is_default = 0');
    }
    vals.push(req.params.id);
    await pool.query(`UPDATE senders SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/senders/:id  ->  remove a sender (and log it out on WAHA if possible)
router.delete('/senders/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM senders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Sender not found' });
    const s = rows[0];
    try { await wahaRequest(`/api/sessions/${encodeURIComponent(s.waha_session)}/logout`, { method: 'POST' }); } catch (_) {}
    await pool.query('DELETE FROM senders WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= Session / QR (per sender) ================= */
// GET /api/senders/:id/qr-image  ->  QR data URL for a specific sender session
router.get('/senders/:id/qr-image', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM senders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Sender not found' });
    const session = rows[0].waha_session;

    // Start session (short timeout so it doesn't buffer)
    try { await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/start`, { method: 'POST', timeout: 8000 }); } catch (_) {}

    const qr = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/qr`, { timeout: 8000 });
    if (!qr) return res.status(404).json({ error: 'No QR available yet — keep this open, it refreshes' });
    const b64 = qr.qr || qr.base64 || qr.image || (typeof qr === 'string' ? qr : null);
    if (!b64) return res.status(404).json({ error: 'No QR data yet' });
    const dataUrl = b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`;
    res.json({ senderId: rows[0].id, session, qr: dataUrl });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get QR: ' + e.message });
  }
});

// GET /api/senders/:id/status  ->  live status for a specific sender
router.get('/senders/:id/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM senders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Sender not found' });
    const s = rows[0];
    let connected = false, phone = s.phone || null, error = null;
    try {
      const info = await wahaRequest(`/api/sessions/${encodeURIComponent(s.waha_session)}/status`, { timeout: 8000 });
      connected = !!(info && (info.status === 'WORKING' || info.connected));
      if (!phone && info && (info.me?.id || info.user?.id)) phone = normalizeJidToPhone(info.me?.id || info.user?.id);
    } catch (e) { error = e.message; }
    res.json({ id: s.id, name: s.name, session: s.waha_session, connected, phone, error });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/waha/session/status  ->  { connected, session, qr? } (default/active sender)
router.get('/waha/session/status', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';

    let status = { connected: false, session, error: null };
    try {
      const info = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/status`, { timeout: 8000 });
      status.connected = !!(info && (info.status === 'WORKING' || info.connected));
      status.raw = info;
    } catch (e) {
      status.error = e.message;
    }
    res.json(status);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/waha/session/qr  ->  starts session & returns QR (base64) so it can be shown in Settings
router.get('/waha/session/qr', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';

    // Ensure session is starting
    try { await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/start`, { method: 'POST', timeout: 8000 }); } catch (_) {}

    // Fetch the QR
    const qr = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/qr`, { timeout: 8000 });
    res.json({ session, qr: qr ? (qr.qr || qr.base64 || qr.image || qr) : null, raw: qr });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get QR: ' + e.message });
  }
});

// GET /api/waha/session/qr-image  ->  QR as data URL (base64 PNG), for direct <img src>
router.get('/waha/session/qr-image', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';
    try { await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/start`, { method: 'POST', timeout: 8000 }); } catch (_) {}
    const qr = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/qr`, { timeout: 8000 });
    if (!qr) return res.status(404).json({ error: 'No QR available yet' });
    // WAHA returns base64 or raw png
    const b64 = qr.qr || qr.base64 || qr.image || (typeof qr === 'string' ? qr : null);
    if (!b64) return res.status(404).json({ error: 'No QR data' });
    const dataUrl = b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`;
    res.json({ session, qr: dataUrl });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get QR: ' + e.message });
  }
});

// POST /api/waha/session/logout  ->  disconnect the sender session
router.post('/waha/session/logout', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';
    await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/logout`, { method: 'POST', timeout: 8000 });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= Group import (Feature A) ================= */
// GET /api/waha/groups  ->  list WhatsApp groups available on the session
router.get('/waha/groups', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';
    const groups = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/groups`);
    const list = (Array.isArray(groups) ? groups : []).map(g => ({
      id: g.id, name: g.name || g.id, participants: (g.participants || []).length
    }));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list WAHA groups: ' + e.message });
  }
});

// GET /api/waha/groups/:id  ->  details + participants of a specific WAHA group
router.get('/waha/groups/:id', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';
    const group = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/groups/${encodeURIComponent(req.params.id)}`);
    const participants = (group.participants || []).map(p => ({
      jid: p.id || p.jid || null,
      name: p.name || p.pushName || '',
      phone: normalizeJidToPhone(p.id || p.jid)
    })).filter(p => p.phone);
    res.json({ id: group.id, name: group.name || group.id, participants });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load group: ' + e.message });
  }
});

// POST /api/waha/groups/import  { wahaGroupId, targetGroupName? }
// Creates a Fly Blaster group from a WAHA group's members (dedup by phone).
router.post('/waha/groups/import', async (req, res) => {
  try {
    const { wahaGroupId, targetGroupName } = req.body || {};
    if (!wahaGroupId) return res.status(400).json({ error: 'wahaGroupId is required' });

    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';

    const group = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/groups/${encodeURIComponent(wahaGroupId)}`);
    const participants = (group.participants || [])
      .map(p => ({ jid: p.id || p.jid, name: p.name || p.pushName || '', phone: normalizeJidToPhone(p.id || p.jid) }))
      .filter(p => p.phone);

    if (participants.length === 0) return res.status(400).json({ error: 'No participants with phone numbers found in this group' });

    const groupName = (targetGroupName || group.name || group.id || '').trim() || 'Imported Group';

    // Create group (with waha_jid uniqueness)
    const [existing] = await pool.query('SELECT id FROM `groups` WHERE waha_jid = ?', [String(wahaGroupId)]);
    let groupId;
    if (existing.length > 0) {
      groupId = existing[0].id;
    } else {
      const [result] = await pool.query(
        'INSERT INTO `groups` (name, waha_jid, is_imported) VALUES (?, ?, 1)',
        [groupName, String(wahaGroupId)]
      );
      groupId = result.insertId;
    }

    // Insert participants (dedup by phone, skip if already in group)
    let added = 0, skipped = 0;
    const seen = new Set();
    for (const p of participants) {
      if (seen.has(p.phone)) { skipped++; continue; }
      seen.add(p.phone);
      const [existingC] = await pool.query('SELECT id FROM contacts WHERE phone = ?', [p.phone]);
      let contactId;
      if (existingC.length > 0) {
        contactId = existingC[0].id;
        await pool.query('UPDATE contacts SET name = ? WHERE name = "" AND ? != ""', [p.name, p.name]);
      } else {
        const [result] = await pool.query('INSERT INTO contacts (name, phone) VALUES (?, ?)', [p.name || 'No Name', p.phone]);
        contactId = result.insertId;
      }
      const [link] = await pool.query('INSERT IGNORE INTO group_contacts (group_id, contact_id) VALUES (?, ?)', [groupId, contactId]);
      if (link.affectedRows > 0) added++; else skipped++;
    }

    res.json({ ok: true, groupId, groupName, total: participants.length, added, skipped });
  } catch (e) {
    console.error('group import error:', e);
    res.status(500).json({ error: 'Import failed: ' + e.message });
  }
});

/* ================= Prior interaction detection (Feature B) ================= */
// GET /api/waha/interactions/scan  ->  scan chats for numbers with prior interaction
// Detects: individual chats we received from / replied to, and group chats we participated in.
router.post('/waha/interactions/scan', async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'waha_session'");
    const session = settings.length ? settings[0].setting_value : 'Tester';

    // 1. Get all chats
    const chats = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/chats`);
    if (!Array.isArray(chats)) throw new Error('Unexpected chats response');

    const ownPhone = await getOwnNumber(session);
    let detected = 0, groups = 0, individuals = 0;

    // Use a transaction-ish approach: clear + rebuild interaction records for this scan
    // (We only store new detections; existing records are kept.)

    for (const chat of chats) {
      const chatId = chat.id || chat.jid || '';
      const isGroup = chatId.endsWith('@g.us');

      // Fetch recent messages for this chat
      let messages = [];
      try {
        messages = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/chats/${encodeURIComponent(chatId)}/messages?limit=50`);
        if (!Array.isArray(messages)) messages = [];
      } catch (_) { /* skip chats we can't read */ }

      for (const msg of messages) {
        const from = msg.from || msg.chatId || msg.id || '';
        const to = msg.to || '';
        const own = ownPhone ? ownPhone.replace(/\D/g, '') : null;

        // Determine the counterpart phone for the blast list:
        // - For 1:1 chats, the counterpart is the chat itself.
        // - For group chats, counterpart is the message sender.
        let counterpart = null;
        if (isGroup) {
          counterpart = normalizeJidToPhone(from);
        } else {
          counterpart = normalizeJidToPhone(chatId);
        }
        if (!counterpart) continue;

        // Determine direction from OUR perspective:
        // outbound if WE sent it (from == our number), else inbound.
        const fromNum = (from || '').replace(/\D/g, '');
        const direction = (own && fromNum === own) ? 'outbound' : 'inbound';

        const ts = msg.timestamp ? new Date(msg.timestamp * 1000) : new Date();
        const [existing] = await pool.query(
          'SELECT id, message_count FROM contact_interactions WHERE chat_jid = ? AND phone = ? AND direction = ?',
          [chatId, counterpart, direction]
        );
        if (existing.length > 0) {
          await pool.query(
            'UPDATE contact_interactions SET last_interaction_at = ?, message_count = message_count + 1 WHERE id = ?',
            [ts, existing[0].id]
          );
        } else {
          await pool.query(
            'INSERT INTO contact_interactions (contact_id, phone, chat_jid, chat_type, direction, last_interaction_at, message_count) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [null, counterpart, chatId, isGroup ? 'group' : 'individual', direction, ts]
          );
        }
        if (isGroup) groups++; else individuals++;
        detected++;
      }
    }

    res.json({ ok: true, detected, groups, individuals, message: `Scanned chats: ${detected} messages recorded (${individuals} individual, ${groups} group)` });
  } catch (e) {
    console.error('interaction scan error:', e);
    res.status(500).json({ error: 'Scan failed: ' + e.message });
  }
});

// GET /api/waha/interactions  ->  list recorded interactions
router.get('/waha/interactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_interactions ORDER BY last_interaction_at DESC LIMIT 500');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function getOwnNumber(session) {
  try {
    const info = await wahaRequest(`/api/sessions/${encodeURIComponent(session)}/status`);
    return info.me?.id || info.user?.id || null;
  } catch (_) {
    return null;
  }
}

app.use('/api', router);
