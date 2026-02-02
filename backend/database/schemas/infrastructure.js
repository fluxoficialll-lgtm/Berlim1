
export const infrastructureSchema = `
    CREATE TABLE IF NOT EXISTS infrastructure_telemetry (
        id SERIAL PRIMARY KEY,
        metric_type TEXT NOT NULL, -- 'postgres_size', 'r2_size', 'db_total'
        value_bytes BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_infra_type_date ON infrastructure_telemetry(metric_type, created_at DESC);
`;
