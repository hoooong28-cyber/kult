'use client';

import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { loadCatalogArchive, setCatalogSave } from '@/lib/catalogArchiveClient';
import { sourceFromLocation, track } from '@/lib/interactions';
import SavePlaceButton from './SavePlaceButton';

export default function CatalogDetailSave({ placeId, status }: { placeId: string; status?: 'retry' | 'login' }) {
  const [mode, setMode] = useState<'loading' | 'guest' | 'local' | 'account' | 'error'>('loading');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localOption, setLocalOption] = useState(false);
  const [message, setMessage] = useState(status === 'retry' ? '로그인했지만 이 공간을 계정에 저장하지 못했어요. 다시 시도해 주세요.' :
    status === 'login' ? 'Google 로그인을 완료하지 못했어요. 다시 시도하거나 이 브라우저에 저장할 수 있어요.' : '');

  useEffect(() => {
    const controller = new AbortController();
    loadCatalogArchive(controller.signal).then(data => {
      if (controller.signal.aborted) return;
      if (data.signedIn) { setSaved(data.ids.includes(placeId)); setMode('account'); }
      else setMode(data.enabled ? 'guest' : 'local');
    }).catch(() => { if (!controller.signal.aborted) setMode('error'); });
    return () => controller.abort();
  }, [placeId]);

  if (mode === 'loading') return <button type="button" disabled className="min-h-11 rounded-xl bg-[#f0ede9] px-3 text-xs font-semibold text-[#1c1c1a]">저장 확인 중</button>;
  if (mode === 'local') return <SavePlaceButton placeId={placeId} />;

  const save = async () => {
    setBusy(true);
    const value = !saved;
    try {
      await setCatalogSave(placeId, value);
      setSaved(value);
      setMessage(value ? '내 계정에 저장했어요.' : '계정 저장을 해제했어요.');
      track(value ? 'place_save' : 'place_unsave', { place_id: placeId, recommendation_source: sourceFromLocation() });
    } catch {
      setMessage('계정 저장을 변경하지 못했어요. 다시 시도해 주세요.');
    } finally { setBusy(false); }
  };

  return <div className="space-y-2">
    {mode === 'guest' && <form method="post" action="/auth/start">
      <input type="hidden" name="next" value={'/cafe/' + placeId} />
      <input type="hidden" name="save" value="1" />
      <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#f0ede9] px-3 text-xs font-semibold text-[#1c1c1a]">
        <Bookmark className="h-4 w-4" />Google로 저장
      </button>
    </form>}
    {mode === 'account' && <button type="button" aria-pressed={saved} disabled={busy} onClick={save}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-semibold ${saved ? 'bg-[#bf703a] text-white' : 'bg-[#f0ede9] text-[#1c1c1a]'}`}>
      <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />{busy ? '처리 중' : saved ? '내 계정에 저장됨' : '내 KULT에 저장'}
    </button>}
    {mode === 'error' && <p role="status" className="max-w-64 text-xs">계정 저장에 연결할 수 없어요. 새로고침하거나 이 브라우저에 저장할 수 있어요.</p>}
    {message && <p role="status" className="max-w-64 text-xs">{message}</p>}
    <button type="button" aria-expanded={localOption} onClick={() => setLocalOption(!localOption)}
      className="min-h-11 px-2 text-xs underline underline-offset-2">이 브라우저 저장</button>
    {localOption && <SavePlaceButton placeId={placeId} />}
  </div>;
}
