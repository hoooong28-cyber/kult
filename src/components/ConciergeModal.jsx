import { useState } from 'react'
import { X, Calendar, Clock, Users, CreditCard, ShieldCheck, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react'

const countryCodes = [
    { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' }
]

const ConciergeModal = ({ spot, onClose }) => {
    const [step, setStep] = useState('form') // 'form' | 'loading' | 'success'
    const [refId, setRefId] = useState('')
    
    // Form States
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [countryCode, setCountryCode] = useState('+1')
    const [whatsapp, setWhatsapp] = useState('')
    
    // Preferences
    const [date1, setDate1] = useState('')
    const [time1, setTime1] = useState('18:30')
    const [date2, setDate2] = useState('')
    const [time2, setTime2] = useState('19:30')
    
    const [adults, setAdults] = useState(2)
    const [children, setChildren] = useState(0)
    const [specialRequests, setSpecialRequests] = useState('')
    
    // Payment Sandbox
    const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
    const [cardExp, setCardExp] = useState('12/28')
    const [cardCvc, setCardCvc] = useState('123')

    const handleSubmit = (e) => {
        e.preventDefault()
        setStep('loading')
        
        const generatedId = Math.floor(100000 + Math.random() * 900000)
        setRefId(`KULT-RES-${generatedId}`)
        
        setTimeout(() => {
            setStep('success')
        }, 2200)
    }

    if (!spot) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto selection:bg-[#1111d4] selection:text-white">
            <div className="relative w-full max-w-2xl bg-[#FAF8F5] text-[#191A1F] rounded-2xl border border-[#E5DFD5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5DFD5] bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1111d4]/10 border border-[#1111d4]/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[#1111d4]" />
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1111d4] block">Kult Concierge Guarantee</span>
                            <h3 className="text-base font-serif font-bold text-[#191A1F] uppercase tracking-tight">
                                {step === 'success' ? 'Reservation Confirmed' : `Book ${spot.name}`}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── STEP 1: FORM ────────────────────────────────────────────── */}
                {step === 'form' && (
                    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8 max-h-[80vh] overflow-y-auto">
                        
                        {/* Spot Summary Banner */}
                        <div className="flex items-center gap-5 p-4 rounded-xl bg-white border border-[#E5DFD5] shadow-sm">
                            <img src={spot.img} alt={spot.name} className="w-20 h-20 rounded-lg object-cover" />
                            <div className="flex flex-col gap-1 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1111d4] px-2.5 py-0.5 rounded-full bg-[#1111d4]/10">
                                        {spot.location}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                        {spot.trendScore}
                                    </span>
                                </div>
                                <h4 className="text-base font-serif font-bold text-[#191A1F] uppercase">{spot.name}</h4>
                                <p className="text-xs text-slate-600 line-clamp-1 font-normal">{spot.desc}</p>
                            </div>
                        </div>

                        {/* Guest Personal Info */}
                        <div className="flex flex-col gap-4 text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">1. Guest Details (Matching Passport)</h4>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-700">Full Name (English)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Alex Morgan"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="h-11 px-4 rounded-xl bg-white border border-[#E5DFD5] text-sm font-medium focus:outline-none focus:border-[#1111d4]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="alex@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="h-11 px-4 rounded-xl bg-white border border-[#E5DFD5] text-sm font-medium focus:outline-none focus:border-[#1111d4]"
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700">WhatsApp Number</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={countryCode}
                                            onChange={e => setCountryCode(e.target.value)}
                                            className="h-11 px-3 rounded-xl bg-white border border-[#E5DFD5] text-xs font-bold focus:outline-none focus:border-[#1111d4]"
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code}>
                                                    {c.flag} {c.code}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="123 456 7890"
                                            value={whatsapp}
                                            onChange={e => setWhatsapp(e.target.value)}
                                            className="flex-1 h-11 px-4 rounded-xl bg-white border border-[#E5DFD5] text-sm font-medium focus:outline-none focus:border-[#1111d4]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferred Dates & Times */}
                        <div className="flex flex-col gap-4 text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">2. Date & Time Preferences</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 1st Preference */}
                                <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] flex flex-col gap-3">
                                    <span className="text-[10px] font-bold text-[#1111d4] uppercase tracking-widest">1st Preference</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            required
                                            value={date1}
                                            onChange={e => setDate1(e.target.value)}
                                            className="flex-1 h-10 px-3 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] text-xs font-bold"
                                        />
                                        <input
                                            type="time"
                                            required
                                            value={time1}
                                            onChange={e => setTime1(e.target.value)}
                                            className="h-10 px-3 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] text-xs font-bold"
                                        />
                                    </div>
                                </div>

                                {/* 2nd Preference */}
                                <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] flex flex-col gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2nd Preference (Optional)</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={date2}
                                            onChange={e => setDate2(e.target.value)}
                                            className="flex-1 h-10 px-3 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] text-xs font-bold"
                                        />
                                        <input
                                            type="time"
                                            value={time2}
                                            onChange={e => setTime2(e.target.value)}
                                            className="h-10 px-3 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Party Size & Special Requests */}
                        <div className="flex flex-col gap-4 text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">3. Party Size & Requests</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700">Adults</label>
                                    <select
                                        value={adults}
                                        onChange={e => setAdults(Number(e.target.value))}
                                        className="h-11 px-4 rounded-xl bg-white border border-[#E5DFD5] text-sm font-bold"
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                            <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700">Children</label>
                                    <select
                                        value={children}
                                        onChange={e => setChildren(Number(e.target.value))}
                                        className="h-11 px-4 rounded-xl bg-white border border-[#E5DFD5] text-sm font-bold"
                                    >
                                        {[0,1,2,3,4,5].map(n => (
                                            <option key={n} value={n}>{n} Children</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-700">Special Requests / Dietary Restrictions</label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Window seat preferred, vegetarian options needed, hair color consultation request..."
                                    value={specialRequests}
                                    onChange={e => setSpecialRequests(e.target.value)}
                                    className="p-4 rounded-xl bg-white border border-[#E5DFD5] text-xs font-medium focus:outline-none focus:border-[#1111d4]"
                                />
                            </div>
                        </div>

                        {/* Pricing & Pre-auth Notice */}
                        <div className="p-5 rounded-xl bg-[#1111d4]/5 border border-[#1111d4]/15 text-left flex flex-col gap-2.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase text-[#191A1F] tracking-wider">Kult Concierge Service Fee</span>
                                <span className="text-lg font-bold text-[#1111d4]">$10.00 USD</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>
                                    <strong className="text-slate-900 font-bold">Pre-authorization only.</strong> Your card will ONLY be charged after our concierge agent secures and confirms your reservation with the venue. If unavailable, no fee will be charged.
                                </span>
                            </div>
                        </div>

                        {/* Global Payment Sandbox */}
                        <div className="flex flex-col gap-4 text-left">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">4. Payment Pre-Authorization</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-slate-400">Powered by Stripe / PayPal</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[#191A1F] text-white flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                                    <span>Global Credit / Debit Card</span>
                                    <CreditCard className="w-4 h-4 text-[#C5A880]" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={e => setCardNumber(e.target.value)}
                                        className="h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white tracking-widest"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={cardExp}
                                            onChange={e => setCardExp(e.target.value)}
                                            className="h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white text-center"
                                        />
                                        <input
                                            type="password"
                                            value={cardCvc}
                                            onChange={e => setCardCvc(e.target.value)}
                                            className="h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white text-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full h-14 rounded-xl bg-[#191A1F] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1111d4] shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            Pre-Authorize $10.00 & Request Booking
                        </button>
                    </form>
                )}

                {/* ── STEP 2: LOADING ────────────────────────────────────────────── */}
                {step === 'loading' && (
                    <div className="p-16 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-[#1111d4]/20 border-t-[#1111d4] animate-spin" />
                            <Sparkles className="w-6 h-6 text-[#1111d4] absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xl font-serif font-bold text-[#191A1F] uppercase">Connecting to Local Agent...</h4>
                            <p className="text-sm font-normal text-slate-600 max-w-sm">
                                Securing your spot with our local Seoul concierge agent. Verifying availability for {spot.name}...
                            </p>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: SUCCESS VIEW ───────────────────────────────────────── */}
                {step === 'success' && (
                    <div className="p-10 flex flex-col items-center gap-8 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-9 h-9" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">
                                Pre-authorization Successful
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1F] uppercase tracking-tight">
                                Reservation Request Received!
                            </h3>
                            <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-mono text-sm font-bold border border-[#E5DFD5] shadow-sm">
                                Reference ID: #{refId}
                            </div>
                        </div>

                        {/* Booking Summary Box */}
                        <div className="w-full p-6 rounded-xl bg-white border border-[#E5DFD5] text-left flex flex-col gap-3 shadow-sm">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase">Venue</span>
                                <span className="text-xs font-serif font-bold text-[#191A1F] uppercase">{spot.name} ({spot.location})</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase">Primary Preferred Slot</span>
                                <span className="text-xs font-bold text-slate-900">{date1 || 'Upcoming Date'} @ {time1}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase">Guest Name</span>
                                <span className="text-xs font-bold text-slate-900">{fullName || 'Valued Guest'} ({adults} Adults)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase">Contact WhatsApp</span>
                                <span className="text-xs font-mono font-bold text-[#1111d4]">{countryCode} {whatsapp}</span>
                            </div>
                        </div>

                        {/* Notification Notice */}
                        <div className="p-4 rounded-xl bg-[#1111d4]/5 border border-[#1111d4]/15 text-xs text-[#191A1F] font-normal leading-relaxed flex items-start gap-3 text-left">
                            <MessageSquare className="w-4 h-4 text-[#1111d4] shrink-0 mt-0.5" />
                            <span>
                                Our local concierge team is booking your slot directly with the venue now. You will receive a verified <strong>Korean/English Digital Voucher</strong> via WhatsApp & Email within <strong>30 minutes</strong>.
                            </span>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full h-13 rounded-xl bg-[#191A1F] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1111d4] transition-all shadow-md"
                        >
                            Done & Return to Spots
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ConciergeModal
