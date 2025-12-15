'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import PropertyCard from './components/PropertyCard';
import { Home as HomeIcon, Calendar, ChevronDown, Search as SearchIcon } from 'lucide-react';
import bg from '../app/components/assets/header.png';

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
}

const API_BASE_URL = 'http://localhost:5000/api';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&h=600&q=80';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback((searchFilters: typeof filters) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchFilters);
    }, 300);
  }, [properties]);

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/properties`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data: Property[] = await res.json();

        const withImages = data.map((prop) => ({
          ...prop,
          image: prop.image || FALLBACK_IMAGE,
        }));

        setProperties(withImages);
        setFilteredProperties(withImages);
        setVisibleCount(20);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load properties';
        setError(msg);

        const demo: Property[] = [
          {
            _id: '1',
            name: 'Modern Downtown Apartment',
            location: 'Toronto, Canada',
            price: 150,
            rating: 4.8,
            reviews: 128,
            image: FALLBACK_IMAGE,
            bedrooms: 2,
            bathrooms: 1,
            guests: 4,
            superhost: true,
          },
          {
            _id: '2',
            name: 'Beachfront Cabin',
            location: 'Miami, USA',
            price: 200,
            rating: 4.6,
            reviews: 95,
            image: FALLBACK_IMAGE,
            bedrooms: 3,
            bathrooms: 2,
            guests: 6,
            superhost: true,
          },
          {
            _id: '3',
            name: 'Mountain House',
            location: 'Denver, USA',
            price: 250,
            rating: 4.9,
            reviews: 150,
            image: FALLBACK_IMAGE,
            bedrooms: 4,
            bathrooms: 3,
            guests: 8,
            superhost: true,
          },
        ];
        setProperties(demo);
        setFilteredProperties(demo);
        setVisibleCount(20);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    return;
  };

  const performSearch = (searchFilters: typeof filters) => {
    setSearching(true);
    let filtered = properties;

    if (searchFilters.location.trim()) {
      const term = searchFilters.location.toLowerCase();
      filtered = filtered.filter((p) => {
        const fullText = `${p.name} ${p.location}`.toLowerCase();
        return fullText.includes(term);
      });
    }

    if (searchFilters.guests > 1) {
      filtered = filtered.filter((p) => p.guests >= searchFilters.guests);
    }

    setFilteredProperties(filtered);
    setVisibleCount(20);
    setSearching(false);
  };

  const handleSearch = () => {
    if (filters.location.trim()) {
      const history = [filters.location, ...searchHistory.filter((h) => h !== filters.location)].slice(0, 5);
      setSearchHistory(history);
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    performSearch(filters);
  };

  const handleInputChange = (field: keyof typeof filters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search Inside */}
      <div className="relative w-full h-auto md:h-96 overflow-hidden">
        <Image
          src={bg}
          alt="Hero Banner"
          fill
          className="object-cover absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-20 py-6 sm:py-8">
          {/* Text Content */}
          <div className="max-w-2xl mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight">
              Find a <span className="text-orange-500">host</span> for every journey
            </h1>
            <p className="text-xs sm:text-sm md:text-lg text-gray-800 font-medium">
              Discover the best local rental properties that fits your every travel needs
            </p>
          </div>

          {/* Search Bar - Fully Responsive */}
          <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Mobile Layout - Single Column */}
            <div className="flex flex-col divide-y md:divide-y-0 md:divide-x md:flex-row divide-gray-200">
              
              {/* Accommodation */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                  Accommodation
                </label>
                <div className="relative flex items-center gap-2">
                  <HomeIcon size={16} className="text-gray-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="City, country, or property"
                    value={filters.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onKeyPress={handleKeyPress}
                    list="searchHistory"
                    className="w-full text-sm text-gray-900 placeholder-gray-500 bg-transparent outline-none"
                  />
                  <datalist id="searchHistory">
                    {searchHistory.map((item, idx) => (
                      <option key={idx} value={item} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Check-in & Check-out Row - Hidden on Mobile */}
              <div className="hidden sm:flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {/* Check-in */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                    Check-in
                  </label>
                  <div className="relative flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                      type="date"
                      value={filters.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      className="w-full text-sm text-gray-900 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                    Check-out
                  </label>
                  <div className="relative flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                      type="date"
                      value={filters.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      className="w-full text-sm text-gray-900 bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guests & Search */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-stretch">
                <div className="flex-1 flex flex-col justify-center sm:border-r sm:border-gray-200 sm:pr-4">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                    Guests
                  </label>
                  <div className="relative flex items-center gap-2">
                    <select
                      value={filters.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value, 10))}
                      className="w-full text-sm text-gray-900 bg-transparent outline-none appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="text-gray-500 flex-shrink-0 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 sm:px-6 font-bold transition duration-200 rounded-lg sm:rounded-none sm:rounded-r-lg whitespace-nowrap"
                >
                  <SearchIcon size={18} className="flex-shrink-0" />
                  <span className="text-sm">
                    {searching ? 'Searching…' : 'Search'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-20 py-8 sm:py-12">
        <div className="w-full">
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <span className="text-yellow-600 font-bold">⚠</span>
              <p className="text-yellow-800 text-sm flex-1">
                {error} – showing demo data.
              </p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {filteredProperties.length} Propert{filteredProperties.length === 1 ? 'y' : 'ies'}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
              </div>
              <p className="mt-4 text-gray-600 text-sm">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg font-semibold">No properties found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search or search for a different location.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-8">
                {filteredProperties.slice(0, visibleCount).map((property) => (
                  <div key={property._id}>
                    <PropertyCard
                      property={{
                        ...property,
                        image: property.image || FALLBACK_IMAGE,
                      }}
                    />
                  </div>
                ))}
              </div>

              {filteredProperties.length > visibleCount && (
                <div className="flex justify-center pb-12">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 20)}
                    className="px-6 sm:px-8 py-3 text-sm font-semibold border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition duration-200"
                  >
                    Load more ({filteredProperties.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
