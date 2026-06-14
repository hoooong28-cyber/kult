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

const MOCK_MAGAZINE = {
    volume: 1,
    title: "K-Beauty New Frontiers & Hidden Seongsu",
    titleKr: "K-뷰티의 새로운 지평 & 숨겨진 성수",
    issueDate: "2024.03.W3",
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
        },
        {
            title: "Floral Essence District",
            titleKr: "플로럴 에센스 디스트릭트",
            content: "Discover the power of rare Korean botanicals concentrated in a single drop of this revolutionary serum.",
            contentKr: "혁신적인 세럼 한 방울에 응축된 희귀한 한국 식물 성분의 힘을 발견해보세요.",
            imageUrl: "https://images.unsplash.com/photo-1594125355630-94824244aa16?auto=format&fit=crop&q=80&w=800"
        }
    ],
    featuredSpaces: [
        {
            name: "Geometric Sanctuary",
            category: "CONCEPT STORE",
            tag: "HIDDEN",
            description: "A subterranean sanctuary inspired by Brutalist caves. Accessible only through a nondescript steel door.",
            imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800"
        }
    ]
}

const Magazine = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [magazine, setMagazine] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchMagazine = async () => {
            setLoading(true)
            try {
                let magDoc;
                if (id) {
                    const docSnap = await getDoc(doc(db, 'magazines', id))
                    if (docSnap.exists()) magDoc = { id: docSnap.id, ...docSnap.data() }
                } else {
                    // Fetch latest
                    const q = query(collection(db, 'magazines'), orderBy('volume', 'desc'), limit(1))
                    const snapshot = await getDocs(q)
                    if (!snapshot.empty) magDoc = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
                }

                if (magDoc) {
                    setMagazine(magDoc)
                } else {
                    console.log('Using mock magazine data as fallback')
                    setMagazine(MOCK_MAGAZINE)
                }
            } catch (err) {
                console.error("Error fetching magazine:", err)
                setMagazine(MOCK_MAGAZINE)
            } finally {
                setLoading(false)
            }
        }
        fetchMagazine()
    }, [id])

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

            {/* Editorial Hero */}
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
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase transition-all duration-700">
                            {t(magazine.title, magazine.titleKr)}
                        </h1>
                        <p className="text-lg md:text-2xl text-white/70 font-medium leading-relaxed max-w-2xl mt-4">
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
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block">Feature {idx + 1}</span>
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
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
                <button className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.05] transition-all shadow-xl shadow-slate-900/20">
                    {t("Subscribe to Alerts", "알림 설정하기")}
                </button>
            </div>
        </div>
    )
}

export default Magazine
