'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ReportModal from '@/components/ReportModal';
import EditProfileModal from '@/components/EditProfileModal';
import CreatePostModal from '@/components/CreatePostModal';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import { getSavedCafeIds, subscribeArchiveChanges, toggleSaveCafe } from '@/lib/archiveStore';
import { analyzeSavedTaste, TasteAnalysisResult } from '@/lib/tasteEngine';
import { getFollowingIds, isFollowing, toggleFollow, subscribeFollowChanges } from '@/lib/followStore';
import { classifyUserTasteCluster, TasteClusterProfile } from '@/lib/tasteClusterEngine';
import {
  getCurrentUser,
  getUserPosts,
  subscribeUser,
  subscribePosts,
  UserProfile,
  UserPost,
} from '@/lib/userStore';
import { CuratedCafe } from '@/lib/types';
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
  Feather,
  Flame,
  Volume2,
  Plug,
  PlusCircle,
  Edit3,
  UserCheck,
  UserPlus,
  BarChart3,
  Layers
} from 'lucide-react';

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<'collections' | 'posts' | 'twins'>('collections');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [allCafes, setAllCafes] = useState<CuratedCafe[]>([]);
  const [tasteResult, setTasteResult] = useState<TasteAnalysisResult | null>(null);
  const [clusterProfile, setClusterProfile] = useState<TasteClusterProfile | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  useEffect(() => {
    // Initial load
    setCurrentUser(getCurrentUser());
    setUserPosts(getUserPosts());
    setSavedIds(getSavedCafeIds());
    setFollowingIds(getFollowingIds());

    // Fetch cafes
    async function fetchCafes() {
      try {
        const res = await fetch('/api/cafes');
        if (res.ok) {
          const data = await res.json();
          const cafesList: CuratedCafe[] = data.cafes || [];
          setAllCafes(cafesList);

          const analysis = analyzeSavedTaste(getSavedCafeIds(), cafesList);
          setTasteResult(analysis);

          const cluster = classifyUserTasteCluster(getSavedCafeIds(), getFollowingIds(), cafesList);
          setClusterProfile(cluster);
        }
      } catch (err) {
        console.error('Failed to fetch cafes for archive:', err);
      }
    }

    fetchCafes();

    // Subscriptions
    const unsubArchive = subscribeArchiveChanges((updatedIds) => {
      setSavedIds(updatedIds);
    });

    const unsubFollow = subscribeFollowChanges((updatedFollows) => {
      setFollowingIds(updatedFollows);
    });

    const unsubUser = subscribeUser((user) => {
      setCurrentUser(user);
    });

    const unsubPosts = subscribePosts((posts) => {
      setUserPosts(posts);
    });

    return () => {
      unsubArchive();
      unsubFollow();
      unsubUser();
      unsubPosts();
    };
  }, []);

  useEffect(() => {
    if (allCafes.length > 0) {
      const analysis = analyzeSavedTaste(savedIds, allCafes);
      setTasteResult(analysis);

      const cluster = classifyUserTasteCluster(savedIds, followingIds, allCafes);
      setClusterProfile(cluster);
    }
  }, [savedIds, followingIds, allCafes]);

  const handleToggleFollow = (curatorId: string) => {
    toggleFollow(curatorId);
  };

  const handleToggleBookmark = (cafeId: string) => {
    toggleSaveCafe(cafeId);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      <Header onOpenReport={() => setIsReportOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />

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
        {/* 2. PROFILE & EDITORIAL IDENTITY MODULE */}
        <section className="bg-gradient-to-b from-stone-900/90 to-stone-900/50 rounded-3xl border border-stone-850 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Feather className="w-48 h-48 text-amber-400" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser?.name || '송민지'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-amber-400/30 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-stone-950 p-1.5 rounded-xl shadow-md">
                  <BookOpen className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
                    {currentUser?.name || '송민지'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                    {currentUser?.identityTag || 'EDITORIAL CURATOR'}
                  </span>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  {currentUser?.bio || '서울의 침묵과 조도를 기록하는 에디터. 종이와 목재 질감, 아침의 긴 그림자를 사랑합니다.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end flex-wrap">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-750 text-stone-300 hover:text-stone-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>소개글 수정</span>
              </button>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>공간 기고하기</span>
              </button>
            </div>
          </div>

          {/* EDITORIAL STATS MOSAIC */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">ARCHIVED</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                {savedIds.length > 0 ? savedIds.length : 48}
                <span className="text-xs font-sans font-normal text-stone-400 ml-1">곳</span>
              </div>
              <p className="text-[11px] text-stone-500">저장한 공간</p>
            </div>

            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">PUBLISHED</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-400">
                {userPosts.length}
                <span className="text-xs font-sans font-normal text-stone-400 ml-1">편</span>
              </div>
              <p className="text-[11px] text-stone-500">내가 기고한 아티클</p>
            </div>

            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90">FOLLOWING</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                {followingIds.length}
                <span className="text-xs font-sans font-normal text-stone-400 ml-1">명</span>
              </div>
              <p className="text-[11px] text-stone-500">팔로잉 큐레이터</p>
            </div>
          </div>


        </section>

        {/* 🌟 SPOTIFY-STYLE HIDDEN BACKEND TASTE ENGINE RECOMMENDATION MODULE */}
        {tasteResult && tasteResult.recommendations.length > 0 && (
          <section className="bg-stone-900/80 border border-amber-400/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>TASTE AFFINITY ENGINE</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                  {tasteResult.recommendationHeader}
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono bg-stone-950/80 border border-stone-850 px-3 py-1.5 rounded-full self-start sm:self-auto">
                알고리즘 기반 취향 추천
              </span>
            </div>

            {/* Recommendation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasteResult.recommendations.map((rec) => {
                const isSaved = savedIds.includes(rec.cafe.id);
                return (
                  <div
                    key={rec.cafe.id}
                    className="bg-stone-950 border border-stone-800 hover:border-amber-400/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg group transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{rec.cafe.neighborhood}</span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-stone-100 mt-1 group-hover:text-amber-300 transition-colors">
                            {rec.cafe.name}
                          </h3>
                          <p className="text-xs text-stone-400">{rec.cafe.name_local}</p>
                        </div>

                        <span className="px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold text-xs shrink-0">
                          {rec.matchScore}% Match
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed italic line-clamp-2">
                        "{rec.cafe.notes}"
                      </p>

                      <div className="pt-2 border-t border-stone-850/80 flex items-center gap-2 text-[11px] text-stone-400">
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-stone-300">{rec.matchReason}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-850 flex items-center justify-between gap-2">
                      <Link
                        href={`/cafe/${rec.cafe.id}`}
                        className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>공간 상세보기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleToggleBookmark(rec.cafe.id)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                          isSaved
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. SECTION SEGMENT TAB SWITCHER */}
        <div className="sticky top-[61px] z-30 bg-stone-950/90 backdrop-blur-md pt-2 pb-4">
          <div className="flex bg-stone-900 p-1.5 rounded-2xl border border-stone-800 max-w-xl mx-auto">
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
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Feather className="w-4 h-4" />
              <span>내가 작성한 기사 ({userPosts.length})</span>
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
              <span>취향 메이트 팔로잉</span>
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
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>새 아티클 기고</span>
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

        {/* 5. TAB 2: MY PUBLISHED ARTICLES VIEW */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  PUBLISHED DISPATCHES
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                  내가 직접 기고한 공간 아티클 ({userPosts.length}편)
                </h2>
              </div>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-300 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>새 공간 기고</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-stone-900 border border-stone-850 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                        {post.neighborhood}
                      </span>
                      <span className="text-xs font-mono text-stone-500">{post.createdAt}</span>
                    </div>

                    <div className="flex gap-4 items-start">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-20 h-20 rounded-2xl object-cover border border-stone-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-serif text-xl font-bold text-stone-100">{post.title}</h3>
                        <p className="text-xs text-stone-400 font-sans mt-0.5">{post.titleLocal}</p>
                        <p className="text-xs text-stone-300 italic font-serif leading-relaxed mt-2 line-clamp-2">
                          "{post.notes}"
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-2 border-t border-stone-850 text-center">
                      <div className="bg-stone-950 p-2 rounded-xl border border-stone-850 text-stone-300">
                        {post.noiseLevel}
                      </div>
                      <div className="bg-stone-950 p-2 rounded-xl border border-stone-850 text-stone-300">
                        {post.outletRatio}
                      </div>
                      <div className="bg-stone-950 p-2 rounded-xl border border-stone-850 text-amber-300">
                        {post.signaturePairing}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 3: TASTE TWINS & SOCIAL FOLLOW TRACKING VIEW */}
        {activeTab === 'twins' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  AESTHETIC RESONANCE &amp; SOCIAL GRAPH
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                  나와 감도가 닮은 큐레이터 팔로잉 ({followingIds.length}명)
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full font-mono font-bold">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>SOCIAL GRAPH CLUSTERING</span>
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
                    onClick={() => handleToggleFollow('david')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isFollowing('david')
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                        : 'bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750'
                    }`}
                  >
                    {isFollowing('david') ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>팔로잉 (Subscribed)</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                        <span>팔로우 하기</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-stone-950/70 border border-stone-850 p-4 rounded-2xl text-stone-300 text-xs italic leading-relaxed relative">
                  <Quote className="w-4 h-4 text-amber-400/40 absolute top-3 left-3" />
                  <p className="pl-5">
                    "미드센추리 가구와 밝은 채광, 벽면의 여백이 주는 침묵을 선호합니다."
                  </p>
                </div>

                <div className="text-xs text-stone-400 space-y-2 pt-2 border-t border-stone-850">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>
                      공통 저장 공간: <strong className="text-amber-300 font-semibold">로우키 성수, 센터커피 서울숲</strong>
                    </span>
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
                    onClick={() => handleToggleFollow('sora')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isFollowing('sora')
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                        : 'bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750'
                    }`}
                  >
                    {isFollowing('sora') ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>팔로잉 (Subscribed)</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                        <span>팔로우 하기</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-stone-950/70 border border-stone-850 p-4 rounded-2xl text-stone-300 text-xs italic leading-relaxed relative">
                  <Quote className="w-4 h-4 text-amber-400/40 absolute top-3 left-3" />
                  <p className="pl-5">
                    "스피커에서 흘러나오는 재즈와 잉크 냄새가 섞인 조용한 책방 겸 커피바 탐색가."
                  </p>
                </div>

                <div className="text-xs text-stone-400 space-y-2 pt-2 border-t border-stone-850">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>
                      공통 저장 공간: <strong className="text-amber-300 font-semibold">카페 이잌 삼청, 올모스트홈</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. CURATOR PULL-QUOTE MODULE OF THE WEEK */}
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

      {/* MODALS */}
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
