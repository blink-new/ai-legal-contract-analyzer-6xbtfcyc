import { blink } from '@/blink/client'

// Local storage fallback for when database is not available
const LOCAL_STORAGE_KEYS = {
  subscriptions: 'blink_user_subscriptions',
  recommendations: 'blink_contract_recommendations',
  appliedRecommendations: 'blink_applied_recommendations'
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

// User subscription operations
export const subscriptionDb = {
  async getUserSubscription(userId: string) {
    try {
      const subscriptions = await blink.db.user_subscriptions.list({
        where: { user_id: userId, status: 'active' },
        orderBy: { created_at: 'desc' },
        limit: 1
      })
      return subscriptions[0] || null
    } catch (error) {
      // Fallback to localStorage
      const subscriptions = getFromLocalStorage(LOCAL_STORAGE_KEYS.subscriptions)
      const userSubscription = subscriptions.find((s: any) => s.user_id === userId && s.status === 'active')
      return userSubscription || null
    }
  },

  async createSubscription(subscription: {
    id: string
    userId: string
    planId: string
    status?: string
    stripeSubscriptionId?: string
    expiresAt?: string
  }) {
    try {
      return await blink.db.user_subscriptions.create({
        id: subscription.id,
        user_id: subscription.userId,
        plan_id: subscription.planId,
        status: subscription.status || 'active',
        stripe_subscription_id: subscription.stripeSubscriptionId,
        expires_at: subscription.expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      // Fallback to localStorage
      const subscriptions = getFromLocalStorage(LOCAL_STORAGE_KEYS.subscriptions)
      const newSubscription = {
        id: subscription.id,
        user_id: subscription.userId,
        plan_id: subscription.planId,
        status: subscription.status || 'active',
        stripe_subscription_id: subscription.stripeSubscriptionId,
        expires_at: subscription.expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      subscriptions.push(newSubscription)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.subscriptions, subscriptions)
      return newSubscription
    }
  },

  async updateSubscription(id: string, updates: {
    status?: string
    expiresAt?: string
  }) {
    try {
      return await blink.db.user_subscriptions.update(id, {
        status: updates.status,
        expires_at: updates.expiresAt,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      // Fallback to localStorage
      const subscriptions = getFromLocalStorage(LOCAL_STORAGE_KEYS.subscriptions)
      const subscriptionIndex = subscriptions.findIndex((s: any) => s.id === id)
      if (subscriptionIndex !== -1) {
        subscriptions[subscriptionIndex] = {
          ...subscriptions[subscriptionIndex],
          status: updates.status || subscriptions[subscriptionIndex].status,
          expires_at: updates.expiresAt || subscriptions[subscriptionIndex].expires_at,
          updated_at: new Date().toISOString()
        }
        saveToLocalStorage(LOCAL_STORAGE_KEYS.subscriptions, subscriptions)
        return subscriptions[subscriptionIndex]
      }
      return null
    }
  }
}

// Contract recommendations operations
export const recommendationDb = {
  async createRecommendation(recommendation: {
    id: string
    contractId: string
    riskAssessmentId: string
    title: string
    description: string
    suggestedClause: string
    sectionReference: string
    paragraphReference?: string
  }) {
    try {
      return await blink.db.contract_recommendations.create({
        id: recommendation.id,
        contract_id: recommendation.contractId,
        risk_assessment_id: recommendation.riskAssessmentId,
        title: recommendation.title,
        description: recommendation.description,
        suggested_clause: recommendation.suggestedClause,
        section_reference: recommendation.sectionReference,
        paragraph_reference: recommendation.paragraphReference,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      // Fallback to localStorage
      const recommendations = getFromLocalStorage(LOCAL_STORAGE_KEYS.recommendations)
      const newRecommendation = {
        id: recommendation.id,
        contract_id: recommendation.contractId,
        risk_assessment_id: recommendation.riskAssessmentId,
        title: recommendation.title,
        description: recommendation.description,
        suggested_clause: recommendation.suggestedClause,
        section_reference: recommendation.sectionReference,
        paragraph_reference: recommendation.paragraphReference,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      recommendations.push(newRecommendation)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.recommendations, recommendations)
      return newRecommendation
    }
  },

  async listByContract(contractId: string) {
    try {
      return await blink.db.contract_recommendations.list({
        where: { contract_id: contractId },
        orderBy: { created_at: 'asc' }
      })
    } catch (error) {
      // Fallback to localStorage
      const recommendations = getFromLocalStorage(LOCAL_STORAGE_KEYS.recommendations)
      return recommendations
        .filter((r: any) => r.contract_id === contractId)
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }
  },

  async updateRecommendation(id: string, updates: {
    status?: 'pending' | 'accepted' | 'ignored'
  }) {
    try {
      return await blink.db.contract_recommendations.update(id, {
        status: updates.status,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      // Fallback to localStorage
      const recommendations = getFromLocalStorage(LOCAL_STORAGE_KEYS.recommendations)
      const recommendationIndex = recommendations.findIndex((r: any) => r.id === id)
      if (recommendationIndex !== -1) {
        recommendations[recommendationIndex] = {
          ...recommendations[recommendationIndex],
          status: updates.status || recommendations[recommendationIndex].status,
          updated_at: new Date().toISOString()
        }
        saveToLocalStorage(LOCAL_STORAGE_KEYS.recommendations, recommendations)
        return recommendations[recommendationIndex]
      }
      return null
    }
  }
}

// Applied recommendations operations
export const appliedRecommendationDb = {
  async createAppliedRecommendation(appliedRec: {
    id: string
    contractId: string
    recommendationId: string
    modificationType: 'tracked_changes' | 'direct_highlight'
    highlightColor?: string
  }) {
    try {
      return await blink.db.applied_recommendations.create({
        id: appliedRec.id,
        contract_id: appliedRec.contractId,
        recommendation_id: appliedRec.recommendationId,
        applied_at: new Date().toISOString(),
        modification_type: appliedRec.modificationType,
        highlight_color: appliedRec.highlightColor || '#fbbf24'
      })
    } catch (error) {
      // Fallback to localStorage
      const appliedRecommendations = getFromLocalStorage(LOCAL_STORAGE_KEYS.appliedRecommendations)
      const newAppliedRecommendation = {
        id: appliedRec.id,
        contract_id: appliedRec.contractId,
        recommendation_id: appliedRec.recommendationId,
        applied_at: new Date().toISOString(),
        modification_type: appliedRec.modificationType,
        highlight_color: appliedRec.highlightColor || '#fbbf24'
      }
      appliedRecommendations.push(newAppliedRecommendation)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.appliedRecommendations, appliedRecommendations)
      return newAppliedRecommendation
    }
  },

  async listByContract(contractId: string) {
    try {
      return await blink.db.applied_recommendations.list({
        where: { contract_id: contractId },
        orderBy: { applied_at: 'asc' }
      })
    } catch (error) {
      // Fallback to localStorage
      const appliedRecommendations = getFromLocalStorage(LOCAL_STORAGE_KEYS.appliedRecommendations)
      return appliedRecommendations
        .filter((ar: any) => ar.contract_id === contractId)
        .sort((a: any, b: any) => new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime())
    }
  }
}

// Utility function to check if user has paid plan
export const hasActivePaidPlan = (subscription: any): boolean => {
  if (!subscription) return false
  if (subscription.status !== 'active') return false
  
  const paidPlans = ['basic', 'ai-plus', 'team', 'unlimited']
  return paidPlans.includes(subscription.plan_id)
}

// Utility function to get plan features
export const getPlanFeatures = (planId: string) => {
  const planFeatures = {
    free: {
      riskAnalysisPreview: true,
      fullRiskAnalysis: false,
      recommendations: false,
      export: false,
      contractGeneration: false
    },
    basic: {
      riskAnalysisPreview: true,
      fullRiskAnalysis: true,
      recommendations: true,
      export: false,
      contractGeneration: false
    },
    'ai-plus': {
      riskAnalysisPreview: true,
      fullRiskAnalysis: true,
      recommendations: true,
      export: true,
      contractGeneration: true,
      contractsPerMonth: 5
    },
    team: {
      riskAnalysisPreview: true,
      fullRiskAnalysis: true,
      recommendations: true,
      export: true,
      contractGeneration: true,
      contractsPerMonth: 10,
      collaboration: true
    },
    unlimited: {
      riskAnalysisPreview: true,
      fullRiskAnalysis: true,
      recommendations: true,
      export: true,
      contractGeneration: true,
      contractsPerMonth: -1, // unlimited
      collaboration: true
    }
  }
  
  return planFeatures[planId as keyof typeof planFeatures] || planFeatures.free
}