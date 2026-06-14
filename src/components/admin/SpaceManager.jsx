import React from 'react'
import { 
    Search, Plus, MapPin, Eye, Edit3, Trash2, 
    X, CheckCircle2, AlertCircle, Tag, Globe, 
    ImageIcon, Map, FileText, Save, RefreshCw 
} from 'lucide-react'
import { Link } from 'react-router-dom'

const SpaceManager = ({
    activeTab,
    t,
    isEditing,
    editingId,
    cancelEditing,
    formData,
    handleChange,
    handleSubmit,
    success,
    error,
    loading,
    loadingStep,
    regions,
    categories,
    searchTerm,
    setSearchTerm,
    isFetching,
    spaces,
    filteredSpaces,
    handleDelete
}) => {
    if (activeTab === 'space-form') {
        return (
            <div className="text-left">
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

                    {/* Section: Social & Website Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> {t("Instagram Link", "인스타그램 링크")}
                            </label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={formData.instagramUrl}
                                onChange={handleChange}
                                placeholder="https://www.instagram.com/..."
                                className="h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 transition-all text-xs font-bold"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> {t("Official Website", "공식 웹사이트")}
                            </label>
                            <input
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                placeholder="https://..."
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
            </div>
        )
    }

    // Default: spaces-list
    return (
        <section className="border-slate-100">
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
                                    <Link
                                        to={`/admin?tab=space-form&id=${space.id}`}
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="flex-1 md:flex-none h-14 px-6 bg-slate-50 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        {t("Edit", "수정")}
                                    </Link>
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
    )
}

export default SpaceManager
