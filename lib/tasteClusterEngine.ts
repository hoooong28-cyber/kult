import { CuratedCafe } from './types';

export interface TasteClusterProfile {
  clusterName: string; // e.g. "ACOUSTIC WORK NOMAD"
  clusterDescription: string; // e.g. "저소음(45dB 이하)과 테라스/원목 작업을 선호하는 큐레이터 그룹"
  affinityScore: number; // e.g. 96
  topKeywords: string[]; // e.g. ["#45dB_저소음", "#콘센트_70%", "#원목_인테리어"]
  sharedSpaceCount: number;
}

export function classifyUserTasteCluster(
  savedCafeIds: string[],
  followingIds: string[],
  allCafes: CuratedCafe[]
): TasteClusterProfile {
  const savedCafes = allCafes.filter((c) => savedCafeIds.includes(c.id));

  let quietCount = 0;
  let outletCount = 0;
  let roasteryCount = 0;

  savedCafes.forEach((c) => {
    if (c.tags?.noise_level === 'quiet') quietCount++;
    if (c.tags?.outlet_availability === 'many') outletCount++;
    if (c.tags?.good_for?.includes('coffee') || c.neighborhood === 'Seongsu') roasteryCount++;
  });

  if (quietCount >= outletCount && quietCount >= roasteryCount) {
    return {
      clusterName: 'ACOUSTIC WORK NOMAD',
      clusterDescription: '45dB 이하의 저소음과 깊은 조도의 작업 환경을 최우선으로 수집하는 큐레이터 그룹',
      affinityScore: 96,
      topKeywords: ['#저소음_45dB', '#콘센트_70%+', '#혼작_최적'],
      sharedSpaceCount: savedCafes.length,
    };
  } else if (roasteryCount > quietCount) {
    return {
      clusterName: 'SPECIALTY ROASTERY COLLECTOR',
      clusterDescription: '단일 원두 테루아와 바리스타 핸드드립 큐레이션을 집중 추적하는 테이스터 그룹',
      affinityScore: 94,
      topKeywords: ['#스페셜티_필터', '#원두_테루아', '#성수_한남_노선'],
      sharedSpaceCount: savedCafes.length,
    };
  } else {
    return {
      clusterName: 'ZEN ARCHITECTURE & TEA SCHOLAR',
      clusterDescription: '한옥 처마, 중정 정원 및 수제 덖음 차의 정적을 기록하는 에디토리얼 그룹',
      affinityScore: 92,
      topKeywords: ['#한옥_중정', '#덖음차_페어링', '#서촌_삼청_골목'],
      sharedSpaceCount: savedCafes.length,
    };
  }
}
