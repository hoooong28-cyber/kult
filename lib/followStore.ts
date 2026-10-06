'use client';
import { track, type InteractionContext } from './interactions.ts';
const KEY = 'kult_followed_curator_ids';
type Listener = (ids: string[]) => void;
const listeners = new Set<Listener>();
function read(): string[] {
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  const ids: unknown = JSON.parse(raw);
  if (!Array.isArray(ids) || !ids.every(id => typeof id === 'string')) throw new Error('저장 데이터를 읽을 수 없습니다. 기존 데이터는 유지됩니다.');
  return ids;
}
export function getFollowingIds(): string[] {
  if (typeof window === 'undefined') return [];
  try { return read(); } catch { return []; }
}
export function isFollowing(id: string) { return getFollowingIds().includes(id); }
export function toggleFollow(curatorId: string, context: InteractionContext = {}): boolean {
  if (typeof window === 'undefined') return false;
  const current = read();
  const enabled = !current.includes(curatorId);
  const updated = enabled ? [...current, curatorId] : current.filter(id => id !== curatorId);
  window.localStorage.setItem(KEY, JSON.stringify(updated));
  listeners.forEach(listener => listener(updated));
  window.dispatchEvent(new Event('kult_followed_curator_ids:changed'));
  track(enabled ? 'curator_follow' : 'curator_unfollow', { ...context, curator_id: curatorId });
  return enabled;
}
export function subscribeFollowChanges(listener: Listener): () => void {
  listeners.add(listener);
  const storage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) listener(getFollowingIds()); };
  if (typeof window !== 'undefined') window.addEventListener('storage', storage);
  return () => { listeners.delete(listener); if (typeof window !== 'undefined') window.removeEventListener('storage', storage); };
}
