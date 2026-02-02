export const DATABASE_SCHEMAS = [
    `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, timestamp INTEGER, data TEXT)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_ts ON posts (timestamp DESC)`,
    `CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY, timestamp INTEGER, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS relationships (id TEXT PRIMARY KEY, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS vip_access (id TEXT PRIMARY KEY, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS marketplace (id TEXT PRIMARY KEY, timestamp INTEGER, data TEXT)`,
    `CREATE INDEX IF NOT EXISTS idx_market_ts ON marketplace (timestamp DESC)`,
    `CREATE TABLE IF NOT EXISTS ads (id TEXT PRIMARY KEY, timestamp INTEGER, data TEXT)`
];
