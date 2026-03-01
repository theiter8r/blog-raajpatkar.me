-- Blog Backend Database Schema
-- Run this migration to set up all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admins_email ON admins(email);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TYPE post_status AS ENUM ('draft', 'published');

CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(500) NOT NULL,
  slug          VARCHAR(500) NOT NULL UNIQUE,
  excerpt       TEXT,
  content       TEXT NOT NULL,
  html_content  TEXT,
  status        post_status  NOT NULL DEFAULT 'draft',
  author_id     UUID         NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

-- ============================================
-- SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) NOT NULL UNIQUE,
  confirmed         BOOLEAN      NOT NULL DEFAULT FALSE,
  confirmation_token VARCHAR(64) NOT NULL,
  unsubscribe_token VARCHAR(64)  NOT NULL,
  confirmed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_confirmation_token ON subscribers(confirmation_token);
CREATE INDEX idx_subscribers_unsubscribe_token ON subscribers(unsubscribe_token);
CREATE INDEX idx_subscribers_confirmed ON subscribers(confirmed);

-- ============================================
-- NEWSLETTER LOGS TABLE
-- ============================================
CREATE TYPE send_status AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE IF NOT EXISTS newsletter_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  subscriber_id   UUID        NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  status          send_status NOT NULL DEFAULT 'pending',
  error_message   TEXT,
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_logs_post_id ON newsletter_logs(post_id);
CREATE INDEX idx_newsletter_logs_subscriber_id ON newsletter_logs(subscriber_id);
CREATE INDEX idx_newsletter_logs_status ON newsletter_logs(status);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
