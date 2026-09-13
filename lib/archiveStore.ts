'use client';

const STORAGE_KEY = 'kult_saved_cafe_ids';

// Default initial saved cafes for demo
const DEFAULT_SAVED_IDS = ['cuco-seongsu', 'lowkey-seongsu'];

type Listener = (savedIds: string[]) => void;
const listeners: Set<Listener> = new Set();

export function getSavedCafeIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SAVED_IDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAVED_IDS));
      return DEFAULT_SAVED_IDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved cafe IDs:', e);
    return DEFAULT_SAVED_IDS;
  }
}

export function isCafeSaved(cafeId: string): boolean {
  const ids = getSavedCafeIds();
  return ids.includes(cafeId);
}

export function toggleSaveCafe(cafeId: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getSavedCafeIds();
  let updated: string[];
  let isSaved: boolean;

  if (current.includes(cafeId)) {
    updated = current.filter((id) => id !== cafeId);
    isSaved = false;
  } else {
    updated = [...current, cafeId];
    isSaved = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyListeners(updated);
  } catch (e) {
    console.error('Failed to update saved cafe IDs:', e);
  }

  return isSaved;
}

export function subscribeArchiveChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(savedIds: string[]) {
  listeners.forEach((listener) => listener(savedIds));
}
