import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Orbit, ArrowLeft, Upload, MapPin, Tag, FileText,
    ImageIcon, Globe, Save, CheckCircle2, AlertCircle,
    X, Map, Lock, Trash2, Edit3, Search, Plus, Filter,
    RefreshCw, ChevronRight, Eye
} from 'lucide-react'
import { db } from '../firebase'
import {
    collection, addDoc, serverTimestamp, getDocs,
    updateDoc, deleteDoc, doc, query, orderBy
} from 'firebase/firestore'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'

const regions = [
    { value: 'seongsu', label: 'Seongsu', labelKr: '성수' },
    { value: 'hannam', label: 'Hannam', labelKr: '한남' },
    { value: 'seochon', label: 'Seochon', labelKr: '서촌' },
    { value: 'dosan', label: 'Dosan', labelKr: '도산' },
    { value: 'ikseon', label: 'Ikseon', labelKr: '익선' }
]

const categories = [
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

    // UI States
    const [loading, setLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // CMS States
    const [spaces, setSpaces] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    // Form data
    const initialFormState = {
        title: '',
        titleKr: '',
        region: 'seongsu',
        category: 'cafe',
        description: '',
        descriptionKr: '',
        imageUrl: '',
        galleryUrls: '',
        googleMapsUrl: '',
        rating: 4.8,
        reviews: 0
    }
    const [formData, setFormData] = useState(initialFormState)

    // Auth logic
    const handleAuth = (e) => {
        e.preventDefault()
        if (passCode === 'KULT2024') {
            setIsAuthenticated(true)
            setError('')
        } else {
            setError(t('Access Denied: Invalid Security Key.', '접근 거부: 유효하지 않은 보안 키입니다.'))
        }
    }

    // Fetch spaces logic
    const fetchSpaces = async () => {
        setIsFetching(true)
        try {
            const q = query(collection(db, 'spaces'), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)
            const spaceData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setSpaces(spaceData)
        } catch (err) {
            console.error("Error fetching spaces:", err)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchSpaces()
        }
    }, [isAuthenticated])

    // Filtered spaces for list
    const filteredSpaces = useMemo(() => {
        return spaces.filter(space =>
            (space.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (space.titleKr?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [spaces, searchTerm])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const startEditing = (space) => {
        setFormData({
            title: space.title || '',
            titleKr: space.titleKr || '',
            region: space.region || 'seongsu',
            category: space.category || 'cafe',
            description: space.description || '',
            descriptionKr: space.descriptionKr || '',
            imageUrl: space.imageUrl || '',
            galleryUrls: Array.isArray(space.galleryUrls) ? space.galleryUrls.join('\n') : (space.galleryUrls || ''),
            googleMapsUrl: space.googleMapsUrl || '',
            rating: space.rating || 4.8,
            reviews: space.reviews || 0
        })
        setEditingId(space.id)
        setIsEditing(true)
        setError('')
        setSuccess(false) // Clear success when starting a new edit
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEditing = () => {
        setFormData(initialFormState)
        setIsEditing(false)
        setEditingId(null)
        setError('')
    }

    const handleDelete = async (id, title) => {
        if (window.confirm(t(`Are you sure you want to delete "${title}"?`, `"${title}" 공간을 삭제하시겠습니까?`))) {
            try {
                await deleteDoc(doc(db, 'spaces', id))
                setSpaces(prev => prev.filter(s => s.id !== id))
            } catch (err) {
                console.error("Error deleting space:", err)
                alert(t("Failed to delete.", "삭제에 실패했습니다."))
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.imageUrl) {
            setError(t('Optical data link required.', '광학 데이터 링크가 필요합니다.'))
            return
        }

        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            setLoadingStep(t('CONNECTING TO CORE', '코어 연결 중'))

            const payload = {
                ...formData,
                galleryUrls: formData.galleryUrls.split('\n').map(url => url.trim()).filter(url => url !== ''),
                rating: parseFloat(formData.rating) || 4.8,
                updatedAt: serverTimestamp()
            }

            if (isEditing && editingId) {
                setLoadingStep(t('UPDATING ARCHIVE', '아카이브 업데이트 중'))
                const spaceRef = doc(db, 'spaces', editingId)
                await updateDoc(spaceRef, payload)
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

            setFormData(initialFormState)
            setSuccess(true)
            await fetchSpaces() // Wait for refresh before stopping loader
            setTimeout(() => setSuccess(false), 5000)
        } catch (err) {
            console.error('Error with space operation: ', err)
            setError(t('Failed to transmit data stream.', '데이터 전송 실패.'))
        } finally {
            setLoading(false)
            setLoadingStep('')
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-6 text-left font-display">
                <Header />
                <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden max-w-md w-full text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]"></div>
                    <div className="mb-8 flex justify-center">
                        <div className="p-5 bg-primary/10 rounded-3xl text-primary">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">{t("Security Terminal", "보안 터미널")}</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                        {t("Enter your frequency key to access the command center.", "지휘 센터에 접속하려면 주파수 키를 입력하세요.")}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
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
                            className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:bg-white transition-all text-center tracking-[0.5em] font-black"
                        />
                        <button
                            type="submit"
                            className="h-14 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
                        >
                            {t("Authorize Access", "접속 승인")}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-primary selection:text-white text-slate-800 font-display text-left">
            <Header />

            <main className="max-w-6xl mx-auto px-6 py-12 md:py-24">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    {t("Back to Orbit", "궤도로 돌아가기")}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Input Form (7 cols) */}
                    <div className="lg:col-span-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">
                            <div className="text-left">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                                    {isEditing ? t("Update Frequency", "주파수 업데이트") : t("Administrative Mode", "관리자 모드")}
                                </h2>
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight md:leading-none mb-4 uppercase">
                                    {isEditing ? t("Modify Sanctuary", "안식처 수정") : t("New Sanctuary", "새로운 안식처")}
                                </h1>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">
                                    {isEditing ? t(`Editing Node: ${editingId}`, `편집 노드: ${editingId}`) : t("Protocol: ARCH-X99 DATA INPUT", "프로토콜: ARCH-X99 데이터 입력")}
                                </p>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={cancelEditing}
                                    className="h-14 px-8 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    {t("Cancel Update", "업데이트 취소")}
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-12 text-left">
                            {success && (
                                <div className="p-6 bg-green-50 border border-green-100 rounded-[2rem] flex items-center gap-4 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>{isEditing ? t("NODE UPDATED SUCCESSFULLY", "노드 업데이트 성공") : t("NEW FREQUENCY REGISTERED", "신규 주파수 등록 성공")}</span>
                                </div>
                            )}

                            {error && (
                                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Section: Basic Identity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> {t("Title (EN)", "이름 (영문)")}
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Space Name"
                                        className="h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:bg-white transition-all text-xs font-bold tracking-widest"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> {t("Title (KR)", "이름 (국문)")}
                                    </label>
                                    <input
                                        type="text"
                                        name="titleKr"
                                        required
                                        value={formData.titleKr}
                                        onChange={handleChange}
                                        placeholder="공간 이름"
                                        className="h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:bg-white transition-all text-xs font-bold tracking-widest"
                                    />
                                </div>
                            </div>

                            {/* Section: Region & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> {t("Region", "지역")}
                                    </label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        className="h-16 px-6 rounded-2xl bg-white border border-slate-100 focus:border-primary transition-all text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                                    >
                                        {regions.map(r => (
                                            <option key={r.value} value={r.value}>{t(r.label, r.labelKr)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <Orbit className="w-3 h-3" /> {t("Category", "카테고리")}
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="h-16 px-6 rounded-2xl bg-white border border-slate-100 focus:border-primary transition-all text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                                    >
                                        {categories.map(c => (
                                            <option key={c.value} value={c.value}>{t(c.label, c.labelKr)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Section: Image & Map */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> {t("Cover Image Link", "커버 이미지 링크")}
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        required
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/..."
                                        className="h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 transition-all text-xs font-bold"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <Map className="w-3 h-3" /> {t("Google Maps Link", "구글 지도 링크")}
                                    </label>
                                    <input
                                        type="url"
                                        name="googleMapsUrl"
                                        value={formData.googleMapsUrl}
                                        onChange={handleChange}
                                        placeholder="https://goo.gl/maps/..."
                                        className="h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 transition-all text-xs font-bold"
                                    />
                                </div>
                            </div>

                            {/* Section: Gallery Images */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> {t("Gallery Image Links (One per line)", "갤러리 이미지 링크 (한 줄에 하나씩)")}
                                </label>
                                <textarea
                                    name="galleryUrls"
                                    value={formData.galleryUrls}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/image1...&#10;https://images.unsplash.com/image2..."
                                    className="h-32 p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 transition-all text-xs font-medium"
                                />
                            </div>

                            {/* Section: Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> {t("Description (EN)", "설명 (영문)")}
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Tell the story..."
                                        className="h-44 p-6 rounded-[2.5rem] bg-white border border-slate-100 focus:border-primary transition-all text-sm leading-relaxed"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> {t("Description (KR)", "설명 (국문)")}
                                    </label>
                                    <textarea
                                        name="descriptionKr"
                                        required
                                        value={formData.descriptionKr}
                                        onChange={handleChange}
                                        placeholder="공간의 이야기..."
                                        className="h-44 p-6 rounded-[2.5rem] bg-white border border-slate-100 focus:border-primary transition-all text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-6 group disabled:bg-slate-200"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        <span>{t(`UPDATING... [${loadingStep}]`, `업데이트 중... [${loadingStep}]`)}</span>
                                    </div>
                                ) : (
                                    <>
                                        {isEditing ? t("Update Sanctuary", "안식처 업데이트") : t("Deploy Sanctuary", "안식처 배포")}
                                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* CMS Management List */}
                        <section className="mt-32 pt-20 border-t border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                <div className="text-left">
                                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-4">{t("Lattice Management", "격자 관리")}</h2>
                                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">{t("Registered Nodes", "등록된 노드")}</h3>
                                </div>
                                <div className="relative group overflow-hidden max-w-sm w-full">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t("FIND NODE BY NAME...", "이름으로 노드 검색...")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border border-slate-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-slate-200 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Space List */}
                            <div className="flex flex-col gap-4">
                                {isFetching && spaces.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                                        <RefreshCw className="w-8 h-8 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t("SYNCING WITH CORE...", "코어와 동기화 중...")}</span>
                                    </div>
                                ) : filteredSpaces.length > 0 ? (
                                    filteredSpaces.map(space => {
                                        const regionObj = regions.find(r => r.value === space.region)
                                        const catObj = categories.find(c => c.value === space.category)

                                        return (
                                            <div
                                                key={space.id}
                                                className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row items-center gap-6"
                                            >
                                                <div className="w-full md:w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative">
                                                    <img src={space.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={space.title} />
                                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-slate-900/60 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform flex justify-center">
                                                        <Link to={`/space/${space.id}`} className="p-2 bg-white rounded-lg text-slate-900 hover:bg-primary hover:text-white transition-colors">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">#{space.id.substring(0, 8)}</span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-full">
                                                            {t(catObj?.label || space.category, catObj?.labelKr || space.category)}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors mb-2">
                                                        {t(space.title, space.titleKr)}
                                                    </h4>
                                                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {t(regionObj?.label || space.region, regionObj?.labelKr || space.region)}
                                                        </span>
                                                        <span>{space.createdAt?.seconds ? new Date(space.createdAt.seconds * 1000).toLocaleDateString() : '—'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 w-full md:w-auto">
                                                    <button
                                                        onClick={() => startEditing(space)}
                                                        className="flex-1 md:flex-none h-14 px-6 bg-slate-50 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        {t("Edit", "수정")}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(space.id, space.title)}
                                                        className="flex-1 md:flex-none h-14 px-6 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        {t("Delete", "삭제")}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="py-32 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
                                        <Plus className="w-12 h-12 mb-6 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{t("NO NODES DETECTED IN THIS FREQUENCY", "이 주파수에서 감지된 노드가 없습니다")}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Admin
