import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, ChevronLeft, ChevronRight, Orbit, Globe, Instagram } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
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
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOeAEDReiO56NceRRAI74x11UkMAFpLTD8rCqj6Dt1pbF3arduDR00v0-ywXgvJV8TuH-x6mypHbt2yGFcQ2bkNRhYCFDYAUOO5qlimCTFvJ6yeN0tbXXHhSEv1PrWHsrBqlPg5uc11s0eSQEqTMSAMWxqC_IgFTc8TmkBMAh7gQGCkUbfhDSAy7xMO0NrAsZUO0eX83mN83tQ_lxjJMD1S2abzB2uQmcQmRQxtGUs5jIvKhCMXyT_UoSSIcB0hOsDt4_whSqdSjVN',
    desc: 'Exploring how Arumjigi Culture Keepers Foundation bridges the gap between Joseon-era aesthetics and 21st-century minimalism in the heart of Seoul.'
}

const sideColumns = [
    {
        slug: 'void-space',
        titleEn: 'Void Space: Curating Emptiness',
        titleKr: '보이드 스페이스: 비어있음을 큐레이팅하다',
        descEn: 'Inside Hannam\'s most enigmatic concrete shell where art becomes an atmospheric experience.',
        descKr: '예술이 분위기 경험이 되는 한남의 가장 수수께끼 같은 콘크리트 공간 내부.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbwoL1fq_JksuTSIQIDc7aKzarYFCoKXSumbSeFD4TWpCcU4858QFMLYdYebKkiZR2jIFI1Ei9rgbQtdkXOHuljgW7VDJNzMAAwGaKuNkaLY6127SDCwTsk2kK1eC1_tfaDDAJHRQbbplp2pfiNDZuBrLhn6446CsRVlnIdLQvEPy5HilTe6nGGGoNYB8zN6L9ISkrK_tR1jP5sDMbVWukDfDARBmz7zviyycbc2XIbshKwgivg43cPtycFsPWD5743_ye5gxVo3r3'
    },
    {
        slug: 'pine-hideaway',
        titleEn: 'Gangwon Forest Retreats',
        titleKr: '강원 포레스트 리트리트',
        descEn: 'How contemporary architects are weaving luxury stays into the dense cedar canopies of Pyeongchang.',
        descKr: '현대 건축가들이 평창의 빽빽한 삼나무 숲 사이에 럭셔리 스테이를 엮어내는 방법.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnz2ezosgYy1InE6M-vxahUlcD39OD0pvgs5qPupHwpGcZr1Ec3pwOUr1T6MSQydMR9XbCIw-loP0wEBYXtYYZjnGpO0K1a9Fhf--q4V1jW4KyxHNuX1p_Vuu749zGUQFvrKBVkUPN9YNv68yqozKkH86YlL2rpXyYlUXDAjM06W0X1bj6Yg-W6I2PdqzKRbR4-IpYDyvAqljF9nR-t6_JiBngrHivGFtmfN0OI1KLc_Vv_rttoDWEFpYL6tZKE1TwFmhMig6L_y3U'
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
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANx8Mn2dg7Tpng5l62dRg7UYS0QEnujBySMMIfqtmNElNn_BgWflDwnlrWZ4_sTc1qYwMLSdV-ddaZ-Su9DAtEOORvntUvQPUACDgmRRnbOfIEfni6kk_9TBsz_e5JoleZoWFsvH18S5WJJMMJ9qqGFMieeUt12ILpDnH-iqWMhKyej9azd5mIpNyidEp81uQGuQCIyvyyq533mRRUD8KVK4z2A0WvMCvPZFntBM4xgU2U4Btyp7VZWzapwuZGXcGlnHDeVFxHR62S'
    },
    {
        id: 'p2',
        brand: 'HAY Korea',
        nameEn: 'Ceramic Series: Insa Edition',
        nameKr: '세라믹 시리즈: 인사 에디션',
        descEn: 'A collaboration between Nordic functionalism and Korean celadon heritage.',
        descKr: '북유럽 기능주의와 한국 청자 헤리티지의 협업.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9UubJlP9tkI7cnHbMKmEYrn5HMBOrEQcb7Q8sl2D7_dgC-wla-wjWHzRS7JllUGrlGto2PR8Cbe5PqpNe01evzAbjq2BNYDX9BW8r7NaTWBNL6CC-X-GHGbwpSHgkUZ2ffJqA8g9sKWnI5J9XjNrTTjEXJfJIWmT3EgXSCxx6mNHKJcjJIzPhhI_orLcgc1rgaAHrmLHoTl_Ri-RstcqlLBrYCLOyPfsSEyaM6Y4NNpJq0qNm9fMBekHxUI0ulod90isikVVnpVCo'
    },
    {
        id: 'p3',
        brand: 'Studio Odd',
        nameEn: 'Neon Archive 04 Lamp',
        nameKr: '네온 아카이브 04 램프',
        descEn: 'The vibrant energy of Euljiro nights captured in a minimalist lighting fixture.',
        descKr: '을지로의 생동감 넘치는 야경 에너지를 담은 미니멀리스트 조명.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHgCnS8Z0XjYLPwjNsmzPerwPFsLS5TOzybD0zm6Ha-zR4UhusmGnaSIUZZziy3FHZ2ZoXnCPo7AIIoAnU_FdGJedUA5zdwoUe21o_N1GkRmm15grWncJpdqaXwEmHel0zwomIUoNZUiUJURiWi0VuXWlggUPgsL75Txete1kIFfPoa7KkCgOgpAGDbGMtdls-0_q4EdBxpsr1BR-csF-GPuuUo7Jn3Ga6qohnoO65g4bPgUy0gavAcJWEdb80kBY0b-l0QgpCYKcN'
    },
    {
        id: 'p4',
        brand: 'Ader Error',
        nameEn: 'Object 012: The Hybrid Bag',
        nameKr: '오브젝트 012: 하이브리드 백',
        descEn: 'Deconstructed aesthetics meeting industrial durability in their latest drop.',
        descKr: '해체주의 미학과 산업적 내구성이 만난 최신 드롭.',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8hs2GzqCwBkGmzI2aDawlFFh-Y2btSLIoEKU6_lrMlmFIAeRn9pDsbW6_jRZ5ZChCQHFg53ONbi7_mawIVqbzM0KQBzTbg8D6YgNxWaP995MWHtBDKd1o9JGRYe9Q4m-LlfYUsYzVRFNDa1-5piIObKG57PxGHPfhkXuySAh9nwEGmM6FhL_gdNBaMNQ9JrxFZjAXLY9rlA4cu2Ugn3evEZkvOQWj6Ud6-AFQ48cDmCQbfnWmHJo7HMh-_AzGNe2Cb2vcqzp1XTmw'
    }
]

const getPremiumStatus = (slug) => {
    return ['void-space', 'arumjigi', 'tamburins-sinsa'].includes(slug);
}

const Home = () => {
    const { t, lang } = useLanguage()
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleRegionFilter = (value) => {
        if (value === 'seoul' || value === 'all') {
            navigate('/sectors')
        }
    }

    const handleCategorySelect = (val) => {
        if (val) {
            navigate('/search/seongsu', { state: { category: val } })
        }
    }

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
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf1blu6c8imp44TnDdmZGqeo88chuE6BEd1swlYnJerkGIzHeO-hj3Sj2OAdeA8_G-AmyulffbP2Kxn2WlS6yP2njTuxHUvlZ2tGnTDim9sB68oLr25Q1AQC0oA-xS4YPl_WnL2JGpAhVcPEeCN_378EtQwAF0pu4JDZMZkb8sI89gb3zsUuL1cRZPyiXChVsAxicZ2D395HMTOF2lneOnhNSmwTtTgFdC__NG7FpMBmQfv-J3moka4CRT7j2oGad8s3of5yjYtxyd"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 30%, rgba(0,0,0,0.2) 100%)', pointerEvents: 'none' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', maxWidth: '1280px', margin: '0 auto', padding: '0 2rem 5rem' }}>
                        <div style={{ maxWidth: '800px' }}>
                            <span style={{ display: 'inline-block', padding: '4px 14px', background: '#1111d4', color: '#fff', fontSize: '9px', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                {t('Curated Travel Route', '큐레이션 여행 가이드')}
                            </span>
                            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontFamily: 'Georgia, ui-serif, serif', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                                {t('72 Hours in Seoul: A Curation of Concrete & Hanok', '서울에서의 72시간: 콘크리트와 한옥의 미학적 여정')}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', fontWeight: 300, maxWidth: '620px', marginBottom: '2.5rem', lineHeight: 1.75, letterSpacing: '0.01em' }}>
                                {t('The ultimate spatial playbook for the aesthetic explorer. Navigating the brutalist coffee sanctuaries of Seongsu-dong, the silent pine hideaways of Bukchon, and the sensory retail chambers of Sinsa-dong.', '미학적 탐험가를 위한 서울 공간 플레이북. 성수동의 브루탈리스트 카페, 북촌의 고요한 한옥 리트리트, 신사동의 감각적인 브랜드 쇼룸을 아우르는 72시간의 루트.')}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link to="/sectors" style={{ display: 'inline-block', padding: '14px 36px', background: '#fff', color: '#0d0d0d', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}
                                    className="hover:bg-slate-100 transition-colors">
                                    {t('Explore Districts', '지구별 가이드 탐색')}
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
                                { label: t('All Collections', '전체'), value: 'all', enabled: true },
                                { label: 'Seoul', value: 'seoul', enabled: true },
                                { label: 'Busan', value: 'busan', enabled: false },
                                { label: 'Jeju', value: 'jeju', enabled: false },
                                { label: 'Gyeongju', value: 'gyeongju', enabled: false }
                            ].map(item => (
                                <button
                                    key={item.value}
                                    onClick={() => item.enabled && handleRegionFilter(item.value)}
                                    disabled={!item.enabled}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        cursor: item.enabled ? 'pointer' : 'not-allowed',
                                        color: item.value === 'all' ? '#0d0d0d' : '#94a3b8',
                                        borderBottom: item.value === 'all' ? '1px solid #1111d4' : 'none',
                                        paddingBottom: '2px',
                                        outline: 'none',
                                        opacity: item.enabled ? 1 : 0.35
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b' }}>Category:</span>
                            <select
                                onChange={(e) => handleCategorySelect(e.target.value)}
                                defaultValue=""
                                style={{ background: 'transparent', border: 'none', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1111d4', cursor: 'pointer', outline: 'none' }}
                            >
                                <option value="" disabled>{t('Select Category', '카테고리 선택')}</option>
                                <option value="cafe">{t('Cafe', '카페')}</option>
                                <option value="culture">{t('Culture', '컬처')}</option>
                                <option value="stay">{t('Stay', '스테이')}</option>
                                <option value="heritage">{t('Heritage', '헤리티지')}</option>
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
                                        <button 
                                            onClick={() => navigate('/magazine')}
                                            style={{ width: '100%', padding: '10px 0', border: '1px solid #e2e8f0', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                                            className="hover:bg-slate-900 hover:text-white hover:border-slate-900"
                                        >
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
            <Footer />
        </div>
    )
}

export default Home
