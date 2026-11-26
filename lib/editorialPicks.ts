import data from '../data/editorial-picks.json' with { type: 'json' };

export const picks = data;

export function resolveEditorialPick<T extends { id: string; is_demo?: boolean; business_status?: string; content_status?: string }>(
  slug: string, catalog: T[],
) {
  const pick = picks.find(item => item.slug === slug);
  if (!pick || pick.places.length < 2 || pick.places.length > (pick.source === 'neighborhood' ? 5 : pick.source === 'mixed' ? 4 : 3) || new Set(pick.places.map(place => place.id)).size !== pick.places.length) return null;
  const entries = pick.places.flatMap(place => {
    const cafe = catalog.find(cafe => cafe.id === place.id && !cafe.is_demo && cafe.business_status !== 'closed'
      && ((pick.source === 'discovery' || (pick.source === 'mixed' && (!('source' in place) || place.source !== 'curation'))) ? cafe.content_status === 'discovered' : !cafe.content_status));
    return cafe ? [{ ...place, cafe }] : [];
  });
  return entries.length ? { ...pick, places: entries } : null;
}

export const pickPurposes = [
  { id: 'date', label: '데이트', english: 'Date', heading: '데이트하기 좋은 곳', cue: '식사 약속부터 산책 중 들를 곳까지' },
  { id: 'friends', label: '친구 모임', english: 'With friends', heading: '친구 모임에 좋은 곳', cue: '친구와 함께 먹고 마실 곳' },
  { id: 'solo', label: '혼자 가기', english: 'Solo', heading: '혼자 가기 좋은 곳', cue: '커피 한 잔부터 가벼운 디저트까지' },
] as const;

export type PickPurpose = typeof pickPurposes[number]['id'];

export function resolvePickPurpose(value?: string | string[]) {
  return pickPurposes.find(purpose => purpose.id === value);
}

type PurposeCopy = { ko: string; en: string };
type PurposeEntry = { purposes: string[]; purpose_rank?: Partial<Record<PickPurpose, number>>; purpose_copy?: Partial<Record<PickPurpose, PurposeCopy>> };
export function purposePicks<T extends PurposeEntry>(entries: T[], purpose?: PickPurpose) {
  if (!purpose) return entries;
  return entries.filter(entry => entry.purposes.includes(purpose))
    .sort((a, b) => (a.purpose_rank?.[purpose] ?? Infinity) - (b.purpose_rank?.[purpose] ?? Infinity));
}

export function pickCopy(entry: PurposeEntry & { reason: string; reason_en: string }, purpose?: PickPurpose) {
  return (purpose && entry.purpose_copy?.[purpose]) || { ko: entry.reason, en: entry.reason_en };
}

export function resolvePurposeShortlist<T extends { id: string; is_demo?: boolean; business_status?: string; content_status?: string }>(
  catalog: T[], purpose: PickPurpose,
) {
  const seen = new Set<string>();
  return picks.flatMap(pick => {
    const list = resolveEditorialPick(pick.slug, catalog);
    if (!list) return [];
    return purposePicks(list.places, purpose).flatMap(place => {
      if (seen.has(place.cafe.id)) return [];
      seen.add(place.cafe.id);
      return [{ ...place, slug: pick.slug, area: pick.area, area_en: pick.area_en }];
    });
  });
}

const neighborhoodOrder = ['삼각지', '해방촌', '성수', '연남동'] as const;

export function resolvePurposeAreas<T extends { id: string; is_demo?: boolean; business_status?: string; content_status?: string }>(
  catalog: T[], purpose: PickPurpose,
) {
  return neighborhoodOrder.flatMap(area => {
    const pick = picks.find(candidate => candidate.area === area);
    if (!pick) return [];
    const resolved = resolveEditorialPick(pick.slug, catalog);
    const count = resolved ? new Set(purposePicks(resolved.places, purpose).map(place => place.cafe.id)).size : 0;
    return count ? [{ slug: pick.slug, area: pick.area, area_en: pick.area_en, count }] : [];
  });
}
