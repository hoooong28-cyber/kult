import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

/**
 * KULT News-to-Volume Converter (Instagram Post Permalink Edition)
 * Maps live published headlines to exact 1:1 Instagram Post permalink URLs (https://www.instagram.com/p/...).
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT News Converter] Mapping live published headlines to exact Instagram Post permalinks (https://www.instagram.com/p/...)...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];

    const newVolume = {
        id: "vol-14",
        volume: 14,
        title: `Instagram Post Permalinks: ${leadArticle.headlineKr}`,
        titleKr: `[인스타그램 게시물 1:1 직통] ${leadArticle.headlineKr}`,
        issueDate: `INSTAGRAM POST PERMALINK: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: `100% Direct Instagram post permalinks (https://www.instagram.com/p/...) for every individual article.`,
        descriptionKr: `개별 기사/포스트마다 해당 인스타그램 포스트 전용 직통 딥링크(https://www.instagram.com/p/...) 1:1 파싱 탑재.`,
        sections: articles.map(art => ({
            title: art.headlineKr,
            titleKr: art.headlineKr,
            source: `Source: ${art.channel} (${art.pubDate})`,
            sourceUrl: art.instagramPostUrl,
            content: art.snippetKr,
            contentKr: art.snippetKr,
            imageUrl: art.imageUrl
        })),
        featuredProducts: articles.map(art => ({
            brand: art.channel,
            name: art.headlineKr,
            nameKr: art.headlineKr,
            description: `Official Instagram Post: ${art.instagramPostUrl}`,
            descriptionKr: `${art.channel} 포스트 전용 직통 딥링크: ${art.instagramPostUrl}`,
            sourceUrl: art.instagramPostUrl,
            imageUrl: art.imageUrl,
            tag: "POST PERMALINK"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Always clean replace with single Vol 14
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT News Converter] Successfully generated Vol. 14 with Instagram Post permalink URLs!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
