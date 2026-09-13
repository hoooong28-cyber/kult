'use client';

const FOLLOW_KEY = 'kult_followed_curator_ids';
const DEFAULT_FOLLOWING = ['david'];

type FollowListener = (followingIds: string[]) => void;
const listeners: Set<FollowListener> = new Set();

export function getFollowingIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_FOLLOWING;
  try {
    const raw = localStorage.getItem(FOLLOW_KEY);
    if (!raw) {
      localStorage.setItem(FOLLOW_KEY, JSON.stringify(DEFAULT_FOLLOWING));
      return DEFAULT_FOLLOWING;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_FOLLOWING;
  }
}

export function isFollowing(curatorId: string): boolean {
  const ids = getFollowingIds();
  return ids.includes(curatorId);
}

export function toggleFollow(curatorId: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getFollowingIds();
  let updated: string[];
  let isNowFollowing: boolean;

  if (current.includes(curatorId)) {
    updated = current.filter((id) => id !== curatorId);
    isNowFollowing = false;
  } else {
    updated = [...current, curatorId];
    isNowFollowing = true;
  }

  try {
    localStorage.setItem(FOLLOW_KEY, JSON.stringify(updated));
    notifyListeners(updated);
  } catch (e) {
    console.error('Failed to update follow state:', e);
  }

  return isNowFollowing;
}

export function subscribeFollowChanges(listener: FollowListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(followingIds: string[]) {
  listeners.forEach((listener) => listener(followingIds));
}
