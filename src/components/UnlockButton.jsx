import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { Lock, Loader2, Coins, FileDown } from 'lucide-react';
import { generateDataPDF } from '../utils/pdfGenerator';

const UnlockButton = ({ 
    contentId, 
    cost = 5, 
    onUnlock, 
    children, 
    contentType = "Exclusive Content",
    downloadData = null 
}) => {
    const { t } = useLanguage();
    const { currentUser, credits, unlockedContent, refreshUser } = useAuth();
    const [isUnlocking, setIsUnlocking] = useState(false);

    const isUnlocked = unlockedContent?.includes(contentId);

    const handleUnlock = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            alert(t("Please sign in to unlock content", "로그인 후 콘텐츠를 잠금 해제해 주세요"));
            return;
        }

        if (credits < cost) {
            alert(t("Insufficient credits. Please refill in the store.", "크레딧이 부족합니다. 스토어에서 충전해 주세요."));
            return;
        }

        const confirmUnlock = window.confirm(t(
            `Unlock "${contentType}" for ${cost} credits?`,
            `"${contentType}"을(를) ${cost} 크레딧으로 잠금 해제하시겠습니까?`
        ));

        if (!confirmUnlock) return;

        setIsUnlocking(true);
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                credits: increment(-cost),
                unlockedContent: arrayUnion(contentId)
            });
            
            await refreshUser();
            if (onUnlock) onUnlock();
        } catch (error) {
            console.error("Error unlocking content:", error);
            alert(t("Failed to unlock. Please try again.", "잠금 해제에 실패했습니다. 다시 시도해 주세요."));
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleDownload = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (downloadData) {
            generateDataPDF(downloadData, `KULT-${contentType}-${downloadData.name || 'Guide'}`);
        }
    };

    if (isUnlocked) {
        return (
            <div className="relative group/unlocked">
                {children}
                {downloadData && (
                    <button 
                        onClick={handleDownload}
                        className="absolute top-4 right-4 z-20 px-4 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2 opacity-0 group-hover/unlocked:opacity-100"
                    >
                        <FileDown className="w-3 h-3" />
                        {t("Download PDF", "PDF 다운로드")}
                    </button>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={handleUnlock}
            disabled={isUnlocking}
            className="group relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 hover:border-primary hover:bg-primary/5 transition-all w-full min-h-[200px]"
        >
            <div className="p-4 bg-white rounded-2xl shadow-xl mb-4 group-hover:scale-110 transition-transform">
                {isUnlocking ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                    <Lock className="w-8 h-8 text-slate-400 group-hover:text-primary" strokeWidth={1.5} />
                )}
            </div>
            
            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                    {t("Exclusive Content", "독점 콘텐츠")}
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-black text-slate-900">{cost}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CREDITS</span>
                </div>
                <div className="px-6 py-2 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest group-hover:bg-primary transition-colors">
                    {t("Unlock Now", "지금 잠금 해제")}
                </div>
            </div>
        </button>
    );
};

export default UnlockButton;
