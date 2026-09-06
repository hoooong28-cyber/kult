'use client';

import React from 'react';
import Link from 'next/link';
import { CuratedCafe } from '@/lib/types';
import FreshnessBadge from './FreshnessBadge';
import { MapPin, Clock, Quote, ExternalLink, Volume2, Globe, Plug, HelpCircle } from 'lucide-react';

interface CafeCardProps {
  cafe: CuratedCafe;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CafeCard({ cafe, isSelected = false, onSelect }: CafeCardProps) {
  const primaryCurator = cafe.curators[0];

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-stone-900/90 hover:bg-stone-850 border rounded-2xl p-5 sm:p-6 transition-all shadow-md flex flex-col justify-between cursor-pointer ${
        isSelected
          ? 'border-amber-400 ring-2 ring-amber-400/20 bg-stone-850'
          : 'border-stone-800 hover:border-stone-700'
      }`}
    >
      <div>
        {/* Header: Name & Freshness Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                {cafe.name}
              </h3>
              <span className="text-sm font-sans text-stone-400 font-medium">
                {cafe.name_local}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
              <span className="font-semibold text-stone-300">{cafe.neighborhood}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{cafe.address}</span>
            </div>
          </div>

          <FreshnessBadge
            lastVerifiedDate={cafe.last_verified_date}
            monthsAgo={cafe.freshness.months_ago}
            isStale={cafe.freshness.is_stale}
            badgeLabel={cafe.freshness.badge_label}
          />
        </div>

        {/* Curator Interview Notes Highlight (Core Content per requirements) */}
        <div className="my-4 p-4 rounded-xl bg-stone-950/90 border border-stone-800 relative">
          <div className="flex items-start gap-2.5 text-stone-200 text-sm leading-relaxed">
            <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 block mb-1">
                Curator Commentary
              </span>
              <p className="italic font-serif text-stone-200">{cafe.notes}</p>
            </div>
          </div>
        </div>

        {/* Tags / Expat Metadata Row (Includes Unverified Tag Badges) */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {cafe.tags.good_for.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 capitalize"
            >
              For {tag}
            </span>
          ))}

          {cafe.tags.noise_level === 'quiet' && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-stone-800 text-stone-300 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-400" /> Quiet
            </span>
          )}

          {cafe.tags.english_menu && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-stone-800 text-stone-300 flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" /> English Menu
            </span>
          )}

          {/* Unverified tag indicator when outlets or noise levels are unknown */}
          {cafe.tags.outlet_availability === 'unknown' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-800/60 text-stone-400 border border-stone-700/50 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-stone-500" /> Outlets: Unverified (미확인)
            </span>
          )}

          {cafe.hours && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-normal text-stone-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" /> {cafe.hours}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Curator attribution & Link to Curator Profile */}
      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3 text-xs">
        <Link
          href={`/curator/${primaryCurator?.id || 'founder'}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px] border border-amber-400/30">
            {primaryCurator?.display_name?.charAt(0) || 'C'}
          </div>
          <span className="truncate">
            By <strong className="text-stone-200 font-medium">{primaryCurator?.display_name || 'Founder'}</strong>
            {primaryCurator?.identity_tag && (
              <span className="text-stone-400 ml-1">({primaryCurator.identity_tag})</span>
            )}
          </span>
        </Link>

        <Link
          href={`/cafe/${cafe.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold hover:underline"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
