import React from 'react'
import { 
    Plus, Edit3, Trash2, ArrowUp, ArrowDown, 
    ImageIcon, Save, Info, MapPin 
} from 'lucide-react'

const MagazineManager = ({
    t,
    activeTab,
    magazines,
    magazineForm,
    setMagazineForm,
    isMagazineEditing,
    editingMagazineId,
    handleMagazineSubmit,
    handleDeleteMagazine,
    addMagazineSection,
    removeMagazineSection,
    updateMagazineSection,
    moveMagazineSection,
    addMagazineProduct,
    removeMagazineProduct,
    updateMagazineProduct,
    startEditingMagazine,
    spaces,
    loading,
    setIsMagazineEditing,
    setEditingMagazineId,
    setActiveTab
}) => {
    
    const handleToggleFeaturedSpace = (spaceId) => {
        const currentFeatured = magazineForm.featuredSpaces || []
        const exists = currentFeatured.some(s => s.id === spaceId)
        
        if (exists) {
            setMagazineForm({
                ...magazineForm,
                featuredSpaces: currentFeatured.filter(s => s.id !== spaceId)
            })
        } else {
            const spaceToAdd = spaces.find(s => s.id === spaceId)
            if (spaceToAdd) {
                const minimalSpace = {
                    id: spaceToAdd.id,
                    name: spaceToAdd.title,
                    nameKr: spaceToAdd.titleKr,
                    category: spaceToAdd.category,
                    categoryKr: spaceToAdd.categoryKr,
                    description: spaceToAdd.description ? (spaceToAdd.description.substring(0, 100) + '...') : '',
                    descriptionKr: spaceToAdd.descriptionKr ? (spaceToAdd.descriptionKr.substring(0, 100) + '...') : '',
                    imageUrl: spaceToAdd.imageUrl
                }
                setMagazineForm({
                    ...magazineForm,
                    featuredSpaces: [...currentFeatured, minimalSpace]
                })
            }
        }
    }

    if (activeTab === 'magazine-form') {
        return (
            <div className="text-left w-full">
                <div className="text-left mb-12">
                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-4">{t("Editorial Input", "에디토리얼 입력")}</h2>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">{isMagazineEditing ? t("Edit Volume", "볼륨 수정") : t("Create New Volume", "신규 볼륨 생성")}</h3>
                </div>

                <form onSubmit={handleMagazineSubmit} className="flex flex-col gap-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Volume NO.</label>
                            <input type="number" required value={magazineForm.volume} onChange={e => setMagazineForm({...magazineForm, volume: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Issue Date (e.g. 2024.03.W3)</label>
                            <input type="text" required value={magazineForm.issueDate || ''} onChange={e => setMagazineForm({...magazineForm, issueDate: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Cover Image URL</label>
                            <input type="url" required value={magazineForm.coverImage} onChange={e => setMagazineForm({...magazineForm, coverImage: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Title (EN)</label>
                            <input type="text" required value={magazineForm.title} onChange={e => setMagazineForm({...magazineForm, title: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Title (KR)</label>
                            <input type="text" required value={magazineForm.titleKr} onChange={e => setMagazineForm({...magazineForm, titleKr: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Subtitle (EN)</label>
                            <input type="text" value={magazineForm.subtitle} onChange={e => setMagazineForm({...magazineForm, subtitle: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Subtitle (KR)</label>
                            <input type="text" value={magazineForm.subtitleKr} onChange={e => setMagazineForm({...magazineForm, subtitleKr: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Main Content (EN)</label>
                            <textarea value={magazineForm.description} onChange={e => setMagazineForm({...magazineForm, description: e.target.value})} className="h-40 p-6 rounded-3xl bg-slate-50 border border-slate-100 text-xs leading-relaxed" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Main Content (KR)</label>
                            <textarea value={magazineForm.descriptionKr} onChange={e => setMagazineForm({...magazineForm, descriptionKr: e.target.value})} className="h-40 p-6 rounded-3xl bg-slate-50 border border-slate-100 text-xs leading-relaxed" />
                        </div>
                    </div>

                    {/* Featured Spaces Selection */}
                    <div className="border-t border-slate-100 pt-12 mt-4 text-left">
                        <div className="mb-8 font-display">
                            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">{t("Featured Spaces", "추천 공간")}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t("Select spaces to highlight in this volume", "이 볼륨에서 강조할 공간들을 선택하세요")}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(magazineForm.featuredSpaces || []).map(s => (
                                <div key={s.id} className="px-4 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                                    {s.name}
                                    <button type="button" onClick={() => handleToggleFeaturedSpace(s.id)} className="hover:text-primary transition-colors">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {(magazineForm.featuredSpaces || []).length === 0 && (
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No spaces selected</span>
                            )}
                        </div>

                        <div className="h-72 overflow-y-auto border border-slate-100 rounded-[2.5rem] p-6 bg-slate-50 flex flex-col gap-3">
                            {spaces.map(space => {
                                const isSelected = (magazineForm.featuredSpaces || []).some(s => s.id === space.id)
                                return (
                                    <button
                                        key={space.id}
                                        type="button"
                                        onClick={() => handleToggleFeaturedSpace(space.id)}
                                        className={`flex items-center gap-6 p-4 rounded-3xl border transition-all ${isSelected ? 'bg-white border-primary shadow-lg shadow-primary/5' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                                    >
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
                                            <img src={space.imageUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h5 className={`text-sm font-black uppercase tracking-tight ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{space.title}</h5>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{space.category} • {space.region}</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-slate-200'}`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Magazine Sections Management */}
                    <div className="border-t border-slate-100 pt-12 mt-4 text-left">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-left font-display">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">{t("Magazine Sections", "매거진 섹션")}</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t("Add multiple images and descriptions", "여러 이미지와 설명을 추가하세요")}</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={addMagazineSection}
                                className="h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Section
                            </button>
                        </div>

                        <div className="flex flex-col gap-12">
                            {(magazineForm.sections || []).map((section, idx) => (
                                <div key={idx} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm relative group">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                                        {idx + 1}
                                    </div>
                                    <div className="absolute top-6 right-6 flex items-center gap-2">
                                        <button onClick={() => moveMagazineSection(idx, 'up')} type="button" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><ArrowUp className="w-4 h-4" /></button>
                                        <button onClick={() => moveMagazineSection(idx, 'down')} type="button" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><ArrowDown className="w-4 h-4" /></button>
                                        <button onClick={() => removeMagazineSection(idx)} type="button" className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
                                        <div className="md:col-span-4 flex flex-col gap-4 text-left">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Section Image URL</label>
                                            <div className="aspect-[4/5] rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden relative group/img shadow-inner">
                                                {section.imageUrl ? (
                                                    <img src={section.imageUrl} className="w-full h-full object-cover" alt="Section" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                                        <ImageIcon className="w-8 h-8 mb-2" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">No Image</span>
                                                    </div>
                                                )}
                                                <input 
                                                    type="url" 
                                                    placeholder="https://..." 
                                                    value={section.imageUrl || ''} 
                                                    onChange={e => updateMagazineSection(idx, 'imageUrl', e.target.value)}
                                                    className="absolute inset-x-4 bottom-4 h-12 px-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/20 text-[10px] font-bold shadow-xl opacity-0 hover:opacity-100 focus:opacity-100 transition-all"
                                                />
                                            </div>
                                            <input 
                                                type="url" 
                                                placeholder="Paste Image URL here" 
                                                value={section.imageUrl || ''} 
                                                onChange={e => updateMagazineSection(idx, 'imageUrl', e.target.value)}
                                                className="h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-bold focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-8 flex flex-col gap-6 text-left">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Section Title (EN)</label>
                                                    <input type="text" value={section.title || ''} onChange={e => updateMagazineSection(idx, 'title', e.target.value)} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold focus:bg-white transition-all" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Section Title (KR)</label>
                                                    <input type="text" value={section.titleKr || ''} onChange={e => updateMagazineSection(idx, 'titleKr', e.target.value)} className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold focus:bg-white transition-all" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Content (EN)</label>
                                                <textarea value={section.content || ''} onChange={e => updateMagazineSection(idx, 'content', e.target.value)} className="h-32 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-xs leading-relaxed focus:bg-white transition-all shadow-sm" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Content (KR)</label>
                                                <textarea value={section.contentKr || ''} onChange={e => updateMagazineSection(idx, 'contentKr', e.target.value)} className="h-32 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-xs leading-relaxed focus:bg-white transition-all shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!magazineForm.sections || magazineForm.sections.length === 0) && (
                                <div className="py-24 border border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/50">
                                    <ImageIcon className="w-12 h-12 mb-6 opacity-10" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("NO SECTIONS ADDED YET", "추가된 섹션이 없습니다")}</p>
                                    <button type="button" onClick={addMagazineSection} className="mt-8 h-12 px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                        Initialize First Section
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Beauty News / Featured Products Management */}
                    <div className="border-t border-slate-100 pt-12 mt-12 text-left">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-left font-display">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900">{t("Weekly Beauty News", "주간 뷰티 뉴스")}</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t("Curation of new products and beauty trends", "신상품 및 뷰티 트렌드 큐레이션")}</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={addMagazineProduct}
                                className="h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Product
                            </button>
                        </div>

                        <div className="flex flex-col gap-8">
                            {(magazineForm.featuredProducts || []).map((product, idx) => (
                                <div key={idx} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] relative group">
                                    <button onClick={() => removeMagazineProduct(idx)} type="button" className="absolute top-6 right-6 p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        <div className="md:col-span-3 flex flex-col gap-4 text-left">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Product Image</label>
                                            <div className="aspect-square rounded-3xl bg-white border border-slate-100 overflow-hidden relative shadow-sm">
                                                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" alt="Product" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon className="w-6 h-6" /></div>}
                                            </div>
                                            <input type="url" placeholder="Image URL" value={product.imageUrl || ''} onChange={e => updateMagazineProduct(idx, 'imageUrl', e.target.value)} className="h-10 px-4 rounded-xl bg-white border border-slate-100 text-[10px] font-bold" />
                                        </div>
                                        <div className="md:col-span-9 flex flex-col gap-4 text-left">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Brand</label>
                                                    <input type="text" value={product.brand || ''} onChange={e => updateMagazineProduct(idx, 'brand', e.target.value)} className="h-12 px-4 rounded-xl bg-white border border-slate-100 text-xs font-bold" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Product Name (EN)</label>
                                                    <input type="text" value={product.name || ''} onChange={e => updateMagazineProduct(idx, 'name', e.target.value)} className="h-12 px-4 rounded-xl bg-white border border-slate-100 text-xs font-bold" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Product Name (KR)</label>
                                                    <input type="text" value={product.nameKr || ''} onChange={e => updateMagazineProduct(idx, 'nameKr', e.target.value)} className="h-12 px-4 rounded-xl bg-white border border-slate-100 text-xs font-bold" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Short Description (EN)</label>
                                                <textarea value={product.description || ''} onChange={e => updateMagazineProduct(idx, 'description', e.target.value)} className="h-20 p-4 rounded-2xl bg-white border border-slate-100 text-xs leading-relaxed" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Short Description (KR)</label>
                                                <textarea value={product.descriptionKr || ''} onChange={e => updateMagazineProduct(idx, 'descriptionKr', e.target.value)} className="h-20 p-4 rounded-2xl bg-white border border-slate-100 text-xs leading-relaxed" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Tag (e.g. New Hero)</label>
                                                <input type="text" value={product.tag || 'Weekly Select'} onChange={e => updateMagazineProduct(idx, 'tag', e.target.value)} className="h-12 px-4 rounded-xl bg-white border border-slate-100 text-xs font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-12 pt-12 border-t border-slate-100">
                        <button type="submit" disabled={loading} className="h-20 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98]">
                            {loading ? t("PROCESSING...", "처리 중...") : (isMagazineEditing ? t("Update Volume", "볼륨 업데이트") : t("Deploy Volume", "볼륨 배포"))}
                        </button>
                        {isMagazineEditing && (
                            <button type="button" onClick={() => { setIsMagazineEditing(false); setEditingMagazineId(null); setActiveTab('magazine-list'); }} className="h-14 bg-slate-100 text-slate-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                                Cancel Editing
                            </button>
                        )}
                    </div>
                </form>
            </div>
        )
    }

    // Default: magazine-list
    return (
        <div className="text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 text-left">
                <div className="text-left">
                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-4">{t("Editorial Archive", "에디토리얼 아카이브")}</h2>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">{t("Magazine Volumes", "잡지 볼륨")}</h3>
                </div>
                <button 
                    onClick={() => setActiveTab('magazine-form')}
                    className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                >
                    <Plus className="w-4 h-4" /> New Volume
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {magazines.map(mag => (
                    <div key={mag.id} className="group bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center gap-8 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all">
                        <div className="w-28 h-36 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                            <img src={mag.coverImage} className="w-full h-full object-cover" alt={mag.title} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 block">VOL. {mag.volume}</span>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors mb-2">{t(mag.title, mag.titleKr)}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 line-clamp-1 opacity-60">{t(mag.subtitle, mag.subtitleKr)}</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => startEditingMagazine(mag)} className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteMagazine(mag.id, mag.title)} className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MagazineManager
