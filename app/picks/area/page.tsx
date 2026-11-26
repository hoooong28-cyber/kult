import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { getMergedCafes } from '@/lib/curators';
import { resolvePickPurpose, resolvePurposeAreas, resolvePurposeShortlist } from '@/lib/editorialPicks';
import styles from '../[slug]/picks.module.css';

type Props = { searchParams: Promise<{ purpose?: string | string[] }> };
export const metadata = { title: '어느 동네로 갈까요? · KULT' };

export default async function PickAreaPage({ searchParams }: Props) {
  const purpose = resolvePickPurpose((await searchParams).purpose);
  if (!purpose) redirect('/');
  const catalog = await getMergedCafes();
  const areas = resolvePurposeAreas(catalog, purpose.id);
  const allCount = resolvePurposeShortlist(catalog, purpose.id).length;
  return <div className={styles.paper} lang="ko">
    <Header section="results" />
    <div className={styles.wrap}>
      <header className={styles.resultIntro}>
        <Link href="/" className={styles.back}>← 목적 바꾸기</Link>
        <div className={styles.sectionHead}>
          <div>
            <p lang="en">SEOUL CITY GUIDE / CHOOSE A NEIGHBORHOOD</p>
            <h1 id="area-title">어느 동네로 갈까요?</h1>
            <p className={styles.dek}>{purpose.label}에 맞는 동네를 골라보세요.</p>
          </div>
        </div>
      </header>
      {areas.length ? <nav className={styles.areaGrid} aria-labelledby="area-title">
        {areas.map(area => <Link key={area.slug} href={'/picks/' + area.slug + '?purpose=' + purpose.id} className={styles.areaLink}>
          <span>{area.area}<small lang="en">{area.area_en}</small></span><span className={styles.areaCount}>{area.count}곳 <span aria-hidden="true">↗</span></span>
        </Link>)}
        {allCount > 0 && <Link href={'/picks?purpose=' + purpose.id} className={styles.areaLink}>
          <span>동네는 아직 미정<small>서울에서 이 목적에 맞는 곳만 보기</small></span><span className={styles.areaCount}>{allCount}곳 <span aria-hidden="true">↗</span></span>
        </Link>}
      </nav> : <div className={styles.empty}>
        <h2>아직 이 목적에 맞는 동네가 없어요.</h2>
        <Link href="/">다른 목적 고르기 ↗</Link>
      </div>}
    </div>
  </div>;
}
