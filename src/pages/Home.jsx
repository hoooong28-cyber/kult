import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Sparkles, ChevronLeft, ChevronRight, ArrowRight, Coffee, Landmark, ShoppingBag, Globe, Orbit, LayoutGrid, Map, Instagram } from 'lucide-react'
import UserNav from '../components/UserNav'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

const editorPicks = [
    {
        name: 'Yuyeon Tea House',
        nameKr: '유연다원',
        location: 'Gyeongju',
        locationKr: '경주',
        badge: 'Heritage',
        badgeKr: '헤리티지',
        desc: 'A centuries-old Hanok where the art of tea brewing meets the silence of the surrounding bamboo forest.',
        descKr: '수백 년 된 한옥에서 차를 우리는 예술과 대나무 숲의 고요함이 만나는 곳입니다.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOeAEDReiO56NceRRAI74x11UkMAFpLTD8rCqj6Dt1pbF3arduDR00v0-ywXgvJV8TuH-x6mypHbt2yGFcQ2bkNRhYCFDYAUOO5qlimCTFvJ6yeN0tbXXHhSEv1PrWHsrBqlPg5uc11s0eSQEqTMSAMWxqC_IgFTc8TmkBMAh7gQGCkUbfhDSAy7xMO0NrAsZUO0eX83mN83tQ_lxjJMD1S2abzB2uQmcQmRQxtGUs5jIvKhCMXyT_UoSSIcB0hOsDt4_whSqdSjVN'
    },
    {
        name: 'Void Space Seoul',
        nameKr: '보이드 스페이스 서울',
        location: 'Seoul, Hannam',
        locationKr: '서울, 한남',
        badge: 'Culture',
        badgeKr: '컬처',
        desc: 'Minimalist architecture hosting experimental digital art exhibitions that define Seoul\'s contemporary pulse.',
        descKr: '서울의 현대적인 맥박을 정의하는 실험적인 디지털 아트 전시가 열리는 미니멀리즘 건축물입니다.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbwoL1fq_JksuTSIQIDc7aKzarYFCoKXSumbSeFD4TWpCcU4858QFMLYdYebKkiZR2jIFI1Ei9rgbQtdkXOHuljgW7VDJNzMAAwGaKuNkaLY6127SDCwTsk2kK1eC1_tfaDDAJHRQbbplp2pfiNDZuBrLhn6446CsRVlnIdLQvEPy5HilTe6nGGGoNYB8zN6L9ISkrK_tR1jP5sDMbVWukDfDARBmz7zviyycbc2XIbshKwgivg43cPtycFsPWD5743_ye5gxVo3r3'
    },
    {
        name: 'The Pine Hideaway',
        nameKr: '소나무 은신처',
        location: 'Pyeongchang',
        locationKr: '평창',
        badge: 'Healing Stay',
        badgeKr: '힐링 스테이',
        desc: 'Disconnect to reconnect. A glass-walled sanctuary tucked deep into the cedar forests of Gangwon province.',
        descKr: '연결을 위해 접속을 끊으세요. 강원도 삼나무 숲 깊은 곳에 자리 잡은 유리벽 안식처입니다.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnz2ezosgYy1InE6M-vxahUlcD39OD0pvgs5qPupHwpGcZr1Ec3pwOUr1T6MSQydMR9XbCIw-loP0wEBYXtYYZjnGpO0K1a9Fhf--q4V1jW4KyxHNuX1p_Vuu749zGUQFvrKBVkUPN9YNv68yqozKkH86YlL2rpXyYlUXDAjM06W0X1bj6Yg-W6I2PdqzKRbR4-IpYDyvAqljF9nR-t6_JiBngrHivGFtmfN0OI1KLc_Vv_rttoDWEFpYL6tZKE1TwFmhMig6L_y3U'
    }
]

const trendingSpaces = [
    { name: 'Gaeul Coffee', nameKr: '가을 커피', sub: 'Seoul • Cafe', subKr: '서울 • 카페', rating: 4.9, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8hs2GzqCwBkGmzI2aDawlFFh-Y2btSLIoEKU6_lrMlmFIAeRn9pDsbW6_jRZ5ZChCQHFg53ONbi7_mawIVqbzM0KQBzTbg8D6YgNxWaP995MWHtBDKd1o9JGRYe9Q4m-LlfYUsYzVRFNDa1-5piIObKG57PxGHPfhkXuySAh9nwEGmM6FhL_gdNBaMNQ9JrxFZjAXLY9rlA4cu2Ugn3evEZkvOQWj6Ud6-AFQ48cDmCQbfnWmHJo7HMh-_AzGNe2Cb2vcqzp1XTmw' },
    { name: 'Wave House', nameKr: '웨이브 하우스', sub: 'Busan • Stay', subKr: '부산 • 스테이', rating: 4.8, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwR9B6yUh8_mTQDz3ukNqLmek6Nt6NUTWGxbmf1jxPDswxuV_aZx7ZqmDIYNqUKKDId3iXnbt5AJusFfmj9xR66QyWpvYsUb3yK6dTM38O1Q234n3QYIxoYbezqq0EfEO37w1Iu8rZ7Hj8BRG2QsE9hTM4Pv1QVHOKC-6IkekSfuv8L3gp5RsCZfbMqs_phA4qcKYCEr_5H2dfkV-u-B8d2-2Y51leMGRTqu8FLohzrjSmy5IQz91fJ097SART9qLwlKgTxMRky5Da' },
    { name: 'Zen Attic', nameKr: '젠 다락방', sub: 'Jeju • Culture', subKr: '제주 • 컬처', rating: 5.0, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDObeqZadoeKjY0rvNBI7b6xlnW_z1zPjsKyYMGQg9f-elBoWq9bk-Zdaf8S70uqul6HHXJze4n332TbfZGyknUwrkahMNMZuoVTBslFIXnPvUUHmMQrkdmCD5xrZXkhlPF5v71u6Gol-muoQ-OwTaIc4HHbRW77IYLsC7ni6S5seCZ24s1n_Q5LayHdGZX9TPhYeElhp3H0qs8L4qBfXWwUrA7t0iIEhoczzznXmqLu1SFS5kvqJVZ6xVurzIP3hiMmfGoozddHWDS' },
    { name: 'Neon Library', nameKr: '네온 라이브러리', sub: 'Seoul • Culture', subKr: '서울 • 컬처', rating: 4.7, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHgCnS8Z0XjYLPwjNsmzPerwPFsLS5TOzybD0zm6Ha-zR4UhusmGnaSIUZZziy3FHZ2ZoXnCPo7AIIoAnU_FdGJedUA5zdwoUe21o_N1GkRmm15grWncJpdqaXwEmHel0zwomIUoNZUiUJURiWi0VuXWlggUPgsL75Txete1kIFfPoa7KkCgOgpAGDbGMtdls-0_q4EdBxpsr1BR-csF-GPuuUo7Jn3Ga6qohnoO65g4bPgUy0gavAcJWEdb80kBY0b-l0QgpCYKcN' }
]

const destinations = [
    { value: 'ikseon-dong', label: 'IKSEON-DONG', labelKr: '익선동' },
    { value: 'gyeongju', label: 'GYEONGJU', labelKr: '경주' },
    { value: 'seochon', label: 'SEOCHON', labelKr: '서촌' },
    { value: 'bukchon', label: 'BUKCHON', labelKr: '북촌' },
]

const categories = [
    { value: 'cafe', label: 'CAFES', labelKr: '카페' },
    { value: 'culture', label: 'CULTURE', labelKr: '컬처' },
    { value: 'stay', label: 'STAY', labelKr: '스테이' },
    { value: 'retail', label: 'RETAIL', labelKr: '리테일' },
]

const Home = () => {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [destination, setDestination] = useState(destinations[0])
    const [category, setCategory] = useState(categories[0])
    const [destOpen, setDestOpen] = useState(false)
    const [catOpen, setCatOpen] = useState(false)
    const scrollRef = useRef(null)
    const destRef = useRef(null)
    const catRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (destRef.current && !destRef.current.contains(event.target)) setDestOpen(false)
            if (catRef.current && !catRef.current.contains(event.target)) setCatOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleExplore = () => {
        navigate(`/search/${destination.value}`)
    }

    const scrollTrending = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
        }
    }

    return (
        <div className="bg-slate-50 text-slate-800 antialiased selection:bg-primary selection:text-white min-h-screen font-display">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative w-full h-[75vh] min-h-[550px] flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-900/10 z-10"></div>
                        <img alt="Modern Hanok Cafe" className="w-full h-full object-cover scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAP5yqtzkzaT7TkrV2neEgzf3mqsEzOkcNWNPc9yGhu-05JvO1_laDMgbjdsvxTnKw4B5fJEUiNwA3GrepgRpgmW5MwRsudgOhIGQgrqHNs51a8KadtqNakqHZE7fgbDV1WOq0HWAW6AZuXlV1V7qVzKL6yCDocrOyvBnRUW1PD0LCxbrMTmfcTnBzrDNS0m2JkseeXHEorqLv1SxccEJELpWIYHykB5eR1X9YQTLBm7pXNGjV_Wi2yEIMmsfoqv7Q6UEE1SKCGm_Y" />
                    </div>
                    <div className="relative z-20 text-center px-4 max-w-5xl mx-auto text-left md:text-center">
                        <span className="inline-block px-5 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-8">
                            {t("Premium Space Concierge", "프리미엄 공간 컨시어지")}
                        </span>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-tight md:leading-none text-white mb-6 drop-shadow-lg text-left md:text-center">
                            {t("Explore Korea's", "대한민국 숨겨진")} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-50 italic font-normal">{t("hidden Spaces.", "공간을 탐험하세요.")}</span>
                        </h1>
                        <p className="text-[10px] md:text-xs text-slate-300 mb-12 max-w-lg mx-auto font-medium leading-relaxed tracking-[0.3em] uppercase opacity-80 text-left md:text-center">
                            {t("Curating the future of Korean lifestyle. From gravity-defying architecture to silent heritage sanctuaries.", "한국 라이프스타일의 미래를 큐레이팅합니다. 중력을 거스르는 건축물부터 고요한 헤리티지 안식처까지.")}
                        </p>
                        <div className="relative max-w-3xl mx-auto z-50">
                            <div className="bg-white/10 backdrop-blur-3xl p-3 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-3 transition-all duration-700 hover:border-white/40">
                                <div className="flex-1 w-full flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                                    <div className="relative flex-1" ref={destRef}>
                                        <button onClick={() => { setDestOpen(!destOpen); setCatOpen(false); }} className="flex items-center justify-center sm:justify-start gap-4 sm:gap-5 px-5 sm:px-6 py-3.5 hover:bg-white/10 rounded-xl transition-all group relative cursor-pointer w-full text-left">
                                            <MapPin className="w-4 h-4 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex-shrink-0" strokeWidth={1.5} />
                                            <div>
                                                <p className="text-[8px] text-slate-400 font-medium tracking-[0.2em] uppercase mb-0.5">{t("Location", "위치")}</p>
                                                <p className="text-[11px] text-white font-semibold tracking-[0.15em] uppercase">{t(destination.label, destination.labelKr)}</p>
                                            </div>
                                        </button>
                                        {destOpen && (
                                            <div className="absolute top-full left-0 w-full min-w-[220px] bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 z-[100] mt-2 backdrop-blur-xl">
                                                {destinations.map((d) => (
                                                    <button key={d.value} onClick={() => { setDestination(d); setDestOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-50 transition-all ${destination.value === d.value ? 'text-primary bg-primary/5' : ''}`}>
                                                        {t(d.label, d.labelKr)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative flex-1" ref={catRef}>
                                        <button onClick={() => { setCatOpen(!catOpen); setDestOpen(false); }} className="flex items-center justify-center sm:justify-start gap-4 sm:gap-5 px-5 sm:px-6 py-3.5 hover:bg-white/10 rounded-xl transition-all group relative cursor-pointer w-full text-left">
                                            <LayoutGrid className="w-4 h-4 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex-shrink-0" strokeWidth={1.5} />
                                            <div>
                                                <p className="text-[8px] text-slate-400 font-medium tracking-[0.2em] uppercase mb-0.5">{t("Category", "카테고리")}</p>
                                                <p className="text-[11px] text-white font-semibold tracking-[0.15em] uppercase">{t(category.label, category.labelKr)}</p>
                                            </div>
                                        </button>
                                        {catOpen && (
                                            <div className="absolute top-full left-0 w-full min-w-[220px] bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 z-[100] mt-2 backdrop-blur-xl">
                                                {categories.map((c) => (
                                                    <button key={c.value} onClick={() => { setCategory(c); setCatOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-50 transition-all ${category.value === c.value ? 'text-primary bg-primary/5' : ''}`}>
                                                        {t(c.label, c.labelKr)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button onClick={handleExplore} className="w-full md:w-auto h-16 px-12 bg-primary text-white rounded-xl font-black flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-[0_10px_25px_rgba(17,17,212,0.3)] hover:shadow-[0_15px_35px_rgba(17,17,212,0.5)] group cursor-pointer">
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" strokeWidth={1.5} />
                                    <span className="tracking-[0.3em] uppercase text-[10px]">{t("EXPLORE", "탐험하기")}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Shortcuts */}
                <section className="py-16 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 flex justify-center gap-12 md:gap-32 overflow-x-auto hide-scrollbar">
                        {[
                            { icon: Coffee, label: t('Cafes', '카페'), value: 'cafe' },
                            { icon: Landmark, label: t('Culture', '컬처'), value: 'culture' },
                            { icon: ShoppingBag, label: t('Retail', '리테일'), value: 'retail' }
                        ].map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => navigate(`/search?category=${cat.value}`)}
                                className="flex flex-col items-center gap-4 group transition-all cursor-pointer hover:-translate-y-1"
                            >
                                <div className="size-16 sm:size-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-sm group-hover:shadow-[0_10px_30px_rgba(17,17,212,0.1)]">
                                    <cat.icon className="w-6 h-6 sm:w-8 t-8 text-slate-400 group-hover:text-primary transition-colors" strokeWidth={0.5} />
                                </div>
                                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-400 group-hover:text-primary transition-colors">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Editor's Pick Section */}
                <section className="py-24 px-4 bg-slate-50 text-left">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                            <div className="max-w-xl">
                                <h2 className="text-[10px] font-bold text-primary/70 tracking-[0.6em] uppercase mb-4">{t("Handpicked Selection", "엄선된 셀렉션")}</h2>
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tighter">{t("Editor's Pick", "에디터 초이스")}</h3>
                                <p className="mt-6 text-slate-500 text-sm leading-relaxed font-light">{t("Our curation team travels across the peninsula to find sanctuaries that offer more than just a view—they offer a story.", "저희 큐레이션 팀은 한반도 전역을 여행하며 단순한 풍경 이상의 이야기를 담은 안식처를 찾아냅니다.")}</p>
                            </div>
                            <Link className="flex items-center gap-2 font-bold text-sm text-primary border-b-2 border-primary/20 pb-1 hover:border-primary hover:gap-4 transition-all" to="/search/ikseon-dong">
                                {t("View all curations", "모든 큐레이션 보기")}
                                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {editorPicks.map((pick) => (
                                <Link to="/space/detail" key={pick.name} className="group cursor-pointer bg-white border border-slate-100 p-5 rounded-[2.5rem] hover:border-primary/20 transition-all duration-700 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)]">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8">
                                        <img alt={pick.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src={pick.img} />
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-sm">{t(pick.badge, pick.badgeKr)}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors text-slate-900 tracking-tight">{t(pick.name, pick.nameKr)}</h4>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 uppercase tracking-widest font-medium">
                                        <MapPin className="w-4 h-4" strokeWidth={1.5} />
                                        {t(pick.location, pick.locationKr)}
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-500 line-clamp-2 font-light">{t(pick.desc, pick.descKr)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trending Section */}
                <section className="py-24 bg-white border-t border-slate-100 text-left">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t("Trending Now", "현재 트렌딩")}</h3>
                            <div className="flex gap-3">
                                <button onClick={() => scrollTrending(-1)} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all hover:border-primary/30 text-slate-400 hover:text-primary cursor-pointer">
                                    <ChevronLeft className="w-6 h-6" strokeWidth={1} />
                                </button>
                                <button onClick={() => scrollTrending(1)} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all hover:border-primary/30 text-slate-400 hover:text-primary cursor-pointer">
                                    <ChevronRight className="w-6 h-6" strokeWidth={1} />
                                </button>
                            </div>
                        </div>
                        <div ref={scrollRef} className="flex gap-8 overflow-x-auto hide-scrollbar pb-12">
                            {trendingSpaces.map((space) => (
                                <Link to="/space/detail" key={space.name} className="flex-none w-[320px] group cursor-pointer hover:-translate-y-1 transition-all">
                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 shadow-sm border border-slate-100">
                                        <img alt={space.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={space.img} />
                                    </div>
                                    <div className="flex items-start justify-between px-1">
                                        <div>
                                            <h5 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors">{t(space.name, space.nameKr)}</h5>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">{t(space.sub, space.subKr)}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" strokeWidth={1} />
                                            <span className="text-xs font-bold text-slate-700">{space.rating}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-28 bg-slate-900 relative overflow-hidden text-left md:text-center">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase">{t("SYNC WITH THE NEW KOREA.", "새로운 한국과 싱크하십시오.")}</h3>
                        <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-primary mb-14 drop-shadow-sm">
                            {t("Receive encrypted transmission of the best hidden spaces.", "대한민국 최고의 히든 스페이스를 암호화된 전송으로 받아보세요.")}
                        </p>
                        <div className="max-w-md mx-auto flex gap-3 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl focus-within:border-primary focus-within:bg-white/10 transition-all shadow-2xl">
                            <input className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 text-xs font-bold uppercase tracking-widest px-6 focus:ring-0 h-14 md:h-16" placeholder={t("Terminal ID (Email)", "터미널 ID (이메일)")} type="email" />
                            <button className="bg-primary text-white font-black px-10 rounded-xl hover:brightness-125 transition-all h-14 md:h-16 shadow-[0_10px_30px_rgba(17,17,212,0.4)] text-xs uppercase tracking-widest cursor-pointer">{t("Connect", "접속하기")}</button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-20 text-left">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-8">
                            <Orbit className="w-7 h-7" strokeWidth={1.5} />
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900">KULT</h2>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-light">
                            {t("Curating the most authentic and modern Korean experiences for the discerning global traveler.", "전 세계 여행자들을 위해 가장 정통적이고 현대적인 한국의 경험을 큐레이팅합니다.")}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-8 text-slate-900">{t("Explore", "탐험")}</h4>
                        <ul className="space-y-5 text-sm text-slate-500">
                            <li><Link className="hover:text-primary transition-all duration-300 hover:pl-2" to="/search/ikseon-dong">{t("Featured Cafes", "주요 카페")}</Link></li>
                            <li><Link className="hover:text-primary transition-all duration-300 hover:pl-2" to="/search/seochon">{t("Boutique Stays", "부티크 스테이")}</Link></li>
                            <li><Link className="hover:text-primary transition-all duration-300 hover:pl-2" to="/sectors">{t("Cultural Landmarks", "문화 랜드마크")}</Link></li>
                            <li><Link className="hover:text-primary transition-all duration-300 hover:pl-2" to="/search">{t("Concept Stores", "컨셉 스토어")}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-8 text-slate-900">{t("Support", "지원")}</h4>
                        <ul className="space-y-5 text-sm text-slate-500">
                            <li><a className="hover:text-primary transition-all duration-300 hover:pl-2" href="#">{t("Contact Us", "문의하기")}</a></li>
                            <li><a className="hover:text-primary transition-all duration-300 hover:pl-2" href="#">{t("Privacy Policy", "개인정보 처리방침")}</a></li>
                            <li><a className="hover:text-primary transition-all duration-300 hover:pl-2" href="#">{t("Terms of Service", "이용약관")}</a></li>
                            <li><a className="hover:text-primary transition-all duration-300 hover:pl-2" href="#">{t("Partnership", "파트너십")}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-8 text-slate-900">{t("Social", "소셜")}</h4>
                        <div className="flex gap-5">
                            <a className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm" href="#">
                                <Globe className="w-5 h-5" strokeWidth={1.5} />
                            </a>
                            <a className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm" href="#">
                                <Instagram className="w-5 h-5" strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-slate-50 text-center">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">© 2024 KULT. {t("CURATING KOREA'S FUTURE HERITAGE.", "대한민국의 미래 헤리티지를 큐레이팅합니다.")}</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
