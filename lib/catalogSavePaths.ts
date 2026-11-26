export function isCatalogPlaceId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 120;
}

export function catalogPlaceDestination(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/cafe/')) return null;
  const id = value.slice(6);
  return isCatalogPlaceId(id) ? id : null;
}
