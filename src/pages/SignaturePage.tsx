import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PenTool, 
  CheckCircle, 
  Clock, 
  Shield,
  FileText,
  User,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Users,
  Upload,
  Download,
  Eye,
  Send,
  Settings,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Lock,
  Trash2,
  Edit,
  Copy,
  Archive
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { SignatureModal } from '@/components/signature/SignatureModal'
import { SignatureBuilder } from '@/components/signature/SignatureBuilder'
import { SignatureDashboard } from '@/components/signature/SignatureDashboard'
import { blink } from '@/blink/client'

interface SignatureDocument {
  id: string
  title: string
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'declined' | 'expired'
  createdAt: string
  updatedAt: string
  recipients: SignatureRecipient[]
  totalRecipients: number
  completedSignatures: number
  expiresAt?: string
  templateId?: string
  folderId?: string
}

interface SignatureRecipient {
  id: string
  email: string
  name: string
  role: 'signer' | 'approver' | 'viewer' | 'certified_recipient' | 'in_person_signer'
  status: 'pending' | 'viewed' | 'signed' | 'declined' | 'expired'
  signedAt?: string
  authMethod: 'email' | 'sms' | 'access_code' | 'id_verification'
  order?: number
  notes?: string
}

export function SignaturePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [documents, setDocuments] = useState<SignatureDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<SignatureDocument | null>(null)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Get contract ID from URL params if coming from contract generation
  const contractId = searchParams.get('contractId')
  const action = searchParams.get('action') // 'sign' or 'create'

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (user) {
      loadSignatureDocuments()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (contractId && action === 'sign') {
      // Auto-open signature builder for new contracts
      setActiveTab('builder')
      setShowBuilder(true)
    }
  }, [contractId, action])

  const loadSignatureDocuments = async () => {
    try {
      // Mock data for demonstration
      const mockDocuments: SignatureDocument[] = [
        {
          id: 'doc_1',
          title: 'Software Development Agreement',
          status: 'in_progress',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          recipients: [
            {
              id: 'rec_1',
              email: 'client@example.com',
              name: 'John Client',
              role: 'signer',
              status: 'signed',
              signedAt: '2024-01-16T14:30:00Z',
              authMethod: 'email',
              order: 1
            },
            {
              id: 'rec_2',
              email: 'legal@company.com',
              name: 'Legal Team',
              role: 'approver',
              status: 'pending',
              authMethod: 'email',
              order: 2
            }
          ],
          totalRecipients: 2,
          completedSignatures: 1,
          expiresAt: '2024-02-15T10:00:00Z'
        },
        {
          id: 'doc_2',
          title: 'NDA - Confidentiality Agreement',
          status: 'completed',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-12T16:45:00Z',
          recipients: [
            {
              id: 'rec_3',
              email: 'partner@startup.com',
              name: 'Partner Company',
              role: 'signer',
              status: 'signed',
              signedAt: '2024-01-12T16:45:00Z',
              authMethod: 'email',
              order: 1
            }
          ],
          totalRecipients: 1,
          completedSignatures: 1
        },
        {
          id: 'doc_3',
          title: 'Employment Contract - Senior Developer',
          status: 'sent',
          createdAt: '2024-01-18T11:00:00Z',
          updatedAt: '2024-01-18T11:00:00Z',
          recipients: [
            {
              id: 'rec_4',
              email: 'newdev@email.com',
              name: 'New Developer',
              role: 'signer',
              status: 'pending',
              authMethod: 'email',
              order: 1
            }
          ],
          totalRecipients: 1,
          completedSignatures: 0,
          expiresAt: '2024-02-18T11:00:00Z'
        }
      ]
      
      setDocuments(mockDocuments)
    } catch (error) {
      console.error('Failed to load signature documents:', error)
      toast({
        title: "Error",
        description: "Failed to load signature documents",
        variant: "destructive"
      })
    }
  }

  const handleCreateDocument = () => {
    setActiveTab('builder')
    setShowBuilder(true)
  }

  const handleDocumentAction = (documentId: string, action: string) => {
    const document = documents.find(d => d.id === documentId)
    if (!document) return

    switch (action) {
      case 'view':
        setSelectedDocument(document)
        setActiveTab('builder')
        break
      case 'send':
        toast({
          title: "Document Sent",
          description: `${document.title} has been sent to recipients`,
        })
        break
      case 'remind':
        toast({
          title: "Reminder Sent",
          description: "Reminder emails have been sent to pending recipients",
        })
        break
      case 'duplicate':
        toast({
          title: "Document Duplicated",
          description: "A copy of the document has been created",
        })
        break
      case 'archive':
        toast({
          title: "Document Archived",
          description: "Document has been moved to archive",
        })
        break
      case 'delete':
        setDocuments(prev => prev.filter(d => d.id !== documentId))
        toast({
          title: "Document Deleted",
          description: "Document has been permanently deleted",
        })
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'sent': return <Send className="h-4 w-4" />
      case 'declined': return <AlertTriangle className="h-4 w-4" />
      case 'expired': return <AlertTriangle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <PenTool className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Please sign in to access signature features
            </p>
            <Button onClick={() => blink.auth.login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold flex items-center space-x-2">
                  <PenTool className="h-6 w-6 text-blue-600" />
                  <span>Signature Tool</span>
                </h1>
                <p className="text-gray-600">
                  Create, send, and manage signature documents
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>ESIGN Compliant</span>
              </Badge>
              <Button onClick={handleCreateDocument}>
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="builder">Document Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Signature Documents</h2>
                <p className="text-gray-600">Manage and track your signature requests</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Documents</p>
                      <p className="text-2xl font-bold">{documents.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {documents.filter(d => d.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {documents.filter(d => d.status === 'in_progress').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {documents.filter(d => d.status === 'sent').length}
                      </p>
                    </div>
                    <Send className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{document.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{document.completedSignatures}/{document.totalRecipients} signed</span>
                            {document.expiresAt && (
                              <>
                                <span>•</span>
                                <span>Expires {new Date(document.expiresAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(document.status)} flex items-center space-x-1`}>
                          {getStatusIcon(document.status)}
                          <span className="capitalize">{document.status.replace('_', ' ')}</span>
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDocumentAction(document.id, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {document.status === 'in_progress' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDocumentAction(document.id, 'remind')}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDocumentAction(document.id, 'duplicate')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDocumentAction(document.id, 'delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No documents found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Create your first signature document to get started'
                        }
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button onClick={handleCreateDocument}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <SignatureBuilder 
              contractId={contractId}
              selectedDocument={selectedDocument}
              onDocumentSaved={(document) => {
                setDocuments(prev => [...prev, document])
                setActiveTab('dashboard')
                toast({
                  title: "Document Created",
                  description: "Your signature document has been created successfully",
                })
              }}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Signature Templates</h3>
              <p className="text-gray-600 mb-4">
                Save frequently used documents as templates for quick reuse
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          contractId={contractId || 'demo'}
          contractTitle="Sample Contract"
          userPlan="basic"
          onStartSigning={() => {
            setShowSignatureModal(false)
            setActiveTab('builder')
          }}
        />
      )}
    </div>
  )
}