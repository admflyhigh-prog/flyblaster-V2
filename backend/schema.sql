-- ============================================================
-- Fly Blaster — MySQL Database Schema
-- Replaces the previous Supabase PostgreSQL backend.
-- Database name: flyblaster
-- ============================================================

CREATE DATABASE IF NOT EXISTS flyblaster
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flyblaster;

-- ------------------------------------------------------------
-- system_settings — key/value configuration (was Supabase system_settings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_system_settings_key (setting_key)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- users — local auth (replaces Supabase Auth)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) DEFAULT '',
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- groups — WhatsApp groups / contact groups
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `groups` (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  waha_jid VARCHAR(255) DEFAULT NULL COMMENT 'WAHA group JID (e.g. 123@g.us) when imported',
  is_imported TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_groups_waha_jid (waha_jid)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- contacts — individual WhatsApp numbers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_contacts_phone (phone)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- group_contacts — many-to-many between groups and contacts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS group_contacts (
  group_id BIGINT UNSIGNED NOT NULL,
  contact_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (group_id, contact_id),
  CONSTRAINT fk_gc_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  CONSTRAINT fk_gc_contact FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- templates — message templates (WhatsApp & Email)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  message_text TEXT NOT NULL,
  channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp', -- 'whatsapp' | 'email'
  email_subject VARCHAR(255) DEFAULT NULL,
  media_url TEXT DEFAULT NULL,
  media_type VARCHAR(20) DEFAULT NULL, -- 'image' | 'video' | 'document'
  attachments JSON DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- campaigns — blasting runs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  group_id BIGINT UNSIGNED DEFAULT NULL COMMENT 'legacy single-group fallback',
  template_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending | sending | completed | stopped | failed
  channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
  delay_seconds INT NOT NULL DEFAULT 15,
  total_recipients INT NOT NULL DEFAULT 0,
  sent_count INT NOT NULL DEFAULT 0,
  failed_count INT NOT NULL DEFAULT 0,
  only_interactions TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'only blast contacts with prior interaction',
  started_at TIMESTAMP NULL DEFAULT NULL,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_campaigns_status (status),
  CONSTRAINT fk_campaigns_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE RESTRICT,
  CONSTRAINT fk_campaigns_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- campaign_groups — many-to-many between campaigns and groups
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_groups (
  campaign_id BIGINT UNSIGNED NOT NULL,
  group_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (campaign_id, group_id),
  CONSTRAINT fk_cg_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_cg_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- message_logs — per-message send records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS message_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  campaign_id BIGINT UNSIGNED DEFAULT NULL,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  phone VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255) DEFAULT '',
  channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending | sent | failed
  error TEXT DEFAULT NULL,
  sent_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ml_campaign (campaign_id),
  CONSTRAINT fk_ml_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_ml_contact FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- daily_message_count — daily quota tracking (replaces can_send_messages)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_message_count (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  stat_date DATE NOT NULL,
  message_count INT NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_daily_message_count (stat_date)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- contact_interactions — prior-message detection (new feature)
-- Detects numbers we've received from / replied to, individual & group.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_interactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  contact_id BIGINT UNSIGNED DEFAULT NULL,
  phone VARCHAR(50) NOT NULL,
  chat_jid VARCHAR(255) NOT NULL,
  chat_type VARCHAR(20) NOT NULL DEFAULT 'individual', -- 'individual' | 'group'
  direction VARCHAR(20) NOT NULL DEFAULT 'inbound', -- 'inbound' | 'outbound'
  last_interaction_at DATETIME DEFAULT NULL,
  message_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ci_chat_phone (chat_jid, phone, direction),
  CONSTRAINT fk_ci_contact FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- senders — WhatsApp sender sessions managed from the app (like WAHA session list)
-- Each row = a WhatsApp number you can scan & connect, then save or delete.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS senders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  waha_session VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL COMMENT 'Connected WhatsApp number, set after scan',
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_senders_waha_session (waha_session)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Seed initial settings (mirror the Supabase defaults)
-- ------------------------------------------------------------
INSERT INTO system_settings (setting_key, setting_value) VALUES
  ('daily_group_limit', '5'),
  ('waha_session', 'Tester')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
