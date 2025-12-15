const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  image: String,
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  guests: { type: Number, default: 2 },
  superhost: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Property', propertySchema);
