async function inspectPageProps() {
    const url = 'https://www.eyesmag.com/posts/157947/vacheron-constantin-exhibition';
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
        if (nextDataMatch && nextDataMatch[1]) {
            const json = JSON.parse(nextDataMatch[1]);
            console.log("Keys in pageProps:", Object.keys(json.props?.pageProps || {}));
            console.log("Full pageProps:", JSON.stringify(json.props?.pageProps, null, 2).substring(0, 1500));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

inspectPageProps();
