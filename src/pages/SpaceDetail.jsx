import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    MapPin, ChevronLeft,
    Instagram, Globe, ExternalLink, Bookmark, AlertCircle, Orbit
} from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

// Fallback dummy data indexed by slug
const dummySpaces = {
    'void-space': {
        title: 'Void Space Seoul',
        titleKr: '보이드 스페이스 서울',
        category: 'Architecture',
        categoryKr: '건축',
        region: 'hannam',
        imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000',
        galleryUrls: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'A pioneering architectural studio in the heart of Hannam-dong, where the absence of conventional design elements speaks louder than their presence. Founded in 2018, Void Space Seoul has become a reference point for a generation of Korean designers who believe that emptiness is a form of fullness.',
        descriptionKr: '한남동 중심부에 위치한 선구적인 건축 스튜디오로, 일반적인 디자인 요소의 부재가 존재보다 더 큰 울림을 줍니다. 2018년에 설립된 보이드 스페이스 서울은 비어있음이 가득 참의 한 형태라고 믿는 한국 디자이너 세대의 레퍼런스 포인트가 되었습니다.',
        googleMapsUrl: 'https://maps.google.com'
    },
    'yuyeon-tea-house': {
        title: 'Yuyeon Tea House',
        titleKr: '유연다원',
        category: 'Heritage',
        categoryKr: '헤리티지',
        region: 'gyeongju',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOeAEDReiO56NceRRAI74x11UkMAFpLTD8rCqj6Dt1pbF3arduDR00v0-ywXgvJV8TuH-x6mypHbt2yGFcQ2bkNRhYCFDYAUOO5qlimCTFvJ6yeN0tbXXHhSEv1PrWHsrBqlPg5uc11s0eSQEqTMSAMWxqC_IgFTc8TmkBMAh7gQGCkUbfhDSAy7xMO0NrAsZUO0eX83mN83tQ_lxjJMD1S2abzB2uQmcQmRQxtGUs5jIvKhCMXyT_UoSSIcB0hOsDt4_whSqdSjVN',
        galleryUrls: [],
        description: 'A centuries-old Hanok where the art of tea brewing meets the silence of the surrounding bamboo forest. Nestled deep in Gyeongju\'s historical district, the estate has been passed down through seven generations of the Yuyeon family.',
        descriptionKr: '수백 년 된 한옥에서 차를 우리는 예술과 대나무 숲의 고요함이 만나는 곳입니다. 경주 역사 지구 깊숙이 자리 잡은 이 저택은 유연 가문 7대에 걸쳐 전해 내려왔습니다.',
        googleMapsUrl: 'https://maps.google.com'
    },
    'pine-hideaway': {
        title: 'The Pine Hideaway',
        titleKr: '소나무 은신처',
        category: 'Healing Stay',
        categoryKr: '힐링 스테이',
        region: 'pyeongchang',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnz2ezosgYy1InE6M-vxahUlcD39OD0pvgs5qPupHwpGcZr1Ec3pwOUr1T6MSQydMR9XbCIw-loP0wEBYXtYYZjnGpO0K1a9Fhf--q4V1jW4KyxHNuX1p_Vuu749zGUQFvrKBVkUPN9YNv68yqozKkH86YlL2rpXyYlUXDAjM06W0X1bj6Yg-W6I2PdqzKRbR4-IpYDyvAqljF9nR-t6_JiBngrHivGFtmfN0OI1KLc_Vv_rttoDWEFpYL6tZKE1TwFmhMig6L_y3U',
        galleryUrls: [],
        description: 'Disconnect to reconnect. A glass-walled sanctuary tucked deep into the cedar forests of Gangwon province, where the only sounds are wind, birdsong, and silence.',
        descriptionKr: '연결을 위해 접속을 끊으세요. 강원도 삼나무 숲 깊은 곳에 자리 잡은 유리벽 안식처로, 들리는 소리라곤 바람과 새소리, 그리고 정적뿐입니다.',
        googleMapsUrl: 'https://maps.google.com'
    }
}

const SpaceDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
        const fetchSpace = async () => {
            setLoading(true)
            try {
                // First try Firebase
                const docRef = doc(db, 'spaces', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setSpace(docSnap.data())
                } else if (dummySpaces[id]) {
                    // Fallback to local dummy data
                    setSpace(dummySpaces[id])
                } else {
                    setError(t('Information not found.', '정보를 찾을 수 없습니다.'))
                }
            } catch (err) {
                // On Firebase error, try dummy data fallback
                if (dummySpaces[id]) {
                    setSpace(dummySpaces[id])
                } else {
                    console.error("Error fetching space:", err)
                    setError(t('Connection failure.', '연결 실패.'))
                }
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchSpace()
        } else {
            setError(t('Please select a space.', '공간을 선택해주세요.'))
            setLoading(false)
        }
        window.scrollTo(0, 0)
    }, [id, t])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !space) {
        return (
            <div className="min-h-screen bg-[#fcf9f5]">
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
        <div className="min-h-screen bg-[#fcf9f5] selection:bg-primary/10 selection:text-primary">
            <Header />

            {/* Content Container */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide lowercase">{t("Back to Home", "홈으로 돌아가기")}</span>
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
                                    {regionLabel}, Korea
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
                                <p className={`text-lg md:text-xl text-slate-500 leading-[1.7] whitespace-pre-wrap font-medium ${!hasAccess ? 'h-64 overflow-hidden' : 'mb-12'}`} style={!hasAccess ? { WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' } : {}}>
                                    {t(space.description, space.descriptionKr || space.description)}
                                    {!hasAccess && "\n\n" + t("This space is more than just architecture. We dive deep into the philosophy of its creator, uncovering the rituals, the obsessions, and the quiet revolution happening behind its walls.", "이 공간은 단순한 건축물 그 이상입니다. 창시자의 철학과 의식, 집착, 그리고 그 벽 뒤에서 일어나고 있는 조용한 혁명을 파헤칩니다.")}
                                    {!hasAccess && "\n\n" + t("Exclusive interview. Unseen photographs. The full story — unlocked only for KULT members.", "독점 인터뷰. 비공개 사진들. KULT 멤버에게만 공개되는 완전한 이야기.")}
                                </p>
                            </div>

                            {!hasAccess && (
                                <div className="bg-white rounded-[2rem] p-8 md:p-12 text-center border border-slate-200 shadow-lg mb-12 relative overflow-hidden mt-8">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Orbit className="w-48 h-48 text-primary" />
                                    </div>
                                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">Premium Column</span>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 relative z-10">{t("Keep reading this column", "이 칼럼을 계속 읽으시겠어요?")}</h3>
                                    <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto relative z-10">{t("Join KULT to unlock the full story, exclusive interviews, and spatial insights.", "KULT 멤버십에 가입하고 전체 스토리와 독점 인터뷰를 확인하세요.")}</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Link to="/subscribe" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/30 transition-all">
                                            {t("Subscribe Now", "멤버십 구독하기")}
                                        </Link>
                                        <Link to="/subscribe" className="px-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all">
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
                                    <span className="text-sm font-bold text-slate-900 uppercase">KULT SELECTS #{(id || '072').substring(0, 3).toUpperCase()}</span>
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
                                        <img src={space.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Gallery 2" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="flex flex-col gap-10 text-left">
                        {/* Action Card */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <button className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-8">
                                <Bookmark className="w-4 h-4 fill-white" />
                                {t("Save to Curation", "큐레이션에 저장")}
                            </button>

                            {/* Connectivity */}
                            <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t("Connect", "연결")}</h4>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between group transition-colors cursor-pointer" onClick={() => window.open('https://example.com', '_blank')}>
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">{t("Official Website", "공식 웹사이트")}</span>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                    <div className="flex items-center justify-between group transition-colors cursor-pointer" onClick={() => window.open('https://instagram.com', '_blank')}>
                                        <div className="flex items-center gap-3">
                                            <Instagram className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">Instagram</span>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location / Map Widget */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t("Location", "위치")}</h4>
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer" onClick={() => window.open(space.googleMapsUrl || 'https://maps.google.com', '_blank')}>
                                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-slate-300" />
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="px-4 py-2 bg-white rounded-full text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t("View Map", "지도 보기")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-900 uppercase">{space.region?.toUpperCase()}, KR</span>
                                <span className="text-[10px] text-slate-400 font-medium">37.5446° N, 127.0560° E</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="w-full max-w-[1440px] mx-auto px-12 py-16 mt-32 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3 opacity-60">
                    <Orbit className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-[10px] font-black tracking-widest uppercase">© 2024 KULT Media. All rights reserved.</span>
                </div>
                <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Spaces</span>
                    <span>Manifesto</span>
                    <span>Privacy</span>
                </div>
            </footer>
        </div>
    )
}

export default SpaceDetail
