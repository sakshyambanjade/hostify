'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useStore from '../../store/useStore';
import {
  Heart,
  MapPin,
  Star,
  Wifi,
  Waves,
  Droplets,
  Wind,
  Bed,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';

interface Property {
  _id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image?: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  superhost: boolean;
  latitude?: number;
  longitude?: number;
}

interface Weather {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
}

const API_BASE_URL = 'http://localhost:5000/api';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=600&fit=crop';

const DEMO_PROPERTIES: Record<string, Property> = {
  '1': {
    _id: '1',
    name: 'Modern Downtown Apartment',
    location: 'Toronto, Canada',
    price: 150,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&h=600&q=80',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    superhost: true,
    latitude: 43.6629,
    longitude: -79.3957,
  },
  '2': {
    _id: '2',
    name: 'Beachfront Cabin',
    location: 'Miami, USA',
    price: 200,
    rating: 4.6,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&h=600&q=80',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: true,
    latitude: 25.7617,
    longitude: -80.1918,
  },
  '3': {
    _id: '3',
    name: 'Mountain House',
    location: 'Denver, USA',
    price: 250,
    rating: 4.9,
    reviews: 150,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?auto=format&fit=crop&w=800&h=600&q=80',
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    superhost: true,
    latitude: 39.7392,
    longitude: -104.9903,
  },
  'cozy-beach-house': {
    _id: 'cozy-beach-house',
    name: 'Cozy Beach House',
    location: 'Miami, USA',
    price: 180,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&h=600&q=80',
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    superhost: false,
  },
  'brightwoodcabin': {
    _id: 'brightwoodcabin',
    name: 'Brightwoods Cabin',
    location: 'Bridgespath, Ontario, Canada',
    price: 658,
    rating: 5.0,
    reviews: 200,
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f3f?auto=format&fit=crop&w=800&h=600&q=80',
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    superhost: true,
  },
  'luxuryvillaspain': {
    _id: 'luxuryvillaspain',
    name: 'Luxury Villa Spain',
    location: 'Barcelona, Spain',
    price: 350,
    rating: 4.95,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&h=600&q=80',
    bedrooms: 5,
    bathrooms: 4,
    guests: 10,
    superhost: true,
  },
};

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600 text-sm">Loading map...</p>
    </div>
  ),
});

const amenities = [
  { icon: Waves, label: 'Lakeside' },
  { icon: Wifi, label: 'WiFi' },
  { icon: Droplets, label: 'Hot water' },
  { icon: Zap, label: 'Freezer' },
  { icon: Wind, label: 'Free parking' },
  { icon: Bed, label: 'Kitchen' },
  { icon: Award, label: 'Security cameras on property' },
  { icon: Wind, label: 'Outdoor shower' },
  { icon: Zap, label: 'Fire Extinguisher' },
  { icon: Bed, label: 'Shampoo' },
  { icon: Wind, label: 'Coffee Maker' },
  { icon: Zap, label: 'Glass stove' },
];

export default function PropertyDetail() {
  const params = useParams();
  const id = params.id as string;
  const { isLoggedIn } = useStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        if (DEMO_PROPERTIES[id]) {
          const demoProperty = DEMO_PROPERTIES[id];
          setProperty(demoProperty);

          if (demoProperty.latitude && demoProperty.longitude) {
            await fetchWeather(demoProperty.latitude, demoProperty.longitude);
          }

          const similar = Object.values(DEMO_PROPERTIES)
            .filter((p) => p._id !== id)
            .slice(0, 3);
          setSimilarProperties(similar);

          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/properties/${id}`);
        if (!response.ok) throw new Error('Property not found');

        const data = await response.json();
        data.image = data.image || DEFAULT_IMAGE;
        setProperty(data);

        if (data.latitude && data.longitude) {
          await fetchWeather(data.latitude, data.longitude);
        }

        const similarRes = await fetch(`${API_BASE_URL}/properties`);
        const allProperties = await similarRes.json();
        setSimilarProperties(
          allProperties.filter((p: Property) => p._id !== id).slice(0, 3)
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load property';
        setError(errorMessage);
        if (DEMO_PROPERTIES['1']) {
          setProperty(DEMO_PROPERTIES['1']);
          setSimilarProperties(
            Object.values(DEMO_PROPERTIES)
              .filter((p) => p._id !== '1')
              .slice(0, 3)
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,wind_speed_10m&timezone=auto`
      );
      if (!response.ok) throw new Error('Weather fetch failed');

      const data = await response.json();
      const current = data.current;

      setWeather({
        temperature: Math.round(current.temperature_2m),
        weatherCode: current.weather_code,
        isDay: current.is_day,
        windSpeed: current.wind_speed_10m,
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
    }
  };

  const getWeatherDescription = (code: number): string => {
    if (code === 0 || code === 1) return 'Clear sky';
    if (code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code === 51 || code === 53 || code === 55) return 'Light drizzle';
    if (code === 61 || code === 63 || code === 65) return 'Rainy';
    if (code === 71 || code === 73 || code === 75) return 'Snowy';
    return 'Unknown';
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('Please log in to save properties');
      return;
    }

    try {
      const method = liked ? 'DELETE' : 'POST';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/likes/${id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to update like');
      setLiked(!liked);
    } catch (err) {
      console.error('Like error:', err);
      setLiked(!liked);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Property not found</p>
          <Link href="/" className="text-orange-500 font-semibold hover:underline">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  const { name, location, price, rating, reviews, image, bedrooms, bathrooms, guests, superhost, latitude, longitude } = property;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-gray-900 hover:text-orange-500 transition font-semibold text-sm">
            ← Home
          </Link>
          <button
            onClick={handleLike}
            className="text-gray-700 hover:text-red-500 transition"
          >
            <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* 2-Column Grid: Left (Images & Description) | Right (Sticky Booking Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - lg:col-span-2 */}
          <div className="lg:col-span-2">
            {/* HERO IMAGE + THUMBNAILS */}
            <div className="mb-8">
              <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-gray-200 mb-4">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative flex-1 h-24 rounded-lg overflow-hidden bg-gray-300 cursor-pointer hover:opacity-75 transition"
                  >
                    <Image
                      src={image}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    {i === 4 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">360°</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT THIS HOME SECTION */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this home</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Welcome to {name}, your idyllic retreat nestled in the heart of {location}. Surrounded by lush landscapes and tranquil trails, this charming getaway offers the perfect blend of rustic elegance and modern comfort.
              </p>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Living Space:</p>
                  <p className="text-gray-700">
                    This charming cabin boasts a spacious living area adorned with rustic decor and modern amenities. Enjoy the warmth of the wood-burning fireplace, relax on the plush sofas, and make yourself at home.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Bedrooms:</p>
                  <p className="text-gray-700">
                    With {bedrooms} beautifully appointed bedrooms, our cabin comfortably accommodates up to {guests} guests. Each room is thoughtfully designed to provide ultimate comfort and relaxation.
                  </p>
                </div>
              </div>

              <button className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 text-sm mt-4">
                Show more
                <ChevronRight size={16} />
              </button>
            </section>

            {/* AMENITIES SECTION - Full Width 3 Columns */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
                {amenities.slice(0, 9).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <amenity.icon size={18} className="text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{amenity.label}</span>
                  </div>
                ))}
              </div>
              <button className="border border-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:border-gray-400 font-semibold text-sm transition">
                Show all amenities
              </button>
            </section>

            {/* SIMILAR STAYS - Full Width */}
            {similarProperties.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Similar stays</h2>
                  <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                    View all
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {similarProperties.map((prop) => (
                    <Link key={prop._id} href={`/properties/${prop._id}`}>
                      <div className="group cursor-pointer">
                        {/* Image */}
                        <div className="relative h-40 rounded-lg overflow-hidden bg-gray-200 mb-3">
                          <Image
                            src={prop.image || DEFAULT_IMAGE}
                            alt={prop.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {prop.superhost && (
                            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                              Superhost
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <h3 className="font-bold text-gray-900 text-sm mb-1">{prop.name}</h3>
                        <p className="text-xs text-gray-600 mb-3">{prop.location}</p>

                        {/* Rating & Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900 text-sm">
                              {prop.rating}
                            </span>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">
                            ${prop.price}/night
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN - lg:col-span-1 (STICKY BOOKING CARD) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* ALL-IN-ONE BOOKING CARD */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
                {/* TITLE */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span className="text-sm">{location}</span>
                </div>

                {/* RATING */}
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{rating}</span>
                  <span className="text-gray-600 text-sm">({reviews} reviews)</span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  Welcome to your idyllic retreat nestled in the heart of {location}. Surrounded by lush landscapes and tranquil trails, this charming getaway offers the perfect blend of rustic elegance and modern comfort.
                </p>

                {/* PRICE */}
                <div className="py-4 border-t border-gray-200 border-b">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    <span className="text-gray-600 text-lg">/night</span>
                  </div>
                  <p className="text-right text-orange-600 font-semibold text-xs">
                    Best time to Book
                  </p>
                </div>

                {/* BOOK BUTTON */}
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition text-base">
                  Book this home
                </button>

                {/* HOSTED BY SECTION - in card */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm mb-4">Hosted by:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      MW
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">Michelle Ward</p>
                      <p className="text-xs text-gray-600">Joined in May 2021</p>
                    </div>
                  </div>
                  {superhost && (
                    <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-200">
                      <Award size={16} className="text-orange-600" />
                      <p className="text-xs font-bold text-orange-600">Superhost</p>
                    </div>
                  )}
                </div>
              </div>

              {/* FEATURES CARD */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bed size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Dedicated workspace</p>
                    <p className="text-xs text-gray-600">A private room equipped with WiFi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Self check-in</p>
                    <p className="text-xs text-gray-600">Check in with just your phone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Free cancellation</p>
                    <p className="text-xs text-gray-600">Cancel anytime</p>
                  </div>
                </div>
              </div>

              {/* WEATHER CARD */}
              {weather && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">
                    Current Weather
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-4xl mb-2">{weather.isDay ? '☀️' : '🌙'}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {weather.temperature}°C
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {getWeatherDescription(weather.weatherCode)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Wind Speed</p>
                        <p className="text-lg font-bold text-gray-900">
                          {weather.windSpeed.toFixed(1)} km/h
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Time</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {weather.isDay ? 'Daytime' : 'Nighttime'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MAP CARD */}
              {latitude && longitude && (
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Where you'll be</h3>
                  <MapComponent latitude={latitude} longitude={longitude} />
                  <p className="text-gray-600 text-xs mt-2">
                    {name} is located in {location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
