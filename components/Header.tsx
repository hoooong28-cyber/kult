'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Sparkles, MessageSquarePlus, Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenReport?: () => void;
}

export default function Header({ onOpenReport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-850 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/10 group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-stone-100 tracking-tight">
                SEOUL EXPAT CAFES
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Curated
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden xs:block">
              Neighborhood work & brunch spots tested by local expats
            </p>
          </div>
        </Link>

        {/* Action items */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-Curated List</span>
          </div>

          <Link
            href="/archive"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors shadow-sm"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">My Archive</span>
            <span className="sm:hidden">Archive</span>
          </Link>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-750 transition-colors shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Suggest / Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
