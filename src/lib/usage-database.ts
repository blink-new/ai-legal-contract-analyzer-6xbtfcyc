import { blink } from '@/blink/client'

// Local storage fallback for when database is not available
const LOCAL_STORAGE_KEY = 'blink_usage_tracking'

// Helper functions for local storage
const getFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveToLocalStorage = (data: any) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save usage to localStorage:', error)
  }
}

export interface UsageRecord {
  id: string
  userId: string
  contractId: string
  requestType: 'summary' | 'risk_analysis' | 'translation' | 'export'
  language?: string
  createdAt: string
}

// Usage tracking operations
export const usageDb = {
  async trackUsage(usage: {
    userId: string
    contractId: string
    requestType: 'summary' | 'risk_analysis' | 'translation' | 'export'
    language?: string
  }) {
    const usageRecord: UsageRecord = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: usage.userId,
      contractId: usage.contractId,
      requestType: usage.requestType,
      language: usage.language,
      createdAt: new Date().toISOString()
    }

    try {
      return await blink.db.usage_tracking.create({
        id: usageRecord.id,
        user_id: usageRecord.userId,
        contract_id: usageRecord.contractId,
        request_type: usageRecord.requestType,
        language: usageRecord.language,
        created_at: usageRecord.createdAt
      })
    } catch (error) {
      // Fallback to localStorage
      const usageRecords = getFromLocalStorage()
      usageRecords.push(usageRecord)
      saveToLocalStorage(usageRecords)
      return usageRecord
    }
  },

  async getUserUsage(userId: string, contractId?: string) {
    try {
      const where: any = { user_id: userId }
      if (contractId) {
        where.contract_id = contractId
      }

      return await blink.db.usage_tracking.list({
        where,
        orderBy: { created_at: 'desc' }
      })
    } catch (error) {
      // Fallback to localStorage
      const usageRecords = getFromLocalStorage()
      return usageRecords
        .filter((record: UsageRecord) => {
          if (record.userId !== userId) return false
          if (contractId && record.contractId !== contractId) return false
          return true
        })
        .sort((a: UsageRecord, b: UsageRecord) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }
  },

  async getUsageCount(userId: string, requestType: string, contractId?: string) {
    try {
      const where: any = { user_id: userId, request_type: requestType }
      if (contractId) {
        where.contract_id = contractId
      }

      const records = await blink.db.usage_tracking.list({ where })
      return records.length
    } catch (error) {
      // Fallback to localStorage
      const usageRecords = getFromLocalStorage()
      return usageRecords.filter((record: UsageRecord) => {
        if (record.userId !== userId) return false
        if (record.requestType !== requestType) return false
        if (contractId && record.contractId !== contractId) return false
        return true
      }).length
    }
  }
}

// Create the usage tracking table
export const createUsageTrackingTable = async () => {
  try {
    await blink.db.sql(`
      CREATE TABLE IF NOT EXISTS usage_tracking (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        contract_id TEXT NOT NULL,
        request_type TEXT NOT NULL,
        language TEXT,
        created_at TEXT NOT NULL
      )
    `)
  } catch (error) {
    console.log('Usage tracking table creation failed, using localStorage fallback')
  }
}