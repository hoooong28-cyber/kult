export type NaverPlaceLink =
  | { kind: 'place'; id: string; url: string }
  | { kind: 'short'; url: string };

const idPattern = '[1-9][0-9]{0,19}';
const mapPath = new RegExp(`^/(?:p|v5)/(?:entry/place|search/[^/]+/place)/(${idPattern})/?$`);
const placePath = new RegExp(`^/(?:place|restaurant|cafe|attraction|culture|shopping|accommodation|space)/(${idPattern})(?:/(?:home|menu|photo|review(?:/visitor|/blog)?|information|feed))?/?$`);
const shortPath = /^\/[A-Za-z0-9]{4,32}\/?$/;

export function canonicalNaverPlaceUrl(id: string): string {
  return `https://map.naver.com/p/entry/place/${id}`;
}

/** Identify a single publicly navigable Naver place. Never retain link query strings or fragments. */
export function parseNaverPlaceLink(input: string): NaverPlaceLink | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (value.length > 2048 || /[\u0000-\u0020\u007f\\]/.test(value)) return null;
  const rawPath = value.split(/[?#]/, 1)[0];
  if (!/^https:\/\/(?:naver\.me|map\.naver\.com|m\.place\.naver\.com|place\.naver\.com)\//i.test(rawPath)
      || /%(?:2e|2f|5c)/i.test(rawPath) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(rawPath)) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const { hostname, pathname } = url;
  if (hostname === 'naver.me') {
    return shortPath.test(pathname) ? { kind: 'short', url: `https://naver.me${pathname.replace(/\/$/, '')}` } : null;
  }
  const match = hostname === 'map.naver.com' ? mapPath.exec(pathname)
    : hostname === 'm.place.naver.com' || hostname === 'place.naver.com' ? placePath.exec(pathname) : null;
  return match ? { kind: 'place', id: match[1], url: canonicalNaverPlaceUrl(match[1]) } : null;
}

export function ownerPlaceNameKey(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/[\s()[\]{}]/g, '');
}

export function ownerPlaceAddressKey(value: string): string {
  return value.normalize('NFKC').toLowerCase()
    .replace(/^서울특별시(?=\s|[가-힣])/u, '서울').replace(/[\s(),]/g, '');
}

/** Building-level identity, only for a conservative conflict check against closed places. */
export function ownerPlaceRoadKey(value: string): string {
  const parts = value.normalize('NFKC').trim().match(/^(.+?(?:대로|로|길))\s*(\d+(?:\s*-\s*\d+)?)/u);
  return parts ? `${ownerPlaceAddressKey(parts[1])}#${parts[2].replace(/\s/g, '')}` : '';
}
