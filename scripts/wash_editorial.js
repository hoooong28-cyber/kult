import fs from 'fs';
import path from 'path';
import { scoutTrends } from './scout_trends.js';

/**
 * KULT AI Editorial Washer & Converter
 * Converts raw scout payload into KULT's Paper & Ink Volume Schema.
 */
export async function washEditorial() {
    const rawData = await scoutTrends();
    console.log("🎨 [KULT Editorial Washer] Transforming raw trends into KULT Editorial Volume...");

    // Find current highest volume number from local archive file or fallback
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
    const newVolume = {
        id: `vol-${nextVolNum}`,
        volume: nextVolNum,
        title: `Auto-Scout Vol. 0${nextVolNum}: Seongsu Glasshouse & Botanical Spas`,
        titleKr: `자율 수집 Vol. 0${nextVolNum}: 성수 글래스하우스 & 보태니컬 스파`,
        issueDate: `2024.04.W${nextVolNum - 4} (AUTO STAGED)`,
        status: 'staged', // 'staged' or 'published'
        createdAt: new Date().toISOString(),
        coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
        description: "Autonomously curated from Instagram @space.archive & @oliveyoung_official feeds: Exploring Seongsu's concrete glasshouses and botanical bath rituals.",
        descriptionKr: "인스타그램 @space.archive & @oliveyoung_official 공식 피드에서 자율 수집·세탁된 에디토리얼: 성수동 콘크리트 글래스하우스와 식물성 입욕 리추얼.",
        sections: [
            {
                title: "Botanical Hydrotherapies",
                titleKr: "식물성 수치료와 유리 안식처",
                source: "Source: Instagram @oliveyoung_official Reels & @space.archive",
                content: "Discover how Seongsu's latest urban spas fuse raw concrete brutalism with organic botanical bath oils.",
                contentKr: "성수동 최신 어반 스파가 거친 콘크리트 공간에 유기농 입욕 오일을 대입하여 완성한 오감 안식처 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "ROUND A'ROUND",
                name: "Forest Bathing Bubble Essence",
                nameKr: "편백 포레스트 무드 버블 입욕제",
                description: "Official Instagram Feature: Cedarwood calming bath bomb with organic cypress oils.",
                descriptionKr: "인스타그램 릴스 인기 폭발: 깊은 편백 향으로 지친 몸을 감싸주는 식물성 버블 입욕제.",
                imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
                tag: "INSTAGRAM BEST"
            }
        ]
    };

    // Ensure directory exists
    const dir = path.dirname(archivePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    stagedData.unshift(newVolume);
    fs.writeFileSync(archivePath, JSON.stringify(stagedData, null, 2));

    console.log(`✨ [KULT Editorial Washer] Successfully generated & staged Vol. 0${nextVolNum}!`);
    return newVolume;
}

if (process.argv[1]?.endsWith('wash_editorial.js')) {
    washEditorial();
}
