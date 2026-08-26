import fs from 'fs';
import path from 'path';
import { scoutTrends } from './scout_trends.js';

export async function washEditorial() {
    const rawData = await scoutTrends();
    console.log("🎨 [KULT Editorial Washer] Transforming clean working live items into KULT Editorial Volume...");

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
    const items = rawData.liveItems;
    const mainItem = items[0];

    const newVolume = {
        id: `vol-${nextVolNum}`,
        volume: nextVolNum,
        title: mainItem.titleEn,
        titleKr: mainItem.titleKr,
        issueDate: `LIVE: ${new Date().toLocaleDateString('ko-KR')}`,
        status: 'staged',
        isDirectCleanData: true,
        createdAt: new Date().toISOString(),
        coverImage: mainItem.imageUrl,
        description: "Curated directly from verified live product stores & official Instagram feeds with 100% working direct URLs.",
        descriptionKr: "올리브영 공식 온라인몰 및 인스타그램 공식 피드의 100% 정상 접속 가능한 원본 딥링크 기반 실시간 리포트.",
        sections: items.map(item => ({
            title: item.titleEn,
            titleKr: item.titleKr,
            source: item.source,
            sourceUrl: item.sourceUrl,
            content: `Verified Live Item: ${item.titleEn}. Click link below to view official live store product page.`,
            contentKr: item.summaryKr,
            imageUrl: item.imageUrl
        })),
        featuredProducts: items.map(item => ({
            brand: item.category,
            name: item.titleEn.split(':')[1] || item.titleEn,
            nameKr: item.titleKr.split(':')[1] || item.titleKr,
            description: `Verified Direct URL: ${item.sourceUrl}`,
            descriptionKr: `실제 접속 가능한 구매/공식 인스타 딥링크: ${item.sourceUrl}`,
            sourceUrl: item.sourceUrl,
            imageUrl: item.imageUrl,
            tag: "LIVE VERIFIED"
        }))
    };

    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    stagedData.unshift(newVolume);
    fs.writeFileSync(archivePath, JSON.stringify(stagedData, null, 2));

    console.log(`✨ [KULT Editorial Washer] Successfully generated & staged LIVE Vol. 0${nextVolNum} with clean working URLs!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('wash_editorial.js')) {
    washEditorial();
}
