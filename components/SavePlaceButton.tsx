'use client';
import { useEffect, useRef, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { isCafeSaved, subscribeArchiveChanges, toggleSaveCafe } from '@/lib/archiveStore';
import { getCurrentUser, subscribeUser } from '@/lib/userStore';
import { sourceFromLocation, type RecommendationSource } from '@/lib/interactions';
import AuthModal from './AuthModal';

export default function SavePlaceButton({placeId, source, compact = false}: {placeId: string; source?: RecommendationSource; compact?: boolean}) {
  const [saved, setSaved] = useState(false), [auth, setAuth] = useState(false), [message, setMessage] = useState('');
  const pending = useRef(false);
  useEffect(() => {
    setSaved(isCafeSaved(placeId));
    return subscribeArchiveChanges(() => setSaved(isCafeSaved(placeId)));
  }, [placeId]);
  function save() {
    try { const value = toggleSaveCafe(placeId, {recommendation_source: source || sourceFromLocation()}); setSaved(value); setMessage(value ? '내 KULT에 저장했습니다.' : '저장을 해제했습니다.'); }
    catch { setMessage('저장하지 못했습니다. 브라우저 저장 공간을 확인하고 다시 시도해 주세요.'); }
  }
  useEffect(() => subscribeUser(user => {
    if (user && pending.current) { pending.current = false; save(); }
  }), [placeId, source]);
  return <div onClick={e => e.stopPropagation()} className="relative">
    <button type="button" aria-pressed={saved} aria-label={saved ? '내 KULT에서 저장 해제' : '내 KULT에 저장'} onClick={() => {if (!getCurrentUser()) { pending.current = true; setAuth(true); } else save();}} className={`min-h-11 min-w-11 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${saved ? 'bg-[#bf703a] text-white' : 'bg-[#f0ede9] text-[#1c1c1a]'}`}><Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />{!compact && (saved ? '내 KULT에 저장됨' : '내 KULT에 저장')}</button>
    {message && <p role="status" className="text-xs mt-2 max-w-64">{message}</p>}
    <AuthModal isOpen={auth} onClose={() => {pending.current = false; setAuth(false);}} />
  </div>;
}
