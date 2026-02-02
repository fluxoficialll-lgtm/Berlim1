
export const vipSchema = `
    CREATE TABLE IF NOT EXISTS vip_access (
        id TEXT PRIMARY KEY, 
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
        group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE, 
        data JSONB, 
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, group_id) -- Impede que o mesmo usuário tenha duas linhas de VIP no mesmo grupo
    );

    CREATE INDEX IF NOT EXISTS idx_vip_user_group ON vip_access(user_id, group_id);
    CREATE INDEX IF NOT EXISTS idx_vip_expiration ON vip_access ((data->>'expiresAt'));
`;
