import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Subscribe to user data (credits, unlocked items)
                const userRef = doc(db, 'users', currentUser.uid);
                
                // Initialize user document if it doesn't exist
                const docSnap = await getDoc(userRef);
                if (!docSnap.exists()) {
                    await setDoc(userRef, {
                        email: currentUser.email,
                        credits: 0,
                        isSubscribed: false,
                        subscriptionEndDate: null,
                        unlockedContent: [],
                        createdAt: new Date().toISOString()
                    });
                }

                const unsubscribeData = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        setUserData(doc.data());
                    }
                    setLoading(false);
                });

                return () => unsubscribeData();
            } else {
                setUserData(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const value = {
        user,
        currentUser: user,
        userData,
        loading,
        credits: userData?.credits || 0,
        isSubscribed: userData?.isSubscribed || false,
        subscriptionEndDate: userData?.subscriptionEndDate || null,
        unlockedContent: userData?.unlockedContent || [],
        refreshUser: () => Promise.resolve() // onSnapshot handles real-time updates
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
