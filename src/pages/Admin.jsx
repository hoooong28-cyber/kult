import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Orbit, ArrowLeft, Lock, AlertCircle, RefreshCw, 
    Layers, BookOpen, Compass, Tag, CheckCircle2, LayoutGrid
} from 'lucide-react'
import { db } from '../firebase'
import {
    collection, addDoc, serverTimestamp, getDocs,
    updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, writeBatch
} from 'firebase/firestore'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

// Import Sub-components
import SpaceManager from '../components/admin/SpaceManager'
import ArticleManager from '../components/admin/ArticleManager'
import MagazineManager from '../components/admin/MagazineManager'
import MetadataManager from '../components/admin/MetadataManager'

// Fallback metadata for Seeding & Initial states
const DEFAULT_REGIONS = [
    { value: 'seongsu', label: 'Seongsu', labelKr: '성수' },
    { value: 'hannam', label: 'Hannam', labelKr: '한남' },
    { value: 'seochon', label: 'Seochon', labelKr: '서촌' },
    { value: 'dosan', label: 'Dosan', labelKr: '도산' },
    { value: 'ikseon', label: 'Ikseon', labelKr: '익선' }
]

const DEFAULT_CATEGORIES = [
    { value: 'cafe', label: 'Cafe', labelKr: '카페' },
    { value: 'experience', label: 'Experience', labelKr: '경험' },
    { value: 'concept', label: 'Concept Store', labelKr: '컨셉스토어' },
    { value: 'art', label: 'Art & Gallery', labelKr: '아트 & 갤러리' },
    { value: 'fashion', label: 'Fashion', labelKr: '패션' }
]

const Admin = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passCode, setPassCode] = useState('')

    // Navigation Tab
    // 'spaces' | 'space-form' | 'articles' | 'article-form' | 'magazines' | 'magazine-form' | 'metadata'
    const [activeTab, setActiveTab] = useState('spaces')

    // Universal UI States
    const [loading, setLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // --- Data Lists ---
    const [spaces, setSpaces] = useState([])
    const [articles, setArticles] = useState([])
    const [magazines, setMagazines] = useState([])
    const [regions, setRegions] = useState([])
    const [categories, setCategories] = useState([])

    const [isFetching, setIsFetching] = useState(false)

    // --- Form States: Spaces ---
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const initialSpaceForm = {
        title: '',
        titleKr: '',
        region: 'seongsu',
        category: 'cafe',
        description: '',
        descriptionKr: '',
        imageUrl: '',
        galleryUrls: '',
        googleMapsUrl: '',
        instagramUrl: '',
        websiteUrl: '',
        rating: 4.8,
        reviews: 0
    }
    const [spaceForm, setSpaceForm] = useState(initialSpaceForm)

    // --- Form States: Articles ---
    const [isArticleEditing, setIsArticleEditing] = useState(false)
    const [editingArticleId, setEditingArticleId] = useState(null)
    const initialArticleForm = {
        category: 'space', // 'space' | 'product'
        title: '',
        titleKr: '',
        region: 'seongsu',
        imageUrl: '',
        googleMapsUrl: '',
        instagramUrl: '',
        websiteUrl: '',
        galleryUrls: '',
        description: '',
        descriptionKr: '',
        publishedAt: ''
    }
    const [articleForm, setArticleForm] = useState(initialArticleForm)

    // --- Form States: Magazines ---
    const [isMagazineEditing, setIsMagazineEditing] = useState(false)
    const [editingMagazineId, setEditingMagazineId] = useState(null)
    const initialMagazineForm = {
        volume: 1,
        issueDate: '',
        coverImage: '',
        title: '',
        titleKr: '',
        subtitle: '',
        subtitleKr: '',
        description: '',
        descriptionKr: '',
        featuredSpaces: [],
        sections: [],
        featuredProducts: []
    }
    const [magazineForm, setMagazineForm] = useState(initialMagazineForm)

    // --- Form States: Metadata ---
    const [metaRegion, setMetaRegion] = useState({ value: '', label: '', labelKr: '' })
    const [metaCategory, setMetaCategory] = useState({ value: '', label: '', labelKr: '' })
    const [editingRegion, setEditingRegion] = useState(null)
    const [editingCategory, setEditingCategory] = useState(null)

    // Passcode Auth
    const handleAuth = (e) => {
        e.preventDefault()
        if (passCode === 'KULT2024') {
            setIsAuthenticated(true)
            setError('')
        } else {
            setError(t('Access Denied: Invalid Security Key.', '접근 거부: 유효하지 않은 보안 키입니다.'))
        }
    }

    // Reset feedback states when tab changes
    useEffect(() => {
        setError('')
        setSuccess(false)
        setSearchTerm('')
    }, [activeTab])

    // Load Data & Sync Real-Time
    useEffect(() => {
        if (!isAuthenticated) return

        setIsFetching(true)

        // Real-time Spaces
        const unsubSpaces = onSnapshot(query(collection(db, 'spaces'), orderBy('createdAt', 'desc')), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setSpaces(data)
            setIsFetching(false)
        }, err => console.error("Error reading spaces: ", err))

        // Real-time Articles
        const unsubArticles = onSnapshot(query(collection(db, 'articles'), orderBy('createdAt', 'desc')), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setArticles(data)
        }, err => console.error("Error reading articles: ", err))

        // Real-time Magazines
        const unsubMagazines = onSnapshot(query(collection(db, 'magazines'), orderBy('volume', 'desc')), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMagazines(data)
        }, err => console.error("Error reading magazines: ", err))

        // Real-time Regions Metadata (with seeding fallback)
        const unsubRegions = onSnapshot(query(collection(db, 'regions'), orderBy('order', 'asc')), async (snapshot) => {
            if (snapshot.empty) {
                // Seed database with defaults
                console.log("Seeding default regions...")
                const batch = writeBatch(db)
                DEFAULT_REGIONS.forEach((item, index) => {
                    const newDocRef = doc(collection(db, 'regions'))
                    batch.set(newDocRef, { ...item, order: index })
                })
                await batch.commit()
            } else {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setRegions(data)
            }
        })

        // Real-time Categories Metadata (with seeding fallback)
        const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('order', 'asc')), async (snapshot) => {
            if (snapshot.empty) {
                // Seed database with defaults
                console.log("Seeding default categories...")
                const batch = writeBatch(db)
                DEFAULT_CATEGORIES.forEach((item, index) => {
                    const newDocRef = doc(collection(db, 'categories'))
                    batch.set(newDocRef, { ...item, order: index })
                })
                await batch.commit()
            } else {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setCategories(data)
            }
        })

        return () => {
            unsubSpaces()
            unsubArticles()
            unsubMagazines()
            unsubRegions()
            unsubCategories()
        }
    }, [isAuthenticated])

    // --- Search Filters ---
    const filteredSpaces = useMemo(() => {
        return spaces.filter(space =>
            (space.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (space.titleKr?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [spaces, searchTerm])

    const filteredArticles = useMemo(() => {
        return articles.filter(article =>
            (article.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (article.titleKr?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [articles, searchTerm])

    // ==========================================
    // --- 1. SPACES (공간) CRUD HANDLERS ---
    // ==========================================
    const handleSpaceChange = (e) => {
        const { name, value } = e.target
        setSpaceForm(prev => ({ ...prev, [name]: value }))
    }

    const startEditingSpace = (space) => {
        setSpaceForm({
            title: space.title || '',
            titleKr: space.titleKr || '',
            region: space.region || 'seongsu',
            category: space.category || 'cafe',
            description: space.description || '',
            descriptionKr: space.descriptionKr || '',
            imageUrl: space.imageUrl || '',
            galleryUrls: Array.isArray(space.galleryUrls) ? space.galleryUrls.join('\n') : (space.galleryUrls || ''),
            googleMapsUrl: space.googleMapsUrl || '',
            instagramUrl: space.instagramUrl || '',
            websiteUrl: space.websiteUrl || '',
            rating: space.rating || 4.8,
            reviews: space.reviews || 0
        })
        setEditingId(space.id)
        setIsEditing(true)
        setActiveTab('space-form')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEditingSpace = () => {
        setSpaceForm(initialSpaceForm)
        setIsEditing(false)
        setEditingId(null)
        setActiveTab('spaces')
    }

    const handleSpaceDelete = async (id, title) => {
        if (window.confirm(t(`Are you sure you want to delete "${title}"?`, `"${title}" 공간을 삭제하시겠습니까?`))) {
            try {
                await deleteDoc(doc(db, 'spaces', id))
            } catch (err) {
                console.error("Error deleting space:", err)
                alert(t("Failed to delete.", "삭제에 실패했습니다."))
            }
        }
    }

    const handleSpaceSubmit = async (e) => {
        e.preventDefault()
        if (!spaceForm.imageUrl) {
            setError(t('Cover image link required.', '대표 이미지 링크가 필요합니다.'))
            return
        }

        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            setLoadingStep(t('CONNECTING TO CORE', '코어 연결 중'))

            const payload = {
                ...spaceForm,
                galleryUrls: spaceForm.galleryUrls.split('\n').map(url => url.trim()).filter(url => url !== ''),
                rating: parseFloat(spaceForm.rating) || 4.8,
                updatedAt: serverTimestamp()
            }

            if (isEditing && editingId) {
                setLoadingStep(t('UPDATING ARCHIVE', '아카이브 업데이트 중'))
                await updateDoc(doc(db, 'spaces', editingId), payload)
                setIsEditing(false)
                setEditingId(null)
            } else {
                setLoadingStep(t('DEPLOYING NEW NODE', '신규 노드 배포 중'))
                await addDoc(collection(db, 'spaces'), {
                    ...payload,
                    reviews: Math.floor(Math.random() * 200) + 50,
                    createdAt: serverTimestamp()
                })
            }

            setSpaceForm(initialSpaceForm)
            setSuccess(true)
            setActiveTab('spaces')
            setTimeout(() => setSuccess(false), 4000)
        } catch (err) {
            console.error('Error with space operation: ', err)
            setError(t('Failed to transmit data stream.', '데이터 전송 실패.'))
        } finally {
            setLoading(false)
            setLoadingStep('')
        }
    }

    // ==========================================
    // --- 2. ARTICLES (아티클) CRUD HANDLERS ---
    // ==========================================
    const handleArticleChange = (e) => {
        const { name, value } = e.target
        setArticleForm(prev => ({ ...prev, [name]: value }))
    }

    const startEditingArticle = (article) => {
        // Format publishedAt for datetime-local input
        let formattedDate = ''
        if (article.publishedAt) {
            const d = article.publishedAt.toDate ? article.publishedAt.toDate() : new Date(article.publishedAt)
            formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        }

        setArticleForm({
            category: article.category || 'space',
            title: article.title || '',
            titleKr: article.titleKr || '',
            region: article.region || 'seongsu',
            imageUrl: article.imageUrl || '',
            googleMapsUrl: article.googleMapsUrl || '',
            instagramUrl: article.instagramUrl || '',
            websiteUrl: article.websiteUrl || '',
            galleryUrls: Array.isArray(article.galleryUrls) ? article.galleryUrls.join('\n') : (article.galleryUrls || ''),
            description: article.description || '',
            descriptionKr: article.descriptionKr || '',
            publishedAt: formattedDate
        })
        setEditingArticleId(article.id)
        setIsArticleEditing(true)
        setActiveTab('article-form')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEditingArticle = () => {
        setArticleForm(initialArticleForm)
        setIsArticleEditing(false)
        setEditingArticleId(null)
        setActiveTab('articles')
    }

    const handleArticleDelete = async (id, title) => {
        if (window.confirm(t(`Are you sure you want to delete "${title}"?`, `"${title}" 아티클을 삭제하시겠습니까?`))) {
            try {
                await deleteDoc(doc(db, 'articles', id))
            } catch (err) {
                console.error("Error deleting article:", err)
                alert(t("Failed to delete.", "삭제에 실패했습니다."))
            }
        }
    }

    const handleArticleSubmit = async (e) => {
        e.preventDefault()
        if (!articleForm.imageUrl) {
            setError(t('Cover image link required.', '대표 이미지 링크가 필요합니다.'))
            return
        }

        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            setLoadingStep('Saving Article...')

            const pubDate = articleForm.publishedAt ? new Date(articleForm.publishedAt) : new Date()

            const payload = {
                category: articleForm.category,
                title: articleForm.title,
                titleKr: articleForm.titleKr,
                region: articleForm.region,
                imageUrl: articleForm.imageUrl,
                googleMapsUrl: articleForm.googleMapsUrl,
                instagramUrl: articleForm.instagramUrl,
                websiteUrl: articleForm.websiteUrl,
                galleryUrls: articleForm.galleryUrls.split('\n').map(url => url.trim()).filter(url => url !== ''),
                description: articleForm.description,
                descriptionKr: articleForm.descriptionKr,
                publishedAt: pubDate,
                updatedAt: serverTimestamp()
            }

            if (isArticleEditing && editingArticleId) {
                await updateDoc(doc(db, 'articles', editingArticleId), payload)
                setIsArticleEditing(false)
                setEditingArticleId(null)
            } else {
                await addDoc(collection(db, 'articles'), {
                    ...payload,
                    createdAt: serverTimestamp()
                })
            }

            setArticleForm(initialArticleForm)
            setSuccess(true)
            setActiveTab('articles')
            setTimeout(() => setSuccess(false), 4000)
        } catch (err) {
            console.error('Error with article operation: ', err)
            setError(t('Failed to save article.', '아티클 저장 실패.'))
        } finally {
            setLoading(false)
            setLoadingStep('')
        }
    }

    // ==========================================
    // --- 3. MAGAZINES (매거진) CRUD HANDLERS ---
    // ==========================================
    const addMagazineSection = () => {
        const currentSections = magazineForm.sections || []
        setMagazineForm({
            ...magazineForm,
            sections: [...currentSections, { imageUrl: '', title: '', titleKr: '', content: '', contentKr: '' }]
        })
    }

    const removeMagazineSection = (index) => {
        const currentSections = magazineForm.sections || []
        setMagazineForm({
            ...magazineForm,
            sections: currentSections.filter((_, idx) => idx !== index)
        })
    }

    const updateMagazineSection = (index, field, value) => {
        const currentSections = [...(magazineForm.sections || [])]
        currentSections[index] = { ...currentSections[index], [field]: value }
        setMagazineForm({ ...magazineForm, sections: currentSections })
    }

    const moveMagazineSection = (index, direction) => {
        const currentSections = [...(magazineForm.sections || [])]
        if (direction === 'up' && index > 0) {
            const temp = currentSections[index]
            currentSections[index] = currentSections[index - 1]
            currentSections[index - 1] = temp
        } else if (direction === 'down' && index < currentSections.length - 1) {
            const temp = currentSections[index]
            currentSections[index] = currentSections[index + 1]
            currentSections[index + 1] = temp
        }
        setMagazineForm({ ...magazineForm, sections: currentSections })
    }

    const addMagazineProduct = () => {
        const currentProducts = magazineForm.featuredProducts || []
        setMagazineForm({
            ...magazineForm,
            featuredProducts: [...currentProducts, { imageUrl: '', brand: '', name: '', nameKr: '', description: '', descriptionKr: '', tag: 'Weekly Select' }]
        })
    }

    const removeMagazineProduct = (index) => {
        const currentProducts = magazineForm.featuredProducts || []
        setMagazineForm({
            ...magazineForm,
            featuredProducts: currentProducts.filter((_, idx) => idx !== index)
        })
    }

    const updateMagazineProduct = (index, field, value) => {
        const currentProducts = [...(magazineForm.featuredProducts || [])]
        currentProducts[index] = { ...currentProducts[index], [field]: value }
        setMagazineForm({ ...magazineForm, featuredProducts: currentProducts })
    }

    const startEditingMagazine = (mag) => {
        setMagazineForm({
            volume: mag.volume || 1,
            issueDate: mag.issueDate || '',
            coverImage: mag.coverImage || '',
            title: mag.title || '',
            titleKr: mag.titleKr || '',
            subtitle: mag.subtitle || '',
            subtitleKr: mag.subtitleKr || '',
            description: mag.description || '',
            descriptionKr: mag.descriptionKr || '',
            featuredSpaces: mag.featuredSpaces || [],
            sections: mag.sections || [],
            featuredProducts: mag.featuredProducts || []
        })
        setEditingMagazineId(mag.id)
        setIsMagazineEditing(true)
        setActiveTab('magazine-form')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteMagazine = async (id, title) => {
        if (window.confirm(t(`Delete "${title}" volume?`, `"${title}" 볼륨을 삭제하시겠습니까?`))) {
            try {
                await deleteDoc(doc(db, 'magazines', id))
            } catch (err) {
                console.error("Error deleting magazine volume:", err)
                alert(t("Failed to delete volume.", "볼륨 삭제에 실패했습니다."))
            }
        }
    }

    const handleMagazineSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const payload = {
                ...magazineForm,
                volume: parseInt(magazineForm.volume) || 1,
                updatedAt: serverTimestamp()
            }

            if (isMagazineEditing && editingMagazineId) {
                await updateDoc(doc(db, 'magazines', editingMagazineId), payload)
                setIsMagazineEditing(false)
                setEditingMagazineId(null)
            } else {
                await addDoc(collection(db, 'magazines'), {
                    ...payload,
                    createdAt: serverTimestamp()
                })
            }

            setMagazineForm(initialMagazineForm)
            setSuccess(true)
            setActiveTab('magazines')
            setTimeout(() => setSuccess(false), 4000)
        } catch (err) {
            console.error("Error saving magazine: ", err)
            setError(t("Failed to save magazine.", "매거진 저장에 실패했습니다."))
        } finally {
            setLoading(false)
        }
    }

    // ==========================================
    // --- 4. METADATA (지역 & 카테고리) HANDLERS ---
    // ==========================================
    const handleAddMetadata = async (type) => {
        const item = type === 'region' ? metaRegion : metaCategory
        if (!item.value || !item.label || !item.labelKr) {
            alert("모든 필드를 입력해 주세요.")
            return
        }

        try {
            const targetCollection = type === 'region' ? 'regions' : 'categories'
            const currentList = type === 'region' ? regions : categories

            await addDoc(collection(db, targetCollection), {
                value: item.value.trim(),
                label: item.label.trim(),
                labelKr: item.labelKr.trim(),
                order: currentList.length
            })

            // Reset
            if (type === 'region') setMetaRegion({ value: '', label: '', labelKr: '' })
            else setMetaCategory({ value: '', label: '', labelKr: '' })
        } catch (err) {
            console.error("Error adding metadata:", err)
        }
    }

    const handleUpdateMetadata = async (type, item) => {
        try {
            const targetCollection = type === 'region' ? 'regions' : 'categories'
            await updateDoc(doc(db, targetCollection, item.id), {
                value: item.value.trim(),
                label: item.label.trim(),
                labelKr: item.labelKr.trim()
            })

            if (type === 'region') setEditingRegion(null)
            else setEditingCategory(null)
        } catch (err) {
            console.error("Error updating metadata:", err)
        }
    }

    const handleDeleteMetadata = async (type, id) => {
        if (window.confirm("정말 이 메타데이터를 삭제하시겠습니까? 관련 필터가 제대로 동작하지 않을 수 있습니다.")) {
            try {
                const targetCollection = type === 'region' ? 'regions' : 'categories'
                await deleteDoc(doc(db, targetCollection, id))
            } catch (err) {
                console.error("Error deleting metadata:", err)
            }
        }
    }

    const handleMoveMetadata = async (type, index, direction) => {
        const list = [...(type === 'region' ? regions : categories)]
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === list.length - 1) return

        const targetIndex = direction === 'up' ? index - 1 : index + 1
        const temp = list[index]
        list[index] = list[targetIndex]
        list[targetIndex] = temp

        try {
            const targetCollection = type === 'region' ? 'regions' : 'categories'
            const batch = writeBatch(db)
            list.forEach((item, idx) => {
                batch.update(doc(db, targetCollection, item.id), { order: idx })
            })
            await batch.commit()
        } catch (err) {
            console.error("Error sorting metadata:", err)
        }
    }

    // Security Terminal Login
    if (!isAuthenticated) {
        return (
            <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center p-6 text-left font-display">
                <Header />
                <div className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden max-w-md w-full text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]"></div>
                    <div className="mb-8 flex justify-center">
                        <div className="p-5 bg-primary/10 rounded-3xl text-primary">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{t("Security Terminal", "보안 터미널")}</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                        {t("Enter your frequency key to access the command center.", "지휘 센터에 접속하려면 주파수 키를 입력하세요.")}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={passCode}
                            onChange={(e) => setPassCode(e.target.value)}
                            className="h-14 px-6 rounded-2xl bg-slate-950 border border-slate-850 text-white focus:border-primary/50 focus:bg-slate-900 transition-all text-center tracking-[0.5em] font-black"
                        />
                        <button
                            type="submit"
                            className="h-14 bg-white text-slate-900 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            {t("Authorize Access", "접속 승인")}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-950 min-h-screen selection:bg-primary selection:text-white text-slate-300 font-display text-left">
            <Header />

            <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-24">
                {/* Back Link & Title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 border-b border-slate-900 pb-10">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors mb-4">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            {t("Back to Orbit", "궤도로 돌아가기")}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">KULT Control Center</h1>
                    </div>
                    {/* Stats or status indicator */}
                    <div className="flex items-center gap-6 px-6 py-3 bg-slate-900 rounded-full border border-slate-800">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVE FREQUENCY</span>
                        </div>
                    </div>
                </div>

                {/* Main CMS Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Tab Selector Sidebar (3 cols) */}
                    <div className="lg:col-span-3 bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-900 flex flex-col gap-2">
                        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4 mb-4">SYSTEM DIRECTORY</h3>
                        
                        {/* Spaces Group */}
                        <div className="flex flex-col gap-1 mb-6">
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest pl-4 mb-1">Spaces</span>
                            <button
                                onClick={() => setActiveTab('spaces')}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center justify-between ${activeTab === 'spaces' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <span className="flex items-center gap-2.5"><LayoutGrid className="w-4 h-4" /> 목록</span>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-950/20">{spaces.length}</span>
                            </button>
                            <button
                                onClick={() => { setIsEditing(false); setSpaceForm(initialSpaceForm); setActiveTab('space-form'); }}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center gap-2.5 ${activeTab === 'space-form' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <Compass className="w-4 h-4" />
                                {isEditing ? '공간 수정 중' : '신규 공간 등록'}
                            </button>
                        </div>

                        {/* Articles Group */}
                        <div className="flex flex-col gap-1 mb-6">
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest pl-4 mb-1">Articles</span>
                            <button
                                onClick={() => setActiveTab('articles')}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center justify-between ${activeTab === 'articles' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <span className="flex items-center gap-2.5"><LayoutGrid className="w-4 h-4" /> 목록</span>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-950/20">{articles.length}</span>
                            </button>
                            <button
                                onClick={() => { setIsArticleEditing(false); setArticleForm(initialArticleForm); setActiveTab('article-form'); }}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center gap-2.5 ${activeTab === 'article-form' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <BookOpen className="w-4 h-4" />
                                {isArticleEditing ? '아티클 수정 중' : '신규 아티클 등록'}
                            </button>
                        </div>

                        {/* Magazines Group */}
                        <div className="flex flex-col gap-1 mb-6">
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest pl-4 mb-1">Magazines</span>
                            <button
                                onClick={() => setActiveTab('magazines')}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center justify-between ${activeTab === 'magazines' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <span className="flex items-center gap-2.5"><LayoutGrid className="w-4 h-4" /> 목록</span>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-950/20">{magazines.length}</span>
                            </button>
                            <button
                                onClick={() => { setIsMagazineEditing(false); setMagazineForm(initialMagazineForm); setActiveTab('magazine-form'); }}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center gap-2.5 ${activeTab === 'magazine-form' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <BookOpen className="w-4 h-4" />
                                {isMagazineEditing ? '볼륨 수정 중' : '신규 볼륨 등록'}
                            </button>
                        </div>

                        {/* Config Group */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest pl-4 mb-1">System Config</span>
                            <button
                                onClick={() => setActiveTab('metadata')}
                                className={`h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center gap-2.5 ${activeTab === 'metadata' ? 'bg-primary text-white' : 'hover:bg-slate-900 text-slate-400'}`}
                            >
                                <Tag className="w-4 h-4" />
                                메타데이터 설정
                            </button>
                        </div>
                    </div>

                    {/* Right: CMS Panel Dashboard (9 cols) */}
                    <div className="lg:col-span-9 bg-slate-900/20 p-8 md:p-12 rounded-[3.5rem] border border-slate-900">
                        {activeTab === 'spaces' || activeTab === 'space-form' ? (
                            <SpaceManager
                                activeTab={activeTab}
                                t={t}
                                isEditing={isEditing}
                                editingId={editingId}
                                cancelEditing={cancelEditingSpace}
                                formData={spaceForm}
                                handleChange={handleSpaceChange}
                                handleSubmit={handleSpaceSubmit}
                                success={success}
                                error={error}
                                loading={loading}
                                loadingStep={loadingStep}
                                regions={regions}
                                categories={categories}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                isFetching={isFetching}
                                spaces={spaces}
                                filteredSpaces={filteredSpaces}
                                handleDelete={handleSpaceDelete}
                            />
                        ) : null}

                        {activeTab === 'articles' || activeTab === 'article-form' ? (
                            <ArticleManager
                                activeTab={activeTab}
                                isEditing={isArticleEditing}
                                editingId={editingArticleId}
                                cancelEditing={cancelEditingArticle}
                                formData={articleForm}
                                handleChange={handleArticleChange}
                                handleSubmit={handleArticleSubmit}
                                success={success}
                                error={error}
                                loading={loading}
                                loadingStep={loadingStep}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                isFetching={isFetching}
                                articles={articles}
                                filteredArticles={filteredArticles}
                                startEditing={startEditingArticle}
                                handleDelete={handleArticleDelete}
                            />
                        ) : null}

                        {activeTab === 'magazines' || activeTab === 'magazine-form' ? (
                            <MagazineManager
                                t={t}
                                activeTab={activeTab}
                                magazines={magazines}
                                magazineForm={magazineForm}
                                setMagazineForm={setMagazineForm}
                                isMagazineEditing={isMagazineEditing}
                                editingMagazineId={editingMagazineId}
                                handleMagazineSubmit={handleMagazineSubmit}
                                handleDeleteMagazine={handleDeleteMagazine}
                                addMagazineSection={addMagazineSection}
                                removeMagazineSection={removeMagazineSection}
                                updateMagazineSection={updateMagazineSection}
                                moveMagazineSection={moveMagazineSection}
                                addMagazineProduct={addMagazineProduct}
                                removeMagazineProduct={removeMagazineProduct}
                                updateMagazineProduct={updateMagazineProduct}
                                startEditingMagazine={startEditingMagazine}
                                spaces={spaces}
                                loading={loading}
                                setIsMagazineEditing={setIsMagazineEditing}
                                setEditingMagazineId={setEditingMagazineId}
                                setActiveTab={setActiveTab}
                            />
                        ) : null}

                        {activeTab === 'metadata' ? (
                            <MetadataManager
                                t={t}
                                regions={regions}
                                categories={categories}
                                metaRegion={metaRegion}
                                setMetaRegion={setMetaRegion}
                                metaCategory={metaCategory}
                                setMetaCategory={setMetaCategory}
                                editingRegion={editingRegion}
                                setEditingRegion={setEditingRegion}
                                editingCategory={editingCategory}
                                setEditingCategory={setEditingCategory}
                                handleAddMetadata={handleAddMetadata}
                                handleUpdateMetadata={handleUpdateMetadata}
                                handleDeleteMetadata={handleDeleteMetadata}
                                handleMoveMetadata={handleMoveMetadata}
                            />
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Admin
