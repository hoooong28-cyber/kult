import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function kultMemberSettings() {
  const url = process.env.KULT_SUPABASE_URL?.trim();
  const key = process.env.KULT_SUPABASE_PUBLISHABLE_KEY?.trim();
  const origin = process.env.KULT_SITE_ORIGIN?.trim();
  if (!url || !key?.startsWith('sb_publishable_') || !origin) return null;
  try {
    const host = new URL(url), site = new URL(origin);
    const loopback = ['localhost', '127.0.0.1'].includes(site.hostname);
    if (host.protocol !== 'https:' || !/^[a-z0-9]+\.supabase\.co$/.test(host.hostname) || host.origin !== url ||
      site.origin !== origin || (site.protocol !== 'https:' && !(process.env.NODE_ENV === 'development' && loopback && site.protocol === 'http:'))) return null;
    return { url, key, origin };
  } catch { return null; }
}

export async function createSupabaseServerClient() {
  const config = kultMemberSettings();
  if (!config) return null;
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, secure: config.origin.startsWith('https:'), sameSite: 'lax', path: '/' },
    cookies: {
      getAll() { return store.getAll(); },
      setAll(items) {
        try { for (const { name, value, options } of items) store.set(name, value, options); }
        catch { /* A server-rendered view can't persist refreshed cookies. Route handlers can. */ }
      },
    },
  });
}
