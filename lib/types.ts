export type OutletAvailability = 'none' | 'few' | 'many' | 'unknown';
export type NoiseLevel = 'quiet' | 'moderate' | 'lively' | 'unknown';
export type PriceRange = '$' | '$$' | '$$$' | 'unknown';

export interface CafeTags {
  wifi: boolean | null;
  outlet_availability: OutletAvailability;
  noise_level: NoiseLevel;
  kid_free_zone: boolean | null;
  english_menu: boolean | null;
  card_only: boolean | null;
  good_for: string[]; // e.g. ["work", "solo", "date", "brunch"]
  price_range: PriceRange;
}

export interface Cafe {
  id: string;
  name: string;
  name_local: string;
  neighborhood: string;
  address: string;
  lat: number | null;
  lng: number | null;
  tags: CafeTags;
  hours: string;
  last_verified_date: string; // YYYY-MM-DD
  notes: string; // Interview commentary from curator
}

export interface CuratorProfile {
  id: string; // Adaptable to user_id in Phase 2
  display_name: string;
  identity_tag: string; // e.g. "성수동 로스터리 오너" - prominent headline tag
  bio: string; // Bio explaining why this person's taste is interesting
  source_list_url?: string;
  instagram_or_link?: string;
  avatar_image?: string;
  status: 'active' | 'pending_review';
  joined_date: string;
}

export interface CuratorFileContent {
  curator: CuratorProfile;
  cafes: Cafe[];
}

export interface CuratedCafe extends Cafe {
  curators: CuratorProfile[];
  curated_by: string[]; // Array of Curator IDs / User IDs
  freshness: {
    months_ago: number;
    is_stale: boolean; // >= 3 months
    badge_label: string;
  };
}

export interface CafeFilterParams {
  neighborhood?: string;
  wifi?: boolean;
  outlet_availability?: OutletAvailability;
  noise_level?: NoiseLevel;
  kid_free_zone?: boolean;
  english_menu?: boolean;
  card_only?: boolean;
  good_for?: string;
  search_query?: string;
  curator_id?: string;
}
