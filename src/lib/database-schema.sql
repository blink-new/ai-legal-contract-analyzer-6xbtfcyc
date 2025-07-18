-- AI Legal Contract Analyzer Database Schema
-- This file contains the complete database schema for when database access is restored

-- Contracts table - stores uploaded contracts and their metadata
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  analysis_status TEXT NOT NULL DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'analyzing', 'completed', 'error')),
  risk_score INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Risk assessments table - stores AI-generated risk analysis for each contract
CREATE TABLE IF NOT EXISTS risk_assessments (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('high', 'medium', 'low')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  section TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Translations table - stores contract translations in different languages
CREATE TABLE IF NOT EXISTS translations (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  language TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0.0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  UNIQUE(contract_id, language)
);

-- User preferences table - stores user settings and preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  default_jurisdiction TEXT NOT NULL DEFAULT 'us',
  email_notifications INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Contract templates table - stores reusable contract templates
CREATE TABLE IF NOT EXISTS contract_templates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  template_content TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Analysis history table - tracks all analysis requests for billing and analytics
CREATE TABLE IF NOT EXISTS analysis_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('risk_assessment', 'translation', 'comparison')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  cost_credits INTEGER NOT NULL DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_contract_id ON risk_assessments(contract_id);
CREATE INDEX IF NOT EXISTS idx_translations_contract_id ON translations(contract_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at);

-- Sample data for testing (will be removed in production)
-- INSERT INTO contracts (id, user_id, title, content, language, analysis_status, risk_score) VALUES
-- ('demo_1', 'test_user', 'Sample NDA', 'This is a sample non-disclosure agreement...', 'en', 'completed', 45),
-- ('demo_2', 'test_user', 'Software License', 'This software license agreement...', 'en', 'completed', 75);