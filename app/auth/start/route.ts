import { catalogPlaceDestination } from '@/lib/catalogSavePaths';
import { canSaveCatalogPlace } from '@/lib/supabase/catalogArchive';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { accountDestination, accountOrigin, accountPath, privateRedirect, trustedPost } from '../flow';

export async function POST(request: Request) {
  const origin = accountOrigin(request);
  if (!trustedPost(request, origin)) return new Response(null, { status: 403 });
  const form = await request.formData().catch(() => null);
  const next = accountDestination(form?.get('next'));
  const slug = catalogPlaceDestination(next);
  const wantsSave = form?.get('save') === '1' && slug;
  const back = (status: string) => privateRedirect(new URL(wantsSave ? next + '?save=login' : accountPath(next, status), origin));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return back('unavailable');

  let pending = '';
  let target: string;
  try {
    if (wantsSave) {
      if (!await canSaveCatalogPlace(wantsSave)) return back('retry');
      pending = wantsSave;
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: new URL('/auth/callback', origin).toString(),
        skipBrowserRedirect: true,
      },
    });
    if (error || !data.url) return back('retry');
    target = data.url;
  } catch { return back('retry'); }
  const response = privateRedirect(target);
  response.cookies.set('kult-oauth-next', next, {
    httpOnly: true,
    secure: origin.startsWith('https:'),
    path: '/auth/callback',
    sameSite: 'lax',
    maxAge: 600,
  });
  response.cookies.set('kult-oauth-save', pending, {
    httpOnly: true, secure: origin.startsWith('https:'), path: '/auth/callback',
    sameSite: 'lax', maxAge: pending ? 600 : 0,
  });
  return response;
}
