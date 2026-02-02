
export const integritySchema = `
    CREATE TABLE IF NOT EXISTS integrity_profiles (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        trust_score INTEGER DEFAULT 500,
        strikes_count INTEGER DEFAULT 0,
        is_shadow_banned BOOLEAN DEFAULT FALSE,
        device_fingerprint TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS integrity_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        violation_type TEXT NOT NULL,
        severity INTEGER,
        evidence TEXT,
        context_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_integrity_user ON integrity_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_integrity_device ON integrity_profiles(device_fingerprint);
`;
