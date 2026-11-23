'use client';

import React, { useState, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Feather, X } from 'lucide-react';
import { hasResumableLocalProfile, resumeLocalProfile, startLocalProfile } from '@/lib/userStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export default function AuthModal({ isOpen, ...actions }: AuthModalProps) {
  if (!isOpen || typeof document === 'undefined') return null;
  return createPortal(<LocalProfileDialog {...actions} />, document.body);
}

function LocalProfileDialog({ onClose, onActivated }: Omit<AuthModalProps, 'isOpen'>) {
  const [canResume, setCanResume] = useState(hasResumableLocalProfile);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    node.showModal();
    return () => { if (node.open) node.close(); };
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canResume && !name.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    try {
      if (canResume) resumeLocalProfile();
      else startLocalProfile(name);
    } catch {
      setCanResume(hasResumableLocalProfile());
      setError('프로필을 열 수 없습니다. 브라우저 저장 설정을 확인해 주세요.');
      return;
    }
    if (onActivated) onActivated();
    else onClose();
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      className="fixed inset-0 m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-[#E6DFD3]/20 bg-[#1C1C1A] p-6 text-[#FCF9F5] shadow-2xl backdrop:bg-black/75 sm:p-8"
    >
      <button type="button" aria-label="닫기" onClick={onClose}
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full text-stone-300 hover:bg-[#2D2D2A]">
        <X className="size-5" />
      </button>
      <div className="mb-6 space-y-2 pr-10">
        <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#E4A06B]">
          <Feather className="size-4" /> MY KULT
        </div>
        <h2 id={titleId} className="font-serif text-2xl font-bold">{canResume ? '브라우저 프로필 열기' : '브라우저 프로필 만들기'}</h2>
        <p id={descriptionId} className="text-sm leading-relaxed text-stone-300">
          {canResume ? '이 브라우저에 저장된 프로필을 이 탭에서 다시 열 수 있어요.' : '닉네임 하나로 이 탭에서 프로필을 열 수 있어요.'}
          {' '}실제 계정 로그인이나 다른 기기와의 동기화는 지원하지 않아요.
        </p>
      </div>
      <form noValidate onSubmit={submit} className="space-y-4">
        {!canResume && (
          <label className="block space-y-1.5 text-sm text-stone-200">
            <span>닉네임</span>
            <input type="text" autoFocus required maxLength={40} value={name}
              onChange={event => { setName(event.target.value); setError(''); }}
              aria-invalid={Boolean(error)}
              className="w-full rounded-xl border border-[#E6DFD3]/20 bg-[#2D2D2A] px-4 py-2.5 text-[#FCF9F5] focus:border-[#BF703A] focus:outline-none" />
          </label>
        )}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" autoFocus={canResume}
          className="w-full rounded-xl bg-[#BF703A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#A65F2E]">
          {canResume ? '이 브라우저의 프로필 열기' : '닉네임으로 시작하기'}
        </button>
      </form>
    </dialog>
  );
}
