import { Link } from 'react-router-dom'
import { Orbit, Globe, Instagram } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-24">
            <div className="mx-auto max-w-[1440px] px-6 md:px-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-24">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-10 text-primary">
                            <Orbit className="w-8 h-8" strokeWidth={1.5} />
                            <span className="text-2xl font-black tracking-tighter text-slate-900">KULT</span>
                        </div>
                        <p className="text-sm tracking-wide text-slate-500 leading-relaxed font-light">
                            A curated network of architectural sanctuaries for the modern minimalist. Mapping the intersection of heritage and future.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
                        <div>
                            <h4 className="text-[10px] tracking-[0.4em] uppercase text-slate-900 font-black mb-10">Discovery</h4>
                            <ul className="space-y-6 text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
                                <li><Link className="hover:text-primary transition-colors" to="/sectors">Sectors</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/magazine">Magazine</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] tracking-[0.4em] uppercase text-slate-900 font-black mb-10">Operations</h4>
                            <ul className="space-y-6 text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
                                <li><Link className="hover:text-primary transition-colors" to="/subscribe">Subscribe</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/join">Join</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/credits">Credits</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] tracking-[0.4em] uppercase text-slate-900 font-black mb-10">Social</h4>
                            <ul className="space-y-6 text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
                                <li><a className="hover:text-primary transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                                <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> <a className="hover:text-primary transition-colors" href="https://kult-discovery.web.app" target="_blank" rel="noreferrer">Global Hub</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-300">
                    <p>© 2024 KULT COMMAND CENTER. CURATING THE FUTURE HERITAGE.</p>
                    <div className="flex gap-10">
                        <a className="hover:text-primary transition-colors" href="#">PRIVACY PORTAL</a>
                        <a className="hover:text-primary transition-colors" href="#">SYSTEM TERMS</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
