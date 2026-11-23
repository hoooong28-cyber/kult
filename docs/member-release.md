# KULT member storage release

This is separate from the one-server local SQLite pilot. The production app
does not use pilot files, cookies, or test users.

1. Link the existing Vercel KULT project and the KULT GitHub repository. Don't
   create a second public domain just to work around project access.
2. On the designated Supabase project, apply
   `supabase/migrations/202611220001_kult_accounts.sql`. Keep the private
   schema unexposed. Use only the project's publishable key in the app.
3. Configure Google web OAuth in Supabase (Google console redirects to the
   project's /auth/v1/callback; Supabase redirects to the exact KULT
   /auth/callback URL, without wildcard redirects).
4. Configure KULT_SUPABASE_URL, KULT_SUPABASE_PUBLISHABLE_KEY and
   KULT_SITE_ORIGIN in the chosen Vercel environment. Never put secrets in git,
   or a database credential in a public environment key.
5. Verify two actual test-member logins against the exact deployment:
   no silent import; private saves across sessions; no guest access; no match
   until a different test member explicitly shares at least three places;
   no self-match; private copy of discovered place; revoke/remove; sign out.
6. Keep release within the approved no-paid-API scope. Verify account, hosting
   limits and project eligibility before enabling paid plans or public growth.
   No itineraries, GPT requests or payments are in this release.

Only selected canonical venue IDs and display names transfer from a locally
activated browser profile to the account, by explicit click. They stay private
unless an independent publish action shares selected places and a nickname.
Revoking does not delete private account saves. Removing a shared saved place
also removes it from the shared snapshot. The pre-existing browser archive is
not migrated, overwritten or deleted by deployment.

For in-place release, keep the exact existing Vercel origin. In the original
browser profile, existing v1 NAVER lists are readable only for the recognized
legacy browser profile, and remain unchanged. Native KULT browser bookmarks
are separate IDs; after explicit preview, only bookmarks with an exact NAVER
place ID and not known closed/demo can be selected for private sync. Bookmarks
without a verified mapping stay in the original browser. A change of domain,
protocol, port, or browser profile does not migrate localStorage.
