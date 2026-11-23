import Header from '@/components/Header';
import KultAccountPanel from '@/components/KultAccountPanel';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { accountDestination, canonicalAccountOrigin } from '../auth/flow';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: '내 KULT 계정 · KULT Seoul',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string | string[]; status?: string | string[] }> };

export default async function AccountPage({ searchParams }: Props) {
  const { next, status } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const configured = Boolean(supabase && (process.env.NODE_ENV !== 'production' || canonicalAccountOrigin()));
  const result = configured && supabase ? await supabase.auth.getUser() : null;
  const signedIn = Boolean(result && !result.error && result.data.user);
  return (
    <div lang="ko" className="min-h-[70svh]">
      <Header section="entry" />
      <div className="px-4">
        <KultAccountPanel configured={configured} signedIn={signedIn} next={accountDestination(next)}
          status={typeof status === 'string' ? status : undefined} />
      </div>
    </div>
  );
}
