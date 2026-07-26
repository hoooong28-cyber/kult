import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MapPin, ShieldCheck, Flame, Utensils, Scissors, Coffee, ArrowRight, BookOpen } from 'lucide-react'
import ConciergeModal from './ConciergeModal'

const spotsData = [
    {
        id: 'spot-1',
        name: 'Born & Bred Seongsu',
        category: 'Hot Dining',
        categoryIcon: '🥩',
        location: 'Seongsu',
        trendScore: '🔥 9.9/10',
        articleSlug: 'seongsu-route',
        desc: 'The undisputed temple of Korean Hanwoo beef. Frequented by international celebrities and Michelin inspectors, famous for its exclusive 15-course private omakase.',
        img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
        tags: ['Hanwoo Omakase', 'Celeb Favorite', 'No K-Phone Required']
    },
    {
        id: 'spot-2',
        name: 'Jenny House Cheongdam',
        category: 'Salon/Spa',
        categoryIcon: '✂️',
        location: 'Cheongdam',
        trendScore: '🔥 9.8/10',
        articleSlug: 'tamburins-sinsa',
        desc: 'Seoul\'s premier K-Beauty salon styling top idols and Hallyu actresses. Experience personalized scalp head spas and signature Glass-Skin makeup sessions.',
        img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
        tags: ['K-Pop Hair & Makeup', 'Head Spa', 'VIP Consultation']
    },
    {
        id: 'spot-3',
        name: 'Lowther & Anthracite Hannam',
        category: 'Hot Cafes',
        categoryIcon: '☕',
        location: 'Hannam',
        trendScore: '🔥 9.7/10',
        articleSlug: 'void-space',
        desc: 'A striking industrial glasshouse cafe hidden in Hannam-dong alleys, renowned for artisanal roasts, minimalist aesthetics, and viral brunch pastry tables.',
        img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
        tags: ['Brunch & Drip Coffee', 'Architectural Void', 'Instant Seat']
    },
    {
        id: 'spot-4',
        name: 'Geumdwaeji Sikdang (Gold Pig)',
        category: 'Hot Dining',
        categoryIcon: '🥩',
        location: 'Shingumho',
        trendScore: '🔥 9.9/10',
        articleSlug: 'seongsu-route',
        desc: 'Michelin Bib Gourmand recognized pork belly sensation. Longed by BTS members and global gourmands, featuring premium YDP pork grilled over bone-charcoal.',
        img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
        tags: ['Michelin Bib Gourmand', 'BTS Visit', 'Zero Line Bypass']
    }
]

const ConciergeBooking = () => {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [activeSpotForModal, setActiveSpotForModal] = useState(null)

    const categories = [
        { key: 'All', label: '🔥 All', icon: Flame },
        { key: 'Salon/Spa', label: '✂️ Salon/Spa', icon: Scissors },
        { key: 'Hot Cafes', label: '☕ Hot Cafes', icon: Coffee },
        { key: 'Hot Dining', label: '🥩 Hot Dining', icon: Utensils }
    ]

    const filteredSpots = selectedCategory === 'All'
        ? spotsData
        : spotsData.filter(s => s.category === selectedCategory)

    return (
        <section id="concierge-section" className="py-24 bg-[#FAF8F5] text-[#191A1F] border-t border-b border-[#E5DFD5] relative overflow-hidden selection:bg-primary selection:text-white">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1111d4]/10 border border-[#1111d4]/20 text-[#1111d4] text-[10px] font-extrabold uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Kult Concierge Experience</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight text-[#191A1F] leading-tight">
                        Seoul's Trendiest Spots - Instant Verification-Free Booking
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
                        Read the story, then reserve the experience. Bypass Korean ID & phone verification barriers to secure hard-to-get tables, salons, and private access through our bilingual concierge team.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex p-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-sm flex-wrap justify-center gap-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                    selectedCategory === cat.key
                                        ? 'bg-[#191A1F] text-white shadow-md'
                                        : 'text-slate-500 hover:text-[#191A1F] hover:bg-slate-50'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Curation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredSpots.map((spot) => (
                        <div
                            key={spot.id}
                            className="group flex flex-col rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-400 transition-all duration-500 hover:-translate-y-1 text-left"
                        >
                            {/* Card Image Header */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <img
                                    src={spot.img}
                                    alt={spot.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                        <MapPin className="w-3 h-3 text-[#1111d4]" />
                                        {spot.location}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                                        {spot.trendScore}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content Body */}
                            <div className="p-6 flex flex-col grow justify-between gap-6">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-[9px] font-extrabold text-[#1111d4] uppercase tracking-widest">
                                        <span>{spot.categoryIcon} {spot.category}</span>
                                    </div>

                                    <h3 className="text-lg font-serif font-bold text-[#191A1F] uppercase tracking-tight leading-snug group-hover:text-[#1111d4] transition-colors">
                                        {spot.name}
                                    </h3>

                                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-3">
                                        {spot.desc}
                                    </p>
                                </div>

                                {/* Tags & Dual Actions (Read Story + Book Concierge) */}
                                <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-1.5">
                                        {spot.tags.map((t, idx) => (
                                            <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[9px] font-bold text-slate-600 border border-[#E5DFD5]">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Link
                                            to={`/space/${spot.articleSlug}`}
                                            className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                                        >
                                            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                            <span>Read Story</span>
                                        </Link>

                                        <button
                                            onClick={() => setActiveSpotForModal(spot)}
                                            className="w-full h-11 rounded-xl bg-[#191A1F] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1111d4] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <span>Book via Concierge</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Concierge Trust Banner */}
                <div className="mt-16 p-8 rounded-2xl bg-white border border-[#E5DFD5] flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#1111d4]/10 border border-[#1111d4]/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-[#1111d4]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-bold text-[#191A1F] uppercase tracking-wide">Custom Itinerary & Private Reservations</h4>
                            <p className="text-xs text-slate-600 font-normal">Need pop-up VIP passes, private drivers, or custom dining arrangements? Our 24/7 bilingual concierge handles everything.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveSpotForModal(spotsData[0])}
                        className="px-6 py-3.5 rounded-xl bg-[#191A1F] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1111d4] transition-colors shrink-0 shadow-md"
                    >
                        Request Custom Concierge
                    </button>
                </div>

            </div>

            {/* Concierge Pre-Auth Booking Modal */}
            {activeSpotForModal && (
                <ConciergeModal
                    spot={activeSpotForModal}
                    onClose={() => setActiveSpotForModal(null)}
                />
            )}
        </section>
    )
}

export default ConciergeBooking
