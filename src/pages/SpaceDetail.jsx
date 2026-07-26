import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    MapPin, ChevronLeft,
    Instagram, Globe, ExternalLink, Bookmark, AlertCircle, Orbit, Clock, Footprints, ShieldCheck, Sparkles, BookOpen, ArrowRight, Share2
} from 'lucide-react'
import Header from '../components/Header'
import ConciergeModal from '../components/ConciergeModal'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'

// Fallback dummy data indexed by slug
const dummySpaces = {
    'seongsu-route': {
        title: '72 Hours in Seongsu: The Brutalist & Sensory Route',
        titleKr: '성수에서의 72시간: 브루탈리즘과 감각의 여정',
        category: 'Curated Route',
        categoryKr: '큐레이션 루트',
        region: 'seongsu',
        distance: '3.2 KM',
        estTime: '6 HOURS',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
        introSubtitle: 'Where time and industry collide into Seoul\'s most avant-garde district.',
        introSubtitleKr: '시간과 산업이 격렬하게 충돌하는 서울에서 가장 전위적인 미학의 지구.',
        introNarrative: `Seongsu-dong is a landscape where time and industry collide. Once filled with metal workshops and shoe factories, it has evolved into Seoul's most avant-garde district. This 72-hour spatial journey is designed for the design-conscious explorer navigating raw concrete cafes, subterranean fragrance showrooms, and curated editorial complexes.`,
        introNarrativeKr: `성수동은 시간과 산업이 격렬하게 충돌하는 도시적 풍경입니다. 한때 금속 정밀 공장 및 수제화 공장이 밀집했던 이곳은 이제 서울에서 가장 전위적인 미학의 지구가 되었습니다. 디자인에 깊은 애정을 가진 탐험가를 위해 엄선한 24시간 공간 여정을 소개합니다.`,
        curatorName: 'Min-kyu Park',
        curatorTitle: 'CHIEF CURATOR AT KULT',
        curatorAvatar: '/images/ig_post/seongsu_popup_1.png',
        curatorNote: `"Seongsu's magic doesn't happen at the destinations, but in the raw industrial friction between crumbling 1970s brick and 21st-century polished glass. Notice how the industrial noise gives way to subterranean scent chambers and quiet paper archives. The rhythm of the route is found in your footsteps on the gray pavement."`,
        curatorNoteKr: `"성수동의 진정한 매력은 목적지 자체가 아니라 허물어진 1970년대 벽돌과 21세기 유리 프레임이 부딪히는 날것의 마찰력에 있습니다. 공장의 소음이 프래그런스 쇼룸과 미니멀한 종이 서적으로 이어지는 감각적 전환에 집중해 보세요."`,
        stops: [
            {
                num: '01',
                time: '10:00 AM',
                tag: '01 / RAW CONCRETE & BAKERY',
                name: 'Cafe Onion Seongsu',
                nameKr: '어니언 성수',
                desc: 'A 1970s metal factory transformed into a brutalist coffee sanctuary. The decay of brick, crumbling plaster, and linear glass frames create a striking visual narrative.',
                descKr: '1970년대 금속 부품 공장을 개조한 브루탈리즘의 안식처. 허물어진 붉은 벽돌, 뜯겨 나간 콘크리트 질감과 미니멀한 유리 프레임의 조화가 독특한 공간을 선사합니다.',
                img: '/cafe_onion_seongsu.png',
                walk: '600M WALK'
            },
            {
                num: '02',
                time: '01:30 PM',
                tag: '02 / SENSORY RETAIL & VOID',
                name: 'Tamburins Seongsu',
                nameKr: '탬버린즈 성수',
                desc: 'A subterranean fragrance showroom built within an open-air concrete scaffolding. Experiencing scent between giant paintings, art installations, and concrete columns.',
                descKr: '건물 기둥 뼈대 가설재만 남겨진 구조 아래 자리 잡은 전시장 같은 프래그런스 쇼룸. 거대한 현대 미술작품과 콘크리트 기둥 사이에서 감도 높은 향기를 호흡해 보세요.',
                img: '/tamburins_seongsu.png',
                walk: '1.2KM WALK'
            },
            {
                num: '03',
                time: '04:00 PM',
                tag: '03 / CURATED SPATIAL COLLAGE',
                name: 'LCDC Seoul',
                nameKr: 'LCDC 서울',
                desc: 'A multi-story automotive repair shop transformed into a sleek complex. Independent fashion boutiques and design stationary brands gathered like pages of an editorial magazine.',
                descKr: '옛 자동차 정비소 부지를 모던한 복합 공간으로 재탄생시킨 곳. 잡지 에디토리얼을 읽듯 중정을 둘러싼 독립 디자인 샵과 셀렉트 스토어를 탐험하세요.',
                img: '/lcdc_seoul.png',
                walk: '400M WALK'
            },
            {
                num: '04',
                time: '06:30 PM',
                tag: '04 / METAL & PRINTED MATTER',
                name: 'Ofr. Seoul',
                nameKr: '오프레 서울',
                desc: 'Browse global art magazines and posters stacked on industrial steel shelves, wrapping up the day with industrial street vibes.',
                descKr: '산업용 메탈 선반에 꽂혀 있는 전 세계의 다양한 예술 서적과 포스터 컬렉션을 뒤적이며, 성수동 특유의 에너제틱한 골목 정취와 함께 하루를 매듭짓습니다.',
                img: '/ofr_seoul.png',
                walk: 'FINISH'
            }
        ],
        googleMapsUrl: 'https://maps.google.com/maps?q=Seongsu-dong+Seoul',
        isPremium: false
    },
    'seochon-route': {
        title: 'The Rhythm of Seochon: A Morning Pilgrimage',
        titleKr: '서촌의 리듬: 아침 순례길',
        category: 'Curated Route',
        categoryKr: '큐레이션 루트',
        region: 'seochon',
        distance: '2.4 KM',
        estTime: '4 HOURS',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=1600',
        introSubtitle: 'In the shadows of Inwangsan Mountain, Seochon whispers stories of Joseon scholars and modern dreamers.',
        introSubtitleKr: '인왕산 그늘 아래, 서촌은 조선 학자들과 현대 꿈꾸는 이들의 이야기를 속삭입니다.',
        introNarrative: `This pilgrimage is designed to be experienced slowly. It is not just a route across a neighborhood, but a transition through states of mind: from the structured peace of a Hanok morning to the sensory depths of tea, and finally, the stark clarity of contemporary art.`,
        introNarrativeKr: `이 순례길은 천천히 경험하도록 설계되었습니다. 단순한 동네 탐방을 넘어 마음의 상태를 전환하는 여정입니다: 한옥 아침의 구조화된 평화에서 차의 감각적 깊이로, 그리고 마침내 현대 미술의 명확함으로 나아갑니다.`,
        curatorName: 'Elena Kang',
        curatorTitle: 'CURATOR AT KULT',
        curatorAvatar: '/images/ig_post/seongsu_popup_3.png',
        curatorNote: `"Seochon's magic doesn't happen at the destinations, but in the 'in-between' spaces. Pay attention to the transition from the wide commercial Seochon-ro into the narrow 'Golk-mok' (alleys). Notice how the noise drops and the temperature feels cooler."`,
        curatorNoteKr: `"서촌의 진정한 마법은 목적지가 아닌 '사이의 공간'에서 일어납니다. 큰 길에서 좁은 골목길로 접어들 때 소음이 줄어들고 온도가 서늘해지는 감각에 집중해 보세요."`,
        stops: [
            {
                num: '01',
                time: '08:00 AM',
                tag: '01 / THE AWAKENING',
                name: 'Nuwa: The Art of Hanok',
                nameKr: '누와: 한옥의 예술',
                desc: 'Begin your morning at Nuwa, a micro-stay that redefined the Seochon experience. Here, the traditional "L" shaped Hanok structure is preserved but reimagined with a sunken bathtub and minimalist cedar furnishings.',
                descKr: "서촌의 경험을 재정의한 미크로 스테이 누와에서 아침을 시작하세요. 'ㄴ'자 한옥 구조를 유지하면서 침강형 욕조와 미니멀한 삼나무 가구로 재해석되었습니다.",
                img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800',
                walk: '800M WALK'
            },
            {
                num: '02',
                time: '10:30 AM',
                tag: '02 / THE CONVERGENCE',
                name: 'Insa-dong Tea House',
                nameKr: '인사동 전통 찻집',
                desc: 'A short walk through winding alleyways brings you to a hidden sanctuary. Dark charred wood walls meet rough-hewn stone tables in a space designed for quiet contemplation.',
                descKr: '미로 같은 골목길을 지난 후 도착하는 차의 안식처. 어두운 탄화목 벽과 정교한 차 우림 리추얼이 펼쳐집니다.',
                img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
                walk: '1.6KM WALK'
            },
            {
                num: '03',
                time: '12:00 PM',
                tag: '03 / THE CLARITY',
                name: 'Hannam Arts Seochon Annex',
                nameKr: '한남 아츠 서촌 별관',
                desc: 'Conclude your journey at this brutalist-inspired gallery. The soaring concrete walls and dramatic skylights create a temple of light.',
                descKr: '브루탈리즘 콘크리트 갤러리에서 여정을 완결짓습니다. 천창에서 쏟아지는 빛과 강렬한 강철 설치 작품이 극적인 결말을 선사합니다.',
                img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800',
                walk: 'FINISH'
            }
        ],
        googleMapsUrl: 'https://maps.google.com/maps?q=Seochon+Seoul',
        isPremium: false
    },
    'void-space': {
        title: 'Void Space Seoul',
        titleKr: '보이드 스페이스 서울',
        category: 'Architecture',
        categoryKr: '건축',
        region: 'hannam',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
        description: 'A pioneering architectural studio in the heart of Hannam-dong, where the absence of conventional design elements speaks louder than their presence.',
        descriptionKr: '한남동 중심부에 위치한 선구적인 건축 스튜디오로, 일반적인 디자인 요소의 부재가 존재보다 더 큰 울림을 줍니다.',
        googleMapsUrl: 'https://maps.google.com',
        isPremium: true
    },
    'tamburins-sinsa': {
        title: 'The Silence of Tamburins: Rethinking Retail as a Sanctuary',
        titleKr: '탬버린즈의 침묵: 리테일을 성소로 재고하다',
        category: 'Retail / Beauty',
        categoryKr: '뷰티 / 리테일',
        region: 'sinsa',
        imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200',
        description: 'How a fragrance brand transformed the bustling streets of Sinsa-dong into a spatial narrative of time, texture, and scent.',
        descriptionKr: '한 프래그런스 브랜드가 신사동의 분주한 거리를 시간, 질감, 향기의 공간적 내러티브로 변환한 방법입니다.',
        googleMapsUrl: 'https://maps.google.com',
        isPremium: true
    },
    'arumjigi': {
        title: 'The Geometry of Solitude: On Arumjigi\'s Traditional-Modern Hybridity',
        titleKr: '고독의 기하학: 아름지기의 전통-현대 혼합성에 대하여',
        category: 'Heritage',
        categoryKr: '헤리티지',
        region: 'bukchon',
        imageUrl: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c34?auto=format&fit=crop&q=80&w=1200',
        description: 'Exploring how Arumjigi Culture Keepers Foundation bridges the gap between Joseon-era aesthetics and 21st-century minimalism.',
        descriptionKr: '재단법인 아름지기가 서울 중심부에서 조선 시대의 미학과 21세기 미니멀리즘 사이의 간극을 어떻게 좁히고 있는지 탐구합니다.',
        googleMapsUrl: 'https://maps.google.com',
        isPremium: true
    }
}

const SpaceDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t, lang } = useLanguage()
    const { currentUser, isSubscribed, unlockedContent, credits } = useAuth()

    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hasAccess, setHasAccess] = useState(false)
    const [isUnlocking, setIsUnlocking] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [activeConciergeSpot, setActiveConciergeSpot] = useState(null)

    useEffect(() => {
        const fetchSpace = async () => {
            setLoading(true)
            setError(null)
            try {
                const docRef = doc(db, 'spaces', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setSpace({ id: docSnap.id, ...docSnap.data() })
                } else if (dummySpaces[id]) {
                    setSpace(dummySpaces[id])
                } else {
                    setError(t('Information not found.', '정보를 찾을 수 없습니다.'))
                }
            } catch (err) {
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

    useEffect(() => {
        if (space) {
            if (!space.isPremium) {
                setHasAccess(true)
            } else {
                const hasPurchased = unlockedContent?.includes(id)
                setHasAccess(!!(isSubscribed || hasPurchased))
            }
        }
    }, [space, id, isSubscribed, unlockedContent])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !space) {
        return (
            <div className="min-h-screen bg-[#FAF8F5]">
                <Header />
                <div className="max-w-xl mx-auto px-6 py-32 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-serif font-bold text-[#191A1F] mb-4">{t("Notice", "안내")}</h2>
                    <p className="text-slate-500 mb-10">{error}</p>
                    <button onClick={() => navigate('/')} className="px-8 py-4 bg-[#191A1F] text-white rounded-xl font-bold">
                        {t("Go Home", "홈으로 가기")}
                    </button>
                </div>
            </div>
        )
    }

    const isRouteType = space.category === 'Curated Route' || space.stops?.length > 0
    const regionLabel = space.region?.toUpperCase() || 'SEOUL'

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#191A1F] selection:bg-[#1111d4] selection:text-white">
            <Header />

            {/* ── STITCH EDITORIAL ROUTE LAYOUT ───────────────────────────────────── */}
            {isRouteType ? (
                <main className="pt-0">
                    {/* Hero Section */}
                    <section className="relative h-[80vh] min-h-[550px] w-full overflow-hidden">
                        <img
                            src={space.imageUrl}
                            alt={space.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#191A1F] via-[#191A1F]/40 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-[1280px] mx-auto text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <Link to="/" className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>{t("Home", "홈")}</span>
                                </Link>
                                <span className="text-white/40">•</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-white/80">
                                    SEOUL / SOUTH KOREA · {regionLabel}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight mb-8 max-w-4xl text-white">
                                {t(space.title, space.titleKr || space.title)}
                            </h1>

                            {/* Distance / Est Time Stats Bar */}
                            <div className="flex items-center gap-8 border-t border-white/20 pt-6 max-w-xl">
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-white/60">DISTANCE</p>
                                    <p className="text-2xl font-serif font-bold text-white">{space.distance || '3.2 KM'}</p>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-white/60">EST. TIME</p>
                                    <p className="text-2xl font-serif font-bold text-white">{space.estTime || '6 HOURS'}</p>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-white/60">CURATED STOPS</p>
                                    <p className="text-2xl font-serif font-bold text-white">{space.stops?.length || 4} PLACES</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cultural Narrative Intro */}
                    <section className="py-20 px-6 border-b border-[#E5DFD5]">
                        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#1111d4] px-4 py-1 rounded-full bg-[#1111d4]/10 self-center border border-[#1111d4]/20">
                                CULTURAL NARRATIVE
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight text-[#191A1F]">
                                {t(space.introSubtitle, space.introSubtitleKr || space.introSubtitle)}
                            </h2>
                            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                                {t(space.introNarrative, space.introNarrativeKr || space.introNarrative)}
                            </p>
                        </div>
                    </section>

                    {/* Vertical Timeline & Stop Experiences */}
                    <section className="py-24 px-6 max-w-[1280px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            {/* Left Timeline Tracker (Desktop) */}
                            <aside className="md:col-span-4 hidden md:block relative pt-6">
                                <div className="sticky top-32 flex flex-col items-center">
                                    <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-slate-300 border-dashed border-l border-slate-300 z-0" />
                                    
                                    {space.stops?.map((stop, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2 py-8 z-10 bg-[#FAF8F5] my-4">
                                            <div className="w-12 h-12 rounded-full border-2 border-[#191A1F] flex items-center justify-center bg-white shadow-md font-serif font-bold text-sm text-[#191A1F]">
                                                {stop.num}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">{stop.time}</span>
                                            <span className="text-[9px] font-extrabold text-[#1111d4] uppercase tracking-widest mt-1">{stop.walk}</span>
                                        </div>
                                    ))}
                                </div>
                            </aside>

                            {/* Right Experience Cards */}
                            <div className="md:col-span-8 flex flex-col gap-16">
                                {space.stops?.map((stop, idx) => (
                                    <article key={idx} className="group bg-white rounded-3xl border border-[#E5DFD5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                                            <img
                                                src={stop.img}
                                                alt={stop.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute top-6 left-6 bg-[#191A1F] text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-md">
                                                {stop.tag}
                                            </div>
                                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-[#191A1F] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200">
                                                {stop.time}
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col gap-6 text-left">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-2xl font-serif font-bold text-[#191A1F] uppercase">
                                                    {t(stop.name, stop.nameKr || stop.name)}
                                                </h3>
                                                <p className="text-sm text-slate-600 font-normal leading-relaxed">
                                                    {t(stop.desc, stop.descKr || stop.desc)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                                <span className="text-xs font-bold text-[#1111d4] flex items-center gap-1.5">
                                                    <Footprints className="w-4 h-4" />
                                                    {stop.walk}
                                                </span>

                                                <button
                                                    onClick={() => setActiveConciergeSpot({
                                                        name: stop.name,
                                                        location: space.region?.toUpperCase(),
                                                        trendScore: '🔥 9.9/10',
                                                        img: stop.img,
                                                        desc: stop.desc
                                                    })}
                                                    className="px-6 py-3 rounded-xl bg-[#191A1F] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1111d4] transition-colors flex items-center gap-2 shadow-md"
                                                >
                                                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                                                    <span>Book Concierge Pass</span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Insider Note Section */}
                    <section className="bg-[#F0EDE9] py-20 px-6 border-t border-b border-[#E5DFD5]">
                        <div className="max-w-[1280px] mx-auto bg-white rounded-3xl p-8 md:p-14 flex flex-col md:flex-row gap-10 items-center border border-[#E5DFD5] shadow-sm">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#1111d4]/30 shrink-0">
                                <img
                                    src={space.curatorAvatar}
                                    alt={space.curatorName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col gap-4 text-left">
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#1111d4]">
                                    INSIDER NOTE
                                </span>
                                <h3 className="text-xl font-serif font-bold text-[#191A1F] uppercase">
                                    Spatial Flow: The In-Between
                                </h3>
                                <p className="text-sm sm:text-base text-slate-600 italic leading-relaxed">
                                    {t(space.curatorNote, space.curatorNoteKr || space.curatorNote)}
                                </p>
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-[#191A1F] uppercase">{space.curatorName}</p>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest">{space.curatorTitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                /* ── STANDARD SPACE DETAIL LAYOUT ────────────────────────────────── */
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-wide lowercase">{t("Back to Home", "홈으로 돌아가기")}</span>
                    </Link>

                    <div className="relative w-full h-[400px] sm:h-[500px] md:h-auto md:aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-12 shadow-sm">
                        <img
                            src={space.imageUrl}
                            className="w-full h-full object-cover"
                            alt={space.title}
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-left flex flex-col gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                                {t(space.category, space.categoryKr || space.category)}
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-tight">
                                {t(space.title, space.titleKr || space.title)}
                            </h1>
                            <span className="flex items-center gap-1.5 text-xs font-medium uppercase opacity-90">
                                <MapPin className="w-3.5 h-3.5" />
                                {regionLabel}, Korea
                            </span>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD5] text-left flex flex-col gap-6 shadow-sm">
                        <h2 className="text-2xl font-serif font-bold text-[#191A1F] uppercase">{t("Story of Discovery", "발견의 이야기")}</h2>
                        <p className="text-base text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">
                            {t(space.description, space.descriptionKr || space.description)}
                        </p>
                    </div>
                </div>
            )}

            {/* Modal Trigger */}
            {activeConciergeSpot && (
                <ConciergeModal
                    spot={activeConciergeSpot}
                    onClose={() => setActiveConciergeSpot(null)}
                />
            )}

            {/* Footer */}
            <footer className="w-full max-w-[1280px] mx-auto px-6 py-16 mt-20 border-t border-[#E5DFD5] flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500">
                <div className="flex items-center gap-3">
                    <Orbit className="w-5 h-5 text-[#1111d4]" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">© 2026 KULT Media. All rights reserved.</span>
                </div>
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
                    <Link to="/" className="hover:text-slate-900">Home</Link>
                    <a href="#concierge-section" className="hover:text-slate-900">Concierge</a>
                    <Link to="/profile" className="hover:text-slate-900">Privacy</Link>
                </div>
            </footer>
        </div>
    )
}

export default SpaceDetail
