import https from 'node:https';

// Keep the public-list reader on HTTP/1.1. The upstream currently returns empty
// 500 responses to Node's fetch transport in our integration checks.
export function createNaverRequest(trace: (line: string) => void = () => {}): typeof fetch {
  return async (input, init) => {
  const url = new URL(String(input));
  if (url.protocol !== 'https:' || url.port || url.username || url.password ||
      !['naver.me', 'pages.map.naver.com'].includes(url.hostname)) throw new Error('Unsupported upstream');
  return new Promise<Response>((resolve, reject) => {
    const scope = url.hostname === 'naver.me' ? 'link' : url.searchParams.get('limit') === '5000' ? 'overview' : url.searchParams.get('start') === '0' ? 'page1' : url.searchParams.get('start') === '20' ? 'page2' : 'later-page';
    const started = Date.now();
    let phase = 'start';
    const record = (value: string) => trace(scope + ' ' + value + ' (' + (Date.now() - started) + 'ms)');
    const errorCode = (e: Error) => {
      const c = (e as NodeJS.ErrnoException).code;
      return typeof c === 'string' && /^[A-Z0-9_]{1,35}$/.test(c) ? c : 'OTHER';
    };
    const request = https.get(url, {
      signal: init?.signal || undefined,
      headers: { 'User-Agent': 'KULT/1.0 (public shared-list import)', 'Accept': 'application/json' },
    }, response => {
      phase = 'headers';
      record('HTTP ' + response.statusCode);
      const chunks: Buffer[] = [];
      let size = 0;
      response.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > 2_000_000) { response.destroy(new Error('Response too large')); return; }
        chunks.push(chunk);
      });
      response.on('error', (e: Error) => { record('body ' + errorCode(e)); reject(e); });
      response.on('end', () => {
        record('body ' + size + 'B');
        const status = response.statusCode || 502;
        if (status >= 300 && status < 400 && init?.redirect === 'error') { reject(new Error('Unexpected redirect')); return; }
        const headers = new Headers();
        if (response.headers.location) headers.set('location', response.headers.location);
        resolve(new Response([204, 205, 304].includes(status) ? null : Buffer.concat(chunks).toString('utf8'), {status, headers}));
      });
    });
    request.on('socket', socket => {
      phase = socket.connecting ? 'socket' : 'reused';
      socket.once('lookup', error => { phase = error ? 'dns-failed' : 'dns'; });
      socket.once('connect', () => { phase = 'tcp'; });
      socket.once('secureConnect', () => { phase = 'tls'; });
    });
    request.on('error', (e: Error) => { record(phase + ' ' + errorCode(e)); reject(e); });
  });
  };
}
export const naverRequest = createNaverRequest();
