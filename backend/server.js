/* ============================================================
   Fly Blaster — Local Node.js Backend
   Replaces: Supabase (database + auth) + n8n (campaign engine)
   Talks to: MySQL (dedicated flyblaster container) + WAHA (WhatsApp API)
   ============================================================ */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '50mb' }));

const frontendOriginEnv = process.env.FRONTEND_ORIGIN || '*';
const corsOrigin = frontendOriginEnv === '*' 
  ? true 
  : (frontendOriginEnv.includes(',') ? frontendOriginEnv.split(',').map(s => s.trim()) : frontendOriginEnv);

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

/* ---------------- Config ---------------- */
const PORT = process.env.PORT || 8091;
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'flyblaster';
const WAHA_BASE_URL = process.env.WAHA_BASE_URL || 'http://150.109.5.90:3000';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'flyblaster-local-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@flyblaster.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/* ---------------- MySQL pool ---------------- */
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true
});

/* ---------------- Helpers ---------------- */
function cleanPhone(phone) {
  let cleaned = String(phone || '').replace(/[\s\-\(\)]/g, '');
  let digits = cleaned.replace(/\D/g, '');
  if (cleaned.startsWith('+')) return '+' + digits;
  if (digits.startsWith('0')) return '+60' + digits.substring(1);
  return '+' + digits;
}

function normalizeJidToPhone(jid) {
  // e.g. "60123456789@s.whatsapp.net" or "60123456789@c.us" -> "+60123456789"
  const num = String(jid || '').split('@')[0].replace(/\D/g, '');
  if (!num) return null;
  return '+' + num;
}

function phoneToJid(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return `${digits}@c.us`;
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

/* ---------------- WAHA client ---------------- */
async function wahaRequest(path, { method = 'GET', body, timeout = 30000 } = {}) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (WAHA_API_KEY) headers['X-Api-Key'] = WAHA_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${WAHA_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (_) { json = text; }
    if (!res.ok) {
      const err = new Error(`WAHA ${res.status}: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
      err.status = res.status;
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- WAHA version-compatible helpers ----------------
   WAHA changed its URL layout across versions:
     older : /api/sessions/{session}/groups | /chats | /qr | /sendText
     v2026 : /api/{session}/groups | /chats | /auth/qr  + root /api/sendText (session in body)
   Each helper tries the modern path first and falls back to the legacy one.
*/
async function wahaTry(paths, opts) {
  let lastErr = null;
  for (const p of paths) {
    try {
      return await wahaRequest(p, opts);
    } catch (e) {
      lastErr = e;
      // Only fall through on "route not found"; rethrow real errors
      if (!(e && e.status === 404)) throw e;
    }
  }
  throw lastErr;
}

const enc = encodeURIComponent;

// GET session-scoped resource (groups, chats, qr, ...)
function wahaSessionGet(session, subPath, timeout = 30000) {
  return wahaTry(
    [`/api/${enc(session)}/${subPath}`, `/api/sessions/${enc(session)}/${subPath}`],
    { timeout }
  );
}

// Groups list
function wahaGroups(session, timeout = 30000) {
  return wahaSessionGet(session, 'groups', timeout);
}

// Single group detail
function wahaGroupDetail(session, groupId, timeout = 30000) {
  return wahaTry(
    [
      `/api/${enc(session)}/groups/${enc(groupId)}`,
      `/api/sessions/${enc(session)}/groups/${enc(groupId)}`
    ],
    { timeout }
  );
}

// Chats list
function wahaChats(session, timeout = 30000) {
  return wahaSessionGet(session, 'chats', timeout);
}

// Messages in a chat
function wahaChatMessages(session, chatId, limit = 50, timeout = 30000) {
  return wahaTry(
    [
      `/api/${enc(session)}/chats/${enc(chatId)}/messages?limit=${limit}`,
      `/api/sessions/${enc(session)}/chats/${enc(chatId)}/messages?limit=${limit}`
    ],
    { timeout }
  );
}

// QR code (modern path lives under /auth/qr)
function wahaQr(session, timeout = 15000) {
  return wahaTry(
    [
      `/api/${enc(session)}/auth/qr?format=image`,
      `/api/${enc(session)}/auth/qr`,
      `/api/sessions/${enc(session)}/qr`
    ],
    { timeout }
  );
}

// Start a session
function wahaStartSession(session, timeout = 15000) {
  return wahaTry(
    [
      `/api/sessions/${enc(session)}/start`,
      `/api/${enc(session)}/start`
    ],
    { method: 'POST', timeout }
  );
}

// Logout a session
function wahaLogoutSession(session, timeout = 15000) {
  return wahaTry(
    [
      `/api/sessions/${enc(session)}/logout`,
      `/api/${enc(session)}/logout`
    ],
    { method: 'POST', timeout }
  );
}

// Send plain text (session goes in the body on modern WAHA)
function wahaSendText(session, chatId, text, timeout = 60000) {
  return wahaTry(
    [
      `/api/sendText`,
      `/api/sessions/${enc(session)}/sendText`
    ],
    { method: 'POST', body: { session, chatId, text }, timeout }
  );
}

// Send an image with caption
function wahaSendImage(session, chatId, file, caption, timeout = 60000) {
  return wahaTry(
    [
      `/api/sendImage`,
      `/api/sessions/${enc(session)}/sendImage`
    ],
    { method: 'POST', body: { session, chatId, file, caption }, timeout }
  );
}


async function ensureAdmin() {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
  if (rows.length === 0) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      'INSERT INTO users (email, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [ADMIN_EMAIL, hash, 'Admin', 'admin']
    );
    console.log(`[boot] Created default admin user: ${ADMIN_EMAIL}`);
  }
}

/* ---------------- Server boot ---------------- */
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected', time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'error', error: e.message });
  }
});

app.listen(PORT, async () => {
  console.log(`[boot] Fly Blaster backend listening on :${PORT}`);
  let connected = false;
  while (!connected) {
    try {
      await pool.query('SELECT 1');
      console.log(`[boot] MySQL connected (${DB_HOST}:${DB_PORT}/${DB_NAME})`);
      await ensureAdmin();
      connected = true;
    } catch (e) {
      console.log('[boot] Waiting for MySQL connection:', e.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
});

// Export for route modules (loaded after listen to avoid ordering issues)
module.exports = {
  app, pool, wahaRequest, cleanPhone, phoneToJid, normalizeJidToPhone, signToken, authRequired, WAHA_BASE_URL,
  wahaGroups, wahaGroupDetail, wahaChats, wahaChatMessages, wahaQr,
  wahaStartSession, wahaLogoutSession, wahaSendText, wahaSendImage
};

// Load routes
require('./routes/auth');
require('./routes/core');
require('./routes/waha');
require('./routes/campaigns');
