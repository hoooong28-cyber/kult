'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface NeighborhoodFilterProps {
  neighborhoods: string[];
  selectedNeighborhood: string;
  onSelect: (neighborhood: string) => void;
}

export default function NeighborhoodFilter({
  neighborhoods,
  selectedNeighborhood,
  onSelect,
}: NeighborhoodFilterProps) {
  const options = ['all', ...neighborhoods];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-1 text-xs font-semibold text-stone-400 uppercase tracking-wider pr-2 border-r border-stone-800 shrink-0">
        <MapPin className="w-3.5 h-3.5 text-amber-400" />
        <span>District:</span>
      </div>

      {options.map((nh) => {
        const isSelected = selectedNeighborhood.toLowerCase() === nh.toLowerCase();
        const displayName = nh === 'all' ? 'All Neighborhoods' : nh;

        return (
          <button
            key={nh}
            onClick={() => onSelect(nh)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20 ring-1 ring-amber-300'
                : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800'
            }`}
          >
            {displayName}
          </button>
        );
      })}
    </div>
  );
}
