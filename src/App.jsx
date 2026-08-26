import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import CreditCheckout from './pages/CreditCheckout'
import SpaceDetail from './pages/SpaceDetail'
import SectorSelector from './pages/SectorSelector'
import Join from './pages/Join'
import Admin from './pages/Admin'
import AdminStaging from './pages/AdminStaging'
import Subscribe from './pages/Subscribe'
import Magazine from './pages/Magazine'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <Routes>
                        {/* Full-layout pages */}
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/search/:sector" element={<SearchResults />} />
                        <Route path="/space/:id" element={<SpaceDetail />} />
                        <Route path="/join" element={<Join />} />

                        {/* Shared-layout pages */}
                        <Route path="/credits" element={<CreditCheckout />} />
                        <Route path="/subscribe" element={<Subscribe />} />
                        <Route path="/sectors" element={<SectorSelector />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/staging" element={<AdminStaging />} />
                        <Route path="/magazine" element={<Magazine />} />
                        <Route path="/magazine/:id" element={<Magazine />} />
                    </Routes>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    )
}

export default App
