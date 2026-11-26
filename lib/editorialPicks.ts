import data from '../data/editorial-picks.json' with { type: 'json' };

export const picks = data;

export function resolveEditorialPick<T extends { id: string; is_demo?: boolean; business_status?: string; content_status?: string }>(
  slug: string, catalog: T[],
) {
  const pick = picks.find(item => item.slug === slug);
  if (!pick || pick.places.length < 2 || pick.places.length > (pick.source === 'neighborhood' ? 5 : 3) || new Set(pick.places.map(place => place.id)).size !== pick.places.length) return null;
  const entries = pick.places.flatMap(place => {
    const cafe = catalog.find(cafe => cafe.id === place.id && !cafe.is_demo && cafe.business_status !== 'closed'
      && (pick.source === 'discovery' ? cafe.content_status === 'discovered' : !cafe.content_status));
    return cafe ? [{ ...place, cafe }] : [];
  });
  return entries.length ? { ...pick, places: entries } : null;
}

export const pickPurposes = [
  { id: 'date', label: '데이트', english: 'Date', heading: '데이트하기 좋은 곳' },
  { id: 'friends', label: '친구 모임', english: 'With friends', heading: '친구 모임에 좋은 곳' },
  { id: 'solo', label: '혼자 가기', english: 'Solo', heading: '혼자 가기 좋은 곳' },
] as const;

export type PickPurpose = typeof pickPurposes[number]['id'];

export function resolvePickPurpose(value?: string | string[]) {
  return pickPurposes.find(purpose => purpose.id === value);
}

export function purposePicks<T extends { purposes: string[] }>(entries: T[], purpose?: PickPurpose) {
  return entries.filter(entry => !purpose || entry.purposes.includes(purpose));
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
