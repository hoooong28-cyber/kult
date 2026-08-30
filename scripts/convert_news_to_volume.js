import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

/**
 * KULT Weekly Editorial Volume Converter
 * Converts real-time live published news into KULT Weekly Issue Volume 20.
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT Weekly Converter] Compiling weekly editorial volume from Eyesmag & Daily Fashion News...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];
    const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    const newVolume = {
        id: "vol-20",
        volume: 20,
        title: `KULT Weekly Issue: ${leadArticle.headlineKr}`,
        titleKr: `[주간 KULT 팩트 뉴스] ${leadArticle.headlineKr}`,
        issueDate: `WEEKLY ISSUE: ${todayStr}`,
        status: 'staged',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: `Weekly curated trend report scouted live from @eyesmag & @dailyfashion_news official channels.`,
        descriptionKr: `지난 일주일 간 아이즈매거진(@eyesmag) 및 데일리 패션 뉴스(@dailyfashion_news)에서 출간된 최신 트렌드 팩트 기사 종합 리포트.`,
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
            description: `Verified Direct Link: ${art.verifiedUrl}`,
            descriptionKr: `${art.channel} 1:1 개별 기사 직통 원문 딥링크: ${art.verifiedUrl}`,
            sourceUrl: art.verifiedUrl,
            imageUrl: art.imageUrl,
            tag: "WEEKLY ISSUE"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Save Vol 20 into staged_volumes.json
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT Weekly Converter] Successfully generated Vol. 20 Weekly Issue!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
