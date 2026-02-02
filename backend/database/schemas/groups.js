
export const groupsSchema = `
    CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY, 
        creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
        is_vip BOOLEAN DEFAULT FALSE,
        member_count INTEGER DEFAULT 1,
        status TEXT DEFAULT 'active',
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Índice GIN para performance extrema em filtros de JSON (ex: pesquisar dentro de memberIds)
    CREATE INDEX IF NOT EXISTS idx_groups_data_gin ON groups USING GIN (data);
    
    CREATE INDEX IF NOT EXISTS idx_groups_creator ON groups(creator_id);
    CREATE INDEX IF NOT EXISTS idx_groups_ranking ON groups(member_count DESC, is_vip);
    CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
`;
