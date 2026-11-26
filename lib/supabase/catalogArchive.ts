import 'server-only';
import { getCafeById } from '@/lib/curators';
import { isCatalogPlaceId } from '@/lib/catalogSavePaths';

export async function canSaveCatalogPlace(id: unknown): Promise<boolean> {
  if (!isCatalogPlaceId(id)) return false;
  const place = await getCafeById(id);
  return Boolean(place && !place.is_demo && place.business_status !== 'closed');
}
