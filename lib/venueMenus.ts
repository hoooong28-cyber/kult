import menus from '../data/venue-menus.json' with { type: 'json' };

export type VenueMenu = {
  address: string;
  naver_place_id?: string;
  source: { label: string; url: string; date: string; kind: 'menu' | 'visit' | 'menu_link' };
  items: { name: string; price?: number }[];
  menuBoardInSource?: boolean;
  menuBoard?: { url: string; verifiedDate: string };
};

const byId: Record<string, VenueMenu> = menus as Record<string, VenueMenu>;

export function getVenueMenu(place: { id: string; address: string; naver_place_id?: string; is_demo?: boolean; business_status?: string }) {
  if (place.is_demo || place.business_status === 'closed' || !Object.hasOwn(byId, place.id)) return null;
  const menu = byId[place.id];
  if (menu.address !== place.address || (menu.naver_place_id && menu.naver_place_id !== place.naver_place_id)) return null;
  if (menu.source.kind === 'menu_link' &&
    (!menu.naver_place_id || !/^[1-9]\d{0,19}$/.test(menu.naver_place_id) ||
      menu.source.url !== 'https://m.place.naver.com/restaurant/' + menu.naver_place_id + '/menu' || menu.items.length)) return null;
  const menuBoardInSource = Boolean(menu.menuBoardInSource && menu.naver_place_id &&
    /^[1-9]\d{0,19}$/.test(menu.naver_place_id) &&
    menu.source.url === 'https://m.place.naver.com/restaurant/' + menu.naver_place_id + '/menu/list');
  return { ...menu, menuBoardInSource, menuBoard: getExactBoard(menu.naver_place_id, menu.menuBoard) };
}

// A photo collection is a distinct source, never infer it from a text menu or ordinary place URL.
export function getExactBoard(placeId: string | undefined, board: VenueMenu['menuBoard']) {
  return board && placeId && /^[1-9]\d{0,19}$/.test(placeId) &&
    board.url === 'https://m.place.naver.com/restaurant/' + placeId + '/photo?filterType=AI+View&subFilter=MENU' &&
    /^\d{4}-\d{2}-\d{2}$/.test(board.verifiedDate) ? board : undefined;
}
