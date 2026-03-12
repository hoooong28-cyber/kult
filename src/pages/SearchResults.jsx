import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Search, MapPin, Star, Lock, X, SlidersHorizontal, ChevronRight, ChevronLeft, Orbit, LayoutGrid } from 'lucide-react'
import UserNav from '../components/UserNav'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

const sectorData = {
    'ikseon-dong': {
        title: 'Results in Ikseon-dong',
        titleKr: '익선동 검색 결과',
        location: 'Ikseon-dong',
        locationKr: '익선동',
        category: 'Cafe',
        categoryKr: '카페',
        spaces: []
    },
    'seochon': {
        title: 'Results in Seochon',
        titleKr: '서촌 검색 결과',
        location: 'Seochon',
        locationKr: '서촌',
        category: 'Art & Culture',
        categoryKr: '문화예술',
        spaces: []
    },
    'seongsu': {
        title: 'Results in Seongsu',
        titleKr: '성수동 검색 결과',
        location: 'Seongsu',
        locationKr: '성수동',
        category: 'Cafe',
        categoryKr: '카페',
        spaces: []
    },
    'bukchon': {
        title: 'Results in Bukchon',
        titleKr: '북촌 검색 결과',
        location: 'Bukchon',
        locationKr: '북촌',
        category: 'Heritage',
        categoryKr: '헤리티지',
        spaces: []
    }
}

const defaultSector = sectorData['seongsu']

const destinations = [
    { value: 'ikseon-dong', label: 'Ikseon-dong', labelKr: '익선동' },
    { value: 'seochon', label: 'Seochon', labelKr: '서촌' },
    { value: 'seongsu', label: 'Seongsu', labelKr: '성수' },
    { value: 'bukchon', label: 'Bukchon', labelKr: '북촌' },
]

const categories = [
    { value: 'cafe', label: 'Cafe', labelKr: '카페' },
    { value: 'culture', label: 'Culture', labelKr: '컬처' },
    { value: 'stay', label: 'Stay', labelKr: '스테이' },
    { value: 'heritage', label: 'Heritage', labelKr: '헤리티지' },
]

const SearchResults = () => {
    const { sector } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [currentPage, setCurrentPage] = useState(1)
    const [destOpen, setDestOpen] = useState(false)
    const [catOpen, setCatOpen] = useState(false)
    const [dbSpaces, setDbSpaces] = useState([])
    const destRef = useRef(null)
    const catRef = useRef(null)

    useEffect(() => {
        const fetchDbSpaces = async () => {
            try {
                const q = query(
                    collection(db, 'spaces'),
                    where('region', '==', sector || 'seongsu')
                )
                const querySnapshot = await getDocs(q)
                const spaces = querySnapshot.docs.map(doc => {
                    const d = doc.data()
                    const regionObj = destinations.find(dest => dest.value === d.region)
                    const catObj = categories.find(c => c.value === d.category)

                    const regionLabel = regionObj?.label || d.region
                    const regionLabelKr = regionObj?.labelKr || d.region

                    return {
                        id: doc.id,
                        ...d,
                        name: d.title,
                        nameKr: d.titleKr,
                        img: d.imageUrl,
                        location: `${regionLabel}, Seoul`,
                        locationKr: `서울 ${regionLabelKr}`,
                        category: catObj?.label || d.category,
                        categoryKr: catObj?.labelKr || d.category,
                        badge: 'New',
                        badgeKr: '신규'
                    }
                })
                setDbSpaces(spaces)
            } catch (err) {
                console.error("Error fetching db spaces:", err)
            }
        }
        fetchDbSpaces()
    }, [sector])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (destRef.current && !destRef.current.contains(event.target)) setDestOpen(false)
            if (catRef.current && !catRef.current.contains(event.target)) setCatOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const data = sectorData[sector] || defaultSector
    const displayTitle = t(data.title, data.titleKr)
    const displayLocation = t(data.location, data.locationKr)
    const [selectedCategory, setSelectedCategory] = useState('All')

    const handleLocationChange = (val) => {
        navigate(`/search/${val}`)
        setSelectedCategory('All')
        setDestOpen(false)
    }

    const handleCategoryChange = (val) => {
        setSelectedCategory(val)
        setCatOpen(false)
    }

    const mergedSpaces = [...data.spaces, ...dbSpaces]

    const filteredSpaces = selectedCategory === 'All'
        ? mergedSpaces
        : mergedSpaces.filter(s => {
            const cat = s.category || ''
            return cat.toLowerCase().includes(selectedCategory.toLowerCase())
        })

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 text-slate-800 font-display selection:bg-primary selection:text-white">
            <Header />

            <div className="layout-container flex h-full grow flex-col">
                <main className="flex flex-1 flex-col md:flex-row">
                    {/* Sidebar */}
                    <aside className="hidden lg:flex w-72 flex-col gap-10 p-10 border-r border-slate-100 bg-white">
                        <div className="flex flex-col gap-10">
                            <div>
                                <h4 className="text-[10px] tracking-[0.4em] uppercase font-black text-slate-900 mb-8 ml-1">{t("KULT Hub", "KULT 허브")}</h4>
                                <nav className="flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-primary text-white font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary/30 active:scale-95 transition-all text-left"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>{t("Discover", "디스커버")}</span>
                                    </button>
                                    <button
                                        onClick={() => alert(t('Booking system coming soon.', '예약 시스템 준비 중입니다.'))}
                                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-primary hover:bg-slate-50 transition-all font-black text-[10px] tracking-widest uppercase active:scale-95 text-left"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        <span>{t("Bookings", "예약")}</span>
                                    </button>
                                    <Link to="/credits" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-primary hover:bg-slate-50 transition-all font-black text-[10px] tracking-widest uppercase active:scale-95 text-left">
                                        <Lock className="w-4 h-4" />
                                        <span>{t("Credits", "크레딧")}</span>
                                    </Link>
                                    <button
                                        onClick={() => alert(t('Settings coming soon.', '설정 기능 준비 중입니다.'))}
                                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-primary hover:bg-slate-50 transition-all font-black text-[10px] tracking-widest uppercase active:scale-95 text-left"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        <span>{t("Settings", "설정")}</span>
                                    </button>
                                </nav>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                <h5 className="text-[9px] font-black tracking-widest text-slate-900 uppercase mb-4">{t("Space News", "공간 뉴스")}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed italic">{t('"The legacy of Bukchon is evolving with new 2024 digital sanctuaries."', '"북촌의 유산이 2024년 새로운 디지털 안식처와 함께 진화하고 있습니다."')}</p>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <section className="flex-1 flex flex-col p-6 md:p-12 gap-10 text-left">
                        {/* Breadcrumbs & Filters Header */}
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                                <Link to="/" className="hover:text-primary transition-colors">{t("Search", "검색")}</Link>
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                                <span className="text-slate-900">{displayLocation}</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="max-w-xl">
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase leading-tight md:leading-none mb-4">{displayTitle}</h2>
                                    <p className="text-slate-500 text-sm font-light">{t(`Showing our exclusively curated sanctuaries in the ${displayLocation} district.`, `${displayLocation} 지구에서 엄선된 큐레이션 안식처를 보여드립니다.`)}</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="relative" ref={destRef}>
                                        <div
                                            onClick={() => { setDestOpen(!destOpen); setCatOpen(false); }}
                                            className={`flex h-11 items-center gap-3 rounded-full bg-white border ${destOpen ? 'border-primary shadow-lg ring-2 ring-primary/10' : 'border-slate-200'} px-4 sm:px-6 shadow-sm cursor-pointer hover:border-primary/50 transition-all group`}
                                        >
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors hidden xs:inline">{t("Location:", "위치:")}</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{displayLocation}</span>
                                            <ChevronRight className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${destOpen ? 'rotate-90' : ''}`} />
                                        </div>
                                        {destOpen && (
                                            <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl p-3 z-[60] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                {destinations.map((d) => (
                                                    <button
                                                        key={d.value}
                                                        onClick={() => handleLocationChange(d.value)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${sector === d.value ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                                    >
                                                        {t(d.label, d.labelKr)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative" ref={catRef}>
                                        <div
                                            onClick={() => { setCatOpen(!catOpen); setDestOpen(false); }}
                                            className={`flex h-11 items-center gap-3 rounded-full bg-white border ${catOpen ? 'border-primary shadow-lg ring-2 ring-primary/10' : 'border-slate-200'} px-4 sm:px-6 shadow-sm cursor-pointer hover:border-primary/50 transition-all group`}
                                        >
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors hidden xs:inline">{t("Category:", "카테고리:")}</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{selectedCategory === 'All' ? t(data.category, "전체") : selectedCategory}</span>
                                            <ChevronRight className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${catOpen ? 'rotate-90' : ''}`} />
                                        </div>
                                        {catOpen && (
                                            <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl p-3 z-[60] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                <button
                                                    onClick={() => handleCategoryChange('All')}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                                >
                                                    {t("All Categories", "모든 카테고리")}
                                                </button>
                                                {categories.map((c) => (
                                                    <button
                                                        key={c.value}
                                                        onClick={() => handleCategoryChange(c.label)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${selectedCategory === c.label ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                                    >
                                                        {t(c.label, c.labelKr)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => alert(t('Filters coming soon.', '필터 기능 준비 중입니다.'))}
                                        className="flex h-11 items-center gap-3 rounded-full bg-slate-900 text-white px-6 shadow-xl shadow-slate-200 hover:brightness-110 active:scale-95 transition-all text-left"
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t("Filters", "필터")}</span>
                                        <SlidersHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid Results */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredSpaces.length > 0 ? (
                                filteredSpaces.map((space) => (
                                    <Link
                                        to={`/space/${space.id || encodeURIComponent(space.name)}`}
                                        key={space.name}
                                        className="group relative flex flex-col rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-2 transition-all duration-700"
                                    >
                                        <div className="relative w-full overflow-hidden aspect-[16/11]">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${space.img}')` }}
                                            ></div>
                                            {space.badge && (
                                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                                                    <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest tracking-tighter">
                                                        {t(space.badge, space.badgeKr)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 p-2.5 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                            </div>
                                        </div>
                                        <div className="p-7 flex flex-col gap-5 text-left">
                                            <div>
                                                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-2">{t(space.category, space.categoryKr)}</p>
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-none mb-3 uppercase">{t(space.name, space.nameKr)}</h3>
                                                <p className="text-xs flex items-center gap-1.5 text-slate-400 font-medium">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.5} />
                                                    {t(space.location, space.locationKr)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span>{space.rating}</span>
                                                    <span className="text-slate-300 font-normal ml-0.5">({space.reviews})</span>
                                                </div>
                                                <button className="flex items-center justify-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest hover:pl-2 transition-all">
                                                    {t("ACCESS", "입장")} <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase italic">{t("No archives found matching this data stream.", "해당 데이터 스트림과 일치하는 아카이브를 찾을 수 없습니다.")}</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center py-12">
                            <div className="flex gap-3">
                                <button className="size-11 rounded-2xl flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all bg-white shadow-sm active:scale-95 cursor-pointer">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {[1, 2, 3].map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`size-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all active:scale-95 shadow-sm cursor-pointer ${currentPage === page
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary'
                                            : 'border border-slate-200 bg-white text-slate-400 hover:border-primary/50 hover:text-primary'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button className="size-11 rounded-2xl flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all bg-white shadow-sm active:scale-95 cursor-pointer">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="mt-auto border-t border-slate-100 bg-white/50 p-12 text-center text-left md:text-center">
                    <div className="flex flex-col gap-6 items-center">
                        <div className="flex items-center gap-3 text-primary font-black text-[10px] tracking-[0.4em] uppercase px-8 py-2 rounded-full border border-slate-200 bg-white shadow-sm">
                            <Orbit className="w-4 h-4" />
                            {t("KULT PRIVATE HUB", "KULT 프라이빗 허브")}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">© 2024 KULT Space Travel. {t("Curating Korea's future.", "대한민국의 미래를 큐레이팅합니다.")}</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default SearchResults
