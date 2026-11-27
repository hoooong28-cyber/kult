import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import EntryChooser from './EntryChooser';
import Header from '@/components/Header';
import { getMergedCafes } from '@/lib/curators';
import { kultMemberSettings } from '@/lib/supabase/server';
import { pickPurposes, resolvePurposeAreas, resolvePurposeShortlist } from '@/lib/editorialPicks';
import styles from './entry.module.css';

type Props = { searchParams: Promise<{ purpose?: string | string[] }> };

export default async function HomePage({ searchParams }: Props) {
  // Use the same catalog rules as the results routes, but ship only labels and
  // counts up front so choosing a purpose never waits on another route request.
  await searchParams;
  const catalog = await getMergedCafes({ resolveMapCoordinates: false });
  const options = pickPurposes.map(option => ({
    id: option.id,
    label: option.label,
    cue: option.cue,
    areas: resolvePurposeAreas(catalog, option.id),
    allCount: resolvePurposeShortlist(catalog, option.id).length,
  }));

  return <div className={styles.page} lang="ko">
    <Header section="entry" />
    <main className={styles.entry} aria-labelledby="entry-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow} lang="en"><span aria-hidden="true" /> THE SEOUL EDIT</p>
        <h1 id="entry-title">오늘의 큐레이션 장소는?</h1>
        <p className={styles.dek}>서울에서 골라둔 카페와 식당.</p>
      </div>
      <div className={styles.cover}>
        <Image src="/brand/kult-cafe-cover.webp" alt="" width={1040} height={1300}
          sizes="(max-width: 767px) and (max-height: 700px) min(70vw, 264px, 29svh), (max-width: 767px) min(70vw, 264px, 33svh), (max-width: 1200px) 39vw, 460px"
          className={styles.coverImage} />
      </div>
      <div className={styles.inner}>
        <EntryChooser options={options} />
        <nav className={styles.importLinks} aria-label="네이버 지도 가져오기">
          <Link href="/archive#naver-import">네이버 지도 저장 목록 가져오기 <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" /></Link>
          <Link href="/archive#naver-single">장소 하나 저장</Link>
        </nav>
      </div>
      <nav className={styles.secondary} aria-label="기타 메뉴">
        <Link href="/discoveries#pick-two">동네별로 보기</Link>
        <Link href="/archive">내 아카이브</Link>
        {(kultMemberSettings() || process.env.NODE_ENV === 'development') && <Link href="/taste-neighbors">취향이 닮은 사람</Link>}
        <Link href="/collections/k-seoul-evenings">K가 고른 서울의 저녁</Link>
      </nav>
    </main>
  </div>;
}
