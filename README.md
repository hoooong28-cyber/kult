# Seoul Expat Cafe Magazine (Phase 1)

A human-curated cafe recommendation magazine for Seoul expats and remote workers, built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **NAVER Maps Web Dynamic SDK**.

---

## 📌 Naver Maps API Setup & NCP Quota Notice

### 1. Environment Variable Configuration
Create a `.env.local` file in the root directory:

```env
# Client ID for NAVER Dynamic Maps Web SDK (Client Side)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id

# Optional Client Secret for Server-side Geocoding API
NAVER_MAP_CLIENT_SECRET=your_naver_map_client_secret
```

> **Note**: If `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` is unset or not yet registered, the application gracefully renders an **interactive fallback preview** with cafe location pills, ensuring smooth development and testing without map crashes.

---

### ⚠️ IMPORTANT: Setting Daily Quotas & Usage Limits on NCP Console
To prevent accidental API overusage or unexpected billing when deploying to production, please configure quota limits in the NAVER Cloud Platform (NCP) Console:

1. Log into [NAVER Cloud Platform Console](https://console.ncloud.com/).
2. Navigate to **Services > AI·NAVER API > Application**.
3. Select your registered application (Web Dynamic Map / Geocoding).
4. Click **한도 및 알림 설정 (Limits & Notifications)**.
5. Set a **Daily Free Quota Limit** (e.g., 10,000 requests/day for Web Dynamic Map) and enable email/SMS threshold alert notifications (e.g., at 80% usage).

---

## 📁 Multi-Curator Data Structure (`data/curators/`)
Curator recommendations are stored as structured JSON files in `data/curators/[curator_id].json`.

### Schema Example (`data/curators/founder.json`):
```json
{
  "curator": {
    "id": "founder",
    "display_name": "KULT Founder",
    "identity_tag": "성수동 브런치 & 로스터리 매니아",
    "bio": "서울 거주하며 성수동 골목 구석구석의 조용한 작업 공간과 브런치 카페를 직접 탐방하고 큐레이션합니다.",
    "source_list_url": "https://map.naver.com",
    "instagram_or_link": "https://instagram.com",
    "status": "active",
    "joined_date": "2026-09-01"
  },
  "cafes": [
    {
      "id": "cuco-seongsu",
      "name": "Cuco",
      "name_local": "쿠코",
      "neighborhood": "Seongsu",
      "address": "서울 성동구 아차산로11길 12 진일빌딩 1층",
      "lat": 37.5451,
      "lng": 127.0583,
      "tags": {
        "wifi": true,
        "outlet_availability": "unknown",
        "noise_level": "moderate",
        "kid_free_zone": false,
        "english_menu": true,
        "card_only": true,
        "good_for": ["date", "solo"],
        "price_range": "$$"
      },
      "hours": "화요일 정기휴무, 11:00-22:00",
      "last_verified_date": "2026-09-01",
      "notes": "공장 개조한 높은 층고, 예약 가능한 성수 브런치 맛집"
    }
  ]
}
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Build production bundle
npm run build
```
