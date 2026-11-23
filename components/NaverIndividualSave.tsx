'use client';

import { BookmarkPlus, ExternalLink, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { parseNaverPlaceLink } from '@/lib/naverPlaceLinks';
import {
  addPrivateNaverPlace, filterPrivateNaverPlaces, listPrivateNaverPlaces, removePrivateNaverPlace, type PrivateNaverPlace,
} from '@/lib/privateNaverPlaces';

interface Props {
  profileId: string;
  cafes: ReadonlyArray<{ naver_place_id?: string; name: string; name_local: string }>;
}

export default function NaverIndividualSave({ profileId, cafes }: Props) {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<PrivateNaverPlace[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const refresh = () => {
      try { setPlaces(listPrivateNaverPlaces()); }
      catch { setPlaces([]); setError('저장된 장소를 읽지 못했어요.'); }
    };
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [profileId]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    let link = parseNaverPlaceLink(input);
    setMessage('');
    setError('');
    if (!link) { setError('네이버 지도에서 장소 하나를 열고 공유 링크를 붙여넣어 주세요.'); return; }
    setPending(true);
    try {
      if (link.kind === 'short') {
        const response = await fetch('/api/naver-link', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: link.url }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || '짧은 링크를 열지 못했어요.');
        link = parseNaverPlaceLink(result.url);
      }
      if (link?.kind !== 'place') throw new Error('장소 링크를 확인하지 못했어요.');
      const id = link.id;
      const match = cafes.find(cafe => cafe.naver_place_id === id);
      const { added, places: next } = addPrivateNaverPlace(link.url, match?.name_local || match?.name || name, profileId);
      setPlaces(next);
      setQuery('');
      setMessage(added ? '내 장소 링크에 저장했어요.' : '이미 저장된 장소예요.');
      if (added) { setInput(''); setName(''); }
    } catch (cause) {
      setError(cause instanceof Error && !(cause instanceof SyntaxError || cause instanceof TypeError)
        ? cause.message : '장소를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally { setPending(false); }
  }

  function remove(place: PrivateNaverPlace) {
    setError('');
    setMessage('');
    try { setPlaces(removePrivateNaverPlace(place.id, profileId)); setMessage('장소 링크를 삭제했어요.'); }
    catch { setError('장소 링크를 삭제하지 못했어요.'); }
  }

  const filtered = filterPrivateNaverPlaces(places, query);
  return (
    <section className="space-y-4 rounded-3xl border border-stone-800 bg-stone-900/70 p-5 sm:p-7" aria-labelledby="naver-single-heading">
      <div>
        <span className="text-[11px] font-bold tracking-[.2em] text-amber-400">PRIVATE PLACE LINKS</span>
        <h2 id="naver-single-heading" className="mt-1 font-serif text-2xl text-stone-100">네이버 지도 장소 하나 저장</h2>
        <p className="mt-2 text-sm text-stone-400">공개 목록에 추가되지 않아요. 이 브라우저 프로필에만 남고, 다른 기기와의 동기화는 추후 계정 연동이 필요해요.</p>
      </div>
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <label className="grid gap-1 text-sm text-stone-300">장소 링크
          <input required type="url" autoComplete="off" value={input} maxLength={2048} onChange={e => setInput(e.target.value)}
            placeholder="https://naver.me/…" className="min-w-0 rounded-lg border border-stone-700 bg-stone-950 p-2.5 text-stone-100" />
        </label>
        <label className="grid gap-1 text-sm text-stone-300">장소 이름 (선택)
          <input value={name} maxLength={100} onChange={e => setName(e.target.value)} placeholder="나만의 이름"
            className="min-w-0 rounded-lg border border-stone-700 bg-stone-950 p-2.5 text-stone-100" />
        </label>
        <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950 disabled:opacity-60">
          <BookmarkPlus aria-hidden="true" className="h-4 w-4" /> {pending ? '저장 중…' : '저장'}
        </button>
      </form>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <p aria-live="polite" className="text-sm text-stone-300">{message}</p>
      {places.length > 0 && (
        <>
          <label className="grid max-w-xs gap-1 text-sm text-stone-300">저장한 장소 검색
            <input type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="이름 또는 장소 번호" className="rounded-lg border border-stone-700 bg-stone-950 p-2.5 text-stone-100" />
          </label>
          <ul className="divide-y divide-stone-800">
            {filtered.map(place => (
              <li key={place.id} className="flex items-center justify-between gap-2 py-2">
                <a href={place.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-2 text-sm text-amber-200 underline underline-offset-4">
                  <span className="break-all">{place.name || `네이버 지도 장소 ${place.id}`}</span>
                  <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                </a>
                <button type="button" onClick={() => remove(place)} aria-label={`${place.name || `장소 ${place.id}`} 삭제`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-stone-800">
                  <Trash2 aria-hidden="true" className="h-4 w-4" /> 삭제
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && <p className="text-sm text-stone-400">검색 결과가 없어요.</p>}
        </>
      )}
    </section>
  );
}
