import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StarField from './components/StarField'
import LandingPage from './pages/LandingPage'
import ProductsPage from './pages/ProductsPage'
import ATSCheckerPage from './pages/tools/ATSCheckerPage'
import InterviewQGenPage from './pages/tools/InterviewQGenPage'
import MockInterviewPage from './pages/tools/MockInterviewPage'
import LinkedInOptimizerPage from './pages/tools/LinkedInOptimizerPage'
import EmailGeneratorPage from './pages/tools/EmailGeneratorPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative min-h-screen flex flex-col">

          {/* ── Galaxy Background Layers ── */}
          <div className="galaxy-bg" />
          <StarField />
          <div className="nebula-orb nebula-orb-1" style={{ zIndex: 1 }} />
          <div className="nebula-orb nebula-orb-2" style={{ zIndex: 1 }} />
          <div className="nebula-orb nebula-orb-3" style={{ zIndex: 1 }} />

          {/* ── App Shell ── */}
          <Navbar />
          <main className="relative z-10 flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/tools/ats-checker" element={<ATSCheckerPage />} />
              <Route path="/tools/interview-questions" element={<InterviewQGenPage />} />
              <Route path="/tools/mock-interview" element={<MockInterviewPage />} />
              <Route path="/tools/linkedin-optimizer" element={<LinkedInOptimizerPage />} />
              <Route path="/tools/email-generator" element={<EmailGeneratorPage />} />
            </Routes>
          </main>
          <Footer />

        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
