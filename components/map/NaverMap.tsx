'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CuratedCafe } from '@/lib/types';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface NaverMapProps {
  cafes: CuratedCafe[];
  selectedCafeId?: string | null;
  onSelectCafe?: (cafeId: string) => void;
  className?: string;
  height?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMap({
  cafes,
  selectedCafeId,
  onSelectCafe,
  className = '',
  height = '450px',
}: NaverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Load Naver Map Script dynamically
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

    if (window.naver && window.naver.maps) {
      setMapLoaded(true);
      return;
    }

    if (!clientId) {
      // If no API client ID is configured, fallback to custom map UI mode
      setMapError(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      // cleanup if unmounted before script load
    };
  }, []);

  // Initialize Naver Map instance when script is ready
  useEffect(() => {
    if (!mapLoaded || mapError || !mapContainerRef.current || cafes.length === 0) return;

    try {
      const defaultCenter = new window.naver.maps.LatLng(
        cafes[0].lat || 37.5445,
        cafes[0].lng || 127.0560
      );

      const mapOptions = {
        center: defaultCenter,
        zoom: 14,
        minZoom: 10,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Clear old markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();

      const bounds = new window.naver.maps.LatLngBounds();

      // Create Markers
      cafes.forEach((cafe) => {
        if (!cafe.lat || !cafe.lng) return;

        const position = new window.naver.maps.LatLng(cafe.lat, cafe.lng);
        bounds.extend(position);

        const marker = new window.naver.maps.Marker({
          position,
          map,
          title: cafe.name,
          icon: {
            content: `
              <div class="cursor-pointer transition-transform transform hover:scale-110 flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-900 text-stone-100 text-xs font-semibold rounded-full shadow-md border ${
                selectedCafeId === cafe.id ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-900 text-white' : 'border-stone-700'
              }">
                <span class="w-2 h-2 rounded-full ${cafe.freshness.is_stale ? 'bg-amber-500' : 'bg-emerald-400'}"></span>
                <span>${cafe.name}</span>
              </div>
            `,
            anchor: new window.naver.maps.Point(40, 20),
          },
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (onSelectCafe) onSelectCafe(cafe.id);
        });

        markersRef.current.set(cafe.id, marker);
      });

      if (cafes.length > 1) {
        map.panToBounds(bounds);
      }
    } catch (e) {
      console.warn('Naver map init error, falling back to map preview:', e);
      setMapError(true);
    }
  }, [mapLoaded, mapError, cafes, selectedCafeId, onSelectCafe]);

  // Pan to selected cafe when selectedCafeId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCafeId) return;

    const targetCafe = cafes.find((c) => c.id === selectedCafeId);
    if (targetCafe && targetCafe.lat && targetCafe.lng) {
      const position = new window.naver.maps.LatLng(targetCafe.lat, targetCafe.lng);
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(16);
    }
  }, [selectedCafeId, cafes]);

  // Fallback Interactive Map View if script error or API Key missing
  if (mapError || !mapLoaded) {
    return (
      <div
        className={`relative w-full rounded-2xl bg-stone-900 border border-stone-800 p-6 flex flex-col justify-between overflow-hidden shadow-inner ${className}`}
        style={{ height }}
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#e7e5e4 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-stone-200 uppercase tracking-wider">
              NAVER Map Interactive View ({cafes.length} Cafes)
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
            {cafes[0]?.neighborhood || 'Seoul'}
          </span>
        </div>

        {/* Interactive marker pills */}
        <div className="relative z-10 my-auto py-4 flex flex-wrap gap-3 justify-center items-center">
          {cafes.map((cafe) => {
            const isSelected = selectedCafeId === cafe.id;
            return (
              <button
                key={cafe.id}
                onClick={() => onSelectCafe && onSelectCafe(cafe.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/30 scale-105 shadow-lg'
                    : 'bg-stone-850 hover:bg-stone-800 text-stone-200 border-stone-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    cafe.freshness.is_stale ? 'bg-amber-500' : 'bg-emerald-400'
                  }`}
                />
                <span>{cafe.name}</span>
                <span className="text-xs opacity-75">({cafe.name_local})</span>
              </button>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 border-t border-stone-800/80 pt-3">
          <span>Click cafe pin to select and inspect notes</span>
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(
              cafes[0]?.address || '성수동 카페'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:underline"
          >
            <span>Open Naver Map App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={`w-full rounded-2xl overflow-hidden shadow-lg border border-stone-800 ${className}`}
      style={{ height }}
    />
  );
}
