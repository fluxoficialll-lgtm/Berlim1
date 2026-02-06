
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

    CREATE OR REPLACE FUNCTION update_member_count()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
        ELSIF (TG_OP = 'DELETE') THEN
            UPDATE groups SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.group_id;
        END IF;
        RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_update_member_count ON vip_access;
    CREATE TRIGGER trg_update_member_count
    AFTER INSERT OR DELETE ON vip_access
    FOR EACH ROW EXECUTE FUNCTION update_member_count();
`;
