import { createSupabaseServerClient } from '@/lib/supabase/server';
import { accountDestination, accountOrigin, accountPath, privateRedirect, trustedPost } from '../flow';

export async function POST(request: Request) {
  const origin = accountOrigin(request);
  if (!trustedPost(request, origin)) return new Response(null, { status: 403 });
  const form = await request.formData().catch(() => null);
  const next = accountDestination(form?.get('next'));
  const back = (status: string) => privateRedirect(new URL(accountPath(next, status), origin));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return back('unavailable');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: new URL('/auth/callback', origin).toString(),
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url) return back('retry');
  const response = privateRedirect(data.url);
  response.cookies.set('kult-oauth-next', next, {
    httpOnly: true,
    secure: origin.startsWith('https:'),
    path: '/auth/callback',
    sameSite: 'lax',
    maxAge: 600,
  });
  return response;
}
