import { parseNaverPlaceLink, type NaverPlaceLink } from './naverPlaceLinks.ts';

type PlaceLink = Extract<NaverPlaceLink, { kind: 'place' }>;
type RedirectLookup = (url: string) => Promise<string | null>;

/** Resolve only exact Naver short links and return an allowed place without fetching its page. */
export async function resolveNaverShortLink(input: string, lookup: RedirectLookup): Promise<PlaceLink | null> {
  let cursor = parseNaverPlaceLink(input);
  if (cursor?.kind !== 'short') return null;
  const seen = new Set<string>();
  for (let i = 0; i < 3 && cursor?.kind === 'short'; i++) {
    if (seen.has(cursor.url)) return null;
    seen.add(cursor.url);
    const location = await lookup(cursor.url);
    if (!location) return null;
    // Resolve only a same-origin root-relative Location, never protocol-relative.
    const absolute = /^\/[A-Za-z0-9]/.test(location) ? 'https://naver.me' + location : location;
    const next = parseNaverPlaceLink(absolute);
    if (next?.kind === 'place') return next;
    cursor = next;
  }
  return null;
}
