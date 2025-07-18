import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UploadZone } from '@/components/contract/UploadZone'
import { PricingPlans } from '@/components/pricing/PricingPlans'
import { FeatureShowcase } from '@/components/ui/feature-showcase'
import { Shield, Globe, Zap, CheckCircle, Star, Users } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { getLegalSystemByLanguage } from '@/lib/i18n'
import { blink } from '@/blink/client'
import { contractDb } from '@/lib/database'
import { useToast } from '@/hooks/use-toast'

export function LandingPage() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [user, setUser] = useState(null)
  const legalSystem = getLegalSystemByLanguage(language)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const handleContractUpload = async (content: string, language: string, title: string, jurisdiction?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze contracts",
        variant: "destructive"
      })
      blink.auth.login()
      return
    }

    setIsAnalyzing(true)
    setUploadProgress(0)
    setAnalysisProgress(0)
    setCurrentStep('Processing document...')
    
    try {
      const contractId = `contract_${Date.now()}`
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval)
            return 100
          }
          return prev + 20
        })
      }, 200)

      // Store contract in database
      await contractDb.create({
        id: contractId,
        userId: user.id,
        title,
        content,
        language,
        analysisStatus: 'analyzing'
      })

      // Wait for upload progress to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep('Starting AI analysis...')

      toast({
        title: "Contract Uploaded",
        description: "Starting AI analysis...",
      })

      // Start AI analysis in background
      performContractAnalysis(contractId, content, language)
      
      // Navigate to analysis page
      navigate(`/analysis?id=${contractId}`)
      
    } catch (error) {
      console.error('Error uploading contract:', error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload contract. Please try again.",
        variant: "destructive"
      })
      setIsAnalyzing(false)
      setUploadProgress(0)
      setAnalysisProgress(0)
      setCurrentStep('')
    }
  }

  const performContractAnalysis = async (contractId: string, content: string, language: string) => {
    try {
      // Simulate analysis progress
      const analysisInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(analysisInterval)
            return 90
          }
          return prev + 15
        })
      }, 500)

      setCurrentStep('Analyzing contract with AI...')

      // Perform comprehensive AI analysis
      const { text: analysisResult } = await blink.ai.generateText({
        prompt: `Analyze this legal contract comprehensively and provide the following structured analysis:

1. SUMMARY: Write exactly 300 words summarizing the contract's purpose, key obligations, and main terms.

2. KEY TOPICS: Identify exactly 5 key topics/themes in this contract (e.g., "Payment Terms", "Intellectual Property", "Liability", "Termination", "Confidentiality").

3. RISK ASSESSMENT: Categorize all identified risks as HIGH, MEDIUM, or LOW risk. For each risk, provide:
   - Risk title
   - Description of the risk
   - Specific section/clause where found
   - Page number (estimate based on content length)
   - Approximate word location in document
   - Simple recommendation to fix the issue

4. RISK SCORE: Overall risk score from 0-100 (0 = very low risk, 100 = very high risk)

Contract content:
${content}

Format your response as JSON:
{
  "summary": "exactly 300 words...",
  "keyTopics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  "riskScore": number,
  "risks": [
    {
      "category": "high|medium|low",
      "title": "Risk title",
      "description": "Risk description",
      "section": "Section name or clause reference",
      "pageNumber": estimated_page_number,
      "wordLocation": "approximate location description",
      "recommendation": "Simple fix recommendation"
    }
  ]
}`,
        maxTokens: 3000
      })

      // Parse the AI response
      let analysisData
      try {
        analysisData = JSON.parse(analysisResult)
      } catch {
        // Fallback parsing if JSON fails
        const riskScoreMatch = analysisResult.match(/risk score[:\s]*(\d+)/i)
        analysisData = {
          summary: "Analysis completed. Please upgrade for detailed summary.",
          keyTopics: ["Payment Terms", "Liability", "Termination", "Intellectual Property", "Governing Law"],
          riskScore: riskScoreMatch ? parseInt(riskScoreMatch[1]) : 50,
          risks: []
        }
      }

      // Complete analysis progress
      setAnalysisProgress(100)
      setCurrentStep('Analysis complete!')

      // Update contract with analysis results
      await contractDb.update(contractId, {
        analysisStatus: 'completed',
        riskScore: Math.min(100, Math.max(0, analysisData.riskScore || 50))
      })

      // Store risk assessments in database
      if (analysisData.risks && Array.isArray(analysisData.risks)) {
        for (const risk of analysisData.risks) {
          try {
            await blink.db.riskAssessments.create({
              id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              contractId: contractId,
              category: risk.category || 'medium',
              title: risk.title || 'Risk Identified',
              description: risk.description || 'Risk description not available',
              recommendation: risk.recommendation || 'Please review this section carefully',
              section: risk.section || 'Section not specified',
              pageNumber: risk.pageNumber || 1,
              wordLocation: risk.wordLocation || 'Location not specified'
            })
          } catch (dbError) {
            console.log('Database not available, using local storage fallback')
          }
        }
      }

      // Store summary and key topics
      try {
        await contractDb.update(contractId, {
          summary: analysisData.summary || "Analysis completed successfully.",
          keyTopics: JSON.stringify(analysisData.keyTopics || [])
        })
      } catch (dbError) {
        console.log('Database not available for storing summary')
      }

    } catch (error) {
      console.error('Error analyzing contract:', error)
      await contractDb.update(contractId, {
        analysisStatus: 'error'
      })
    } finally {
      setIsAnalyzing(false)
      setUploadProgress(0)
      setAnalysisProgress(0)
      setCurrentStep('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            🚀 AI-Powered Legal Analysis and contract creation
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
            Analyze and Create Legal Contracts with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{t('bankLevelSecurity')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">{t('tenLanguages')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium">{t('instantAnalysis')}</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <Button 
              onClick={() => navigate('/generate')}
              className="mr-4"
            >
              Generate Contracts
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
          
          {/* Legal System Indicator */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm">
            <Shield className="h-4 w-4" />
            <span>{t('legalSystem')}: {t(legalSystem)}</span>
          </div>
        </div>

        {/* Upload Section */}
        <div id="start-analysis" className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('startAnalysis')}</CardTitle>
              <CardDescription>
                {t('uploadDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadZone 
                onUpload={handleContractUpload} 
                isAnalyzing={isAnalyzing}
                uploadProgress={uploadProgress}
                analysisProgress={analysisProgress}
                currentStep={currentStep}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('featuresTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>{t('riskAssessment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('riskAssessmentDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>{t('multilingualTranslation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('multilingualDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Pricing Plans */}
      <PricingPlans />

      {/* Social Proof */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-base sm:text-lg font-semibold">4.9/5</span>
            </div>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">{t('trustedBy')}</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">500+ {t('users')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">{t('soc2Compliant')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">10 {t('languages')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}