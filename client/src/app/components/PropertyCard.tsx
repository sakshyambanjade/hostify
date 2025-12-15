'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useStore from '../store/useStore';
import { Share2, MapPin, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: {
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
  };
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';

export default function PropertyCard({ property }: PropertyCardProps) {
  const { isLoggedIn, toggleLike, isLiked } = useStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const {
    _id,
    name,
    location,
    price,
    rating,
    reviews,
    image,
    bedrooms,
    bathrooms,
    guests,
    superhost,
  } = property;

  const imageUrl = image && image.trim() ? image : DEFAULT_IMAGE;
  const altText = name && name.trim() ? name : 'Property';

  // Convert _id to number for like functionality
  const numericId = parseInt(_id, 10) || 0;
  const liked = numericId > 0 && isLiked(numericId);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      showToastMsg('Please log in to save properties', 2000);
      return;
    }

    if (numericId <= 0) {
      console.error('Invalid property id for like:', _id);
      return;
    }

    toggleLike(numericId);
    showToastMsg(liked ? 'Removed from saved' : 'Added to saved', 2000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/properties/${_id}`;
    const shareText = `Check out this property: ${name} - ${location}`;

    if (navigator.share) {
      navigator.share({
        title: 'Hostify - Property',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToastMsg('Property link copied to clipboard!', 2000);
    }
  };

  const showToastMsg = (msg: string, duration: number = 2000) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

  const pricePerNight = `$${price}`;
  const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'New';

  return (
    <Link href={`/properties/${_id}`}>
      <div className="group cursor-pointer rounded-lg overflow-hidden bg-white shadow hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-200 aspect-video">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />

          {/* Action Buttons Container */}
          <div className="absolute inset-0 flex items-start justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Left: Superhost Badge */}
            {superhost && (
              <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                ⭐ Superhost
              </div>
            )}

            {/* Right: Action Buttons */}
            <div className="flex gap-2">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition hover:scale-110 active:scale-95"
                aria-label="Share property"
                title="Share property"
              >
                <Share2 size={18} className="text-gray-700" />
              </button>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition hover:scale-110 active:scale-95"
                aria-label={liked ? 'Remove from saved' : 'Save this property'}
                title={liked ? 'Remove from saved' : 'Save this property'}
              >
                <Heart
                  size={18}
                  className={`transition-all ${
                    liked
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Toast Notification (on hover) */}
          {showToast && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
              {toastMessage}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Header with Rating */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base group-hover:text-orange-500 transition">
                {name}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm mt-1">
                <MapPin size={14} className="flex-shrink-0" />
                <p className="line-clamp-1">{location}</p>
              </div>
            </div>
            {(rating > 0 || reviews > 0) && (
              <div className="text-right ml-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {ratingDisplay}
                  </span>
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                {reviews > 0 && (
                  <p className="text-xs text-gray-500">
                    ({reviews})
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="font-medium">{guests}</span>
              <span>guest{guests !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{bedrooms}</span>
              <span>bed{bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{bathrooms}</span>
              <span>bath</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-gray-200 pt-3 mt-auto">
            <p className="text-lg font-bold text-gray-900">
              {pricePerNight}
              <span className="text-xs sm:text-sm font-normal text-gray-600">
                /night
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
