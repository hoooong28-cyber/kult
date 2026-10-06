/** P1 local event sink. No network requests, cookies, email, or inferred account IDs. */
export const EVENT_NAMES = ['place_impression', 'place_open', 'place_save', 'place_unsave', 'map_open', 'story_impression', 'story_open', 'story_read', 'curator_view', 'curator_follow', 'curator_unfollow', 'share'] as const;
export type InteractionName = typeof EVENT_NAMES[number];
export const SOURCES = ['editorial', 'story', 'curator', 'curated_list', 'map', 'search'] as const;
export type RecommendationSource = typeof SOURCES[number];
export type InteractionContext = { place_id?: string; story_id?: string; curator_id?: string; recommendation_source?: RecommendationSource };
export type InteractionEvent = InteractionContext & { id: string; event: InteractionName; occurred_at: string; user_id: string | null; session_id: string; schema_version: 1 };
export const EVENT_KEY = 'kult_interactions_v1';
let memorySession: string | undefined;
export function parseSource(value: unknown): RecommendationSource | undefined {
  return SOURCES.includes(value as RecommendationSource) ? value as RecommendationSource : undefined;
}
export function sourceFromLocation(): RecommendationSource | undefined {
  return typeof window === 'undefined' ? undefined : parseSource(new URLSearchParams(window.location.search).get('source'));
}
export function withSource(path: string, source?: RecommendationSource): string {
  if (!source) return path;
  const [base, hash] = path.split('#');
  return `${base}${base.includes('?') ? '&' : '?'}source=${source}${hash ? `#${hash}` : ''}`;
}
export function track(event: InteractionName, context: InteractionContext = {}): boolean {
  if (typeof window === 'undefined') return false;
  try {
    let session: string | null = null;
    try {
      session = window.sessionStorage.getItem('kult_session_id');
      if (!session) { session = memorySession ||= crypto.randomUUID(); window.sessionStorage.setItem('kult_session_id', session); }
    } catch { session = memorySession ||= crypto.randomUUID(); }
    // Current login is a browser-only demo, not verified authentication. Replace at the server-auth boundary.
    const entry: InteractionEvent = { id: crypto.randomUUID(), event, occurred_at: new Date().toISOString(), user_id: null, session_id: session, schema_version: 1,
      place_id: context.place_id, story_id: context.story_id, curator_id: context.curator_id,
      recommendation_source: parseSource(context.recommendation_source) };
    const raw = window.localStorage.getItem(EVENT_KEY);
    const previous: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(previous)) return false; // Never replace corrupt or legacy data.
    window.localStorage.setItem(EVENT_KEY, JSON.stringify([...previous, entry]));
    return true;
  } catch { return false; } // Analytics failure must not break saving/navigation.
}
