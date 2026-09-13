'use client';

import React, { useState } from 'react';
import { X, UserPlus, LogIn, Sparkles, Feather } from 'lucide-react';
import { signUpUser, logInUser, getCurrentUser } from '@/lib/userStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identityTag, setIdentityTag] = useState('SEOUL CURATOR');
  const [bio, setBio] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      signUpUser(name || 'KULT Editor', email, bio, identityTag);
    } else {
      // Simulate login
      signUpUser('송민지', email || 'eleanor@kult.magazine', bio, identityTag);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#1C1C1A] border border-[#E6DFD3]/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#FCF9F5]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#5E5E5D] hover:text-[#FCF9F5] hover:bg-[#2D2D2A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex bg-[#2D2D2A] p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-[#BF703A] text-white shadow-md font-bold'
                : 'text-[#5E5E5D] hover:text-[#FCF9F5]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>회원가입 (Join)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[#BF703A] text-white shadow-md font-bold'
                : 'text-[#5E5E5D] hover:text-[#FCF9F5]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>로그인 (Log In)</span>
          </button>
        </div>

        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#BF703A] uppercase tracking-widest">
            <Feather className="w-4 h-4 text-[#BF703A]" />
            <span>KULT CURATOR NETWORK</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#FCF9F5]">
            {mode === 'signup' ? '에디터 계정 생성하기' : 'KULT 아카이브 접속'}
          </h3>
          <p className="text-xs text-[#5E5E5D] font-serif italic">
            {mode === 'signup'
              ? '나만의 서울 서재를 발행하고 공간 아티클을 기고해 보세요.'
              : '저장된 서재와 취향 데이터를 동기화합니다.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                에디터 성함 / 닉네임 (Display Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 송민지 (Eleanor)"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              이메일 주소 (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@kult.magazine"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              비밀번호 (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                  큐레이터 수식어 태그 (Identity Tag)
                </label>
                <input
                  type="text"
                  value={identityTag}
                  onChange={(e) => setIdentityTag(e.target.value)}
                  placeholder="예: 성수동 로스터리 탐색가"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                  본인 소개글 (Bio Description)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="서울의 조용한 공간과 커피 테루아를 기록하는 한 줄 소개글..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-[#BF703A] hover:bg-[#D98952] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>{mode === 'signup' ? '가입 완료 및 에디터 계정 생성' : '아카이브 로그인'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
