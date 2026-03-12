import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { User, LogOut, Ticket, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const UserNav = () => {
    const [user, setUser] = useState(null)
    const [credits, setCredits] = useState(0)
    const { t } = useLanguage()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                // Listen to user credits in real-time
                const userDocRef = doc(db, 'users', currentUser.uid)
                const unsubCredits = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setCredits(docSnap.data().credits || 0)
                    }
                })
                return () => unsubCredits()
            } else {
                setCredits(0)
            }
        })
        return () => unsubscribe()
    }, [])

    const handleLogout = () => {
        signOut(auth)
    }

    if (!user) {
        return (
            <Link to="/join" className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-600 hover:text-primary transition-all duration-300">
                {t("Sign in", "로그인")}
            </Link>
        )
    }

    return (
        <div className="flex items-center gap-6 animate-in fade-in duration-500">
            {/* Credits Badge */}
            <Link to="/credits" className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full hover:border-primary/50 transition-all group">
                <Ticket className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{credits}</span>
            </Link>

            {/* Profile Menu (Simplified for now) */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{user.displayName || t('Operator', '오퍼레이터')}</span>
                    <button
                        onClick={handleLogout}
                        className="text-[8px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                        <LogOut className="w-2.5 h-2.5" />
                        {t("Disconnect", "접속 종료")}
                    </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-slate-400" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserNav
