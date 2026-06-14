import re

with open('src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'RefreshCw, ChevronRight, Eye\n} from \'lucide-react\'',
    'RefreshCw, ChevronRight, Eye, ArrowUp, ArrowDown, Check\n} from \'lucide-react\''
)

# 2. Add properties to state
content = content.replace(
    'const [isFetching, setIsFetching] = useState(false)',
    'const [isFetching, setIsFetching] = useState(false)\n    const [activeTab, setActiveTab] = useState(\'spaces\')'
)

content = content.replace(
    'const [metaCategory, setMetaCategory] = useState({ value: \'\', label: \'\', labelKr: \'\' })',
    'const [metaCategory, setMetaCategory] = useState({ value: \'\', label: \'\', labelKr: \'\' })\n    const [editingRegion, setEditingRegion] = useState(null)\n    const [editingCategory, setEditingCategory] = useState(null)'
)

# 3. sorting in fetchData
content = content.replace(
    '''            const regionsSnapshot = await getDocs(collection(db, 'regions'))
            const regionsData = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setRegions(regionsData)

            // Fetch Categories
            const categoriesSnapshot = await getDocs(collection(db, 'categories'))
            const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setCategories(categoriesData)''',
    '''            const regionsSnapshot = await getDocs(collection(db, 'regions'))
            const regionsData = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            regionsData.sort((a,b) => (a.order || 0) - (b.order || 0))
            setRegions(regionsData)

            // Fetch Categories
            const categoriesSnapshot = await getDocs(collection(db, 'categories'))
            const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            categoriesData.sort((a,b) => (a.order || 0) - (b.order || 0))
            setCategories(categoriesData)'''
)

# 4. handleAddMetadata
content = content.replace(
    '''            await addDoc(collection(db, collectionName), {
                value: data.value,
                label: data.label,
                labelKr: data.labelKr,
                createdAt: serverTimestamp()
            })''',
    '''            const currentCount = type === 'region' ? regions.length : categories.length;
            await addDoc(collection(db, collectionName), {
                value: data.value,
                label: data.label,
                labelKr: data.labelKr,
                order: currentCount,
                createdAt: serverTimestamp()
            })'''
)

# 5. insert update/move functions
new_funcs = """    const handleUpdateMetadata = async (type, data) => {
        if (!data.value || !data.label || !data.labelKr) {
            alert(t('Please fill all fields.', '모든 필드를 입력해주세요.'))
            return
        }
        try {
            const collectionName = type === 'region' ? 'regions' : 'categories'
            await updateDoc(doc(db, collectionName, data.id), {
                value: data.value,
                label: data.label,
                labelKr: data.labelKr
            })
            if (type === 'region') setEditingRegion(null)
            if (type === 'category') setEditingCategory(null)
            await fetchData()
        } catch (err) {
            console.error(`Error updating ${type}:`, err)
            alert(t(`Failed to update ${type}.`, `${type} 수정에 실패했습니다.`))
        }
    }

    const handleMoveMetadata = async (type, index, direction) => {
        const list = type === 'region' ? [...regions] : [...categories]
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === list.length - 1) return

        const newIndex = direction === 'up' ? index - 1 : index + 1
        const item = list[index]
        list.splice(index, 1)
        list.splice(newIndex, 0, item)

        if (type === 'region') setRegions([...list])
        else setCategories([...list])

        try {
            const collectionName = type === 'region' ? 'regions' : 'categories'
            await Promise.all(list.map(async (docItem, idx) => {
                await updateDoc(doc(db, collectionName, docItem.id), { order: idx })
            }))
        } catch (err) {
            console.error("Error updating order:", err)
            await fetchData()
        }
    }

    const handleSubmit ="""

content = content.replace('    const handleSubmit =', new_funcs)

# 6. Tab UI and conditional rendering wrapping
tab_ui = """                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    {t("Back to Orbit", "궤도로 돌아가기")}
                </Link>

                <div className="flex items-center gap-4 mb-12 border-b border-slate-200 pb-4">
                    <button 
                        onClick={() => setActiveTab('spaces')}
                        className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'spaces' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        {t("Spaces Management", "공간 관리")}
                    </button>
                    <button 
                        onClick={() => setActiveTab('metadata')}
                        className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'metadata' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        {t("Metadata Config", "메타데이터 설정")}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        {activeTab === 'spaces' && (
                            <>"""

content = content.replace(
    '''                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    {t("Back to Orbit", "궤도로 돌아가기")}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Input Form (7 cols) */}
                    <div className="lg:col-span-12">''',
    tab_ui
)

content = content.replace(
    '''                        {/* Metadata Management */}
                        <section className="mt-32 pt-20 border-t border-slate-100">''',
    '''                            </>
                        )}
                        
                        {activeTab === 'metadata' && (
                        {/* Metadata Management */}
                        <section className="border-slate-100">'''
)

# 7. Modify Metadata Section UI (Adding hints to inputs, adding DND/arrows and Edit UI)
metadata_html_old = '''                        {activeTab === 'metadata' && (
                        {/* Metadata Management */}
                        <section className="border-slate-100">
                            <div className="text-left mb-12">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-4">{t("Metadata Config", "메타데이터 설정")}</h2>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">{t("Regions & Categories", "지역 및 카테고리")}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* Region Management */}
                                <div className="bg-white p-8 border border-slate-100 rounded-[2rem] shadow-sm">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                                        <MapPin className="w-4 h-4" /> Regions
                                    </h4>
                                    
                                    <div className="flex flex-col gap-4 mb-8">
                                        <input type="text" placeholder="Value (e.g. seongsu)" value={metaRegion.value} onChange={e => setMetaRegion(prev => ({...prev, value: e.target.value}))} className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                                        <input type="text" placeholder="Label EN (e.g. Seongsu)" value={metaRegion.label} onChange={e => setMetaRegion(prev => ({...prev, label: e.target.value}))} className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                                        <input type="text" placeholder="Label KR (e.g. 성수)" value={metaRegion.labelKr} onChange={e => setMetaRegion(prev => ({...prev, labelKr: e.target.value}))} className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                                        <button onClick={() => handleAddMetadata('region')} type="button" className="h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2">
                                            <Plus className="w-4 h-4" /> Add Region
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {regions.map(r => (
                                            <div key={r.id || r.value} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-slate-900">{r.label} <span className="text-slate-400 font-normal">({r.labelKr})</span></span>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {r.value}</span>
                                                </div>
                                                <button onClick={() => handleDeleteMetadata('region', r.id)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Management */}
                                <div className="bg-white p-8 border border-slate-100 rounded-[2rem] shadow-sm">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                                        <Orbit className="w-4 h-4" /> Categories
                                    </h4>
                                    
                                    <div className="flex flex-col gap-4 mb-8">
                                        <input type="text" placeholder="Value (e.g. cafe)" value={metaCategory.value} onChange={e => setMetaCategory(prev => ({...prev, value: e.target.value}))} className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                                        <input type="text" placeholder="Label EN (e.g. Cafe)" value={metaCategory.label} onChange={e => setMetaCategory(prev => ({...prev, label: e.target.value}))} className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                                        <input type="text" placeholder="Label KR (e.g. 카페)" value={metaCategory.labelKr} onChange={e => setMetaCategory(prev => ({...prev, labelKr: e.target.value}))} className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                                        <button onClick={() => handleAddMetadata('category')} type="button" className="h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2">
                                            <Plus className="w-4 h-4" /> Add Category
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {categories.map(c => (
                                            <div key={c.id || c.value} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-slate-900">{c.label} <span className="text-slate-400 font-normal">({c.labelKr})</span></span>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {c.value}</span>
                                                </div>
                                                <button onClick={() => handleDeleteMetadata('category', c.id)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>'''

metadata_html_new = '''                        {activeTab === 'metadata' && (
                        {/* Metadata Management */}
                        <section className="border-slate-100">
                            <div className="text-left mb-12">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-4">{t("Metadata Config", "메타데이터 설정")}</h2>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">{t("Regions & Categories", "지역 및 카테고리")}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* Region Management */}
                                <div className="bg-white p-8 border border-slate-100 rounded-[2rem] shadow-sm">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                                        <MapPin className="w-4 h-4" /> Regions
                                    </h4>
                                    
                                    <div className="flex flex-col gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">ID (영어 소문자/띄어쓰기 금지)</label>
                                            <input type="text" placeholder="예: seongsu" value={metaRegion.value} onChange={e => setMetaRegion(prev => ({...prev, value: e.target.value}))} className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">영어 표기명</label>
                                            <input type="text" placeholder="예: Seongsu" value={metaRegion.label} onChange={e => setMetaRegion(prev => ({...prev, label: e.target.value}))} className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">한글 표기명</label>
                                            <input type="text" placeholder="예: 성수" value={metaRegion.labelKr} onChange={e => setMetaRegion(prev => ({...prev, labelKr: e.target.value}))} className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold" />
                                        </div>
                                        <button onClick={() => handleAddMetadata('region')} type="button" className="h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2">
                                            <Plus className="w-4 h-4" /> Add Region
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {regions.map((r, i) => (
                                            <div key={r.id || r.value} className="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                                {editingRegion?.id === r.id ? (
                                                    <div className="flex gap-2">
                                                        <div className="flex flex-col gap-2 flex-1">
                                                            <input type="text" value={editingRegion.value} onChange={e => setEditingRegion({...editingRegion, value: e.target.value})} className="h-10 px-3 text-xs border rounded bg-white" placeholder="ID" />
                                                            <input type="text" value={editingRegion.label} onChange={e => setEditingRegion({...editingRegion, label: e.target.value})} className="h-10 px-3 text-xs border rounded bg-white" placeholder="EN" />
                                                            <input type="text" value={editingRegion.labelKr} onChange={e => setEditingRegion({...editingRegion, labelKr: e.target.value})} className="h-10 px-3 text-xs border rounded bg-white" placeholder="KR" />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <button onClick={() => handleUpdateMetadata('region', editingRegion)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"><Check className="w-4 h-4"/></button>
                                                            <button onClick={() => setEditingRegion(null)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"><X className="w-4 h-4"/></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col gap-1 items-center justify-center pr-3 border-r border-slate-200 opacity-30 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleMoveMetadata('region', i, 'up')} className="p-0.5 hover:bg-slate-200 rounded text-slate-500"><ArrowUp className="w-3 h-3"/></button>
                                                                <button onClick={() => handleMoveMetadata('region', i, 'down')} className="p-0.5 hover:bg-slate-200 rounded text-slate-500"><ArrowDown className="w-3 h-3"/></button>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-sm font-bold text-slate-900">{r.label} <span className="text-slate-400 font-normal">({r.labelKr})</span></span>
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {r.value}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setEditingRegion(r)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors">
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleDeleteMetadata('region', r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Management */}
                                <div className="bg-white p-8 border border-slate-100 rounded-[2rem] shadow-sm">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                                        <Orbit className="w-4 h-4" /> Categories
                                    </h4>
                                    
                                    <div className="flex flex-col gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">ID (영어 소문자/띄어쓰기 금지)</label>
                                            <input type="text" placeholder="예: cafe" value={metaCategory.value} onChange={e => setMetaCategory(prev => ({...prev, value: e.target.value}))} className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">영어 표기명</label>
                                            <input type="text" placeholder="예: Cafe" value={metaCategory.label} onChange={e => setMetaCategory(prev => ({...prev, label: e.target.value}))} className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">한글 표기명</label>
                                            <input type="text" placeholder="예: 카페" value={metaCategory.labelKr} onChange={e => setMetaCategory(prev => ({...prev, labelKr: e.target.value}))} className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold" />
                                        </div>
                                        <button onClick={() => handleAddMetadata('category')} type="button" className="h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2">
                                            <Plus className="w-4 h-4" /> Add Category
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {categories.map((c, i) => (
                                            <div key={c.id || c.value} className="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                                {editingCategory?.id === c.id ? (
                                                    <div className="flex gap-2">
                                                        <div className="flex flex-col gap-2 flex-1">
                                                            <input type="text" value={editingCategory.value} onChange={e => setEditingCategory({...editingCategory, value: e.target.value})} className="h-10 px-3 text-xs border rounded bg-white" placeholder="ID" />
                                                            <input type="text" value={editingCategory.label} onChange={e => setEditingCategory({...editingCategory, label: e.target.value})} className="h-10 px-3 text-xs border rounded bg-white" placeholder="EN" />
                                                            <input type="text" value={editingCategory.labelKr} onChange={e => setEditingCategory({...editingCategory, labelKr: e.target.value})} className="h-10 px-3 text-xs border rounded bg-white" placeholder="KR" />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <button onClick={() => handleUpdateMetadata('category', editingCategory)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"><Check className="w-4 h-4"/></button>
                                                            <button onClick={() => setEditingCategory(null)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"><X className="w-4 h-4"/></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col gap-1 items-center justify-center pr-3 border-r border-slate-200 opacity-30 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleMoveMetadata('category', i, 'up')} className="p-0.5 hover:bg-slate-200 rounded text-slate-500"><ArrowUp className="w-3 h-3"/></button>
                                                                <button onClick={() => handleMoveMetadata('category', i, 'down')} className="p-0.5 hover:bg-slate-200 rounded text-slate-500"><ArrowDown className="w-3 h-3"/></button>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-sm font-bold text-slate-900">{c.label} <span className="text-slate-400 font-normal">({c.labelKr})</span></span>
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {c.value}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setEditingCategory(c)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors">
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleDeleteMetadata('category', c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                        )}'''

content = content.replace(metadata_html_old, metadata_html_new)

# 8. Render CMS List condition
content = content.replace(
    '''                        {/* CMS Management List */}
                        <section className="mt-32 pt-20 border-t border-slate-100">''',
    '''                        {activeTab === 'spaces' && (
                        {/* CMS Management List */}
                        <section className="mt-32 pt-20 border-t border-slate-100">'''
)

content = content.replace(
    '''                                    </div>
                                )}
                            </div>
                        </section>
                    </div>''',
    '''                                    </div>
                                )}
                            </div>
                        </section>
                        )}
                    </div>'''
)

with open('src/pages/Admin.jsx', 'w') as f:
    f.write(content)
print("Updated Admin.jsx!")
