import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  PenTool, 
  Type, 
  Calendar, 
  CheckSquare, 
  Circle, 
  FileText,
  Plus,
  Trash2,
  Users,
  Send,
  Save
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { SignatureField, SignatureRecipient } from '@/types/signature'

interface SignatureBuilderProps {
  documentContent: string
  documentTitle: string
  onSave: (fields: SignatureField[], recipients: SignatureRecipient[]) => void
  onSend: (fields: SignatureField[], recipients: SignatureRecipient[]) => void
}

const FIELD_TYPES = [
  { value: 'signature', label: 'Signature', icon: PenTool, color: 'bg-blue-500' },
  { value: 'initials', label: 'Initials', icon: Type, color: 'bg-green-500' },
  { value: 'name', label: 'Name', icon: Type, color: 'bg-purple-500' },
  { value: 'date', label: 'Date', icon: Calendar, color: 'bg-orange-500' },
  { value: 'title', label: 'Title', icon: FileText, color: 'bg-indigo-500' },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'bg-pink-500' },
  { value: 'radio', label: 'Radio', icon: Circle, color: 'bg-yellow-500' },
  { value: 'textbox', label: 'Text Box', icon: Type, color: 'bg-gray-500' }
] as const

const RECIPIENT_ROLES = [
  { value: 'signer', label: 'Signer' },
  { value: 'approver', label: 'Approver' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'certified_recipient', label: 'Certified Recipient' },
  { value: 'in_person_signer', label: 'In-Person Signer' }
] as const

const AUTH_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'access_code', label: 'Access Code' },
  { value: 'id_verification', label: 'ID Verification' }
] as const

export function SignatureBuilder({ 
  documentContent, 
  documentTitle, 
  onSave, 
  onSend 
}: SignatureBuilderProps) {
  const { toast } = useToast()
  const [fields, setFields] = useState<SignatureField[]>([])
  const [recipients, setRecipients] = useState<SignatureRecipient[]>([])
  const [selectedFieldType, setSelectedFieldType] = useState<string>('signature')
  const [routing, setRouting] = useState<'sequential' | 'parallel'>('sequential')
  const documentRef = useRef<HTMLDivElement>(null)

  const addField = useCallback((x: number, y: number) => {
    const newField: SignatureField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: selectedFieldType as SignatureField['type'],
      x,
      y,
      width: 120,
      height: 40,
      page: 1,
      required: true,
      label: `${selectedFieldType.charAt(0).toUpperCase() + selectedFieldType.slice(1)} Field`
    }
    setFields(prev => [...prev, newField])
  }, [selectedFieldType])

  const updateField = (id: string, updates: Partial<SignatureField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id))
  }

  const addRecipient = () => {
    const newRecipient: SignatureRecipient = {
      id: `recipient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: '',
      name: '',
      role: 'signer',
      authMethod: 'email',
      status: 'pending'
    }
    setRecipients(prev => [...prev, newRecipient])
  }

  const updateRecipient = (id: string, updates: Partial<SignatureRecipient>) => {
    setRecipients(prev => prev.map(recipient => 
      recipient.id === id ? { ...recipient, ...updates } : recipient
    ))
  }

  const removeRecipient = (id: string) => {
    setRecipients(prev => prev.filter(recipient => recipient.id !== id))
  }

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!documentRef.current) return
    
    const rect = documentRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    addField(x, y)
  }

  const handleSave = () => {
    if (recipients.length === 0) {
      toast({
        title: "Add Recipients",
        description: "Please add at least one recipient before saving.",
        variant: "destructive"
      })
      return
    }
    
    onSave(fields, recipients)
    toast({
      title: "Document Saved",
      description: "Signature document has been saved as draft."
    })
  }

  const handleSend = () => {
    if (recipients.length === 0) {
      toast({
        title: "Add Recipients",
        description: "Please add at least one recipient before sending.",
        variant: "destructive"
      })
      return
    }
    
    const incompleteRecipients = recipients.filter(r => !r.email || !r.name)
    if (incompleteRecipients.length > 0) {
      toast({
        title: "Complete Recipient Information",
        description: "Please fill in all recipient details before sending.",
        variant: "destructive"
      })
      return
    }
    
    onSend(fields, recipients)
    toast({
      title: "Document Sent",
      description: "Signature requests have been sent to all recipients."
    })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-screen">
      {/* Document Preview */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{documentTitle}</span>
              <Badge variant="outline">
                {fields.length} field{fields.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto">
            <div 
              ref={documentRef}
              className="relative min-h-[800px] bg-white border-2 border-dashed border-gray-300 p-8 cursor-crosshair"
              onClick={handleDocumentClick}
            >
              {/* Document Content */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed pointer-events-none">
                {documentContent}
              </div>
              
              {/* Signature Fields */}
              {fields.map((field) => {
                const fieldType = FIELD_TYPES.find(t => t.value === field.type)
                const Icon = fieldType?.icon || PenTool
                
                return (
                  <div
                    key={field.id}
                    className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-80 flex items-center justify-center cursor-move group"
                    style={{
                      left: field.x,
                      top: field.y,
                      width: field.width,
                      height: field.height
                    }}
                  >
                    <div className="flex items-center space-x-1 text-xs text-blue-700">
                      <Icon className="h-3 w-3" />
                      <span>{field.label}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeField(field.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="space-y-6">
        {/* Field Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Field Type</Label>
              <Select value={selectedFieldType} onValueChange={setSelectedFieldType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${type.color} flex items-center justify-center`}>
                            <Icon className="h-2.5 w-2.5 text-white" />
                          </div>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <p className="text-sm text-gray-600">
              Click on the document to add a {selectedFieldType} field
            </p>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Recipients</span>
              <Button size="sm" onClick={addRecipient}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recipients.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No recipients added yet
              </p>
            ) : (
              recipients.map((recipient, index) => (
                <div key={recipient.id} className="space-y-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      Recipient {index + 1}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRecipient(recipient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="Full name"
                        value={recipient.name}
                        onChange={(e) => updateRecipient(recipient.id, { name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={recipient.email}
                        onChange={(e) => updateRecipient(recipient.id, { email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Role</Label>
                      <Select 
                        value={recipient.role} 
                        onValueChange={(value) => updateRecipient(recipient.id, { role: value as SignatureRecipient['role'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RECIPIENT_ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Authentication</Label>
                      <Select 
                        value={recipient.authMethod} 
                        onValueChange={(value) => updateRecipient(recipient.id, { authMethod: value as SignatureRecipient['authMethod'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AUTH_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Notes (Optional)</Label>
                      <Textarea
                        placeholder="Instructions for this recipient..."
                        value={recipient.notes || ''}
                        onChange={(e) => updateRecipient(recipient.id, { notes: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Routing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Signing Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={routing} onValueChange={(value) => setRouting(value as 'sequential' | 'parallel')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">Sequential (one at a time)</SelectItem>
                <SelectItem value="parallel">Parallel (all at once)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleSave} variant="outline" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          
          <Button onClick={handleSend} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send for Signature
          </Button>
        </div>
      </div>
    </div>
  )
}