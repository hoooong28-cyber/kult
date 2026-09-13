'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CafeCard from '@/components/CafeCard';
import NaverMap from '@/components/map/NaverMap';
import ReportModal from '@/components/ReportModal';
import { CafeFilterParams, CuratedCafe } from '@/lib/types';
import { toggleSaveCafe, isCafeSaved, subscribeArchiveChanges } from '@/lib/archiveStore';
import { Map, LayoutGrid, Search, Sparkles, Coffee, ArrowRight, Sun, Volume2, Plug, Bookmark, Check } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [allCafes, setAllCafes] = useState<CuratedCafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<CuratedCafe[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [showFullMap, setShowFullMap] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedAnthracite, setSavedAnthracite] = useState(false);

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

    // Saved state check for hero spot
    setSavedAnthracite(isCafeSaved('cuco-seongsu'));
    const unsubscribe = subscribeArchiveChanges(() => {
      setSavedAnthracite(isCafeSaved('cuco-seongsu'));
    });
    return () => unsubscribe();
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

  const handleFilterChange = (updated: Partial<CafeFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({ neighborhood: 'all', search_query: '' });
    setSelectedNeighborhood('all');
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#1C1C1A] flex flex-col font-sans selection:bg-[#BF703A] selection:text-white pb-24">
      <Header onOpenReport={() => setIsReportOpen(true)} />

      {/* TOP MARQUEE UTILITY BAR */}
      <div className="border-b border-[#E6DFD3] bg-[#FCF9F5] px-4 md:px-12 py-2 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#5E5E5D]">
        <div className="flex items-center gap-4">
          <span className="font-medium text-[#1C1C1A]">SEOUL GAZETTE</span>
          <span className="w-1 h-1 rounded-full bg-[#D5CDC0]"></span>
          <span className="flex items-center gap-1.5 text-[#1C1C1A] font-medium">
            <Sun className="w-3.5 h-3.5 text-[#BF703A]" />
            18°C SUNNY · CRISP MORNING
          </span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#D5CDC0]"></span>
          <span className="hidden sm:inline">AUTUMN ISSUE NO. 14</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline hover:text-[#1C1C1A] transition-colors cursor-pointer">
            PRINT EDITION IN STORES
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D5CDC0] hidden md:inline"></span>
          <Link href="/archive" className="flex items-center gap-2 text-[#1C1C1A] hover:text-[#BF703A] transition-colors font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            MY ARCHIVE
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-12 pt-8 space-y-16 flex-1 w-full">
        {/* HERO COVER STORY SPREAD */}
        <section id="cover-story" className="relative group">
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#E6DFD3] bg-[#1C1C1A] shadow-sm">
            <div className="aspect-[16/9] md:aspect-[21/9] w-full relative">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80"
                alt="Anthracite Seogyo Zen Courtyard"
                className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/95 via-[#1C1C1A]/40 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-[#FCF9F5] flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#D98952]">
                  <span className="px-2 py-0.5 border border-[#D98952]/40 rounded">COVER STORY</span>
                  <span>SPECIAL ISSUE · SEOUL 2026</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCF9F5] leading-[1.1]">
                  The Quiet Living &amp; Roastery Index
                </h2>
                <p className="font-serif text-[#FCF9F5]/85 text-base md:text-xl font-light italic leading-relaxed pt-1">
                  "Curated sanctuaries for slow living, writing, and specialty filter coffee across historic quarters of Seoul."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                <div className="text-right hidden lg:block border-r border-[#FCF9F5]/20 pr-6">
                  <div className="text-[11px] tracking-[0.16em] uppercase text-[#FCF9F5]/60">FEATURING</div>
                  <div className="font-serif text-[#FCF9F5] text-lg">앤트러사이트 서교</div>
                  <div className="text-[11px] text-[#D98952] font-mono">280 LUX · 40dB SILENCE</div>
                </div>
                <a href="#editor-story" className="inline-flex items-center gap-3 bg-[#FCF9F5] text-[#1C1C1A] hover:bg-[#BF703A] hover:text-white px-6 py-3.5 rounded-full text-xs font-semibold tracking-[0.14em] uppercase transition-all shadow-md">
                  <span>Read Full Cover Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: LEAD EDITOR'S CHOICE FEATURE STORY */}
        <section id="editor-story" className="space-y-8">
          <div className="flex items-end justify-between border-b-2 border-[#1C1C1A] pb-4">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#BF703A]">SECTION 01 / EDITORIAL ESSAY</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1A] mt-1">
                Lead Curator's Choice
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5E5E5D] uppercase tracking-widest hidden sm:inline">VERIFIED REPORT · MAPO-GU</span>
          </div>

          <div className="bg-[#F7F3EC] border border-[#E6DFD3] rounded-2xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Story Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 bg-[#1C1C1A] text-[#FCF9F5] rounded text-[10px] font-mono tracking-widest uppercase">SPOT NO. 01</span>
                <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-[#5E5E5D]">SEOGYO-DONG, MAPO</span>
                <span className="w-1 h-1 rounded-full bg-[#D5CDC0]"></span>
                <span className="text-[12px] font-mono text-[#BF703A] font-semibold">★ 98% TASTE MATCH</span>
              </div>

              <h4 className="font-serif text-3xl md:text-4xl font-normal text-[#1C1C1A] leading-tight">
                앤트러사이트 서교: <br/>
                <span className="italic font-light text-[#5E5E5D]">Silence, Pine Garden &amp; Tactile Timber</span>
              </h4>

              <blockquote className="border-l-2 border-[#BF703A] pl-5 py-1 my-4 italic font-serif text-lg md:text-xl text-[#1C1C1A]/90">
                "Where soft jazz meets quiet courtyard views. No loud espresso machines; each cup of Ethiopian Geisha is poured with ceremonial deliberation onto solid dark timber."
              </blockquote>

              <p className="text-sm md:text-base text-[#5E5E5D] leading-relaxed font-sans">
                Originally a private villa built in the 1970s, Anthracite Seogyo reinterprets the Korean domestic garden into a multi-tiered sanctuary of absolute calm. Natural western sunlight filters through dense black pine branches, creating an ideal 280-lux illumination for reading, notebook journaling, and thoughtful discourse.
              </p>

              {/* Curator Badge & Verification */}
              <div className="pt-4 border-t border-[#E6DFD3] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Min-Ji Eleanor Song"
                    className="w-11 h-11 rounded-full object-cover border border-[#E6DFD3]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1C1C1A] flex items-center gap-1.5">
                      Min-Ji Eleanor Song
                      <span className="text-[10px] font-mono font-normal text-[#5E5E5D]">(@editor.seohyun)</span>
                    </div>
                    <div className="text-[11px] text-[#5E5E5D]">Senior Editorial Essayist · 48 Sanctuaries Catalogued</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-[#FCF9F5] border border-[#E6DFD3] px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-[#BF703A]" />
                    <span className="text-xs font-mono font-semibold text-[#1C1C1A]">45 dB Quiet</span>
                  </div>
                  <div className="bg-[#FCF9F5] border border-[#E6DFD3] px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-[#BF703A]" />
                    <span className="text-xs font-mono font-semibold text-[#1C1C1A]">햇살 채광 · 좌석 여유</span>
                  </div>
                  <button
                    onClick={() => toggleSaveCafe('cuco-seongsu')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
                      savedAnthracite
                        ? 'bg-[#BF703A] text-white'
                        : 'bg-[#1C1C1A] hover:bg-[#BF703A] text-[#FCF9F5]'
                    }`}
                  >
                    {savedAnthracite ? 'Saved' : 'Save Spot'}
                  </button>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-5 relative space-y-4">
              <div className="rounded-xl overflow-hidden border border-[#E6DFD3] shadow-sm aspect-[4/3] relative">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
                  alt="Anthracite Seogyo Garden View"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#1C1C1A]/80 backdrop-blur-sm text-[#FCF9F5] px-3 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
                  FIG 01. 2F GARDEN OVERLOOK
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-[#FCF9F5] p-3 rounded-lg border border-[#E6DFD3]">
                  <span className="text-[10px] uppercase tracking-wider text-[#5E5E5D] block mb-1">ACOUSTIC RHYTHM</span>
                  <span className="font-medium text-[#1C1C1A]">Subtle Low Vinyl Jazz</span>
                </div>
                <div className="bg-[#FCF9F5] p-3 rounded-lg border border-[#E6DFD3]">
                  <span className="text-[10px] uppercase tracking-wider text-[#5E5E5D] block mb-1">SIGNATURE PAIRING</span>
                  <span className="font-medium text-[#1C1C1A]">Ethiopia Yirgacheffe Drip</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: VISUAL EDITORIAL PORTFOLIOS GRID */}
        <section id="portfolios" className="space-y-8">
          <div className="flex items-end justify-between border-b-2 border-[#1C1C1A] pb-4">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#BF703A]">SECTION 02 / CURATED COLLECTIONS</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1A] mt-1">
                Thematic Issue Portfolios
              </h3>
            </div>
            <span className="text-xs font-medium text-[#5E5E5D]">3 THEMATIC SPREADS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collection 01 */}
            <article className="bg-[#F7F3EC] border border-[#E6DFD3] rounded-2xl overflow-hidden group flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="Solo Writing Sanctuaries"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1C1A]/85 backdrop-blur-sm text-[#FCF9F5] px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
                    COLLECTION 01
                  </div>
                  <div className="absolute top-3 right-3 bg-[#FCF9F5]/90 backdrop-blur-sm text-[#1C1C1A] px-2.5 py-1 rounded text-[10px] font-mono font-bold">
                    14 SPACES
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-serif text-2xl font-bold text-[#1C1C1A] group-hover:text-[#BF703A] transition-colors leading-snug">
                    혼자만의 몰입과 글쓰기
                  </h4>
                  <p className="font-serif italic text-[#5E5E5D] text-sm leading-relaxed">
                    "Where low-volume acoustics, generous desk depth, and morning sunlight allow sustained creative focus."
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#E6DFD3] flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D]">CURATED BY @YOONA.ARCH</span>
                <Link href="/archive" className="text-xs font-bold text-[#1C1C1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Portfolio →
                </Link>
              </div>
            </article>

            {/* Collection 02 */}
            <article className="bg-[#F7F3EC] border border-[#E6DFD3] rounded-2xl overflow-hidden group flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
                    alt="Seongsu Roastery Tour"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1C1A]/85 backdrop-blur-sm text-[#FCF9F5] px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
                    COLLECTION 02
                  </div>
                  <div className="absolute top-3 right-3 bg-[#FCF9F5]/90 backdrop-blur-sm text-[#1C1C1A] px-2.5 py-1 rounded text-[10px] font-mono font-bold">
                    19 SPACES
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-serif text-2xl font-bold text-[#1C1C1A] group-hover:text-[#BF703A] transition-colors leading-snug">
                    성수 &amp; 한남 로스터리 투어
                  </h4>
                  <p className="font-serif italic text-[#5E5E5D] text-sm leading-relaxed">
                    "Raw poured concrete meets single-origin micro lot roasting, handcrafted wooden bars, and vintage audio."
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#E6DFD3] flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D]">CURATED BY @DAVID.VANCE</span>
                <Link href="/archive" className="text-xs font-bold text-[#1C1C1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Portfolio →
                </Link>
              </div>
            </article>

            {/* Collection 03 */}
            <article className="bg-[#F7F3EC] border border-[#E6DFD3] rounded-2xl overflow-hidden group flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"
                    alt="Rainy Day Hanok Courtyards"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1C1A]/85 backdrop-blur-sm text-[#FCF9F5] px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
                    COLLECTION 03
                  </div>
                  <div className="absolute top-3 right-3 bg-[#FCF9F5]/90 backdrop-blur-sm text-[#1C1C1A] px-2.5 py-1 rounded text-[10px] font-mono font-bold">
                    08 SPACES
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-serif text-2xl font-bold text-[#1C1C1A] group-hover:text-[#BF703A] transition-colors leading-snug">
                    주말 비오는 날 생각나는 한옥
                  </h4>
                  <p className="font-serif italic text-[#5E5E5D] text-sm leading-relaxed">
                    "Listening to rainwater cascade off traditional eaves in Bukchon and Seochon over slow steamed tea."
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#E6DFD3] flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D]">CURATED BY @SORA.CHOI</span>
                <Link href="/archive" className="text-xs font-bold text-[#1C1C1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Portfolio →
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION 3: CITY GAZETTE & INTERACTIVE MAP EXPLORATION */}
        <section id="map-explore" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#1C1C1A] pb-4 gap-4">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#BF703A]">SECTION 03 / CARTOGRAPHY &amp; DIRECTORY</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1A] mt-1">
                Seoul City Gazette &amp; Cartography
              </h3>
            </div>

            <button
              onClick={() => setShowFullMap(!showFullMap)}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} isSelected={selectedCafeId === cafe.id} onSelect={() => setSelectedCafeId(cafe.id)} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 4: EDITORIAL CONTRIBUTOR CALLOUT BANNER */}
        <section id="contribute" className="relative overflow-hidden rounded-2xl border-2 border-[#1C1C1A] bg-[#1C1C1A] text-[#FCF9F5] p-8 md:p-12">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#BF703A]"></div>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-mono tracking-widest uppercase text-[#D98952] font-semibold">
                <span>CALL FOR EDITORIAL CURATORS</span>
                <span>·</span>
                <span>ISSUE NO. 15 DISPATCH</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-[#FCF9F5]">
                Join KULT Editorial Staff — <br />
                <span className="italic font-light text-[#D5CDC0]">Submit Your Curated Seoul Gazette</span>
              </h3>
              <p className="font-serif text-[#FCF9F5]/75 text-sm md:text-base font-light italic max-w-xl">
                "We review recommendations from long-term nomad researchers, architects, and local designers. Submit an acoustic work sanctuary with verified decibels and outlet counts."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button
                onClick={() => setIsReportOpen(true)}
                className="bg-[#BF703A] hover:bg-[#D98952] text-white font-semibold px-6 py-3.5 rounded-full text-xs tracking-wider uppercase transition-all shadow-md whitespace-nowrap"
              >
                Submit Recommendation
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER & COLOPHON */}
      <footer className="max-w-7xl mx-auto px-4 md:px-12 pt-16 mt-16 border-t border-[#E6DFD3] text-[#5E5E5D] text-xs space-y-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="font-serif text-2xl font-bold text-[#1C1C1A]">KULT | SEOUL</div>
            <p className="font-serif italic text-[#5E5E5D] leading-relaxed">
              A quarterly visual gazette on quiet living, tactile workspaces, and specialty coffee architecture in Seoul.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-widest text-[#1C1C1A] font-bold mb-3">GAZETTE INDEX</h5>
            <ul className="space-y-2">
              <li><Link href="/archive" className="hover:text-[#1C1C1A] transition-colors">Vol. 14: Autumn Sanctuaries</Link></li>
              <li><Link href="/archive" className="hover:text-[#1C1C1A] transition-colors">Vol. 13: The Coffee Cellars</Link></li>
              <li><Link href="/archive" className="hover:text-[#1C1C1A] transition-colors">Vol. 12: Hanok Wind &amp; Tea</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-widest text-[#1C1C1A] font-bold mb-3">CURATOR NETWORK</h5>
            <ul className="space-y-2">
              <li><span className="text-[#1C1C1A] font-medium">Eleanor Song (Editorial Lead)</span></li>
              <li><span className="text-[#1C1C1A] font-medium">David Vance (Architecture)</span></li>
              <li><span className="text-[#1C1C1A] font-medium">Sora Choi (Literary &amp; Books)</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-widest text-[#1C1C1A] font-bold mb-3">PUBLICATION COLOPHON</h5>
            <p className="text-[11px] leading-relaxed text-[#5E5E5D]">
              Published quarterly in Yongsan-gu, Seoul. Printed on FSC certified 120gsm unbleached paper. Distributed globally to independent bookshops.
            </p>
            <div className="pt-3 font-mono text-[10px] text-[#1C1C1A]">ISSN 2984-1849 · SEOUL, KOREA</div>
          </div>
        </div>

        <div className="border-t border-[#E6DFD3] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5E5E5D] gap-4 pb-8">
          <div>© 2026 KULT Magazine Publishing Co. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#1C1C1A] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#1C1C1A] cursor-pointer">Terms of Curation</span>
          </div>
        </div>
      </footer>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
}
