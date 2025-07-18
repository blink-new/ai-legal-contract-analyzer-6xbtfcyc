import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Eye, 
  Lock, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  Shield,
  Globe,
  Users,
  Share2
} from 'lucide-react'
import { JURISDICTIONS } from '@/types/contractGeneration'
import type { GeneratedContract } from '@/types/contractGeneration'

interface ContractPreviewProps {
  contract: GeneratedContract
  onPurchase: () => void
  onDownload: (format: 'pdf' | 'docx') => void
}

export function ContractPreview({ contract, onPurchase, onDownload }: ContractPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview')
  
  const jurisdiction = JURISDICTIONS.find(j => j.code === contract.jurisdiction)
  const isPurchased = contract.status === 'purchased'
  
  // Split content into words for preview limitation (120 words)
  const contentWords = contract.content.split(' ')
  const previewWords = isPurchased ? contentWords : contentWords.slice(0, 120) // Show first 120 words
  const previewContent = previewWords.join(' ') + (!isPurchased && contentWords.length > 120 ? '...' : '')
  
  const isContentTruncated = !isPurchased && contentWords.length > 120

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>{contract.title}</span>
                  </CardTitle>
                  <CardDescription>
                    Generated on {new Date(contract.generatedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!isPurchased && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      <Lock className="h-3 w-3 mr-1" />
                      Preview Only
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {jurisdiction?.flag} {jurisdiction?.name}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Document Preview</TabsTrigger>
                  <TabsTrigger value="risk">Risk Summary</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="space-y-4">
                  <div className="relative">
                    <div className="bg-white border rounded-lg p-6 min-h-[600px] font-mono text-sm leading-relaxed">
                      <pre className="whitespace-pre-wrap">{previewContent}</pre>
                      
                      {isContentTruncated && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-6">
                          <Alert>
                            <Lock className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-center justify-between">
                                <span>
                                  Preview limited to first 120 words. Purchase to view complete document ({contract.pageCount} pages).
                                </span>
                                <Button size="sm" onClick={onPurchase}>
                                  Purchase Now
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-4">
                  {contract.riskSummary && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Contract Purpose</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{contract.riskSummary.purpose}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <span>Common Startup Mistakes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {contract.riskSummary.commonMistakes.map((mistake, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            <span>Key Clauses to Review</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {contract.riskSummary.keyClausesToReview.map((clause, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{clause}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <Globe className="h-5 w-5 text-green-600" />
                            <span>Jurisdiction-Specific Risks</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {contract.riskSummary.jurisdictionRisks.map((risk, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Legal Disclaimer:</strong> {contract.riskSummary.disclaimer}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contract Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Template:</span>
                          <span className="font-medium">{contract.templateId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Jurisdiction:</span>
                          <span className="font-medium">{jurisdiction?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Language:</span>
                          <span className="font-medium">{contract.language.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pages:</span>
                          <span className="font-medium">{contract.pageCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Generated:</span>
                          <span className="font-medium">{new Date(contract.generatedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant={isPurchased ? 'default' : 'secondary'}>
                            {contract.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Form Data Used</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {Object.entries(contract.formData).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-right max-w-32 truncate">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase/Download Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Pricing & Download</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${contract.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  ${(contract.price / contract.pageCount).toFixed(2)} per page
                </div>
              </div>
              
              {!isPurchased ? (
                <div className="space-y-3">
                  <Button onClick={onPurchase} className="w-full">
                    Purchase Contract
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Secure payment via Stripe • Full document access • PDF & Word formats
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button onClick={() => onDownload('pdf')} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={() => onDownload('docx')} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Word
                  </Button>
                  <p className="text-xs text-green-600 text-center">
                    ✓ Purchased • Full access granted
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collaboration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Collaboration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" disabled={!isPurchased}>
                <Share2 className="h-4 w-4 mr-2" />
                Share with Team
              </Button>
              <Button variant="outline" className="w-full" disabled={!isPurchased}>
                <Users className="h-4 w-4 mr-2" />
                Invite Collaborators
              </Button>
              {!isPurchased && (
                <p className="text-xs text-gray-500 text-center">
                  Collaboration features available after purchase
                </p>
              )}
            </CardContent>
          </Card>

          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Security & Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>GDPR compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>SOC2 certified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure document storage</span>
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Important:</strong> This document is AI-generated and for informational purposes only. 
              Consult with a qualified attorney before using in legal matters.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}