'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, Bookmark, MessageSquarePlus, UserPlus, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onOpenReport?: () => void;
  onOpenAuth?: () => void;
  onOpenCreatePost?: () => void;
}

export default function Header({ onOpenReport, onOpenAuth, onOpenCreatePost }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f5]/95 backdrop-blur-md border-b border-[#e5e2de] px-3 sm:px-8 py-3 transition-all shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand logo & tagline */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1c1c1a] text-[#fcf9f5] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#1c1c1a] tracking-tight">
                KULT <span className="font-light text-[#bf703a]">SEOUL</span>
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-[#f0ede9] text-[#444748] border border-[#e5e2de]">
                Gazette Issue No. 14
              </span>
            </div>
            <p className="text-[11px] text-[#5e5e5d] hidden md:block">
              Sanctuaries for quiet living, writing &amp; specialty filter coffee
            </p>
          </div>
        </Link>

        {/* Action items */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#BF703A] text-white hover:bg-[#a65f2e] transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>포스트 작성</span>
            </button>
          )}

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-[#f0ede9] hover:bg-[#e5e2de] text-[#1c1c1a] border border-[#e5e2de] transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#bf703a]" />
            <span className="hidden sm:inline">에디터 가입/로그인</span>
            <span className="sm:hidden text-[11px]">프로필</span>
          </button>

          <Link
            href="/archive"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1c1c1a] text-[#fcf9f5] hover:bg-[#31302e] transition-colors shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Archive</span>
          </Link>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-[#ffffff] hover:bg-[#f6f3ef] text-[#1c1c1a] border border-[#c4c7c7] transition-colors shadow-xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#bf703a]" />
            <span className="hidden sm:inline">Suggest / Report</span>
            <span className="sm:hidden text-[11px]">제보</span>
          </button>
        </div>
      </div>
    </header>
  );
}

