import fs from 'fs';
import path from 'path';

/**
 * KULT Live News Extractor (Clean & Honest Pipeline)
 * Fetches actual live news articles from public RSS feeds.
 * Guarantees 1:1 alignment between news headline, snippet, and article URL.
 */
export async function fetchLiveNews() {
    console.log("🌐 [KULT Real News Fetcher] Querying live public news RSS feeds...");

    const newsQueries = [
        { topic: 'K-Beauty & Olive Young', query: 'Olive+Young+K-beauty+Seoul', category: 'K-BEAUTY' },
        { topic: 'Seoul Fashion & Flagships', query: 'Seoul+fashion+flagship+store', category: 'FASHION' },
        { topic: 'Seoul Architecture & Cafes', query: 'Seoul+architecture+cafe+Seongsu', category: 'SPATIAL' }
    ];

    const fetchedArticles = [];

    for (const q of newsQueries) {
        try {
            const feedUrl = `https://news.google.com/rss/search?q=${q.query}&hl=en-US&gl=US&ceid=US:en`;
            const response = await fetch(feedUrl);
            const xmlText = await response.text();

            // Extract item blocks
            const itemBlocks = xmlText.split('<item>').slice(1, 4); // Take top 3 articles

            for (const block of itemBlocks) {
                const titleMatch = block.match(/<title>(.*?)<\/title>/);
                const linkMatch = block.match(/<link>(.*?)<\/link>/);
                const dateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);
                const sourceMatch = block.match(/<source[^>]*>(.*?)<\/source>/);

                if (titleMatch && linkMatch) {
                    const rawTitle = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
                    const rawLink = linkMatch[1].trim();
                    const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toUTCString();
                    const publisher = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : 'Live Press';

                    // Parse clean publisher name and clean title
                    const parts = rawTitle.split(' - ');
                    const mainTitle = parts[0] || rawTitle;
                    const pubName = parts[1] || publisher;

                    fetchedArticles.push({
                        id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                        category: q.category,
                        headlineEn: mainTitle,
                        headlineKr: `[실시간 뉴스] ${mainTitle}`,
                        publisher: pubName,
                        articleUrl: rawLink,
                        pubDate: pubDate,
                        snippetEn: `Live news report by ${pubName} regarding ${mainTitle}. Published on ${pubDate}.`,
                        snippetKr: `${pubName}에서 제공하는 실시간 속보: ${mainTitle} (${pubDate} 발행).`
                    });
                }
            }
        } catch (err) {
            console.error(`⚠️ Error fetching news for query ${q.query}:`, err.message);
        }
    }

    console.log(`✅ [KULT Real News Fetcher] Successfully extracted ${fetchedArticles.length} live articles.`);

    const payload = {
        timestamp: new Date().toISOString(),
        totalArticles: fetchedArticles.length,
        articles: fetchedArticles
    };

    const outputPath = path.join(process.cwd(), 'tmp_live_news.json');
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
    return payload;
}

if (process.argv[1]?.endsWith('fetch_live_news.js')) {
    fetchLiveNews();
}
