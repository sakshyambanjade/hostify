const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production';

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token with Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    const { email, name, picture } = response.data;

    // Create JWT token
    const jwtToken = jwt.sign(
      { email, name, picture, provider: 'google' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: { email, name, picture },
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Facebook OAuth callback
router.post('/facebook', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token with Facebook
    const response = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture',
        access_token: token,
      },
    });

    const { name, email, picture } = response.data;

    // Create JWT token
    const jwtToken = jwt.sign(
      { email, name, picture: picture?.data?.url, provider: 'facebook' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: { email, name, picture: picture?.data?.url },
    });
  } catch (error) {
    console.error('Facebook auth error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Apple OAuth callback
router.post('/apple', async (req, res) => {
  try {
    const { token } = req.body;

    // Apple token verification (simplified)
    // In production, you'd verify the JWT with Apple's public keys
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: 'Invalid Apple token' });
    }

    const { email, email_verified } = decoded;

    // Create JWT token
    const jwtToken = jwt.sign(
      { email, provider: 'apple', verified: email_verified },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: { email },
    });
  } catch (error) {
    console.error('Apple auth error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
