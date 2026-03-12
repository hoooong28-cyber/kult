import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import CreditCheckout from './pages/CreditCheckout'
import SpaceDetail from './pages/SpaceDetail'
import SectorSelector from './pages/SectorSelector'
import Join from './pages/Join'
import Admin from './pages/Admin'
import { LanguageProvider } from './context/LanguageContext'

function App() {
    return (
        <LanguageProvider>
            <Router>
                <Routes>
                    {/* Full-layout pages (have their own header/footer) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/search/:sector" element={<SearchResults />} />
                    <Route path="/space/:id" element={<SpaceDetail />} />
                    <Route path="/join" element={<Join />} />

                    {/* Shared-layout pages */}
                    <Route path="/credits" element={<CreditCheckout />} />
                    <Route path="/sectors" element={<SectorSelector />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App
