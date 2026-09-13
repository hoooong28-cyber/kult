'use client';

import React from 'react';
import { Plug, Volume2, Baby, Globe, Laptop, Heart, User } from 'lucide-react';
import { CafeFilterParams } from '@/lib/types';

interface TagFilterProps {
  filters: CafeFilterParams;
  onChange: (updatedFilters: Partial<CafeFilterParams>) => void;
  onReset: () => void;
}

export default function TagFilter({ filters, onChange, onReset }: TagFilterProps) {
  const isQuiet = filters.noise_level === 'quiet';
  const hasOutlets = filters.outlet_availability === 'many' || filters.outlet_availability === 'few';
  const isEnglishMenu = filters.english_menu === true;
  const isKidFree = filters.kid_free_zone === true;
  const isWork = filters.good_for === 'work';
  const isSolo = filters.good_for === 'solo';
  const isDate = filters.good_for === 'date';

  const hasActiveFilters =
    isQuiet || hasOutlets || isEnglishMenu || isKidFree || isWork || isSolo || isDate;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      {/* Quiet Filter */}
      <button
        onClick={() =>
          onChange({
            noise_level: isQuiet ? 'unknown' : 'quiet',
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isQuiet
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>Quiet Noise</span>
      </button>

      {/* Outlets Filter */}
      <button
        onClick={() =>
          onChange({
            outlet_availability: hasOutlets ? 'unknown' : 'many',
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          hasOutlets
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <Plug className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>Power Outlets</span>
      </button>

      {/* English Menu Filter */}
      <button
        onClick={() =>
          onChange({
            english_menu: isEnglishMenu ? undefined : true,
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isEnglishMenu
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>English Menu</span>
      </button>

      {/* Work / Laptop Friendly */}
      <button
        onClick={() =>
          onChange({
            good_for: isWork ? undefined : 'work',
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isWork
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <Laptop className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>Laptop / Work</span>
      </button>

      {/* Solo Friendly */}
      <button
        onClick={() =>
          onChange({
            good_for: isSolo ? undefined : 'solo',
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isSolo
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <User className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>Solo Friendly</span>
      </button>

      {/* Date Spot */}
      <button
        onClick={() =>
          onChange({
            good_for: isDate ? undefined : 'date',
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isDate
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <Heart className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>Date Spot</span>
      </button>

      {/* Kid Free Zone */}
      <button
        onClick={() =>
          onChange({
            kid_free_zone: isKidFree ? undefined : true,
          })
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isKidFree
            ? 'bg-[#1c1c1a] text-[#fcf9f5] border-[#1c1c1a]'
            : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border-[#e5e2de]'
        }`}
      >
        <Baby className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>Kid-Free Zone</span>
      </button>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="text-xs text-[#706F6C] hover:text-[#1c1c1a] underline ml-2 py-1"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
