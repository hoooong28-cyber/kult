import fs from 'fs';
import path from 'path';
import https from 'https';

const fetchUrl = (url, headers = {}) => {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                ...headers
            }
        };
        https.get(options, (res) => {
            resolve(res);
        }).on('error', reject);
    });
};

const downloadImage = async (url, filepath) => {
    const res = await fetchUrl(url, {
        'Referer': 'https://search.naver.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    });
    
    if (res.statusCode === 200) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', reject);
        });
    } else {
        throw new Error(`Failed to download image. Status: ${res.statusCode}`);
    }
};

const searchAndDownload = async (query, filename) => {
    try {
        const searchUrl = `https://search.naver.com/search.naver?where=image&query=${encodeURIComponent(query)}`;
        const resHtml = await fetchUrl(searchUrl);
        
        let html = '';
        await new Promise((resolve) => {
            resHtml.on('data', chunk => html += chunk);
            resHtml.on('end', resolve);
        });

        // Regex to match search.pstatic.net URLs, allowing word characters, symbols, and backslashes (json-escaped)
        const regex = /https:\/\/search\.pstatic\.net\/common\/[^"'\s>]+/g;
        const matches = html.match(regex) || [];
        
        // Filter out profile images and thumbnails
        const validImages = matches.filter(url => {
            const lower = url.toLowerCase();
            return !lower.includes('profileimage') && 
                   !lower.includes('blogpfthumb') && 
                   !lower.includes('type=f80_80') && 
                   !lower.includes('avatar');
        });
        
        if (validImages && validImages.length > 0) {
            // Unescape Unicode escapes like \u0026
            let imageUrl = validImages[0];
            imageUrl = imageUrl.replace(/\\u0026/gi, '&')
                               .replace(/\\u003d/gi, '=')
                               .replace(/\\u002f/gi, '/')
                               .replace(/\\/g, ''); // strip remaining backslashes
            
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            }

            // Remove any trailing backslash/quote residues if they exist
            imageUrl = imageUrl.split('"')[0].split("'")[0];

            const targetPath = path.join('/Users/hoo__oong/Desktop/kult/public', filename);
            console.log(`Downloading real image for "${query}" from: ${imageUrl}`);
            await downloadImage(imageUrl, targetPath);
            console.log(`Saved as: ${targetPath}`);
            return true;
        } else {
            console.log(`No valid large images found for query: ${query}`);
            return false;
        }
    } catch (err) {
        console.error(`Error processing query "${query}":`, err.message);
        return false;
    }
};

const run = async () => {
    const list = [
        { query: '어니언 성수 카페 외관', filename: 'cafe_onion_seongsu.png' },
        { query: '탬버린즈 성수 플래그십 스토어', filename: 'tamburins_seongsu.png' },
        { query: '성수동 LCDC 서울', filename: 'lcdc_seoul.png' },
        { query: '오프레 서울 성수동 서점', filename: 'ofr_seoul.png' },
        { query: '성수동 감성 편집숍 공간', filename: 'seongsu_boutique_hero.png' }
    ];
    
    for (const item of list) {
        await searchAndDownload(item.query, item.filename);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('All real images downloaded successfully!');
};

run();
