import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCuratorById } from '@/lib/curators';
import Header from '@/components/Header';
import CafeCard from '@/components/CafeCard';
import NaverMap from '@/components/map/NaverMap';
import { ArrowLeft, Sparkles, MapPin, ExternalLink, Instagram, Coffee, Quote } from 'lucide-react';

interface CuratorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CuratorPageProps) {
  const { id } = await params;
  const result = await getCuratorById(id);
  if (!result) return { title: 'Curator Not Found — Seoul Expat Cafes' };

  return {
    title: `${result.curator.display_name} (${result.curator.identity_tag}) — Seoul Cafe Curator Profile`,
    description: `Curated Seoul cafe list by ${result.curator.display_name}. ${result.curator.bio}`,
  };
}

export default async function CuratorProfilePage({ params }: CuratorPageProps) {
  const { id } = await params;
  const result = await getCuratorById(id);

  if (!result) {
    notFound();
  }

  const { curator, cafes } = result;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Curators & Spots</span>
        </Link>

        {/* Magazine Interview Profile Hero Card */}
        <section className="relative bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6">
            {/* Identity Tag (Most Prominent per requirement) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{curator.identity_tag}</span>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {curator.avatar_image ? (
                <img
                  src={curator.avatar_image}
                  alt={curator.display_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-amber-400/50 shadow-xl shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-serif font-extrabold text-3xl sm:text-4xl shadow-xl shrink-0 border-2 border-amber-300">
                  {curator.display_name.charAt(0)}
                </div>
              )}

              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 tracking-tight">
                  {curator.display_name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-stone-400 flex-wrap pt-1">
                  <span>Curator since {curator.joined_date}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{cafes.length} Curated Spots</span>
                </div>
              </div>
            </div>

            {/* Bio (Interview Profile Headline & Description) */}
            <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-850 relative">
              <Quote className="w-5 h-5 text-amber-400/60 mb-2" />
              <p className="font-serif text-lg sm:text-xl text-stone-200 italic leading-relaxed">
                "{curator.bio}"
              </p>
            </div>

            {/* Curator Social / Source Links */}
            <div className="flex items-center gap-4 pt-2 text-xs">
              {curator.instagram_or_link && (
                <a
                  href={curator.instagram_or_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750 font-medium transition-colors"
                >
                  <Instagram className="w-4 h-4 text-amber-400" />
                  <span>Curator Instagram / Link</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              )}

              {curator.source_list_url && (
                <a
                  href={curator.source_list_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750 font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Original Naver Map List</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Curator's Picks List & Map Section */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                <Coffee className="w-6 h-6 text-amber-400" />
                <span>{curator.display_name}'s Curated Picks ({cafes.length})</span>
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Hand-picked places personally tested and recommended by this curator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cafe Cards Grid */}
            <div className="lg:col-span-7 space-y-4">
              {cafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>

            {/* Naver Map showing this curator's spots */}
            <div className="lg:col-span-5 sticky top-[100px]">
              <div className="mb-2 text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>{curator.display_name}'s Map</span>
                <span className="text-amber-400 font-medium">{cafes.length} Locations</span>
              </div>
              <NaverMap cafes={cafes} height="520px" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
