'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CafeCard from '@/components/CafeCard';
import VenuePhoto from '@/components/VenuePhoto';
import { getVenuePhoto } from '@/lib/venuePhotos';
import { track } from '@/lib/interactions';
import NaverMap from '@/components/map/NaverMap';
import ReportModal from '@/components/ReportModal';
import AuthModal from '@/components/AuthModal';
import CreatePostModal from '@/components/CreatePostModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import { CafeFilterParams, CuratedCafe } from '@/lib/types';
import { Map, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [allCafes, setAllCafes] = useState<CuratedCafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<CuratedCafe[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [showFullMap, setShowFullMap] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<CafeFilterParams>({
    neighborhood: 'all',
    search_query: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/cafes');
        if (res.ok) {
          const data = await res.json();
          const existingCafes: CuratedCafe[] = (data.cafes || []).filter((c: CuratedCafe) => c.content_status !== 'discovered' && !c.is_demo && c.business_status !== 'closed');
          setAllCafes(existingCafes);
          setFilteredCafes(existingCafes);
          setNeighborhoods([...new Set(existingCafes.map(c => c.neighborhood))]);
        }
      } catch (e) {
        console.error('Failed to load cafe data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();

  }, []);

  useEffect(() => {
    let result = [...allCafes];

    if (selectedNeighborhood !== 'all') {
      result = result.filter(
        (c) => c.neighborhood.toLowerCase() === selectedNeighborhood.toLowerCase()
      );
    }

    if (filters.noise_level === 'quiet') {
      result = result.filter(
        (c) => c.tags.noise_level === 'quiet' || c.tags.noise_level === 'unknown'
      );
    }

    if (filters.outlet_availability === 'many' || filters.outlet_availability === 'few') {
      result = result.filter(
        (c) =>
          c.tags.outlet_availability === 'many' ||
          c.tags.outlet_availability === 'few' ||
          c.tags.outlet_availability === 'unknown'
      );
    }

    if (filters.english_menu === true) {
      result = result.filter(
        (c) => c.tags.english_menu === true || c.tags.english_menu === null
      );
    }

    if (filters.search_query) {
      const q = filters.search_query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.name_local.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q)
      );
    }

    setFilteredCafes(result);
  }, [allCafes, selectedNeighborhood, filters]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#map-explore') {
      setShowFullMap(true);
      setTimeout(() => {
        const el = document.getElementById('map-explore');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, []);

  const handleToggleMap = () => {
    if (!showFullMap) track('map_open', {recommendation_source: 'map'});
    setShowFullMap(true);
    setTimeout(() => {
      const el = document.getElementById('map-explore');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFilterChange = (updated: Partial<CafeFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({ neighborhood: 'all', search_query: '' });
    setSelectedNeighborhood('all');
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#1C1C1A] flex flex-col font-sans selection:bg-[#BF703A] selection:text-white pb-28 md:pb-24">
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-7 space-y-14 flex-1 w-full">
        <section id="cover-story" lang="ko" className="grid items-center gap-6 rounded-2xl border border-[var(--kult-rule)] bg-[var(--kult-cream)] px-5 py-8 sm:px-8 lg:grid-cols-2 lg:py-11">
          <div>
            <p lang="en" className="text-xs font-bold tracking-[.2em] text-[var(--kult-accent-text)]">KULT / THE SEOUL EDIT</p>
            <h1 className="my-4 text-5xl md:text-7xl leading-[.99] tracking-[-.06em] font-serif font-bold max-md:text-[clamp(1.625rem,1.2rem_+_2vw,1.875rem)] max-md:leading-[1.23] max-md:tracking-[-.038em] max-md:[overflow-wrap:anywhere]">우리, 오늘<br/>어디 갈래<span className="text-[var(--kult-accent-text)]">?</span></h1>
            <p className="mb-5 text-sm leading-relaxed text-[var(--kult-muted)] max-md:text-base">동네와 약속에 맞는 공간을 골라, 친구에게 보내요.<span lang="en" className="block text-xs mt-1">Find a place to meet in Seoul.</span></p>
            <div className="flex flex-wrap gap-2">
              <Link href="/picks/seongsu-brunch-or-coffee" className="min-h-11 inline-flex items-center rounded-full bg-[var(--kult-ink)] px-4 text-[var(--kult-paper)] text-sm font-bold">성수 약속 ↗</Link>
              <Link href="/discoveries#pick-two" className="min-h-11 inline-flex items-center rounded-full border border-[var(--kult-rule)] px-4 text-[var(--kult-ink)] text-sm font-bold">다른 동네</Link>
              <Link href="/picks/samgakji" className="min-h-11 inline-flex items-center px-1 text-[var(--kult-muted)] text-xs font-semibold underline underline-offset-4">삼각지 약속 ↗</Link>
            </div>
          </div>
          {allCafes.filter(cafe => cafe.id === 'cuco-seongsu' && getVenuePhoto(cafe)).map(cafe => <div key={cafe.id}>
            <VenuePhoto cafe={cafe} variant="editorial" />
            <Link href="/picks/seongsu-brunch-or-coffee?purpose=date" className="inline-flex min-h-11 items-center mt-1 text-xs text-[var(--kult-accent-text)] font-bold">사진 속 장소 · 쿠코 성수 ↗</Link>
          </div>)}
        </section>

        {/* SECTION 3: CITY GAZETTE & INTERACTIVE MAP EXPLORATION */}
        <section id="map-explore" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#1C1C1A] pb-4 gap-4">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[var(--kult-accent-text)]">SECTION 03 / CARTOGRAPHY &amp; DIRECTORY</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight max-md:text-[1.375rem] text-[#1C1C1A] mt-1">
                Seoul City Gazette &amp; Cartography
              </h3>
            </div>

            <button
              onClick={() => { if (!showFullMap) track('map_open', {recommendation_source: 'editorial'}); setShowFullMap(!showFullMap); }}
              className="inline-flex items-center gap-2 bg-[#1C1C1A] hover:bg-[#BF703A] text-[#FCF9F5] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-colors self-start sm:self-auto"
            >
              <Map className="w-4 h-4" />
              <span>{showFullMap ? 'Hide Cartographic Map' : 'Expand Full Cartographic Map'}</span>
            </button>
          </div>

          {/* Search & Neighborhood Selector */}
          <div className="bg-[#F7F3EC] border border-[#E6DFD3] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="w-4 h-4 text-[#5E5E5D] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.search_query || ''}
                  onChange={(e) => handleFilterChange({ search_query: e.target.value })}
                  placeholder="공간명, 동네, 분위기 검색 (예: 앤트러사이트, 성수, 로스터리)..."
                  className="w-full pl-11 pr-4 py-3 bg-[#FCF9F5] border border-[#E6DFD3] rounded-xl text-sm font-sans focus:outline-none focus:border-[#1C1C1A] transition-colors placeholder:text-[#5E5E5D]/60"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-1/2 overflow-x-auto pb-1 md:pb-0 text-xs">
                <button
                  onClick={() => setSelectedNeighborhood('all')}
                  className={`px-4 py-2 font-semibold rounded-full whitespace-nowrap transition-colors ${
                    selectedNeighborhood === 'all'
                      ? 'bg-[#1C1C1A] text-[#FCF9F5]'
                      : 'bg-[#FCF9F5] border border-[#E6DFD3] text-[#1C1C1A] hover:border-[#1C1C1A]'
                  }`}
                >
                  All Quarters ({allCafes.length})
                </button>
                {neighborhoods.map((nh) => (
                  <button
                    key={nh}
                    onClick={() => setSelectedNeighborhood(nh)}
                    className={`px-4 py-2 font-medium rounded-full whitespace-nowrap transition-colors capitalize ${
                      selectedNeighborhood === nh
                        ? 'bg-[#1C1C1A] text-[#FCF9F5]'
                        : 'bg-[#FCF9F5] border border-[#E6DFD3] text-[#1C1C1A] hover:border-[#1C1C1A]'
                    }`}
                  >
                    {nh}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Full Map or 2-Column Cards */}
          {showFullMap ? (
            <div className="bg-[#ffffff] border border-[#E6DFD3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-[#1C1C1A]">Seoul Cartographic Live View</h4>
                <span className="text-xs font-mono text-[#5E5E5D]">{filteredCafes.length} SPACES PINNED</span>
              </div>
              <NaverMap cafes={filteredCafes} selectedCafeId={selectedCafeId} onSelectMarker={(id) => setSelectedCafeId(id)} height="650px" />
            </div>
          ) : filteredCafes.length === 0 ? (
            <p role="status" className="text-sm text-[var(--kult-muted)]">{loading ? '장소를 불러오는 중이에요.' : '이 조건에 맞는 장소가 아직 없어요.'}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCafes.map((cafe) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  source={filters.search_query ? 'search' : 'editorial'}
                  isSelected={selectedCafeId === cafe.id}
                  onSelect={() => setSelectedCafeId(cafe.id)}
                  onRequireAuth={() => setIsAuthOpen(true)}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        cafes={allCafes}
      />

      <MobileBottomNav
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onToggleMap={handleToggleMap}
        isMapActive={showFullMap}
      />
    </div>
  );
}
