import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreditCheckout from './pages/CreditCheckout'
import SpaceDetail from './pages/SpaceDetail'
import Subscribe from './pages/Subscribe'
import { LanguageProvider } from './context/LanguageContext'

function App() {
    return (
        <LanguageProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/space/:id" element={<SpaceDetail />} />
                    <Route path="/credits" element={<CreditCheckout />} />
                    <Route path="/subscribe" element={<Subscribe />} />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App
