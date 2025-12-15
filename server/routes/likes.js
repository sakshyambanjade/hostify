const express = require('express');
const router = express.Router();

// In-memory likes storage
let likes = {};

router.get('/', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] || 'user-1';
    const userLikes = likes[userId] || [];
    console.log(`GET /api/likes - user: ${userId}, count: ${userLikes.length}`);
    res.json(userLikes);
  } catch (err) {
    console.error('Get likes error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:propertyId', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] || 'user-1';
    const propertyId = req.params.propertyId;

    if (!likes[userId]) {
      likes[userId] = [];
    }

    if (!likes[userId].includes(propertyId)) {
      likes[userId].push(propertyId);
    }

    console.log(`POST /api/likes/${propertyId}`);
    res.json({ message: 'Liked', propertyId });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:propertyId', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] || 'user-1';
    const propertyId = req.params.propertyId;

    if (likes[userId]) {
      likes[userId] = likes[userId].filter(id => id !== propertyId);
    }

    console.log(`DELETE /api/likes/${propertyId}`);
    res.json({ message: 'Unliked' });
  } catch (err) {
    console.error('Unlike error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
