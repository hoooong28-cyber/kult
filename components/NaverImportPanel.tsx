'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImportedList, mergeImportedLists, uniqueImportedPlaces } from '@/lib/naverImport';

const STORAGE_KEY = 'kult_naver_imported_lists_v1';

export default function NaverImportPanel({ onCountChange }: { onCountChange: (count: number) => void }) {
  const [url, setUrl] = useState('');
  const [lists, setLists] = useState<ImportedList[]>([]);
  const [preview, setPreview] = useState<ImportedList | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        if (!Array.isArray(stored) || !stored.every(list => typeof list.shareId === 'string' && Array.isArray(list.places) && list.places.every((p: { id?: unknown; name?: unknown; address?: unknown; category?: unknown; url?: unknown }) => typeof p.id === 'string' && typeof p.name === 'string' && typeof p.address === 'string' && typeof p.category === 'string' && typeof p.url === 'string' && p.url.startsWith('https://map.naver.com/')))) throw new Error();
        setLists(stored);
      }
      setReady(true);
    } catch { setError('저장된 목록을 읽지 못했습니다. 브라우저 저장소를 확인해주세요. 기존 데이터는 덮어쓰지 않았습니다.'); }
  }, []);

  const places = useMemo(() => uniqueImportedPlaces(lists), [lists]);
  useEffect(() => { onCountChange(places.length); }, [places.length, onCountChange]);
  const visible = places.filter(p => `${p.name} ${p.address} ${p.category}`.toLowerCase().includes(query.toLowerCase()));

  async function loadList(link: string) {
    setBusy(true); setError(''); setMessage(''); setPreview(null);
    try {
      const response = await fetch('/api/import/naver', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link }), signal: AbortSignal.timeout(30000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '목록을 불러오지 못했습니다.');
      setPreview(data.list);
    } catch (e) { setError(e instanceof Error && e.name !== 'TimeoutError' ? e.message : '응답이 늦어지고 있습니다. 잠시 후 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }

  function savePreview() {
    if (!preview || !ready) return;
    const updated = mergeImportedLists(lists, preview);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLists(updated); setPreview(null);
      setMessage(`‘${preview.name}’ ${preview.places.length}개 장소를 저장했습니다.`);
    } catch { setError('브라우저 저장 공간이 부족하거나 차단되어 저장하지 못했습니다.'); }
  }

  return (
    <section aria-labelledby="naver-import-title" className="rounded-3xl border border-stone-700 bg-stone-900 p-5 sm:p-8 space-y-5">
      <div>
        <p className="text-xs text-amber-300 tracking-widest mb-2">MY PLACES</p>
        <h2 id="naver-import-title" className="font-serif text-2xl font-bold">네이버 지도에서 내 장소 가져오기</h2>
        <p className="text-sm text-stone-300 mt-2">네이버 지도 → 저장 → 리스트 → 공유에서 복사한 링크를 넣어주세요.</p>
        <p className="text-xs text-stone-400 mt-2">일부 공개·전체 공개 목록을 지원합니다. 장소는 이 브라우저에 저장되며 다른 기기와 동기화되지 않습니다.</p>
      </div>
      <form onSubmit={e => { e.preventDefault(); void loadList(url); }} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="naver-list-url" className="block text-xs mb-2 text-stone-300">저장 목록 공유 링크</label>
          <input id="naver-list-url" type="url" required maxLength={2048} value={url} onChange={e => {setUrl(e.target.value); setPreview(null);}} placeholder="https://naver.me/…" disabled={busy} className="w-full rounded-xl border border-stone-600 bg-stone-950 px-4 py-3 text-sm" />
        </div>
        <button disabled={busy || !ready} className="self-end w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-300 text-stone-950 font-bold text-sm disabled:opacity-50">{busy ? '목록 불러오는 중…' : '목록 불러오기'}</button>
      </form>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
      {preview && <div className="rounded-2xl border border-amber-300/40 bg-stone-950 p-4 space-y-4">
        <h3 className="font-bold">{preview.name} · {preview.places.length}개 장소</h3>
        <p className="text-xs text-stone-400">{preview.places.filter(p => !p.available).length}개는 폐업했거나 정보가 없습니다. 해당 표시를 유지한 채 가져옵니다.</p>
        {lists.some(l => l.shareId === preview.shareId) && <p className="text-xs text-amber-200">이 목록은 이미 저장되어 있습니다. 저장하면 기존 목록을 현재 내용으로 갱신합니다.</p>}
        <ul className="max-h-64 overflow-auto divide-y divide-stone-800">
          {preview.places.map(p => <li key={p.id} className="py-2"><span className="text-sm font-semibold">{p.name}</span><span className="ml-2 text-xs text-stone-400">{p.category}{!p.available && ' · 정보 확인 필요'}</span><p className="text-xs text-stone-400 mt-1">{p.address || '주소 정보 없음'}</p></li>)}
        </ul>
        {preview.places.length === 0 && <p className="text-sm text-stone-400">저장된 장소가 없는 목록입니다.</p>}
        <div className="flex gap-3">
          <button onClick={savePreview} className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-stone-950">내 장소에 저장</button>
          <button onClick={() => setPreview(null)} className="rounded-xl border border-stone-600 px-4 py-2 text-sm">취소</button>
        </div>
      </div>}
      {lists.length > 0 && <div className="space-y-4 border-t border-stone-700 pt-5">
        <h3 className="font-bold">가져온 내 장소 · {places.length}곳</h3>
        <div className="space-y-2">{lists.map(list => <div key={list.shareId} className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
          <a href={list.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-200 underline">{list.name} · {list.places.length}곳</a>
          <span>{new Date(list.importedAt).toLocaleDateString('ko-KR')} 가져옴</span>
          <button disabled={busy} onClick={() => void loadList(list.sourceUrl)} className="border border-stone-600 rounded-lg px-3 py-1 disabled:opacity-50">최신 목록 다시 불러오기</button>
        </div>)}</div>
        <label className="block text-sm">내 장소 검색<input value={query} onChange={e => setQuery(e.target.value)} placeholder="장소명, 지역, 분류" className="block w-full mt-2 rounded-xl border border-stone-600 bg-stone-950 px-4 py-3" /></label>
        <div className="grid sm:grid-cols-2 gap-3 max-h-[560px] overflow-auto">
          {visible.map(place => <article key={place.id} className="rounded-xl border border-stone-700 bg-stone-950 p-4 space-y-2">
            <p className="text-xs text-amber-200">{place.category || '분류 미확인'}</p>
            <h4 className="font-bold">{place.name}</h4>
            {!place.available && <p className="text-xs text-orange-300">폐업 또는 정보 없음 · 확인 필요</p>}
            <p className="text-xs text-stone-400">{place.address || '주소 정보 없음'}</p>
            {place.memo && <p className="text-sm text-stone-300 whitespace-pre-wrap">{place.memo}</p>}
            <a href={place.url} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-amber-200 underline">네이버 지도에서 보기 ↗</a>
          </article>)}
        </div>
        {visible.length === 0 && <p className="text-sm text-stone-400">검색 결과가 없습니다.</p>}
      </div>}
    </section>
  );
}
