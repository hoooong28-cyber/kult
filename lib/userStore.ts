'use client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
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

const USER_KEY = 'kult_current_user';
const POSTS_KEY = 'kult_user_published_posts';

const DEFAULT_USER: UserProfile = {
  id: 'user-eleanor',
  name: '송민지',
  email: 'eleanor@kult.magazine',
  identityTag: 'EDITORIAL CURATOR',
  bio: '서울의 침묵과 조도를 기록하는 에디터. 종이와 목재 질감, 아침의 긴 그림자를 사랑합니다.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  joinedDate: '2026-09-01',
};

const DEFAULT_POSTS: UserPost[] = [
  {
    id: 'post-1',
    authorId: 'user-eleanor',
    authorName: '송민지',
    title: '앤트러사이트 서교',
    titleLocal: 'Anthracite Seogyo',
    neighborhood: 'Mapo',
    address: '서울 마포구 월드컵로12길 11',
    notes: '음악 소리가 매우 낮고 중정 정원이 계절마다 변해 사색하며 글쓰기에 완벽한 장소입니다.',
    noiseLevel: '45 dB Quiet',
    outletRatio: '70% Outlets',
    signaturePairing: '에티오피아 드립 & 파운드',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-09-10',
  },
];

type UserListener = (user: UserProfile | null) => void;
type PostsListener = (posts: UserPost[]) => void;

const userListeners: Set<UserListener> = new Set();
const postsListeners: Set<PostsListener> = new Set();

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse current user:', e);
    return DEFAULT_USER;
  }
}

export function signUpUser(
  name: string,
  email: string,
  bio: string,
  identityTag: string
): UserProfile {
  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name,
    email,
    identityTag: identityTag || 'SEOUL CURATOR',
    bio: bio || '서울의 조용한 작업 공간을 수집하는 새로운 에디터입니다.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    joinedDate: new Date().toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }
  notifyUserListeners(newUser);
  return newUser;
}

export function logInUser(email: string): UserProfile {
  const existing = getCurrentUser();
  if (existing && existing.email === email) return existing;
  
  const loggedIn: UserProfile = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0] || '에디터',
    email,
    identityTag: 'EDITORIAL CURATOR',
    bio: '서울의 취향 공간을 탐색하고 기록하는 에디터입니다.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    joinedDate: new Date().toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(loggedIn));
  }
  notifyUserListeners(loggedIn);
  return loggedIn;
}

export function updateUserProfile(
  name: string,
  bio: string,
  identityTag: string,
  avatar?: string
): UserProfile {
  const current = getCurrentUser() || DEFAULT_USER;
  const updated: UserProfile = {
    ...current,
    name: name || current.name,
    bio: bio || current.bio,
    identityTag: identityTag || current.identityTag,
    avatar: avatar || current.avatar,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }
  notifyUserListeners(updated);
  return updated;
}

export function logOutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
  notifyUserListeners(null);
}

export function getUserPosts(): UserPost[] {
  if (typeof window === 'undefined') return DEFAULT_POSTS;
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_POSTS;
  }
}

export function createPublishedPost(postData: Omit<UserPost, 'id' | 'authorId' | 'authorName' | 'createdAt'>): UserPost {
  const user = getCurrentUser() || DEFAULT_USER;
  const newPost: UserPost = {
    ...postData,
    id: `post-${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const currentPosts = getUserPosts();
  const updated = [newPost, ...currentPosts];

  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  }
  notifyPostsListeners(updated);
  return newPost;
}

export function subscribeUser(listener: UserListener): () => void {
  userListeners.add(listener);
  return () => userListeners.delete(listener);
}

export function subscribePosts(listener: PostsListener): () => void {
  postsListeners.add(listener);
  return () => postsListeners.delete(listener);
}

function notifyUserListeners(user: UserProfile | null) {
  userListeners.forEach((l) => l(user));
}

function notifyPostsListeners(posts: UserPost[]) {
  postsListeners.forEach((l) => l(posts));
}
