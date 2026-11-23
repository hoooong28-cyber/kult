'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadBrowserNaverPlaces } from './TasteNeighborsPanel';
import { getCurrentUser } from '@/lib/userStore';
import { getSavedCafeIds } from '@/lib/archiveStore';
import { getLocalNaverLists } from '@/lib/localNaverLists';
import { uniqueImportedPlaces } from '@/lib/naverImport';
import { listPrivateNaverPlaces } from '@/lib/privateNaverPlaces';
import { collectBrowserNaverPlaces } from '@/lib/memberPlaceCandidates';
import type { CuratedCafe } from '@/lib/types';

type Place = { id: string; name: string };
type Shelf = { nickname: string; places: Place[] };
type Match = { nickname: string; commonPlaceIds: string[]; newPlaces: Place[] };
type Status = { signedIn: boolean; places?: Place[]; shelf?: Shelf | null };

const uri = '/api/member-places';
const card = 'space-y-3 rounded-2xl border border-[var(--kult-rule)] bg-white p-4 sm:p-6';
const button = 'inline-flex min-h-11 items-center rounded-lg border border-[var(--kult-rule)] px-4 py-2 text-sm font-bold disabled:opacity-50';

export default function MemberTastePanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [local, setLocal] = useState<Place[]>([]);
  const [staged, setStaged] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [nickname, setNickname] = useState('');
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [lookedUpLocal, setLookedUpLocal] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    fetch(uri, { cache: 'no-store', signal: ctl.signal })
      .then(async res => { if (!res.ok) throw new Error(); return await res.json(); })
      .then(data => { setStatus(data); setShelf(data.shelf ?? null); })
      .catch(() => { if (!ctl.signal.aborted) setUnavailable(true); });
    if (getCurrentUser()) {
      try { setLocal(loadBrowserNaverPlaces()); } catch { setMessage('브라우저 목록을 읽지 못했어요. 원본은 그대로예요.'); }
    }
    return () => ctl.abort();
  }, []);

  async function action(post: Record<string, unknown>, notice: string) {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      const res = await fetch(uri, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) });
      const body = await res.json();
      if (res.status === 401) { setStatus({ signedIn: false }); setMatches(null); setShelf(null); return; }
      if (!res.ok) throw new Error(body.error || '다시 시도해 주세요.');
      if (Array.isArray(body.places)) {
        setStatus({ signedIn: true, places: body.places }); setStaged([]);
        if (post.action === 'remove') setChosen(old => old.filter(id => id !== post.placeId));
      }
      if ('shelf' in body) setShelf(body.shelf);
      if (post.action === 'match') setMatches(body.matches ?? []);
      else setMatches(null);
      setMessage(notice);
    } catch (error) { setMessage(error instanceof Error ? error.message : '다시 시도해 주세요.'); }
    finally { setBusy(false); }
  }

  async function showLegacySaves() {
    if (busy) return;
    const profile = getCurrentUser();
    if (!profile) { setMessage('내 아카이브에서 이 브라우저 프로필을 먼저 열어 주세요.'); return; }
    setBusy(true); setMessage('');
    try {
      const localIds = new Set(getSavedCafeIds());
      const res = await fetch('/api/cafes?includeClosed=1', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const { cafes } = await res.json() as { cafes: CuratedCafe[] };
      if (getCurrentUser()?.id !== profile.id) {
        setLocal([]); setStaged([]);
        setMessage('브라우저 프로필이 바뀌어 기존 아카이브 표시를 중단했어요.');
        return;
      }
      const known = cafes.filter(row => localIds.has(row.id));
      // Closed exact IDs suppress duplicates even if the user now reaches one via another local source.
      const native = [...known, ...cafes.filter(row => row.business_status === 'closed' && !localIds.has(row.id))];
      setLocal(collectBrowserNaverPlaces({
        imported: uniqueImportedPlaces(getLocalNaverLists()), individual: listPrivateNaverPlaces(), native,
      }));
      setStaged([]); setLookedUpLocal(true);
      if (known.some(row => !row.naver_place_id || row.is_demo || row.business_status === 'closed'))
        setMessage('네이버 장소 번호가 없거나 영업이 종료된 곳은 브라우저에 그대로 남겨뒀어요.');
      else setMessage('옮길 수 있는 장소만 보여요. 직접 골라 계정에 저장하기 전에는 아무것도 옮기지 않아요.');
    } catch { setMessage('이 브라우저의 저장 기록을 읽지 못했어요. 원본은 그대로예요.'); }
    finally { setBusy(false); }
  }

  if (unavailable) return <p className={card}>회원 저장소에 연결하지 못했어요. 브라우저에 저장된 목록은 그대로예요.</p>;
  if (!status) return <p role="status">확인 중이에요.</p>;
  if (!status.signedIn) return <section className={card}>
    <h2 className="font-bold">로그인하고 취향이 닮은 사람을 찾아봐요</h2>
    <p>비공개로 저장하고, 공개할 장소는 따로 고를 수 있어요.</p>
    <Link href="/account?next=/taste-neighbors" className={button}>가입 · 로그인</Link>
  </section>;

  const places = status.places ?? [];
  const saved = new Set(places.map(p => p.id));
  const localNew = local.filter(p => !saved.has(p.id));
  const check = (id: string, checked: boolean, prev: string[]) => checked ? [...prev, id] : prev.filter(x => x !== id);

  return <div className="grid gap-4">
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Link href="/archive#naver-import" className={button}>네이버 지도 목록 가져오기</Link>
      <Link href="/account?next=/taste-neighbors" className="underline">내 계정</Link>
      <button type="button" className={button} disabled={busy || lookedUpLocal} onClick={showLegacySaves}>이 브라우저의 기존 아카이브 확인</button>
    </div>
    {localNew.length > 0 && <fieldset className={card}>
      <legend className="px-2 font-bold">브라우저에서 가져온 장소</legend>
      <p className="text-sm">고른 장소 이름과 장소 번호만 내 계정에 비공개로 저장해요. 네이버 목록 링크나 메모는 옮기지 않아요.</p>
      <div className="max-h-60 overflow-auto divide-y divide-[var(--kult-rule)]">
        {localNew.map(place => <label key={place.id} className="flex min-h-11 items-center gap-2 break-words">
          <input type="checkbox" checked={staged.includes(place.id)} disabled={busy || (staged.length >= 100 && !staged.includes(place.id))}
            onChange={e => setStaged(prev => check(place.id, e.target.checked, prev))} />{place.name}
        </label>)}
      </div>
      <button className={button} disabled={busy || !staged.length} onClick={() => action({ action: 'merge', places: localNew.filter(p => staged.includes(p.id)) }, '고른 장소를 내 계정에 비공개 저장했어요.')}>선택한 {staged.length}곳을 계정에 저장</button>
    </fieldset>}

    <fieldset className={card}>
      <legend className="px-2 font-bold">내 계정에 저장한 장소 {places.length}곳</legend>
      {!places.length && <p>아직 계정에 저장한 장소가 없어요. 네이버 지도에서 가져온 장소를 먼저 골라 저장해 주세요.</p>}
      <div className="max-h-60 overflow-auto divide-y divide-[var(--kult-rule)]">
        {places.map(place => <div key={place.id} className="flex min-h-11 flex-wrap items-center justify-between gap-2">
          <label className="flex flex-1 items-center gap-2 py-2 break-words">
            <input type="checkbox" checked={chosen.includes(place.id)} disabled={busy || (chosen.length >= 100 && !chosen.includes(place.id))}
              onChange={e => { setMatches(null); setChosen(prev => check(place.id, e.target.checked, prev)); }} />{place.name}
          </label>
          <button type="button" className="min-h-11 px-2 text-sm underline" disabled={busy}
            aria-label={place.name + '을 계정에서 삭제'} onClick={() => {
              if (window.confirm('계정에서 이 장소를 삭제할까요? 공유에도 반영되며 브라우저 원본은 그대로예요.'))
                void action({ action: 'remove', placeId: place.id }, '계정에서 이 장소를 삭제했어요.');
            }}>삭제</button>
        </div>)}
      </div>
      <button className={button} disabled={busy || chosen.length < 2} onClick={() => action({ action: 'match', placeIds: chosen }, '')}>비슷한 취향 찾기 · {chosen.length}곳 선택</button>
      <p className="text-sm">같은 지점이 2곳 이상인 사람이 공개한 장소로 찾고, 이 선택을 공개하지는 않아요.</p>
    </fieldset>

    <section className={card}>
      <h2 className="font-bold">내가 고른 곳만 공유</h2>
      {shelf && <p><strong>{shelf.nickname}</strong> 이름으로 {shelf.places.length}곳 공유 중 <button className={button} disabled={busy} onClick={() => action({ action: 'revoke' }, '공개를 취소했어요. 내 저장 목록은 그대로예요.')}>공개 취소</button></p>}
      <p className="text-sm">위에서 고른 장소 이름과 아래 별명만 보여요. 3곳 이상을 골라 직접 공개해요.</p>
      <label className="block text-sm">공개 별명 <input maxLength={32} className="rounded border px-2 py-2" value={nickname} onChange={e => setNickname(e.target.value)} /></label>
      <button className={button} disabled={busy || chosen.length < 3 || !nickname.trim()} onClick={() =>
        action({ action: 'publish', nickname: nickname.trim(), placeIds: chosen, consent: true }, '선택한 장소만 공개했어요.')}>선택한 {chosen.length}곳 공개</button>
    </section>

    <p role="status">{message}</p>
    {matches && <section className="grid gap-3" aria-label="발견한 장소">
      {!matches.length && <p className={card}>아직 새로 발견할 곳이 없어요. 공개한 목록이 더 쌓이면 다시 찾아보세요.</p>}
      {matches.map((match, index) => <article className={card} key={index}>
        <h2 className="font-bold">{match.nickname}님도 {match.commonPlaceIds.length}곳을 저장했어요</h2>
        <p className="text-sm">공통: {match.commonPlaceIds.map(id => places.find(p => p.id === id)?.name ?? '저장한 장소').join(' · ')}</p>
        <ul className="grid gap-2">{match.newPlaces.filter(p => !saved.has(p.id)).map(place => <li key={place.id} className="flex flex-wrap items-center justify-between gap-2">
          <a href={'https://map.naver.com/p/entry/place/' + place.id} target="_blank" rel="noopener noreferrer" className="underline">{place.name} ↗</a>
          <button className={button} disabled={busy} onClick={() => action({ action: 'merge', places: [place] }, '내 계정에 비공개로 저장했어요.')}>나도 저장</button>
        </li>)}</ul>
      </article>)}
    </section>}
  </div>;
}
