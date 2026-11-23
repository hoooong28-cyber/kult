import { pathToFileURL } from 'node:url';
import { findVenue } from './discover-venue-photos.mjs';

export function planNaverPhotoSearch(venue) {
  if (!venue?.id || !(venue.nameLocal || venue.name) || !venue.address) {
    throw new Error('A verified place name and street address are required');
  }
  const name = venue.nameLocal || venue.name;
  const address = venue.address;
  const searches = [
    { goal: 'same-branch-interior', query: name + ' ' + address + ' 실내 좌석' },
    { goal: 'same-branch-signature', query: name + ' ' + address + ' 커피 음식' },
    { goal: 'merchant-source', query: name + ' ' + address + ' 공식' },
  ].map((entry, index) => {
    const url = new URL('https://search.naver.com/search.naver');
    url.searchParams.set('where', index === 2 ? 'nexearch' : 'image');
    url.searchParams.set('query', entry.query);
    return { ...entry, url: url.href };
  });
  return { venueId: venue.id, name, address, status: 'discovery-only', searches };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== '--place') throw new Error('Usage: npm run photos:naver -- --place <venue-id>');
    const venue = await findVenue(args[1]);
    console.log(JSON.stringify(planNaverPhotoSearch(venue), null, 2));
  } catch (err) { console.error(err.message); process.exitCode = 1; }
}
