import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Sparkles, ChevronLeft, ChevronRight, ArrowRight, Coffee, Landmark, ShoppingBag, Globe, Orbit, LayoutGrid, Map, Instagram } from 'lucide-react'
import UserNav from '../components/UserNav'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'
import ProductFeed from '../components/ProductFeed'

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
                {/* Longblack-style Hero Section: Today's Paid Column */}
                <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-slate-950 overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <img 
                            alt="Column Cover" 
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" 
                            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
                    </div>
                    
                    <div className="relative z-20 text-center px-6 w-full max-w-[1000px] mx-auto mt-20">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 border border-primary/30 bg-primary/10 backdrop-blur-md rounded-full mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">
                                {t("Today's Deep Dive", "오늘의 심층 칼럼")}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6 font-display">
                            {t("The Silent Architecture", "침묵의 건축학")}
                        </h1>
                        <h2 className="text-xl md:text-3xl text-slate-300 font-medium tracking-tight mb-10 max-w-3xl mx-auto">
                            {t("How modern Korean spaces are redefining emptiness.", "현대 한국의 공간들이 비어있음을 재정의하는 방법")}
                        </h2>
                        
                        <p className="text-sm text-slate-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                            {t("In the heart of Seongsu, a new architectural movement is brewing. We sat down with the visionary behind Void Space Seoul to discuss why the absence of elements speaks louder than their presence.", "성수동 중심부에서 새로운 건축적 움직임이 일고 있습니다. 보이드 스페이스 서울의 설립자를 만나 요소의 부재가 존재보다 더 큰 울림을 주는 이유에 대해 이야기를 나눴습니다.")}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/space/void-space" className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-colors">
                                {t("Read Full Column", "칼럼 전체 읽기")}
                            </Link>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {t("Requires Membership", "멤버십 필요")}
                            </span>
                        </div>
                    </div>
                </section>

                <ProductFeed t={t} />

                {/* Recent Columns Grid */}
                <section className="py-24 bg-[#fcf9f5] border-t border-slate-100 text-left">
                    <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/20">
                                    Premium Columns
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                    {t("Recent Deep Dives", "최신 심층 칼럼")}
                                </h3>
                                <p className="mt-2 text-slate-500 font-medium">
                                    {t("Unlock exclusive access to in-depth brand stories.", "멤버십으로 브랜드의 깊은 이야기를 만나보세요.")}
                                </p>
                            </div>
                            <Link to="/subscribe" className="hidden md:flex items-center gap-2 font-black text-xs text-primary uppercase tracking-widest hover:gap-4 transition-all border border-primary/30 px-6 py-3 rounded-full">
                                {t("Subscribe", "구독하기")} →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    slug: 'void-space',
                                    title: t('The Silent Architecture', '침묵의 건축학'),
                                    sub: t('Void Space Seoul · Hannam', '보이드 스페이스 서울 · 한남'),
                                    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800'
                                },
                                {
                                    slug: 'yuyeon-tea-house',
                                    title: t('The Art of Stillness', '정적의 예술'),
                                    sub: t('Yuyeon Tea House · Gyeongju', '유연다원 · 경주'),
                                    img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=800'
                                },
                                {
                                    slug: 'pine-hideaway',
                                    title: t('Forest as Philosophy', '철학으로서의 숲'),
                                    sub: t('The Pine Hideaway · Pyeongchang', '소나무 은신처 · 평창'),
                                    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800'
                                }
                            ].map((col) => (
                                <Link to={`/space/${col.slug}`} key={col.slug} className="group block">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-slate-100">
                                        <img src={col.img} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                                            Premium
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight mb-1">{col.title}</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{col.sub}</p>
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
                            <li><span className="hover:text-primary transition-all duration-300">{t("Featured Cafes", "주요 카페")}</span></li>
                            <li><span className="hover:text-primary transition-all duration-300">{t("Boutique Stays", "부티크 스테이")}</span></li>
                            <li><span className="hover:text-primary transition-all duration-300">{t("Cultural Landmarks", "문화 랜드마크")}</span></li>
                            <li><span className="hover:text-primary transition-all duration-300">{t("Concept Stores", "컨셉 스토어")}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-8 text-slate-900">{t("Support", "지원")}</h4>
                        <ul className="space-y-5 text-sm text-slate-500">
                            <li><span className="hover:text-primary transition-all duration-300">{t("Contact Us", "문의하기")}</span></li>
                            <li><span className="hover:text-primary transition-all duration-300">{t("Privacy Policy", "개인정보 처리방침")}</span></li>
                            <li><span className="hover:text-primary transition-all duration-300">{t("Terms of Service", "이용약관")}</span></li>
                            <li><span className="hover:text-primary transition-all duration-300">{t("Partnership", "파트너십")}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-8 text-slate-900">{t("Social", "소셜")}</h4>
                        <div className="flex gap-5">
                            <span className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                <Globe className="w-5 h-5" strokeWidth={1.5} />
                            </span>
                            <span className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                <Instagram className="w-5 h-5" strokeWidth={1.5} />
                            </span>
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
