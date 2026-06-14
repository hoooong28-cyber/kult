import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Star, MapPin, Heart, ChevronLeft, ArrowRight, Share2,
    Instagram, Globe, ExternalLink, Bookmark, Navigation, AlertCircle
} from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'
import { db } from '../firebase'
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore'

const SpaceDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hasAccess, setHasAccess] = useState(false) // Simulated state for Paywall

    useEffect(() => {
        const fetchSpace = async () => {
            setLoading(true)
            try {
                let targetId = id

                // Fallback for legacy /space/detail path
                if (id === 'detail') {
                    const q = query(collection(db, 'spaces'), limit(1))
                    const snapshot = await getDocs(q)
                    if (!snapshot.empty) {
                        targetId = snapshot.docs[0].id
                    }
                }

                if (targetId && targetId !== 'detail') {
                    const docRef = doc(db, 'spaces', targetId)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        setSpace(docSnap.data())
                    } else {
                        // Fallback: search by title (EN) for legacy/name-based routes
                        const q = query(collection(db, 'spaces'), where('title', '==', decodeURIComponent(targetId)))
                        const snapshot = await getDocs(q)
                        if (!snapshot.empty) {
                            setSpace(snapshot.docs[0].data())
                        } else {
                            setError(t('Information not found.', '정보를 찾을 수 없습니다.'))
                        }
                    }
                } else {
                    setError(t('Please select a space.', '공간을 선택해주세요.'))
                }
            } catch (err) {
                console.error("Error fetching space:", err)
                setError(t('Connection failure.', '연결 실패.'))
            } finally {
                setLoading(false)
            }
        }

        fetchSpace()
        window.scrollTo(0, 0)
    }, [id, t])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !space) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-xl mx-auto px-6 py-32 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("Notice", "안내")}</h2>
                    <p className="text-slate-500 mb-10">{error}</p>
                    <button onClick={() => navigate('/')} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold">
                        {t("Go Home", "홈으로 가기")}
                    </button>
                </div>
            </div>
        )
    }

    const regionLabel = space.region?.charAt(0).toUpperCase() + space.region?.slice(1)

    return (
        <div className="min-h-screen bg-white selection:bg-primary/10 selection:text-primary">
            <Header />

            {/* Content Container */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
                {/* Back Link */}
                <Link to={`/search/${space.region}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide lowercase">{t("Back to list", "목록으로 돌아가기")}</span>
                </Link>

                {/* Hero Section */}
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-auto md:aspect-[21/9] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden mb-12 shadow-sm">
                    <img
                        src={space.imageUrl}
                        className="w-full h-full object-cover"
                        alt={space.title}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="flex flex-col gap-3 text-white text-left">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                                {t(space.category, space.categoryKr || space.category)}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight md:leading-none">
                                {t(space.title, space.titleKr || space.title)}
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-medium opacity-90">
                                <span className="flex items-center gap-1.5 uppercase">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {regionLabel}, Seoul
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left: Main Info (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-16">
                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 lowercase tracking-tight">
                                {t("a story of discovery", "발견의 이야기")}
                            </h2>
                            <div className="relative">
                                <p className={`text-lg md:text-xl text-slate-500 leading-[1.7] whitespace-pre-wrap font-medium ${!hasAccess ? 'h-64 overflow-hidden mask-image-gradient' : 'mb-12'}`} style={!hasAccess ? { WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' } : {}}>
                                    {t(space.description, space.descriptionKr || space.description)}
                                    {!hasAccess && "\n\n" + t("This space is more than just architecture. We dive deep into the philosophy of its creator...", "이 공간은 단순한 건축물 그 이상입니다. 설립자의 철학과 그 이면에 숨겨진 깊은 이야기를 파헤칩니다...")}
                                    {!hasAccess && "\n\n" + t("To uncover the full story, the hidden details, and our exclusive interview, unlock this column.", "전체 스토리와 숨겨진 디테일, 그리고 독점 인터뷰를 확인하시려면 이 칼럼을 잠금 해제하세요.")}
                                </p>
                            </div>

                            {!hasAccess && (
                                <div className="bg-slate-50 rounded-[2rem] p-8 md:p-12 text-center border border-primary/20 shadow-xl mb-12 relative overflow-hidden mt-8">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Orbit className="w-48 h-48 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 relative z-10">{t("Keep reading this column", "이 칼럼을 계속 읽으시겠어요?")}</h3>
                                    <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto relative z-10">{t("Join KULT to unlock the full story, exclusive interviews, and spatial insights.", "KULT 멤버십에 가입하고 전체 스토리와 독점 인터뷰를 확인하세요.")}</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Link to="/subscribe" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/30 transition-all">
                                            {t("Subscribe Now", "멤버십 구독하기")}
                                        </Link>
                                        <Link to="/subscribe" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all">
                                            {t("Use Credits", "크레딧으로 열람")}
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Metadata Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 py-10 border-y border-slate-100 gap-8 sm:gap-0">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">{t("Location", "위치")}</span>
                                    <span className="text-sm font-bold text-slate-900 uppercase">{regionLabel}, KR</span>
                                </div>
                                <div className="flex flex-col gap-2 sm:border-x sm:border-slate-100 sm:px-8">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">{t("Category", "카테고리")}</span>
                                    <span className="text-sm font-bold text-slate-900 uppercase">{t(space.category, space.categoryKr)}</span>
                                </div>
                                <div className="flex flex-col gap-2 sm:pl-8">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">{t("Discovery", "발견일")}</span>
                                    <span className="text-sm font-bold text-slate-900 uppercase">KULT SELECTS #{(id || '072').substring(0, 3)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {space.galleryUrls && space.galleryUrls.length > 0 ? (
                                space.galleryUrls.map((url, idx) => (
                                    <div key={idx} className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                                            alt={`Gallery ${idx + 1}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                                        <img src={space.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" alt="Gallery 1" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                                        <img src={space.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Gallery 2" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="flex flex-col gap-10 text-left">
                        {/* Action Card */}
                        <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100/50">
                            <button className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-4">
                                <Bookmark className="w-4 h-4 fill-white" />
                                {t("Save to Curation", "큐레이션에 저장")}
                            </button>
                            <button className="w-full h-16 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all mb-8">
                                {t("Check Availability", "입장 가능 여부 확인")}
                            </button>

                            {/* Connectivity */}
                            <div className="flex flex-col gap-6 pt-6 border-t border-slate-200/50">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t("Connect", "연결")}</h4>
                                <div className="flex flex-col gap-4">
                                    <a href="#" className="flex items-center justify-between group hover:text-primary transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">{t("Official Website", "공식 웹사이트")}</span>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </a>
                                    <a href="#" className="flex items-center justify-between group hover:text-primary transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Instagram className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">Instagram</span>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Location / Map Widget */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t("Location", "위치")}</h4>
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-slate-300" />
                                </div>
                                {space.googleMapsUrl && (
                                    <a
                                        href={space.googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center"
                                    >
                                        <div className="px-4 py-2 bg-white rounded-full text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            {t("View Map", "지도 보기")}
                                        </div>
                                    </a>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-900 uppercase">{space.region}, SEOUL, KR</span>
                                <span className="text-[10px] text-slate-400 font-medium">37.5446° N, 127.0560° E</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="w-full max-w-[1440px] mx-auto px-12 py-16 mt-32 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3 opacity-30 grayscale contrast-150">
                    <img src="/logo.svg" className="w-6 h-6 grayscale" alt="KULT" />
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-70">© 2024 KULT Media. All rights reserved.</span>
                </div>
                <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <a href="#" className="hover:text-slate-900 transition-colors uppercase">Spaces</a>
                    <a href="#" className="hover:text-slate-900 transition-colors uppercase">Manifesto</a>
                    <a href="#" className="hover:text-slate-900 transition-colors uppercase">Curations</a>
                    <a href="#" className="hover:text-slate-900 transition-colors uppercase">Privacy</a>
                </div>
            </footer>
        </div>
    )
}

export default SpaceDetail
