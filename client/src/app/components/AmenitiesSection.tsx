import { Home, Wifi, Droplets, Users, Wind, Waves } from 'lucide-react';

interface AmenitiesSectionProps {
  amenities: string[];
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  Lakeside: <Waves className="w-5 h-5" />,
  Kitchen: <Home className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  'Hot water': <Droplets className="w-5 h-5" />,
  'Free parking': <Home className="w-5 h-5" />,
  Shampoo: <Droplets className="w-5 h-5" />,
  'Coffee Maker': <Home className="w-5 h-5" />,
};

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const displayAmenities = amenities.slice(0, 8);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayAmenities.map((amenity) => (
          <div key={amenity} className="flex items-center gap-3">
            <div className="flex-shrink-0">{amenityIcons[amenity] || '✓'}</div>
            <span className="text-gray-700 text-sm">{amenity}</span>
          </div>
        ))}
      </div>
      {amenities.length > 8 && (
        <button className="mt-6 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition font-medium">
          Show all amenities
        </button>
      )}
    </div>
  );
}