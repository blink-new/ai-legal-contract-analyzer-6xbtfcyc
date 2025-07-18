import { blink } from '@/blink/client'
import type { 
  SignatureDocument, 
  SignatureField, 
  SignatureRecipient, 
  AuditEvent,
  SignatureTemplate,
  SigningSession
} from '@/types/signature'

class SignatureDatabase {
  // Documents
  async createDocument(document: Omit<SignatureDocument, 'id' | 'createdAt' | 'auditTrail'>): Promise<SignatureDocument> {
    const id = `sig_doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    await blink.db.signatureDocuments.create({
      id,
      name: document.name,
      content: document.content,
      type: document.type,
      pages: document.pages,
      routing: document.routing,
      status: document.status,
      createdAt: now,
      completedAt: document.completedAt?.toISOString(),
      userId: document.userId,
      contractId: document.contractId
    })

    // Create fields
    for (const field of document.fields) {
      await this.createField(id, field)
    }

    // Create recipients
    for (const recipient of document.recipients) {
      await this.createRecipient(id, recipient)
    }

    return this.getDocument(id)
  }

  async getDocument(id: string): Promise<SignatureDocument> {
    const docs = await blink.db.signatureDocuments.list({
      where: { id },
      limit: 1
    })
    
    if (docs.length === 0) {
      throw new Error('Document not found')
    }

    const doc = docs[0]
    const fields = await this.getDocumentFields(id)
    const recipients = await this.getDocumentRecipients(id)
    const auditTrail = await this.getDocumentAuditTrail(id)

    return {
      id: doc.id,
      name: doc.name,
      content: doc.content,
      type: doc.type as 'pdf' | 'word' | 'image',
      pages: doc.pages,
      fields,
      recipients,
      routing: doc.routing as 'sequential' | 'parallel',
      status: doc.status as SignatureDocument['status'],
      createdAt: new Date(doc.createdAt),
      completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
      userId: doc.userId,
      contractId: doc.contractId,
      auditTrail
    }
  }

  async getUserDocuments(userId: string): Promise<SignatureDocument[]> {
    const docs = await blink.db.signatureDocuments.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return Promise.all(docs.map(doc => this.getDocument(doc.id)))
  }

  async updateDocumentStatus(id: string, status: SignatureDocument['status']): Promise<void> {
    const updates: any = { status }
    if (status === 'completed') {
      updates.completedAt = new Date().toISOString()
    }

    await blink.db.signatureDocuments.update(id, updates)
  }

  // Fields
  async createField(documentId: string, field: Omit<SignatureField, 'id'>): Promise<SignatureField> {
    const id = `sig_field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await blink.db.signatureFields.create({
      id,
      documentId,
      type: field.type,
      x: field.x,
      y: field.y,
      width: field.width,
      height: field.height,
      page: field.page,
      required: field.required ? 1 : 0,
      label: field.label,
      value: field.value,
      options: field.options ? JSON.stringify(field.options) : null,
      recipientId: field.recipientId,
      createdAt: new Date().toISOString()
    })

    return { id, ...field }
  }

  async getDocumentFields(documentId: string): Promise<SignatureField[]> {
    const fields = await blink.db.signatureFields.list({
      where: { documentId },
      orderBy: { page: 'asc' }
    })

    return fields.map(field => ({
      id: field.id,
      type: field.type as SignatureField['type'],
      x: field.x,
      y: field.y,
      width: field.width,
      height: field.height,
      page: field.page,
      required: Number(field.required) > 0,
      label: field.label,
      value: field.value,
      options: field.options ? JSON.parse(field.options) : undefined,
      recipientId: field.recipientId
    }))
  }

  async updateField(id: string, updates: Partial<SignatureField>): Promise<void> {
    const dbUpdates: any = { ...updates }
    if ('required' in updates) {
      dbUpdates.required = updates.required ? 1 : 0
    }
    if ('options' in updates && updates.options) {
      dbUpdates.options = JSON.stringify(updates.options)
    }
    
    await blink.db.signatureFields.update(id, dbUpdates)
  }

  // Recipients
  async createRecipient(documentId: string, recipient: Omit<SignatureRecipient, 'id'>): Promise<SignatureRecipient> {
    const id = `sig_recipient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await blink.db.signatureRecipients.create({
      id,
      documentId,
      email: recipient.email,
      name: recipient.name,
      role: recipient.role,
      authMethod: recipient.authMethod,
      notes: recipient.notes,
      status: recipient.status,
      signedAt: recipient.signedAt?.toISOString(),
      ipAddress: recipient.ipAddress,
      orderIndex: 0,
      createdAt: new Date().toISOString()
    })

    return { id, ...recipient }
  }

  async getDocumentRecipients(documentId: string): Promise<SignatureRecipient[]> {
    const recipients = await blink.db.signatureRecipients.list({
      where: { documentId },
      orderBy: { orderIndex: 'asc' }
    })

    return recipients.map(recipient => ({
      id: recipient.id,
      email: recipient.email,
      name: recipient.name,
      role: recipient.role as SignatureRecipient['role'],
      authMethod: recipient.authMethod as SignatureRecipient['authMethod'],
      notes: recipient.notes,
      status: recipient.status as SignatureRecipient['status'],
      signedAt: recipient.signedAt ? new Date(recipient.signedAt) : undefined,
      ipAddress: recipient.ipAddress
    }))
  }

  async updateRecipientStatus(id: string, status: SignatureRecipient['status'], ipAddress?: string): Promise<void> {
    const updates: any = { status }
    if (status === 'signed' || status === 'completed') {
      updates.signedAt = new Date().toISOString()
      if (ipAddress) {
        updates.ipAddress = ipAddress
      }
    }
    
    await blink.db.signatureRecipients.update(id, updates)
  }

  // Audit Trail
  async addAuditEvent(documentId: string, event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await blink.db.signatureAuditTrail.create({
      id,
      documentId,
      timestamp: new Date().toISOString(),
      action: event.action,
      userId: event.userId,
      recipientId: event.recipientId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      details: JSON.stringify(event.details)
    })
  }

  async getDocumentAuditTrail(documentId: string): Promise<AuditEvent[]> {
    const events = await blink.db.signatureAuditTrail.list({
      where: { documentId },
      orderBy: { timestamp: 'desc' }
    })

    return events.map(event => ({
      id: event.id,
      timestamp: new Date(event.timestamp),
      action: event.action,
      userId: event.userId,
      recipientId: event.recipientId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      details: event.details ? JSON.parse(event.details) : {}
    }))
  }

  // Templates
  async createTemplate(template: Omit<SignatureTemplate, 'id' | 'createdAt'>): Promise<SignatureTemplate> {
    const id = `sig_template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await blink.db.signatureTemplates.create({
      id,
      name: template.name,
      description: template.description,
      fields: JSON.stringify(template.fields),
      recipients: JSON.stringify(template.recipients),
      routing: template.routing,
      userId: template.userId,
      createdAt: new Date().toISOString()
    })

    return {
      id,
      ...template,
      createdAt: new Date()
    }
  }

  async getUserTemplates(userId: string): Promise<SignatureTemplate[]> {
    const templates = await blink.db.signatureTemplates.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      fields: JSON.parse(template.fields),
      recipients: JSON.parse(template.recipients),
      routing: template.routing as 'sequential' | 'parallel',
      userId: template.userId,
      createdAt: new Date(template.createdAt)
    }))
  }

  // Signing Sessions
  async createSigningSession(session: Omit<SigningSession, 'id' | 'accessToken'>): Promise<SigningSession> {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const accessToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
    
    await blink.db.signingSessions.create({
      id,
      documentId: session.documentId,
      recipientId: session.recipientId,
      accessToken,
      expiresAt: session.expiresAt.toISOString(),
      currentPage: session.currentPage,
      completedFields: JSON.stringify(session.completedFields),
      status: session.status,
      createdAt: new Date().toISOString()
    })

    return {
      id,
      accessToken,
      ...session
    }
  }

  async getSigningSession(accessToken: string): Promise<SigningSession | null> {
    const sessions = await blink.db.signingSessions.list({
      where: { accessToken },
      limit: 1
    })

    if (sessions.length === 0) {
      return null
    }

    const session = sessions[0]
    return {
      id: session.id,
      documentId: session.documentId,
      recipientId: session.recipientId,
      accessToken: session.accessToken,
      expiresAt: new Date(session.expiresAt),
      currentPage: session.currentPage,
      completedFields: JSON.parse(session.completedFields || '[]'),
      status: session.status as SigningSession['status']
    }
  }

  async updateSigningSession(id: string, updates: Partial<SigningSession>): Promise<void> {
    const dbUpdates: any = { ...updates }
    if ('expiresAt' in updates && updates.expiresAt) {
      dbUpdates.expiresAt = updates.expiresAt.toISOString()
    }
    if ('completedFields' in updates && updates.completedFields) {
      dbUpdates.completedFields = JSON.stringify(updates.completedFields)
    }
    
    await blink.db.signingSessions.update(id, dbUpdates)
  }
}

export const signatureDb = new SignatureDatabase()

// Initialize signature tables
export async function initializeSignatureDatabase(): Promise<boolean> {
  try {
    // Read and execute the signature schema
    const schemaResponse = await fetch('/src/lib/signature-schema.sql')
    if (!schemaResponse.ok) {
      console.error('Failed to load signature schema')
      return false
    }
    
    const schema = await schemaResponse.text()
    const statements = schema.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        await blink.db.sql(statement.trim())
      }
    }
    
    console.log('Signature database initialized successfully')
    return true
  } catch (error) {
    console.error('Failed to initialize signature database:', error)
    return false
  }
}