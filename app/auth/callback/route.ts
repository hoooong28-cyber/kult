import { catalogPlaceDestination } from '@/lib/catalogSavePaths';
import { canSaveCatalogPlace } from '@/lib/supabase/catalogArchive';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { accountDestination, accountOrigin, accountPath, privateRedirect } from '../flow';

export async function GET(request: NextRequest) {
  const origin = accountOrigin(request);
  if (!origin) return new Response(null, { status: 403 });
  const next = accountDestination(request.cookies.get('kult-oauth-next')?.value);
  const finish = (path: string) => {
    const response = privateRedirect(new URL(path, origin));
    response.cookies.set('kult-oauth-next', '', {
      httpOnly: true,
      secure: origin.startsWith('https:'),
      path: '/auth/callback',
      sameSite: 'lax',
      maxAge: 0,
    });
    response.cookies.set('kult-oauth-save', '', {
      httpOnly: true, secure: origin.startsWith('https:'), path: '/auth/callback',
      sameSite: 'lax', maxAge: 0,
    });
    return response;
  };
  const slug = catalogPlaceDestination(next);
  const pending = slug && request.cookies.get('kult-oauth-save')?.value === slug ? slug : null;
  const fail = (status: string) => finish(pending ? next + '?save=login' : accountPath(next, status));
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return fail('retry');
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail('unavailable');

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail('retry');
    const { data, error: verifyError } = await supabase.auth.getUser();
    if (verifyError || !data.user) return fail('retry');
  } catch { return fail('retry'); }

  if (pending) {
    try {
      if (await canSaveCatalogPlace(pending)) {
        const result = await supabase.rpc('kult_catalog_save_set', { p_place_id: pending, p_saved: true });
        if (!result.error) return finish(next);
      }
    } catch { /* Login succeeded; leave the user on the place with a manual retry. */ }
    return finish(next + '?save=retry');
  }
  return finish(next);
}
