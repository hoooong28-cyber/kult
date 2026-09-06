'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import ReportModal from '@/components/ReportModal';
import Link from 'next/link';
import {
  BookOpen,
  Bookmark,
  Compass,
  FolderPlus,
  Users,
  Sparkles,
  ArrowRight,
  Sun,
  Sliders,
  MapPin,
  CheckCircle2,
  Share2,
  ChevronRight,
  Heart,
  Quote,
  Feather
} from 'lucide-react';

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<'collections' | 'twins'>('collections');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [subscribedTwins, setSubscribedTwins] = useState<Record<string, boolean>>({});

  const toggleSubscribe = (twinId: string) => {
    setSubscribedTwins((prev) => ({
      ...prev,
      [twinId]: !prev[twinId],
    }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      <Header onOpenReport={() => setIsReportOpen(true)} />

      {/* 1. ISSUE SUB-MASTHEAD BAR */}
      <div className="border-b border-stone-850 bg-stone-900/60 px-4 sm:px-8 py-2.5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold tracking-wider uppercase text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>SEOUL ARCHIVAL INDEX</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400 font-mono text-[11px]">
            <span className="tracking-widest uppercase">VOL. 04 / PERSPECTIVES</span>
            <span className="text-stone-600">|</span>
            <span className="flex items-center gap-1.5 text-amber-300/90 font-sans">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>18°C 맑음</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* 2. PROFILE & TASTE IDENTITY MODULE */}
        <section className="bg-gradient-to-b from-stone-900/90 to-stone-900/50 rounded-3xl border border-stone-850 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Feather className="w-48 h-48 text-amber-400" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="송민지 (Eleanor Song)"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-amber-400/30 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-stone-950 p-1.5 rounded-xl shadow-md">
                  <BookOpen className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
                    송민지 <span className="text-stone-400 font-sans text-base font-normal">Eleanor</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                    EDITORIAL CURATOR
                  </span>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  서울의 침묵과 조도를 기록하는 에디터. 종이와 목재 질감, 아침의 긴 그림자를 사랑합니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-750 text-stone-300 hover:text-stone-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>취향 설정</span>
              </button>
            </div>
          </div>

          {/* TASTE AXIS HASHTAGS */}
          <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-mono text-stone-500 font-bold mr-2">
              TASTE AXIS
            </span>
            <span className="px-3 py-1 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-300 text-xs font-medium hover:border-amber-400/40 transition-colors">
              #자연광_사색
            </span>
            <span className="px-3 py-1 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-300 text-xs font-medium hover:border-amber-400/40 transition-colors">
              #미니멀_우드
            </span>
            <span className="px-3 py-1 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-300 text-xs font-medium hover:border-amber-400/40 transition-colors">
              #아날로그_노트
            </span>
            <span className="px-3 py-1 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-300 text-xs font-medium hover:border-amber-400/40 transition-colors">
              #필터커피
            </span>
          </div>

          {/* EDITORIAL STATS MOSAIC */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">ARCHIVED</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                48<span className="text-xs font-sans font-normal text-stone-400 ml-1">곳</span>
              </div>
              <p className="text-[11px] text-stone-500">저장한 공간</p>
            </div>

            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">LOGGED</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                29<span className="text-xs font-sans font-normal text-stone-400 ml-1">편</span>
              </div>
              <p className="text-[11px] text-stone-500">방문 기록 노트</p>
            </div>

            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90">TWINS</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-400">
                156<span className="text-xs font-sans font-normal text-stone-400 ml-1">명</span>
              </div>
              <p className="text-[11px] text-stone-500">취향 메이트 연결</p>
            </div>
          </div>
        </section>

        {/* 3. SECTION SEGMENT TAB SWITCHER */}
        <div className="sticky top-[61px] z-30 bg-stone-950/90 backdrop-blur-md pt-2 pb-4">
          <div className="flex bg-stone-900 p-1.5 rounded-2xl border border-stone-800 max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'collections'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>내 아카이브 서재</span>
            </button>

            <button
              onClick={() => setActiveTab('twins')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 relative ${
                activeTab === 'twins'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>테이스트 트윈 추천</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-4 animate-ping"></span>
            </button>
          </div>
        </div>

        {/* 4. TAB 1: COLLECTIONS VIEW */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  CURATED PORTFOLIOS
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                  테마별 나만의 서재 리스트
                </h2>
              </div>

              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>새 서재 추가</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Folder Card 1 */}
              <article className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="혼자만의 몰입과 글쓰기"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-amber-300 border border-stone-800">
                    14 SPACES
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                      CURATION NO. 01
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                      혼자만의 몰입과 글쓰기
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                    낮은 음악 소리와 따스한 필터커피 향, 사색을 방해하지 않는 고요한 좌석 배치가 마련된 14곳의 안식처.
                  </p>

                  <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-1.5 font-medium text-stone-300">
                      <span>앤트러사이트 서교</span>
                      <span className="text-stone-600">•</span>
                      <span>어니언 미아</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>

              {/* Folder Card 2 */}
              <article className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
                    alt="성수 & 한남 로스터리 투어"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-amber-300 border border-stone-800">
                    19 SPACES
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                      CURATION NO. 02
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                      성수 & 한남 로스터리 투어
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                    원두 본연의 테루아를 섬세하게 다루는 바리스타들의 작업실. 이른 오전 방문을 추천하는 리스트.
                  </p>

                  <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-1.5 font-medium text-stone-300">
                      <span>로우키</span>
                      <span className="text-stone-600">•</span>
                      <span>피어커피</span>
                      <span className="text-stone-600">•</span>
                      <span>센터커피</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>

              {/* Folder Card 3 */}
              <article className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"
                    alt="주말 비오는 날 생각나는 한옥"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-amber-300 border border-stone-800">
                    8 SPACES
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                      CURATION NO. 03
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                      주말 비오는 날 생각나는 한옥
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                    기와 처마 끝으로 떨어지는 빗소리를 들으며 덖음 차 한 잔의 온기를 누릴 수 있는 서촌과 삼청동의 기록.
                  </p>

                  <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-1.5 font-medium text-stone-300">
                      <span>이이엄</span>
                      <span className="text-stone-600">•</span>
                      <span>올모스트홈 카페</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

        {/* 5. TAB 2: TASTE TWINS RECOMMENDATIONS */}
        {activeTab === 'twins' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  AESTHETIC RESONANCE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                  나와 감도가 닮은 테이스트 트윈
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI MATCH ALGORITHM</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Twin Card 1: David Vance */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-6 space-y-5 shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                        alt="David Vance"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-750"
                      />
                      <span className="absolute -top-2 -left-2 bg-amber-400 text-stone-950 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md">
                        95%
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-stone-100">David Vance</h3>
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-xs text-stone-400">건축가 • 3년 차 서울 거주</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSubscribe('david')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      subscribedTwins['david']
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750'
                    }`}
                  >
                    {subscribedTwins['david'] ? '구독중' : '구독하기'}
                  </button>
                </div>

                <div className="bg-stone-950/70 border border-stone-850 p-4 rounded-2xl text-stone-300 text-xs italic leading-relaxed relative">
                  <Quote className="w-4 h-4 text-amber-400/40 absolute top-3 left-3" />
                  <p className="pl-5">
                    "미드센추리 가구와 밝은 채광, 벽면의 여백이 주는 침묵을 선호합니다."
                  </p>
                </div>

                <div className="text-xs text-stone-400 space-y-2">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>
                      공통 선호: <strong className="text-amber-300 font-semibold">미니멀 우드, 단일 원두, 높은 천장</strong>
                    </span>
                  </div>

                  <div className="bg-stone-950/40 border border-stone-850 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs truncate">
                      <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-stone-400 shrink-0">David의 최근 저장:</span>
                      <span className="text-stone-200 font-semibold truncate">로우키 성수 (Filter Bar)</span>
                    </div>

                    <Link
                      href="/curator/founder"
                      className="text-amber-400 text-[11px] font-semibold hover:underline shrink-0 flex items-center gap-0.5 ml-2"
                    >
                      <span>서재 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Twin Card 2: 최소라 */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-6 space-y-5 shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                        alt="최소라"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-750"
                      />
                      <span className="absolute -top-2 -left-2 bg-amber-400 text-stone-950 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md">
                        92%
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-stone-100">최소라</h3>
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-xs text-stone-400">독립출판 편집자 • 종로구</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSubscribe('sora')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      subscribedTwins['sora']
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750'
                    }`}
                  >
                    {subscribedTwins['sora'] ? '구독중' : '구독하기'}
                  </button>
                </div>

                <div className="bg-stone-950/70 border border-stone-850 p-4 rounded-2xl text-stone-300 text-xs italic leading-relaxed relative">
                  <Quote className="w-4 h-4 text-amber-400/40 absolute top-3 left-3" />
                  <p className="pl-5">
                    "스피커에서 흘러나오는 재즈와 잉크 냄새가 섞인 조용한 책방 겸 커피바 탐색가."
                  </p>
                </div>

                <div className="text-xs text-stone-400 space-y-3">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>
                      공통 선호: <strong className="text-amber-300 font-semibold">종이책 서가, 저조도 조명, 핸드드립</strong>
                    </span>
                  </div>

                  <Link
                    href="/"
                    className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>소라의 비밀 지도 엿보기 (34곳)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. CURATOR PULL-QUOTE MODULE OF THE WEEK */}
        <section className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-850 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            EDITOR NOTE
          </span>
          <blockquote className="font-serif text-xl sm:text-2xl font-bold text-stone-100 max-w-2xl mx-auto leading-relaxed italic">
            “취향이란 비슷한 조도 아래에서 머문 이들이 나누는 무언의 대화다.”
          </blockquote>
          <div className="flex items-center justify-center gap-3 text-xs text-stone-400 font-sans">
            <span className="w-8 h-px bg-stone-700"></span>
            <span className="italic">KULT Issue 04 Editorial Staff</span>
            <span className="w-8 h-px bg-stone-700"></span>
          </div>
        </section>
      </main>

      {/* 7. BOTTOM NAVIGATION BAR FOR MOBILE */}
      <nav className="sticky bottom-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-850 py-3 px-6 sm:hidden">
        <div className="flex items-center justify-around text-xs">
          <Link href="/" className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-100">
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">지도 탐색</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-100">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">공간 피드</span>
          </Link>
          <button
            onClick={() => setActiveTab('twins')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'twins' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">취향 메이트</span>
          </button>
          <Link href="/archive" className="flex flex-col items-center gap-1 text-amber-400 font-bold">
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px]">내 서재</span>
          </Link>
        </div>
      </nav>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
}
