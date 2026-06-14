import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const products = [
    {
        id: 'p1',
        brand: 'NONFICTION',
        name: 'Santal Cream Hand Wash',
        category: 'Beauty',
        img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
        date: 'Today'
    },
    {
        id: 'p2',
        brand: 'Tamburins',
        name: 'Chamo Perfume Balm',
        category: 'Fragrance',
        img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        date: 'Today'
    },
    {
        id: 'p3',
        brand: 'Osoi',
        name: 'Toni Mini Bag',
        category: 'Fashion',
        img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600',
        date: 'Yesterday'
    },
    {
        id: 'p4',
        brand: 'Gentle Monster',
        name: 'Rococo 01',
        category: 'Eyewear',
        img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
        date: 'Yesterday'
    }
]

const ProductFeed = ({ t }) => {
    return (
        <section className="py-24 bg-white border-t border-slate-100 text-left">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Free Content
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {t("New Arrivals & Trends", "신상품 & 트렌드 디스커버리")}
                        </h3>
                        <p className="mt-2 text-slate-500 font-medium">
                            {t("Discover the latest drops from Korean brands, curated daily.", "매일 업데이트되는 한국 브랜드의 새로운 소식을 무료로 만나보세요.")}
                        </p>
                    </div>
                    <Link className="flex items-center gap-2 font-bold text-sm text-primary hover:gap-4 transition-all" to="/search">
                        {t("View all products", "모든 신상품 보기")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link to={`/search`} key={product.id} className="group block">
                            <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900">
                                    {product.category}
                                </div>
                            </div>
                            <div className="px-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{product.brand}</h4>
                                    <span className="text-[10px] font-bold text-slate-400">{product.date}</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{product.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductFeed
