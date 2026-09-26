'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CuratedCafe } from '@/lib/types';
import FreshnessBadge from './FreshnessBadge';
import { isCafeSaved, toggleSaveCafe, subscribeArchiveChanges } from '@/lib/archiveStore';
import { MapPin, Clock, Quote, ExternalLink, Volume2, Globe, HelpCircle, Bookmark } from 'lucide-react';

interface CafeCardProps {
  cafe: CuratedCafe;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CafeCard({ cafe, isSelected = false, onSelect }: CafeCardProps) {
  const primaryCurator = cafe.curators[0];
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isCafeSaved(cafe.id));
    const unsubscribe = subscribeArchiveChanges(() => {
      setSaved(isCafeSaved(cafe.id));
    });
    return () => unsubscribe();
  }, [cafe.id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleSaveCafe(cafe.id);
    setSaved(newState);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-[#ffffff] hover:bg-[#f6f3ef] border rounded-2xl p-5 sm:p-6 transition-all shadow-xs flex flex-col justify-between cursor-pointer ${
        isSelected
          ? 'border-[#1c1c1a] ring-2 ring-[#1c1c1a]/10 bg-[#f6f3ef]'
          : 'border-[#e5e2de] hover:border-[#c4c7c7]'
      }`}
    >
      <div>
        {/* Header: Name & Freshness Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c1a] group-hover:text-[#bf703a] transition-colors">
                {cafe.name}
              </h3>
              <span className="text-sm font-sans text-[#706F6C] font-medium">
                {cafe.name_local}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5e5e5d] mt-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#bf703a] shrink-0" />
              <span className="font-semibold text-[#1c1c1a]">{cafe.neighborhood}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{cafe.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmarkClick}
              title={saved ? '아카이브에서 제거' : '내 아카이브에 저장'}
              className={`p-2 rounded-xl transition-all ${
                saved
                  ? 'bg-[#1c1c1a] text-[#fcf9f5] shadow-xs'
                  : 'bg-[#f0ede9] text-[#5e5e5d] hover:text-[#1c1c1a] hover:bg-[#e5e2de]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>

            <FreshnessBadge
              isDemo={cafe.is_demo}
              lastVerifiedDate={cafe.last_verified_date}
              monthsAgo={cafe.freshness.months_ago}
              isStale={cafe.freshness.is_stale}
              badgeLabel={cafe.freshness.badge_label}
            />
          </div>
        </div>

        {/* Curator Commentary */}
        <div className="my-4 p-4 rounded-xl bg-[#f6f3ef] border border-[#e5e2de] relative">
          <div className="flex items-start gap-2.5 text-[#1c1c1a] text-sm leading-relaxed">
            <Quote className="w-4 h-4 text-[#bf703a] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#bf703a] block mb-1">
                {cafe.is_demo ? '테스트 장소 안내' : 'Curator Commentary'}
              </span>
              <p className="italic font-serif text-[#1c1c1a]">{cafe.notes}</p>
            </div>
          </div>
        </div>

        {/* Tags / Expat Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {cafe.tags.good_for.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#f0ede9] text-[#1c1c1a] border border-[#e5e2de] capitalize"
            >
              For {tag}
            </span>
          ))}

          {cafe.tags.noise_level === 'quiet' && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#f6f3ef] text-[#444748] border border-[#e5e2de] flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-[#bf703a]" /> Quiet
            </span>
          )}

          {cafe.tags.english_menu && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#f6f3ef] text-[#444748] border border-[#e5e2de] flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-600" /> English Menu
            </span>
          )}

          {cafe.tags.outlet_availability === 'unknown' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f0ede9] text-[#706F6C] border border-[#e5e2de] flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#706F6C]" /> Outlets: Unverified
            </span>
          )}

          {cafe.hours && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-normal text-[#706F6C] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#706F6C]" /> {cafe.hours}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Curator attribution & Link to Curator Profile */}
      <div className="pt-3 border-t border-[#e5e2de] flex items-center justify-between gap-3 text-xs">
        <Link
          href={`/curator/${primaryCurator?.id || 'founder'}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 text-[#5e5e5d] hover:text-[#1c1c1a] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[#1c1c1a] text-[#fcf9f5] flex items-center justify-center font-bold text-[10px]">
            {primaryCurator?.display_name?.charAt(0) || 'C'}
          </div>
          <span className="truncate font-sans">
            By <strong className="text-[#1c1c1a] font-semibold">{primaryCurator?.display_name || 'Founder'}</strong>
            {primaryCurator?.identity_tag && (
              <span className="text-[#706F6C] ml-1">({primaryCurator.identity_tag})</span>
            )}
          </span>
        </Link>

        <Link
          href={`/cafe/${cafe.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[#1c1c1a] hover:text-[#bf703a] font-semibold hover:underline font-mono text-[11px]"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
