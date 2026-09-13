'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Sliders, Feather } from 'lucide-react';
import { getCurrentUser, updateUserProfile, UserProfile } from '@/lib/userStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [name, setName] = useState('');
  const [identityTag, setIdentityTag] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (isOpen) {
      const u = getCurrentUser();
      if (u) {
        setName(u.name);
        setIdentityTag(u.identityTag);
        setBio(u.bio);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, bio, identityTag);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#1C1C1A] border border-[#E6DFD3]/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#FCF9F5]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#5E5E5D] hover:text-[#FCF9F5] hover:bg-[#2D2D2A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#BF703A] uppercase tracking-widest">
            <Sliders className="w-4 h-4 text-[#BF703A]" />
            <span>EDIT PROFILE & BIO</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#FCF9F5]">
            본인 소개글 및 프로필 관리
          </h3>
          <p className="text-xs text-[#5E5E5D] font-serif italic">
            독자들에게 보여질 본인의 큐레이터 닉네임, 수식어, 소개글을 변경합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              큐레이터 성함 / 닉네임 (Display Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              큐레이터 수식어 뱃지 (Identity Tag)
            </label>
            <input
              type="text"
              value={identityTag}
              onChange={(e) => setIdentityTag(e.target.value)}
              placeholder="예: EDITORIAL CURATOR / 성수동 로스터리 매니아"
              className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              본인 소개글 (Bio Description)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="서울의 조도를 기록하는 에디터..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2D2D2A] text-[#5E5E5D] hover:text-[#FCF9F5]"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#BF703A] hover:bg-[#D98952] text-white transition-all shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>소개글 저장하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
