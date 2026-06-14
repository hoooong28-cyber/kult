import { Link } from 'react-router-dom'
import { CheckCircle, CreditCard, Wallet, Zap, ShieldCheck, Orbit } from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

const Subscribe = () => {
    const { t } = useLanguage()

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-primary selection:text-white text-slate-800 font-display text-left">
            <Header />

            <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 lg:py-24 flex flex-col items-center">
                <div className="text-center max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                        {t("Unlock Infinite Inspiration", "무한한 영감을 잠금 해제하세요")}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 font-medium">
                        {t("Choose the plan that best fits your curiosity. Access deep-dive columns, exclusive interviews, and curated spaces.", "호기심을 채워줄 최적의 플랜을 선택하세요. 심층 칼럼, 독점 인터뷰, 큐레이션된 공간을 탐험할 수 있습니다.")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    {/* Subscription Plan */}
                    <div className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-primary/20 hover:border-primary transition-all group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Orbit className="w-32 h-32 text-primary" />
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-8">
                            {t("Most Popular", "인기 플랜")}
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">{t("KULT Membership", "KULT 멤버십")}</h2>
                        <p className="text-slate-500 text-sm font-medium h-10">{t("Unlimited access to all premium columns and deep-dives.", "모든 프리미엄 칼럼과 심층 분석 콘텐츠 무제한 열람")}</p>
                        
                        <div className="my-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-primary tracking-tighter">₩9,900</span>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/ {t("Month", "월")}</span>
                        </div>
                        
                        <ul className="space-y-4 mb-10">
                            {[
                                t("Unlimited access to all Paid Columns", "모든 유료 심층 칼럼 무제한 열람"),
                                t("Early access to New Products", "신상품 소식 우선 접근권"),
                                t("Ad-free reading experience", "광고 없는 쾌적한 읽기 경험"),
                                t("Cancel anytime", "언제든 해지 가능")
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors">
                            {t("Subscribe Now", "지금 구독하기")}
                        </button>
                    </div>

                    {/* Credits Plan */}
                    <div className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-lg border border-slate-200 hover:border-slate-300 transition-all">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-8">
                            {t("Pay As You Go", "건별 결제")}
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">{t("KULT Credits", "KULT 크레딧")}</h2>
                        <p className="text-slate-500 text-sm font-medium h-10">{t("Purchase credits to unlock individual columns.", "원하는 칼럼만 개별적으로 잠금 해제할 수 있습니다.")}</p>
                        
                        <div className="my-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">₩5,000</span>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/ 50 {t("Credits", "크레딧")}</span>
                        </div>
                        
                        <ul className="space-y-4 mb-10">
                            {[
                                t("Unlock specific Paid Columns", "원하는 유료 칼럼만 개별 잠금 해제"),
                                t("Credits never expire", "유효기간 없는 평생 크레딧"),
                                t("Support your favorite brands", "좋아하는 브랜드 후원 가능")
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                    <Zap className="w-5 h-5 text-slate-400" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        <Link to="/credits" className="w-full flex items-center justify-center py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                            {t("Buy Credits", "크레딧 충전하기")}
                        </Link>
                    </div>
                </div>

                {/* FAQ or Trust Indicators */}
                <div className="mt-24 pt-12 border-t border-slate-200 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 opacity-60">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <ShieldCheck className="w-5 h-5" />
                        {t("Secure Payment", "안전한 결제")}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <CreditCard className="w-5 h-5" />
                        {t("Cancel Anytime", "언제든 해지 가능")}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Wallet className="w-5 h-5" />
                        {t("No Hidden Fees", "숨겨진 비용 없음")}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Subscribe
