import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Trash2
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { blink } from '@/blink/client'
import { contractDb, initializeDatabase } from '@/lib/database'
import { useToast } from '@/hooks/use-toast'
import type { Contract } from '@/types/contract'

export function DashboardPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'analyzing' | 'error'>('all')
  const [isLocalStorageMode, setIsLocalStorageMode] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      if (state.user) {
        // Initialize database first, then load contracts
        await initializeDatabase()
        loadContracts(state.user)
      }
    })
    return unsubscribe
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadContracts = async (currentUser = user) => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      const dbContracts = await contractDb.list(currentUser.id)
      
      // Check if we're using localStorage fallback by checking if data comes from localStorage
      const localStorageData = localStorage.getItem('blink_contracts')
      const isUsingLocalStorage = !!localStorageData
      setIsLocalStorageMode(isUsingLocalStorage)
      
      // Convert database format to Contract type
      const formattedContracts: Contract[] = dbContracts.map(contract => ({
        id: contract.id,
        title: contract.title,
        content: contract.content,
        language: contract.language,
        uploadedAt: contract.created_at,
        userId: contract.user_id,
        analysisStatus: contract.analysis_status as 'pending' | 'analyzing' | 'completed' | 'error',
        riskScore: contract.risk_score
      }))
      
      setContracts(formattedContracts)
      
      // If no contracts found, show demo contracts for first-time users
      if (formattedContracts.length === 0) {
        const demoContracts: Contract[] = [
          {
            id: 'demo_1',
            title: 'Software Development Agreement (Demo)',
            content: `SOFTWARE DEVELOPMENT AGREEMENT

This Software Development Agreement ("Agreement") is entered into on [DATE] between [CLIENT NAME] ("Client") and [DEVELOPER NAME] ("Developer").

1. SCOPE OF WORK
Developer agrees to develop custom software according to specifications outlined in Exhibit A.

2. PAYMENT TERMS
Client agrees to pay Developer a total fee of $[AMOUNT] according to the following schedule:
- 50% upon signing this agreement
- 25% upon completion of development phase
- 25% upon final delivery and acceptance

3. INTELLECTUAL PROPERTY
All intellectual property rights in the developed software shall transfer to Client upon full payment.

4. LIABILITY
Developer's liability shall be limited to the total amount paid under this agreement.

5. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

6. TERMINATION
Either party may terminate this agreement with 30 days written notice.`,
            language: 'en',
            uploadedAt: new Date(Date.now() - 86400000).toISOString(),
            userId: currentUser.id,
            analysisStatus: 'completed',
            riskScore: 75
          },
          {
            id: 'demo_2',
            title: 'Non-Disclosure Agreement (Demo)',
            content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between [PARTY A] and [PARTY B].

1. CONFIDENTIAL INFORMATION
Confidential Information includes all technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.

2. OBLIGATIONS
The receiving party agrees to:
- Hold all Confidential Information in strict confidence
- Not disclose any Confidential Information to third parties
- Use Confidential Information solely for evaluation purposes

3. TERM
This Agreement shall remain in effect for a period of 5 years from the date of execution.

4. RETURN OF MATERIALS
Upon termination, all materials containing Confidential Information must be returned or destroyed.`,
            language: 'en',
            uploadedAt: new Date(Date.now() - 172800000).toISOString(),
            userId: currentUser.id,
            analysisStatus: 'completed',
            riskScore: 45
          }
        ]
        setContracts(demoContracts)
      }
    } catch (error) {
      // This should rarely happen since contractDb.list handles fallbacks gracefully
      console.info('Using local storage mode for data persistence')
      setIsLocalStorageMode(true)
      // Set empty contracts array if there's an error
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || contract.analysisStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'analyzing': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleDeleteContract = async (contractId: string) => {
    try {
      await contractDb.delete(contractId)
      setContracts(prev => prev.filter(c => c.id !== contractId))
      toast({
        title: "Contract Deleted",
        description: "Contract has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting contract:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete contract. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    total: contracts.length,
    completed: contracts.filter(c => c.analysisStatus === 'completed').length,
    analyzing: contracts.filter(c => c.analysisStatus === 'analyzing').length,
    avgRiskScore: contracts.filter(c => c.riskScore).reduce((acc, c) => acc + (c.riskScore || 0), 0) / contracts.filter(c => c.riskScore).length || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Welcome back! Here's an overview of your contract analysis activity.
              </p>
              {isLocalStorageMode && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                    💾 Secure Local Mode - Your data is private and saved locally
                  </Badge>
                </div>
              )}
            </div>
            <Button onClick={() => navigate('/')} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Contracts</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Analyzing</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.analyzing}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Avg Risk Score</p>
                  <p className={`text-xl sm:text-2xl font-bold ${getRiskColor(stats.avgRiskScore)}`}>
                    {stats.avgRiskScore.toFixed(0)}
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contracts">Recent Contracts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contracts" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contracts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-w-0"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="analyzing">Analyzing</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contracts List */}
            <div className="space-y-4">
              {filteredContracts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No contracts found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Get started by analyzing your first contract'
                      }
                    </p>
                    <Button onClick={() => navigate('/')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Analyze Contract
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredContracts.map((contract) => (
                  <Card key={contract.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h3 className="text-base sm:text-lg font-medium truncate">{contract.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getStatusColor(contract.analysisStatus)} text-xs`}>
                                {contract.analysisStatus}
                              </Badge>
                              {contract.riskScore && (
                                <Badge variant="outline" className={`${getRiskColor(contract.riskScore)} text-xs`}>
                                  Risk: {contract.riskScore}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                            <span>Language: {contract.language.toUpperCase()}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Uploaded {new Date(contract.uploadedAt).toLocaleDateString()}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{contract.content.length} characters</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                          {contract.analysisStatus === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/analysis?id=${contract.id}`)}
                              className="hidden sm:flex"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          )}
                          {contract.analysisStatus === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/analysis?id=${contract.id}`)}
                              className="sm:hidden"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Download contract as text file
                              const blob = new Blob([contract.content], { type: 'text/plain' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${contract.title}.txt`
                              a.click()
                              URL.revokeObjectURL(url)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContract(contract.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Usage Analytics</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Overview of your contract analysis activity
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4 text-sm sm:text-base">Analysis Status Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm">Completed</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{stats.completed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm">Analyzing</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{stats.analyzing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm">Error</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {contracts.filter(c => c.analysisStatus === 'error').length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4 text-sm sm:text-base">Risk Score Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                          <span className="text-xs sm:text-sm">High Risk (70+)</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {contracts.filter(c => (c.riskScore || 0) >= 70).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          <span className="text-xs sm:text-sm">Medium Risk (40-69)</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {contracts.filter(c => (c.riskScore || 0) >= 40 && (c.riskScore || 0) < 70).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          <span className="text-xs sm:text-sm">Low Risk (0-39)</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {contracts.filter(c => (c.riskScore || 0) < 40 && c.riskScore).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}