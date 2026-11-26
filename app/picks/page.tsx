import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import EditorialPlaceCard from '@/components/EditorialPlaceCard';
import ShareEditorialPick from '@/components/ShareEditorialPick';
import { getMergedCafes } from '@/lib/curators';
import { resolvePickPurpose, resolvePurposeShortlist } from '@/lib/editorialPicks';
import styles from './[slug]/picks.module.css';

type Props = { searchParams: Promise<{ purpose?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props) {
  const purpose = resolvePickPurpose((await searchParams).purpose);
  const title = purpose ? purpose.heading + ' · KULT' : '서울 공간 · KULT';
  return { title, openGraph: { title, description: '골라본 이유와 지도로 서울에서 갈 곳을 정해요.' } };
}

export default async function PurposeResultsPage({ searchParams }: Props) {
  const purpose = resolvePickPurpose((await searchParams).purpose);
  if (!purpose) redirect('/');
  const places = resolvePurposeShortlist(await getMergedCafes(), purpose.id);
  const path = '/picks?purpose=' + purpose.id;

  return <div className={styles.paper} lang="ko">
    <Header section="results" />
    <div className={styles.wrap}>
      <header className={styles.resultIntro}>
        <Link href={'/?purpose=' + purpose.id} className={styles.back}>← 동네 고르기</Link>
        <div className={styles.sectionHead}>
          <div>
            <p lang="en">SEOUL CITY GUIDE / {purpose.english}</p>
            <h1 id="results-title">{purpose.heading}</h1>
          </div>
          <div className={styles.resultsMeta}>
            {places.length > 0 && <ShareEditorialPick key={path} path={path} title={purpose.heading + ' · KULT'} />}
          </div>
        </div>
      </header>
      {places.length ? <>
        <p className={styles.purposeSummary}>{purpose.label} · 서울 전체 {places.length}곳</p>
        <div className={styles.grid}>
          {places.map((item, index) => <EditorialPlaceCard key={item.cafe.id} cafe={item.cafe}
            area={item.area} index={index} reason={item.reason} reasonEn={item.reason_en} />)}
        </div>
        <p className={styles.fineprint}>출발 전 지도에서 영업시간을 확인해 주세요.</p>
      </> : <div className={styles.empty}>
        <h2>아직 이 목적에 맞는 곳이 없어요.</h2>
        <p>다른 동네나 목적에서 찾아보세요.</p>
      </div>}
      <nav className={styles.more} aria-label="더 둘러보기">
        <Link href={'/picks/area?purpose=' + purpose.id}>동네 고르기</Link>
        <Link href="/explore#map-explore">지도로 둘러보기</Link>
      </nav>
    </div>
  </div>;
}
