import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { getMergedCafes } from '@/lib/curators';
import { picks, purposePicks, resolveEditorialPick, resolvePickPurpose } from '@/lib/editorialPicks';
import styles from '../[slug]/picks.module.css';

type Props = { searchParams: Promise<{ purpose?: string | string[] }> };
export const metadata = { title: '어느 동네로 갈까요? · KULT' };

export default async function PickAreaPage({ searchParams }: Props) {
  const purpose = resolvePickPurpose((await searchParams).purpose);
  if (!purpose) redirect('/');
  const catalog = await getMergedCafes();
  const areas = ['삼각지', '해방촌', '성수', '연남동'].flatMap(area => {
    const pick = picks.find(candidate => candidate.area === area);
    if (!pick) return [];
    const resolved = resolveEditorialPick(pick.slug, catalog);
    return resolved && purposePicks(resolved.places, purpose.id).length > 0 ? [pick] : [];
  });
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
          <span>{area.area}<small lang="en">{area.area_en}</small></span><span aria-hidden="true">↗</span>
        </Link>)}
      </nav> : <div className={styles.empty}>
        <h2>아직 이 목적에 맞는 동네가 없어요.</h2>
        <Link href="/">다른 목적 고르기 ↗</Link>
      </div>}
    </div>
  </div>;
}
