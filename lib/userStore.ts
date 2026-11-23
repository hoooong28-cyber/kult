'use client';

export interface UserProfile {
  id: string;
  name: string;
  email?: string; // Retained on existing profiles only.
  identityTag: string; // e.g. "성수동 로스터리 에디터"
  bio: string; // Bio description
  avatar: string;
  joinedDate: string;
}

export interface UserPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string; // Space Name
  titleLocal: string;
  neighborhood: string;
  address: string;
  notes: string; // Commentary
  noiseLevel: string; // e.g. "42 dB Quiet"
  outletRatio: string; // e.g. "70% Outlets"
  signaturePairing: string; // e.g. "Hand Drip & Financier"
  coverImage: string;
  createdAt: string;
}

// Old data stays untouched; only an explicit action activates a browser-tab session.
const LEGACY_USER_KEY = 'kult_current_user';
const PROFILE_KEY = 'kult_local_profile_v2';
const SESSION_KEY = 'kult_local_profile_session_v2';
const POSTS_KEY = 'kult_user_published_posts';
const DEMO_PROFILE_IDS = new Set(['user-eleanor', 'user-kult-admin']);

type UserListener = (user: UserProfile | null) => void;
type PostsListener = (posts: UserPost[]) => void;

const userListeners = new Set<UserListener>();
const postsListeners = new Set<PostsListener>();

function loadProfile(): UserProfile | null {
  const raw = window.localStorage.getItem(PROFILE_KEY) ?? window.localStorage.getItem(LEGACY_USER_KEY);
  if (!raw) return null;
  const profile: UserProfile | null = JSON.parse(raw);
  if (!profile || typeof profile.id !== 'string' || !profile.id || DEMO_PROFILE_IDS.has(profile.id)
    || typeof profile.name !== 'string' || !profile.name.trim()) return null;
  return profile;
}

export function hasResumableLocalProfile(): boolean {
  if (typeof window === 'undefined') return false;
  try { return Boolean(loadProfile()); }
  catch { return false; }
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const activeId = window.sessionStorage.getItem(SESSION_KEY);
    if (!activeId) return null;
    const profile = loadProfile();
    return profile?.id === activeId ? profile : null;
  } catch { return null; }
}

function announceProfile(profile: UserProfile | null) {
  userListeners.forEach(listener => listener(profile));
  const posts = getUserPosts();
  postsListeners.forEach(listener => listener(posts));
}

function activate(profile: UserProfile): UserProfile {
  window.sessionStorage.setItem(SESSION_KEY, profile.id);
  announceProfile(profile);
  return profile;
}

export function resumeLocalProfile(): UserProfile {
  const profile = loadProfile();
  if (!profile) throw new Error('기존 프로필을 찾을 수 없습니다.');
  return activate(profile);
}

export function startLocalProfile(nickname: string): UserProfile {
  const name = nickname.trim();
  if (!name || name.length > 40) throw new Error('닉네임을 1~40자로 입력해 주세요.');
  if (loadProfile()) throw new Error('이미 저장된 브라우저 프로필이 있습니다.');
  const profile: UserProfile = {
    id: `user-${crypto.randomUUID()}`,
    name,
    identityTag: '',
    bio: '',
    avatar: '',
    joinedDate: new Date().toISOString().slice(0, 10),
  };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return activate(profile);
}

export function updateUserProfile(name: string, bio: string, identityTag: string, avatar?: string): UserProfile {
  const current = getCurrentUser();
  if (!current) throw new Error('브라우저 프로필을 먼저 시작해 주세요.');
  const nickname = name.trim();
  if (!nickname || nickname.length > 40) throw new Error('닉네임을 1~40자로 입력해 주세요.');
  const updated: UserProfile = {
    ...current,
    name: nickname,
    bio: bio.trim(),
    identityTag: identityTag.trim(),
    avatar: avatar ?? current.avatar,
  };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  announceProfile(updated);
  return updated;
}

export function logOutUser() {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(SESSION_KEY);
  announceProfile(null);
}

function readAllPosts(): UserPost[] {
  const raw = window.localStorage.getItem(POSTS_KEY);
  if (!raw) return [];
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('기존 글을 읽을 수 없습니다.');
  return rows;
}

export function getUserPosts(): UserPost[] {
  const profile = getCurrentUser();
  if (!profile) return [];
  try { return readAllPosts().filter(post => post?.authorId === profile.id && post.id !== 'post-1'); }
  catch { return []; }
}

export function createPublishedPost(postData: Omit<UserPost, 'id' | 'authorId' | 'authorName' | 'createdAt'>): UserPost {
  const user = getCurrentUser();
  if (!user) throw new Error('브라우저 프로필을 먼저 시작해 주세요.');
  const newPost: UserPost = {
    ...postData,
    id: `post-${crypto.randomUUID()}`,
    authorId: user.id,
    authorName: user.name,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  window.localStorage.setItem(POSTS_KEY, JSON.stringify([newPost, ...readAllPosts()]));
  const posts = getUserPosts();
  postsListeners.forEach(listener => listener(posts));
  return newPost;
}

export function subscribeUser(listener: UserListener): () => void {
  userListeners.add(listener);
  return () => { userListeners.delete(listener); };
}

export function subscribePosts(listener: PostsListener): () => void {
  postsListeners.add(listener);
  return () => { postsListeners.delete(listener); };
}
