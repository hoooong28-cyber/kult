import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';

export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT News Converter] Mapping @eyesmag & @dailyfashion_news 1:1 into Editorial Volume...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    const newVolume = {
        id: "vol-10",
        volume: 10,
        title: "Eyesmag & Daily Fashion News Live Radar",
        titleKr: "아이즈매거진(@eyesmag) & 데일리 패션 뉴스(@dailyfashion_news) 실시간 속보",
        issueDate: `LIVE INSTAGRAM MEDIA: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        isTargetChannelData: true,
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: "Curated directly from @eyesmag & @dailyfashion_news official Instagram channels with 1:1 working direct URLs.",
        descriptionKr: "아이즈매거진(@eyesmag) 및 데일리 패션 뉴스(@dailyfashion_news) 공식 인스타그램 1:1 직접 파싱 리포트.",
        sections: articles.map(art => ({
            title: art.headlineEn,
            titleKr: art.headlineKr,
            source: `Source: ${art.channelName} (${art.handle})`,
            sourceUrl: art.profileUrl,
            content: art.snippetEn,
            contentKr: art.snippetKr,
            imageUrl: art.imageUrl
        })),
        featuredProducts: articles.map(art => ({
            brand: art.channelName,
            name: art.headlineEn,
            nameKr: art.headlineKr,
            description: `Official Instagram Feed: ${art.profileUrl}`,
            descriptionKr: `${art.channelName} 공식 인스타그램 1:1 직통 딥링크: ${art.profileUrl}`,
            sourceUrl: art.profileUrl,
            imageUrl: art.imageUrl,
            tag: art.tag
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Always clean replace with single Vol 10
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT News Converter] Successfully generated 1:1 matched Vol. 10 from @eyesmag & @dailyfashion_news!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
