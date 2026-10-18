import Link from 'next/link';
import { getMergedCafes } from '@/lib/curators';
import SavePlaceButton from '@/components/SavePlaceButton';
import { Impression, SourceLink } from '@/components/Interaction';

export const metadata = { title: '발견한 서울 공간 — KULT', description: '매거진 소개에서 발견한 서울 공간 15곳. 방문 검증 전인 발견 기록입니다.' };

export default async function DiscoveriesPage() {
  const cafes = (await getMergedCafes()).filter(cafe => cafe.content_status === 'discovered');
  const districts = [...new Set(cafes.map(cafe => cafe.neighborhood.split(' · ')[0]))];
  return <main className="min-h-screen bg-[#FCF9F5] text-[#1C1C1A] px-5 sm:px-10 py-8">
    <div className="max-w-6xl mx-auto">
      <nav className="flex justify-between mb-12 text-sm"><Link href="/" className="py-3 underline">← KULT</Link><Link href="/archive" className="py-3 underline">내 KULT</Link></nav>
      <p className="text-xs tracking-widest text-[#BF703A]">DISCOVERED IN SEOUL</p>
      <h1 className="font-serif text-4xl sm:text-5xl my-5">다음에 만나고 싶은 공간</h1>
      <p className="max-w-2xl text-sm leading-7 text-[#706F6C]">2026년 매거진 소개에서 발견한 서울 공간 {cafes.length}곳입니다. 직접 방문한 추천이나 인기 순위가 아닌 발견 목록이에요. 마음에 드는 곳을 내 KULT에 저장해보세요. 운영 여부·위치·리뷰 라벨은 확인 중입니다.</p>
      <nav aria-label="지역별 공간" className="flex flex-wrap gap-3 my-8">{districts.map(district => <a key={district} href={`#${district}`} className="border border-[#E6DFD3] rounded-full px-5 py-3 text-sm">{district}</a>)}</nav>
      {districts.map(district => <section key={district} id={district} className="scroll-mt-8 mb-12">
        <h2 className="font-serif text-2xl mb-5">{district}</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{cafes.filter(cafe => cafe.neighborhood.startsWith(district)).map(cafe => <Impression key={cafe.id} event="place_impression" place_id={cafe.id} recommendation_source="editorial">
          <article className="h-full rounded-2xl border border-[#E6DFD3] bg-white p-6 flex flex-col gap-4">
            <p className="text-xs text-[#BF703A]">{cafe.neighborhood} · 방문 미확인</p>
            <SourceLink source="editorial" href={`/cafe/${cafe.id}`} className="font-serif text-2xl hover:underline">{cafe.name_local}</SourceLink>
            <p className="text-sm leading-6 text-[#706F6C]">{cafe.notes}</p>
            <p className="text-xs text-[#706F6C]">{cafe.address}</p>
            {cafe.discovery_source && <a href={cafe.discovery_source.url} target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-4">소개 출처 · {cafe.discovery_source.published_at}</a>}
            <div className="mt-auto pt-3"><SavePlaceButton placeId={cafe.id} source="editorial" /></div>
          </article>
        </Impression>)}</div>
      </section>)}
    </div>
  </main>;
}
