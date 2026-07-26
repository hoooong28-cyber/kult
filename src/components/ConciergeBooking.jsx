import { useState } from 'react'
import { Sparkles, MapPin, ShieldCheck, Flame, Utensils, Scissors, Coffee, ArrowRight } from 'lucide-react'
import ConciergeModal from './ConciergeModal'

const spotsData = [
    {
        id: 'spot-1',
        name: 'Born & Bred Seongsu',
        category: 'Hot Dining',
        categoryIcon: '🥩',
        location: 'Seongsu',
        trendScore: '🔥 9.9/10',
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
        <section id="concierge-section" className="py-24 bg-slate-950 text-white relative overflow-hidden selection:bg-primary selection:text-slate-950">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 gap-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Kult Concierge Service for Global Tourists</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight font-display">
                        Seoul's Trendiest Spots - Instant Verification-Free Concierge Booking
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                        Skip the Korean ID & phone verification barriers. Book hard-to-get reservations at Seoul's most viral dining, salons, and cafes directly through our bilingual concierge team.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex-wrap justify-center gap-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                    selectedCategory === cat.key
                                        ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20 scale-105'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
                            className="group flex flex-col rounded-[2.5rem] bg-slate-900 border border-slate-800/80 overflow-hidden shadow-2xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 text-left"
                        >
                            {/* Card Image Header */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={spot.img}
                                    alt={spot.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 text-primary" />
                                        {spot.location}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        {spot.trendScore}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content Body */}
                            <div className="p-6 flex flex-col grow justify-between gap-6">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest">
                                        <span>{spot.categoryIcon} {spot.category}</span>
                                    </div>

                                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-snug group-hover:text-primary transition-colors">
                                        {spot.name}
                                    </h3>

                                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">
                                        {spot.desc}
                                    </p>
                                </div>

                                {/* Tags & CTA Button */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {spot.tags.map((t, idx) => (
                                            <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[9px] font-bold text-slate-300 border border-slate-700">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setActiveSpotForModal(spot)}
                                        className="w-full h-12 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-slate-950 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg"
                                    >
                                        <span>Book via Kult Concierge</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Concierge Trust Banner */}
                <div className="mt-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-wide">Need Custom Seoul Itinerary Assistance?</h4>
                            <p className="text-xs text-slate-400 font-medium">Our 24/7 bilingual concierge team can book pop-up VIP passes, private drivers, and custom dining requests across Korea.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveSpotForModal(spotsData[0])}
                        className="px-6 py-3.5 rounded-xl bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors shrink-0"
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
