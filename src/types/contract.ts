export interface Contract {
  id: string
  title: string
  content: string
  language: string
  uploadedAt: string
  userId: string
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'error'
  riskScore?: number
  summary?: string
  keyTopics?: string // JSON string of array
  riskAssessment?: RiskAssessment[]
  translation?: Translation[]
}

export interface RiskAssessment {
  id: string
  category: 'high' | 'medium' | 'low'
  title: string
  description: string
  recommendation: string
  section: string
  pageNumber?: number
  wordLocation?: string
}

export interface Translation {
  language: string
  content: string
  confidence: number
}

export interface ContractRecommendation {
  id: string
  contractId: string
  riskAssessmentId: string
  title: string
  description: string
  suggestedClause: string
  sectionReference: string
  paragraphReference?: string
  status: 'pending' | 'accepted' | 'ignored'
  createdAt: string
  updatedAt: string
}

export interface AppliedRecommendation {
  id: string
  contractId: string
  recommendationId: string
  appliedAt: string
  modificationType: 'tracked_changes' | 'direct_highlight'
  highlightColor: string
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired'
  stripeSubscriptionId?: string
  createdAt: string
  expiresAt?: string
  updatedAt: string
}



export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
] as const