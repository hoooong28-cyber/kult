'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser, subscribeUser, type UserProfile } from '@/lib/userStore';
import { getLocalNaverLists } from '@/lib/localNaverLists';
import { uniqueImportedPlaces } from '@/lib/naverImport';
import { addPrivateNaverPlace, listPrivateNaverPlaces } from '@/lib/privateNaverPlaces';
import { collectBrowserNaverPlaces } from '@/lib/memberPlaceCandidates';

type Place = { id: string; name: string };
type Match = { nickname: string; commonPlaceIds: string[]; newPlaces: Place[] };
type Shelf = { nickname: string; places: Place[] };
const endpoint = '/api/taste-neighbors';
const map = (id: string) => 'https://map.naver.com/p/entry/place/' + id;
const btn = 'min-h-11 rounded-lg border border-[var(--kult-rule)] px-4 py-2 text-sm font-bold disabled:opacity-50';
const card = 'space-y-3 rounded-2xl border border-[var(--kult-rule)] bg-white p-4 sm:p-6';

export function loadBrowserNaverPlaces(): Place[] {
  return collectBrowserNaverPlaces({
    imported: uniqueImportedPlaces(getLocalNaverLists()),
    individual: listPrivateNaverPlaces(),
  });
}

export default function TasteNeighborsPanel() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const apply = (profile: UserProfile | null) => {
      setUser(profile); setMatches(null); setChosen([]); setNickname(''); setNotice(''); setShelf(null);
      try { setPlaces(profile ? loadBrowserNaverPlaces() : []); }
      catch { setPlaces([]); setNotice('저장된 장소를 읽지 못했어요. 기존 목록은 그대로예요.'); }
    };
    apply(getCurrentUser());
    return subscribeUser(apply);
  }, []);

  useEffect(() => {
    const ctl = new AbortController();
    fetch(endpoint, { cache: 'no-store', signal: ctl.signal, credentials: user ? 'same-origin' : 'omit' })
      .then(r => { if (!r.ok) throw Error(); return r.json(); })
      .then(body => { setEnabled(body.enabled === true); if (user) setShelf(body.ownShelf ?? null); })
      .catch(() => { if (!ctl.signal.aborted) setEnabled(false); });
    return () => ctl.abort();
  }, [user]);

  const chosenPlaces = places.filter(place => chosen.includes(place.id));
  async function submit(action: 'match' | 'publish' | 'revoke') {
    if (busy || !enabled || !user) return;
    setBusy(true); setNotice('');
    if (action !== 'publish') setMatches(null);
    try {
      const payload = action === 'match' ? { action, placeIds: chosen } :
        { action, nickname: nickname.trim(), places: chosenPlaces, consent: true };
      const response = await fetch(endpoint, { method: action === 'revoke' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: action === 'revoke' ? undefined : JSON.stringify(payload) });
      if (!response.ok) throw Error();
      const result = await response.json();
      if (action === 'match') {
        const saved = new Set(places.map(place => place.id));
        setMatches(((result.matches ?? []) as Match[]).map(match => ({
          ...match, newPlaces: match.newPlaces.filter(place => !saved.has(place.id)),
        })).filter(match => match.newPlaces.length));
      }
      else if (action === 'publish') {
        setShelf({ nickname: nickname.trim(), places: chosenPlaces }); setMatches(null);
        setNotice('선택한 장소만 다른 취향 메이트에게 보여요.');
      } else {
        setShelf(null); setNotice('공개를 취소했어요. 내 아카이브는 그대로예요.');
      }
    } catch { setNotice('처리하지 못했어요. 잠시 후 다시 시도해 주세요.'); }
    finally { setBusy(false); }
  }

  function save(place: Place) {
    if (!user) return;
    try {
      const result = addPrivateNaverPlace(map(place.id), place.name, user.id);
      setPlaces(loadBrowserNaverPlaces());
      setNotice(result.added ? '내 아카이브에 비공개로 저장했어요.' : '이미 내 아카이브에 있어요.');
    } catch { setNotice('저장하지 못했어요.'); }
  }

  if (enabled === null) return <p role="status">확인 중이에요.</p>;
  if (!enabled) return <div className={card}>
    <h2 className="font-bold">아직 이용할 수 없어요</h2>
    <p>다른 사람과 장소를 비교하는 기능은 테스트 중이에요. 내 저장 목록은 공개되지 않아요.</p>
    <Link href="/archive#naver-import" className="underline underline-offset-4">내 네이버 지도 목록 가져오기</Link>
  </div>;
  if (!user) return <div className={card}>
    <h2 className="font-bold">내가 저장한 곳부터 가져와요</h2>
    <p>내 아카이브에서 브라우저 프로필을 열고 네이버 지도 링크를 가져온 뒤 돌아오세요.</p>
    <Link href="/archive#naver-import" className="underline underline-offset-4">네이버 지도 목록 가져오기</Link>
  </div>;

  return <div className="grid gap-4">
    <p className="text-sm">테스트 기능이에요. 비교할 곳을 직접 골라요. 비교만 하면 선택한 장소 번호를 매칭에 쓰고, 내 목록을 공개하지 않아요. 공개를 누른 경우에만 선택한 장소 이름과 별명이 다른 사람에게 보여요. 메모와 목록 링크는 쓰지 않아요.</p>
    {shelf && <div className={card}>
      <p><strong>{shelf.nickname}</strong> 이름으로 {shelf.places.length}곳을 공유 중이에요.</p>
      <button type="button" className={btn} disabled={busy} onClick={() => submit('revoke')}>공개 취소</button>
    </div>}
    <fieldset className={card}>
      <legend className="px-2 font-bold">비교에 쓸 장소 고르기</legend>
      {!places.length && <p>일치 여부를 확인할 수 있는 네이버 장소가 아직 없어요.</p>}
      <div className="max-h-64 overflow-auto divide-y divide-[var(--kult-rule)]">
        {places.map(place => <label key={place.id} className="flex min-h-11 items-center gap-3 py-2 break-words">
          <input type="checkbox" checked={chosen.includes(place.id)} disabled={busy || chosen.length >= 40 && !chosen.includes(place.id)}
            onChange={e => {setMatches(null); setChosen(old => e.target.checked ? [...old, place.id] : old.filter(id => id !== place.id));}} />
          <span>{place.name}</span>
        </label>)}
      </div>
      <p className="text-sm">{chosen.length}곳 선택 · 최소 2곳 / 최대 40곳</p>
      <button type="button" className={btn} disabled={busy || chosen.length < 2} onClick={() => submit('match')}>나와 닮은 저장 목록 보기</button>
      <Link className="ml-3 inline-flex min-h-11 items-center text-sm underline" href="/archive#naver-import">장소 더 가져오기</Link>
    </fieldset>
    <div className={card}>
      <h2 className="font-bold">고른 장소만 공개하기</h2>
      <p className="text-sm">공개하려면 3~30곳을 골라요. 아래 별명과 위에서 고른 장소 이름이 그대로 보여요. 이름에 개인 정보가 들어 있다면 고르지 마세요.</p>
      <label className="block text-sm">표시할 별명
        <input className="mx-2 max-w-full rounded border border-[var(--kult-rule)] px-2 py-2" maxLength={32} value={nickname} onChange={e => setNickname(e.target.value)} />
      </label>
      <button type="button" className={btn} disabled={busy || chosen.length < 3 || chosen.length > 30 || !nickname.trim()} onClick={() => submit('publish')}>선택한 장소 {chosen.length}곳 공개</button>
    </div>
    <p role="status" className="text-sm">{notice}</p>
    {matches && <section className="grid gap-3" aria-label="비슷한 저장 목록">
      {!matches.length && <p className={card}>아직 새로 발견할 곳이 없어요. 같은 곳을 2곳 이상 저장한 사람이 공개한 장소 중에서 찾아요.</p>}
      {matches.map((match, index) => <article className={card} key={index}>
        <h2 className="font-bold">{match.nickname}님도 {match.commonPlaceIds.length}곳을 저장했어요</h2>
        <p className="text-sm">공통: {match.commonPlaceIds.map(id => places.find(p => p.id === id)?.name ?? '저장한 장소').join(' · ')}</p>
        <ul className="grid gap-2">{match.newPlaces.filter(p => !places.some(existing => existing.id === p.id)).map(place => <li key={place.id} className="flex flex-wrap items-center justify-between gap-2">
          <a href={map(place.id)} target="_blank" rel="noopener noreferrer" className="underline">{place.name} ↗</a>
          <button type="button" className={btn} onClick={() => save(place)}>내 아카이브에 저장</button>
        </li>)}</ul>
      </article>)}
    </section>}
  </div>;
}
