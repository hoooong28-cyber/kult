import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Orbit, Mail, Lock, User, Sparkles, ChevronRight, ArrowLeft, ShieldCheck, Ticket } from 'lucide-react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useLanguage } from '../context/LanguageContext'

const Join = () => {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const [isLogin, setIsLogin] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
                // Login Flow
                await signInWithEmailAndPassword(auth, email, password)
                navigate('/')
            } else {
                // Signup Flow
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user

                await updateProfile(user, { displayName: name })

                await setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    email: email,
                    credits: 3,
                    joinedAt: new Date().toISOString()
                })

                alert(t('Profile Initialized! 3 Welcome Credits have been added to your hub.', '프로필이 초기화되었습니다! 3개의 웰컴 크레딧이 허브에 추가되었습니다.'))
                navigate('/')
            }
        } catch (err) {
            console.error(err)
            const message = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
                ? t('Invalid credentials. Please verify your access protocol.', '유효하지 않은 자격 증명입니다. 액세스 프로토콜을 확인해 주세요.')
                : err.message
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-display selection:bg-primary selection:text-white overflow-hidden text-left">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6 py-12 flex flex-col items-center">
                {/* Logo & Navigation */}
                <div className="w-full flex justify-between items-center mb-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <Orbit className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(17,17,212,0.4)] transition-transform group-hover:rotate-180 duration-1000" strokeWidth={1.5} />
                        <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">KULT</span>
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {t("Back to Orbit", "궤도로 돌아가기")}
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 w-full max-w-6xl mx-auto">
                    {/* Left Side: Welcome & Credits Info */}
                    <div className="flex-1 flex flex-col gap-10 max-w-xl text-center lg:text-left">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[9px] font-black tracking-[0.3em] uppercase mb-8">
                                {t("PROTOCOL: INITIALIZATION", "프로토콜: 초기화")}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-8 uppercase">
                                {t("Join the", "함께 하세요")}<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 italic">{t("Discovery.", "디스커버리.")}</span>
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                                {t("Gain unrestricted access to the most exclusive sanctuaries in Korea. Your profile is the key to unlocking hidden archives and private destinations.", "한국의 가장 독점적인 안식처에 제한 없이 접근하세요. 귀하의 프로필은 숨겨진 아카이브와 프라이빗한 목적지를 여는 열쇠입니다.")}
                            </p>
                        </div>

                        {/* Credits Reward Card */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 shrink-0">
                                    <Ticket className="w-10 h-10 text-white" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase mb-2">{t("Welcome Protocol", "웰컴 프로토콜")}</h4>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{t("3 INITIAL CREDITS", "3개의 초기 크레딧")}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{t("Auto-credited upon protocol completion. Use for immediate space access.", "프로토콜 완료 시 자동 지급됩니다. 즉시 공간 액세스에 사용하세요.")}</p>
                                </div>
                                <div className="px-4 py-8 border-l border-slate-100 hidden md:block">
                                    <span className="text-xs font-black text-slate-200 uppercase tracking-widest [writing-mode:vertical-lr]">{t("FREE PASS", "무료 패스")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 justify-center lg:justify-start">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                {t("Encrypted Sync", "암호화 동기화")}
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {t("Instant Credits", "즉시 크레딧")}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Signup Form */}
                    <div className="flex-1 w-full max-w-lg">
                        <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]"></div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10 uppercase">{isLogin ? t('Access Profile', '프로필 접속') : t('Create Profile', '프로필 생성')}</h3>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed text-center">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="flex flex-col gap-6">
                                {!isLogin && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">{t("Operator Name", "운영자 이름")}</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={loading}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold text-xs uppercase tracking-widest text-slate-900 disabled:opacity-50"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">{t("Terminal ID (Email)", "터미널 ID (이메일)")}</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={loading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@orbit.com"
                                        className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold text-xs uppercase tracking-widest text-slate-900 disabled:opacity-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">{t("Access Protocol (Password)", "액세스 프로토콜 (비밀번호)")}</label>
                                    <input
                                        type="password"
                                        required
                                        disabled={loading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold text-xs uppercase tracking-widest text-slate-900 disabled:opacity-50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 h-16 bg-primary text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? t('Initializing Protocol...', '프로토콜 초기화 중...') : (isLogin ? t('Establish Connection', '연결 수립') : t('Initialize Protocol', '프로토콜 초기화'))}
                                    {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                            <p className="mt-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {isLogin ? t("New Explorer?", "새로운 탐험가이신가요?") : t("Already synced?", "이미 동기화되었나요?")}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-primary hover:underline transition-colors ml-2 font-black cursor-pointer"
                                    disabled={loading}
                                >
                                    {isLogin ? t("Create Profile", "프로필 생성") : t("Restore Profile", "프로필 복구")}
                                </button>
                            </p>
                        </div>

                        {/* Additional Info Box */}
                        <div className="mt-8 p-6 rounded-3xl bg-slate-100/50 border border-slate-200/50 backdrop-blur-md">
                            <p className="text-[9px] font-bold text-slate-500 text-center leading-relaxed uppercase tracking-widest">
                                {t("Joining grants a Welcome Gift of 3 Credits.", "가입 시 3개의 크레딧이 웰컴 선물로 증정됩니다.")} <br />
                                {t("After initial usage, replenishment requires payment.", "초기 사용 후, 충전 시에는 결제가 필요합니다.")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Copy */}
                <div className="mt-20 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2024 KULT PRIVATE ARCHIVE SYSTEM.</p>
                </div>
            </div>
        </div>
    )
}

export default Join
