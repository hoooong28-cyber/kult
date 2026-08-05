import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Orbit, Search, Globe } from 'lucide-react'
import UserNav from './UserNav'
import { useLanguage } from '../context/LanguageContext'

const Header = () => {
    const { lang, toggleLang, t } = useLanguage()
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search/seongsu?query=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-2xl border-b border-slate-200">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5">
                <div className="flex justify-between items-center whitespace-nowrap">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <Orbit className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(17,17,212,0.4)]" strokeWidth={1.5} />
                        <h1 className="text-xl font-black tracking-tighter text-slate-900">KULT</h1>
                    </Link>

                    {/* Desktop Search (Simplified) */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-full px-5 py-2 group focus-within:border-primary/50 transition-all duration-500">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-xs w-48 placeholder:text-slate-500 uppercase tracking-widest ml-2 text-slate-700 font-display"
                            placeholder={t("Search spaces...", "공간 검색...")}
                            type="text"
                        />
                    </form>

                    {/* Right Utilities */}
                    <div className="flex items-center gap-3 md:gap-10">
                        <nav className="hidden lg:flex items-center gap-10 text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
                            <Link className="hover:text-primary transition-all duration-300" to="/">{t("Discover", "디스커버")}</Link>
                            <a 
                                className="hover:text-primary transition-all duration-300 cursor-pointer flex items-center gap-1 text-primary font-black"
                                onClick={() => {
                                    const el = document.getElementById('concierge-section')
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth' })
                                    } else {
                                        navigate('/', { state: { scrollToConcierge: true } })
                                    }
                                }}
                            >
                                <span>🔥 {t("Concierge", "컨시어지")}</span>
                            </a>
                            <Link className="hover:text-primary transition-all duration-300" to="/subscribe">{t("Subscribe", "구독하기")}</Link>
                        </nav>
                        <div className="h-4 w-[1px] bg-slate-200 hidden lg:block"></div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <UserNav />
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-2 px-2 md:px-3 py-1.5 border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 hover:text-primary hover:border-primary transition-all"
                            >
                                <Globe className="w-3 h-3" />
                                <span className="hidden xs:inline">{lang}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
