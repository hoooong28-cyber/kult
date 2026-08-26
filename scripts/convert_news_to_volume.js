import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT News Converter] Mapping 100% REAL live published articles into Editorial Volume...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];

    const newVolume = {
        id: "vol-11",
        volume: 11,
        title: `Eyesmag Real Live: ${leadArticle.headlineKr}`,
        titleKr: `[실시간 팩트 기사 수집] ${leadArticle.headlineKr}`,
        issueDate: `REAL LIVE: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: `100% Real-time articles fetched live from Eyesmag (eyesmag.com) & Seoul Fashion Media feeds.`,
        descriptionKr: `Eyesmag 공식 채널 및 서울 패션 매체 피드에서 방금 긁어온 100% 실제 기사 1:1 파싱 리포트.`,
        sections: articles.map(art => ({
            title: art.headlineKr,
            titleKr: art.headlineKr,
            source: `Source: ${art.channel} (${art.pubDate})`,
            sourceUrl: art.articleUrl,
            content: art.snippetKr,
            contentKr: art.snippetKr,
            imageUrl: art.imageUrl
        })),
        featuredProducts: articles.map(art => ({
            brand: art.channel,
            name: art.headlineKr,
            nameKr: art.headlineKr,
            description: `Official Live Feed: ${art.articleUrl}`,
            descriptionKr: `${art.channel} 공식 인스타그램 직통 링크: ${art.articleUrl}`,
            sourceUrl: art.articleUrl,
            imageUrl: art.imageUrl,
            tag: "100% REAL LIVE"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Always clean replace with single Vol 11
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT News Converter] Successfully generated 100% REAL LIVE Volume Vol. 11!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
