import Link from 'next/link';
import type { CuratedCafe } from '@/lib/types';
import { getVenuePhoto } from '@/lib/venuePhotos';
import VenuePhoto from './VenuePhoto';
import CopyPlaceAddress from './CopyPlaceAddress';
import SavePlaceButton from './SavePlaceButton';
import styles from '@/app/picks/[slug]/picks.module.css';

export default function EditorialPlaceCard({ cafe, area, index, reason, reasonEn, allowSave = false }: {
  cafe: CuratedCafe; area: string; index: number; reason: string; reasonEn: string; allowSave?: boolean;
}) {
  if (cafe.is_demo || cafe.business_status === 'closed') return null;
  const hasPhoto = Boolean(getVenuePhoto(cafe));
  const map = cafe.naver_place_id && /^[1-9]\d*$/.test(cafe.naver_place_id)
    ? 'https://map.naver.com/p/entry/place/' + cafe.naver_place_id
    : 'https://map.naver.com/p/search/' + encodeURIComponent((cafe.name_local || cafe.name) + ' ' + cafe.address);
  return <article className={hasPhoto ? styles.card : `${styles.card} ${styles.textCard}`}>
    {hasPhoto && <VenuePhoto cafe={cafe} variant="editorial" />}
    <div className={styles.cardCopy}>
      <p className={styles.cardKicker}>{String(index + 1).padStart(2, '0')} / {area}</p>
      <h3><Link href={'/cafe/' + cafe.id}>{cafe.name_local || cafe.name} <span aria-hidden="true">↗</span></Link></h3>
      <p className={styles.reason}>{reason}</p>
      <p lang="en" className={styles.enReason}>{reasonEn}</p>
      <p className={styles.address}>{cafe.address}</p>
      <div className={styles.cardActions}>
        <a href={map} target="_blank" rel="noopener noreferrer" className={styles.map}>지도 열기 <span aria-hidden="true">↗</span></a>
        <CopyPlaceAddress address={cafe.address} />
        {allowSave && <SavePlaceButton placeId={cafe.id} />}
      </div>
      {cafe.discovery_source && <a className={styles.source} href={cafe.discovery_source.url} target="_blank" rel="noopener noreferrer">소개 출처 ↗</a>}
    </div>
  </article>;
}
