import { naverVenueMapLink } from '@/lib/naverPlaceLinks';
import Link from 'next/link';
import Header from '@/components/Header';
import { getMergedCafes } from '@/lib/curators';
import SavePlaceButton from '@/components/SavePlaceButton';
import VenuePhoto from '@/components/VenuePhoto';
import { Impression, MapLink, SourceLink } from '@/components/Interaction';
import CopyPlaceAddress from '@/components/CopyPlaceAddress';
import { picks, resolveEditorialPick } from '@/lib/editorialPicks';

export const metadata = { title: '발견한 서울 공간 — KULT', description: '외부 소개에서 발견한 서울 공간. 방문 검증 전인 발견 기록입니다.' };

export default async function DiscoveriesPage() {
  const catalog = await getMergedCafes();
  const featuredPicks = picks.flatMap(pick => {
    const resolved = resolveEditorialPick(pick.slug, catalog);
    return resolved ? [pick] : [];
  });
  const cafes = catalog.filter(cafe => cafe.content_status === 'discovered' && !cafe.is_demo && cafe.business_status !== 'closed');
  const priorityAreas = [
    { slug: 'haebangchon', label: '해방촌', english: 'Haebangchon' },
    { slug: 'samgakji', label: '삼각지', english: 'Samgakji' },
    { slug: 'seongsu', label: '성수', english: 'Seongsu' },
  ];
  const priority = priorityAreas.map(area => ({
    ...area, cafes: cafes.filter(cafe => cafe.neighborhood.split(' · ').includes(area.label)),
  })).filter(area => area.cafes.length);
  const remaining = cafes.filter(cafe => !priorityAreas.some(area => cafe.neighborhood.split(' · ').includes(area.label)));
  const districts = [...new Set(remaining.map(cafe => cafe.neighborhood.split(' · ')[0]))];
  const sections = [...priority, ...districts.map(district => ({
    slug: district, label: district, english: '', cafes: remaining.filter(cafe => cafe.neighborhood.split(' · ')[0] === district),
  }))];
  return <div lang="ko" className="min-h-screen bg-[var(--kult-paper)] text-[var(--kult-ink)]">
    <Header section="discoveries" />
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
      <p lang="en" className="text-xs font-semibold tracking-widest text-[#8B4829]">SEOUL SHORTLIST</p>
      <h1 className="font-serif text-4xl sm:text-5xl my-5">오늘 갈 곳, 동네부터 고르세요.</h1>
      <p lang="en" className="text-sm font-medium text-[#554A3F]">Pick a neighborhood. Open a map when you find your spot.</p>
      <p className="max-w-2xl text-sm leading-7 text-[#706F6C] mt-2">동네와 약속을 고르면, 왜 골랐는지와 지도 링크를 볼 수 있어요.</p>
      {featuredPicks.length > 0 && <section id="pick-two" className="mb-8 mt-7 scroll-mt-6 rounded-2xl bg-[var(--kult-cream)] border border-[var(--kult-rule)] p-5 sm:p-7">
        <h2 className="text-xl font-semibold">약속 장소, 후보만 빠르게 골라요.</h2>
        <p lang="en" className="mt-1 text-sm text-stone-700">Compare a few places, then send the link to a friend.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {featuredPicks.map(pick => <Link key={pick.slug} href={'/picks/' + pick.slug} className="rounded-xl border border-[var(--kult-rule)] bg-white p-4 hover:underline">
            <span className="block text-xs text-[var(--kult-accent-text)]">{pick.area} · <span lang="en">{pick.area_en}</span> · {pick.source === 'curation' ? 'K의 큐레이션' : '외부 소개'}</span>
            <span className="mt-1 block font-semibold">{pick.area} 약속 장소 →</span>
            <span lang="en" className="mt-1 block text-xs text-stone-600">{pick.area_en} meetup guide</span>
          </Link>)}
        </div>
      </section>}
      {sections.length > 0 && <nav aria-label="동네 바로 가기 · Neighborhoods" className="flex flex-wrap gap-2 my-7">
        {sections.map(area => <a key={area.slug} href={`#${area.slug}`} className="inline-flex min-h-11 flex-wrap items-center gap-1.5 border border-[#D8CDBE] rounded-full px-4 py-2 text-sm hover:bg-[#F0E7DB]">
          {area.label}{area.english && <span lang="en" className="text-xs text-[#695A4A]">{area.english}</span>}
        </a>)}
      </nav>}
      {sections.map(area => <section key={area.slug} id={area.slug} className="scroll-mt-8 mb-12">
        <h2 className="font-serif text-2xl mb-4">{area.label}{area.english && <span lang="en" className="ml-2 text-base text-[#695A4A]">{area.english}</span>}</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{area.cafes.map(cafe => <Impression key={cafe.id} event="place_impression" place_id={cafe.id} recommendation_source="editorial">
          <article className="h-full rounded-2xl border border-[#E6DFD3] bg-white p-4 sm:p-5 flex flex-col gap-2.5">
            <VenuePhoto cafe={cafe} />
            <p className="text-xs text-[var(--kult-accent-text)]">{cafe.neighborhood} · 방문 미확인</p>
            <SourceLink source="editorial" href={`/cafe/${cafe.id}`} className="font-serif text-2xl hover:underline">{cafe.name_local}</SourceLink>
            <p className="text-sm leading-6 text-[#706F6C]">{cafe.notes}</p>
            <p className="text-xs text-[#706F6C]">{cafe.address}</p>
            {cafe.discovery_source && <a href={cafe.discovery_source.url} target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-4">소개 출처 · {cafe.discovery_source.published_at}</a>}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
              <MapLink placeId={cafe.id}
                href={naverVenueMapLink(cafe).href}
                className="inline-flex min-h-11 items-center rounded-lg bg-[#201A15] px-3 py-2 text-xs font-semibold text-[#FCF9F5]">
                지도에서 찾기 · Open map ↗
              </MapLink>
              {cafe.address && <CopyPlaceAddress address={cafe.address} />}
              <SavePlaceButton placeId={cafe.id} source="editorial" />
            </div>
          </article>
        </Impression>)}</div>
      </section>)}
    </div>
  </div>;
}
