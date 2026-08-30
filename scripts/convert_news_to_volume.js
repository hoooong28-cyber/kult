import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';
import { generateKultColumn } from './wash_editorial.js';

/**
 * KULT Single Daily Brand Column Converter Engine
 * Operational Rule: 1 Daily Scout = Exactly 1 High-Impact Brand Editorial Column per Day (Vol. 1).
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT Daily Converter] Compiling EXACTLY 1 Daily Brand Editorial Column...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    // Pick EXACTLY 1 Top Lead Brand Article for Today
    const leadArticle = articles[0];
    const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    const columnData = generateKultColumn(leadArticle.headlineKr, leadArticle.snippetKr, leadArticle.channel);

    const singleDailySection = {
        title: columnData.titleKr,
        titleKr: columnData.titleKr,
        source: leadArticle.channel,
        sourceUrl: leadArticle.verifiedUrl,
        content: columnData.columnBodyKr,
        contentKr: columnData.columnBodyKr,
        editorQuoteKr: columnData.editorQuoteKr,
        imageUrl: columnData.imageUrl || leadArticle.imageUrl
    };

    const newVolume = {
        id: "vol-1",
        volume: 1,
        title: `KULT DAILY BRAND: ${leadArticle.headlineKr}`,
        titleKr: `[KULT 1일 1브랜드 칼럼] ${leadArticle.headlineKr}`,
        issueDate: `DAILY BRAND ISSUE: ${todayStr}`,
        status: 'published',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: singleDailySection.imageUrl,
        description: `Daily 1-Brand Exclusive Column: In-depth heritage watchmaking, spatial experience guide, and verified direct links for global visitors.`,
        descriptionKr: `하루 딱 1개의 독보적 브랜드 심층 집필: 270년 스위스 장인정신과 서울 공간 체험 가이드가 담긴 KULT 시그니처 1일 1칼럼.`,
        sections: [singleDailySection],
        featuredProducts: [
            {
                brand: "VACHERON CONSTANTIN SEOUL",
                name: singleDailySection.titleKr,
                nameKr: singleDailySection.titleKr,
                description: `Official Direct Link: ${singleDailySection.sourceUrl}`,
                descriptionKr: `KULT 팩트 검증 1:1 직통 딥링크: ${singleDailySection.sourceUrl}`,
                sourceUrl: singleDailySection.sourceUrl,
                imageUrl: singleDailySection.imageUrl,
                tag: "DAILY BRAND"
            }
        ]
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Save EXACTLY Vol 1 into staged_volumes.json
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT Daily Converter] Successfully generated Vol. 1 with EXACTLY 1 Daily Brand Column!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
