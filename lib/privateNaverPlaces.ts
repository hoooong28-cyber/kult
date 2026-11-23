'use client';

import { getCurrentUser } from './userStore.ts';
import { parseNaverPlaceLink } from './naverPlaceLinks.ts';

export interface PrivateNaverPlace {
  id: string;
  url: string;
  name: string;
  savedAt: string;
}

const PREFIX = 'kult_private_naver_places_v1:';
const MAX_PLACES = 500;
const MAX_NAME = 100;
const activeKey = () => {
  const profile = getCurrentUser();
  return profile ? PREFIX + encodeURIComponent(profile.id) : null;
};

function read(key: string): PrivateNaverPlace[] {
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('저장된 장소 목록을 읽을 수 없습니다.');
  const seen = new Set<string>();
  return data.filter((row): row is PrivateNaverPlace => {
    if (!row || typeof row.id !== 'string' || typeof row.url !== 'string'
      || typeof row.name !== 'string' || typeof row.savedAt !== 'string' || seen.has(row.id)) return false;
    const link = parseNaverPlaceLink(row.url);
    if (link?.kind !== 'place' || link.id !== row.id || link.url !== row.url) return false;
    seen.add(row.id);
    return true;
  });
}

export function listPrivateNaverPlaces(): PrivateNaverPlace[] {
  const key = activeKey();
  return key ? read(key) : [];
}

export function addPrivateNaverPlace(input: string, displayName: string, profileId: string) {
  const key = activeKey();
  if (!key || key !== PREFIX + encodeURIComponent(profileId)) throw new Error('브라우저 프로필을 먼저 시작해 주세요.');
  const link = parseNaverPlaceLink(input);
  if (link?.kind !== 'place') throw new Error('네이버 지도 장소 링크를 확인해 주세요.');
  const places = read(key);
  if (places.some(place => place.id === link.id)) return { added: false, places };
  if (places.length >= MAX_PLACES) throw new Error('이 브라우저에 장소를 500곳까지 저장할 수 있어요.');
  const name = displayName.trim().slice(0, MAX_NAME);
  const next = [{ id: link.id, url: link.url, name, savedAt: new Date().toISOString() }, ...places];
  window.localStorage.setItem(key, JSON.stringify(next));
  return { added: true, places: next };
}

export function removePrivateNaverPlace(id: string, profileId: string): PrivateNaverPlace[] {
  const key = activeKey();
  if (!key || key !== PREFIX + encodeURIComponent(profileId)) throw new Error('브라우저 프로필을 먼저 시작해 주세요.');
  const next = read(key).filter(place => place.id !== id);
  window.localStorage.setItem(key, JSON.stringify(next));
  return next;
}

export function filterPrivateNaverPlaces(places: PrivateNaverPlace[], query: string): PrivateNaverPlace[] {
  const needle = query.trim().toLowerCase();
  return needle ? places.filter(place => place.name.toLowerCase().includes(needle) || place.id.includes(needle)) : places;
}
