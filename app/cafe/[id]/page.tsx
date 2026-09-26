import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCafeById } from '@/lib/curators';
import FreshnessBadge from '@/components/FreshnessBadge';
import NaverMap from '@/components/map/NaverMap';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Quote,
  ExternalLink,
  ShieldCheck,
  Volume2,
  Globe,
  CreditCard,
  Baby,
  Plug,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const cafe = await getCafeById(id);
  if (!cafe) return { title: 'Cafe Not Found — Seoul Expat Cafes' };

  return {
    title: `${cafe.name} (${cafe.name_local}) — Seoul Expat Cafe Review`,
    description: `Curated recommendation for ${cafe.name} in ${cafe.neighborhood}, Seoul. ${cafe.notes}`,
  };
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cafe = await getCafeById(id);

  if (!cafe) {
    notFound();
  }

  const primaryCurator = cafe.curators[0];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Header Navigation */}
      <nav className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-850 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Spots</span>
          </Link>
          <div className="flex items-center gap-2">
            <FreshnessBadge
              isDemo={cafe.is_demo}
              lastVerifiedDate={cafe.last_verified_date}
              monthsAgo={cafe.freshness.months_ago}
              isStale={cafe.freshness.is_stale}
              badgeLabel={cafe.freshness.badge_label}
            />
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        {/* Title Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{cafe.neighborhood} District</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 tracking-tight">
                {cafe.name}
              </h1>
              <p className="text-xl font-medium text-stone-400 mt-1">
                {cafe.name_local}
              </p>
            </div>

            <a
              href={cafe.naver_place_id ? `https://map.naver.com/p/entry/place/${cafe.naver_place_id}` : `https://map.naver.com/v5/search/${encodeURIComponent(cafe.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs hover:bg-amber-300 shadow-md transition-colors self-start"
            >
              <span>Open in NAVER Map</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-sm text-stone-300 mt-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
            <span>{cafe.address}</span>
          </p>
        </div>

        {/* Highlighted Curator Interview Commentary Quote Box */}
        <section className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Quote className="w-4 h-4" />
            <span>{cafe.is_demo ? '테스트 장소 안내' : 'Curator Interview Commentary'}</span>
          </div>

          <blockquote className="font-serif text-xl sm:text-2xl text-stone-100 italic leading-relaxed border-l-4 border-amber-400 pl-4 py-1">
            "{cafe.notes}"
          </blockquote>

          {/* Curator Profile Attribution Card */}
          {primaryCurator && (
            <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-serif font-extrabold text-lg shadow-md shrink-0 border border-amber-300">
                  {primaryCurator.display_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-serif font-bold text-stone-100 text-base">
                      {primaryCurator.display_name}
                    </p>
                    <span className="text-[11px] font-semibold text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      {primaryCurator.identity_tag}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">
                    {primaryCurator.bio}
                  </p>
                </div>
              </div>

              <Link
                href={`/curator/${primaryCurator.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 text-stone-200 hover:bg-stone-750 border border-stone-700 transition-colors shrink-0"
              >
                <span>{cafe.is_demo ? '테스트 공간의 전체 장소' : 'Full Curator Interview & Picks'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>
          )}
        </section>

        {/* Detailed Metadata Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tag Specifications */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-100 border-b border-stone-800 pb-3">
              Expat Friendly Specifications
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-stone-400 block font-medium">Noise Level</span>
                <span className="font-semibold text-stone-200 capitalize flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  {cafe.tags.noise_level}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 block font-medium">Power Outlets</span>
                {cafe.tags.outlet_availability === 'unknown' ? (
                  <span className="text-stone-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-stone-500" /> Unverified (미확인)
                  </span>
                ) : (
                  <span className="font-semibold text-stone-200 capitalize flex items-center gap-1.5">
                    <Plug className="w-4 h-4 text-amber-400" />
                    {cafe.tags.outlet_availability}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 block font-medium">English Menu</span>
                <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  {cafe.tags.english_menu ? 'Available' : 'Korean only / Unverified'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 block font-medium">Price Range</span>
                <span className="font-semibold text-amber-300">
                  {cafe.tags.price_range}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 block font-medium">Kid-Free Zone</span>
                <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-amber-400" />
                  {cafe.tags.kid_free_zone === null ? 'Unverified (미확인)' : cafe.tags.kid_free_zone ? 'Yes (Adults only)' : 'No / All ages'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 block font-medium">Card Payments</span>
                <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  {cafe.tags.card_only === null ? 'Unverified (미확인)' : cafe.tags.card_only ? 'Card Preferred' : 'Card & Cash'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800/80">
              <span className="text-stone-400 text-xs block mb-2 font-medium">Recommended For</span>
              <div className="flex flex-wrap gap-2">
                {cafe.tags.good_for.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30 capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Operating Hours & Location Map */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100 border-b border-stone-800 pb-3 flex items-center justify-between">
                <span>Location & Hours</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </h3>

              <div className="my-3 space-y-1 text-xs">
                <span className="text-stone-400 block font-medium">Operating Hours:</span>
                <p className="font-semibold text-stone-200 text-sm">{cafe.hours}</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-stone-400 block mb-2 font-medium">Interactive Map Location</span>
              <NaverMap cafes={[cafe]} selectedCafeId={cafe.id} height="220px" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
