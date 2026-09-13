'use client';

import React from 'react';
import Link from 'next/link';
import { CuratorProfile } from '@/lib/types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CuratorCardProps {
  curator: CuratorProfile;
  cafeCount?: number;
  featured?: boolean;
}

export default function CuratorCard({
  curator,
  cafeCount = 0,
  featured = false,
}: CuratorCardProps) {
  return (
    <div
      className={`group relative bg-[#ffffff] hover:bg-[#f6f3ef] border rounded-2xl p-6 sm:p-7 transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
        featured ? 'border-[#bf703a]/50 ring-1 ring-[#bf703a]/20 bg-[#ffffff]' : 'border-[#e5e2de] hover:border-[#c4c7c7]'
      }`}
    >
      <div>
        {/* Top Tag: Identity Tag */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f6f3ef] text-[#bf703a] border border-[#e5e2de] tracking-tight">
            <Sparkles className="w-3.5 h-3.5 text-[#bf703a]" />
            <span>{curator.identity_tag}</span>
          </span>

          {cafeCount > 0 && (
            <span className="text-xs text-[#5e5e5d] font-mono">
              <strong className="text-[#1c1c1a] font-bold">{cafeCount}</strong> Spots Curated
            </span>
          )}
        </div>

        {/* Curator Header: Avatar + Display Name */}
        <div className="flex items-center gap-4 mb-4">
          {curator.avatar_image ? (
            <img
              src={curator.avatar_image}
              alt={curator.display_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#e5e2de] shadow-xs shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#1c1c1a] text-[#fcf9f5] flex items-center justify-center font-serif font-bold text-xl shadow-xs shrink-0">
              {curator.display_name.charAt(0)}
            </div>
          )}

          <div>
            <h3 className="font-serif text-xl font-bold text-[#1c1c1a] group-hover:text-[#bf703a] transition-colors">
              {curator.display_name}
            </h3>
            <p className="text-xs text-[#706F6C] font-mono">
              Curator since {curator.joined_date}
            </p>
          </div>
        </div>

        {/* Bio (Interview Magazine Teaser) */}
        <p className="text-[#444748] text-sm leading-relaxed line-clamp-3 mb-6 font-serif italic border-l-2 border-[#bf703a]/50 pl-3.5 my-2">
          "{curator.bio}"
        </p>
      </div>

      {/* Footer CTA Link to Curator Profile Page */}
      <div className="pt-4 border-t border-[#e5e2de] flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-[#706F6C] uppercase tracking-wider">
          Interview & Picks
        </span>
        <Link
          href={`/curator/${curator.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1c1c1a] text-[#fcf9f5] hover:bg-[#31302e] transition-colors shadow-xs"
        >
          <span>View List</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
