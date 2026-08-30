async function inspectPage(url) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });
        const html = await res.text();
        console.log(`Length of HTML: ${html.length}`);
        
        // Find meta tags
        const metas = html.match(/<meta[^>]+>/gi) || [];
        console.log(`--- Meta tags (${metas.length}) ---`);
        metas.forEach(m => {
            if (m.includes('image') || m.includes('og:') || m.includes('twitter:')) {
                console.log(m);
            }
        });

        // Find img tags
        const imgs = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
        console.log(`--- Img tags (${imgs.length}) ---`);
        imgs.slice(0, 10).forEach(i => console.log(i));

    } catch (e) {
        console.error("Error:", e);
    }
}

inspectPage('https://www.eyesmag.com/posts/157947/vacheron-constantin-exhibition');
