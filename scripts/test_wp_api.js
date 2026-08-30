async function testWpApi() {
    const urls = [
        "https://www.eyesmag.com/wp-json/wp/v2/posts/157947",
        "https://www.eyesmag.com/wp-json/wp/v2/posts?slug=vacheron-constantin-exhibition",
        "https://www.eyesmag.com/wp-json/wp/v2/posts?search=vacheron"
    ];

    for (const u of urls) {
        try {
            console.log(`🔍 Fetching WP API: ${u}`);
            const res = await fetch(u, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                const data = await res.json();
                console.log(`✅ WP API SUCCESS! Keys:`, Array.isArray(data) ? `Array length ${data.length}` : Object.keys(data));
                const jsonStr = JSON.stringify(data);
                const imgMatches = [...jsonStr.matchAll(/https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]);
                console.log(`Found ${imgMatches.length} images:`, [...new Set(imgMatches)].slice(0, 10));
            }
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

testWpApi();
