
export const usersSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL, 
        password TEXT, 
        handle TEXT UNIQUE,
        google_id TEXT UNIQUE,
        wallet_balance NUMERIC(15,2) DEFAULT 0.00,
        is_banned BOOLEAN DEFAULT FALSE,
        is_profile_completed BOOLEAN DEFAULT FALSE,
        trust_score INTEGER DEFAULT 500,
        strikes INTEGER DEFAULT 0,
        data JSONB,
        referred_by_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Índice para garantir que João@gmail.com seja igual a joao@gmail.com
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));

    CREATE INDEX IF NOT EXISTS idx_users_handle_lower ON users (LOWER(handle));
    CREATE INDEX IF NOT EXISTS idx_users_google ON users(google_id);
`;
