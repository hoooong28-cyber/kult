import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, CheckCircle2, RefreshCw, Layers, ArrowLeft, Eye, Send, Globe, Radio } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'
import defaultStaged from '../data/staged_volumes.json'

const AdminStaging = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [stagedVolumes, setStagedVolumes] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Load staged volumes from local storage or json
        const saved = localStorage.getItem('kult_staged_volumes')
        if (saved) {
            try {
                setStagedVolumes(JSON.parse(saved))
            } catch (e) {
                setStagedVolumes(defaultStaged || [])
            }
        } else {
            setStagedVolumes(defaultStaged || [])
        }
    }, [])

    const saveStaged = (updated) => {
        setStagedVolumes(updated)
        localStorage.setItem('kult_staged_volumes', JSON.stringify(updated))
    }

    const handlePublish = (volId) => {
        const updated = stagedVolumes.map(v => {
            if (v.id === volId) {
                return { ...v, status: 'published', issueDate: `${v.issueDate.split(' ')[0]} (PUBLISHED)` }
            }
            return v
        })
        saveStaged(updated)
        
        // Save published volume to published store
        const publishedSaved = JSON.parse(localStorage.getItem('kult_published_volumes') || '[]')
        const pubVol = updated.find(v => v.id === volId)
        if (pubVol && !publishedSaved.find(p => p.id === volId)) {
            publishedSaved.unshift(pubVol)
            localStorage.setItem('kult_published_volumes', JSON.stringify(publishedSaved))
        }

        setMessage(`✅ Volume ${volId.toUpperCase()} has been successfully approved and published!`)
        setTimeout(() => setMessage(''), 4000)
    }

    const handleSimulateAutoScout = () => {
        setLoading(true)
        setTimeout(() => {
            const nextNum = 6 + stagedVolumes.length
            const newVol = {
                id: `vol-${nextNum}`,
                volume: nextNum,
                title: `Auto-Scout Vol. 0${nextNum}: Dosan Metal Brutalism & Glassskin Serums`,
                titleKr: `자율 수집 Vol. 0${nextNum}: 도산 메탈 브루탈리즘 & 글래스스킨 세럼`,
                issueDate: `2024.04.W${nextNum - 4} (AUTO STAGED)`,
                status: 'staged',
                createdAt: new Date().toISOString(),
                coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
                description: "Curated from Instagram @space.archive & X #GlassSkin2024: Metal frame interior architecture and high-potency bio-ferment serums.",
                descriptionKr: "인스타그램 @space.archive 및 X(트위터) 실시간 수집: 금속 프레임 인테리어와 고농축 바이오 발효 세럼.",
                sections: [
                    {
                        title: "Industrial Metal Brutalism",
                        titleKr: "도산동 산업 금속 브루탈리즘",
                        source: "Source: Instagram @space.archive & X #Seongsu",
                        content: "Explorations into raw steel facades and minimalist concrete coffee bars in Dosan-daero.",
                        contentKr: "도산대로 노출 철강 파사드와 미니멀 콘크리트 바의 감각적 조화.",
                        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800"
                    }
                ],
                featuredProducts: [
                    {
                        brand: "Torriden",
                        name: "DIVE-IN Low Molecular Serum",
                        nameKr: "토리든 다이브인 저분자 히알루론산 세럼",
                        description: "Official Instagram Feature: 5D complex hyaluronic acid serum for deep inner hydration.",
                        descriptionKr: "인스타그램 릴스 올영 1위: 속건조를 즉각 해결하는 5D 수분 보습 세럼.",
                        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
                        tag: "INSTAGRAM BEST"
                    }
                ]
            }
            const updated = [newVol, ...stagedVolumes]
            saveStaged(updated)
            setLoading(false)
            setMessage(`✨ New volume Vol. 0${nextNum} scouted and staged successfully!`)
            setTimeout(() => setMessage(''), 4000)
        }, 1200)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-[#1111d4] selection:text-white pb-32">
            <Header />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12">
                {/* Back button & Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div className="flex flex-col gap-3 text-left">
                        <Link to="/magazine" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to KULT Magazine</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1111d4]/20 border border-[#1111d4]/40 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#1111d4]" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight">
                                KULT Auto-Curator Staging Queue
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                            {t(
                                "Autonomous trend curation engine for X, Instagram & Olive Young. Review AI-scouted volumes and publish live in 1-click.",
                                "X, 인스타그램, 올리브영 자율 수집 엔진. AI가 자동 세탁한 볼륨을 미리보고 1-클릭으로 정식 발행하세요."
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSimulateAutoScout}
                            disabled={loading}
                            className="px-6 py-3.5 rounded-xl bg-[#1111d4] text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-[#1111d4]/30 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>{loading ? 'Scouting Trends...' : '⚡ Trigger Auto-Scout Now'}</span>
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                {/* Queue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Staged Volumes</span>
                        <span className="text-3xl font-black text-white">
                            {stagedVolumes.filter(v => v.status === 'staged').length} Volumes
                        </span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Trend Feeds</span>
                        <span className="text-3xl font-black text-[#1111d4]">X • Instagram • Olive Young</span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Autonomy Status</span>
                        <span className="text-3xl font-black text-emerald-400 flex items-center gap-2">
                            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
                            ACTIVE
                        </span>
                    </div>
                </div>

                {/* Staged Volumes List */}
                <div className="flex flex-col gap-8">
                    {stagedVolumes.map((vol) => (
                        <div
                            key={vol.id}
                            className={`rounded-3xl border p-8 transition-all flex flex-col gap-8 text-left ${
                                vol.status === 'published'
                                    ? 'bg-emerald-950/20 border-emerald-500/30'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                                        vol.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    }`}>
                                        {vol.status === 'published' ? '✅ LIVE PUBLISHED' : '⏳ STAGED DRAFT'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        Vol. {vol.volume} • {vol.issueDate}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/magazine"
                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Preview Magazine</span>
                                    </Link>

                                    {vol.status !== 'published' && (
                                        <button
                                            onClick={() => handlePublish(vol.id)}
                                            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Approve & Publish Now</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Content Body Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                                    <img src={vol.coverImage} className="w-full h-full object-cover" alt="Cover" />
                                </div>

                                <div className="lg:col-span-2 flex flex-col gap-4">
                                    <h3 className="text-xl md:text-3xl font-serif font-bold uppercase tracking-tight text-white">
                                        {t(vol.title, vol.titleKr)}
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        {t(vol.description, vol.descriptionKr)}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scouted Sections & Sources</span>
                                        {vol.sections.map((sec, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-white uppercase">{t(sec.title, sec.titleKr)}</span>
                                                    {sec.source && (
                                                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                                                            📍 {sec.source}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t(sec.content, sec.contentKr)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AdminStaging
