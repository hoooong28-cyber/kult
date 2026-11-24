import { getVenueMenu } from '@/lib/venueMenus';
import type { Cafe } from '@/lib/types';

const krw = new Intl.NumberFormat('ko-KR');
const sourceClass = 'inline-flex min-h-11 items-center text-sm text-stone-200 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300';

export default function VenueMenu({ cafe }: { cafe: Cafe }) {
  const menu = getVenueMenu(cafe);
  if (!menu) return null;

  const board = menu.menuBoard && <a className={sourceClass} href={menu.menuBoard.url} target="_blank" rel="noopener noreferrer">
    네이버 메뉴판 사진 보기 <span aria-hidden="true">&nbsp;↗</span><span className="sr-only"> (새 창)</span>
  </a>;

  if (menu.source.kind === 'menu_link') return (
    <section id="venue-menu" lang="ko" aria-labelledby="venue-menu-title" className="scroll-mt-20 border-y border-stone-700 py-5 sm:py-7">
      <h2 id="venue-menu-title" className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">메뉴</h2>
      <p className="mt-1 text-sm leading-relaxed text-stone-300">메뉴와 가격은 네이버 지도에서 확인해 주세요.</p>
      <div className="flex flex-wrap gap-x-5">
        <a href={menu.source.url} target="_blank" rel="noopener noreferrer" className={sourceClass}>
          {menu.source.label} <span aria-hidden="true">&nbsp;↗</span><span className="sr-only"> (새 창)</span>
        </a>
        {board}
      </div>
    </section>
  );


  return (
    <section id="venue-menu" lang="ko" aria-labelledby="venue-menu-title" className="scroll-mt-20 border-y border-stone-700 py-5 sm:py-7">
      <div className="mb-2">
        <h2 id="venue-menu-title" className="font-serif text-xl font-bold text-stone-100 sm:text-2xl">메뉴 미리보기</h2>
        <p className="mt-1 text-sm leading-relaxed text-stone-300">
          {menu.source.kind === 'menu' ? '매장 메뉴에 나온 일부 항목이에요. 메뉴·가격은 바뀔 수 있어요.' : '방문기에서 확인한 메뉴예요. 현재 판매 여부는 매장에서 확인해 주세요.'}
        </p>
      </div>
      <ul className="divide-y divide-stone-800">
        {menu.items.map(item => <li key={item.name} className="flex min-h-11 items-center justify-between gap-4 text-sm">
          <span className="font-semibold text-stone-100">{item.name}</span>
          {item.price !== undefined && <span className="shrink-0 tabular-nums text-stone-200">{krw.format(item.price)}원</span>}
        </li>)}
      </ul>
      <div className="flex flex-wrap gap-x-5">
        <a href={menu.source.url} target="_blank" rel="noopener noreferrer" className={sourceClass}>
          {menu.source.label} · {menu.source.date.replaceAll('-', '.')} <span aria-hidden="true">&nbsp;↗</span><span className="sr-only"> (새 창)</span>
        </a>
        {board}
      </div>
      {menu.menuBoardInSource && <p className="text-sm text-stone-300">네이버 메뉴 페이지에서 ‘메뉴판 이미지로 보기’를 누르면 메뉴판 사진을 볼 수 있어요.</p>}
    </section>
  );
}
