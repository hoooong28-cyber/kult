import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { getMergedCafes } from '@/lib/curators';
import { kultMemberSettings } from '@/lib/supabase/server';
import { picks, pickPurposes, purposePicks, resolveEditorialPick, resolvePickPurpose } from '@/lib/editorialPicks';
import styles from './entry.module.css';

type Props = { searchParams: Promise<{ purpose?: string | string[] }> };
const neighborhoodOrder = ['삼각지', '해방촌', '성수'];

export default async function HomePage({ searchParams }: Props) {
  const purpose = resolvePickPurpose((await searchParams).purpose);
  const catalog = purpose ? await getMergedCafes() : [];
  const areas = purpose ? neighborhoodOrder.flatMap(area => {
    const pick = picks.find(candidate => candidate.area === area);
    if (!pick) return [];
    const resolved = resolveEditorialPick(pick.slug, catalog);
    return resolved && purposePicks(resolved.places, purpose.id).length ? [pick] : [];
  }) : [];

  return <div className={styles.page} lang="ko">
    <Header section="entry" />
    <main className={styles.entry} aria-labelledby="entry-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow} lang="en"><span aria-hidden="true" /> THE SEOUL EDIT</p>
          <h1 id="entry-title">오늘의 큐레이션 장소는?</h1>
          <p className={styles.dek}>서울에서 골라둔 카페와 식당.</p>
        </div>
        <section className={styles.chooser} aria-labelledby="entry-choice-title">
          <div className={styles.choiceHeader}>
            <h2 id="entry-choice-title">{purpose ? '동네' : '목적'}</h2>
            {purpose && <Link href="/" scroll={false} className={styles.editChoice} aria-label={purpose.label + ' · 목적 바꾸기'}>
              {purpose.label}<span>변경</span>
            </Link>}
          </div>
          <nav aria-label={purpose ? purpose.label + '에 맞는 동네' : '방문 목적 선택'}>
            <ul className={styles.choices}>
              {purpose ? areas.map(area => <li key={area.slug}>
                <Link className={styles.choice} href={'/picks/' + area.slug + '?purpose=' + purpose.id}>
                  {area.area}<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </li>) : pickPurposes.map(option => <li key={option.id}>
                <Link className={styles.choice} href={'/?purpose=' + option.id} scroll={false}>
                  {option.label}<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </li>)}
            </ul>
            {purpose && !areas.length && <p className={styles.empty}>아직 준비된 동네가 없어요. 목적을 바꿔 둘러보세요.</p>}
          </nav>
        </section>
        <nav className={styles.importLinks} aria-label="네이버 지도 가져오기">
          <Link href="/archive#naver-import">네이버 지도 저장 목록 가져오기 <span aria-hidden="true">↗</span></Link>
          <Link href="/archive#naver-single">장소 하나 저장</Link>
        </nav>
      </div>
      <figure className={styles.photo}>
        <div className={styles.photoFrame}>
          <Image src="/venues/cuco-seongsu-interior.jpg" alt="성수 쿠코의 실내" fill
            sizes="(max-width: 767px) 94vw, (max-width: 1200px) 44vw, 530px" />
        </div>
        <figcaption>성수 · 쿠코</figcaption>
      </figure>
      <nav className={styles.secondary} aria-label="기타 메뉴">
        <Link href="/discoveries#pick-two">동네별로 보기</Link>
        <Link href="/archive">내 아카이브</Link>
        {(kultMemberSettings() || process.env.NODE_ENV === 'development') && <Link href="/taste-neighbors">취향이 닮은 사람</Link>}
        <Link href="/collections/k-seoul-evenings">K가 고른 서울의 저녁</Link>
      </nav>
    </main>
  </div>;
}
