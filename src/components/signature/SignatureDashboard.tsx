import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Calendar
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { signatureDb } from '@/lib/signature-database'
import type { SignatureDocument } from '@/types/signature'
import { blink } from '@/blink/client'

interface SignatureDashboardProps {
  userId: string
}

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600'
}

const STATUS_ICONS = {
  draft: FileText,
  sent: Clock,
  in_progress: Clock,
  completed: CheckCircle,
  declined: XCircle,
  expired: XCircle
}

export function SignatureDashboard({ userId }: SignatureDashboardProps) {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<SignatureDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadDocuments()
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await signatureDb.getUserDocuments(userId)
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to load signature documents:', error)
      toast({
        title: "Error",
        description: "Failed to load signature documents",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'pending' && ['sent', 'in_progress'].includes(doc.status)) ||
      (activeTab === 'completed' && doc.status === 'completed') ||
      (activeTab === 'drafts' && doc.status === 'draft')
    
    return matchesSearch && matchesStatus && matchesTab
  })

  const getStatusCounts = () => {
    return {
      all: documents.length,
      pending: documents.filter(d => ['sent', 'in_progress'].includes(d.status)).length,
      completed: documents.filter(d => d.status === 'completed').length,
      drafts: documents.filter(d => d.status === 'draft').length
    }
  }

  const handleViewDocument = (doc: SignatureDocument) => {
    // TODO: Open document viewer
    toast({
      title: "Document Viewer",
      description: "Opening document viewer..."
    })
  }

  const handleDownloadDocument = async (doc: SignatureDocument) => {
    try {
      // TODO: Generate and download PDF with signatures
      toast({
        title: "Download Started",
        description: "Preparing document for download..."
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download document",
        variant: "destructive"
      })
    }
  }

  const handleResendReminder = async (doc: SignatureDocument) => {
    try {
      // TODO: Send reminder emails to pending recipients
      toast({
        title: "Reminders Sent",
        description: "Reminder emails sent to pending recipients"
      })
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Unable to send reminder emails",
        variant: "destructive"
      })
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signature documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Signature Documents</h2>
          <p className="text-gray-600">Manage and track your signature requests</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({statusCounts.drafts})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No documents found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Create your first signature document to get started'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Document
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => {
                const StatusIcon = STATUS_ICONS[doc.status]
                const completedRecipients = doc.recipients.filter(r => r.status === 'completed' || r.status === 'signed').length
                const totalRecipients = doc.recipients.length
                
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <StatusIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {doc.name}
                              </h3>
                              <Badge className={STATUS_COLORS[doc.status]}>
                                {doc.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{completedRecipients}/{totalRecipients} signed</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                              </div>
                              
                              {doc.completedAt && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>Completed {new Date(doc.completedAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Progress Bar */}
                            {totalRecipients > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Signing Progress</span>
                                  <span>{Math.round((completedRecipients / totalRecipients) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(completedRecipients / totalRecipients) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {doc.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDocument(doc)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              {['sent', 'in_progress'].includes(doc.status) && (
                                <DropdownMenuItem onClick={() => handleResendReminder(doc)}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Send Reminder
                                </DropdownMenuItem>
                              )}
                              
                              {doc.status === 'completed' && (
                                <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}