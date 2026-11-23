import { createSupabaseServerClient } from '@/lib/supabase/server';
import { accountOrigin, accountPath, privateRedirect, trustedPost } from '../flow';

export async function POST(request: Request) {
  const origin = accountOrigin(request);
  if (!trustedPost(request, origin)) return new Response(null, { status: 403 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return privateRedirect(new URL(accountPath('/archive', 'unavailable'), origin));
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  return privateRedirect(new URL(accountPath('/archive', error ? 'signout_failed' : 'signed_out'), origin));
}
