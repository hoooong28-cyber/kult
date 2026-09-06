'use client';

import React from 'react';
import { Wifi, Plug, Volume2, Baby, Globe, CreditCard, Laptop, Heart, User } from 'lucide-react';
import { CafeFilterParams, NoiseLevel, OutletAvailability } from '@/lib/types';

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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <Plug className="w-3.5 h-3.5 text-amber-400" />
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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <Laptop className="w-3.5 h-3.5 text-amber-400" />
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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <User className="w-3.5 h-3.5 text-amber-400" />
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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <Heart className="w-3.5 h-3.5 text-amber-400" />
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
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/50'
            : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 border-stone-800'
        }`}
      >
        <Baby className="w-3.5 h-3.5 text-amber-400" />
        <span>Kid-Free Zone</span>
      </button>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="text-xs text-stone-400 hover:text-stone-200 underline ml-2 py-1"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
