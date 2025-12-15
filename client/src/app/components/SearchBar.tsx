'use client';

import { useState } from 'react';
import useStore from '../store/useStore';

export default function SearchBar() {
  const { location, checkIn, checkOut, guests, setLocation, setCheckIn, setCheckOut, setGuests } =
    useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-white rounded-full shadow-lg p-2 flex flex-col md:flex-row gap-2 md:gap-0">
      <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Location</label>
        <input
          type="text"
          placeholder="Where are you going?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
        />
      </div>

      <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Check in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full text-gray-900 focus:outline-none text-sm"
        />
      </div>

      <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Check out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full text-gray-900 focus:outline-none text-sm"
        />
      </div>

      <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="w-full text-gray-900 focus:outline-none text-sm bg-transparent"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      <div className="px-4 py-3 flex items-center">
        <button className="w-full md:w-auto bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2">
          <span>Search</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}