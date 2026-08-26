import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

/**
 * KULT News-to-Volume Converter (Instagram Direct Edition)
 * Converts real published headlines into KULT Volume with direct Instagram channel URLs.
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT News Converter] Mapping live published headlines to direct Instagram URLs...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];

    const newVolume = {
        id: "vol-13",
        volume: 13,
        title: `Instagram Live Radar: ${leadArticle.headlineKr}`,
        titleKr: `[인스타그램 1:1 직통] ${leadArticle.headlineKr}`,
        issueDate: `INSTAGRAM DIRECT: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: `Real-time published headlines from @eyesmag & @dailyfashion_news mapped to direct Instagram profile channels.`,
        descriptionKr: `아이즈매거진(@eyesmag) & 데일리 패션 뉴스(@dailyfashion_news) 실시간 파싱: 인스타그램 공식 피드 1:1 직통 연결.`,
        sections: articles.map(art => ({
            title: art.headlineKr,
            titleKr: art.headlineKr,
            source: `Source: ${art.channel} (${art.pubDate})`,
            sourceUrl: art.instagramUrl,
            content: art.snippetKr,
            contentKr: art.snippetKr,
            imageUrl: art.imageUrl
        })),
        featuredProducts: articles.map(art => ({
            brand: art.channel,
            name: art.headlineKr,
            nameKr: art.headlineKr,
            description: `Official Instagram Feed: ${art.instagramUrl}`,
            descriptionKr: `${art.channel} 공식 인스타그램 직통 딥링크: ${art.instagramUrl}`,
            sourceUrl: art.instagramUrl,
            imageUrl: art.imageUrl,
            tag: "INSTAGRAM DIRECT"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Always clean replace with single Vol 13
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT News Converter] Successfully generated Vol. 13 with direct Instagram URLs!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
