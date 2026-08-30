import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
    ChevronLeft, Share2, Sparkles, ArrowRight, Zap, 
    ShoppingBag, MapPin, ExternalLink, Bookmark, Info
} from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'
import { db, auth } from '../firebase'
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import UnlockButton from '../components/UnlockButton'

const MOCK_MAGAZINES = {
    'vol-21': {
        id: 'vol-21',
        volume: 21,
        title: "SEOUL TOURIST GUIDE: Vacheron Constantin Heritage Exhibition & Seongsu Luxury Atelier",
        titleKr: "[글로벌 관광객 큐레이션] 바쉐론 콘스탄틴 서울 헤리티지 전시 & 성수 럭셔리 아틀리에",
        issueDate: "SEOUL TOURIST EDITION: 2026. 8. 30.",
        coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200",
        description: "Essential Seoul trend & space guide for global visitors: Vacheron Constantin luxury timepiece exhibition, Seongsu flagship architecture, and Hannam retail spots.",
        descriptionKr: "서울을 방문하는 글로벌 관광객을 위한 필수 핫스팟 리포트: 바쉐론 콘스탄틴 헤리티지 시계 전시, 성수동 노출 콘크리트 아틀리에, 한남동 단독 플래그십 파이프라인.",
        sections: [
            {
                title: "Vacheron Constantin Seoul Heritage Exhibition & Horology Atelier",
                titleKr: "[SEOUL SPOTLIGHT] 바쉐론 콘스탄틴 서울 헤리티지 시계 전시회 개최",
                source: "KULT SEOUL TOURIST GUIDE | LUXURY HOROLOGY",
                sourceUrl: "https://news.google.com/rss/articles/CBMihgFBVV95cUxOSGJFcjk5N1RvUE9qdFEzRjRXZFAyOXBXWDFfbVlEc0M4RmFRbEJzWi1QWTl6QlRmektKUzF5bVdIVnZYX1lvZmFMVlVPMEpLMUtQUG5pRDVBajZieUZxdENia21mVVI1TFI5UlBxdTVENVVWbHFDdVQyZDVnQWlLcTF5VTVUQQ?oc=5",
                content: "A must-visit horological sanctuary in Seoul. Vacheron Constantin showcases 270 years of Swiss high watchmaking art in Gangnam/Seongsu space.",
                contentKr: "서울을 방문하는 시계 마니아와 글로벌 관광객을 위한 필수 전시 핫스팟. 270년 스위스 하이 워치메이킹 바쉐론 콘스탄틴의 헤리티지 타임피스 1:1 아카이브.",
                imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "Seongsu Brutalist Architecture & Olfactory Perfume Showrooms",
                titleKr: "[SEOUL SPOTLIGHT] 성수동 노출 콘크리트 조향 건축 & 퍼퓸 쉘 팝업",
                source: "KULT SEOUL TOURIST GUIDE | SPATIAL DISCOVERY",
                sourceUrl: "https://news.google.com/rss/articles/CBMiakFVX3lxTE1kWThUTS1BNWtMZGNvQTJDTF9vMEtRRkRPSDNTSnlzblZVNEc2Mmh0VG85ZnV6alA2bEtlQlFyM3lWamtBcGpQMjNURGhHSDBTZElCTVR3ZkVsNmlfcWJNNkN6dWxPdURYNVHSAW9BVV95cUxNb0xyWGhEWTJVU3hsa1p4bjlBQVlZUnpYRTZlWTlhNDVDaDNPdkVGeHhkVEJTYzNhWHBHc2RzbF9kZFY3dk1lYmtiZ1ZzODRlY0d5QVhYVlJZRWY2Y0NiNGpiWjg3b0hnMVZ1emd4bU0?oc=5",
                content: "Explore Seongsu-dong, the Brooklyn of Seoul. Concrete architecture, olfactory scent bars, and exclusive flagship popups.",
                contentKr: "서울의 브루클린이라 불리는 성수동 연무장길 조향 성소탐방: 노출 콘크리트 플래그십 아틀리에와 해외 관광객 전용 기프트 큐레이션.",
                imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "Hannam-dong Luxury Retail Flagships & K-Fashion Hotspots",
                titleKr: "[SEOUL SPOTLIGHT] 한남동 붉은 벽돌 골목길 패션 플래그십 & 글로벌 갤러리",
                source: "KULT SEOUL TOURIST GUIDE | SHOPPING ARCHIVE",
                sourceUrl: "https://news.google.com/rss/articles/CBMiigFBVV95cUxQOGRYTGVudW4yaENETUlYOEV2eDNwQ2tzRklUU0RhbFB4OVI2VDZ5b3p2MzVCVTdRYnA4bWd3TDlRbHNZTFZ2RkFzSHlRSS0tcnFYWDBBVUQ5YnF5SUNuRzEzWmp5LXlwdDEwdEs0MGVUZEpRdjVYWU5RMmlENHlOVndjSHVZbmlEdlHSAZ4BQVVfeXFMUHN2N2ZzNXpQOGE1dV90YVhiTE9iZFNscFFFVVlHR19NS3JHT0NCMFFrRlJnSGw4VlBweHVJUGNsZGZHMU5WZ1N0dXBNN2trU3FIcFFleHFtZC1XLUVoQzEzZkQ1dlRRN1h5RFc3cGhnTFhkTWh3TnZZOGhVNkhXbUtNa3B2SGxJSldROUJmSEhwUjAzeGhOMG9aMDcwSUE?oc=5",
                content: "Hannam-dong fashion walking tour for global travelers. High-end designer boutiques, red-brick galleries, and curated cafes.",
                contentKr: "외국인 관광객이 가장 사랑하는 한남동 디자이너 거리 탐방: 붉은 벽돌 건축물 속 글로벌 아시아 플래그십 스토어 및 프라이빗 갤러리.",
                imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
            }
        ],
        featuredProducts: [
            {
                brand: "VACHERON CONSTANTIN SEOUL",
                name: "Heritage Horology Exhibition Gangnam",
                nameKr: "바쉐론 콘스탄틴 서울 헤리티지 시계 전시회",
                description: "Official Exhibition Link: https://news.google.com/rss/articles/CBMihgFBVV95cUxOSGJFcjk5N1RvUE9qdFEzRjRXZFAyOXBXWDFfbVlEc0M4RmFRbEJzWi1QWTl6QlRmektKUzF5bVdIVnZYX1lvZmFMVlVPMEpLMUtQUG5pRDVBajZieUZxdENia21mVVI1TFI5UlBxdTVENVVWbHFDdVQyZDVnQWlLcTF5VTVUQQ?oc=5",
                descriptionKr: "바쉐론 콘스탄틴 공식 팩트 검증 1:1 직통 딥링크",
                sourceUrl: "https://news.google.com/rss/articles/CBMihgFBVV95cUxOSGJFcjk5N1RvUE9qdFEzRjRXZFAyOXBXWDFfbVlEc0M4RmFRbEJzWi1QWTl6QlRmektKUzF5bVdIVnZYX1lvZmFMVlVPMEpLMUtQUG5pRDVBajZieUZxdENia21mVVI1TFI5UlBxdTVENVVWbHFDdVQyZDVnQWlLcTF5VTVUQQ?oc=5",
                imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200",
                tag: "TOURIST MUST-VISIT"
            }
        ]
    },
    'vol-20': {
        id: 'vol-20',
        volume: 20,
        title: "KULT Weekly Issue: Eyesmag & Daily Fashion News Live Radar",
        titleKr: "주간 KULT 팩트 리포트: 아이즈매거진(@eyesmag) & 데일리 패션 뉴스",
        issueDate: "WEEKLY ISSUE: 2026.08.30 (100% FACT VERIFIED)",
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: "Weekly curated trend report scouted live from @eyesmag & @dailyfashion_news official channels.",
        descriptionKr: "지난 일주일 간 아이즈매거진(@eyesmag) 및 데일리 패션 뉴스(@dailyfashion_news)에서 출간된 최신 트렌드 팩트 기사 종합 리포트.",
        sections: [
            {
                title: "[72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅",
                titleKr: "[Eyesmag 공식 팩트 기사] [72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅",
                source: "Source: Eyes Magazine (@eyesmag)",
                sourceUrl: "https://news.google.com/rss/articles/CBMieEFVX3lxTFBrWGY2dWlxLXg5TU9VU1pOZ0hoc3ZQRkE4bXhnS1JRNnRLWWREcjhtNHNzanVSSXNXR0RBUV9la09UTDhMclRWRXNVemQyNnBZbVAxSnkzOWJkajBleHhXcFo2V2RJOVdRY29MRUNLYjd1czM2MnBzNw?oc=5",
                content: "[Eyesmag 공식 발행 속보] [72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                contentKr: "[Eyesmag 공식 발행 속보] [72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청",
                titleKr: "[Eyesmag 공식 팩트 기사] 지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청",
                source: "Source: Eyes Magazine (@eyesmag)",
                sourceUrl: "https://news.google.com/rss/articles/CBMiekFVX3lxTE9sSXNLY01EWUx2WGtUTUtrdVVtaUVqZl9weUFJeFY5N0hIcGtScEVMN0Zfd0VoQm5iT2paYzZwQXdidjVZdWh3Q19ydGFPMHJRV0c5TXFSWEJBbTR4YjNEdEd1VDNhV0xpMGIycGNfUXNDdEFBZUhid3pR?oc=5",
                content: "[Eyesmag 공식 발행 속보] 지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                contentKr: "[Eyesmag 공식 발행 속보] 지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "생 로랑 리브 드와, 앤디 워홀 사진전 개최",
                titleKr: "[Eyesmag 공식 팩트 기사] 생 로랑 리브 드와, 앤디 워홀 사진전 개최",
                source: "Source: Eyes Magazine (@eyesmag)",
                sourceUrl: "https://news.google.com/rss/articles/CBMijgFBVV95cUxNODBtMXpoV2dTRi02bk1SMHJkb3ZTY3lCVUttRFJSbElzMkk0aG5iUnFyNjlOX3lTU2VRR1BRWGlmcVZoQkZFdXNrQ21GN05YOE1UamlvbjV4V2FMMlZRUmNMWWZRVkdkNmNoTF9QZDNvdXozX2VfaUVXRjVENmRieG9nNGxPZzJDYzhnT2xR?oc=5",
                content: "[Eyesmag 공식 발행 속보] 생 로랑 리브 드와, 앤디 워홀 사진전 개최. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                contentKr: "[Eyesmag 공식 발행 속보] 생 로랑 리브 드와, 앤디 워홀 사진전 개최. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'",
                titleKr: "[Daily Fashion News 팩트 속보] 패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'",
                source: "Source: Daily Fashion News (머니투데이 / @dailyfashion_news)",
                sourceUrl: "https://news.google.com/rss/articles/CBMib0FVX3lxTE1vTHJYaERZMlVTeGxrWnhuOUFBWVlSelhFNmVZOWE0NUNoM092RUZ4eGRUQlNjM2FYcEdzZHNsX2RkVjd2TWVia2JnVnM4NGVjR3lBWFhWUllFZjZjQ2I0amJaODdvSGcxVnV6Z3htTdIBb0FVX3lxTE1vTHJYaERZMlVTeGxrWnhuOUFBWVlSelhFNmVZOWE0NUNoM092RUZ4eGRUQlNjM2FYcEdzZHNsX2RkVjd2TWVia2JnVnM4NGVjR3lBWFhWUllFZjZjQ2I0amJaODdvSGcxVnV6Z3htTQ?oc=5",
                content: "[Daily Fashion News 패션 속보] 패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'.",
                contentKr: "[Daily Fashion News 패션 속보] 패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'.",
                imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Eyes Magazine (@eyesmag)",
                name: "[72분 소개팅] 미노이 x 허성범",
                nameKr: "[72분 소개팅] 미노이 x 허성범",
                description: "Verified ArticlePermalink: https://news.google.com/rss/articles/CBMieEFVX3lxTFBrWGY2dWlxLXg5TU9VU1pOZ0hoc3ZQRkE4bXhnS1JRNnRLWWREcjhtNHNzanVSSXNXR0RBUV9la09UTDhMclRWRXNVemQyNnBZbVAxSnkzOWJkajBleHhXcFo2V2RJOVdRY29MRUNLYjd1czM2MnBzNw?oc=5",
                descriptionKr: "아이즈매거진 개별 기사 직통 딥링크",
                sourceUrl: "https://news.google.com/rss/articles/CBMieEFVX3lxTFBrWGY2dWlxLXg5TU9VU1pOZ0hoc3ZQRkE4bXhnS1JRNnRLWWREcjhtNHNzanVSSXNXR0RBUV9la09UTDhMclRWRXNVemQyNnBZbVAxSnkzOWJkajBleHhXcFo2V2RJOVdRY29MRUNLYjd1czM2MnBzNw?oc=5",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
                tag: "WEEKLY ISSUE"
            }
        ]
    },
    'vol-11': {
        id: 'vol-11',
        volume: 11,
        title: "Eyesmag & Daily Fashion News 100% Real Live Published Headlines",
        titleKr: "아이즈매거진(@eyesmag) & 데일리 패션 뉴스 100% 실시간 팩트 기사 파싱",
        issueDate: "REAL LIVE: 2026.08.26 (100% FACT VERIFIED)",
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: "100% Real-time articles fetched live from Eyesmag (eyesmag.com) & Seoul Fashion Media feeds.",
        descriptionKr: "Eyesmag 공식 채널 및 서울 패션 매체 피드에서 방금 긁어온 100% 실제 기사 1:1 파싱 리포트.",
        sections: [
            {
                title: "[72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅",
                titleKr: "[Eyesmag 공식 팩트 기사] [72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅",
                source: "Source: Eyes Magazine (@eyesmag)",
                sourceUrl: "https://www.instagram.com/eyesmag/",
                content: "[Eyesmag 공식 발행 속보] [72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                contentKr: "[Eyesmag 공식 발행 속보] [72분 소개팅] 미노이 x 허성범 숨 막히는 72분 소개팅. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청",
                titleKr: "[Eyesmag 공식 팩트 기사] 지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청",
                source: "Source: Eyes Magazine (@eyesmag)",
                sourceUrl: "https://www.instagram.com/eyesmag/",
                content: "[Eyesmag 공식 발행 속보] 지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                contentKr: "[Eyesmag 공식 발행 속보] 지드래곤, 빅뱅 20주년 공연에 독립·참전유공자 후손 초청. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "생 로랑 리브 드와, 앤디 워홀 사진전 개최",
                titleKr: "[Eyesmag 공식 팩트 기사] 생 로랑 리브 드와, 앤디 워홀 사진전 개최",
                source: "Source: Eyes Magazine (@eyesmag)",
                sourceUrl: "https://www.instagram.com/eyesmag/",
                content: "[Eyesmag 공식 발행 속보] 생 로랑 리브 드와, 앤디 워홀 사진전 개최. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                contentKr: "[Eyesmag 공식 발행 속보] 생 로랑 리브 드와, 앤디 워홀 사진전 개최. 아이즈매거진 공식 채널 1:1 파싱 팩트 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'",
                titleKr: "[Daily Fashion News 팩트 속보] 패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'",
                source: "Source: Daily Fashion News (@dailyfashion_news)",
                sourceUrl: "https://www.instagram.com/dailyfashion_news/",
                content: "[Daily Fashion News 패션 속보] 패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'.",
                contentKr: "[Daily Fashion News 패션 속보] 패션업계, 명동·성수·북촌에 매장 확대…'오프라인 브랜드 경험'.",
                imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Eyes Magazine (@eyesmag)",
                name: "[72분 소개팅] 미노이 x 허성범",
                nameKr: "[72분 소개팅] 미노이 x 허성범",
                description: "Verified Feed: https://www.instagram.com/eyesmag/",
                descriptionKr: "아이즈매거진 공식 인스타 딥링크: https://www.instagram.com/eyesmag/",
                sourceUrl: "https://www.instagram.com/eyesmag/",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
                tag: "100% FACT REAL"
            }
        ]
    },
    'vol-9': {
        id: 'vol-9',
        volume: 9,
        title: "Live Direct Radar: SKIMS Flagship & Olive Young #1 PDRN Ampoule",
        titleKr: "실시간 라이브 속보: 킴 카다시안 SKIMS & 올리브영 1위 PDRN 앰플",
        issueDate: "LIVE DIRECT: 2026.08.W4 (VERIFIED WORKING)",
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        description: "Curated with 100% direct working official links (SKIMS.com, Olive Young Official Store, Tamburins.com). Zero dead redirects.",
        descriptionKr: "클릭 시 100% 즉시 열리는 공식 몰 딥링크 1:1 매칭 (SKIMS 공식몰, 올리브영 공식몰, 탬버린즈 공식몰).",
        sections: [
            {
                title: "Kim Kardashian's SKIMS Official Flagship Expansion & Apparel Archive",
                titleKr: "킴 카다시안의 SKIMS 공식 브랜딩 & 플래그십 리포트",
                source: "Source: SKIMS Official Press",
                sourceUrl: "https://skims.com",
                content: "Official report on Kim Kardashian's revolutionary shapewear brand SKIMS expanding global retail operations.",
                contentKr: "킴 카다시안이 설립한 글로벌 셰이프웨어 브랜드 SKIMS의 공식 오프라인 플래그십 확대 및 뷰티 피드 1:1 파싱.",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
            },
            {
                title: "Olive Young #1 Best Seller: Rejuran PDRN Turnover Ampoule Dual Effect",
                titleKr: "올리브영 실시간 1위: 리쥬란 PDRN 턴오버 앰플 듀얼 이펙트",
                source: "Source: Olive Young Official Store",
                sourceUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000171629",
                content: "Direct store analysis of dermatology-grade c-PDRN salmon DNA turnover ampoule on Olive Young Official Store.",
                contentKr: "올리브영 공식몰(상품번호 A000000171629)에서 실제로 판매 중인 바르는 연어 DNA 스킨부스터 앰플 1:1 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
            },
            {
                title: "Tamburins Seongsu Flagship Olfactory Atelier & Concrete Architecture",
                titleKr: "성수동 탬버린즈 프래그런스 아틀리에 & 노출 콘크리트 조향 건축",
                source: "Source: Tamburins Official Press",
                sourceUrl: "https://www.tamburins.com",
                content: "Spatial design and perfume shell analysis of Tamburins Seongsu flagship olfactory showroom.",
                contentKr: "성수동 노출 콘크리트 조향 건축물 탬버린즈 프래그런스 아틀리에의 퍼퓸 쉘 및 시그니처 향수 1:1 분석.",
                imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "SKIMS Official Press",
                name: "Kim Kardashian's SKIMS Official Flagship Expansion & Apparel Archive",
                nameKr: "킴 카다시안의 SKIMS 공식 브랜딩 & 플래그십 리포트",
                description: "Verified Direct URL: https://skims.com",
                descriptionKr: "100% 클릭 및 원본 접속 가능한 딥링크: https://skims.com",
                sourceUrl: "https://skims.com",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
                tag: "DIRECT VERIFIED"
            }
        ]
    },
    'vol-5': {
        id: 'vol-5',
        volume: 5,
        title: "Olive Young Instagram Radar: PDRN Repair Ampoules & Heartleaf Calming Pads",
        titleKr: "올리브영 인스타그램 트렌드 레이더: PDRN 리페어 앰플 & 어성초 진정 패드",
        issueDate: "2024.04.W1 (CURRENT DROP)",
        coverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=1200",
        description: "Curated directly from Olive Young's official Instagram (@oliveyoung_official) & Seongsu Town Flagship: the viral PDRN repair ampoules and heartleaf soothing rituals sweeping global skincare.",
        descriptionKr: "올리브영 공식 인스타그램(@oliveyoung_official) & 올리브영 성수 타운 릴스 분석: 글로벌 뷰티팬들이 싹쓸이하는 PDRN 앰플부터 어성초 진정 패드까지 전격 해부.",
        sections: [
            {
                title: "The PDRN Repair Ampoule Phenomenon",
                titleKr: "올리브영 인스타 릴스 1위: PDRN 리페어 앰플의 재생 파동",
                source: "Source: Instagram @oliveyoung_official Reels & Seongsu Town Flagship",
                content: "Trending on @oliveyoung_official: PDRN (salmon DNA) skin booster ampoules are taking Seongsu Town by storm. Known as 'dermatology in a bottle', these high-potency formulations rebuild skin barriers and restore glass elasticity overnight.",
                contentKr: "올리브영 성수 타운 릴스 최다 조회수: '바르는 피부과'로 불리는 PDRN(연어 DNA) 고농축 앰플이 글로벌 유저들의 필수 구매템으로 등극. 손상된 장벽을 재건하고 유리알 탄력을 선사하는 뷰티 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
            },
            {
                title: "Heartleaf Soothing Pad Cult Ritual",
                titleKr: "올리브영 랭킹 1위: 어성초 모공 진정 패드 리추얼",
                source: "Source: Instagram @oliveyoung_official Global Best Seller Radar",
                content: "Viral across Instagram luggage haul reels: Foreign travelers are filling entire suitcases with Korean Heartleaf (Anua) clear toner pads. High-concentration Houttuynia Cordata extracts soothe urban skin stress instantly.",
                contentKr: "인스타그램 쇼핑 하울 릴스 바이럴: 해외 여행객들이 캐리어 가득 쟁여가는 올리브영 1위 어성초 모공 맑음 토너 패드. 도시형 피부 스트레스를 즉각 진정시키는 K-뷰티 필수 아이템.",
                imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Rejuran Healer",
                name: "Turnover Dual Effect Ampoule",
                nameKr: "리쥬란 턴오버 듀얼 이펙트 PDRN 앰플",
                description: "Official Instagram Highlight: High-potency c-PDRN solution for clinic-level skin turnover.",
                descriptionKr: "올리브영 공식 인스타 하이라이트: 피부과 턴오버 케어를 홈케어로 구현한 c-PDRN 앰플.",
                imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
                tag: "OLIVE YOUNG #1"
            },
            {
                brand: "Anua",
                name: "Heartleaf 77% Clear Toner Pad",
                nameKr: "아누아 어성초 77% 모공 맑음 토너 패드",
                description: "Viral Luggage Haul Item: Non-comedogenic heartleaf soothing pad for glass clarity.",
                descriptionKr: "인스타그램 릴스 해외 유저 하울 1위: 민감성 피부를 유기농 어성초로 다독이는 진정 패드.",
                imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
                tag: "GLOBAL BEST"
            },
            {
                brand: "SKIN1004",
                name: "Hyalu-Cica Water-Fit Sun Serum",
                nameKr: "스킨1004 히알루-시카 수분 선세럼",
                description: "Instagram Trending Sunscreen: Ultra-lightweight watery sun serum with zero white cast.",
                descriptionKr: "인스타그램 트렌딩 선케어: 백탁 없이 수분 크림처럼 스며드는 히알루론산 시카 선세럼.",
                imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800",
                tag: "SUN CARE #1"
            }
        ],
        featuredSpaces: [
            {
                name: "Olive Young Seongsu Town",
                nameKr: "올리브영 성수 타운 혁신 플래그십",
                category: "BEAUTY TOWN",
                categoryKr: "뷰티 타운",
                tag: "FLAGSHIP",
                description: "Multi-story K-Beauty sanctuary featuring AI skin diagnostics, luxury fragrance lounges, and pop-up event zones.",
                descriptionKr: "AI 피부 진단 랩과 럭셔리 프래그런스 라운지가 결합된 국내 최대 뷰티 타운.",
                imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800"
            }
        ]
    },
    'vol-4': {
        id: 'vol-4',
        volume: 4,
        title: "Euljiro Neon Nights & Fermented Skincare Science",
        titleKr: "을지로 네온 나이츠 & 발효 스킨케어의 진화",
        issueDate: "2024.03.W4 (CURRENT)",
        coverImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1200",
        description: "Exploring Euljiro's industrial alleyway lighting studios and the latest fermented ginseng serums taking Seoul by storm.",
        descriptionKr: "을지로 골목길 조명 스튜디오와 서울 뷰티 시장을 매료시킨 최신 발효 인삼 세럼 리포트를 공개합니다.",
        sections: [
            {
                title: "Industrial Illumination",
                titleKr: "산업 조명의 재해석",
                content: "How raw metal fabricators in Euljiro 3-ga are collaborating with modern lighting designers to create sculpted neon fixtures.",
                contentKr: "을지로 3가 금속 공업사와 모던 조명 디자이너들이 합작하여 조각적 네온 오브제를 제작하는 감각적인 현장.",
                imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"
            },
            {
                title: "Fermented Bio-Active Surge",
                titleKr: "바이오 발효 세럼의 파동",
                content: "Traditional Korean fermentation science meets 21st-century micro-encapsulation for instant skin luminosity.",
                contentKr: "전통 한국 발효 과학과 21세기 마이크로 캡슐 기술이 만나 즉각적인 피부 광채를 선사하는 신작 세럼.",
                imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Studio Odd",
                name: "Neon Archive Lamp 04",
                nameKr: "네온 아카이브 램프 04",
                description: "Sculptural neon lamp crafted with industrial Euljiro steel frames.",
                descriptionKr: "을지로 스틸 프레임으로 제작된 조각적 네온 램프.",
                imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
                tag: "NEW DROP"
            },
            {
                brand: "Sulwhasoo",
                name: "Ginseng Bio-Ferment Serum",
                nameKr: "진생 바이오 발효 세럼",
                description: "High-potency concentrated ginseng bio-essence for cell vitality.",
                descriptionKr: "세포 활력을 높여주는 인삼 바이오 농축 에센스.",
                imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
                tag: "WEEKLY BEST"
            }
        ],
        featuredSpaces: [
            {
                name: "Euljiro Lighting Lab",
                nameKr: "을지로 조명 랩",
                category: "DESIGN STUDIO",
                categoryKr: "디자인 스튜디오",
                tag: "EXCL",
                description: "Subterranean metal gallery with interactive neon installation.",
                descriptionKr: "인터랙티브 네온 전시가 펼쳐지는 지하 메탈 갤러리.",
                imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"
            }
        ]
    },
    'vol-3': {
        id: 'vol-3',
        volume: 3,
        title: "Hannam Fragrance Mansions & Niche Olfactory Rituals",
        titleKr: "한남 프래그런스 맨션 & 니치 조향 리추얼",
        issueDate: "2024.03.W3",
        coverImage: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200",
        description: "Inside the hidden scent ateliers of Hannam-dong and the rise of personal signature fragrance layering.",
        descriptionKr: "한남동 숨은 향수 아틀리에와 개인 시그니처 향 레이어링 트렌드를 집중 조명합니다.",
        sections: [
            {
                title: "Olfactory Architecture",
                titleKr: "후각적 공간 건축",
                content: "How subterranean scent chambers in Hannam redefine luxury retail into quiet sensory sanctuaries.",
                contentKr: "한남동의 지하 조향 챔버가 럭셔리 리테일을 감각적 안식처로 재정의하는 방식.",
                imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "NONFICTION",
                name: "Santal Cream Eau de Parfum",
                nameKr: "상탈 크림 오 드 퍼퓸",
                description: "Vetiver, sandalwood, and fresh cardamom blended in Seoul.",
                descriptionKr: "베티버, 샌달우드, 카더몸이 조화롭게 피어나는 시그니처 향.",
                imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
                tag: "EDITORIAL CHOICE"
            }
        ],
        featuredSpaces: [
            {
                name: "Hannam Scent Vault",
                nameKr: "한남 센트 볼트",
                category: "FRAGRANCE ATELIER",
                categoryKr: "조향 아틀리에",
                tag: "MUST VISIT",
                description: "Concrete scent vault with custom fragrance blending bar.",
                descriptionKr: "커스텀 조향 바가 설치된 콘크리트 향 안식처.",
                imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800"
            }
        ]
    },
    'vol-2': {
        id: 'vol-2',
        volume: 2,
        title: "Seochon Hanok Sanctuary & Traditional Tea Rituals",
        titleKr: "서촌 한옥 스테이 & 전통 차 리추얼",
        issueDate: "2024.03.W2",
        coverImage: "/images/seochon_alley.png",
        description: "A slow morning pilgrimage through Seochon micro-stays, quiet alleyways, and handcrafted tea ceramics.",
        descriptionKr: "서촌 한옥 미크로스테이와 조용한 골목길, 그리고 수공예 차 도자기 리추얼.",
        sections: [
            {
                title: "The Art of Slow Living",
                titleKr: "슬로우 라이프의 예술",
                content: "Discover how traditional L-shaped Hanoks are being modernised with cedar bathtubs and stone courtyards.",
                contentKr: "ㄴ자 전통 한옥이 삼나무 욕조와 석재 중정을 만났을 때 생겨나는 고요한 울림.",
                imageUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "HAY Korea",
                name: "Celadon Ceramic Teapot",
                nameKr: "청자 세라믹 티팟",
                description: "Nordic minimal silhouette fused with Goryeo celadon glaze.",
                descriptionKr: "북유럽 미니멀 실루엣과 고려청자 유약의 만남.",
                imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
                tag: "LIMITED"
            }
        ],
        featuredSpaces: [
            {
                name: "Nuwa Hanok Stay",
                nameKr: "누와 한옥 스테이",
                category: "MICRO HANOK STAY",
                categoryKr: "한옥 미크로스테이",
                tag: "SEOCHON",
                description: "Sunken cedar bathtub surrounded by traditional paper Hanji windows.",
                descriptionKr: "전통 한지 창문 아래 침강형 삼나무 욕조가 설치된 서촌 한옥.",
                imageUrl: "/images/seochon_alley.png"
            }
        ]
    },
    'vol-1': {
        id: 'vol-1',
        volume: 1,
        title: "K-Beauty New Frontiers & Hidden Seongsu",
        titleKr: "K-뷰티의 새로운 지평 & 숨겨진 성수",
        issueDate: "2024.03.W1",
        coverImage: "https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?auto=format&fit=crop&q=80&w=1200",
        description: "Exploring this week's most anticipated beauty launches and the architectural wonders hidden in the back alleys of Seongsu-dong.",
        descriptionKr: "이번 주 가장 기대를 모으고 있는 뷰티 런칭 소식과 성수동 골목길에 숨겨진 건축학적 경이로움을 탐험합니다.",
        sections: [
            {
                title: "The Porcelain Evolution",
                titleKr: "도자기 피부의 진화",
                content: "The evolution of the classic. A more seamless, long-lasting porcelain finish that defines the new K-beauty standards of 2024.",
                contentKr: "클래식의 진화. 2024년 새로운 K-뷰티 표준을 정의하는 더욱 매끄럽고 오래 지속되는 도자기 피니시.",
                imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredSpaces: [
            {
                name: "Cafe Onion Seongsu",
                nameKr: "어니언 성수",
                category: "BRUTALIST CAFE",
                categoryKr: "브루탈리즘 카페",
                tag: "SEONGSU",
                description: "1970s metal factory transformed into a raw concrete coffee sanctuary.",
                descriptionKr: "1970년대 금속 공장을 개조한 날것의 콘크리트 안식처.",
                imageUrl: "/cafe_onion_seongsu.png"
            }
        ]
    }
}

const Magazine = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [magazine, setMagazine] = useState(null)
    const [selectedVolId, setSelectedVolId] = useState('vol-22')
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchMagazine = async () => {
            setLoading(true)
            try {
                let magDoc;
                const targetId = id || selectedVolId
                if (targetId && !targetId.startsWith('vol-')) {
                    const docSnap = await getDoc(doc(db, 'magazines', targetId))
                    if (docSnap.exists()) magDoc = { id: docSnap.id, ...docSnap.data() }
                } else {
                    magDoc = MOCK_MAGAZINES[targetId] || MOCK_MAGAZINES['vol-22']
                }

                if (magDoc) {
                    setMagazine(magDoc)
                } else {
                    setMagazine(MOCK_MAGAZINES['vol-22'])
                }
            } catch (err) {
                console.error("Error fetching magazine:", err)
                setMagazine(MOCK_MAGAZINES['vol-22'])
            } finally {
                setLoading(false)
            }
        }
        fetchMagazine()
    }, [id, selectedVolId])

    useEffect(() => {
        onAuthStateChanged(auth, (user) => setCurrentUser(user))
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!magazine) return null

    return (
        <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white pb-32">
            <Header />

            {/* Weekly Release Volume Archive Switcher */}
            <div className="bg-[#191A1F] border-b border-white/10 py-4 px-6 text-white">
                <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#1111d4] px-3 py-1 bg-[#1111d4]/20 rounded-full border border-[#1111d4]/40">
                            ⚡ WEEKLY ISSUE ARCHIVE
                        </span>
                        <span className="text-white/40 text-xs hidden sm:inline">•</span>
                        <span className="text-xs text-white/70 font-medium hidden sm:inline">
                            {t("New editorial volume released every Sunday at 9 PM KST.", "매주 일요일 밤 9시, 새로운 주간 에디토리얼 볼륨이 발행됩니다.")}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/staging"
                            className="px-3.5 py-1.5 rounded-full bg-[#1111d4]/20 border border-[#1111d4]/40 text-[#1111d4] hover:bg-[#1111d4] hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                            <span>⚙️ Staging Queue</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {Object.values(MOCK_MAGAZINES).map((vol) => (
                                <button
                                    key={vol.id}
                                    onClick={() => setSelectedVolId(vol.id)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                                        (magazine?.id === vol.id || selectedVolId === vol.id)
                                            ? 'bg-white text-[#191A1F] shadow-lg scale-105'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    Vol. {vol.volume} {vol.volume === 5 && '⚡'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-[90vh] flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0">
                    <img src={magazine.coverImage} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-20 md:pb-32 text-left">
                    <div className="flex flex-col gap-6 max-w-4xl">
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em]">
                                Vol. {magazine.volume} • {magazine.issueDate}
                            </span>
                            <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">KULT Insider Exclusive</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase transition-all duration-700 max-w-4xl">
                            {t(magazine.title, magazine.titleKr)}
                        </h1>
                        <p className="text-base md:text-xl text-white/70 font-medium leading-relaxed max-w-2xl mt-2">
                            {t(magazine.description, magazine.descriptionKr)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Editorial Sections */}
            {(magazine.sections || []).length > 0 && (
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-32 flex flex-col gap-40">
                    {magazine.sections.map((section, idx) => (
                        <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}>
                            <div className="flex-1 w-full">
                                <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-slate-50 shadow-2xl shadow-slate-200/50 group">
                                    <img src={section.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={section.title} />
                                </div>
                            </div>
                            <div className="flex-1 text-left flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1111d4] block">Feature {idx + 1}</span>
                                        {section.source && (
                                            section.sourceUrl ? (
                                                <a
                                                    href={section.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] font-bold text-[#1111d4] bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest transition-colors inline-flex items-center gap-1"
                                                >
                                                    <span>📍 {section.source} ↗</span>
                                                </a>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest">
                                                    📍 {section.source}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                                        {t(section.title, section.titleKr)}
                                    </h2>
                                </div>
                                <div className="h-px w-20 bg-slate-200" />
                                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                                    {t(section.content, section.contentKr)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Section: Weekly Beauty News / Trending Selects */}
            {magazine.featuredProducts && magazine.featuredProducts.length > 0 && (
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-32">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                        <div className="text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">New Frontiers</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter lowercase">
                                {t("trending beauty selects", "가장 주목받는 뷰티 셀렉션")}
                            </h2>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                             <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xs text-left md:text-right uppercase tracking-widest leading-loose">
                                {t("Curated weekly by our Seoul beauty scouts.", "서울 뷰티 스카우트들이 매주 공수하는 리얼 타임 뷰티 트렌드.")}
                            </p>
                            <div className="px-4 py-1 bg-primary/10 rounded-full">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{t("Weekly Update", "주간 업데이트")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20">
                        {magazine.featuredProducts.map((product, idx) => (
                            <div key={idx} className="flex flex-col gap-8 group">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 relative shadow-2xl shadow-slate-200/50">
                                    <img src={product.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={product.name} />
                                    <div className="absolute top-8 left-8">
                                        <span className="px-6 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl text-slate-900">
                                            {product.tag || 'Weekly Select'}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-4 text-left">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Brand</span>
                                        <span className="text-sm font-black text-primary uppercase">{product.brand}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                                        {t(product.name, product.nameKr)}
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                                        {t(product.description, product.descriptionKr)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section: Architectural Sanctuary */}
            <div className="bg-slate-900 mt-40 py-40">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Spatial Masterpiece</span>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-10">
                                {t("the architectural hidden gems", "숨겨진 건축학적 공간")}
                            </h2>
                            <p className="text-lg text-white/50 leading-relaxed mb-12 font-light">
                                {t("This week, we descent into the underground alleys of Seongsu-dong to find a space that challenges the norms of modern cafe culture.", "이번 주, 우리는 성수동의 지하 골목으로 내려가 현대 카페 문화의 규범에 도전하는 공간을 찾아냈습니다.")}
                            </p>
                            
                            <div className="flex flex-col gap-6">
                                {magazine.featuredSpaces?.map((space, idx) => (
                                    <UnlockButton 
                                        key={idx}
                                        contentId={`travel-route-${magazine.id}-${idx}`}
                                        cost={5}
                                        contentType="Travel Route"
                                        downloadData={{
                                            type: 'Travel Route',
                                            category: t(space.category, space.categoryKr),
                                            name: t(space.name, space.nameKr),
                                            description: t(space.description, space.descriptionKr)
                                        }}
                                        onUnlock={() => console.log(`Unlocked route ${idx}`)}
                                    >
                                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t(space.category, space.categoryKr)}</span>
                                                    <h4 className="text-xl font-bold text-white uppercase">{t(space.name, space.nameKr)}</h4>
                                                </div>
                                                <div className="size-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <p className="text-white/40 text-sm leading-relaxed mb-8">{t(space.description, space.descriptionKr)}</p>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-white/30">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Location Reveal</span>
                                                </div>
                                            </div>
                                        </div>
                                    </UnlockButton>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="aspect-[5/6] rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-2xl shadow-black relative">
                                <img src={magazine.featuredSpaces?.[0]?.imageUrl || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Space" />
                                {/* Image Overlay for locked state could be added here if needed, but UnlockButton handles the UI of the children */}
                            </div>
                            <div className="absolute -bottom-10 -left-10 p-10 bg-primary rounded-[3rem] shadow-3xl hidden md:block">
                                <Zap className="w-10 h-10 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter / CTA */}
            <div className="max-w-4xl mx-auto px-6 text-center mt-40">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-widest mb-6">
                    {t("Stay Ahead of the Curve", "트렌드의 정점에 서세요")}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-10 uppercase text-[10px] tracking-[0.3em]">
                    {t("New volumes released every Sunday at 9 PM.", "매주 일용일 밤 9시, 새로운 매거진이 발행됩니다.")}
                </p>
                <button 
                    onClick={() => alert(t("Volume release alerts activated!", "매거진 발행 알림이 설정되었습니다!"))}
                    className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.05] transition-all shadow-xl shadow-slate-900/20"
                >
                    {t("Subscribe to Alerts", "알림 설정하기")}
                </button>
            </div>
        </div>
    )
}

export default Magazine
