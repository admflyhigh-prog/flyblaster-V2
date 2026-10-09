/* Core CRUD routes — replaces all Supabase table operations
   Tables: system_settings, groups, contacts, group_contacts, templates,
           campaigns, campaign_groups, message_logs, daily_message_count
*/
const { Router } = require('express');
const { app, pool, cleanPhone, authRequired } = require('../server');

const router = Router();
router.use(authRequired);

/* ================= Dashboard / sync snapshot ================= */
// GET /api/sync -> one combined snapshot (groups, contacts, templates, campaigns, settings, stats)
router.get('/sync', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT setting_key, setting_value FROM system_settings');
    const [groups] = await pool.query('SELECT * FROM `groups` ORDER BY created_at DESC');
    const [contacts] = await pool.query('SELECT * FROM contacts ORDER BY name');
    const [groupContacts] = await pool.query('SELECT * FROM group_contacts');
    const [templates] = await pool.query('SELECT * FROM templates ORDER BY created_at DESC');
    const [campaignGroups] = await pool.query('SELECT * FROM campaign_groups');
    const [campaigns] = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
    const [logs] = await pool.query(
      'SELECT status, COUNT(*) AS c FROM message_logs GROUP BY status'
    );
    const [interactions] = await pool.query('SELECT phone, direction, chat_type FROM contact_interactions');

    // contacts with prior interaction (any direction)
    const interactionPhones = new Set(interactions.map(i => cleanPhone(i.phone)));
    const contactInteraction = {};
    interactions.forEach(i => {
      const p = cleanPhone(i.phone);
      if (!contactInteraction[p]) contactInteraction[p] = { inbound: 0, outbound: 0, group: 0 };
      if (i.chat_type === 'group') contactInteraction[p].group += 1;
      else if (i.direction === 'inbound') contactInteraction[p].inbound += 1;
      else contactInteraction[p].outbound += 1;
    });

    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.setting_key] = s.setting_value; });

    const contactsWithFlag = contacts.map(c => ({
      id: c.id, name: c.name, phone: c.phone, email: c.email || '',
      hasInteraction: interactionPhones.has(cleanPhone(c.phone)),
      interactions: contactInteraction[cleanPhone(c.phone)] || { inbound: 0, outbound: 0, group: 0 }
    }));

    // group -> contacts
    const groupsOut = groups.map(g => {
      const gids = groupContacts.filter(gc => gc.group_id === g.id).map(gc => gc.contact_id);
      const gContacts = contactsWithFlag.filter(c => gids.includes(c.id));
      return {
        id: g.id,
        name: g.name,
        wahaJid: g.waha_jid || null,
        isImported: !!g.is_imported,
        contacts: gContacts,
        created: new Date(g.created_at).toISOString().split('T')[0]
      };
    });

    // campaigns with groupIds + counts
    const campaignGroupsMap = {};
    campaignGroups.forEach(row => {
      if (!campaignGroupsMap[row.campaign_id]) campaignGroupsMap[row.campaign_id] = [];
      campaignGroupsMap[row.campaign_id].push(row.group_id);
    });

    const campaignsOut = campaigns.map(c => {
      const groupIds = campaignGroupsMap[c.id] || (c.group_id ? [c.group_id] : []);
      let totalCount = 0;
      groupIds.forEach(gId => {
        const g = groupsOut.find(x => x.id === gId);
        if (g) totalCount += g.contacts.length;
      });
      if (totalCount === 0) totalCount = c.total_recipients || 0;
      return {
        id: c.id,
        name: c.name,
        groupIds,
        groupId: groupIds[0] || null,
        templateId: c.template_id,
        status: (c.status || 'pending').trim().toLowerCase(),
        sentCount: c.sent_count || 0,
        failedCount: c.failed_count || 0,
        channel: c.channel || 'whatsapp',
        onlyInteractions: !!c.only_interactions,
        totalRecipients: c.total_recipients || totalCount,
        created: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : '',
        started: c.started_at ? new Date(c.started_at).toISOString().replace('T', ' ').substring(0, 16) : null,
        completed: c.completed_at ? new Date(c.completed_at).toISOString().replace('T', ' ').substring(0, 16) : null
      };
    });

    // daily stats
    const todayStr = new Date().toISOString().split('T')[0];
    const uniqueGroupsToday = new Set();
    campaignsOut.forEach(c => {
      if (c.started && c.started.split(' ')[0] === todayStr && (c.status === 'sending' || c.status === 'completed')) {
        c.groupIds.forEach(gId => uniqueGroupsToday.add(gId));
      }
    });

    const logMap = { sent: 0, failed: 0, pending: 0 };
    logs.forEach(l => { logMap[l.status] = l.c; });

    res.json({
      settings: settingsMap,
      groups: groupsOut,
      contacts: contactsWithFlag,
      templates: templates.map(t => ({
        id: t.id, name: t.name, message: t.message_text,
        hasMedia: !!t.media_url, mediaUrl: t.media_url || '',
        channel: t.channel || 'whatsapp', emailSubject: t.email_subject || '',
        created: new Date(t.created_at).toISOString().split('T')[0]
      })),
      campaigns: campaignsOut,
      dailyStats: {
        limit: parseInt(settingsMap.daily_group_limit || '5', 10),
        messagesSent: uniqueGroupsToday.size,
        sent: logMap.sent || 0,
        failed: logMap.failed || 0
      },
      totalStats: {
        messagesSent: logMap.sent || 0,
        totalContacts: contacts.length,
        totalCampaigns: campaigns.length,
        failedMessages: logMap.failed || 0
      }
    });
  } catch (e) {
    console.error('sync error:', e);
    res.status(500).json({ error: e.message });
  }
});

/* ================= Settings ================= */
// GET /api/settings
router.get('/settings', async (req, res) => {
  const [rows] = await pool.query('SELECT setting_key, setting_value FROM system_settings');
  const map = {};
  rows.forEach(r => { map[r.setting_key] = r.setting_value; });
  res.json(map);
});

// PUT /api/settings  ->  { waha_session, daily_group_limit }
router.put('/settings', async (req, res) => {
  try {
    const { waha_session, daily_group_limit } = req.body || {};
    const upsert = async (k, v) => {
      if (v === undefined || v === null) return;
      await pool.query(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
        [k, String(v)]
      );
    };
    if (waha_session !== undefined) await upsert('waha_session', waha_session);
    if (daily_group_limit !== undefined) await upsert('daily_group_limit', daily_group_limit);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= Groups ================= */
// POST /api/groups  { name }  -> create
router.post('/groups', async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Group name required' });
    const [result] = await pool.query('INSERT INTO `groups` (name) VALUES (?)', [name]);
    res.json({ id: result.insertId, name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/groups/:id  { name }
router.patch('/groups/:id', async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Group name required' });
    await pool.query('UPDATE `groups` SET name = ? WHERE id = ?', [name, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/groups/:id
router.delete('/groups/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM `groups` WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= Contacts ================= */
// Upsert a contact by phone (returns id)
async function upsertContact(name, phone, email) {
  const clean = cleanPhone(phone);
  const [existing] = await pool.query('SELECT id FROM contacts WHERE phone = ?', [clean]);
  if (existing.length > 0) {
    await pool.query('UPDATE contacts SET name = ?, email = ? WHERE id = ?', [name || 'No Name', email || '', existing[0].id]);
    return existing[0].id;
  }
  const [result] = await pool.query(
    'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
    [name || 'No Name', clean, email || '']
  );
  return result.insertId;
}

// POST /api/groups/:id/contacts  ->  bulk add contacts { contacts: [{name, phone, email}] }
router.post('/groups/:id/contacts', async (req, res) => {
  try {
    const groupId = req.params.id;
    const { contacts: items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No contacts provided' });

    const added = [];
    for (const c of items) {
      const phone = cleanPhone(c.phone);
      if (!phone) continue;
      const contactId = await upsertContact(c.name, phone, c.email);
      await pool.query('INSERT IGNORE INTO group_contacts (group_id, contact_id) VALUES (?, ?)', [groupId, contactId]);
      added.push({ id: contactId, name: c.name || 'No Name', phone, email: c.email || '' });
    }
    res.json({ ok: true, added });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/groups/:groupId/contacts/:contactId  -> remove from group
router.delete('/groups/:groupId/contacts/:contactId', async (req, res) => {
  try {
    await pool.query('DELETE FROM group_contacts WHERE group_id = ? AND contact_id = ?', [req.params.groupId, req.params.contactId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/contacts/:id  { name, phone, email }
router.patch('/contacts/:id', async (req, res) => {
  try {
    const { name, phone, email } = req.body || {};
    const clean = cleanPhone(phone);
    await pool.query('UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?', [name || '', clean, email || '', req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= Templates ================= */
// POST /api/templates
router.post('/templates', async (req, res) => {
  try {
    const { name, message_text, channel = 'whatsapp', email_subject, media_url, media_type, attachments } = req.body || {};
    const [result] = await pool.query(
      'INSERT INTO templates (name, message_text, channel, email_subject, media_url, media_type, attachments) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, message_text, channel, email_subject || null, media_url || null, media_type || null, attachments ? JSON.stringify(attachments) : null]
    );
    res.json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/templates/:id
router.patch('/templates/:id', async (req, res) => {
  try {
    const { name, message_text, channel, email_subject, media_url, media_type, attachments } = req.body || {};
    await pool.query(
      'UPDATE templates SET name = ?, message_text = ?, channel = ?, email_subject = ?, media_url = ?, media_type = ?, attachments = ? WHERE id = ?',
      [name, message_text, channel || 'whatsapp', email_subject || null, media_url || null, media_type || null, attachments ? JSON.stringify(attachments) : null, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/templates/:id
router.delete('/templates/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM templates WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ================= Campaigns ================= */
// POST /api/campaigns  { name, groupIds, templateId, channel, delaySeconds, onlyInteractions }
router.post('/campaigns', async (req, res) => {
  try {
    const { name, groupIds = [], templateId, channel = 'whatsapp', delaySeconds = 15, onlyInteractions = false } = req.body || {};
    if (!name || !templateId || groupIds.length === 0) return res.status(400).json({ error: 'Name, template, and at least one group required' });

    // total recipients
    let totalCount = 0;
    for (const gId of groupIds) {
      const [gcs] = await pool.query('SELECT contact_id FROM group_contacts WHERE group_id = ?', [gId]);
      if (onlyInteractions) {
        for (const row of gcs) {
          const [c] = await pool.query('SELECT phone FROM contacts WHERE id = ?', [row.contact_id]);
          if (c.length) {
            const [inter] = await pool.query(
              'SELECT id FROM contact_interactions WHERE phone = ? LIMIT 1', [cleanPhone(c[0].phone)]
            );
            if (inter.length) totalCount++;
          }
        }
      } else {
        totalCount += gcs.length;
      }
    }

    const [result] = await pool.query(
      'INSERT INTO campaigns (name, group_id, template_id, status, channel, delay_seconds, total_recipients, only_interactions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, groupIds[0] || null, templateId, 'pending', channel, delaySeconds, totalCount, onlyInteractions ? 1 : 0]
    );
    const campaignId = result.insertId;

    for (const gId of groupIds) {
      await pool.query('INSERT IGNORE INTO campaign_groups (campaign_id, group_id) VALUES (?, ?)', [campaignId, gId]);
    }
    res.json({ id: campaignId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/campaigns/:id
router.delete('/campaigns/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM campaigns WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/api', router);
