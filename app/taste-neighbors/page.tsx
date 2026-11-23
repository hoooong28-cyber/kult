import Header from '@/components/Header';
import { kultMemberSettings } from '@/lib/supabase/server';
import MemberTastePanel from '@/components/MemberTastePanel';
import TasteNeighborsPanel from '@/components/TasteNeighborsPanel';
import styles from '@/app/picks/[slug]/picks.module.css';

export const metadata = { title: '취향이 닮은 사람 · KULT', robots: { index: false, follow: false } };

export default function Page() {
  return <div lang="ko" className={styles.paper}><Header section="picks" />
    <main className={styles.wrap}>
      <header className={styles.intro}>
        <p className={styles.eyebrow} lang="en">KULT <span> / </span> TASTE NEIGHBORS</p>
        <h1>취향이 닮은 사람<span>.</span></h1>
        <p className={styles.dek}>나랑 같은 곳을 저장한 사람은 또 어디를 좋아할까요?</p>
      </header>
      <section className={styles.results}>{kultMemberSettings() ? <MemberTastePanel /> : <TasteNeighborsPanel />}</section>
    </main>
  </div>;
}
