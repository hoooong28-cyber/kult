'use client';

import { useRef, type MouseEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import styles from './entry.module.css';

type Option = {
  id: string;
  label: string;
  cue: string;
  areas: { slug: string; area: string; count: number }[];
  allCount: number;
};

export default function EntryChooser({ options }: { options: Option[] }) {
  const values = useSearchParams().getAll('purpose');
  const purpose = values.length === 1 ? options.find(option => option.id === values[0]) : undefined;
  const title = useRef<HTMLHeadingElement>(null);

  function changePurpose(event: MouseEvent<HTMLAnchorElement>) {
    // Keep normal links for opening a new tab, sharing, and the no-JS fallback.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, '', event.currentTarget.href);
    title.current?.focus({ preventScroll: true });
  }

  return <section className={styles.chooser} data-purpose-selected={purpose ? 'true' : undefined} aria-labelledby="entry-choice-title">
    <div className={styles.choiceHeader}>
      <h2 ref={title} tabIndex={-1} id="entry-choice-title"><span className={styles.choiceStep} aria-hidden="true">{purpose ? '02' : '01'}</span>{purpose ? '동네' : '방문 목적'}</h2>
      {purpose && <a href="/" onClick={changePurpose} className={styles.editChoice} aria-label={purpose.label + ' · 목적 바꾸기'}>
        {purpose.label}<span>변경</span>
      </a>}
    </div>
    <nav aria-label={purpose ? purpose.label + '에 맞는 동네' : '방문 목적 선택'}>
      <ul className={styles.choices}>
        {purpose ? <>
          {purpose.areas.map(area => <li key={area.slug}>
            <Link className={styles.choice} href={'/picks/' + area.slug + '?purpose=' + purpose.id}>
              <span>{area.area}</span><span className={styles.choiceTail}><span className={styles.count}>{area.count}곳</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></span>
            </Link>
          </li>)}
          {purpose.allCount > 0 && <li>
            <Link className={styles.choice} href={'/picks?purpose=' + purpose.id}>
              <span className={styles.choiceCopy}><span>동네는 아직 미정</span><small>서울에서 이 목적에 맞는 곳만 보기</small></span>
              <span className={styles.choiceTail}><span className={styles.count}>{purpose.allCount}곳</span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></span>
            </Link>
          </li>}
        </> : options.map(option => <li key={option.id}>
          <a className={styles.choice} href={'/?purpose=' + option.id} onClick={changePurpose}>
            <span className={styles.choiceCopy}><span>{option.label}</span><small>{option.cue}</small></span><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </li>)}
      </ul>
      {purpose && !purpose.areas.length && <p className={styles.empty}>아직 준비된 동네가 없어요. 목적을 바꿔 둘러보세요.</p>}
    </nav>
  </section>;
}
