import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { getMergedCafes } from '@/lib/curators';
import { kultMemberSettings } from '@/lib/supabase/server';
import { pickPurposes, resolvePickPurpose, resolvePurposeAreas, resolvePurposeShortlist } from '@/lib/editorialPicks';
import styles from './entry.module.css';

type Props = { searchParams: Promise<{ purpose?: string | string[] }> };

export default async function HomePage({ searchParams }: Props) {
  const purpose = resolvePickPurpose((await searchParams).purpose);
  const catalog = purpose ? await getMergedCafes({ resolveMapCoordinates: false }) : [];
  const areas = purpose ? resolvePurposeAreas(catalog, purpose.id) : [];
  const allCount = purpose ? resolvePurposeShortlist(catalog, purpose.id).length : 0;

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
            <h2 id="entry-choice-title"><span className={styles.choiceStep} aria-hidden="true">{purpose ? '02' : '01'}</span>{purpose ? '동네' : '방문 목적'}</h2>
            {purpose && <Link href="/" scroll={false} className={styles.editChoice} aria-label={purpose.label + ' · 목적 바꾸기'}>
              {purpose.label}<span>변경</span>
            </Link>}
          </div>
          <nav aria-label={purpose ? purpose.label + '에 맞는 동네' : '방문 목적 선택'}>
            <ul className={styles.choices}>
              {purpose ? areas.map(area => <li key={area.slug}>
                <Link className={styles.choice} href={'/picks/' + area.slug + '?purpose=' + purpose.id}>
                  <span>{area.area}</span><span className={styles.choiceTail}><span className={styles.count}>{area.count}곳</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></span>
                </Link>
              </li>).concat(allCount ? [<li key="all-areas">
                <Link className={styles.choice} href={'/picks?purpose=' + purpose.id}>
                  <span className={styles.choiceCopy}><span>동네는 아직 미정</span><small>서울에서 이 목적에 맞는 곳만 보기</small></span>
                  <span className={styles.choiceTail}><span className={styles.count}>{allCount}곳</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></span>
                </Link>
              </li>] : []) : pickPurposes.map(option => <li key={option.id}>
                <Link className={styles.choice} href={'/?purpose=' + option.id} scroll={false}>
                  <span className={styles.choiceCopy}><span>{option.label}</span><small>{option.cue}</small></span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
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
