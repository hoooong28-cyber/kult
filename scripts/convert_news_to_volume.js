import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

/**
 * KULT News-to-Volume Converter (Individual Article Direct Link Edition)
 * Converts live published headlines into Volume 16 with exact 1:1 individual article permalink URLs.
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT News Converter] Mapping live published headlines to 1:1 individual article direct links...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];

    const newVolume = {
        id: "vol-16",
        volume: 16,
        title: `Direct Article Permalinks: ${leadArticle.headlineKr}`,
        titleKr: `[1:1 개별 기사 직통 연결] ${leadArticle.headlineKr}`,
        issueDate: `ARTICLE PERMALINK: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: `100% Direct individual article permalinks for every headline. Ready for Meta Graph API integration.`,
        descriptionKr: `각 기사 제목마다 해당 팩트 보도 개별 기사 원문 직통 딥링크 1:1 파싱 탑재. (조만간 Meta API 토큰 연동 예정).`,
        sections: articles.map(art => ({
            title: art.headlineKr,
            titleKr: art.headlineKr,
            source: `Source: ${art.channel} (${art.pubDate})`,
            sourceUrl: art.verifiedUrl,
            content: art.snippetKr,
            contentKr: art.snippetKr,
            imageUrl: art.imageUrl
        })),
        featuredProducts: articles.map(art => ({
            brand: art.channel,
            name: art.headlineKr,
            nameKr: art.headlineKr,
            description: `Official Article Permalink: ${art.verifiedUrl}`,
            descriptionKr: `${art.channel} 개별 기사 원문 직통 딥링크: ${art.verifiedUrl}`,
            sourceUrl: art.verifiedUrl,
            imageUrl: art.imageUrl,
            tag: "ARTICLE DIRECT"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Always clean replace with single Vol 16
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT News Converter] Successfully generated Vol. 16 with 1:1 individual article permalink URLs!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
