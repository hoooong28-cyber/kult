import Image from 'next/image';
import { getVenueIllustration, getVenuePhoto } from '@/lib/venuePhotos';
import type { Cafe } from '@/lib/types';

export default function VenuePhoto({ cafe, variant = 'card', eager = false }: { cafe: Cafe; variant?: 'card' | 'detail' | 'editorial'; eager?: boolean }) {
  const photo = getVenuePhoto(cafe);
  const illustration = photo ? null : getVenueIllustration(cafe);
  const src = photo?.src ?? illustration;
  if (!src) return null;
  const detail = variant === 'detail';
  const editorial = variant === 'editorial';
  return (
    <figure id={detail ? 'venue-photo' : undefined} className={detail ? 'scroll-mt-20' : editorial ? '' : 'mb-4'}>
      <div className={'relative overflow-hidden bg-stone-100 ' + (editorial ? 'rounded-none ' : 'rounded-xl ') + (detail && photo ? 'aspect-[16/9]' : 'aspect-[16/10]')}>
        <Image src={src} alt={photo?.alt ?? ''} fill loading={eager ? "eager" : undefined} fetchPriority={eager ? "high" : undefined} sizes={detail ? '(max-width: 768px) 100vw, 900px' : '(max-width: 768px) 100vw, 420px'} className="object-cover" />
      </div>
      <figcaption className={'mt-1.5 text-xs ' + (detail ? 'text-stone-300' : editorial ? 'px-4 pb-1 text-stone-600' : 'text-stone-600')}>
        {photo ? <a href={photo.source_url} target="_blank" rel="noopener noreferrer" className={detail ? 'inline-flex min-h-11 items-center underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300' : 'underline underline-offset-2'}>
          사진 출처 · {photo.credit}
        </a> : <span>{detail ? 'KULT 일러스트 · 실제 공간 사진이 아니에요' : 'KULT 일러스트 · 실제 사진 아님'}</span>}
      </figcaption>
    </figure>
  );
}
