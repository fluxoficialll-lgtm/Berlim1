export const postsSchema = `
    CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY, 
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
        likes_count INTEGER DEFAULT 0,
        views_count INTEGER DEFAULT 0,
        is_ad BOOLEAN DEFAULT FALSE,
        is_adult BOOLEAN DEFAULT FALSE,
        data JSONB, 
        created_at TIMESTAMP DEFAULT NOW()
    );

    -- Atualização de campos de metadados
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_ad BOOLEAN DEFAULT FALSE;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_adult BOOLEAN DEFAULT FALSE;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS data JSONB;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

    CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_metrics ON posts(likes_count DESC, views_count DESC);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
`;