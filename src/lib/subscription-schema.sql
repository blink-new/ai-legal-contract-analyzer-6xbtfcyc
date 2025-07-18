-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL, -- 'basic', 'ai-plus', 'team', 'unlimited'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_subscription_id TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  updated_at TEXT NOT NULL
);

-- Contract recommendations table
CREATE TABLE IF NOT EXISTS contract_recommendations (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  risk_assessment_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_clause TEXT NOT NULL,
  section_reference TEXT NOT NULL,
  paragraph_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'ignored'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Applied recommendations tracking
CREATE TABLE IF NOT EXISTS applied_recommendations (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  recommendation_id TEXT NOT NULL,
  applied_at TEXT NOT NULL,
  modification_type TEXT NOT NULL, -- 'tracked_changes', 'direct_highlight'
  highlight_color TEXT DEFAULT '#fbbf24' -- Default yellow highlight
);