export interface TasteNeighborViewer {
  id: string;
  naverPlaceIds: readonly string[];
}

export interface SharedTasteShelf extends TasteNeighborViewer {
  nickname: string;
  visibility: 'shared' | 'private' | 'revoked';
}

export interface TasteNeighbor {
  id: string;
  nickname: string;
  commonPlaceIds: string[];
  newPlaceIds: string[];
}

const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const placeIds = (ids: readonly string[]) =>
  new Set(ids.filter(id => typeof id === 'string' && /^[1-9][0-9]{0,19}$/.test(id)));

// Pass only the currently authorized shelf snapshots. A conflicting duplicate
// snapshot is ambiguous, so exclude that owner instead of guessing consent.
export function findTasteNeighbors(
  viewer: TasteNeighborViewer,
  shelves: readonly SharedTasteShelf[],
): TasteNeighbor[] {
  if (!viewer.id) return [];
  const own = placeIds(viewer.naverPlaceIds);
  if (own.size < 2) return [];
  const counts = new Map<string, number>();
  for (const { id } of shelves) counts.set(id, (counts.get(id) ?? 0) + 1);

  const matches: { neighbor: TasteNeighbor; unionSize: number }[] = [];
  for (const { id, nickname, visibility, naverPlaceIds } of shelves) {
    if (typeof id !== 'string' || !id.trim() || id === viewer.id || visibility !== 'shared'
      || counts.get(id) !== 1 || typeof nickname !== 'string' || !nickname.trim()) continue;
    const shared = placeIds(naverPlaceIds);
    const commonPlaceIds = [...shared].filter(placeId => own.has(placeId)).sort(compare);
    if (commonPlaceIds.length < 2) continue;
    const newPlaceIds = [...shared].filter(placeId => !own.has(placeId)).sort(compare);
    matches.push({
      neighbor: { id, nickname, commonPlaceIds, newPlaceIds },
      unionSize: own.size + newPlaceIds.length,
    });
  }
  // Jaccard = common / union; cross-multiply to avoid rounded scores.
  return matches.sort((a, b) =>
    b.neighbor.commonPlaceIds.length - a.neighbor.commonPlaceIds.length
    || b.neighbor.commonPlaceIds.length * a.unionSize - a.neighbor.commonPlaceIds.length * b.unionSize
    || compare(a.neighbor.id, b.neighbor.id)
  ).map(({ neighbor }) => neighbor);
}
