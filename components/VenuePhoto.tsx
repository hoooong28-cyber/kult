import Image from 'next/image';
import { getVenuePhoto } from '@/lib/venuePhotos';
import type { Cafe } from '@/lib/types';

export default function VenuePhoto({ cafe, variant = 'card', eager = false }: { cafe: Cafe; variant?: 'card' | 'detail' | 'editorial'; eager?: boolean }) {
  const photo = getVenuePhoto(cafe);
  if (!photo) return null;
  const detail = variant === 'detail';
  const editorial = variant === 'editorial';
  return (
    <figure id={detail ? 'venue-photo' : undefined} className={detail ? 'scroll-mt-20' : editorial ? '' : 'mb-4'}>
      <div className={'relative overflow-hidden rounded-xl bg-stone-100 ' + (detail ? 'aspect-[16/9]' : editorial ? 'aspect-[16/10] rounded-none' : 'aspect-[16/10]')}>
        <Image src={photo.src} alt={photo.alt} fill loading={eager ? "eager" : undefined} fetchPriority={eager ? "high" : undefined} sizes={detail ? '(max-width: 768px) 100vw, 900px' : '(max-width: 768px) 100vw, 420px'} className="object-cover" />
      </div>
      <figcaption className={'mt-1.5 text-[11px] ' + (detail ? 'text-stone-300' : editorial ? 'px-4 pb-1 text-stone-600' : 'text-stone-600')}>
        <a href={photo.source_url} target="_blank" rel="noopener noreferrer" className={detail ? 'inline-flex min-h-11 items-center underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300' : 'underline underline-offset-2'}>
          사진 출처 · {photo.credit}
        </a>
      </figcaption>
    </figure>
  );
}
