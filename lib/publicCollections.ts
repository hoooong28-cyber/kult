import type { CuratedCafe } from './types';

export const kSeoulEvenings = {
  slug: 'k-seoul-evenings',
  byline: 'K',
  title: 'K가 고른 서울의 저녁',
  entries: [
    { id: 'discovery-wildduck-canteen-haebangchon', area: '해방촌', reason: '빈티지 가구와 오픈 키친이 있는 와인바 겸 레스토랑.', reasonEn: 'A wine bar and restaurant with vintage furniture and an open kitchen.' },
    { id: 'discovery-chungwang-yeonhui', area: '연희동', reason: '전통주에 제철 한식 안주를 곁들이는 골목 주점.', reasonEn: 'A neighborhood tavern pairing Korean drinks with seasonal dishes.' },
    { id: 'discovery-salt-and-kelp-seogyo', area: '서교동 · 합정역 근처', reason: '콘부 파스타와 일본식 안주를 조금씩 나눠 먹는 이자카야.', reasonEn: 'An izakaya for sharing kombu pasta and Japanese-style small plates.' },
  ],
} as const;

// The server receives only the public venue catalog, never a viewer's archive.
export function resolveKSeoulEvenings(catalog: readonly CuratedCafe[]) {
  return kSeoulEvenings.entries.flatMap(entry => {
    const cafe = catalog.find(venue => venue.id === entry.id);
    return cafe && !cafe.is_demo && cafe.business_status !== 'closed' ? [{ ...entry, cafe }] : [];
  });
}
