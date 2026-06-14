import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock, Sparkles, Globe, Instagram, Orbit, ChevronRight } from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

// ── Paid Content: Brand Stories & Spaces ──────────────────────────────────────
const brandColumns = [
    {
        slug: 'void-space',
        title: '침묵의 건축학',
        titleEn: 'The Silent Architecture',
        brand: 'Void Space Seoul',
        location: '한남 · Seoul',
        tag: '브랜드 스토리',
        tagEn: 'Brand Story',
        img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200',
        featured: true
    },
    {
        slug: 'yuyeon-tea-house',
        title: '정적의 예술',
        titleEn: 'The Art of Stillness',
        brand: 'Yuyeon Tea House',
        location: '경주 · Gyeongju',
        tag: '공간 탐방',
        tagEn: 'Space',
        img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=800'
    },
    {
        slug: 'pine-hideaway',
        title: '철학으로서의 숲',
        titleEn: 'Forest as Philosophy',
        brand: 'The Pine Hideaway',
        location: '평창 · Pyeongchang',
        tag: '헤리티지',
        tagEn: 'Heritage',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800'
    }
]

// ── Free Content: New Korean Products ─────────────────────────────────────────
const newProducts = [
    {
        id: 'p1',
        brand: 'NONFICTION',
        name: 'Santal Cream Hand Wash',
        nameKr: '산탈 크림 핸드워시',
        category: 'Beauty',
        categoryKr: '뷰티',
        date: 'Today',
        img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'p2',
        brand: 'Tamburins',
        name: 'Chamo Perfume Balm',
        nameKr: '카모 퍼퓸 밤',
        category: 'Fragrance',
        categoryKr: '프래그런스',
        date: 'Today',
        img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'p3',
        brand: 'Osoi',
        name: 'Toni Mini Bag',
        nameKr: '토니 미니백',
        category: 'Fashion',
        categoryKr: '패션',
        date: 'Yesterday',
        img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'p4',
        brand: 'Gentle Monster',
        name: 'Rococo 01',
        nameKr: '로코코 01',
        category: 'Eyewear',
        categoryKr: '아이웨어',
        date: 'Yesterday',
        img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'p5',
        brand: 'Aesop',
        name: 'Resurrection Aromatique',
        nameKr: '리서렉션 아로마틱',
        category: 'Beauty',
        categoryKr: '뷰티',
        date: '2 days ago',
        img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'p6',
        brand: 'Matin Kim',
        name: 'Leather Tote Bag',
        nameKr: '레더 토트백',
        category: 'Fashion',
        categoryKr: '패션',
        date: '2 days ago',
        img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600'
    }
]

const Home = () => {
    const { t, lang } = useLanguage()
    const [email, setEmail] = useState('')
    const featured = brandColumns[0]
    const rest = brandColumns.slice(1)

    return (
        <div style={{ minHeight: '100vh' }}>
            <Header />

            <main>
                {/* ── HERO: Featured Premium Column ────────────────────────── */}
                <section className="relative w-full bg-[#0d0d0d] overflow-hidden" style={{ minHeight: '90vh' }}>
                    {/* Background image */}
                    <div className="absolute inset-0">
                        <img
                            src={featured.img}
                            alt={featured.titleEn}
                            className="w-full h-full object-cover opacity-35"
                            style={{ objectPosition: 'center' }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0d0d 40%, rgba(13,13,13,0.4) 100%)' }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-end" style={{ minHeight: '90vh', padding: '0 2.5rem 5rem' }}>
                        <div className="max-w-4xl">
                            {/* Badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                                    {t("Today's Column", "오늘의 칼럼")}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5d1a1a] rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                    <Lock className="w-2.5 h-2.5" />
                                    Premium
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-4 uppercase">
                                {lang === 'KR' ? featured.title : featured.titleEn}
                            </h1>
                            <p className="text-white/50 text-base md:text-lg font-medium mb-2 tracking-wide">
                                {featured.brand} · {featured.location}
                            </p>
                            <p className="text-white/60 text-base md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
                                {t(
                                    "In the heart of Hannam, a new architectural philosophy is quietly taking root. We sat down with the visionary behind Void Space Seoul.",
                                    "한남동 중심부에서, 새로운 건축 철학이 조용히 뿌리내리고 있습니다. 보이드 스페이스 서울의 설립자를 만났습니다."
                                )}
                            </p>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Link
                                    to={`/space/${featured.slug}`}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0d0d0d] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#fcf9f5] transition-colors"
                                >
                                    {t("Read Full Column", "칼럼 읽기")}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/subscribe"
                                    className="inline-flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    {t("Requires membership", "멤버십 필요")}
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECTION 1: Brand Stories & Spaces (Premium) ─────────── */}
                <section className="bg-[#fcf9f5] py-20" style={{ borderTop: '1px solid #e8e5e1' }}>
                    <div className="max-w-[1440px] mx-auto px-6 md:px-10">

                        {/* Section header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#5d1a1a]/10 text-[#5d1a1a] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#5d1a1a]/20">
                                        <Lock className="w-2.5 h-2.5" />
                                        {t("Premium", "유료")}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#1c1c1a] tracking-tight leading-tight">
                                    {t("Brand Stories & Spaces", "브랜드 히스토리 & 공간")}
                                </h2>
                                <p className="text-[#747878] mt-2 text-base font-medium">
                                    {t("In-depth columns on Korea's most compelling brands and their spaces.", "한국의 주목할 브랜드와 그들의 공간을 깊이 있게 탐구합니다.")}
                                </p>
                            </div>
                            <Link to="/subscribe" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1c1c1a] border border-[#c4c7c7] px-6 py-3 rounded-full hover:border-[#1c1c1a] transition-colors whitespace-nowrap">
                                {t("All Columns", "전체 칼럼")} →
                            </Link>
                        </div>

                        {/* Column cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {rest.map((col) => (
                                <Link to={`/space/${col.slug}`} key={col.slug} className="group block bg-white rounded-2xl overflow-hidden border border-[#e8e5e1] hover:border-[#c4c7c7] hover:shadow-lg transition-all duration-500">
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={col.img}
                                            alt={col.titleEn}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <span className="absolute top-4 left-4 px-3 py-1 bg-[#5d1a1a] text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {lang === 'KR' ? col.tag : col.tagEn}
                                        </span>
                                        <span className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center">
                                            <Lock className="w-3.5 h-3.5 text-[#1c1c1a]" />
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#747878] mb-2">{col.brand} · {col.location}</p>
                                        <h3 className="text-xl font-black text-[#1c1c1a] tracking-tight group-hover:text-[#5d1a1a] transition-colors">
                                            {lang === 'KR' ? col.title : col.titleEn}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SECTION 2: New Korean Products (Free) ───────────────── */}
                <section className="bg-white py-20" style={{ borderTop: '1px solid #e8e5e1' }}>
                    <div className="max-w-[1440px] mx-auto px-6 md:px-10">

                        {/* Section header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        {t("Free", "무료")}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#1c1c1a] tracking-tight leading-tight">
                                    {t("New Korean Products", "한국 신상품 소개")}
                                </h2>
                                <p className="text-[#747878] mt-2 text-base font-medium">
                                    {t("The latest drops from Korea's most exciting brands, curated daily.", "매일 업데이트되는 한국 브랜드의 새로운 제품들을 무료로 만나보세요.")}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#747878] whitespace-nowrap">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t("Updated Daily", "매일 업데이트")}
                            </span>
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {newProducts.map((product) => (
                                <div key={product.id} className="group cursor-default">
                                    <div className="relative aspect-[3/4] bg-[#f6f3ef] rounded-xl overflow-hidden mb-3 border border-[#e8e5e1]">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur rounded-full text-[8px] font-black uppercase tracking-wide text-[#1c1c1a]">
                                            {lang === 'KR' ? product.categoryKr : product.category}
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#747878] mb-0.5">{product.brand}</p>
                                    <h4 className="text-sm font-black text-[#1c1c1a] leading-tight group-hover:text-[#5d1a1a] transition-colors">
                                        {lang === 'KR' ? product.nameKr : product.name}
                                    </h4>
                                    <p className="text-[10px] text-[#c4c7c7] font-medium mt-0.5">{product.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SUBSCRIPTION CTA ────────────────────────────────────── */}
                <section className="bg-[#1c1c1a] py-24" style={{ borderTop: '1px solid #2a2a28' }}>
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#747878] mb-6">KULT Membership</p>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight uppercase mb-6">
                            {t("Read deeper.", "더 깊이 읽으세요.")}
                        </h2>
                        <p className="text-[#747878] text-lg font-light mb-10 leading-relaxed">
                            {t(
                                "Unlock all brand columns and spaces. Premium content, curated for those who want to understand Korea beyond the surface.",
                                "모든 브랜드 칼럼과 공간 스토리를 열람하세요. 한국의 표면 너머를 알고 싶은 사람들을 위한 프리미엄 콘텐츠입니다."
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/subscribe"
                                className="px-10 py-4 bg-white text-[#1c1c1a] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#fcf9f5] transition-colors"
                            >
                                {t("Subscribe — ₩9,900/mo", "구독하기 — ₩9,900/월")}
                            </Link>
                            <Link
                                to="/subscribe"
                                className="px-10 py-4 border border-white/20 text-white rounded-full font-black text-xs uppercase tracking-widest hover:border-white/60 transition-colors"
                            >
                                {t("Buy Credits", "크레딧 구매")}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── FOOTER ───────────────────────────────────────────────── */}
            <footer className="bg-[#fcf9f5]" style={{ borderTop: '1px solid #e8e5e1' }}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Orbit className="w-6 h-6 text-[#1c1c1a]" strokeWidth={1.5} />
                            <span className="font-black text-xl tracking-tighter text-[#1c1c1a]">KULT</span>
                        </div>
                        <p className="text-sm text-[#747878] leading-relaxed font-light">
                            {t("Curating the soul of Korea — brands, spaces, and new discoveries.", "한국의 브랜드, 공간, 그리고 새로운 발견을 큐레이팅합니다.")}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1c1c1a] mb-5">{t("Content", "콘텐츠")}</h4>
                        <ul className="space-y-3 text-sm text-[#747878]">
                            <li><Link to="/subscribe" className="hover:text-[#1c1c1a] transition-colors">{t("Brand Columns", "브랜드 칼럼")}</Link></li>
                            <li><span className="cursor-default">{t("New Products", "신상품")}</span></li>
                            <li><Link to="/subscribe" className="hover:text-[#1c1c1a] transition-colors">{t("Subscribe", "구독하기")}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1c1c1a] mb-5">{t("Company", "회사")}</h4>
                        <ul className="space-y-3 text-sm text-[#747878]">
                            <li><span className="cursor-default">{t("About", "소개")}</span></li>
                            <li><span className="cursor-default">{t("Privacy", "개인정보")}</span></li>
                            <li><span className="cursor-default">{t("Terms", "이용약관")}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1c1c1a] mb-5">Social</h4>
                        <div className="flex gap-3">
                            <span className="w-10 h-10 rounded-full border border-[#e8e5e1] flex items-center justify-center hover:border-[#1c1c1a] transition-colors cursor-default">
                                <Instagram className="w-4 h-4 text-[#747878]" strokeWidth={1.5} />
                            </span>
                            <span className="w-10 h-10 rounded-full border border-[#e8e5e1] flex items-center justify-center hover:border-[#1c1c1a] transition-colors cursor-default">
                                <Globe className="w-4 h-4 text-[#747878]" strokeWidth={1.5} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 pb-8" style={{ borderTop: '1px solid #e8e5e1', paddingTop: '2rem' }}>
                    <p className="text-[10px] text-[#c4c7c7] font-medium uppercase tracking-widest">
                        © 2024 KULT Media. {t("All rights reserved.", "All rights reserved.")}
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
