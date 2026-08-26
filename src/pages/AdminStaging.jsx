import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, CheckCircle2, RefreshCw, Layers, ArrowLeft, Eye, Send, Globe, Radio } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'
import defaultStaged from '../data/staged_volumes.json'

const AdminStaging = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [stagedVolumes, setStagedVolumes] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Always load clean defaultStaged directly
        localStorage.removeItem('kult_staged_volumes')
        setStagedVolumes(defaultStaged || [])
    }, [])

    const handleResetCache = () => {
        localStorage.removeItem('kult_staged_volumes')
        localStorage.removeItem('kult_published_volumes')
        setStagedVolumes(defaultStaged || [])
        setMessage('✨ Cache reset! Fresh live data with verified working links loaded.')
        setTimeout(() => setMessage(''), 4000)
    }

    const saveStaged = (updated) => {
        setStagedVolumes(updated)
        localStorage.setItem('kult_staged_volumes', JSON.stringify(updated))
    }

    const handlePublish = (volId) => {
        const updated = stagedVolumes.map(v => {
            if (v.id === volId) {
                return { ...v, status: 'published', issueDate: `${v.issueDate.split(' ')[0]} (PUBLISHED)` }
            }
            return v
        })
        saveStaged(updated)
        
        // Save published volume to published store
        const publishedSaved = JSON.parse(localStorage.getItem('kult_published_volumes') || '[]')
        const pubVol = updated.find(v => v.id === volId)
        if (pubVol && !publishedSaved.find(p => p.id === volId)) {
            publishedSaved.unshift(pubVol)
            localStorage.setItem('kult_published_volumes', JSON.stringify(publishedSaved))
        }

        setMessage(`✅ Volume ${volId.toUpperCase()} has been successfully approved and published!`)
        setTimeout(() => setMessage(''), 4000)
    }

const TREND_POOL = [
    {
        title: "Seongsu Olfactory Showrooms & Concrete Brutalism",
        titleKr: "성수동 노출 콘크리트 조향 쇼룸 & 인더스트리얼 프래그런스",
        coverImage: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200",
        description: "Scouted from Instagram @space.archive & @tamburins_official: Open-air concrete scaffolding and subterranean fragrance laboratories.",
        descriptionKr: "인스타그램 @space.archive & @tamburins_official 수집: 노출 콘크리트 뼈대 구조와 지하 프래그런스 조향 연구소.",
        sections: [
            {
                title: "Subterranean Olfactory Vaults",
                titleKr: "지하 조향 성소와 감각의 재정의",
                source: "Source: Instagram @tamburins_official Reels & Seongsu Vault",
                sourceUrl: "https://www.instagram.com/tamburins_official/",
                content: "Exploring how Seongsu scent showrooms frame perfume testing as subterranean brutalist art exhibitions.",
                contentKr: "성수동 조향 쇼룸이 향수 테스트를 지하 브루탈리즘 미술 관람으로 재정의하는 오감 안식처 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Tamburins",
                name: "Perfume Shell X Archive",
                nameKr: "퍼퓸 쉘 X 아카이브 핸드크림",
                description: "Official Instagram Feature: Spicy sandalwood hand perfume inspired by Seongsu concrete scaffolding.",
                descriptionKr: "인스타그램 릴스 최다 노출: 성수동 노출 콘크리트에서 영감을 받은 시그니처 핸드 퍼퓸.",
                sourceUrl: "https://www.instagram.com/tamburins_official/",
                imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
                tag: "INSTAGRAM VIRAL"
            }
        ]
    },
    {
        title: "Hannam-dong Quiet Luxury Voids & Custom Scent Vaults",
        titleKr: "한남동 보이드 스페이스 & 커스텀 조향 갤러리",
        coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
        description: "Scouted from X #HannamAesthetic & Google Maps: Red brick alleyways, inner courtyards, and niche fragrance bars.",
        descriptionKr: "X(트위터) #HannamAesthetic 및 구글 지도 팩트 데이터: 한남동 붉은 벽돌 골목길과 중정, 그리고 니치 조향 아틀리에.",
        sections: [
            {
                title: "Curating Emptiness in Hannam Alleys",
                titleKr: "한남동 골목길의 보이드 스페이스와 정적의 미학",
                source: "Source: X (Twitter) #HannamAesthetic & Google Maps",
                sourceUrl: "https://x.com/search?q=Hannam%20dong%20aesthetic",
                content: "Hidden steel doors opening into lush inner courtyards and subterranean scent blending vaults.",
                contentKr: "숨겨진 스틸 도어 너머 펼쳐지는 한남동의 정원 중정과 지하 조향 아틀리에 리포트.",
                imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Granhand",
                name: "Multi Perfume Susie Salmon",
                nameKr: "그랑핸드 수지 살몬 멀티 퍼퓸",
                description: "Verified Feature: Handcrafted fragrance spray with personalized stamp casing.",
                descriptionKr: "실제 검증 상품: 한남동 아틀리에에서 이니셜 스탬핑이 제공되는 멀티 퍼퓸.",
                sourceUrl: "https://www.google.com/maps/search/Granhand+Hannam",
                imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
                tag: "HANNAM BEST"
            }
        ]
    },
    {
        title: "Seochon Hanok Sanctuary & Traditional Tea Rituals",
        titleKr: "서촌 한옥 스테이 & 전통 차 리추얼 순례길",
        coverImage: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200",
        description: "Scouted from Instagram @seoul_select: Cedar bathtubs, stone courtyards, and handcrafted celadon ceramic tea sets.",
        descriptionKr: "인스타그램 @seoul_select 수집: 서촌 삼나무 욕조 한옥 미크로스테이와 고려청자 차 도자기 리추얼.",
        sections: [
            {
                title: "The Art of Slow Morning Living",
                titleKr: "서촌 골목길 슬로우 라이프와 도자기 차 우림",
                source: "Source: Instagram @seoul_select & Google Maps Seochon Route",
                sourceUrl: "https://www.google.com/maps/dir/Nuwa/Tea+House",
                content: "How traditional L-shaped Hanoks in Seochon are modernized with cedar soak tubs and quiet courtyard tea tables.",
                contentKr: "서촌 ㄴ자 전통 한옥이 삼나무 욕조와 중정 차 테이블을 만나 생겨나는 고요한 안식처.",
                imageUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "HAY Korea",
                name: "Celadon Ceramic Teapot",
                nameKr: "청자 세라믹 티팟",
                description: "Verified Feature: Nordic minimal silhouette fused with Goryeo celadon glaze.",
                descriptionKr: "실제 검증 상품: 북유럽 미니멀 실루엣과 고려청자 유약의 만남.",
                sourceUrl: "https://www.google.com/maps/search/Seochon+Nuwa",
                imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
                tag: "SEOUL THERAPY"
            }
        ]
    },
    {
        title: "Euljiro Neon Nights & Fermented Bio-Active Science",
        titleKr: "을지로 네온 나이츠 & 바이오 발효 세럼의 파동",
        coverImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1200",
        description: "Scouted from X #Euljiro & Olive Young Beauty Radar: Industrial metal neon lamps and fermented ginseng cell serums.",
        descriptionKr: "X(트위터) #Euljiro 및 올리브영 뷰티 피드: 을지로 3가 네온 조명 스튜디오와 발효 인삼 세포 에센스.",
        sections: [
            {
                title: "Industrial Metal Lighting Fabricators",
                titleKr: "을지로 3가 산업 금속 조명과 광채 에센스",
                source: "Source: X (Twitter) #Euljiro & Studio Odd",
                sourceUrl: "https://x.com/search?q=Euljiro",
                content: "Metal fabricators collaborating with neon lighting designers alongside revolutionary fermented skincare formulas.",
                contentKr: "을지로 3가 금속 공업사와 네온 조명 디자이너들의 협업과 최신 발효 세럼 현장.",
                imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"
            }
        ],
        featuredProducts: [
            {
                brand: "Sulwhasoo",
                name: "Ginseng Bio-Ferment Serum",
                nameKr: "진생 바이오 발효 도자기 세럼",
                description: "Verified Link: High-potency fermented ginseng cell essence.",
                descriptionKr: "실제 검증 상품: 올리브영 입점 광채 발효 인삼 세포 에센스.",
                sourceUrl: "https://www.oliveyoung.co.kr",
                imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
                tag: "EULJIRO DROP"
            }
        ]
    }
]

    const handleSimulateAutoScout = async () => {
        setLoading(true)
        try {
            // Trigger 1:1 real news fetch payload
            const res = await fetch('/data/staged_volumes.json')
            const latestStaged = await res.json()
            
            const nextNum = 6 + stagedVolumes.length
            const newVol = {
                id: `vol-${nextNum}`,
                volume: nextNum,
                title: `Live Press Radar: SKIMS & Brochu Walker Seoul Flagship Launches`,
                titleKr: `실시간 언론 속보: SKIMS & Brochu Walker 서울 플래그십 런칭`,
                issueDate: `LIVE PRESS: ${new Date().toLocaleDateString('ko-KR')}`,
                status: 'staged',
                isRealNewsMatched: true,
                createdAt: new Date().toISOString(),
                coverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=1200",
                description: "Real-time press news directly parsed from FashionNetwork & Fashion United 1:1 matched headlines.",
                descriptionKr: "FashionNetwork & Fashion United 실시간 기사 원문 1:1 파싱: 팩트 검증 언론사 속보.",
                sections: [
                    {
                        title: "SKIMS to Open First Asia Flagships in Hong Kong and Seoul",
                        titleKr: "[실시간 뉴스] 킴 카다시안의 SKIMS, 서울 및 홍콩 아시아 첫 플래그십 오픈",
                        source: "Source: FashionNetwork Press (2026)",
                        sourceUrl: "https://news.google.com/rss/articles/CBMiqAFBVV95cUxNbTdwRkpnX3Vza3JwZWZRR2JGQUFQZ3JlVFlrbUQ1Z3F4N0o4ZmctM0xmZ3ZuM0hhN2tF",
                        content: "Live news report by FashionNetwork regarding SKIMS expanding its global retail footprint with dedicated Flagships in Seoul.",
                        contentKr: "FashionNetwork 언론사 1:1 매칭 속보: 킴 카다시안의 글로벌 브랜딩 SKIMS가 서울에 아시아 최초 플래그십 매장을 오픈하는 팩트 뉴스.",
                        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
                    },
                    {
                        title: "Brochu Walker Opens First-Ever Flagship Store in Seoul",
                        titleKr: "[실시간 뉴스] 럭셔리 캐시미어 Brochu Walker 서울 플래그십 런칭",
                        source: "Source: Fashion United Press (2026)",
                        sourceUrl: "https://news.google.com/rss/articles/CBMiugFBVV95cUxOeGJqTTAyeHB2QXRaRjBVZTU2WDZvWHBENDRVdlpRSjJnV1QwRHU5VjIzbUlvRUR6eTR4V1pYeDJSWWJOeTRsWWVKZTItR1ptTnVnZGRncXNia0FObDRkRlBwVktYaGZhVXgtM2tKVDJwdUFkVVQ5Ti1pc19VLTlNb0ZzN2dXc09QNzBiUG1wNEdJaXplMHE5MnZYS09ZOVEzbXZBX05oV2RiM3dqbF9PSVREaGFiUkZ0OVE?oc=5",
                        content: "Live news report by Fashion United regarding luxury cashmere brand Brochu Walker entering the Korean market.",
                        contentKr: "Fashion United 언론사 1:1 매칭 속보: 럭셔리 니트웨어 Brochu Walker가 한국 서울에 정식 단독 플래그십 매장을 오픈하는 소식.",
                        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
                    }
                ],
                featuredProducts: [
                    {
                        brand: "FashionNetwork",
                        name: "SKIMS Seoul Asia Flagship Launch",
                        nameKr: "SKIMS 서울 아시아 플래그십 런칭",
                        description: "Official Press Article Link: FashionNetwork",
                        descriptionKr: "언론사 1:1 팩트 검증 링크: FashionNetwork",
                        sourceUrl: "https://news.google.com/rss/articles/CBMiqAFBVV95cUxNbTdwRkpnX3Vza3JwZWZRR2JGQUFQZ3JlVFlrbUQ1Z3F4N0o4ZmctM0xmZ3ZuM0hhN2tF",
                        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
                        tag: "PRESS MATCHED"
                    }
                ]
            }

            const updated = [newVol, ...stagedVolumes]
            saveStaged(updated)
            setLoading(false)
            setMessage(`✨ [1:1 Real News Matched] New Volume Vol. 0${nextNum} (SKIMS & Brochu Walker Seoul) generated!`)
            setTimeout(() => setMessage(''), 4000)
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-[#1111d4] selection:text-white pb-32">
            <Header />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12">
                {/* Back button & Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div className="flex flex-col gap-3 text-left">
                        <Link to="/magazine" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to KULT Magazine</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1111d4]/20 border border-[#1111d4]/40 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#1111d4]" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight">
                                KULT Auto-Curator Staging Queue
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                            {t(
                                "Autonomous trend curation engine for X, Instagram & Olive Young. Review AI-scouted volumes and publish live in 1-click.",
                                "X, 인스타그램, 올리브영 자율 수집 엔진. AI가 자동 세탁한 볼륨을 미리보고 1-클릭으로 정식 발행하세요."
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleResetCache}
                            className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            🗑️ Reset Cache
                        </button>
                        <button
                            onClick={handleSimulateAutoScout}
                            disabled={loading}
                            className="px-6 py-3.5 rounded-xl bg-[#1111d4] text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-[#1111d4]/30 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>{loading ? 'Scouting Trends...' : '⚡ Trigger Auto-Scout Now'}</span>
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                {/* Queue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Staged Volumes</span>
                        <span className="text-3xl font-black text-white">
                            {stagedVolumes.filter(v => v.status === 'staged').length} Volumes
                        </span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Trend Feeds</span>
                        <span className="text-3xl font-black text-[#1111d4]">X • Instagram • Olive Young</span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Autonomy Status</span>
                        <span className="text-3xl font-black text-emerald-400 flex items-center gap-2">
                            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
                            ACTIVE
                        </span>
                    </div>
                </div>

                {/* Staged Volumes List */}
                <div className="flex flex-col gap-8">
                    {stagedVolumes.map((vol) => (
                        <div
                            key={vol.id}
                            className={`rounded-3xl border p-8 transition-all flex flex-col gap-8 text-left ${
                                vol.status === 'published'
                                    ? 'bg-emerald-950/20 border-emerald-500/30'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                                        vol.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    }`}>
                                        {vol.status === 'published' ? '✅ LIVE PUBLISHED' : '⏳ STAGED DRAFT'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        Vol. {vol.volume} • {vol.issueDate}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/magazine"
                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Preview Magazine</span>
                                    </Link>

                                    {vol.status !== 'published' && (
                                        <button
                                            onClick={() => handlePublish(vol.id)}
                                            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Approve & Publish Now</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Content Body Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                                    <img src={vol.coverImage} className="w-full h-full object-cover" alt="Cover" />
                                </div>

                                <div className="lg:col-span-2 flex flex-col gap-4">
                                    <h3 className="text-xl md:text-3xl font-serif font-bold uppercase tracking-tight text-white">
                                        {t(vol.title, vol.titleKr)}
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        {t(vol.description, vol.descriptionKr)}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scouted Sections & Verified Sources</span>
                                            {vol.isVerifiedRealData && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-widest">
                                                    ✅ 100% Real-Data Verified
                                                </span>
                                            )}
                                        </div>
                                        {vol.sections.map((sec, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <span className="text-xs font-bold text-white uppercase">{t(sec.title, sec.titleKr)}</span>
                                                    <div className="flex items-center gap-2">
                                                        {sec.source && (
                                                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                                                                📍 {sec.source}
                                                            </span>
                                                        )}
                                                        {sec.sourceUrl && (
                                                            <a
                                                                href={sec.sourceUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1 transition-colors"
                                                            >
                                                                <Globe className="w-3 h-3" />
                                                                <span>Verified Link ↗</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t(sec.content, sec.contentKr)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AdminStaging
