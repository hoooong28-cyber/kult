'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadCatalogArchive, setCatalogSave } from '@/lib/catalogArchiveClient';
import type { CuratedCafe } from '@/lib/types';

export default function CatalogAccountArchive({ cafes }: { cafes: CuratedCafe[] }) {
  const [mode, setMode] = useState<'loading' | 'hidden' | 'guest' | 'account' | 'error'>('loading');
  const [ids, setIds] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    loadCatalogArchive(controller.signal).then(data => {
      if (controller.signal.aborted) return;
      if (data.signedIn) { setIds(data.ids); setMode('account'); }
      else setMode(data.enabled ? 'guest' : 'hidden');
    }).catch(() => { if (!controller.signal.aborted) setMode('error'); });
    return () => controller.abort();
  }, []);
  if (mode === 'loading' || mode === 'hidden') return null;

  async function remove(id: string) {
    setBusy(id);
    setMessage('');
    try {
      await setCatalogSave(id, false);
      setIds(items => items.filter(item => item !== id));
      setMessage('계정 저장을 해제했어요.');
    } catch { setMessage('저장을 해제하지 못했어요. 다시 시도해 주세요.'); }
    finally { setBusy(null); }
  }

  return <section aria-labelledby="account-saved-places" className="space-y-3 rounded-2xl border border-stone-700 p-4 sm:p-6">
    <h2 id="account-saved-places" className="text-xl font-bold">계정에 저장한 공간</h2>
    {mode === 'guest' && <Link href="/account?next=%2Farchive" className="inline-flex min-h-11 items-center underline">Google로 로그인하기</Link>}
    {mode === 'error' && <p role="status">계정 저장소를 열지 못했어요. 이 브라우저의 저장은 그대로예요.</p>}
    {mode === 'account' && <><p className="text-sm text-stone-400">이 공간은 내 계정만 볼 수 있어요. 브라우저에 저장한 공간은 자동으로 옮기지 않아요.</p>
      {ids.length ? <ul className="divide-y divide-stone-700">{ids.map(id => {
        const cafe = cafes.find(row => row.id === id);
        return <li key={id} className="flex flex-wrap items-center justify-between gap-x-4">
          {cafe ? <Link href={'/cafe/' + id} className="inline-flex min-h-11 items-center underline underline-offset-2">
            {cafe.name_local}{cafe.business_status === 'closed' ? ' · 영업 종료' : ''}
          </Link> : <span className="py-2 text-sm text-stone-400">현재 볼 수 없는 공간 ({id})</span>}
          <button type="button" disabled={busy !== null} aria-label={(cafe?.name_local ?? id) + ' 계정 저장 해제'}
            className="min-h-11 px-2 text-sm text-stone-300" onClick={() => remove(id)}>저장 해제</button>
        </li>;
      })}</ul> : <p>아직 계정에 저장한 공간이 없어요.</p>}
      {message && <p role="status" className="text-sm">{message}</p>}
    </>}
  </section>;
}
