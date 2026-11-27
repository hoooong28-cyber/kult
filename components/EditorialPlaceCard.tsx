import { naverVenueMapLink } from '@/lib/naverPlaceLinks';
import Link from 'next/link';
import type { CuratedCafe } from '@/lib/types';
import { getVenuePhoto } from '@/lib/venuePhotos';
import VenuePhoto from './VenuePhoto';
import CopyPlaceAddress from './CopyPlaceAddress';
import SavePlaceButton from './SavePlaceButton';
import styles from '@/app/picks/[slug]/picks.module.css';

export default function EditorialPlaceCard({ cafe, area, index, reason, reasonEn, eagerPhoto = false, allowSave = false }: {
  cafe: CuratedCafe; area: string; index: number; reason: string; reasonEn: string; eagerPhoto?: boolean; allowSave?: boolean;
}) {
  if (cafe.is_demo || cafe.business_status === 'closed') return null;
  const hasPhoto = Boolean(getVenuePhoto(cafe));
  const map = naverVenueMapLink(cafe);
  const exactMap = map.kind === 'place' ? map.href : null;
  return <article className={hasPhoto ? styles.card : `${styles.card} ${styles.textCard}`}>
    {hasPhoto && <VenuePhoto cafe={cafe} variant="editorial" eager={eagerPhoto} />}
    <div className={styles.cardCopy}>
      <p className={styles.cardKicker}>{String(index + 1).padStart(2, '0')} / {area}</p>
      <h3><Link href={'/cafe/' + cafe.id}>{cafe.name_local || cafe.name} <span aria-hidden="true">↗</span></Link></h3>
      <p className={styles.reason}>{reason}</p>
      <p lang="en" className={styles.enReason}>{reasonEn}</p>
      <p className={styles.address}>{cafe.address}</p>
      <div className={styles.cardActions}>
        <a href={map.href} target="_blank" rel="noopener noreferrer" className={styles.map}>{exactMap ? '지도 열기' : '지도에서 상호 검색'} <span aria-hidden="true">↗</span></a>
        {!hasPhoto && exactMap && <a href={exactMap + '?placePath=%2Fphoto'} target="_blank" rel="noopener noreferrer" className={styles.map}>네이버 사진 보기 <span aria-hidden="true">↗</span></a>}
        <CopyPlaceAddress address={cafe.address} />
        {allowSave && <SavePlaceButton placeId={cafe.id} />}
      </div>
      {cafe.discovery_source && <a className={styles.source} href={cafe.discovery_source.url} target="_blank" rel="noopener noreferrer">소개 출처 ↗</a>}
    </div>
  </article>;
}
