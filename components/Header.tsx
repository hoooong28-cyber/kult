'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, Bookmark, MessageSquarePlus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenReport?: () => void;
}

export default function Header({ onOpenReport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f5]/95 backdrop-blur-md border-b border-[#e5e2de] px-4 sm:px-8 py-3.5 transition-all shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#1c1c1a] text-[#fcf9f5] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#1c1c1a] tracking-tight">
                SEOUL EXPAT CAFES
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-[#f0ede9] text-[#444748] border border-[#e5e2de]">
                Curated
              </span>
            </div>
            <p className="text-xs text-[#5e5e5d] hidden xs:block">
              Neighborhood work & brunch spots tested by local expats
            </p>
          </div>
        </Link>

        {/* Action items */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#444748] px-3 py-1.5 rounded-full bg-[#f6f3ef] border border-[#e5e2de]">
            <Sparkles className="w-3.5 h-3.5 text-[#bf703a]" />
            <span className="font-medium">Human-Curated List</span>
          </div>

          <Link
            href="/archive"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1c1c1a] text-[#fcf9f5] hover:bg-[#31302e] transition-colors shadow-xs"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">My Archive</span>
            <span className="sm:hidden">Archive</span>
          </Link>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border border-[#c4c7c7] transition-colors shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#bf703a]" />
            <span className="hidden sm:inline">Suggest / Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
