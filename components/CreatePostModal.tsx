'use client';

import React, { useState } from 'react';
import { X, Send, Coffee, MapPin, Volume2, Plug } from 'lucide-react';
import { createPublishedPost } from '@/lib/userStore';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [titleLocal, setTitleLocal] = useState('');
  const [neighborhood, setNeighborhood] = useState('Mapo');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [noiseLevel, setNoiseLevel] = useState('45 dB Quiet');
  const [outletRatio, setOutletRatio] = useState('70% Outlets');
  const [signaturePairing, setSignaturePairing] = useState('필터커피 & 휘낭시에');
  const [coverImage, setCoverImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPublishedPost({
      title,
      titleLocal: titleLocal || title,
      neighborhood,
      address: address || '서울시 소재 공간',
      notes,
      noiseLevel,
      outletRatio,
      signaturePairing,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#1C1C1A] border border-[#E6DFD3]/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#FCF9F5] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#5E5E5D] hover:text-[#FCF9F5] hover:bg-[#2D2D2A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#BF703A] uppercase tracking-widest">
            <Coffee className="w-4 h-4 text-[#BF703A]" />
            <span>PUBLISH NEW SPACE ARTICLE</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#FCF9F5]">
            새 에디토리얼 공간 기고하기
          </h3>
          <p className="text-xs text-[#5E5E5D] font-serif italic">
            본인이 직접 탐방한 조용한 서울의 작업 공간과 스페셜티 큐레이션을 기록합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                공간명 (English Name)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Anthracite Seogyo"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                한글 공간명 (Local Name)
              </label>
              <input
                type="text"
                value={titleLocal}
                onChange={(e) => setTitleLocal(e.target.value)}
                placeholder="예: 앤트러사이트 서교"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                지역 구역 (Quarter/District)
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              >
                <option value="Seongsu">Seongsu (성수)</option>
                <option value="Mapo">Mapo / Seogyo (마포/서교)</option>
                <option value="Seochon">Seochon & Bukchon (서촌/북촌)</option>
                <option value="Hannam">Hannam (한남)</option>
                <option value="Yongsan">Yongsan (용산)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                상세 주소 (Address)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="서울 마포구 월드컵로12길 11"
                className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              에디터 코멘트 &amp; 기사 노티 (Editorial Notes)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="음악 소리가 낮고 2층 통창 정원이 근사해 사색에 몰입하기 좋습니다..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                소음 측정치 (dB)
              </label>
              <input
                type="text"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(e.target.value)}
                placeholder="42 dB Quiet"
                className="w-full px-3 py-2 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                콘센트 구비율
              </label>
              <input
                type="text"
                value={outletRatio}
                onChange={(e) => setOutletRatio(e.target.value)}
                placeholder="70% Outlets"
                className="w-full px-3 py-2 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
                추천 메뉴 페어링
              </label>
              <input
                type="text"
                value={signaturePairing}
                onChange={(e) => setSignaturePairing(e.target.value)}
                placeholder="필터커피 & 파운드"
                className="w-full px-3 py-2 rounded-xl bg-[#2D2D2A] border border-[#E6DFD3]/15 text-[#FCF9F5] text-xs focus:outline-none focus:border-[#BF703A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5E5E5D] mb-1">
              대표 화보 이미지 URL (Image URL)
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
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
              <Send className="w-4 h-4" />
              <span>기사 아티클 발행하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
