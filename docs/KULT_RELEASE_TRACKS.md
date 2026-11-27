## KULT release tracks

- Production: https://kult-eight-bice.vercel.app/ (`main`). Treat it as the legacy public site until a release is authorized and verified.
- Current product development: `integration/kult-current`, based on the purpose-first home and the latest Yeonnam integration. Use its protected Vercel branch preview for internal review. Make new product work from here, not from `main`.
- Mobile guest review: https://kult-git-review-mobile-hong-7332.vercel.app/ (`review/mobile`). Only this preview domain is public. Fast-forward it only to verified builds meant for guest review, and recheck guest home and recommendation deep links without credentials. Keep hosted member sign-in and two-account save QA on the intended protected host with its exact canonical origin and callback.
- `test/naver-*` branches are isolated diagnostics. Never promote or merge mystery diagnostic output into production.
- Keep hidden venue intake, browser profile data, and member account storage separate. Publish only approved venue cards and preserve their stable IDs. Before production, verify guest UX, member sign-in and saves, and database prerequisites wherever enabled. Do not enable a paid feature or widen preview sharing to fix access.
