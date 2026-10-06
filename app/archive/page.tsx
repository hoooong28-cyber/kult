'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ReportModal from '@/components/ReportModal';
import EditProfileModal from '@/components/EditProfileModal';
import CreatePostModal from '@/components/CreatePostModal';
import AuthModal from '@/components/AuthModal';
import NaverImportPanel from '@/components/NaverImportPanel';
import MobileBottomNav from '@/components/MobileBottomNav';
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
  logOutUser,
  UserProfile,
  UserPost,
} from '@/lib/userStore';
import { CuratedCafe } from '@/lib/types';
import { ImportedPlace, uniqueImportedPlaces } from '@/lib/naverImport';
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
  const [importedCount, setImportedCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'collections' | 'posts' | 'twins'>('collections');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [allCafes, setAllCafes] = useState<CuratedCafe[]>([]);
  const [naverImportedPlaces, setNaverImportedPlaces] = useState<ImportedPlace[]>([]);
  const [tasteResult, setTasteResult] = useState<TasteAnalysisResult | null>(null);
  const [clusterProfile, setClusterProfile] = useState<TasteClusterProfile | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  const loadNaverPlaces = () => {
    try {
      const raw = localStorage.getItem('kult_naver_imported_lists_v1');
      if (raw) {
        const lists = JSON.parse(raw);
        if (Array.isArray(lists)) {
          const unique = uniqueImportedPlaces(lists);
          setNaverImportedPlaces(unique);
          setImportedCount(unique.length);
        }
      }
    } catch (e) {
      console.error('Failed to load imported NAVER places:', e);
    }
  };

  useEffect(() => {
    // Initial load
    setCurrentUser(getCurrentUser());
    setUserPosts(getUserPosts());
    setSavedIds(getSavedCafeIds());
    setFollowingIds(getFollowingIds());
    loadNaverPlaces();

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

    const handleNaverUpdate = () => {
      loadNaverPlaces();
    };
    window.addEventListener('kult_naver_import_updated', handleNaverUpdate);

    return () => {
      unsubArchive();
      unsubFollow();
      unsubUser();
      unsubPosts();
      window.removeEventListener('kult_naver_import_updated', handleNaverUpdate);
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950 pb-28 md:pb-12">
      <Header onOpenReport={() => setIsReportOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} onOpenCreatePost={() => setIsCreatePostOpen(true)} />

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

          {currentUser ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div className="flex items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-amber-400/30 shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 text-stone-950 p-1.5 rounded-xl shadow-md">
                    <BookOpen className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
                      {currentUser.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                      {currentUser.identityTag || 'EDITORIAL CURATOR'}
                    </span>
                  </div>

                  <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                    {currentUser.bio || '서울의 조용한 작업 공간을 수집하는 에디터입니다.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-750 text-stone-300 hover:text-stone-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>소개글 수정</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>공간 기고하기</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logOutUser();
                    setCurrentUser(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div className="flex items-start sm:items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-850 border border-stone-750 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                  <UserPlus className="w-10 h-10 stroke-[1.5]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
                      에디터 가입 / 로그인
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700 text-[10px] font-bold uppercase tracking-wider">
                      GUEST VISITOR
                    </span>
                  </div>

                  <p className="text-stone-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                    로그인하시면 저장해둔 나만의 카페 서재를 동기화하고 새 공간 아티클을 직접 기고할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>에디터 가입 및 로그인</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-750 text-stone-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>공간 기고하기</span>
                </button>
              </div>
            </div>
          )}

          {/* EDITORIAL STATS MOSAIC */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-stone-950/60 border border-stone-850 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">ARCHIVED</span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
                {savedIds.length + importedCount}
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
        <NaverImportPanel onCountChange={setImportedCount} />

        {activeTab === 'collections' && (
          <div className="space-y-10">
            {/* 1. REAL USER SAVED CAFES LIST */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-850 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                    MY SAVED SANCTUARIES
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                    내가 저장해둔 공간 ({allCafes.filter((c) => savedIds.includes(c.id)).length + naverImportedPlaces.length}곳)
                  </h2>
                </div>

                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>새 공간 탐색하기</span>
                </Link>
              </div>

              {(allCafes.filter((c) => savedIds.includes(c.id)).length > 0 || naverImportedPlaces.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allCafes
                    .filter((c) => savedIds.includes(c.id))
                    .map((cafe) => (
                      <div
                        key={cafe.id}
                        className="bg-stone-900 border border-stone-850 hover:border-amber-400/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{cafe.neighborhood}</span>
                              </div>
                              <h3 className="font-serif text-xl font-bold text-stone-100 mt-1 group-hover:text-amber-300 transition-colors">
                                {cafe.name}
                              </h3>
                              <p className="text-xs text-stone-400">{cafe.name_local}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleBookmark(cafe.id)}
                              className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-stone-800 hover:text-stone-100 transition-colors shrink-0"
                              title="아카이브에서 제거"
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-current" />
                              <span>저장됨</span>
                            </button>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 italic font-serif text-xs text-stone-300 leading-relaxed">
                            "{cafe.notes}"
                          </div>

                          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                            {cafe.tags.good_for.map((tag) => (
                              <span key={tag} className="px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-750 capitalize">
                                For {tag}
                              </span>
                            ))}
                            {cafe.tags.noise_level && (
                              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 border border-stone-750 flex items-center gap-1">
                                <Volume2 className="w-3 h-3 text-amber-400" /> {cafe.tags.noise_level}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-mono text-[11px] truncate max-w-[240px]">
                            {cafe.address}
                          </span>
                          <Link
                            href={`/cafe/${cafe.id}`}
                            className="text-amber-400 font-bold hover:underline flex items-center gap-1 font-mono shrink-0"
                          >
                            <span>공간 상세 →</span>
                          </Link>
                        </div>
                      </div>
                    ))}

                  {/* NAVER Map Imported Places */}
                  {naverImportedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-400/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>네이버 지도 가져온 장소</span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-100 mt-1 group-hover:text-amber-300 transition-colors">
                              {place.name}
                            </h3>
                            <p className="text-xs text-stone-400">{place.category || '카페/공간'}</p>
                          </div>

                          <span className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                            NAVER MAP
                          </span>
                        </div>

                        <p className="text-xs text-stone-400 font-mono">{place.address || '주소 정보'}</p>

                        {place.memo && (
                          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 italic font-serif text-xs text-stone-300 leading-relaxed">
                            "{place.memo}"
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-mono text-[11px]">네이버 지도 연동 데이터</span>
                        <a
                          href={place.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 font-bold hover:underline flex items-center gap-1 font-mono shrink-0"
                        >
                          <span>네이버 지도에서 보기 ↗</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-stone-900/60 border border-stone-850 rounded-3xl p-8 sm:p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                    <Bookmark className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-stone-100">
                      아직 저장한 공간이 없습니다
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                      메인 가제트 탐색 페이지에서 마음에 드는 공간의 Bookmark 아이콘을 눌러 나만의 아카이브 서재를 채워보세요.
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition-colors"
                  >
                    <span>서울 가제트 공간 탐색하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* 2. THEMATIC EDITORIAL COLLECTIONS */}
            <div className="space-y-6 pt-4 border-t border-stone-850">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-bold">
                    RECOMMENDED PORTFOLIOS
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                    KULT 테마별 추천 서재 큐레이션
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Folder Card 1 */}
                <article className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg flex flex-col">
                  <div className="relative h-44 overflow-hidden">
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
                      <h4 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                        혼자만의 몰입과 글쓰기
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                      낮은 음악 소리와 따스한 필터커피 향, 사색을 방해하지 않는 고요한 좌석 배치.
                    </p>

                    <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-1.5 font-medium text-stone-300 text-[11px]">
                        <span>앤트러사이트 서교</span>
                        <span className="text-stone-600">•</span>
                        <span>어니언 미아</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>

                {/* Folder Card 2 */}
                <article className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg flex flex-col">
                  <div className="relative h-44 overflow-hidden">
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
                      <h4 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                        성수 &amp; 한남 로스터리 투어
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                      원두 본연의 테루아를 섬세하게 다루는 바리스타들의 작업실.
                    </p>

                    <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-1.5 font-medium text-stone-300 text-[11px]">
                        <span>로우키</span>
                        <span className="text-stone-600">•</span>
                        <span>피어커피</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>

                {/* Folder Card 3 */}
                <article className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg flex flex-col">
                  <div className="relative h-44 overflow-hidden">
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
                      <h4 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                        주말 비오는 날 생각나는 한옥
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                      기와 처마 끝 빗소리를 들으며 덖음 차 한 잔의 온기를 누리는 공간.
                    </p>

                    <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-1.5 font-medium text-stone-300 text-[11px]">
                        <span>이이엄</span>
                        <span className="text-stone-600">•</span>
                        <span>올모스트홈</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </div>
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
      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} cafes={allCafes} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <MobileBottomNav
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
      />
    </div>
  );
}

