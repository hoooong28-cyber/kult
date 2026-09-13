import { CuratedCafe } from './types';

export interface RecommendedCafeMatch {
  cafe: CuratedCafe;
  matchScore: number; // e.g. 96
  matchReason: string; // e.g. "조용한 작업 환경 • 스페셜티 원두 • 우드 테마"
  affinityTag: string; // e.g. "작업 몰입 98%"
}

export interface TasteAnalysisResult {
  savedCount: number;
  savedNames: string[];
  recommendationHeader: string;
  recommendations: RecommendedCafeMatch[];
}

/**
 * Spotify-Style Hidden Taste Engine:
 * Analyzes saved cafes' tags (quiet noise, outlets, good_for, etc.)
 * Generates natural recommendation header and match metrics for unsaved cafes.
 */
export function analyzeSavedTaste(
  savedCafeIds: string[],
  allCafes: CuratedCafe[]
): TasteAnalysisResult {
  if (!allCafes || allCafes.length === 0) {
    return {
      savedCount: 0,
      savedNames: [],
      recommendationHeader: '저장된 장소가 모이면 나와 닮은 추천 공간을 찾아드립니다',
      recommendations: [],
    };
  }

  const savedCafes = allCafes.filter((c) => savedCafeIds.includes(c.id));
  const unSavedCafes = allCafes.filter((c) => !savedCafeIds.includes(c.id));

  const savedNames = savedCafes.map((c) => c.name_local || c.name);

  // Fallback if no saved cafes
  if (savedCafes.length === 0) {
    const defaultMatches: RecommendedCafeMatch[] = allCafes.slice(0, 3).map((cafe, idx) => ({
      cafe,
      matchScore: 95 - idx * 3,
      matchReason: '에디터 추천 최고 순위 공간',
      affinityTag: `선호도 ${98 - idx * 2}%`,
    }));

    return {
      savedCount: 0,
      savedNames: [],
      recommendationHeader: '서울 큐레이터 추천 베스트 공간 3곳',
      recommendations: defaultMatches,
    };
  }

  // Calculate dominant tag preferences
  let quietCount = 0;
  let outletManyCount = 0;
  let workGoodCount = 0;
  const neighborhoodCounts: Record<string, number> = {};

  savedCafes.forEach((c) => {
    if (c.tags.noise_level === 'quiet') quietCount++;
    if (c.tags.outlet_availability === 'many') outletManyCount++;
    if (c.tags.good_for?.includes('work') || c.tags.good_for?.includes('solo')) workGoodCount++;
    if (c.neighborhood) {
      neighborhoodCounts[c.neighborhood] = (neighborhoodCounts[c.neighborhood] || 0) + 1;
    }
  });

  // Dynamic header text (Spotify Style)
  let headerText = '';
  if (savedNames.length === 1) {
    headerText = `저장하신 ${savedNames[0]}와 결이 닮은 공간 추천`;
  } else if (savedNames.length === 2) {
    headerText = `저장하신 ${savedNames[0]}, ${savedNames[1]}와 분위기가 닮은 공간 추천`;
  } else {
    headerText = `저장하신 ${savedNames[0]}, ${savedNames[1]} 외 ${savedNames.length - 2}곳과 닮은 공간 추천`;
  }

  // Score unsaved cafes
  const scoredMatches: RecommendedCafeMatch[] = unSavedCafes.map((cafe) => {
    let baseScore = 82;
    const reasons: string[] = [];

    if (quietCount > 0 && cafe.tags.noise_level === 'quiet') {
      baseScore += 6;
      reasons.push('조용한 분위기');
    }

    if (outletManyCount > 0 && cafe.tags.outlet_availability === 'many') {
      baseScore += 5;
      reasons.push('콘센트 풍부');
    }

    if (workGoodCount > 0 && (cafe.tags.good_for?.includes('work') || cafe.tags.good_for?.includes('solo'))) {
      baseScore += 4;
      reasons.push('노트북 작업 적합');
    }

    if (cafe.tags.english_menu) {
      baseScore += 2;
    }

    if (reasons.length === 0) {
      reasons.push('스페셜티 원두', '자연광 인테리어');
    }

    const matchScore = Math.min(99, Math.max(85, baseScore));

    return {
      cafe,
      matchScore,
      matchReason: reasons.join(' • '),
      affinityTag: `취향 일치 ${matchScore}%`,
    };
  });

  // Sort by highest match score
  scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

  // If unsaved matches are empty, provide fallback from saved
  const finalRecommendations =
    scoredMatches.length > 0
      ? scoredMatches.slice(0, 3)
      : allCafes.slice(0, 3).map((cafe, idx) => ({
          cafe,
          matchScore: 94 - idx * 2,
          matchReason: '에디터 픽 스페셜티 큐레이션',
          affinityTag: `추천도 ${96 - idx * 2}%`,
        }));

  return {
    savedCount: savedCafes.length,
    savedNames,
    recommendationHeader: headerText,
    recommendations: finalRecommendations,
  };
}
