async function findApiInJs() {
    const url = 'https://www.eyesmag.com/posts/157947/vacheron-constantin-exhibition';
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
    });
    const html = await res.text();
    const jsFiles = [...html.matchAll(/src=["']([^"']+\.js[^"']*)["']/g)].map(m => m[1]);
    console.log(`Found ${jsFiles.length} JS files:`);
    
    for (const js of jsFiles.slice(0, 5)) {
        let fullUrl = js.startsWith('http') ? js : `https://www.eyesmag.com${js}`;
        try {
            console.log(`Searching in ${fullUrl}...`);
            const r = await fetch(fullUrl);
            const text = await r.text();
            const apiMatches = [...text.matchAll(/https?:\/\/[a-zA-Z0-9.-]+\/api\/[a-zA-Z0-9_\-\/]+/g)].map(m => m[0]);
            if (apiMatches.length > 0) {
                console.log(`  Found API URLs:`, [...new Set(apiMatches)]);
            }
        } catch (e) {}
    }
}

findApiInJs();
