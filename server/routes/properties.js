const express = require('express');
const router = express.Router();

// In-memory storage with realistic worldwide properties
let properties = [
  {
    _id: '1',
    name: 'Modern Downtown Apartment',
    location: 'Toronto, Canada',
    price: 150,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    _id: '2',
    name: 'Cozy Beach House',
    location: 'Miami, USA',
    price: 200,
    rating: 4.9,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    _id: '3',
    name: 'Brightwoods Cabin',
    location: 'Bridlepath, Ontario, Canada',
    price: 658,
    rating: 5.0,
    reviews: 200,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 43.6895,
    longitude: -79.4044,
  },
  {
    _id: '4',
    name: 'Luxury Villa with Pool',
    location: 'Barcelona, Spain',
    price: 350,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    superhost: true,
    latitude: 41.3851,
    longitude: 2.1734,
  },
  {
    _id: '5',
    name: 'Tuscan Countryside Villa',
    location: 'Florence, Italy',
    price: 280,
    rating: 4.9,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 43.7696,
    longitude: 11.2558,
  },
  {
    _id: '6',
    name: 'Modern Apartment in Paris',
    location: 'Paris, France',
    price: 320,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    _id: '7',
    name: 'Zen Garden House',
    location: 'Tokyo, Japan',
    price: 220,
    rating: 4.9,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    _id: '8',
    name: 'Modern Penthouse',
    location: 'London, UK',
    price: 380,
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    _id: '9',
    name: 'Beachfront Bungalow',
    location: 'Bali, Indonesia',
    price: 120,
    rating: 4.7,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e16?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: -8.6705,
    longitude: 115.2126,
  },
  {
    _id: '10',
    name: 'Mountain Retreat',
    location: 'Interlaken, Switzerland',
    price: 410,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 46.6863,
    longitude: 8.1636,
  },
  {
    _id: '11',
    name: 'Historic Edinburgh Townhouse',
    location: 'Edinburgh, Scotland',
    price: 240,
    rating: 4.8,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: false,
    latitude: 55.9533,
    longitude: -3.1883,
  },
  {
    _id: '12',
    name: 'Sydney Harbour Apartment',
    location: 'Sydney, Australia',
    price: 290,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    _id: '13',
    name: 'Kathmandu Property',
    location: 'Kathmandu, Nepal',
    price: 50,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 3,
    superhost: false,
    latitude: 27.7172,
    longitude: 85.3240,
  },
  {
    _id: '14',
    name: 'Bangkok Modern Condo',
    location: 'Bangkok, Thailand',
    price: 85,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    _id: '15',
    name: 'Dubai Luxury Penthouse',
    location: 'Dubai, UAE',
    price: 520,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1576091160659-112193cb7ee0?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    superhost: true,
    latitude: 25.2048,
    longitude: 55.2708,
  },
  {
    _id: '16',
    name: 'New York City Loft',
    location: 'New York, USA',
    price: 450,
    rating: 4.8,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    _id: '17',
    name: 'Parisian Boutique Hotel',
    location: 'Montmartre, Paris, France',
    price: 340,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    superhost: true,
    latitude: 48.8867,
    longitude: 2.3431,
  },
  {
    _id: '18',
    name: 'Amsterdam Canal House',
    location: 'Amsterdam, Netherlands',
    price: 260,
    rating: 4.8,
    reviews: 176,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    _id: '19',
    name: 'Berlin Modern Apartment',
    location: 'Berlin, Germany',
    price: 175,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: false,
    latitude: 52.5200,
    longitude: 13.4050,
  },
  {
    _id: '20',
    name: 'Barcelona Gothic Quarter Apartment',
    location: 'Barcelona, Spain',
    price: 210,
    rating: 4.8,
    reviews: 155,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    superhost: true,
    latitude: 41.3851,
    longitude: 2.1734,
  },
  {
    _id: '21',
    name: 'Tokyo Minimalist Studio',
    location: 'Shibuya, Tokyo, Japan',
    price: 180,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    superhost: true,
    latitude: 35.6595,
    longitude: 139.7004,
  },
  {
    _id: '22',
    name: 'Singapore Luxury Suite',
    location: 'Singapore',
    price: 380,
    rating: 4.9,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    superhost: true,
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    _id: '23',
    name: 'Hong Kong Modern Flat',
    location: 'Hong Kong',
    price: 290,
    rating: 4.8,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 22.3193,
    longitude: 114.1694,
  },
  {
    _id: '24',
    name: 'Istanbul Boutique Hotel',
    location: 'Istanbul, Turkey',
    price: 130,
    rating: 4.7,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 41.0082,
    longitude: 28.9784,
  },
  {
    _id: '25',
    name: 'Athens Ancient City Apartment',
    location: 'Athens, Greece',
    price: 145,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: false,
    latitude: 37.9838,
    longitude: 23.7275,
  },
  {
    _id: '26',
    name: 'Venice Waterfront Apartment',
    location: 'Venice, Italy',
    price: 320,
    rating: 4.9,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 45.4408,
    longitude: 12.3155,
  },
  {
    _id: '27',
    name: 'Rome Historical Apartment',
    location: 'Rome, Italy',
    price: 280,
    rating: 4.8,
    reviews: 204,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    _id: '28',
    name: 'Prague Old Town Apartment',
    location: 'Prague, Czech Republic',
    price: 125,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 50.0755,
    longitude: 14.4378,
  },
  {
    _id: '29',
    name: 'Budapest Thermal Apartment',
    location: 'Budapest, Hungary',
    price: 110,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: false,
    latitude: 47.4979,
    longitude: 19.0402,
  },
  {
    _id: '30',
    name: 'Los Angeles Modern Villa',
    location: 'Los Angeles, USA',
    price: 420,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    _id: '31',
    name: 'San Francisco Victorian',
    location: 'San Francisco, USA',
    price: 350,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    _id: '32',
    name: 'Bali Luxury Resort',
    location: 'Ubud, Bali, Indonesia',
    price: 200,
    rating: 4.9,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e16?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: -8.5069,
    longitude: 115.2625,
  },
  {
    _id: '33',
    name: 'Phuket Beach Villa',
    location: 'Phuket, Thailand',
    price: 175,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 8.1164,
    longitude: 98.2993,
  },
  {
    _id: '34',
    name: 'Hanoi Historic House',
    location: 'Hanoi, Vietnam',
    price: 65,
    rating: 4.5,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: false,
    latitude: 21.0285,
    longitude: 105.8542,
  },
  {
    _id: '35',
    name: 'Ho Chi Minh City Modern Apartment',
    location: 'Ho Chi Minh City, Vietnam',
    price: 75,
    rating: 4.6,
    reviews: 125,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 10.7769,
    longitude: 106.7009,
  },
  {
    _id: '36',
    name: 'Bali Oceanfront Villa',
    location: 'Seminyak, Bali, Indonesia',
    price: 250,
    rating: 4.8,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e16?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: -8.6904,
    longitude: 115.1709,
  },
  {
    _id: '37',
    name: 'Dubai Beach Apartment',
    location: 'Jumeirah, Dubai, UAE',
    price: 480,
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    superhost: true,
    latitude: 25.1972,
    longitude: 55.2744,
  },
  {
    _id: '38',
    name: 'Marrakech Riad',
    location: 'Marrakech, Morocco',
    price: 95,
    rating: 4.7,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 31.6295,
    longitude: -8.0088,
  },
  {
    _id: '39',
    name: 'Cape Town Luxury Apartment',
    location: 'Cape Town, South Africa',
    price: 185,
    rating: 4.8,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: -33.9249,
    longitude: 18.4241,
  },
  {
    _id: '40',
    name: 'Johannesburg Modern Penthouse',
    location: 'Johannesburg, South Africa',
    price: 160,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: false,
    latitude: -26.2023,
    longitude: 28.0436,
  },
];

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const { location, guests, minPrice, maxPrice } = req.query;
    let filtered = [...properties];

    if (location) {
      filtered = filtered.filter(p =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (guests) {
      filtered = filtered.filter(p => p.guests >= parseInt(guests));
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
    }

    console.log(`GET /api/properties - returned ${filtered.length} properties`);
    res.json(filtered);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = properties.find(p => p._id === req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    console.log(`GET /api/properties/${req.params.id}`);
    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create property (with geocoding already applied by middleware)
router.post('/', async (req, res) => {
  try {
    const newProperty = {
      _id: Date.now().toString(),
      ...req.body,
      latitude: req.body.latitude || 0,
      longitude: req.body.longitude || 0,
    };

    properties.push(newProperty);
    console.log(`POST /api/properties - created: ${newProperty.name}`);
    res.json(newProperty);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update property (with geocoding already applied by middleware)
router.put('/:id', async (req, res) => {
  try {
    const index = properties.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    properties[index] = {
      ...properties[index],
      ...req.body,
      _id: req.params.id,
    };

    console.log(`PUT /api/properties/${req.params.id} - updated: ${properties[index].name}`);
    res.json(properties[index]);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const index = properties.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const deleted = properties.splice(index, 1);
    console.log(`DELETE /api/properties/${req.params.id}`);
    res.json({ message: 'Property deleted', property: deleted[0] });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
