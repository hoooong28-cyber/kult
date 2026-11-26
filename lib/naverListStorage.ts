import type { ImportedList } from './naverImport';

const legacyKey = 'kult_naver_imported_lists_v1';
const accountKey = (owner: string) => 'kult_naver_imported_lists_v2:' + encodeURIComponent(owner);
type Container = Pick<Storage, 'getItem' | 'setItem'>;

function read(storage: Container, key: string): ImportedList[] {
  const raw = storage.getItem(key);
  if (!raw) return [];
  const lists: ImportedList[] = JSON.parse(raw);
  if (!Array.isArray(lists) || !lists.every(l => l && typeof l.shareId === 'string' && Array.isArray(l.places) &&
      l.places.every(p => p && typeof p.id === 'string' && typeof p.name === 'string' &&
      typeof p.address === 'string' && typeof p.category === 'string' &&
      typeof p.url === 'string' && p.url.startsWith('https://map.naver.com/')))) throw new Error('Invalid saved list data');
  return lists;
}

export function readNaverLists(storage: Container, owner?: string): ImportedList[] {
  if (!owner) return [];
  const own = read(storage, accountKey(owner));
  const ids = new Set(own.map(l => l.shareId));
  // A legacy list had no recorded owner. Leave that data unmodified and hidden
  // from guests. New imports never write to the old browser-only bucket.
  return [...own, ...read(storage, legacyKey).filter(l => !ids.has(l.shareId))];
}

export function saveNaverList(storage: Container, owner: string, entry: ImportedList): ImportedList[] {
  if (!owner) throw new Error('Account required');
  readNaverLists(storage, owner); // Do not overwrite or report success beside corrupt data.
  const key = accountKey(owner);
  const old = read(storage, key);
  storage.setItem(key, JSON.stringify([entry, ...old.filter(list => list.shareId !== entry.shareId)]));
  return readNaverLists(storage, owner);
}
