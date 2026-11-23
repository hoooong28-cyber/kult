import Link from 'next/link';
import { ArrowRight, Coffee, Heart, MapPin, UsersRound } from 'lucide-react';
import Header from '@/components/Header';
import { kultMemberSettings } from '@/lib/supabase/server';
import { pickPurposes } from '@/lib/editorialPicks';
import styles from './entry.module.css';

const purposeIcons = { date: Heart, friends: UsersRound, solo: Coffee };

export default function HomePage() {
  return <div className={styles.page} lang="ko">
    <Header section="entry" />
    <section className={styles.entry} aria-labelledby="entry-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow} lang="en">KULT <span /> SEOUL CITY GUIDE</p>
        <h1 id="entry-title">오늘 어디 갈까요?</h1>
        <p className={styles.dek}>같이 가는 사람과 동네를 골라 서울의 카페와 식당을 찾아보세요.</p>
        <nav className={styles.choices} aria-label="방문 목적 선택">
          {pickPurposes.map(purpose => {
            const Icon = purposeIcons[purpose.id];
            return <Link className={styles.choice} key={purpose.id} href={'/picks/area?purpose=' + purpose.id}>
              <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
              <span>{purpose.label}<small lang="en">{purpose.english}</small></span>
              <ArrowRight className={styles.arrow} size={17} strokeWidth={1.75} aria-hidden="true" />
            </Link>;
          })}
        </nav>
        <section className="mt-6 rounded-2xl border border-[var(--kult-rule)] bg-[var(--kult-cream)] px-4 py-3" aria-label="네이버 지도 가져오기">
          <p className="text-sm font-bold text-[var(--kult-ink)]">네이버 지도에 모아둔 곳이 있나요?</p>
          <div className="flex flex-wrap gap-x-4">
            <Link href="/archive#naver-import" className="inline-flex min-h-11 items-center gap-2 font-bold text-[var(--kult-accent-text)] underline underline-offset-4">
              <MapPin size={17} aria-hidden="true" /> 저장 목록 가져오기
            </Link>
            <Link href="/archive#naver-single" className="inline-flex min-h-11 items-center text-sm text-[var(--kult-muted)] underline underline-offset-4">장소 하나 저장하기</Link>
          </div>
        </section>
        <nav className={styles.secondary} aria-label="기타 메뉴">
          <Link href="/discoveries#pick-two">동네별로 보기</Link>
          <Link href="/archive">내 아카이브</Link>
          {(kultMemberSettings() || process.env.NODE_ENV === 'development') && <Link href="/taste-neighbors">취향이 닮은 사람</Link>}
          <Link href="/collections/k-seoul-evenings">K가 고른 서울의 저녁</Link>
        </nav>
      </div>
    </section>
  </div>;
}
