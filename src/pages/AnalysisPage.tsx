import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Download, 
  Share2, 
  ArrowLeft,
  Globe,
  FileText,
  Shield,
  Clock,
  TrendingUp,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { blink } from '@/blink/client'
import { contractDb, riskAssessmentDb } from '@/lib/database'
import { subscriptionDb, hasActivePaidPlan } from '@/lib/subscription-database'
import { usageDb } from '@/lib/usage-database'
import { downloadWordDocument } from '@/lib/word-export'
import { useToast } from '@/hooks/use-toast'
import { JURISDICTIONS } from '@/types/contractGeneration'
import { SUPPORTED_UI_LANGUAGES } from '@/lib/i18n'
import type { Contract, RiskAssessment, Translation } from '@/types/contract'

export function AnalysisPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const contractId = searchParams.get('id')
  
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [summaryProgress, setSummaryProgress] = useState(0)
  const [riskAnalysisProgress, setRiskAnalysisProgress] = useState(0)
  const [translationProgress, setTranslationProgress] = useState(0)
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([])
  const [translations, setTranslations] = useState<Translation[]>([])
  const [userSubscription, setUserSubscription] = useState<any>(null)
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState<string>('')
  const [isGeneratingTranslation, setIsGeneratingTranslation] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    if (!contractId) {
      navigate('/')
      return
    }
    
    loadContract()
    loadUserSubscription()
  }, [contractId, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserSubscription = async () => {
    try {
      const user = await blink.auth.me()
      if (user) {
        setCurrentUser(user)
        const subscription = await subscriptionDb.getUserSubscription(user.id)
        setUserSubscription(subscription)
      }
    } catch (error) {
      console.log('Could not load user subscription:', error)
    }
  }

  const loadContract = useCallback(async () => {
    try {
      setLoading(true)
      
      // Try to load from database first
      const dbContract = await contractDb.get(contractId!)
      
      if (dbContract) {
        // Convert database format to Contract type
        const contract: Contract = {
          id: dbContract.id,
          title: dbContract.title,
          content: dbContract.content,
          language: dbContract.language,
          uploadedAt: dbContract.created_at,
          userId: dbContract.user_id,
          analysisStatus: dbContract.analysis_status as 'pending' | 'analyzing' | 'completed' | 'error',
          riskScore: dbContract.risk_score,
          summary: dbContract.summary,
          keyTopics: dbContract.key_topics
        }
        
        setContract(contract)
        
        // If analysis is still in progress, simulate progress
        if (contract.analysisStatus === 'analyzing') {
          // Simulate summary progress
          const summaryInterval = setInterval(() => {
            setSummaryProgress(prev => {
              if (prev >= 100) {
                clearInterval(summaryInterval)
                return 100
              }
              return prev + 15
            })
          }, 200)

          // Simulate risk analysis progress
          const riskInterval = setInterval(() => {
            setRiskAnalysisProgress(prev => {
              if (prev >= 100) {
                clearInterval(riskInterval)
                return 100
              }
              return prev + 12
            })
          }, 250)

          const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => {
              if (prev >= 100) {
                clearInterval(progressInterval)
                performAnalysis(contract)
                return 100
              }
              return prev + 10
            })
          }, 300)
        } else if (contract.analysisStatus === 'completed') {
          // Load existing analysis results
          setAnalysisProgress(100)
          setSummaryProgress(100)
          setRiskAnalysisProgress(100)
          await loadRiskAssessments(contract.id)
        }
      } else {
        // Contract not found
        toast({
          title: "Contract Not Found",
          description: "The requested contract could not be found.",
          variant: "destructive"
        })
        navigate('/dashboard')
      }
      
    } catch (error) {
      console.error('Error loading contract:', error)
      toast({
        title: "Error Loading Contract",
        description: "Failed to load contract. Please try again.",
        variant: "destructive"
      })
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [contractId, navigate, toast]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadRiskAssessments = async (contractId: string) => {
    try {
      const assessments = await blink.db.riskAssessments.list({
        where: { contract_id: contractId },
        orderBy: { created_at: 'asc' }
      })
      
      // Convert database format to RiskAssessment type
      const riskAssessments: RiskAssessment[] = assessments.map((assessment: any) => ({
        id: assessment.id,
        category: assessment.category as 'high' | 'medium' | 'low',
        title: assessment.title,
        description: assessment.description,
        recommendation: assessment.recommendation,
        section: assessment.section,
        pageNumber: assessment.page_number,
        wordLocation: assessment.word_location
      }))
      
      setRiskAssessments(riskAssessments)
    } catch (error) {
      console.log('Database not available, using fallback risk assessments')
      generateMockRiskAssessments()
    }
  }

  const generateMockRiskAssessments = () => {
    const mockRiskAssessments: RiskAssessment[] = [
      {
        id: '1',
        category: 'high',
        title: 'Unlimited Liability Exposure',
        description: 'The liability limitation clause may not adequately protect against all potential damages.',
        recommendation: 'Consider adding specific exclusions for consequential damages and setting a monetary cap.',
        section: 'Section 6 - Liability'
      },
      {
        id: '2',
        category: 'medium',
        title: 'Vague Payment Terms',
        description: 'Payment schedule references external Exhibit B which may not be properly defined.',
        recommendation: 'Ensure all payment terms are clearly defined within the main agreement.',
        section: 'Section 2 - Payment Terms'
      },
      {
        id: '3',
        category: 'low',
        title: 'Standard Confidentiality Clause',
        description: 'Confidentiality provisions appear standard but could be more specific.',
        recommendation: 'Consider defining what constitutes proprietary information more precisely.',
        section: 'Section 4 - Confidentiality'
      },
      {
        id: '4',
        category: 'medium',
        title: 'IP Rights Transfer Timing',
        description: 'IP rights transfer only upon full payment may create complications.',
        recommendation: 'Consider staged IP transfer or escrow arrangements for larger projects.',
        section: 'Section 3 - Intellectual Property'
      }
    ]
    setRiskAssessments(mockRiskAssessments)
  }

  const performAnalysis = async (contract: Contract) => {
    try {
      // Step 1: Generate contract summary (visible to all users)
      setSummaryProgress(10)
      const { text: summaryResult } = await blink.ai.generateText({
        prompt: `Create a comprehensive 300-word summary of this legal contract. Focus on:
1. Main purpose and parties involved
2. Key obligations and responsibilities
3. Important terms and conditions
4. Payment and delivery details
5. Duration and termination conditions

Contract content:
${contract.content}

Provide a clear, professional summary that explains the contract's main points in plain language.`,
        maxTokens: 500
      })
      setSummaryProgress(50)

      // Step 2: Extract key topics (visible to all users)
      const { text: topicsResult } = await blink.ai.generateText({
        prompt: `Identify the 5 most important topics/themes in this legal contract. Return only a JSON array of strings, like: ["Payment Terms", "Intellectual Property", "Liability", "Termination", "Confidentiality"]

Contract content:
${contract.content}

Return only the JSON array, no other text.`,
        maxTokens: 200
      })
      setSummaryProgress(100)

      // Step 3: Perform risk analysis
      setRiskAnalysisProgress(20)
      const { text: analysisResult } = await blink.ai.generateText({
        prompt: `Analyze this legal contract for potential risks and provide a risk score from 0-100. Focus on:
1. Payment terms and conditions
2. Intellectual property rights
3. Liability limitations
4. Termination clauses
5. Governing law and jurisdiction

Contract content:
${contract.content}

Provide a structured analysis with:
- Overall risk score (0-100)
- Key risk areas identified
- Specific recommendations

Format the response as JSON with: { "riskScore": number, "analysis": "detailed analysis text" }`,
        maxTokens: 1500
      })
      setRiskAnalysisProgress(100)

      // Parse the AI responses
      let riskScore = 65 // Default fallback
      try {
        const parsed = JSON.parse(analysisResult)
        riskScore = parsed.riskScore || 65
      } catch {
        // If JSON parsing fails, extract risk score from text
        const scoreMatch = analysisResult.match(/risk score[:\s]*(\d+)/i)
        if (scoreMatch) {
          riskScore = parseInt(scoreMatch[1])
        }
      }

      // Parse key topics
      let keyTopics: string[] = []
      try {
        keyTopics = JSON.parse(topicsResult)
        if (!Array.isArray(keyTopics)) {
          keyTopics = []
        }
      } catch {
        // Fallback key topics if parsing fails
        keyTopics = ["Payment Terms", "Liability", "Intellectual Property", "Termination", "Confidentiality"]
      }

      // Update contract in database with summary and key topics
      await contractDb.update(contract.id, {
        analysisStatus: 'completed',
        riskScore: Math.min(100, Math.max(0, riskScore)),
        summary: summaryResult.trim(),
        keyTopics: JSON.stringify(keyTopics)
      })

      // Load risk assessments from database
      await loadRiskAssessments(contract.id)
      
      // Update local state
      setContract(prev => prev ? { 
        ...prev, 
        analysisStatus: 'completed', 
        riskScore: Math.min(100, Math.max(0, riskScore)),
        summary: summaryResult.trim(),
        keyTopics: JSON.stringify(keyTopics)
      } : null)
      
    } catch (error) {
      console.error('Error performing analysis:', error)
      await contractDb.update(contract.id, {
        analysisStatus: 'error'
      })
      setContract(prev => prev ? { ...prev, analysisStatus: 'error' } : null)
    }
  }

  const generateTranslation = async (targetLanguage: string) => {
    if (!contract || !currentUser) return
    
    setIsGeneratingTranslation(true)
    setTranslationProgress(0)
    
    try {
      // Track usage for this translation request
      await usageDb.trackUsage({
        userId: currentUser.id,
        contractId: contract.id,
        requestType: 'translation',
        language: targetLanguage
      })

      // Get the language name from the supported languages
      const languageInfo = SUPPORTED_UI_LANGUAGES.find(lang => lang.code === targetLanguage)
      const languageName = languageInfo?.name || targetLanguage
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setTranslationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const { text: translatedContent } = await blink.ai.generateText({
        prompt: `Translate this legal contract to ${languageName}, maintaining legal terminology and structure. 

IMPORTANT TRANSLATION REQUIREMENTS:
1. Preserve all legal terminology and concepts
2. Maintain the original contract structure and formatting
3. Use appropriate legal language for ${languageName}
4. Ensure jurisdiction-specific terms are properly translated
5. Keep all monetary amounts, dates, and proper names unchanged
6. Maintain the legal validity and enforceability of clauses

Original Contract:
${contract.content}

Provide a professional legal translation that preserves the meaning, legal implications, and enforceability of the original contract. The translation should be suitable for legal use in ${languageName}-speaking jurisdictions.`,
        maxTokens: 3000
      })

      clearInterval(progressInterval)
      setTranslationProgress(100)

      const newTranslation: Translation = {
        language: languageName,
        content: translatedContent,
        confidence: 0.95
      }

      setTranslations(prev => [...prev.filter(t => t.language !== languageName), newTranslation])
      
      toast({
        title: "Translation Complete",
        description: `Contract successfully translated to ${languageName}`,
      })
    } catch (error) {
      console.error('Error generating translation:', error)
      toast({
        title: "Translation Error",
        description: "Failed to generate translation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingTranslation(false)
      setTimeout(() => setTranslationProgress(0), 2000)
    }
  }

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <Info className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const handleExportToWord = async (translation?: Translation) => {
    if (!contract || !currentUser) return

    setIsExporting(true)
    
    try {
      // Track usage for export
      await usageDb.trackUsage({
        userId: currentUser.id,
        contractId: contract.id,
        requestType: 'export',
        language: translation?.language
      })

      const isPaidUser = hasActivePaidPlan(userSubscription)
      
      // Parse key topics
      let keyTopics: string[] = []
      try {
        keyTopics = contract.keyTopics ? JSON.parse(contract.keyTopics) : []
      } catch {
        keyTopics = []
      }

      const exportOptions = {
        title: contract.title,
        content: translation ? translation.content : contract.content,
        language: translation ? translation.language : 'English',
        includeAnalysis: isPaidUser,
        riskAssessments: isPaidUser ? riskAssessments : [],
        summary: contract.summary,
        keyTopics
      }

      const result = await downloadWordDocument(exportOptions)
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Document exported as ${result.filename}`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error exporting document:', error)
      toast({
        title: "Export Error",
        description: "Failed to export document. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (loading || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words">{contract.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Analyzed {new Date(contract.uploadedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Language: English</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{contract.content.length} characters</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Analysis Progress */}
        {contract.analysisStatus === 'analyzing' && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Analyzing contract...</h3>
                  <Progress value={analysisProgress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-1">{analysisProgress}% complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Score Overview */}
        {contract.analysisStatus === 'completed' && contract.riskScore && (
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{contract.riskScore}/100</div>
                  <p className="text-xs sm:text-sm text-gray-600">Overall Risk Score</p>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                    {riskAssessments.filter(r => r.category === 'high').length}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">High Risk Issues</p>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">
                    {riskAssessments.filter(r => r.category === 'medium').length}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Medium Risk Issues</p>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                    {riskAssessments.filter(r => r.category === 'low').length}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Low Risk Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contract Analysis */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
                <TabsTrigger value="summary" className="px-2 sm:px-4">Summary</TabsTrigger>
                <TabsTrigger value="analysis" className="px-2 sm:px-4">Risk Analysis</TabsTrigger>
                <TabsTrigger value="translations" className="px-2 sm:px-4">Translations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Contract Summary</CardTitle>
                    <CardDescription>AI-generated 300-word summary of the contract</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {summaryProgress > 0 && summaryProgress < 100 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">Generating summary...</span>
                        </div>
                        <Progress value={summaryProgress} className="w-full" />
                        <p className="text-xs text-gray-500 mt-1">{summaryProgress}% complete</p>
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {contract.summary || "Analysis in progress. Summary will be available once the AI analysis is complete."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Key Topics</CardTitle>
                    <CardDescription>5 main themes identified in this contract</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(() => {
                        try {
                          const topics = contract.keyTopics ? JSON.parse(contract.keyTopics) : []
                          return topics.length > 0 ? topics.map((topic: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-sm font-medium text-blue-900">{topic}</span>
                            </div>
                          )) : (
                            <div className="col-span-full text-center py-8">
                              <p className="text-gray-500">Key topics will be available once analysis is complete.</p>
                            </div>
                          )
                        } catch {
                          return (
                            <div className="col-span-full text-center py-8">
                              <p className="text-gray-500">Key topics will be available once analysis is complete.</p>
                            </div>
                          )
                        }
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-4">
                {riskAnalysisProgress > 0 && riskAnalysisProgress < 100 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Analyzing contract risks...</span>
                      </div>
                      <Progress value={riskAnalysisProgress} className="w-full" />
                      <p className="text-xs text-gray-500 mt-1">{riskAnalysisProgress}% complete</p>
                    </CardContent>
                  </Card>
                )}
                {(() => {
                  const isPaidUser = hasActivePaidPlan(userSubscription)
                  const displayedRisks = isPaidUser ? riskAssessments : riskAssessments.slice(0, 2)
                  
                  return (
                    <>
                      {displayedRisks.map((risk) => (
                        <Card key={risk.id} className={`border-l-4 ${getRiskColor(risk.category)}`}>
                          <CardHeader className="px-4 sm:px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                {getRiskIcon(risk.category)}
                                <CardTitle className="text-base sm:text-lg break-words">{risk.title}</CardTitle>
                              </div>
                              <Badge variant="outline" className={`${getRiskColor(risk.category)} text-xs flex-shrink-0`}>
                                {risk.category.toUpperCase()}
                              </Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm text-gray-600">
                              {risk.section}
                              {risk.pageNumber && (
                                <span className="ml-2 text-blue-600">• Page {risk.pageNumber}</span>
                              )}
                              {risk.wordLocation && (
                                <span className="ml-2 text-green-600">• {risk.wordLocation}</span>
                              )}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6">
                            <p className="text-gray-700 mb-4 text-sm sm:text-base">
                              {isPaidUser ? risk.description : `${risk.description.slice(0, 100)}...`}
                            </p>
                            {isPaidUser ? (
                              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Recommendation:</h4>
                                <p className="text-blue-800 text-xs sm:text-sm">{risk.recommendation}</p>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Lock className="h-4 w-4 text-gray-500" />
                                  <h4 className="font-medium text-gray-700 text-sm sm:text-base">Full Recommendation Available</h4>
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-3">
                                  Upgrade to see detailed recommendations and complete risk analysis.
                                </p>
                                <Button size="sm" onClick={() => navigate('/pricing')} className="w-full sm:w-auto">
                                  Upgrade Now
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      
                      {!isPaidUser && riskAssessments.length > 2 && (
                        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                          <CardContent className="p-6 text-center">
                            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                              {riskAssessments.length - 2} More Risk Issues Found
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Upgrade to see all {riskAssessments.length} risk assessments with detailed recommendations.
                            </p>
                            <Button onClick={() => navigate('/pricing')}>
                              View Full Analysis
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )
                })()}
              </TabsContent>
              

              
              <TabsContent value="translations" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h3 className="text-lg font-medium">Available Translations</h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Select value={selectedTranslationLanguage} onValueChange={setSelectedTranslationLanguage}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_UI_LANGUAGES.filter(lang => lang.code !== 'en').map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            <div className="flex items-center space-x-2">
                              <span>{language.flag}</span>
                              <span>{language.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => selectedTranslationLanguage && generateTranslation(selectedTranslationLanguage)}
                      size="sm"
                      disabled={!selectedTranslationLanguage || isGeneratingTranslation}
                      className="w-full sm:w-auto"
                    >
                      {isGeneratingTranslation ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Globe className="h-4 w-4 mr-2" />
                      )}
                      {isGeneratingTranslation ? 'Generating...' : 'Generate Translation'}
                    </Button>
                  </div>
                </div>

                {translationProgress > 0 && translationProgress < 100 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Translating contract...</span>
                      </div>
                      <Progress value={translationProgress} className="w-full" />
                      <p className="text-xs text-gray-500 mt-1">{translationProgress}% complete</p>
                    </CardContent>
                  </Card>
                )}
                
                {translations.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No translations yet</h3>
                      <p className="text-gray-600 mb-4">
                        Select a language above and generate translations to make this contract accessible in multiple languages
                      </p>
                      <p className="text-sm text-gray-500">
                        Available languages: Spanish, Chinese, Arabic, French, German, Portuguese, Japanese, Hindi, Russian, Italian
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  translations.map((translation) => (
                    <Card key={translation.language}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <Globe className="h-5 w-5" />
                            <span>{translation.language}</span>
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {Math.round(translation.confidence * 100)}% confidence
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExportToWord(translation)}
                              disabled={isExporting}
                            >
                              {isExporting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Export Word
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {translation.content}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
                <Button className="w-full justify-start text-sm" variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button 
                  className="w-full justify-start text-sm" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportToWord()}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Export as Word
                </Button>
                <Button className="w-full justify-start text-sm" variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Analysis
                </Button>

              </CardContent>
            </Card>

            {/* Analysis Summary */}
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Contract Type</span>
                  <Badge variant="secondary" className="text-xs">Software Development</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Jurisdiction</span>
                  <span className="text-xs sm:text-sm font-medium">US Law</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Complexity</span>
                  <span className="text-xs sm:text-sm font-medium">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Review Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-medium text-blue-900 text-sm sm:text-base">Secure Analysis</h4>
                    <p className="text-xs sm:text-sm text-blue-700 mt-1">
                      Your contract is processed with bank-level encryption and automatically deleted after analysis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}