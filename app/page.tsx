'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CuratorCard from '@/components/CuratorCard';
import NeighborhoodFilter from '@/components/NeighborhoodFilter';
import TagFilter from '@/components/TagFilter';
import CafeCard from '@/components/CafeCard';
import NaverMap from '@/components/map/NaverMap';
import ReportModal from '@/components/ReportModal';
import { CafeFilterParams, CuratedCafe, CuratorProfile } from '@/lib/types';
import { Map, LayoutGrid, Search, Sparkles, Coffee, UserCheck, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [allCurators, setAllCurators] = useState<CuratorProfile[]>([]);
  const [allCafes, setAllCafes] = useState<CuratedCafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<CuratedCafe[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [isReportOpen, setIsReportOpen] = useState(false);
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
          setAllCurators(data.curators || []);
          setAllCafes(data.cafes || []);
          setFilteredCafes(data.cafes || []);
          setNeighborhoods(data.neighborhoods || []);
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

    if (filters.kid_free_zone === true) {
      result = result.filter(
        (c) => c.tags.kid_free_zone === true || c.tags.kid_free_zone === null
      );
    }

    if (filters.good_for) {
      result = result.filter(
        (c) =>
          c.tags.good_for.length === 0 ||
          c.tags.good_for.some((g) => g.toLowerCase() === filters.good_for?.toLowerCase())
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

  const handleFilterChange = (updated: Partial<CafeFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({ neighborhood: selectedNeighborhood, search_query: '' });
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] text-[#1c1c1a] flex flex-col font-sans">
      <Header onOpenReport={() => setIsReportOpen(true)} />

      {/* Hero Header - Minimalist Editorial */}
      <section className="border-b border-[#e5e2de] bg-gradient-to-b from-[#f6f3ef] via-[#fcf9f5] to-[#fcf9f5] px-4 sm:px-8 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f6f3ef] text-[#bf703a] border border-[#e5e2de] text-xs font-mono font-bold mb-4">
              <Sparkles className="w-4 h-4 text-[#bf703a]" />
              <span>Phase 1: Curator Interview Magazine</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1c1a] mb-4 leading-tight">
              Whose List Do You Follow?
            </h1>
            <p className="text-[#5e5e5d] text-base leading-relaxed font-serif">
              Explore hand-picked Seoul cafe recommendations curated by real local personalities,
              coffee shop owners, and expat residents. No AI generated lists — only verified human taste.
            </p>
          </div>

          {/* 1. CURATOR SPOTLIGHT GRID */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-[#1c1c1a] uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#bf703a]" />
                <span>Featured Curators</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCurators.map((curator) => {
                const curatorCafeCount = allCafes.filter((c) =>
                  c.curated_by.includes(curator.id)
                ).length;

                return (
                  <CuratorCard
                    key={curator.id}
                    curator={curator}
                    cafeCount={curatorCafeCount}
                    featured={curator.id === 'founder'}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECONDARY FILTER & SEARCH BAR SECTION */}
      <section className="sticky top-[61px] z-30 bg-[#fcf9f5]/95 backdrop-blur-md border-b border-[#e5e2de] px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706F6C]" />
              <input
                type="text"
                value={filters.search_query || ''}
                onChange={(e) => handleFilterChange({ search_query: e.target.value })}
                placeholder="Search cafe name, Korean name (e.g. 쿠코), address, or interview notes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#ffffff] border border-[#e5e2de] text-[#1c1c1a] text-xs sm:text-sm placeholder:text-[#706F6C] focus:outline-none focus:border-[#1c1c1a] transition-colors shadow-xs"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#f6f3ef] p-1 rounded-xl border border-[#e5e2de] shrink-0 self-start sm:self-auto font-mono">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'split'
                    ? 'bg-[#1c1c1a] text-[#fcf9f5] shadow-xs'
                    : 'text-[#5e5e5d] hover:text-[#1c1c1a]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split View</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#1c1c1a] text-[#fcf9f5] shadow-xs'
                    : 'text-[#5e5e5d] hover:text-[#1c1c1a]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>List Only</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-[#1c1c1a] text-[#fcf9f5] shadow-xs'
                    : 'text-[#5e5e5d] hover:text-[#1c1c1a]'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map Only</span>
              </button>
            </div>
          </div>

          {/* Neighborhood & Tag Filters */}
          <NeighborhoodFilter
            neighborhoods={neighborhoods}
            selectedNeighborhood={selectedNeighborhood}
            onSelect={(nh) => setSelectedNeighborhood(nh)}
          />

          <TagFilter filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-10">
        {loading ? (
          <div className="py-20 text-center text-[#5e5e5d] text-sm font-mono">Loading Curator Lists...</div>
        ) : filteredCafes.length === 0 ? (
          <div className="py-20 text-center bg-[#ffffff] rounded-2xl border border-[#e5e2de] p-8 shadow-xs">
            <Coffee className="w-10 h-10 text-[#bf703a] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#1c1c1a] mb-1">
              No Cafes Found Matching Criteria
            </h3>
            <p className="text-xs text-[#5e5e5d] max-w-sm mx-auto mb-4">
              Try adjusting your noise level, district, or tag criteria.
            </p>
            <button
              onClick={() => {
                setSelectedNeighborhood('all');
                handleResetFilters();
              }}
              className="px-4 py-2 bg-[#1c1c1a] text-[#fcf9f5] font-semibold text-xs rounded-xl hover:bg-[#31302e] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Split View */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#5e5e5d] font-mono mb-2">
                    <span>
                      Showing <strong>{filteredCafes.length}</strong> curated spots
                    </span>
                    <span className="text-[#bf703a] font-medium">Click card to highlight on map</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredCafes.map((cafe) => (
                      <CafeCard
                        key={cafe.id}
                        cafe={cafe}
                        isSelected={selectedCafeId === cafe.id}
                        onSelect={() => setSelectedCafeId(cafe.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 sticky top-[180px]">
                  <div className="mb-2 text-xs font-mono font-semibold text-[#5e5e5d] uppercase tracking-wider flex items-center justify-between">
                    <span>NAVER Maps Interactive</span>
                    <span className="text-[11px] font-normal text-[#bf703a]">
                      {selectedCafeId ? 'Target Selected' : 'All Spots'}
                    </span>
                  </div>
                  <NaverMap
                    cafes={filteredCafes}
                    selectedCafeId={selectedCafeId}
                    onSelectCafe={(id) => setSelectedCafeId(id)}
                    height="540px"
                  />
                </div>
              </div>
            )}

            {/* List Only View */}
            {viewMode === 'list' && (
              <div>
                <div className="text-xs text-[#5e5e5d] font-mono mb-4">
                  Showing <strong>{filteredCafes.length}</strong> spots in{' '}
                  {selectedNeighborhood === 'all' ? 'All Districts' : selectedNeighborhood}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCafes.map((cafe) => (
                    <CafeCard
                      key={cafe.id}
                      cafe={cafe}
                      isSelected={selectedCafeId === cafe.id}
                      onSelect={() => setSelectedCafeId(cafe.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Map Only View */}
            {viewMode === 'map' && (
              <div>
                <div className="text-xs text-[#5e5e5d] font-mono mb-3">
                  Showing <strong>{filteredCafes.length}</strong> spots on NAVER Maps
                </div>
                <NaverMap
                  cafes={filteredCafes}
                  selectedCafeId={selectedCafeId}
                  onSelectCafe={(id) => setSelectedCafeId(id)}
                  height="650px"
                />
              </div>
            )}
          </div>
        )}

        {/* 3. PHASE 2 TEASER CTA */}
        <section className="p-8 rounded-3xl bg-[#ffffff] border border-[#e5e2de] text-center space-y-3 relative overflow-hidden shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f3ef] text-[#bf703a] border border-[#e5e2de] text-xs font-mono font-semibold">
            <HeartHandshake className="w-4 h-4 text-[#bf703a]" />
            <span>Phase 2 Teaser: Personal Taste Lists</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c1a]">
            What is Your Favorite Seoul Cafe List?
          </h3>
          <p className="text-[#5e5e5d] text-sm max-w-xl mx-auto leading-relaxed font-serif">
            Soon, you will be able to log in, save your personal favorite cafe lists, and compare your taste similarity with other Seoul residents.
          </p>
          <button
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1c1a] text-[#fcf9f5] hover:bg-[#31302e] font-semibold text-xs transition-colors shadow-xs"
          >
            <span>Suggest a Curator or Spot</span>
          </button>
        </section>
      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
}
