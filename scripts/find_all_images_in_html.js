async function findImagesInHtml() {
    const url = 'https://www.eyesmag.com/posts/157947/vacheron-constantin-exhibition';
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
    });
    const html = await res.text();
    console.log(`HTML size: ${html.length}`);
    const matches = [...html.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]);
    console.log(`Found ${matches.length} total image URLs:`);
    const unique = [...new Set(matches)];
    unique.forEach(i => console.log(` - ${i}`));
}

findImagesInHtml();
