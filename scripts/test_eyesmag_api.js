async function testEyesmagApi() {
    const articleId = '157947';
    const urls = [
        `https://www.eyesmag.com/api/posts/${articleId}`,
        `https://www.eyesmag.com/api/v1/posts/${articleId}`,
        `https://cdn.eyesmag.com/posts/${articleId}.json`
    ];

    for (const u of urls) {
        try {
            console.log(`🔍 Testing API: ${u}`);
            const res = await fetch(u, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                const text = await res.text();
                console.log(`Response length: ${text.length}`);
                console.log(`Preview: ${text.substring(0, 300)}`);
            }
        } catch (e) {
            console.log(`Failed ${u}: ${e.message}`);
        }
    }
}

testEyesmagApi();
