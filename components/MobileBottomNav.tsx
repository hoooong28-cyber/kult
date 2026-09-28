'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Map, Bookmark, PlusCircle, User } from 'lucide-react';

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
  const router = useRouter();

  const isHome = pathname === '/';
  const isArchive = pathname === '/archive';

  const handleMapClick = (e: React.MouseEvent) => {
    if (onToggleMap) {
      e.preventDefault();
      onToggleMap();
    } else {
      // If not on homepage, navigate to homepage map section
      router.push('/#map-explore');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FCF9F5]/95 backdrop-blur-xl border-t border-[#E6DFD3] px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none">
      {/* 1. Home / Gazette */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 rounded-xl transition-all ${
          isHome && !isMapActive
            ? 'text-[#BF703A] font-bold'
            : 'text-[#706F6C] hover:text-[#1C1C1A]'
        }`}
      >
        <Compass className={`w-5 h-5 ${isHome && !isMapActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-mono tracking-tight">Gazette</span>
      </Link>

      {/* 2. Map View Toggle */}
      <button
        type="button"
        onClick={handleMapClick}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 rounded-xl transition-all ${
          isMapActive
            ? 'text-[#BF703A] font-bold'
            : 'text-[#706F6C] hover:text-[#1C1C1A]'
        }`}
      >
        <Map className={`w-5 h-5 ${isMapActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-mono tracking-tight">
          {isMapActive ? 'Map (Active)' : 'Map'}
        </span>
      </button>

      {/* 3. Create Post (Floating Action Button) */}
      <button
        type="button"
        onClick={onOpenCreatePost || onOpenAuth}
        className="flex flex-col items-center justify-center -mt-4 active:scale-95 transition-transform"
        title="Write Article"
      >
        <div className="w-11 h-11 rounded-full bg-[#1C1C1A] text-[#FCF9F5] shadow-lg flex items-center justify-center hover:bg-[#BF703A] transition-colors border-2 border-[#FCF9F5]">
          <PlusCircle className="w-6 h-6 text-[#FCF9F5]" />
        </div>
        <span className="text-[10px] font-mono font-semibold text-[#1C1C1A] mt-0.5">
          Write
        </span>
      </button>

      {/* 4. Archive */}
      <Link
        href="/archive"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 rounded-xl transition-all ${
          isArchive
            ? 'text-[#BF703A] font-bold'
            : 'text-[#706F6C] hover:text-[#1C1C1A]'
        }`}
      >
        <Bookmark className={`w-5 h-5 ${isArchive ? 'stroke-[2.5] fill-current' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-mono tracking-tight">Archive</span>
      </Link>

      {/* 5. Account / Profile */}
      <button
        type="button"
        onClick={onOpenAuth}
        className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 rounded-xl text-[#706F6C] hover:text-[#1C1C1A] transition-all"
      >
        <User className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[10px] font-mono tracking-tight">Account</span>
      </button>
    </nav>
  );
}
