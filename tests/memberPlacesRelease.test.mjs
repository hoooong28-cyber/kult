import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function load(file, dependencies, env = {}) {
  const path = new URL('../' + file, import.meta.url);
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const instance = { exports: {} };
  const require = name => {
    assert.ok(Object.hasOwn(dependencies, name), 'Unexpected dependency ' + name);
    return dependencies[name];
  };
  new Function('exports', 'module', 'require', 'process', outputText)(instance.exports, instance, require, { env });
  return instance.exports;
}

const config = {
  KULT_SITE_ORIGIN: 'https://kult.example',
  KULT_SUPABASE_URL: 'https://exampleproject.supabase.co',
  KULT_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-only',
  NODE_ENV: 'production',
};

function settings(env) {
  return load('lib/supabase/server.ts', {
    'server-only': {},
    '@supabase/ssr': { createServerClient: () => assert.fail('Settings must not connect') },
    'next/headers': { cookies: () => assert.fail('Settings must not use cookies') },
  }, env).kultMemberSettings();
}

function endpoint({ configEnabled = true, authenticated = true } = {}) {
  const calls = [];
  const route = load('app/api/member-places/route.ts', {
    'next/server': { NextResponse: { json: Response.json } },
    '@/lib/supabase/server': {
      kultMemberSettings: () => configEnabled ? { origin: config.KULT_SITE_ORIGIN } : null,
      createSupabaseServerClient: async () => {
        calls.push('session');
        return {
          auth: { getUser: async () => ({ data: { user: authenticated ? { id: 'test' } : null }, error: null }) },
          rpc: async (...args) => { calls.push(args); return { error: null, data: { places: [], shelf: null } }; },
        };
      },
    },
  });
  return { route, calls };
}

function post(body, origin = config.KULT_SITE_ORIGIN) {
  return new Request(config.KULT_SITE_ORIGIN + '/api/member-places', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body),
  });
}

test('production settings reject partial configuration, non-publishable keys and untrusted origins', () => {
  assert.deepEqual(settings(config), {
    url: config.KULT_SUPABASE_URL, key: config.KULT_SUPABASE_PUBLISHABLE_KEY, origin: config.KULT_SITE_ORIGIN,
  });
  for (const change of [
    { KULT_SITE_ORIGIN: '' },
    { KULT_SITE_ORIGIN: 'http://127.0.0.1:3000' },
    { KULT_SITE_ORIGIN: 'https://kult.example/path' },
    { KULT_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_wrong-role' },
    { KULT_SUPABASE_URL: 'https://exampleproject.supabase.co.evil.test' },
    { KULT_SUPABASE_URL: 'https://exampleproject.supabase.co/rest/v1' },
  ]) assert.equal(settings({ ...config, ...change }), null, JSON.stringify(change));
  assert.ok(settings({ ...config, NODE_ENV: 'development', KULT_SITE_ORIGIN: 'http://127.0.0.1:3000' }));
});

test('disabled production member API is private and refuses reads/writes without touching auth or storage', async () => {
  const { route, calls } = endpoint({ configEnabled: false });
  const get = await route.GET();
  assert.deepEqual(await get.json(), { enabled: false, signedIn: false });
  const write = await route.POST(post({ action: 'merge', places: [] }));
  assert.equal(write.status, 404);
  assert.equal(get.headers.get('cache-control'), 'private, no-store');
  assert.equal(write.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(calls, []);
});

test('member API will not write for a cross-origin or unauthenticated request', async () => {
  const { route, calls } = endpoint({ authenticated: false });
  const body = { action: 'merge', places: [{ id: '123', name: '테스트' }] };
  assert.equal((await route.POST(post(body, 'https://other.example'))).status, 403);
  assert.deepEqual(calls, []);
  const get = await route.GET();
  assert.deepEqual(await get.json(), { enabled: true, signedIn: false });
  assert.equal((await route.POST(post(body))).status, 401);
  assert.deepEqual(calls, ['session', 'session']);
});

test('member API only dispatches deliberate actions with exact fields and never mixes merge with publish', async () => {
  const { route, calls } = endpoint();
  const places = [{ id: '123', name: '테스트' }];
  assert.equal((await route.POST(post({ action: 'merge', places, consent: true }))).status, 400);
  assert.equal((await route.POST(post({ action: 'publish', consent: false, nickname: '내 별명', placeIds: ['123'] }))).status, 400);
  assert.equal((await route.POST(post({ action: 'merge', places }))).status, 200);
  assert.deepEqual(calls, ['session', 'session', 'session', ['kult_archive_merge', { p_places: places }]]);
});

test('member API rejects oversized and non-JSON import requests before making a session lookup', async () => {
  const { route, calls } = endpoint();
  assert.equal((await route.POST(post({ action: 'merge', places: [{ id: '123', name: '가'.repeat(12000) }] }))).status, 400);
  assert.equal((await route.POST(new Request(config.KULT_SITE_ORIGIN + '/api/member-places', {
    method: 'POST', headers: { 'Content-Type': 'text/plain', Origin: config.KULT_SITE_ORIGIN }, body: '{}',
  }))).status, 400);
  assert.deepEqual(calls, []);
});
