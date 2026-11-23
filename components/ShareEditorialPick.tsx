'use client';

import { useRef, useState } from 'react';

export default function ShareEditorialPick({ path, title }: { path: string; title: string }) {
  const [fallback, setFallback] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function share(copyOnly = false) {
    setBusy(true);
    setStatus('');
    setFallback('');
    const url = new URL(path, window.location.origin).href;
    try {
      if (!copyOnly && typeof navigator.share === 'function') {
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
        }
      }
      await navigator.clipboard.writeText(url);
      setStatus('링크를 복사했어요 · Link copied');
    } catch {
      setFallback(url);
      setStatus('아래 링크를 직접 복사해 주세요 · Copy this link manually');
    } finally {
      setBusy(false);
    }
  }

  return <div>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={busy} onClick={() => share()} className="min-h-11 rounded-lg bg-[#1C342B] px-4 text-sm font-semibold text-white">친구에게 공유 · Share</button>
      <button type="button" disabled={busy} onClick={() => share(true)} className="min-h-11 rounded-lg border border-[#C7D2C9] px-4 text-sm font-semibold text-[#1C342B]">링크 복사 · Copy link</button>
    </div>
    <p className="mt-2 text-xs text-stone-700" role="status">{status}</p>
    {fallback && <input ref={input} readOnly value={fallback} aria-label="공유 링크 · Share link" onFocus={() => input.current?.select()}
      className="mt-2 w-full max-w-lg rounded border border-stone-400 bg-white px-3 py-2 text-sm" />}
  </div>;
}
