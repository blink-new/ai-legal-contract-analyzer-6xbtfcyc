import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LandingPage } from '@/pages/LandingPage'
import { AnalysisPage } from '@/pages/AnalysisPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ContractGenerationPage } from '@/pages/ContractGenerationPage'
import { SignaturePage } from '@/pages/SignaturePage'
import { PricingPage } from '@/pages/PricingPage'
import { HelpCenterPage } from '@/pages/HelpCenterPage'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { blink } from '@/blink/client'
import { initializeDatabase } from '@/lib/database'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dbInitialized, setDbInitialized] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Initialize database when user is authenticated
      if (state.user && !dbInitialized) {
        initializeDatabase().then((success) => {
          setDbInitialized(success)
        })
      }
    })
    return unsubscribe
  }, [dbInitialized])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/generate" element={<ContractGenerationPage />} />
              <Route path="/signatures" element={<SignaturePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App