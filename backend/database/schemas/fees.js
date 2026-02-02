
export const feesSchema = `
    CREATE TABLE IF NOT EXISTS platform_fee_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        provider TEXT NOT NULL,         -- 'syncpay', 'stripe', 'paypal'
        method TEXT NOT NULL,           -- 'pix', 'credit_card', 'bank_debit', 'wallet'
        country_code TEXT DEFAULT 'ALL', -- 'BR', 'US', 'DE', 'ALL'
        currency TEXT DEFAULT 'BRL',     -- Moeda da taxa fixa
        fixed_fee NUMERIC(10,2) DEFAULT 0.00,
        percent_fee NUMERIC(5,2) DEFAULT 0.00,
        is_active BOOLEAN DEFAULT TRUE,
        priority INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(provider, method, country_code)
    );

    INSERT INTO platform_fee_rules (provider, method, country_code, currency, percent_fee, fixed_fee)
    VALUES 
    ('stripe', 'card', 'BR', 'BRL', 4.99, 0.50),
    ('stripe', 'card', 'US', 'USD', 3.99, 0.30),
    ('stripe', 'card', 'DE', 'EUR', 3.99, 0.25),
    ('stripe', 'card', 'ALL', 'USD', 5.00, 0.50)
    ON CONFLICT DO NOTHING;
`;
