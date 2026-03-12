import { Link } from 'react-router-dom'
import { CheckCircle, CreditCard, Wallet, Globe, Lock, ArrowRight, ShieldCheck, Award, DollarSign, Coins, Terminal, Zap, Orbit } from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

const CreditCheckout = () => {
    const { t } = useLanguage()

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-primary selection:text-white text-slate-800 font-display text-left">
            <Header />

            <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 lg:py-24">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="flex-1 space-y-20">
                        <section>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                {t("Account Logistics", "계정 로지스틱스")}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">{t("Refill your", "충전하기")} <span className="text-primary italic font-light tracking-tighter">{t("Credits", "크레딧")}</span></h1>
                            <p className="text-slate-500 text-lg max-w-xl leading-relaxed font-light">
                                {t("Enhance your command deck capabilities. Select a package to continue curating high-end spaces within the KULT ecosystem.", "커맨드 덱 기능을 강화하세요. KULT 생태계 내에서 하이엔드 공간을 계속 큐레이션하려면 패키지를 선택하세요.")}
                            </p>
                        </section>

                        <section className="space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="text-[10px] font-black text-slate-900 border border-slate-200 rounded-lg px-3 py-2 shadow-sm bg-white">01</div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900">{t("Select Credit Package", "크레딧 패키지 선택")}</h2>
                                <div className="h-px bg-slate-200 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { id: 'starter', units: 5, price: '10.00', label: t('Basic', '베이직') },
                                    { id: 'explorer', units: 25, price: '45.00', label: t('Pro', '프로'), checked: true },
                                    { id: 'professional', units: 100, price: '150.00', label: t('Elite', '엘리트') }
                                ].map((pkg) => (
                                    <label key={pkg.id} className="relative cursor-pointer group">
                                        <input defaultChecked={pkg.checked} className="peer hidden package-radio" name="package" type="radio" value={pkg.id} />
                                        <div className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] flex flex-col gap-8 shadow-xl shadow-slate-200/50 transition-all duration-500 peer-checked:border-primary peer-checked:shadow-primary/20 hover:shadow-2xl hover:border-slate-200">
                                            <div className="flex justify-between items-start">
                                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                                                    <Coins className="w-6 h-6 text-primary" strokeWidth={1.5} />
                                                </div>
                                                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400 italic">{pkg.label}</span>
                                            </div>
                                            <div>
                                                <div className="text-5xl font-black text-slate-900 tracking-tight">{pkg.units} <span className="text-lg text-slate-400 font-light">CR</span></div>
                                                <div className="text-sm font-bold text-slate-500 mt-3 tracking-widest">${pkg.price} USD</div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="text-[10px] font-black text-slate-900 border border-slate-200 rounded-lg px-3 py-2 shadow-sm bg-white">02</div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900">{t("Payment Authorization", "결제 인증")}</h2>
                                <div className="h-px bg-slate-200 flex-1"></div>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <button className="flex items-center justify-center gap-4 p-5 rounded-2xl border-2 border-primary bg-primary/5 text-[10px] font-black uppercase tracking-widest">
                                        <CreditCard className="w-5 h-5 text-primary" strokeWidth={1.5} />
                                        {t("Secure Card", "보안 카드")}
                                    </button>
                                    <button className="flex items-center justify-center gap-4 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <Wallet className="w-5 h-5" strokeWidth={1.5} />
                                        PayPal
                                    </button>
                                    <button className="flex items-center justify-center gap-4 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <Globe className="w-5 h-5" strokeWidth={1.5} />
                                        Google Pay
                                    </button>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{t("Cardholder Information", "카드 소유자 정보")}</label>
                                        <input className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 text-lg px-8 transition-all placeholder:text-slate-300 font-light" placeholder={t("Enter Full Name", "전체 이름을 입력하세요")} type="text" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{t("Card Credentials", "카드 번호")}</label>
                                        <div className="relative">
                                            <input className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 text-lg px-8 transition-all placeholder:text-slate-300 font-light" placeholder="0000 0000 0000 0000" type="text" />
                                            <Lock className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{t("Expiration", "만료 기간")}</label>
                                            <input className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 text-lg px-8 transition-all placeholder:text-slate-300 font-light" placeholder="MM / YY" type="text" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">CVC</label>
                                            <input className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 text-lg px-8 transition-all placeholder:text-slate-300 font-light" placeholder="123" type="text" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="w-full lg:w-[450px]">
                        <div className="sticky top-32">
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl pointer-events-none"></div>
                                <div className="p-12 space-y-12 relative z-10">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 italic">{t("Order Summary", "주문 요약")}</h3>
                                        <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{t("Purchase Details", "구매 상세 내역")}</p>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                                    <Award className="w-7 h-7" strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{t("Package", "패키지")}</p>
                                                    <p className="text-base font-black text-slate-900">Explorer Node</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-slate-900">25 <span className="text-[10px] uppercase text-slate-400 italic">Credits</span></p>
                                            </div>
                                        </div>
                                        <div className="space-y-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                            <div className="flex justify-between">
                                                <span>{t("Base Amount", "기본 금액")}</span>
                                                <span className="text-slate-900 font-black">$45.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{t("Processing Fee", "처리 수수료")}</span>
                                                <span className="text-slate-900 font-black">$0.00</span>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-slate-100">
                                            <div className="flex justify-between items-end mb-10">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">{t("Aggregate Total", "최종 합계")}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">VAT Inclusive (10%)</p>
                                                </div>
                                                <div className="text-5xl font-black text-slate-900 tracking-tighter leading-none">$45.00</div>
                                            </div>
                                            <button
                                                className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] py-7 rounded-2xl shadow-2xl shadow-slate-300 hover:bg-primary transition-all duration-500 active:scale-95 group overflow-hidden relative"
                                                onClick={() => alert(t('Purchase Authorization: Initializing secure transaction...', '구매 인증: 보안 거래를 초기화 중...'))}
                                            >
                                                <span className="relative z-10">{t("AUTHORIZE PURCHASE", "구매 승인")}</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <div className="mt-1 relative flex items-center justify-center">
                                                <input className="peer appearance-none w-5 h-5 rounded border-2 border-slate-200 bg-white checked:bg-primary checked:border-primary transition-all pointer-events-none" type="checkbox" />
                                                <CheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-[10px] leading-relaxed text-slate-400 uppercase tracking-widest font-bold">
                                                {t("I acknowledge the", "다음을 인지했습니다")}<a className="text-primary hover:text-slate-900 transition-colors mx-1" href="#">{t("Terminal Terms", "터미널 약관")}</a>{t("and the refund protocol.", "및 환불 프로토콜.")}
                                            </span>
                                        </label>
                                        <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                SSL_ENCRYPTED
                                            </div>
                                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                                <Terminal className="w-3.5 h-3.5" />
                                                AUTH_CERTIFIED
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 border-t border-slate-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col gap-3">
                        <span className="font-black text-slate-900 uppercase tracking-tighter text-2xl">KULT</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-bold italic">© 2024 {t("Command Deck Logistics. Purveying the future.", "커맨드 덱 로지스틱스. 미래를 선도합니다.")}</span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <a className="hover:text-primary transition-colors" href="#">{t("Privacy Protocol", "개인정보 프로토콜")}</a>
                        <a className="hover:text-primary transition-colors" href="#">{t("User Rights", "사용자 권리")}</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default CreditCheckout
