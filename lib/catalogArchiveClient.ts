'use client';

import { isCatalogPlaceId } from './catalogSavePaths';

type CatalogArchiveState =
  | { enabled: false; signedIn: false }
  | { enabled: true; signedIn: false }
  | { enabled: true; signedIn: true; ids: string[] };

const endpoint = '/api/catalog-archive';

export async function loadCatalogArchive(signal?: AbortSignal): Promise<CatalogArchiveState> {
  const response = await fetch(endpoint, { cache: 'no-store', signal });
  if (!response.ok) throw new Error('Could not load account archive.');
  const data = await response.json();
  if (data.enabled === true && data.signedIn === true && Array.isArray(data.ids) && data.ids.every(isCatalogPlaceId)) {
    return { enabled: true, signedIn: true, ids: data.ids };
  }
  if (typeof data.enabled === 'boolean' && data.signedIn === false) {
    return data.enabled ? { enabled: true, signedIn: false } : { enabled: false, signedIn: false };
  }
  throw new Error('Unexpected account archive response.');
}

export async function setCatalogSave(placeId: string, saved: boolean) {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeId, saved }),
  });
  if (!response.ok || (await response.json()).saved !== saved) throw new Error('Could not update account archive.');
}
