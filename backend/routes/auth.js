/* Auth routes — replaces Supabase Auth (signInWithPassword / signOut / onAuthStateChange) */
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { app, pool, signToken, authRequired } = require('../server');

const router = Router();

// POST /api/auth/login  ->  { email, password }
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [String(email).trim().toLowerCase()]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid login credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid login credentials' });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role }
    });
  } catch (e) {
    console.error('login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me  ->  current session user
router.get('/auth/me', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, display_name, role FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = rows[0];
    res.json({ id: u.id, email: u.email, displayName: u.display_name, role: u.role });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

app.use('/api', router);
