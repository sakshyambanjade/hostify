const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// ========== SECURITY MIDDLEWARE ==========
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// ========== BODY PARSER ==========
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========== CORS ==========
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL || [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

// ========== REQUEST LOGGING ==========
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========== GEOCODING ==========
async function geocodeLocation(locationName) {
  if (!locationName?.trim()) return null;

  try {
    const response = await axios.get(
      'https://geocoding-api.open-meteo.com/v1/search',
      {
        params: {
          name: locationName.trim(),
          count: 1,
          language: 'en',
          format: 'json',
        },
      }
    );

    const result = response.data.results?.[0];
    if (!result) return null;

    return {
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (err) {
    console.error('Geocoding error:', err.message);
    return null;
  }
}

// ========== MONGODB ==========
mongoose
  .connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/airbnb-clone',
    {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) =>
    console.error('MongoDB connection failed:', err.message)
  );

// ========== HEALTH ==========
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// ========== GEOCODING MIDDLEWARE ==========
const geocodingMiddleware = async (req, res, next) => {
  const { location, latitude, longitude } = req.body;

  if (location && (!latitude || !longitude || latitude === 0 || longitude === 0)) {
    const coords = await geocodeLocation(location);
    if (coords) {
      req.body.latitude = coords.latitude;
      req.body.longitude = coords.longitude;
    }
  }

  next();
};

app.post('/api/properties', geocodingMiddleware);
app.put('/api/properties/:id', geocodingMiddleware);

// ========== ROUTES ==========
try {
  const propertyRouter = require('./routes/properties');
  const authRouter = require('./routes/auth');
  const likesRouter = require('./routes/likes');
  const oauthRouter = require('./routes/oauth');

  app.use('/api/properties', propertyRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/likes', likesRouter);
  app.use('/api/oauth', oauthRouter);

  console.log('Routes loaded');
} catch (err) {
  console.error('Route loading error:', err.message);
}

// ========== 404 ==========
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// ========== SERVER ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
