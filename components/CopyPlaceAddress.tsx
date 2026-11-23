'use client';

import { useState } from 'react';

export default function CopyPlaceAddress({ address }: { address: string }) {
  const [message, setMessage] = useState('');
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" className="inline-flex min-h-10 items-center rounded-md px-1.5 text-xs underline underline-offset-2" onClick={async () => {
        try { await navigator.clipboard.writeText(address); setMessage('주소를 복사했어요 · Copied'); }
        catch { setMessage('위 주소를 직접 선택해 복사해 주세요.'); }
      }}>주소 복사 · Copy address</button>
      <span role="status" className="text-xs text-[#5e5348]">{message}</span>
    </span>
  );
}
