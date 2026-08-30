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
    'vol-1': {
        id: 'vol-1',
        volume: 1,
        title: "시간의 위엄을 깎아내는 271년의 아티잔십: 바쉐론 콘스탄틴 <ART OF TIME>",
        titleKr: "시간의 위엄을 깎아내는 271년의 아티잔십: 바쉐론 콘스탄틴 <ART OF TIME: 에나멜드 마스터피스> 서울 전시",
        issueDate: "DAILY BRAND ISSUE: 2026. 8. 30.",
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vacheron_Constantin_Patrimony_gold_watch.jpg",
        description: "Vacheron Constantin <ART OF TIME: Enamelled Masterpieces> Exhibition at Maison 1755 Seoul (2026.9.5 - 9.22).",
        descriptionKr: "바쉐론 콘스탄틴의 271년 전통 에나멜링 아티잔십과 한국 프라이빗 컬렉션 최초 공개: 메종 1755 서울 헤리티지 전시 비평 & 3-Photo 비주얼 리포트.",
        sections: [
            {
                title: "시간의 위엄을 깎아내는 271년의 아티잔십: 바쉐론 콘스탄틴 <ART OF TIME> 서울 전시",
                titleKr: "시간의 위엄을 깎아내는 271년의 아티잔십: 바쉐론 콘스탄틴 <ART OF TIME: 에나멜드 마스터피스> 서울 전시",
                source: "SEOUL TREND RADAR | LUXURY HOROLOGY",
                sourceUrl: "https://www.vacheron-constantin.com/kr/ko/",
                content: `모든 것이 0과 1의 디지털 픽셀로 순간 삭제되는 초격차의 시대, 우리는 왜 271년 동안 멈추지 않고 째깍이는 메커니컬 무브먼트의 아날로그 진동에 이토록 강렬하게 매료되는가? 스위스 하이 워치메이킹 메종 바쉐론 콘스탄틴(Vacheron Constantin)이 서울 메종 1755에서 국내 두 번째 공공 전시 <ART OF TIME: 에나멜드 마스터피스>를 공개합니다.\n\n📍 [EXHIBITION & VISITOR GUIDE]\n• 전시명 (Exhibition): 바쉐론 콘스탄틴 <ART OF TIME: 에나멜드 마스터피스>\n• 장소 (Location): 서울 강남구 압구정로 430, 메종 1755 서울 (Maison 1755 Seoul)\n• 기간 (Period): 2026. 09. 05. - 2026. 09. 22. (공식 사전 예약 오픈)\n• 핵심 포인트 (Key Highlight): 미니어처 페인팅, 샹르베, 클루아조네, 그리자이유 등 4대 에나멜링 기법 타임피스 및 한국 컬렉터 소장 프라이빗 컬렉션 대중 최초 공개\n\n이번 전시의 핵심은 수작업으로 에나멜 유약을 얹어 800도 가마에서 구워낸 영롱한 파티나와 노출 칼라트라바 케이스 속에서 톱니바퀴처럼 정교하게 맞물리는 컴플리케이션 아키텍처에 있습니다. 시속 300km로 질주하는 서울 한복판에서, 바쉐론 콘스탄틴의 메종 1755 공간은 휘발하는 유행에 지친 글로벌 방문객들에게 영속성(Permanence)의 가치가 무엇인지를 무언의 조각으로 증명합니다.\n\n이번 전시는 2026년 서울에서 경험할 수 있는 최고의 럭셔리 호놀로지 성소입니다. 아날로그 톱니바퀴가 완성하는 둔탁하지만 고귀한 시간의 위엄 속에서, 21세기 인간이 소멸해 가는 감각의 여백을 되찾는 영적 안식을 직접 확인해보시길 바랍니다.`,
                contentKr: `모든 것이 0과 1의 디지털 픽셀로 순간 삭제되는 초격차의 시대, 우리는 왜 271년 동안 멈추지 않고 째깍이는 메커니컬 무브먼트의 아날로그 진동에 이토록 강렬하게 매료되는가? 스위스 하이 워치메이킹 메종 바쉐론 콘스탄틴(Vacheron Constantin)이 서울 메종 1755에서 국내 두 번째 공공 전시 <ART OF TIME: 에나멜드 마스터피스>를 공개합니다.\n\n📍 [EXHIBITION & VISITOR GUIDE]\n• 전시명 (Exhibition): 바쉐론 콘스탄틴 <ART OF TIME: 에나멜드 마스터피스>\n• 장소 (Location): 서울 강남구 압구정로 430, 메종 1755 서울 (Maison 1755 Seoul)\n• 기간 (Period): 2026. 09. 05. - 2026. 09. 22. (공식 사전 예약 오픈)\n• 핵심 포인트 (Key Highlight): 미니어처 페인팅, 샹르베, 클루아조네, 그리자이유 등 4대 에나멜링 기법 타임피스 및 한국 컬렉터 소장 프라이빗 컬렉션 대중 최초 공개\n\n이번 전시의 핵심은 수작업으로 에나멜 유약을 얹어 800도 가마에서 구워낸 영롱한 파티나와 노출 칼라트라바 케이스 속에서 톱니바퀴처럼 정교하게 맞물리는 컴플리케이션 아키텍처에 있습니다. 시속 300km로 질주하는 서울 한복판에서, 바쉐론 콘스탄틴의 메종 1755 공간은 휘발하는 유행에 지친 글로벌 방문객들에게 영속성(Permanence)의 가치가 무엇인지를 무언의 조각으로 증명합니다.\n\n이번 전시는 2026년 서울에서 경험할 수 있는 최고의 럭셔리 호놀로지 성소입니다. 아날로그 톱니바퀴가 완성하는 둔탁하지만 고귀한 시간의 위엄 속에서, 21세기 인간이 소멸해 가는 감각의 여백을 되찾는 영적 안식을 직접 확인해보시길 바랍니다.`,
                editorQuoteKr: "“모든 것이 픽셀로 소멸하는 시대, 271년 기계식 무브먼트가 들려주는 아날로그 시간의 위엄.” — Chief Editorial Director",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vacheron_Constantin_Patrimony_gold_watch.jpg",
                gallery: [
                    "https://upload.wikimedia.org/wikipedia/commons/4/47/Vacheron_Constantin_Patrimony_gold_watch.jpg",
                    "https://upload.wikimedia.org/wikipedia/commons/c/c5/Vacheron_Constantin_Americaine_del_1921.jpg",
                    "https://upload.wikimedia.org/wikipedia/commons/3/30/Particolare_del_Vacheron_Constantin_ref._6087.jpg"
                ]
            }
        ],
        featuredProducts: [
            {
                brand: "VACHERON CONSTANTIN SEOUL",
                name: "시간의 위엄을 깎아내는 271년의 아티잔십: 바쉐론 콘스탄틴 <ART OF TIME>",
                nameKr: "시간의 위엄을 깎아내는 271년의 아티잔십: 바쉐론 콘스탄틴 <ART OF TIME>",
                description: "Official Direct Link: https://www.vacheron-constantin.com/kr/ko/",
                descriptionKr: "바쉐론 콘스탄틴 공식 팩트 검증 1:1 직통 딥링크 (서울 강남구 압구정로 430 메종 1755 서울)",
                sourceUrl: "https://www.vacheron-constantin.com/kr/ko/",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vacheron_Constantin_Patrimony_gold_watch.jpg",
                tag: "DAILY BRAND"
            }
        ]
    }
}

const Magazine = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [magazine, setMagazine] = useState(null)
    const [selectedVolId, setSelectedVolId] = useState('vol-1')
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
                    magDoc = MOCK_MAGAZINES[targetId] || MOCK_MAGAZINES['vol-1']
                }

                if (magDoc) {
                    setMagazine(magDoc)
                } else {
                    setMagazine(MOCK_MAGAZINES['vol-1'])
                }
            } catch (err) {
                console.error("Error fetching magazine:", err)
                setMagazine(MOCK_MAGAZINES['vol-1'])
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

    const activeMag = magazine || MOCK_MAGAZINES['vol-22'] || MOCK_MAGAZINES['vol-21']

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
                    <img src={activeMag.coverImage} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-20 md:pb-32 text-left">
                    <div className="flex flex-col gap-6 max-w-4xl">
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em]">
                                Vol. {activeMag.volume} • {activeMag.issueDate}
                            </span>
                            <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">KULT Insider Exclusive</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase transition-all duration-700 max-w-4xl">
                            {t(activeMag.title, activeMag.titleKr)}
                        </h1>
                        <p className="text-base md:text-xl text-white/70 font-medium leading-relaxed max-w-2xl mt-2">
                            {t(activeMag.description, activeMag.descriptionKr)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Editorial Sections */}
            {(activeMag.sections || []).length > 0 && (
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-32 flex flex-col gap-40">
                    {activeMag.sections.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-12">
                            <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
                                <div className="flex-1 w-full">
                                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl shadow-slate-200/50 group">
                                        <img src={section.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={section.title} />
                                    </div>
                                </div>
                                <div className="flex-1 text-left flex flex-col gap-8">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1111d4] block">FEATURE EDITION</span>
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
                                    <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-line text-left">
                                        {t(section.content, section.contentKr)}
                                    </p>
                                    {section.editorQuoteKr && (
                                        <div className="p-5 rounded-2xl bg-slate-900 text-white font-bold text-xs md:text-sm leading-relaxed border border-slate-800 text-left">
                                            {section.editorQuoteKr}
                                        </div>
                                    )}
                                    {section.sourceUrl && (
                                        <a
                                            href={section.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                if (section.sourceUrl) {
                                                    window.open(section.sourceUrl, '_blank', 'noopener,noreferrer');
                                                }
                                            }}
                                            className="mt-2 inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-[#1111d4] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/20 group w-fit cursor-pointer"
                                        >
                                            <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                                            <span>🔗 VERIFIED ARTICLE DIRECT LINK (원문 딥링크 1:1 이동) ↗</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Multi-Photo Gallery Architecture */}
                            {section.gallery && section.gallery.length > 0 && (
                                <div className="mt-8 flex flex-col gap-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-left">EXHIBITION VISUAL GALLERY ({section.gallery.length} PHOTOS)</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {section.gallery.map((imgUrl, gIdx) => (
                                            <div key={gIdx} className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-lg group">
                                                <img src={imgUrl} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt={`Gallery ${gIdx}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Section: Weekly Beauty News / Trending Selects */}
            {activeMag.featuredProducts && activeMag.featuredProducts.length > 0 && (
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
                        {activeMag.featuredProducts.map((product, idx) => (
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
                                {activeMag.featuredSpaces?.map((space, idx) => (
                                    <UnlockButton 
                                        key={idx}
                                        contentId={`travel-route-${activeMag.id}-${idx}`}
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
                                <img src={activeMag.featuredSpaces?.[0]?.imageUrl || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Space" />
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
