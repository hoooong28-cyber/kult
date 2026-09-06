'use client';

import React from 'react';
import Link from 'next/link';
import { CuratorProfile } from '@/lib/types';
import { Sparkles, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

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
      className={`group relative bg-stone-900/90 hover:bg-stone-850 border rounded-2xl p-6 sm:p-7 transition-all shadow-xl flex flex-col justify-between overflow-hidden ${
        featured ? 'border-amber-400/40 ring-1 ring-amber-400/20 bg-stone-900' : 'border-stone-800 hover:border-stone-700'
      }`}
    >
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/10 transition-colors" />

      <div>
        {/* Top Tag: Identity Tag (Most Prominent per requirement) */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 tracking-tight">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{curator.identity_tag}</span>
          </span>

          {cafeCount > 0 && (
            <span className="text-xs text-stone-400 font-medium">
              <strong className="text-stone-200 font-bold">{cafeCount}</strong> Spots Curated
            </span>
          )}
        </div>

        {/* Curator Header: Avatar + Display Name */}
        <div className="flex items-center gap-4 mb-4">
          {curator.avatar_image ? (
            <img
              src={curator.avatar_image}
              alt={curator.display_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/40 shadow-md shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-serif font-extrabold text-xl shadow-md shrink-0 border border-amber-300">
              {curator.display_name.charAt(0)}
            </div>
          )}

          <div>
            <h3 className="font-serif text-xl font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
              {curator.display_name}
            </h3>
            <p className="text-xs text-amber-400/80 font-medium">
              Curator since {curator.joined_date}
            </p>
          </div>
        </div>

        {/* Bio (Interview Magazine Teaser) */}
        <p className="text-stone-300 text-sm leading-relaxed line-clamp-3 mb-6 font-serif italic border-l-2 border-amber-400/40 pl-3.5 my-2">
          "{curator.bio}"
        </p>
      </div>

      {/* Footer CTA Link to Curator Profile Page */}
      <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-400">
          Interview & Picks List
        </span>
        <Link
          href={`/curator/${curator.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors shadow-md"
        >
          <span>View Curator List</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
