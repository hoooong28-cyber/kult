import https from 'node:https';

// Keep the public-list reader on HTTP/1.1. The upstream currently returns empty
// 500 responses to Node's fetch transport in our integration checks.
export const naverRequest: typeof fetch = async (input, init) => {
  const url = new URL(String(input));
  if (url.protocol !== 'https:' || url.port || url.username || url.password ||
      !['naver.me', 'pages.map.naver.com'].includes(url.hostname)) throw new Error('Unsupported upstream');
  return new Promise<Response>((resolve, reject) => {
    const request = https.get(url, {
      signal: init?.signal || undefined,
      headers: { 'User-Agent': 'KULT/1.0 (public shared-list import)', 'Accept': 'application/json' },
    }, response => {
      const chunks: Buffer[] = [];
      let size = 0;
      response.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > 2_000_000) { response.destroy(new Error('Response too large')); return; }
        chunks.push(chunk);
      });
      response.on('error', reject);
      response.on('end', () => {
        const status = response.statusCode || 502;
        if (status >= 300 && status < 400 && init?.redirect === 'error') { reject(new Error('Unexpected redirect')); return; }
        const headers = new Headers();
        if (response.headers.location) headers.set('location', response.headers.location);
        resolve(new Response([204, 205, 304].includes(status) ? null : Buffer.concat(chunks).toString('utf8'), {status, headers}));
      });
    });
    request.on('error', reject);
  });
};
