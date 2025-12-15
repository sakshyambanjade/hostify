const express = require('express');
const router = express.Router();

// In-memory users (fallback)
let users = [];

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this!
      name: name || email,
    };

    users.push(user);
    console.log(`POST /api/auth/signup - user: ${email}`);

    res.json({
      token: 'fake-token-' + user.id,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      // Demo: allow login with any email/password
      console.log(`Login attempt: ${email} (demo mode - allowing)`);
      const demoUser = { id: Date.now().toString(), email, name: email };
      return res.json({
        token: 'fake-token-' + demoUser.id,
        user: demoUser,
      });
    }

    console.log(`POST /api/auth/login - user: ${email}`);
    res.json({
      token: 'fake-token-' + user.id,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    console.log(`GET /api/auth/profile`);
    res.json({ id: 'user-1', email: 'user@example.com', name: 'User' });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
