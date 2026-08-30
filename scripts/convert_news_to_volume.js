import fs from 'fs';
import path from 'path';
import { fetchLiveNews } from './fetch_live_news.js';
import { generateKultColumn } from './wash_editorial.js';

/**
 * KULT Rich Editorial Volume Converter (Full Column Writing Edition)
 * Transforms raw 1-line news items into full 3-paragraph KULT Brutalist Editorial Columns with topic-matched visuals.
 */
export async function convertNewsToVolume() {
    const newsPayload = await fetchLiveNews();
    console.log("🎨 [KULT Column Generator] Writing rich multi-paragraph editorial columns for each article...");

    const archivePath = path.join(process.cwd(), 'src/data/staged_volumes.json');
    const articles = newsPayload.articles;

    if (articles.length === 0) {
        console.error("⚠️ No real live articles found.");
        return null;
    }

    const leadArticle = articles[0];
    const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    // Transform every raw article into a full KULT Editorial Column
    const transformedSections = articles.map(art => {
        const columnData = generateKultColumn(art.headlineKr, art.snippetKr, art.channel);
        return {
            title: columnData.titleKr,
            titleKr: columnData.titleKr,
            source: art.channel,
            sourceUrl: art.verifiedUrl,
            content: columnData.columnBodyKr,
            contentKr: columnData.columnBodyKr,
            editorQuoteKr: columnData.editorQuoteKr,
            imageUrl: columnData.imageUrl || art.imageUrl
        };
    });

    const leadColumn = transformedSections[0];

    const newVolume = {
        id: "vol-22",
        volume: 22,
        title: `KULT BRUTALIST COLUMNS: ${leadArticle.headlineKr}`,
        titleKr: `[KULT 심층 칼럼] ${leadArticle.headlineKr}`,
        issueDate: `KULT EDITORIAL COLUMNS: ${todayStr}`,
        status: 'published',
        is100PercentRealLive: true,
        createdAt: new Date().toISOString(),
        coverImage: leadColumn.imageUrl,
        description: `Full multi-paragraph KULT Brutalist Editorial Columns with in-depth cultural analysis, Chief Editor takeaways, and direct verified links.`,
        descriptionKr: `단순 요약을 넘어 KULT 에디토리얼 팀이 심층 집필한 3단락 전문 트렌드 칼럼 & 총괄 에디터 인사이트 코멘트 리포트.`,
        sections: transformedSections,
        featuredProducts: transformedSections.map(sec => ({
            brand: "KULT EDITORIAL ATELIER",
            name: sec.titleKr,
            nameKr: sec.titleKr,
            description: `Official Verified Article Permalink: ${sec.sourceUrl}`,
            descriptionKr: `KULT 팩트 검증 1:1 직통 원문 딥링크: ${sec.sourceUrl}`,
            sourceUrl: sec.sourceUrl,
            imageUrl: sec.imageUrl,
            tag: "FULL COLUMN"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Save Vol 22 into staged_volumes.json
    fs.writeFileSync(archivePath, JSON.stringify([newVolume], null, 2));

    console.log(`✨ [KULT Column Generator] Successfully generated Vol. 22 with full rich multi-paragraph editorial columns!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('convert_news_to_volume.js')) {
    convertNewsToVolume();
}
