export interface ContractTemplate {
  id: string
  name: string
  description: string
  category: 'legal' | 'employment' | 'business' | 'intellectual-property' | 'investment'
  complexity: 'simple' | 'medium' | 'complex'
  estimatedPages: number
  jurisdictions: Jurisdiction[]
  fields: ContractField[]
  clauses: ContractClause[]
  riskAreas: string[]
  seoKeywords: string[]
}

export interface ContractField {
  id: string
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'radio' | 'multi-select'
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  dependsOn?: {
    field: string
    value: string | string[]
  }
  helpText?: string
}

export interface ContractClause {
  id: string
  title: string
  content: string
  isOptional: boolean
  category: string
  riskLevel: 'low' | 'medium' | 'high'
  jurisdictionSpecific?: string[]
  dependsOn?: {
    field: string
    value: string | string[]
  }
}

export interface Jurisdiction {
  code: string
  name: string
  legalSystem: 'common-law' | 'civil-law' | 'mixed'
  currency: string
  flag: string
  specificRequirements?: string[]
}

export interface GeneratedContract {
  id: string
  templateId: string
  title: string
  content: string
  jurisdiction: string
  language: string
  formData: Record<string, any>
  generatedAt: string
  userId: string
  status: 'draft' | 'generated' | 'purchased' | 'downloaded'
  pageCount: number
  price: number
  riskSummary?: ContractRiskSummary
  collaborators?: Collaborator[]
}

export interface ContractRiskSummary {
  purpose: string
  commonMistakes: string[]
  keyClausesToReview: string[]
  jurisdictionRisks: string[]
  seoContent: string
  disclaimer: string
}

export interface Collaborator {
  id: string
  email: string
  role: 'viewer' | 'commenter' | 'editor'
  invitedAt: string
  acceptedAt?: string
  permissions: {
    canView: boolean
    canComment: boolean
    canEdit: boolean
    canDownload: boolean
  }
}

export interface ContractGenerationRequest {
  templateId: string
  formData: Record<string, any>
  jurisdiction: string
  language: string
  specialTerms?: string
  objective?: string
}

export interface PaymentPlan {
  type: 'subscription' | 'pay-per-use'
  price: number
  currency: string
  features: string[]
  limitations?: string[]
}

// Supported jurisdictions
export const JURISDICTIONS: Jurisdiction[] = [
  {
    code: 'US',
    name: 'United States',
    legalSystem: 'common-law',
    currency: 'USD',
    flag: '🇺🇸',
    specificRequirements: ['Federal securities regulations', 'State-specific corporate laws', 'Employment at-will doctrine']
  },
  {
    code: 'US-DE',
    name: 'United States (Delaware)',
    legalSystem: 'common-law',
    currency: 'USD',
    flag: '🇺🇸',
    specificRequirements: ['Delaware General Corporation Law', 'Federal securities regulations']
  },
  {
    code: 'US-CA',
    name: 'United States (California)',
    legalSystem: 'common-law',
    currency: 'USD',
    flag: '🇺🇸',
    specificRequirements: ['California Corporations Code', 'Employment at-will doctrine']
  },
  {
    code: 'MX',
    name: 'Mexico',
    legalSystem: 'civil-law',
    currency: 'MXN',
    flag: '🇲🇽',
    specificRequirements: ['Ley General de Sociedades Mercantiles', 'Labor law protections', 'COFECE competition law']
  },
  {
    code: 'JP',
    name: 'Japan',
    legalSystem: 'civil-law',
    currency: 'JPY',
    flag: '🇯🇵',
    specificRequirements: ['Companies Act (Kaisha-ho)', 'Labor Standards Act', 'Personal Information Protection Act']
  },
  {
    code: 'RU',
    name: 'Russia',
    legalSystem: 'civil-law',
    currency: 'RUB',
    flag: '🇷🇺',
    specificRequirements: ['Civil Code of Russia', 'Federal Law on Joint Stock Companies', 'Labor Code']
  },
  {
    code: 'CN',
    name: 'China',
    legalSystem: 'civil-law',
    currency: 'CNY',
    flag: '🇨🇳',
    specificRequirements: ['Company Law of PRC', 'Contract Law', 'Foreign Investment Law']
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    legalSystem: 'mixed',
    currency: 'AED',
    flag: '🇦🇪',
    specificRequirements: ['UAE Commercial Companies Law', 'DIFC/ADGM regulations', 'Sharia law principles']
  },
  {
    code: 'IN',
    name: 'India',
    legalSystem: 'mixed',
    currency: 'INR',
    flag: '🇮🇳',
    specificRequirements: ['Companies Act 2013', 'Indian Contract Act 1872', 'Foreign Exchange Management Act']
  },
  {
    code: 'EU',
    name: 'European Union',
    legalSystem: 'civil-law',
    currency: 'EUR',
    flag: '🇪🇺',
    specificRequirements: ['GDPR compliance', 'EU contract law directives']
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    legalSystem: 'common-law',
    currency: 'GBP',
    flag: '🇬🇧',
    specificRequirements: ['Companies Act 2006', 'Employment Rights Act']
  },
  {
    code: 'CA',
    name: 'Canada',
    legalSystem: 'mixed',
    currency: 'CAD',
    flag: '🇨🇦',
    specificRequirements: ['Canada Business Corporations Act', 'Provincial employment standards']
  }
]

// Payment plans
export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    type: 'subscription',
    price: 5,
    currency: 'USD',
    features: [
      'Unlimited contract generation',
      'Unlimited contract analysis',
      'Preview up to 3 pages',
      'Word export with track changes',
      'Collaboration features',
      'Priority support'
    ]
  },
  {
    type: 'pay-per-use',
    price: 0.80,
    currency: 'USD',
    features: [
      'Per-page pricing',
      'Preview first 2 pages',
      'PDF and Word export',
      'Basic collaboration'
    ],
    limitations: [
      'No unlimited access',
      'Limited preview pages'
    ]
  }
]