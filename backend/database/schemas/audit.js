
export const auditSchema = `
    CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        admin_id UUID NOT NULL REFERENCES users(id),
        admin_name TEXT NOT NULL,
        action TEXT NOT NULL,
        target_info TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_audit_group ON audit_logs(group_id, timestamp DESC);
`;
