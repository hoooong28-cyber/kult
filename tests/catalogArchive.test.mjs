import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function load(file, dependencies = {}, env = { KULT_SITE_ORIGIN: 'https://kult.example', NODE_ENV: 'production' }) {
  const source = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const instance = { exports: {} };
  new Function('exports', 'module', 'require', 'process', outputText)(
    instance.exports, instance, name => {
      assert.ok(Object.hasOwn(dependencies, name), 'Unexpected dependency ' + name);
      return dependencies[name];
    }, { env });
  return instance.exports;
}

const paths = load('lib/catalogSavePaths.ts');
const origin = 'https://kult.example';
function redirect(url, options) {
  return {
    location: String(url), ...options, values: {},
    cookies: { set(name, value, opts) { this.target.values[name] = { value, opts }; } }
  };
}
const nextServer = {
  NextResponse: { json: Response.json, redirect(url, opts) {
    const result = redirect(url, opts);
    result.cookies.target = result;
    return result;
  } },
};
const flow = load('app/auth/flow.ts', { 'next/server': nextServer, '../../lib/catalogSavePaths': paths });
const place = 'lowkey-seongsu';
const path = '/cafe/' + place;
const postForm = (params, from = origin) => new Request(origin + '/auth/start', {
  method: 'POST', headers: { Origin: from }, body: new URLSearchParams(params),
});

function setup({ enabled = true, rpcError = null, exchangeError = null } = {}) {
  const calls = [];
  const rows = new Map();
  async function createClient(user = 'account-a') {
    if (!enabled) return null;
    return {
      auth: {
        signInWithOAuth: async opts => { calls.push(['start', opts]); return { data: { url: 'https://test.supabase.co/oauth' } }; },
        exchangeCodeForSession: async code => { calls.push(['exchange', code]); return { error: exchangeError }; },
        getUser: async () => ({ data: { user: user ? { id: user } : null }, error: null }),
      },
      rpc: async (name, options) => {
        calls.push([user, name, options]);
        if (rpcError) return { error: rpcError };
        const set = rows.get(user) ?? new Set();
        if (name === 'kult_catalog_saves_get') return { data: [...set] };
        if (options.p_saved) set.add(options.p_place_id);
        else set.delete(options.p_place_id);
        rows.set(user, set);
        return { data: null };
      },
    };
  }
  const dependencies = {
    'next/server': nextServer, '../flow': flow,
    '@/lib/catalogSavePaths': paths,
    '@/lib/supabase/catalogArchive': { canSaveCatalogPlace: async slug => slug === place },
    '@/lib/supabase/server': {
      createSupabaseServerClient: createClient,
      kultMemberSettings: () => enabled ? { origin } : null,
    },
  };
  function api(user) {
    return load('app/api/catalog-archive/route.ts', {
      ...dependencies, '@/lib/supabase/server': {
        ...dependencies['@/lib/supabase/server'], createSupabaseServerClient: () => createClient(user),
      },
    });
  }
  return { calls, rows, api,
    start: load('app/auth/start/route.ts', dependencies).POST,
    callback: load('app/auth/callback/route.ts', dependencies).GET,
  };
}
function callbackRequest(response, code = 'test-code', overrides = {}) {
  const url = new URL(origin + '/auth/callback');
  if (code) url.searchParams.set('code', code);
  return {
    url: String(url), nextUrl: url,
    cookies: { get: name => ({ value: overrides[name] ?? response.values[name]?.value }) },
  };
}
function postJSON(body, from = origin, type = 'application/json') {
  return new Request(origin + '/api/catalog-archive', {
    method: 'POST', headers: { Origin: from, 'Content-Type': type }, body: JSON.stringify(body),
  });
}

test('OAuth destination accepts only exact local catalog detail paths besides established fixed destinations', () => {
  assert.equal(flow.accountDestination(path), path);
  for (const value of ['//evil.example', '/cafe/Test', '/cafe/a//b', '/cafe/a?x=1', '/cafe/a#x', '/cafe/%2e%2e', '/cafe/-aa', '/cafe/a\\b', '/cafe/' + 'a'.repeat(121)])
    assert.equal(flow.accountDestination(value), '/archive', value);
});

test('explicit OAuth save returns to exact detail and writes once to the authenticated account', async () => {
  const { start, callback, calls, api } = setup();
  assert.equal((await start(postForm({ next: path, save: '1' }, 'https://other.example'))).status, 403);
  const response = await start(postForm({ next: path, save: '1' }));
  assert.equal(response.location, 'https://test.supabase.co/oauth');
  assert.equal(response.values['kult-oauth-next'].value, path);
  assert.deepEqual(response.values['kult-oauth-save'], { value: place, opts: {
    httpOnly: true, secure: true, path: '/auth/callback', sameSite: 'lax', maxAge: 600,
  } });
  const destination = await callback(callbackRequest(response));
  assert.equal(destination.location, origin + path);
  assert.equal(destination.values['kult-oauth-save'].opts.maxAge, 0);
  assert.equal(destination.values['kult-oauth-next'].opts.maxAge, 0);
  assert.deepEqual(calls, [
    ['start', { provider: 'google', options: { skipBrowserRedirect: true, redirectTo: origin + '/auth/callback' } }],
    ['exchange', 'test-code'],
    ['account-a', 'kult_catalog_save_set', { p_place_id: place, p_saved: true }],
  ]);
  assert.equal((await api('account-a').POST(postJSON({ placeId: place, saved: true }))).status, 200);
  assert.deepEqual((await (await api('account-a').GET()).json()).ids, [place]);
  assert.deepEqual((await (await api('account-b').GET()).json()).ids, []);
  assert.equal((await api('account-a').POST(postJSON({ placeId: place, saved: false }))).status, 200);
  assert.deepEqual((await (await api('account-a').GET()).json()).ids, []);
});

test('ordinary account login or mismatched cookies never write catalog saves', async () => {
  const { start, callback, calls } = setup();
  const response = await start(postForm({ next: path }));
  assert.equal(response.values['kult-oauth-save'].opts.maxAge, 0);
  const result = await callback(callbackRequest(response, 'test-code', { 'kult-oauth-save': 'not-the-destination' }));
  assert.equal(result.location, origin + path);
  assert.equal(calls.length, 2);
  const skipped = await start(postForm({ next: '/cafe/no-such-place', save: '1' }));
  assert.equal(skipped.location, origin + '/cafe/no-such-place?save=login');
});

test('callback login and save failures are kept distinct and return to exact detail', async () => {
  const login = setup({ exchangeError: new Error('test') });
  const first = await login.start(postForm({ next: path, save: '1' }));
  assert.equal((await login.callback(callbackRequest(first))).location, origin + path + '?save=login');
  assert.equal((await login.callback(callbackRequest(first, ''))).location, origin + path + '?save=login');
  assert.equal(login.calls.length, 2);
  const save = setup({ rpcError: new Error('test') });
  const second = await save.start(postForm({ next: path, save: '1' }));
  assert.equal((await save.callback(callbackRequest(second))).location, origin + path + '?save=retry');
});

test('archive proxies private account operations only and fails honestly when unconfigured', async () => {
  const disabled = setup({ enabled: false }).api('account-a');
  const guest = setup().api(null);
  const signedIn = setup().api('account-a');
  const value = { placeId: place, saved: true };
  const disabledGet = await disabled.GET();
  assert.equal(disabledGet.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(await disabledGet.json(), { enabled: false, signedIn: false });
  assert.equal((await disabled.POST(postJSON(value))).status, 403);
  assert.equal((await guest.POST(postJSON(value))).status, 401);
  assert.equal((await signedIn.POST(postJSON(value, 'https://other.example'))).status, 403);
  assert.equal((await signedIn.POST(postJSON(value, origin, 'text/plain'))).status, 400);
  assert.equal((await signedIn.POST(postJSON({ ...value, userId: 'account-b' }))).status, 400);
  assert.equal((await signedIn.POST(postJSON({ placeId: 'a'.repeat(600), saved: true }))).status, 400);
  assert.equal((await signedIn.POST(postJSON({ placeId: 'no-such-place', saved: true }))).status, 404);
});
