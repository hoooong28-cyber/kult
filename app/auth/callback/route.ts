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
    return response;
  };
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return finish(accountPath(next, 'retry'));
  const supabase = await createSupabaseServerClient();
  if (!supabase) return finish(accountPath(next, 'unavailable'));

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return finish(accountPath(next, 'retry'));
  const { data, error: verifyError } = await supabase.auth.getUser();
  if (verifyError || !data.user) return finish(accountPath(next, 'retry'));
  return finish(next);
}
