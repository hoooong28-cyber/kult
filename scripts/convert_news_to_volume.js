import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

/**
 * KULT News-to-Volume Converter
 * Takes real fetched news items and converts them into a 1:1 matched KULT Volume.
 * Ensures Section N title, snippet, and link match Article N 100%.
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT News Converter] Mapping live news 1:1 into Editorial Volume...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    let stagedData = [];
    if (fs.existsSync(archivePath)) {
        try {
            stagedData = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
        } catch (e) {
            stagedData = [];
        }
    }

    const nextVolNum = 6 + stagedData.length;
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No live articles found to convert.");
        return null;
    }

    const leadArticle = articles[0];

    const newVolume = {
        id: `vol-${nextVolNum}`,
        volume: nextVolNum,
        title: `Live Trend Radar: ${leadArticle.headlineEn}`,
        titleKr: `실시간 뉴스 레이더: ${leadArticle.headlineKr}`,
        issueDate: `LIVE NEWS: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        isRealNewsMatched: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=1200",
        description: `Autonomously compiled from live press feeds (${leadArticle.publisher}). 1:1 matched news reports and verified article links.`,
        descriptionKr: `실시간 언론사 뉴스 피드(${leadArticle.publisher}) 1:1 자율 파싱: 팩트 검증 기사 원문 및 링크 1:1 매칭.`,
        sections: articles.slice(0, 3).map((art, idx) => ({
            title: art.headlineEn,
            titleKr: art.headlineKr,
            source: `Source: ${art.publisher} (${art.pubDate})`,
            sourceUrl: art.articleUrl,
            content: art.snippetEn,
            contentKr: art.snippetKr,
            imageUrl: idx === 0 
                ? "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
                : idx === 1
                    ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
                    : "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800"
        })),
        featuredProducts: articles.slice(0, 3).map(art => ({
            brand: art.publisher,
            name: art.headlineEn,
            nameKr: art.headlineKr,
            description: `Official Press Link: ${art.articleUrl}`,
            descriptionKr: `언론사 원문 기사 1:1 매칭 링크: ${art.articleUrl}`,
            sourceUrl: art.articleUrl,
            imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800",
            tag: "PRESS VERIFIED"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    stagedData.unshift(newVolume);
    fs.writeFileSync(archivePath, JSON.stringify(stagedData, null, 2));

    console.log(`✨ [KULT News Converter] Successfully generated 1:1 matched Volume Vol. 0${nextVolNum}!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
