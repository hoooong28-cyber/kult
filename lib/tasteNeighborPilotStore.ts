import { createHash, randomBytes } from 'node:crypto';
import { closeSync, constants, fstatSync, openSync } from 'node:fs';
import type { DatabaseSync } from 'node:sqlite';

export interface PilotPlace { id: string; name: string }
export interface PilotShelf { nickname: string; places: PilotPlace[] }

export const PILOT_OWNER_COOKIE = 'kult_taste_pilot_owner';
export const PILOT_COOKIE_MAX_AGE = 90 * 24 * 60 * 60;
export const PILOT_MAX_PLACES = 30;
export const PILOT_MAX_MATCH_IDS = 40;
const PILOT_MAX_SHELVES = 500;
const PLACE_ID = /^[1-9][0-9]{0,19}$/;
const OWNER = /^[a-f0-9]{64}$/;
const CONTROL = new RegExp('[\\p{Cc}\\p{Cf}\\p{Zl}\\p{Zp}]', 'u');

export function parsePilotName(input: unknown, max: number): string | null {
  if (typeof input !== 'string' || input.length > max * 4 || CONTROL.test(input)) return null;
  const value = input.normalize('NFC').trim();
  return value && Array.from(value).length <= max ? value : null;
}
function objectWith(value: unknown, keys: string[]): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every(key => Object.hasOwn(value, key));
}
export function parsePilotShelf(nickname: unknown, places: unknown): PilotShelf | null {
  const name = parsePilotName(nickname, 32);
  if (!name || !Array.isArray(places) || places.length < 3 || places.length > PILOT_MAX_PLACES) return null;
  const seen = new Set<string>();
  const clean: PilotPlace[] = [];
  for (const place of places) {
    if (!objectWith(place, ['id', 'name']) || typeof place.id !== 'string' || !PLACE_ID.test(place.id)
      || seen.has(place.id)) return null;
    const name = parsePilotName(place.name, 80);
    if (!name) return null;
    seen.add(place.id);
    clean.push({ id: place.id, name });
  }
  return { nickname: name, places: clean };
}
export function parsePilotMatchIds(ids: unknown): string[] | null {
  if (!Array.isArray(ids) || !ids.length || ids.length > PILOT_MAX_MATCH_IDS
    || ids.some(id => typeof id !== 'string' || !PLACE_ID.test(id))) return null;
  return Array.from(new Set(ids));
}

export const createPilotOwner = () => randomBytes(32).toString('hex');
export function hashPilotOwner(token: string | undefined): string | null {
  return token && OWNER.test(token) ? createHash('sha256').update(token).digest('hex') : null;
}

function readShelf(row: Record<string, unknown> | undefined): PilotShelf | null {
  if (!row || typeof row.places_json !== 'string') return null;
  try { return parsePilotShelf(row.nickname, JSON.parse(row.places_json)); } catch { return null; }
}
export async function openTasteNeighborPilotStore(path: string) {
  // In production the disabled route never loads Node's experimental sqlite module.
  const { DatabaseSync } = await import('node:sqlite');
  // Create new databases private to this user. Refuse a symlink at the configured file.
  const fd = openSync(path, constants.O_CREAT | constants.O_RDWR | constants.O_NOFOLLOW, 0o600);
  try {
    if (fstatSync(fd).mode & 0o077) throw new Error('Pilot database file must not be accessible to group or others');
  } finally { closeSync(fd); }
  const database: DatabaseSync = new DatabaseSync(path);
  try {
    database.exec(`
      PRAGMA busy_timeout = 1000;
      PRAGMA secure_delete = ON;
      CREATE TABLE IF NOT EXISTS taste_shelves (
        owner_hash TEXT PRIMARY KEY NOT NULL,
        nickname TEXT NOT NULL,
        places_json TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      ) STRICT;
    `);
  } catch (error) {
    database.close();
    throw error;
  }
  return {
    close: () => database.close(),
    getOwn(ownerHash: string | null): PilotShelf | null {
      if (!ownerHash) return null;
      return readShelf(database.prepare('SELECT nickname, places_json FROM taste_shelves WHERE owner_hash = ? AND expires_at > ?').get(ownerHash, Date.now()));
    },
    listOthers(ownerHash: string | null): Array<PilotShelf & { ownerHash: string }> {
      return database.prepare('SELECT owner_hash, nickname, places_json FROM taste_shelves WHERE owner_hash != ? AND expires_at > ? ORDER BY owner_hash LIMIT ?')
        .all(ownerHash || '', Date.now(), PILOT_MAX_SHELVES).flatMap(row => {
          const shelf = readShelf(row);
          return shelf && typeof row.owner_hash === 'string' ? [{ ...shelf, ownerHash: row.owner_hash }] : [];
        });
    },
    publish(ownerHash: string, shelf: PilotShelf): boolean {
      const clean = parsePilotShelf(shelf.nickname, shelf.places);
      if (!OWNER.test(ownerHash) || !clean) return false;
      const now = Date.now();
      database.prepare('DELETE FROM taste_shelves WHERE expires_at <= ?').run(now);
      const result = database.prepare(`
        INSERT INTO taste_shelves (owner_hash, nickname, places_json, expires_at)
        SELECT ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM taste_shelves WHERE owner_hash = ?)
          OR (SELECT COUNT(*) FROM taste_shelves) < ?
        ON CONFLICT(owner_hash) DO UPDATE SET nickname = excluded.nickname, places_json = excluded.places_json, expires_at = excluded.expires_at
      `).run(ownerHash, clean.nickname, JSON.stringify(clean.places), now + 1000 * PILOT_COOKIE_MAX_AGE, ownerHash, PILOT_MAX_SHELVES);
      return Number(result.changes) === 1;
    },
    revoke(ownerHash: string | null) {
      if (ownerHash) database.prepare('DELETE FROM taste_shelves WHERE owner_hash = ?').run(ownerHash);
    },
  };
}
