import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Bell, User, ChevronRight, FolderOpen, MapPin, Share2, Lock, Star, Plus, Orbit, Globe, Terminal } from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

const sectorDataList = [
    {
        id: 'SEC-01',
        name: 'Seongsu',
        nameKr: '성수',
        slug: 'seongsu',
        status: 'Active Curation',
        statusKr: '활성 큐레이션',
        archives: 42,
        img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
        active: true
    },
    {
        id: 'SEC-02',
        name: 'Ikseon-dong',
        nameKr: '익선동',
        slug: 'ikseon-dong',
        status: 'Active Curation',
        statusKr: '활성 큐레이션',
        archives: 18,
        img: 'https://images.unsplash.com/photo-1628134785730-18fb0d48f293?auto=format&fit=crop&q=80&w=1200',
        active: true
    },
    {
        id: 'SEC-03',
        name: 'Seochon',
        nameKr: '서촌',
        slug: 'seochon',
        status: 'Active Curation',
        statusKr: '활성 큐레이션',
        archives: 24,
        img: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=1200',
        active: true
    },
    {
        id: 'SEC-04',
        name: 'Bukchon',
        nameKr: '북촌',
        slug: 'bukchon',
        status: 'Active Curation',
        statusKr: '활성 큐레이션',
        archives: 31,
        img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200',
        active: true
    },
    {
        id: 'SEC-05',
        name: 'Gangnam',
        nameKr: '강남',
        slug: 'gangnam',
        status: 'Standby',
        statusKr: '대기 중',
        archives: 56,
        img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200',
        active: false
    },
    {
        id: 'SEC-06',
        name: 'Yeonnam',
        nameKr: '연남',
        slug: 'yeonnam',
        status: 'Active Curation',
        statusKr: '활성 큐레이션',
        archives: 29,
        img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200',
        active: true,
        featured: true
    }
]

const SectorSelector = () => {
    const navigate = useNavigate()
    const { t } = useLanguage()

    const handleSectorClick = (sector) => {
        if (!sector.active) {
            alert(t('Access Denied: Sector in Standby Protocol', '접근 거부: 섹터가 대기 프로토콜 상태입니다'))
            return
        }
        navigate(`/search/${sector.slug}`)
    }

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-primary selection:text-white text-slate-800 font-display text-left">
            <Header />

            <div className="flex h-full grow flex-col">
                {/* Back Button Overlay */}
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:border-primary/50 hover:bg-white transition-all group cursor-pointer shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    </button>
                </div>

                <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 lg:py-24 w-full">
                    {/* Breadcrumbs & Status */}
                    <div className="flex items-center gap-4 mb-16 text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase italic">
                        <span className="text-primary italic">{t("System", "시스템")}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-200" />
                        <span>{t("Seoul Command Center", "서울 지휘 센터")}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-200" />
                        <span className="text-slate-900">{t("Sector Archives", "섹터 아카이브")}</span>
                    </div>

                    {/* Main Heading Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                        <div className="max-w-3xl">
                            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-slate-900 uppercase mb-8">
                                {t("ARCHIVE", "아카이브")} <span className="text-primary italic font-light tracking-tighter">{t("Sectors", "섹터")}</span>
                            </h1>
                            <p className="text-slate-500 text-xl font-light tracking-wide border-l-4 border-primary pl-8 max-w-2xl leading-relaxed">
                                {t("Curated spatial coordinates for Seoul Metro District. Accessing high-fidelity archival data streams for urban exploration.", "서울 메트로 지역의 큐레이션된 공간 좌표입니다. 도시 탐험을 위한 고정밀 아카이브 데이터 스트림에 접속 중입니다.")}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 pb-2">
                            <span className="text-[10px] font-black tracking-[0.5em] text-slate-900 uppercase">{t("System Uptime", "시스템 가동률")}</span>
                            <div className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">99.98%</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-12 border-b border-slate-100 mb-20 overflow-x-auto no-scrollbar scroll-smooth">
                        {[
                            t('All Hubs', '모든 허브'),
                            t('Metro Districts', '메트로 지구'),
                            t('Local Archives', '로컬 아카이브'),
                            t('Heritage Keys', '헤리티지 키')
                        ].map((tab, idx) => (
                            <button
                                key={idx}
                                className={`pb-8 text-[11px] font-black tracking-[0.4em] uppercase transition-all whitespace-nowrap relative ${idx === 0 ? 'text-primary' : 'text-slate-400 hover:text-slate-900 cursor-pointer'}`}
                            >
                                {tab}
                                {idx === 0 && <span className="absolute bottom-0 left-0 w-full h-1.5 bg-primary rounded-t-full"></span>}
                            </button>
                        ))}
                    </div>

                    {/* Sector Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {sectorDataList.map((sector) => (
                            <div
                                key={sector.id}
                                className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-primary/10 hover:border-primary/20 transition-all duration-700 cursor-pointer"
                                onClick={() => handleSectorClick(sector)}
                            >
                                <div className="h-72 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <img
                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ${sector.active ? '' : 'grayscale opacity-50'}`}
                                        src={sector.img}
                                        alt={t(sector.name, sector.nameKr)}
                                    />
                                    <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                                        <div className="bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl shadow-xl border border-white/50 text-slate-900">
                                            {sector.active ? (
                                                <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
                                            ) : (
                                                <Lock className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                                            )}
                                        </div>
                                    </div>
                                    {sector.featured && (
                                        <div className="absolute top-8 left-8 z-20 bg-primary px-5 py-2.5 rounded-2xl shadow-xl shadow-primary/30 flex items-center gap-2">
                                            <Star className="w-4 h-4 text-white fill-white" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">{t("Featured Hub", "추천 허브")}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-10 relative">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-2">{t(sector.name, sector.nameKr)}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full ${sector.active ? 'bg-primary' : 'bg-slate-300'}`}></span>
                                                <span className={`text-[10px] font-black tracking-[0.3em] uppercase italic ${sector.active ? 'text-primary' : 'text-slate-400'}`}>
                                                    {t(sector.status, sector.statusKr)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 tracking-[0.2em] italic pr-2 pt-1">{sector.id}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-900 tracking-[0.2em]">{sector.archives} {t("UNITS", "유닛")}</span>
                                            <span className="text-[8px] font-bold text-slate-400 tracking-[0.1em] uppercase">{t("Verified Archives", "인증된 아카이브")}</span>
                                        </div>
                                        <button className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${sector.active ? 'bg-slate-900 text-white group-hover:bg-primary shadow-xl shadow-slate-200 group-hover:shadow-primary/30' : 'bg-slate-100 text-slate-300'}`}>
                                            {sector.active ? <ChevronRight className="w-7 h-7" strokeWidth={2.5} /> : <Lock className="w-5 h-5" strokeWidth={2} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Sector Button */}
                        <div
                            className="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 min-h-[450px] hover:border-primary/30 hover:bg-slate-50 transition-all duration-500 cursor-pointer group"
                            onClick={() => alert(t('Protocol Initialization: Expanding Network Node...', '프로토콜 초기화: 네트워크 노드 확장 중...'))}
                        >
                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-all duration-500 shadow-inner">
                                <Plus className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" strokeWidth={1} />
                            </div>
                            <span className="text-[11px] font-black tracking-[0.5em] uppercase text-slate-400 group-hover:text-primary transition-colors">{t("Expand Network", "네트워크 확장")}</span>
                        </div>
                    </div>
                </main>

                {/* Command Footer */}
                <footer className="mt-24 border-t border-slate-200 px-6 md:px-10 py-12 bg-white flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col sm:flex-row items-center gap-12">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(17,17,212,0.5)]"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-slate-900 uppercase">PROCESSOR_STABLE</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Terminal className="w-4 h-4 text-slate-300" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">HUB_NODE: 127.0.0.1</span>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <button
                            className="text-[10px] font-black tracking-[0.4em] uppercase py-5 px-10 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 italic cursor-pointer"
                            onClick={() => alert(t('Archival Protocols: Accessing...', '아카이브 프로토콜: 접속 중...'))}
                        >
                            {t("Protocols", "프로토콜")}
                        </button>
                        <button
                            className="text-[10px] font-black tracking-[0.4em] uppercase py-5 px-10 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 hover:bg-primary transition-all text-white group relative overflow-hidden cursor-pointer"
                            onClick={() => alert(t('Data Export: Initializing Archive Stream...', '데이터 내보내기: 아카이브 스트림 초기화 중...'))}
                        >
                            <span className="relative z-10">{t("EXPORT ARCHIVE", "아카이브 내보내기")}</span>
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default SectorSelector
