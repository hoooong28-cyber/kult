import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock, ChevronLeft, ChevronRight, Orbit, Globe, Instagram } from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

// ── Brand Space Columns (Paid) ──────────────────────────────────────────────
const mainColumn = {
    slug: 'arumjigi',
    titleEn: 'The Geometry of Solitude: On Arumjigi\'s Traditional-Modern Hybridity',
    titleKr: '고독의 기하학: 아름지기의 전통-현대 혼합성에 대하여',
    brand: 'Arumjigi Culture Keepers',
    location: 'Bukchon · Seoul',
    tagEn: 'Spatial Identity',
    tagKr: '공간 정체성',
    readTime: '12 Min Read',
    author: 'Min-kyu Park',
    img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200',
    desc: 'Exploring how Arumjigi Culture Keepers Foundation bridges the gap between Joseon-era aesthetics and 21st-century minimalism in the heart of Seoul.'
}

const sideColumns = [
    {
        slug: 'void-space',
        titleEn: 'Void Space: Curating Emptiness',
        titleKr: '보이드 스페이스: 비어있음을 큐레이팅하다',
        descEn: 'Inside Hannam\'s most enigmatic concrete shell where art becomes an atmospheric experience.',
        descKr: '예술이 분위기 경험이 되는 한남의 가장 수수께끼 같은 콘크리트 공간 내부.',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    },
    {
        slug: 'pine-hideaway',
        titleEn: 'Gangwon Forest Retreats',
        titleKr: '강원 포레스트 리트리트',
        descEn: 'How contemporary architects are weaving luxury stays into the dense cedar canopies of Pyeongchang.',
        descKr: '현대 건축가들이 평창의 빽빽한 삼나무 숲 사이에 럭셔리 스테이를 엮어내는 방법.',
        img: 'https://images.unsplash.com/photo-1549180030-48bf079fb38a?auto=format&fit=crop&q=80&w=1200'
    }
]

// ── New Products (Free) ─────────────────────────────────────────────────────
const products = [
    {
        id: 'p1',
        brand: 'Sulwhasoo',
        nameEn: 'Ginseng Renewing Cream v.05',
        nameKr: '진생 리뉴잉 크림 v.05',
        descEn: 'The evolution of a legend. Enhanced bio-cell formula for deep restoration.',
        descKr: '전설의 진화. 심층 회복을 위한 향상된 바이오셀 포뮬러.',
        img: 'https://www.sulwhasoo.com/web/upload/share-image-1-570395dcac21168cb1deeabd5dd8d2db.jpg'
    },
    {
        id: 'p2',
        brand: 'HAY Korea',
        nameEn: 'Ceramic Series: Insa Edition',
        nameKr: '세라믹 시리즈: 인사 에디션',
        descEn: 'A collaboration between Nordic functionalism and Korean celadon heritage.',
        descKr: '북유럽 기능주의와 한국 청자 헤리티지의 협업.',
        img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'p3',
        brand: 'Studio Odd',
        nameEn: 'Neon Archive 04 Lamp',
        nameKr: '네온 아카이브 04 램프',
        descEn: 'The vibrant energy of Euljiro nights captured in a minimalist lighting fixture.',
        descKr: '을지로의 생동감 넘치는 야경 에너지를 담은 미니멀리스트 조명.',
        img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'p4',
        brand: 'Ader Error',
        nameEn: 'Object 012: The Hybrid Bag',
        nameKr: '오브젝트 012: 하이브리드 백',
        descEn: 'Deconstructed aesthetics meeting industrial durability in their latest drop.',
        descKr: '해체주의 미학과 산업적 내구성이 만난 최신 드롭.',
        img: 'https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c?auto=format&fit=crop&q=80&w=800'
    }
]

const getPremiumStatus = (slug) => {
    return ['void-space', 'arumjigi', 'tamburins-sinsa'].includes(slug);
}

const Home = () => {
    const { t, lang } = useLanguage()
    const [email, setEmail] = useState('')

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <Header />

            <main>
                {/* ── HERO: Featured Column ───────────────────────────────── */}
                <section style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }} className="group">
                    {/* Background — pointer-events:none prevents it from blocking scroll */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                        <img
                            alt="Featured Korean Brand Space"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 3s ease', pointerEvents: 'none' }}
                            className="group-hover:scale-105"
                            src="https://web-resource.tamburins.com/image/share_banner_summer-tails.jpg"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 30%, rgba(0,0,0,0.2) 100%)', pointerEvents: 'none' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', maxWidth: '1280px', margin: '0 auto', padding: '0 2rem 5rem' }}>
                        <div style={{ maxWidth: '800px' }}>
                            <span style={{ display: 'inline-block', padding: '4px 14px', background: '#1111d4', color: '#fff', fontSize: '9px', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                {t('Featured Column', '피처드 칼럼')}
                            </span>
                            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontFamily: 'Georgia, ui-serif, serif', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                                {t('The Silence of Tamburins: Rethinking Retail as a Sanctuary', '탬버린즈의 침묵: 리테일을 성소로 재고하다')}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', fontWeight: 300, maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.75, letterSpacing: '0.01em' }}>
                                {t('How a fragrance brand transformed the bustling streets of Sinsa-dong into a spatial narrative of time, texture, and scent.', '한 프래그런스 브랜드가 신사동의 분주한 거리를 시간, 질감, 향기의 공간적 내러티브로 변환한 방법.')}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link to="/space/tamburins-sinsa" style={{ display: 'inline-block', padding: '14px 36px', background: '#fff', color: '#0d0d0d', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}
                                    className="hover:bg-slate-100 transition-colors">
                                    {t('Read Story', '스토리 읽기')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Filter Bar ─────────────────────────────────────────── */}
                <nav style={{ borderBottom: '1px solid #f1f5f9', padding: '1.5rem 0', backgroundColor: 'rgba(248,250,252,0.5)' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                            {[
                                { label: t('All Collections', '전체'), active: true },
                                { label: 'Seoul', active: false },
                                { label: 'Busan', active: false },
                                { label: 'Jeju', active: false },
                                { label: 'Gyeongju', active: false }
                            ].map(item => (
                                <span key={item.label} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'default', color: item.active ? '#0d0d0d' : '#94a3b8', borderBottom: item.active ? '1px solid #1111d4' : 'none', paddingBottom: '2px' }}>
                                    {item.label}
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b' }}>Category:</span>
                            <select style={{ background: 'transparent', border: 'none', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1111d4', cursor: 'pointer', outline: 'none' }}>
                                <option>{t('Architecture', '건축')}</option>
                                <option>{t('Wellness', '웰니스')}</option>
                                <option>{t('Beauty', '뷰티')}</option>
                                <option>{t('Fashion', '패션')}</option>
                            </select>
                        </div>
                    </div>
                </nav>

                {/* ── Pillar 1: Brand Space Columns (Paid) ────────────────── */}
                <section style={{ padding: '6rem 0', backgroundColor: '#fff' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                        {/* Section header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: '#1111d4', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Space Stories</p>
                                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'Georgia, ui-serif, serif', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.02em' }}>
                                    {t('Brand Space Columns', '브랜드 공간 칼럼')}
                                </h2>
                            </div>
                            <Link to="/subscribe" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0d0d0d', textDecoration: 'none' }}
                                className="hover:text-blue-600 transition-colors">
                                {t('View Magazine Archive', '매거진 아카이브 보기')}
                                <ArrowRight style={{ width: '12px', height: '12px' }} />
                            </Link>
                        </div>

                        {/* 12-column grid: 8 + 4 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="md:grid-cols-12-auto">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3rem' }}>
                                {/* Main column (8 cols) */}
                                <Link to={`/space/${mainColumn.slug}`} style={{ gridColumn: 'span 8', textDecoration: 'none', color: 'inherit' }} className="group cursor-pointer">
                                    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', borderRadius: '1.5rem', marginBottom: '2rem' }}>
                                        <img
                                            src={mainColumn.img}
                                            alt={mainColumn.titleEn}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                                            className="group-hover:scale-105"
                                        />
                                    </div>
                                    <div style={{ maxWidth: '600px' }}>
                                        <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                            {lang === 'KR' ? mainColumn.tagKr : mainColumn.tagEn} · {mainColumn.location}
                                        </span>
                                        <h3 style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '1rem', letterSpacing: '-0.01em' }}
                                            className="group-hover:text-blue-700 transition-colors">
                                            {lang === 'KR' ? mainColumn.titleKr : mainColumn.titleEn}
                                        </h3>
                                        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                            {mainColumn.desc}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8' }}>
                                            <span>By {mainColumn.author}</span>
                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                                            <span>{mainColumn.readTime}</span>
                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPremiumStatus(mainColumn.slug) ? '#1111d4' : '#64748b' }}>
                                                {getPremiumStatus(mainColumn.slug) ? (
                                                    <>
                                                        <Lock style={{ width: '10px', height: '10px' }} />
                                                        Premium
                                                    </>
                                                ) : (
                                                    <>
                                                        <Globe style={{ width: '10px', height: '10px' }} />
                                                        Free Access
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Side columns (4 cols) */}
                                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    {sideColumns.map(col => (
                                        <Link to={`/space/${col.slug}`} key={col.slug} style={{ textDecoration: 'none', color: 'inherit' }} className="group cursor-pointer">
                                            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '1rem', marginBottom: '1.25rem' }}>
                                                <img
                                                    src={col.img}
                                                    alt={col.titleEn}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                                                    className="group-hover:scale-110"
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                                <span style={{ color: '#94a3b8' }}>
                                                    {col.slug === 'void-space' ? (lang === 'KR' ? '공간 정체성' : 'Spatial Identity') : (lang === 'KR' ? '힐링 스테이' : 'Healing Stay')}
                                                </span>
                                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPremiumStatus(col.slug) ? '#1111d4' : '#64748b' }}>
                                                    {getPremiumStatus(col.slug) ? (
                                                        <>
                                                            <Lock style={{ width: '10px', height: '10px' }} />
                                                            Premium
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe style={{ width: '10px', height: '10px' }} />
                                                            Free Access
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <h4 style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}
                                                className="group-hover:text-blue-700 transition-colors">
                                                {lang === 'KR' ? col.titleKr : col.titleEn}
                                            </h4>
                                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {lang === 'KR' ? col.descKr : col.descEn}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Pillar 2: New Korean Products (Free) ────────────────── */}
                <section style={{ padding: '6rem 0', backgroundColor: '#f8fafc' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#1111d4', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>KULT Insider</p>
                            <h2 style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                                {t('New Product News', '신상품 뉴스')}
                            </h2>
                            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#94a3b8' }}>
                                {t('The Curated Release Radar: Beauty, Lifestyle & Fashion', '큐레이티드 릴리즈 레이더: 뷰티, 라이프스타일 & 패션')}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                            {products.map(product => (
                                <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500" style={{ padding: '8px', borderRadius: '1rem' }}>
                                    <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '0.75rem', backgroundColor: '#f1f5f9', marginBottom: '1.25rem' }}>
                                        <img
                                            src={product.img}
                                            alt={product.nameEn}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            className="group-hover:scale-110"
                                        />
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#1111d4', color: '#fff', fontSize: '8px', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                            New Drop
                                        </div>
                                    </div>
                                    <div style={{ padding: '0 12px 16px' }}>
                                        <p style={{ fontSize: '9px', fontWeight: 700, color: '#1111d4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>{product.brand}</p>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', lineHeight: 1.4 }}>
                                            {lang === 'KR' ? product.nameKr : product.nameEn}
                                        </h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {lang === 'KR' ? product.descKr : product.descEn}
                                        </p>
                                        <button style={{ width: '100%', padding: '10px 0', border: '1px solid #e2e8f0', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                                            className="hover:bg-slate-900 hover:text-white hover:border-slate-900">
                                            {t('Explore News', '뉴스 보기')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Newsletter CTA ─────────────────────────────────────── */}
                <section style={{ padding: '6rem 0', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
                        <h2 style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#0d0d0d', marginBottom: '1rem' }}>
                            {t('Join the KULT Transmission', 'KULT 트랜스미션에 합류하세요')}
                        </h2>
                        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '3rem' }}>
                            {t('Receive weekly editorial dossiers on Korea\'s rising spaces and brands.', '한국의 떠오르는 공간과 브랜드에 대한 주간 에디토리얼 도시에를 받아보세요.')}
                        </p>
                        <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', gap: '8px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '9999px' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('Terminal ID (Email)', '이메일')}
                                style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 1.5rem', height: '48px', color: '#0d0d0d' }}
                            />
                            <button style={{ backgroundColor: '#1111d4', color: '#fff', fontWeight: 700, padding: '0 2rem', borderRadius: '9999px', height: '48px', border: 'none', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', transition: 'background 0.2s' }}
                                className="hover:bg-slate-900">
                                {t('Subscribe', '구독')}
                            </button>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '9px', color: '#cbd5e1', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {t('Or', '또는')} <Link to="/subscribe" style={{ color: '#1111d4', textDecoration: 'none', fontWeight: 700 }}>{t('start a membership', '멤버십 시작하기')}</Link> {t('for full access.', '전체 접근권을 얻으세요.')}
                        </p>
                    </div>
                </section>
            </main>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <footer style={{ backgroundColor: '#fff', paddingTop: '5rem', paddingBottom: '2rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#1111d4' }}>
                            <Orbit strokeWidth={1.5} style={{ width: '24px', height: '24px' }} />
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#0d0d0d' }}>KULT</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '200px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {t('A premium editorial platform curating the modern Korean identity.', '현대 한국의 정체성을 큐레이팅하는 프리미엄 에디토리얼 플랫폼.')}
                        </p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem', color: '#0d0d0d' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[t('Space Columns', '공간 칼럼'), t('Product News', '신상품 뉴스'), t('Brand Directory', '브랜드 디렉토리')].map(item => (
                                <li key={item}><span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', cursor: 'default' }}>{item}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem', color: '#0d0d0d' }}>Magazine</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[t('About KULT', 'KULT 소개'), t('Editorial Team', '에디토리얼 팀'), t('Contact', '문의')].map(item => (
                                <li key={item}><span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', cursor: 'default' }}>{item}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2rem', color: '#0d0d0d' }}>Social</h4>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {[Instagram, Globe].map((Icon, i) => (
                                <span key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}
                                    className="hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                                    <Icon strokeWidth={1.5} style={{ width: '16px', height: '16px', color: '#64748b' }} />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#cbd5e1' }}>
                        © 2024 KULT Space & Brand Editorial. Seoul, South Korea.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
