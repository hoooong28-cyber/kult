'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map, Bookmark, PlusCircle, User, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenAuth?: () => void;
  onOpenCreatePost?: () => void;
  onToggleMap?: () => void;
  isMapActive?: boolean;
}

export default function MobileBottomNav({
  onOpenAuth,
  onOpenCreatePost,
  onToggleMap,
  isMapActive = false,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isArchive = pathname === '/archive';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FCF9F5]/95 backdrop-blur-lg border-t border-[#E6DFD3] px-2 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none">
      {/* 1. Home / Gazette */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isHome && !isMapActive
            ? 'text-[#BF703A] font-bold'
            : 'text-[#5E5E5D] hover:text-[#1C1C1A]'
        }`}
      >
        <Compass className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] font-mono tracking-tight">Gazette</span>
      </Link>

      {/* 2. Map View Toggle */}
      {onToggleMap && (
        <button
          onClick={onToggleMap}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isMapActive
              ? 'text-[#BF703A] font-bold'
              : 'text-[#5E5E5D] hover:text-[#1C1C1A]'
          }`}
        >
          <Map className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-mono tracking-tight">
            {isMapActive ? 'List' : 'Map'}
          </span>
        </button>
      )}

      {/* 3. Create Post (Floating Primary Action) */}
      <button
        onClick={onOpenCreatePost || onOpenAuth}
        className="flex flex-col items-center justify-center -mt-5"
        title="Post New Space"
      >
        <div className="w-12 h-12 rounded-full bg-[#1C1C1A] text-[#FCF9F5] shadow-md flex items-center justify-center hover:bg-[#BF703A] active:scale-95 transition-all border-2 border-[#FCF9F5]">
          <PlusCircle className="w-6 h-6 text-[#FCF9F5]" />
        </div>
        <span className="text-[10px] font-mono font-semibold text-[#1C1C1A] mt-0.5">
          Write
        </span>
      </button>

      {/* 4. My Archive & Taste Twins */}
      <Link
        href="/archive"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isArchive
            ? 'text-[#BF703A] font-bold'
            : 'text-[#5E5E5D] hover:text-[#1C1C1A]'
        }`}
      >
        <Bookmark className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] font-mono tracking-tight">Archive</span>
      </Link>

      {/* 5. Account / Profile */}
      <button
        onClick={onOpenAuth}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#5E5E5D] hover:text-[#1C1C1A] transition-all"
      >
        <User className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] font-mono tracking-tight">Account</span>
      </button>
    </nav>
  );
}
