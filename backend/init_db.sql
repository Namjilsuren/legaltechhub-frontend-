-- -------------------------
-- LegalTechHub Database Schema
-- -------------------------

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'lawyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(100),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);