import { parseNaverPlaceLink } from './naverPlaceLinks.ts';

export type MemberPlaceCandidate = { id: string; name: string };
type Imported = { id: string; name: string; url: string; available: boolean };
type Individual = { id: string; name: string; url: string };
type Native = { naver_place_id?: string; name_local?: string; name: string; is_demo?: boolean; business_status?: string };
const key = /^[1-9][0-9]{0,19}$/;
const clean = (name: string) => Array.from(name.normalize('NFC')
  .replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, ' ').replace(/\s+/g, ' ').trim()).slice(0, 80).join('');

export function collectBrowserNaverPlaces({ imported, individual, native = [] }: {
  imported: readonly Imported[]; individual: readonly Individual[]; native?: readonly Native[];
}): MemberPlaceCandidate[] {
  const candidates = new Map<string, MemberPlaceCandidate>();
  const excluded = new Set(native.filter(row => row.business_status === 'closed' && row.naver_place_id)
    .map(row => row.naver_place_id));
  const add = (id: string, title: string) => {
    if (!key.test(id) || excluded.has(id) || candidates.has(id)) return;
    candidates.set(id, { id, name: clean(title) || '네이버 지도 장소 ' + id });
  };
  for (const row of imported) {
    const link = parseNaverPlaceLink(row.url);
    if (row.available && link?.kind === 'place' && row.id === 'naver-place-' + link.id) add(link.id, row.name);
  }
  for (const row of individual) {
    const link = parseNaverPlaceLink(row.url);
    if (link?.kind === 'place' && row.id === link.id) add(link.id, row.name);
  }
  for (const row of native) {
    if (!row.is_demo && row.business_status !== 'closed' && row.naver_place_id) add(row.naver_place_id, row.name_local || row.name);
  }
  return [...candidates.values()];
}
