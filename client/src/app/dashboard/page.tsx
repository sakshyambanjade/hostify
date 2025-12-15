'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../app/store/useStore';
import InputField from '../../app/components/InputField';
import Button from '../components/Button';

const dashboardStyles = `
  input[type="text"],
  input[type="number"],
  textarea,
  select {
    color: #000 !important;
    background-color: #fff !important;
  }
  
  input[type="text"]::placeholder,
  input[type="number"]::placeholder,
  textarea::placeholder {
    color: #999 !important;
  }
  
  input[type="checkbox"] {
    cursor: pointer;
  }
  
  label {
    color: #000 !important;
  }
`;

interface Property {
  _id?: string;
  id?: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  superhost: boolean;
  latitude?: number;
  longitude?: number;
}

const API_BASE_URL = 'http://localhost:5000/api';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, userEmail } = useStore();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = dashboardStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Property>({
    name: '',
    location: '',
    price: 0,
    rating: 0,
    reviews: 0,
    image: '',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    superhost: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/properties`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const data = await response.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch properties';
        console.error('Fetch error:', errorMessage);
        setError(errorMessage);

        const demoData: Property[] = [
          {
            _id: '1',
            name: 'Demo Property 1',
            location: 'Toronto, Canada',
            price: 150,
            rating: 4.8,
            reviews: 128,
            image:
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
            bedrooms: 2,
            bathrooms: 1,
            guests: 4,
            superhost: true,
            latitude: 43.6532,
            longitude: -79.3832,
          },
        ];
        setProperties(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const url = editingId
        ? `${API_BASE_URL}/properties/${editingId}`
        : `${API_BASE_URL}/properties`;
      const method = editingId ? 'PUT' : 'POST';

      // Backend will handle geocoding if coordinates are missing
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);

      const savedProperty = await response.json();

      if (editingId) {
        setProperties(
          properties.map((p) =>
            p._id === editingId || p.id?.toString() === editingId ? savedProperty : p
          )
        );
        setSuccessMessage('Property updated successfully');
      } else {
        setProperties([...properties, savedProperty]);
        setSuccessMessage('Property created successfully');
      }

      localStorage.setItem('property-updated', Date.now().toString());

      setTimeout(() => {
        router.push('/');
      }, 500);

      setFormData({
        name: '',
        location: '',
        price: 0,
        rating: 0,
        reviews: 0,
        image: '',
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        superhost: false,
      });
      setShowForm(false);
      setEditingId(null);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save property';
      console.error('Save error:', errorMessage);
      setError(errorMessage);
    }
  };

  const handleEdit = (property: Property) => {
    setFormData(property);

    const editingKey =
      property._id != null
        ? property._id
        : property.id != null
        ? property.id.toString()
        : null;

    setEditingId(editingKey);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this property?')) return;

    setError(null);

    try {
      const url = `${API_BASE_URL}/properties/${id}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Failed to delete: ${response.statusText}`);

      setProperties(properties.filter((p) => (p._id || p.id) !== id));
      setSuccessMessage('Property deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete property';
      console.error('Delete error:', errorMessage);
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      price: 0,
      rating: 0,
      reviews: 0,
      image: '',
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      superhost: false,
    });
    setError(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {userEmail}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Property'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">Success</p>
            <p className="text-green-600 text-sm">{successMessage}</p>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingId ? 'Edit Property' : 'Create New Property'}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <InputField
                label="Property Name"
                placeholder="e.g., Cozy Downtown Apartment"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                required
              />
              <InputField
                label="Location (Backend will auto-geocode)"
                placeholder="e.g., NYC, USA or Toronto, Canada"
                value={formData.location}
                onChange={(v) => setFormData({ ...formData, location: v })}
                required
              />
              <InputField
                label="Price per Night ($)"
                type="number"
                placeholder="150"
                value={formData.price.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    price: parseInt(v) || 0,
                  })
                }
                required
              />
              <InputField
                label="Rating (0-5)"
                type="number"
                placeholder="4.8"
                value={formData.rating.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(v) || 0,
                  })
                }
              />
              <InputField
                label="Number of Reviews"
                type="number"
                placeholder="128"
                value={formData.reviews.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    reviews: parseInt(v) || 0,
                  })
                }
              />
              <InputField
                label="Image URL"
                placeholder="https://..."
                value={formData.image}
                onChange={(v) => setFormData({ ...formData, image: v })}
              />
              <InputField
                label="Bedrooms"
                type="number"
                placeholder="2"
                value={formData.bedrooms.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    bedrooms: parseInt(v) || 1,
                  })
                }
              />
              <InputField
                label="Bathrooms"
                type="number"
                placeholder="1"
                value={formData.bathrooms.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    bathrooms: parseInt(v) || 1,
                  })
                }
              />
              <InputField
                label="Max Guests"
                type="number"
                placeholder="4"
                value={formData.guests.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    guests: parseInt(v) || 1,
                  })
                }
              />
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="superhost"
                  checked={formData.superhost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      superhost: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-orange-500 rounded cursor-pointer"
                />
                <label
                  htmlFor="superhost"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Superhost Status
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" fullWidth>
                  {editingId ? 'Update Property' : 'Create Property'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              No properties yet. Click &quot;Add Property&quot; to get started!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rooms
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr
                    key={prop._id || prop.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {prop.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {prop.location}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                      ${prop.price}/night
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {prop.superhost && <span className="mr-2">*</span>}
                      {prop.rating}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {prop.bedrooms}B * {prop.bathrooms}Ba
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(prop)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prop._id || prop.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dashboard Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">
                {properties.length}
              </p>
              <p className="text-gray-600">Total Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">
                {properties.filter((p) => p.superhost).length}
              </p>
              <p className="text-gray-600">Superhost Listings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">
                $
                {properties.reduce((sum, p) => sum + p.price, 0)}
              </p>
              <p className="text-gray-600">Total Nightly Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
