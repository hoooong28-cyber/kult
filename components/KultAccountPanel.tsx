import Link from 'next/link';

const messages = {
  unavailable: '계정 연결을 준비 중이에요. 지금은 로그인 없이 서울 공간을 둘러볼 수 있어요.',
  retry: '로그인을 완료하지 못했어요. 이 페이지에서 다시 시도해 주세요.',
  signed_out: '이 브라우저에서 로그아웃했어요.',
  signout_failed: '로그아웃을 완료하지 못했어요. 다시 시도해 주세요.',
} as const;

type Props = {
  configured: boolean;
  signedIn: boolean;
  next: string;
  status?: string;
};

export default function KultAccountPanel({ configured, signedIn, next, status }: Props) {
  const message = status && Object.prototype.hasOwnProperty.call(messages, status)
    ? messages[status as keyof typeof messages]
    : !configured ? messages.unavailable : undefined;
  return (
    <section aria-labelledby="account-title" className="mx-auto my-12 max-w-xl rounded-2xl border border-[var(--kult-rule)] bg-[var(--kult-cream)] p-6 sm:my-20 sm:p-10">
      <p lang="en" className="text-xs font-bold tracking-widest text-[var(--kult-accent-text)]">KULT SEOUL / ACCOUNT</p>
      <h1 id="account-title" className="mt-3 text-4xl font-bold">{signedIn ? '내 KULT 계정' : 'KULT 계정 시작하기'}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--kult-muted)]">
        {signedIn ? '로그인되어 있어요. 내 아카이브에서 저장한 공간을 볼 수 있어요.' :
          'Google 계정으로 가입하거나 로그인할 수 있어요. 로그인하지 않아도 공간은 자유롭게 둘러볼 수 있어요.'}
      </p>
      {message && <p role="status" className="mt-5 rounded-xl border border-[var(--kult-rule)] bg-white p-3 text-sm">{message}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {signedIn ? <>
          <Link href={next} className="inline-flex min-h-11 items-center rounded-full bg-[var(--kult-ink)] px-5 text-sm font-bold text-[var(--kult-paper)]">계속하기 ↗</Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="min-h-11 rounded-full border border-[var(--kult-rule)] px-5 text-sm font-semibold">로그아웃</button>
          </form>
        </> : configured && (
          <form action="/auth/start" method="post">
            <input type="hidden" name="next" value={next} />
            <button type="submit" className="min-h-11 rounded-full bg-[var(--kult-ink)] px-5 text-sm font-bold text-[var(--kult-paper)]">
              Google로 계속하기
            </button>
          </form>
        )}
        <Link href="/" className="inline-flex min-h-11 items-center px-2 text-sm text-[var(--kult-muted)] underline underline-offset-4">홈으로 가기</Link>
      </div>
    </section>
  );
}
