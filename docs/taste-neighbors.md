# Taste neighbors (development pilot)

Compare by exact NAVER Place ID, not title or approximate coordinates. A match
needs two distinct common venues. Rank by common count, with normalized overlap
as a tiebreaker. Show common names from the viewer's browser, then new places
selected by the other user. Don't show percentages or invented profiles.

- Bring a shared NAVER list or single links into My Archive using the existing
  flow. Unsupported items without a canonical place ID cannot be compared.
- Choose the places to compare. Comparison does not publish a shelf.
- Separately choose to publish a short nickname and selected place IDs and
  display labels. Do not send source folder links, messages, memos, saved dates,
  addresses, emails, or local profile identity. Publishing again replaces the
  selection. Unpublishing does not touch private browser saves.
- Development only: run with Node 24 and `KULT_TASTE_PILOT_DB=/tmp/kult-taste.sqlite npm run preview:local`.
  Use two separate browser profiles to exercise sharing end to end. Clearing
  the ownership cookie loses control of that test shelf; use disposable data.
  Don't expose the dev server to the public internet.
- Production requires actual account authentication, a persistent managed
  store, abuse/rate controls, moderation, owner recovery and deletion, and
  authorization tests before enabling cross-user matching.
- No paid GPT API or checkout.
