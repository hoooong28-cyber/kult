'use client';

import { getCurrentUser } from './userStore.ts';
import { mergeImportedLists, validateListUrl, type ImportedList } from './naverImport.ts';

const LEGACY_KEY = 'kult_naver_imported_lists_v1';
const PROFILE_PREFIX = 'kult_naver_imported_lists_v2:';
export const importedListEvent = 'kult_naver_import_updated';

function allowedSource(input: string): boolean {
  try { return Boolean(validateListUrl(input)); }
  catch { return false; }
}

function read(raw: string | null): ImportedList[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || !data.every(list => list && typeof list.shareId === 'string'
    && typeof list.name === 'string' && typeof list.sourceUrl === 'string'
    && typeof list.importedAt === 'string' && allowedSource(list.sourceUrl)
    && Array.isArray(list.places) && list.places.every((p: Record<string, unknown>) => p
      && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.address === 'string'
      && typeof p.category === 'string' && typeof p.url === 'string' && /^https:\/\/map\.naver\.com\//.test(p.url)))) {
    throw new Error('저장된 목록을 읽지 못했어요. 기존 데이터는 덮어쓰지 않았어요.');
  }
  return data;
}

export function getLocalNaverLists(): ImportedList[] {
  const profile = getCurrentUser();
  if (!profile) return [];
  const store = window.localStorage;
  const saved = store.getItem(PROFILE_PREFIX + encodeURIComponent(profile.id));
  if (saved !== null) return read(saved);
  // Resume only the known owner of the legacy browser profile; do not adopt unclaimed data.
  const legacy = store.getItem('kult_current_user');
  if (!legacy || JSON.parse(legacy)?.id !== profile.id) return [];
  return read(store.getItem(LEGACY_KEY));
}

export function saveLocalNaverList(list: ImportedList): ImportedList[] {
  const profile = getCurrentUser();
  if (!profile) throw new Error('브라우저 프로필을 먼저 열어 주세요.');
  const updated = mergeImportedLists(getLocalNaverLists(), list);
  window.localStorage.setItem(PROFILE_PREFIX + encodeURIComponent(profile.id), JSON.stringify(updated));
  window.dispatchEvent(new Event(importedListEvent));
  return updated;
}
