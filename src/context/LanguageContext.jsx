import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('EN')

    const toggleLang = () => {
        setLang(prev => prev === 'EN' ? 'KR' : 'EN')
    }

    const t = (en, kr) => {
        return lang === 'EN' ? en : kr
    }

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
