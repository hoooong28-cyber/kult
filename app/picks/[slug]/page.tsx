import Link from 'next/link';
import { getVenuePhoto } from '@/lib/venuePhotos';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';
import { getMergedCafes } from '@/lib/curators';
import { pickCopy, purposePicks, pickPurposes, picks, resolveEditorialPick, resolvePickPurpose } from '@/lib/editorialPicks';
import EditorialPlaceCard from '@/components/EditorialPlaceCard';
import ShareEditorialPick from '@/components/ShareEditorialPick';
import styles from './picks.module.css';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ purpose?: string | string[] }> };
export function generateStaticParams() { return picks.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const item = picks.find(item => item.slug === slug);
  if (!item) return { title: 'KULT' };
  const purpose = resolvePickPurpose(query.purpose);
  const title = [item.area, purpose?.label, 'KULT'].filter(Boolean).join(' · ');
  const description = '주소와 추천 이유를 보고 약속 장소를 정해 보세요.';
  return { title, description, openGraph: { title, description } };
}

export default async function EditorialPickPage({ params, searchParams }: Props) {
  const [{ slug }, query, catalog] = await Promise.all([params, searchParams, getMergedCafes({ resolveMapCoordinates: false })]);
  const pick = resolveEditorialPick(slug, catalog);
  if (!pick) notFound();
  const purpose = resolvePickPurpose(query.purpose);
  const base = '/picks/' + pick.slug;
  const selectedPath = base + (purpose ? '?purpose=' + purpose.id : '');
  const places = purposePicks(pick.places, purpose?.id);
  const photoIndex = places.findIndex(place => getVenuePhoto(place.cafe));
  const number = String(picks.findIndex(row => row.slug === pick.slug) + 1).padStart(2, '0');

  return <div lang="ko" className={styles.paper}>
    <Header section="picks" />
    <div className={styles.wrap}>
      <header className={styles.intro}>
        <p className={styles.eyebrow} lang="en">THE MEETUP GUIDE <span> / </span> {pick.area_en} <span> / </span> VOL. {number}</p>
        <h1>{pick.area}에서<br/> 보내는 시간<span>.</span></h1>
        <p className={styles.dek}>약속에 맞는 장소를 골라 친구에게 보내요.</p>
        {purpose && <Link href={'/picks/area?purpose=' + purpose.id} className={styles.back}>← 다른 동네 고르기</Link>}
      </header>

      <section aria-label="약속 목적" className={styles.purposeBar}>
        <p className={styles.prompt}>방문 목적<span lang="en">THE OCCASION</span></p>
        <div className={styles.options}>
          {pickPurposes.map(item => <Link className={styles.option} key={item.id}
            href={base + '?purpose=' + item.id} aria-current={item.id === purpose?.id ? 'true' : undefined}>
            {item.label}<span lang="en">{item.english}</span>
          </Link>)}
          {purpose && <Link href={base} className={styles.reset}>전체 보기</Link>}
        </div>
      </section>

      <section aria-labelledby="results-title" className={styles.results}>
        <div className={styles.sectionHead}>
          <div>
            <p lang="en">THE SHORTLIST</p>
            <h2 id="results-title">{purpose?.heading ?? '이 동네에서 가볼 곳'}</h2>
          </div>
          <div className={styles.resultsMeta}>
            {places.length > 0 && <ShareEditorialPick key={selectedPath} path={selectedPath} title={pick.area + ' · ' + (purpose?.label ?? '약속 장소') + ' · KULT'} />}
          </div>
        </div>
        {places.length === 0 ? <div className={styles.empty}>
          <div className={styles.stamp} aria-hidden="true">K / {number}</div>
          <h3>{purpose ? '아직 이 목적에 맞는 곳이 없어요.' : '아직 이 동네에 등록된 곳이 없어요.'}</h3>
          <p>다른 목적을 골라보거나 다른 동네를 둘러보세요.</p>
          <Link href={purpose ? '/picks/area?purpose=' + purpose.id : '/discoveries#pick-two'}>다른 동네 고르기 ↗</Link>
        </div> : <div className={styles.grid}>
          {places.map((place, index) => <EditorialPlaceCard key={place.cafe.id} cafe={place.cafe} area={pick.area}
            index={index} eagerPhoto={index === photoIndex} reason={pickCopy(place, purpose?.id).ko} reasonEn={pickCopy(place, purpose?.id).en} />)}
        </div>}
        {places.length > 0 && <p className={styles.fineprint}>{pick.source === 'discovery' ? '외부 소개를 바탕으로 고른 후보예요.' : pick.source === 'mixed' ? 'KULT 큐레이션과 확인한 외부 소개를 함께 담았어요.' : '기존 큐레이션에서 고른 장소예요.'} 출발 전에 지도에서 영업시간을 확인해 주세요.</p>}
      </section>
    </div>
  </div>;
}
