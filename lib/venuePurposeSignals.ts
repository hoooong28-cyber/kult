// The draft engine accepts structured facts only. It does not fetch reviews or publish changes.
const facts = ['quiet', 'two_seat_tables', 'bar_seats', 'table_for_four', 'group_reservation', 'shared_menu'] as const;
export type VenueFact = typeof facts[number];
type Source = 'merchant-permission' | 'kult-observation' | 'kult-opt-in-aggregate';
export type VenueEvidence = {
  placeId: string;
  address: string;
  source: Source;
  reference: string;
  checkedOn: string;
  facts: VenueFact[];
};

const rules = [
  {purpose: 'date', groups: [['quiet'], ['two_seat_tables']]},
  {purpose: 'friends', groups: [['table_for_four', 'group_reservation']]},
  {purpose: 'solo', groups: [['bar_seats']]},
] as const;

function safeReference(value: unknown): boolean {
  if (typeof value !== 'string' || value.length > 512) return false;
  if (/^kult:(?:observation|aggregate):[a-z0-9_-]{1,64}$/.test(value)) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && !u.search && !u.hash;
  } catch { return false; }
}

export function draftVenuePurposes(
  place: { id: string; address: string; is_demo?: boolean; business_status?: string },
  evidence: readonly VenueEvidence[],
  asOf: string,
) {
  if (place.is_demo || place.business_status === 'closed' || !place.address) return [];
  const today = Date.parse(asOf);
  if (!Number.isFinite(today)) return [];
  const allowed = new Set<string>(['merchant-permission','kult-observation','kult-opt-in-aggregate']);
  const approved = evidence.filter(row => {
    if (!row || !Array.isArray(row.facts) || !row.facts.every(item => facts.includes(item)) ||
      row.placeId !== place.id || row.address !== place.address || !allowed.has(row.source) || !safeReference(row.reference)) return false;
    const checked = Date.parse(row.checkedOn);
    return /^\d{4}-\d{2}-\d{2}$/.test(row.checkedOn) && checked <= today && today - checked <= 180 * 86400000;
  });
  const signals = new Set(approved.flatMap(row => row.facts));
  return rules.flatMap(({purpose, groups}) => {
    const matched: (VenueFact | undefined)[] = groups.map(group => group.find(fact => signals.has(fact)));
    if (matched.some(fact => !fact)) return [];
    return [{purpose, status:'needs-review' as const, facts:[...new Set(matched.filter(Boolean))],
      references:[...new Set(approved.filter(row => row.facts.some(f => matched.includes(f))).map(row => row.reference))]}];
  });
}
