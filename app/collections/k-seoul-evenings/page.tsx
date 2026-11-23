import Link from 'next/link';
import Header from '@/components/Header';
import EditorialPlaceCard from '@/components/EditorialPlaceCard';
import ShareEditorialPick from '@/components/ShareEditorialPick';
import { getMergedCafes } from '@/lib/curators';
import { kSeoulEvenings, resolveKSeoulEvenings } from '@/lib/publicCollections';
import styles from '@/app/picks/[slug]/picks.module.css';

const path = '/collections/k-seoul-evenings';
const description = '해방촌, 연희동, 서교동. K가 고른 서울의 저녁 장소를 둘러보세요.';

export const metadata = {
  title: kSeoulEvenings.title + ' · KULT',
  description,
  openGraph: { title: kSeoulEvenings.title + ' · KULT', description },
};

export default async function KSeoulEveningsPage() {
  const places = resolveKSeoulEvenings(await getMergedCafes());
  return <div lang="ko" className={styles.paper}>
    <Header section="picks" />
    <div className={styles.wrap}>
      <header className={styles.intro}>
        <p className={styles.eyebrow} lang="en">KULT COLLECTION <span> / </span> BY {kSeoulEvenings.byline}</p>
        <h1>{kSeoulEvenings.title}<span>.</span></h1>
        <p className={styles.dek}>{description}</p>
        <Link href="/" className={styles.back}>← KULT 홈</Link>
      </header>
      <section aria-labelledby="collection-places" className={styles.results}>
        <div className={styles.sectionHead}>
          <div><p lang="en">THE PLACES</p><h2 id="collection-places">저녁에 가볼 곳</h2></div>
          {places.length > 0 && <ShareEditorialPick path={path} title={kSeoulEvenings.title + ' · KULT'} />}
        </div>
        {places.length ? <div className={styles.grid}>
          {places.map(({ id, cafe, area, reason, reasonEn }, index) =>
            <EditorialPlaceCard key={id} cafe={cafe} area={area} index={index} reason={reason}
              reasonEn={reasonEn} allowSave />)}
        </div> : <p className={styles.fineprint}>지금 이 목록에 표시할 장소가 없어요.</p>}
        <p className={styles.fineprint}>장소마다 동네가 달라요. 출발 전에 지도에서 최신 영업 정보를 확인해 주세요.</p>
      </section>
    </div>
  </div>;
}
