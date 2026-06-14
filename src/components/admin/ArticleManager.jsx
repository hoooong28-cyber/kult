import React from 'react'
import {
    Search, Plus, Eye, Edit3, Trash2,
    X, CheckCircle2, AlertCircle, Globe,
    ImageIcon, Map, FileText, Save, RefreshCw,
    Calendar, Tag, MapPin, Instagram, ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'

const ArticleManager = ({
    activeTab,
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
    searchTerm,
    setSearchTerm,
    isFetching,
    articles,
    filteredArticles,
    startEditing,
    handleDelete
}) => {

    // ─── Article Form Tab ───────────────────────────────────────────────────
    if (activeTab === 'article-form') {
        return (
            <div className="text-left">
                {/* Form Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-10 mb-12">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">
                            {isEditing ? 'Update Article' : 'New Article'}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
                            {isEditing ? '아티클 수정하기' : '신규 아티클 등록'}
                        </h2>
                        {isEditing && (
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2">
                                ID: {editingId}
                            </p>
                        )}
                    </div>
                    {isEditing && (
                        <button
                            onClick={cancelEditing}
                            className="inline-flex items-center gap-2 h-12 px-6 border border-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                            취소
                        </button>
                    )}
                </div>

                {/* Feedback messages */}
                {success && (
                    <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isEditing ? '아티클이 성공적으로 업데이트되었습니다.' : '신규 아티클이 발행되었습니다!'}</span>
                    </div>
                )}
                {error && (
                    <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-10">

                    {/* Category: space or product */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                            <Tag className="w-3 h-3" /> 아티클 유형
                        </label>
                        <div className="flex gap-4">
                            {[
                                { value: 'space', label: '🏛  공간 큐레이션', sub: 'Space Curation' },
                                { value: 'product', label: '📦  신상품 인사이트', sub: 'Brand & Product' }
                            ].map(opt => (
                                <label key={opt.value} className="flex-1 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={opt.value}
                                        checked={formData.category === opt.value}
                                        onChange={handleChange}
                                        className="peer hidden"
                                    />
                                    <div className="flex flex-col gap-1 p-5 rounded-2xl border-2 border-slate-800 bg-slate-900/50 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-slate-700">
                                        <span className="text-base font-black text-white">{opt.label}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{opt.sub}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Title EN / KR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> 제목 (영문)
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Article title in English"
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 focus:bg-slate-850 transition-all text-sm font-semibold text-white placeholder:text-slate-700"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> 제목 (국문)
                            </label>
                            <input
                                type="text"
                                name="titleKr"
                                required
                                value={formData.titleKr}
                                onChange={handleChange}
                                placeholder="아티클 제목 (한글)"
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 focus:bg-slate-850 transition-all text-sm font-semibold text-white placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Region (free text) & Published At (manual override) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> 지역 (예: seongsu, hongdae)
                            </label>
                            <input
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="seongsu"
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-semibold text-white placeholder:text-slate-700"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> 발행일시 (비워두면 현재 시각 자동 적용)
                            </label>
                            <input
                                type="datetime-local"
                                name="publishedAt"
                                value={formData.publishedAt}
                                onChange={handleChange}
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-semibold text-white"
                            />
                        </div>
                    </div>

                    {/* Cover Image & Google Maps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> 커버 이미지 URL
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                required
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/..."
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-medium text-white placeholder:text-slate-700"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <Map className="w-3 h-3" /> 구글 지도 링크 (선택)
                            </label>
                            <input
                                type="url"
                                name="googleMapsUrl"
                                value={formData.googleMapsUrl}
                                onChange={handleChange}
                                placeholder="https://goo.gl/maps/..."
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-medium text-white placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Instagram & Website */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <Instagram className="w-3 h-3" /> 인스타그램 링크 (선택)
                            </label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={formData.instagramUrl}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-medium text-white placeholder:text-slate-700"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <ExternalLink className="w-3 h-3" /> 공식 웹사이트 (선택)
                            </label>
                            <input
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="h-14 px-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-medium text-white placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" /> 갤러리 이미지 링크 (한 줄에 하나씩)
                        </label>
                        <textarea
                            name="galleryUrls"
                            value={formData.galleryUrls}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/image1...&#10;https://images.unsplash.com/image2..."
                            rows={4}
                            className="p-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm font-medium text-white placeholder:text-slate-700 resize-none"
                        />
                    </div>

                    {/* Description EN / KR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <FileText className="w-3 h-3" /> 칼럼 본문 (영문)
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write the full article in English..."
                                rows={10}
                                className="p-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm leading-relaxed text-white placeholder:text-slate-700 resize-none"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                <FileText className="w-3 h-3" /> 칼럼 본문 (국문)
                            </label>
                            <textarea
                                name="descriptionKr"
                                required
                                value={formData.descriptionKr}
                                onChange={handleChange}
                                placeholder="아티클 본문을 한글로 작성하세요..."
                                rows={10}
                                className="p-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-sm leading-relaxed text-white placeholder:text-slate-700 resize-none"
                            />
                        </div>
                    </div>

                    {/* Cover Image Preview */}
                    {formData.imageUrl && (
                        <div className="flex flex-col gap-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">커버 이미지 미리보기</label>
                            <div className="relative aspect-[16/7] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                                <img
                                    src={formData.imageUrl}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                    onError={e => e.target.style.display = 'none'}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-primary hover:brightness-110 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-4 group"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{loadingStep || '저장 중...'}</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                {isEditing ? '아티클 업데이트' : '아티클 발행하기'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        )
    }

    // ─── Articles List Tab ──────────────────────────────────────────────────
    return (
        <section>
            {/* List Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-1">
                        총 {articles.length}개 아티클
                    </p>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">전체 아티클 목록</h2>
                </div>
                <div className="relative group max-w-xs w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="아티클 이름으로 검색..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-11 pr-5 rounded-xl bg-slate-900 border border-slate-800 focus:border-primary/50 transition-all text-xs font-semibold text-white placeholder:text-slate-700"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {isFetching && articles.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-700">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">데이터 불러오는 중...</span>
                    </div>
                ) : filteredArticles.length > 0 ? (
                    filteredArticles.map(article => {
                        const isProduct = article.category === 'product' || article.category === 'retail'

                        // Parse date
                        let dateStr = '—'
                        if (article.createdAt) {
                            const d = article.createdAt.toDate ? article.createdAt.toDate() : new Date(article.createdAt)
                            dateStr = d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
                        }

                        // Is older than 24h?
                        let isLocked = false
                        if (article.createdAt) {
                            const d = article.createdAt.toDate ? article.createdAt.toDate() : new Date(article.createdAt)
                            isLocked = new Date() - d > 24 * 60 * 60 * 1000
                        }

                        return (
                            <div
                                key={article.id}
                                className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 transition-all flex flex-col sm:flex-row items-center gap-5"
                            >
                                {/* Thumbnail */}
                                <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 relative">
                                    <img
                                        src={article.imageUrl}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                                        alt={article.title}
                                    />
                                </div>

                                {/* Meta */}
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${isProduct ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-sky-400 bg-sky-400/10 border-sky-400/20'}`}>
                                            {isProduct ? '신상품' : '공간'}
                                        </span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${isLocked ? 'text-slate-500 border-slate-800' : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'}`}>
                                            {isLocked ? '🔒 PREMIUM' : '✓ FREE TODAY'}
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-700 uppercase tracking-wider">#{article.id.substring(0, 8)}</span>
                                    </div>
                                    <h4 className="text-base font-black text-white tracking-tight truncate group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                                        {article.region && `${article.region} · `}{dateStr}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                                    <Link
                                        to={`/space/${article.id}`}
                                        target="_blank"
                                        className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        미리보기
                                    </Link>
                                    <Link
                                        to={`/admin?tab=article-form&id=${article.id}`}
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="h-10 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        수정
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(article.id, article.title)}
                                        className="h-10 px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        삭제
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="py-32 border-2 border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-700">
                        <Plus className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-[10px] font-black uppercase tracking-widest">아티클이 없습니다. 새 아티클을 등록해보세요.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ArticleManager
