import data from '../data/venue-photos.json' with { type: 'json' };
import policy from '../data/venue-photo-policy.json' with { type: 'json' };

export type VenuePhotoRecord = {
  src: string;
  alt: string;
  credit: string;
  source_url: string;
  venue_address: string;
  subject: 'interior' | 'coffee' | 'food';
};

const manifest: Readonly<Record<string, VenuePhotoRecord>> = data as Record<string, VenuePhotoRecord>;

export function getVenuePhoto(place: { id: string; address: string; is_demo?: boolean; business_status?: string }): VenuePhotoRecord | null {
  if (place.is_demo || place.business_status === 'closed' || policy.excluded_place_ids.includes(place.id) || !Object.hasOwn(manifest, place.id)) return null;
  const photo = manifest[place.id];
  // A branch move must not silently inherit an old photo even when using an existing ID.
  return photo.venue_address === place.address
    && /^\/venues\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp|avif)$/.test(photo.src)
    && ['interior', 'coffee', 'food'].includes(photo.subject)
    && photo.alt.trim() && photo.credit.trim() && /^https:\/\//.test(photo.source_url) ? photo : null;
}
