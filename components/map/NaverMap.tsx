'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CuratedCafe } from '@/lib/types';
import { MapPin, ExternalLink } from 'lucide-react';

interface NaverMapProps {
  cafes: CuratedCafe[];
  selectedCafeId?: string | null;
  onSelectCafe?: (cafeId: string) => void;
  onSelectMarker?: (cafeId: string) => void;
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
  onSelectMarker,
  className = '',
  height = '450px',
}: NaverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

    if (window.naver && window.naver.maps) {
      setMapLoaded(true);
      return;
    }

    if (!clientId || clientId === 'your_naver_map_client_id') {
      setMapError(true);
      return;
    }

    // Intercept Naver Map alert box if authentication fails
    const originalAlert = window.alert;
    window.alert = (msg?: any) => {
      if (typeof msg === 'string' && msg.includes('네이버 지도')) {
        console.warn('Naver Map Auth Warning suppressed:', msg);
        setMapError(true);
        return;
      }
      originalAlert(msg);
    };

    const loadScript = (useNcpParam: boolean) => {
      const paramName = useNcpParam ? 'ncpClientId' : 'clientId';
      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${paramName}=${clientId}&submodules=geocoding`;
      script.async = true;
      script.onload = () => {
        window.alert = originalAlert;
        if (window.naver && window.naver.maps) {
          setMapLoaded(true);
        } else if (useNcpParam) {
          // Retry with clientId parameter if ncpClientId fails
          loadScript(false);
        } else {
          setMapError(true);
        }
      };
      script.onerror = () => {
        window.alert = originalAlert;
        if (useNcpParam) {
          loadScript(false);
        } else {
          setMapError(true);
        }
      };
      document.head.appendChild(script);
    };

    loadScript(true);

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || mapError || !mapContainerRef.current || cafes.length === 0) return;

    try {
      if (!window.naver || !window.naver.maps) {
        setMapError(true);
        return;
      }

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

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();

      const bounds = new window.naver.maps.LatLngBounds();

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
              <div class="cursor-pointer transition-transform transform hover:scale-105 flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1c1a] text-[#fcf9f5] text-xs font-semibold rounded-full shadow-sm border ${
                selectedCafeId === cafe.id ? 'border-[#bf703a] ring-2 ring-[#bf703a]/40 bg-[#1c1c1a]' : 'border-[#e5e2de]'
              }">
                <span class="w-2 h-2 rounded-full ${cafe.freshness.is_stale ? 'bg-[#bf703a]' : 'bg-[#137333]'}"></span>
                <span>${cafe.name}</span>
              </div>
            `,
            anchor: new window.naver.maps.Point(40, 20),
          },
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          const handleSelect = onSelectMarker || onSelectCafe;
          if (handleSelect) handleSelect(cafe.id);
        });

        markersRef.current.set(cafe.id, marker);
      });

      if (cafes.length > 1) {
        map.panToBounds(bounds);
      }
    } catch (e) {
      console.warn('Naver map init error, falling back to preview:', e);
      setMapError(true);
    }
  }, [mapLoaded, mapError, cafes, selectedCafeId, onSelectCafe]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCafeId) return;

    const targetCafe = cafes.find((c) => c.id === selectedCafeId);
    if (targetCafe && targetCafe.lat && targetCafe.lng) {
      const position = new window.naver.maps.LatLng(targetCafe.lat, targetCafe.lng);
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(16);
    }
  }, [selectedCafeId, cafes]);

  if (mapError || !mapLoaded) {
    return (
      <div
        className={`relative w-full rounded-2xl bg-[#ffffff] border border-[#e5e2de] p-6 flex flex-col justify-between overflow-hidden shadow-xs ${className}`}
        style={{ height }}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#706F6C 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#bf703a]" />
            <span className="text-xs font-mono font-semibold text-[#1c1c1a] uppercase tracking-wider">
              NAVER Map Interactive View ({cafes.length} Spots)
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#f6f3ef] text-[#5e5e5d] border border-[#e5e2de] font-mono">
            {cafes[0]?.neighborhood || 'Seoul'}
          </span>
        </div>

        <div className="relative z-10 my-auto py-4 flex flex-wrap gap-3 justify-center items-center">
          {cafes.map((cafe) => {
            const isSelected = selectedCafeId === cafe.id;
            return (
              <button
                key={cafe.id}
                onClick={() => onSelectCafe && onSelectCafe(cafe.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a] ring-2 ring-[#1c1c1a]/20 scale-105 shadow-sm font-semibold'
                    : 'bg-[#f6f3ef] hover:bg-[#eae6df] text-[#1c1c1a] border-[#e5e2de]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    cafe.freshness.is_stale ? 'bg-[#bf703a]' : 'bg-[#137333]'
                  }`}
                />
                <span>{cafe.name}</span>
                <span className="text-xs opacity-75 font-mono">({cafe.name_local})</span>
              </button>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-[#5e5e5d] border-t border-[#e5e2de] pt-3">
          <span>Click cafe pin to select and inspect notes</span>
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(
              cafes[0]?.address || '성수동 카페'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#1c1c1a] hover:text-[#bf703a] font-mono font-semibold hover:underline"
          >
            <span>Open Naver Map</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={`w-full rounded-2xl overflow-hidden shadow-xs border border-[#e5e2de] ${className}`}
      style={{ height }}
    />
  );
}
