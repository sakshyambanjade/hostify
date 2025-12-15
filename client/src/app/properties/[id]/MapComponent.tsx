'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

export default function MapComponent({ latitude, longitude }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || latitude === undefined || longitude === undefined) {
      return;
    }

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 2,
      }).addTo(mapInstance.current);

      const markerIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjRkY2QjM1IiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDEyLjUgMTIuNSAyOC4xIDEyLjUgMjguMXMxMi41LTE1LjYgMTIuNS0yOC4xQzI1IDUuNiAxOS40IDAgMTIuNSAweiIvPjwvc3ZnPg==',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [0, 0],
      });

      L.marker([latitude, longitude], { icon: markerIcon })
        .addTo(mapInstance.current)
        .bindPopup(`<b>Property Location</b><br/>Lat: ${latitude.toFixed(4)}<br/>Lon: ${longitude.toFixed(4)}`)
        .openPopup();
    } else {
      mapInstance.current.setView([latitude, longitude], 13);
    }

    return () => {
      // Keep map instance
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
      }}
      className="bg-gray-200"
    />
  );
}
