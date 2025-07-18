export interface SignatureField {
  id: string
  type: 'signature' | 'initials' | 'name' | 'date' | 'title' | 'checkbox' | 'radio' | 'textbox'
  x: number
  y: number
  width: number
  height: number
  page: number
  required: boolean
  label: string
  value?: string
  options?: string[] // For radio buttons
}

export interface SignatureRecipient {
  id: string
  email: string
  name: string
  role: 'signer' | 'approver' | 'viewer' | 'certified_recipient' | 'in_person_signer'
  authMethod: 'email' | 'sms' | 'access_code' | 'id_verification'
  notes?: string
  status: 'pending' | 'viewed' | 'signed' | 'declined' | 'completed'
  signedAt?: Date
  ipAddress?: string
}

export interface SignatureDocument {
  id: string
  name: string
  content: string // Base64 or URL
  type: 'pdf' | 'word' | 'image'
  pages: number
  fields: SignatureField[]
  recipients: SignatureRecipient[]
  routing: 'sequential' | 'parallel'
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'declined' | 'expired'
  createdAt: Date
  completedAt?: Date
  userId: string
  contractId?: string // Link to original contract
  auditTrail: AuditEvent[]
}

export interface AuditEvent {
  id: string
  timestamp: Date
  action: string
  userId?: string
  recipientId?: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
}

export interface SignatureTemplate {
  id: string
  name: string
  description: string
  fields: Omit<SignatureField, 'id'>[]
  recipients: Omit<SignatureRecipient, 'id' | 'status' | 'signedAt' | 'ipAddress'>[]
  routing: 'sequential' | 'parallel'
  userId: string
  createdAt: Date
}

export interface SigningSession {
  id: string
  documentId: string
  recipientId: string
  accessToken: string
  expiresAt: Date
  currentPage: number
  completedFields: string[]
  status: 'active' | 'completed' | 'expired'
}