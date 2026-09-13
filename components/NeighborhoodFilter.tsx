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
      <div className="flex items-center gap-1 text-xs font-mono font-semibold text-[#706F6C] uppercase tracking-wider pr-2 border-r border-[#e5e2de] shrink-0">
        <MapPin className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>District:</span>
      </div>

      {options.map((nh) => {
        const isSelected = selectedNeighborhood.toLowerCase() === nh.toLowerCase();
        const displayName = nh === 'all' ? 'All Neighborhoods' : nh;

        return (
          <button
            key={nh}
            onClick={() => onSelect(nh)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all ${
              isSelected
                ? 'bg-[#1c1c1a] text-[#fcf9f5] shadow-xs'
                : 'bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border border-[#e5e2de]'
            }`}
          >
            {displayName}
          </button>
        );
      })}
    </div>
  );
}
