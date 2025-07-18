import { blink } from '@/blink/client'

// Database initialization and helper functions
export const initializeDatabase = async () => {
  try {
    // Try to list contracts to check if database exists (safer than creating)
    await blink.db.contracts.list({ limit: 1 })
    console.log('Database initialized successfully')
    return true
  } catch (error: any) {
    // Silently handle database unavailability - this is expected when database limit is reached
    if (error?.message?.includes('404') || error?.status === 404) {
      console.info('💾 Using local storage mode - your data is saved securely in your browser')
    } else {
      console.info('💾 Database unavailable, using local storage mode')
    }
    return false
  }
}

// Local storage fallback for when database is not available
const LOCAL_STORAGE_KEYS = {
  contracts: 'blink_contracts',
  riskAssessments: 'blink_risk_assessments',
  translations: 'blink_translations'
}

// Helper functions for local storage
const getFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Contract database operations
export const contractDb = {
  async create(contract: {
    id: string
    userId: string
    title: string
    content: string
    language: string
    analysisStatus?: string
    riskScore?: number
    summary?: string
    keyTopics?: string
  }) {
    try {
      return await blink.db.contracts.create({
        id: contract.id,
        user_id: contract.userId,
        title: contract.title,
        content: contract.content,
        language: contract.language,
        analysis_status: contract.analysisStatus || 'pending',
        risk_score: contract.riskScore,
        summary: contract.summary,
        key_topics: contract.keyTopics,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      // Silently fallback to localStorage - this is expected behavior
      const contracts = getFromLocalStorage(LOCAL_STORAGE_KEYS.contracts)
      const newContract = {
        id: contract.id,
        user_id: contract.userId,
        title: contract.title,
        content: contract.content,
        language: contract.language,
        analysis_status: contract.analysisStatus || 'pending',
        risk_score: contract.riskScore,
        summary: contract.summary,
        key_topics: contract.keyTopics,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      contracts.push(newContract)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.contracts, contracts)
      return newContract
    }
  },

  async list(userId: string) {
    try {
      return await blink.db.contracts.list({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' }
      })
    } catch (error) {
      // Silently fallback to localStorage - this is expected behavior
      const contracts = getFromLocalStorage(LOCAL_STORAGE_KEYS.contracts)
      return contracts
        .filter((c: any) => c.user_id === userId)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  },

  async get(id: string) {
    try {
      const contracts = await blink.db.contracts.list({
        where: { id },
        limit: 1
      })
      return contracts[0] || null
    } catch (error) {
      // Silently fallback to localStorage - this is expected behavior
      const contracts = getFromLocalStorage(LOCAL_STORAGE_KEYS.contracts)
      return contracts.find((c: any) => c.id === id) || null
    }
  },

  async update(id: string, updates: {
    analysisStatus?: string
    riskScore?: number
    title?: string
    summary?: string
    keyTopics?: string
  }) {
    try {
      return await blink.db.contracts.update(id, {
        analysis_status: updates.analysisStatus,
        risk_score: updates.riskScore,
        title: updates.title,
        summary: updates.summary,
        key_topics: updates.keyTopics,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      // Silently fallback to localStorage - this is expected behavior
      const contracts = getFromLocalStorage(LOCAL_STORAGE_KEYS.contracts)
      const contractIndex = contracts.findIndex((c: any) => c.id === id)
      if (contractIndex !== -1) {
        contracts[contractIndex] = {
          ...contracts[contractIndex],
          analysis_status: updates.analysisStatus || contracts[contractIndex].analysis_status,
          risk_score: updates.riskScore !== undefined ? updates.riskScore : contracts[contractIndex].risk_score,
          title: updates.title || contracts[contractIndex].title,
          summary: updates.summary || contracts[contractIndex].summary,
          key_topics: updates.keyTopics || contracts[contractIndex].key_topics,
          updated_at: new Date().toISOString()
        }
        saveToLocalStorage(LOCAL_STORAGE_KEYS.contracts, contracts)
        return contracts[contractIndex]
      }
      return null
    }
  },

  async delete(id: string) {
    try {
      return await blink.db.contracts.delete(id)
    } catch (error) {
      // Silently fallback to localStorage - this is expected behavior
      const contracts = getFromLocalStorage(LOCAL_STORAGE_KEYS.contracts)
      const filteredContracts = contracts.filter((c: any) => c.id !== id)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.contracts, filteredContracts)
      return true
    }
  }
}

// Risk assessments table operations
export const riskAssessmentDb = {
  async create(assessment: {
    id: string
    contractId: string
    category: string
    title: string
    description: string
    recommendation: string
    section: string
    pageNumber?: number
    wordLocation?: string
  }) {
    try {
      return await blink.db.risk_assessments.create({
        id: assessment.id,
        contract_id: assessment.contractId,
        category: assessment.category,
        title: assessment.title,
        description: assessment.description,
        recommendation: assessment.recommendation,
        section: assessment.section,
        page_number: assessment.pageNumber,
        word_location: assessment.wordLocation,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      // Fallback to localStorage
      const assessments = getFromLocalStorage(LOCAL_STORAGE_KEYS.riskAssessments)
      const newAssessment = {
        id: assessment.id,
        contract_id: assessment.contractId,
        category: assessment.category,
        title: assessment.title,
        description: assessment.description,
        recommendation: assessment.recommendation,
        section: assessment.section,
        page_number: assessment.pageNumber,
        word_location: assessment.wordLocation,
        created_at: new Date().toISOString()
      }
      assessments.push(newAssessment)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.riskAssessments, assessments)
      return newAssessment
    }
  },

  async listByContract(contractId: string) {
    try {
      return await blink.db.risk_assessments.list({
        where: { contract_id: contractId },
        orderBy: { created_at: 'asc' }
      })
    } catch (error) {
      // Fallback to localStorage
      const assessments = getFromLocalStorage(LOCAL_STORAGE_KEYS.riskAssessments)
      return assessments
        .filter((a: any) => a.contract_id === contractId)
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }
  }
}

// Translations table operations
export const translationDb = {
  async create(translation: {
    id: string
    contractId: string
    language: string
    content: string
    confidence: number
  }) {
    try {
      return await blink.db.translations.create({
        id: translation.id,
        contract_id: translation.contractId,
        language: translation.language,
        content: translation.content,
        confidence: translation.confidence,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      // Fallback to localStorage
      const translations = getFromLocalStorage(LOCAL_STORAGE_KEYS.translations)
      const newTranslation = {
        id: translation.id,
        contract_id: translation.contractId,
        language: translation.language,
        content: translation.content,
        confidence: translation.confidence,
        created_at: new Date().toISOString()
      }
      translations.push(newTranslation)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.translations, translations)
      return newTranslation
    }
  },

  async listByContract(contractId: string) {
    try {
      return await blink.db.translations.list({
        where: { contract_id: contractId },
        orderBy: { created_at: 'asc' }
      })
    } catch (error) {
      // Fallback to localStorage
      const translations = getFromLocalStorage(LOCAL_STORAGE_KEYS.translations)
      return translations
        .filter((t: any) => t.contract_id === contractId)
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }
  }
}