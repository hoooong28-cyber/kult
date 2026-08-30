import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

/**
 * KULT Editorial Volume Converter (KULT Brand Identity Edition)
 * Maps live trend headlines to KULT's signature Brutalist editorial schema with unique topic-matched visuals.
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT Editorial Converter] Generating KULT signature volume with unique topic-matched visuals...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];
    const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    const newVolume = {
        id: "vol-21",
        volume: 21,
        title: `KULT Editorial: ${leadArticle.headlineKr}`,
        titleKr: `[KULT 시그니처 팩트 리포트] ${leadArticle.headlineKr}`,
        issueDate: `KULT EDITORIAL ISSUE: ${todayStr}`,
        status: 'staged',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: leadArticle.imageUrl,
        description: `KULT signature trend radar curated live with 100% verified 1:1 direct article permalinks and topic-matched visuals.`,
        descriptionKr: `KULT 독자 파이프라인으로 엄선된 서울 패션, 럭셔리 스페이스, 트렌드 이슈 1:1 파싱 팩트 리포트.`,
        sections: articles.map(art => ({
            title: art.headlineKr,
            titleKr: art.headlineKr,
            source: art.channel,
            sourceUrl: art.verifiedUrl,
            content: art.snippetKr,
            contentKr: art.snippetKr,
            imageUrl: art.imageUrl
        })),
        featuredProducts: articles.map(art => ({
            brand: "KULT CURATED",
            name: art.headlineKr,
            nameKr: art.headlineKr,
            description: `Official Verified Article Permalink: ${art.verifiedUrl}`,
            descriptionKr: `KULT 팩트 검증 1:1 직통 원문 딥링크: ${art.verifiedUrl}`,
            sourceUrl: art.verifiedUrl,
            imageUrl: art.imageUrl,
            tag: "KULT EXCLUSIVE"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Save Vol 21 into staged_volumes.json
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT Editorial Converter] Successfully generated KULT Vol. 21!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
