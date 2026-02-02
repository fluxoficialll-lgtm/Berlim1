
export const adsSchema = `
    CREATE TABLE IF NOT EXISTS ads (
        id TEXT PRIMARY KEY,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ad_events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ad_id TEXT NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        event_type TEXT NOT NULL, -- 'view', 'click', 'conversion'
        value NUMERIC(10,2) DEFAULT 0,
        metadata JSONB, -- device, location, placement
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_ads_owner ON ads(owner_id);
    CREATE INDEX IF NOT EXISTS idx_ad_events_ad_id ON ad_events(ad_id);
    CREATE INDEX IF NOT EXISTS idx_ad_events_type ON ad_events(event_type);
`;
