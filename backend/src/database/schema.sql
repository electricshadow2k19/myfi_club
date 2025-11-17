-- MYFI Database Schema for Phase 1

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(50) DEFAULT 'pending',
    pan_number VARCHAR(10),
    aadhaar_number VARCHAR(12),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Bank Accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50),
    ifsc_code VARCHAR(11),
    account_type VARCHAR(50),
    balance DECIMAL(15, 2) DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UPI Transactions
CREATE TABLE IF NOT EXISTS upi_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    upi_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'send' or 'receive'
    status VARCHAR(50) NOT NULL, -- 'pending', 'success', 'failed'
    recipient_upi VARCHAR(255),
    recipient_name VARCHAR(255),
    description TEXT,
    psp_reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bill Payments
CREATE TABLE IF NOT EXISTS bill_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    biller_id VARCHAR(100),
    biller_name VARCHAR(255) NOT NULL,
    bill_type VARCHAR(50) NOT NULL, -- 'electricity', 'gas', 'dth', 'credit_card', etc.
    customer_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL, -- 'pending', 'paid', 'failed'
    payment_reference_id VARCHAR(100),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit Score History
CREATE TABLE IF NOT EXISTS credit_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'crif', 'experian', 'cibil'
    report_date DATE NOT NULL,
    factors JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mutual Fund Investments
CREATE TABLE IF NOT EXISTS mutual_fund_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scheme_code VARCHAR(50) NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    folio_number VARCHAR(100),
    investment_type VARCHAR(50) NOT NULL, -- 'sip', 'lumpsum'
    amount DECIMAL(10, 2) NOT NULL,
    units DECIMAL(12, 4),
    nav DECIMAL(10, 4),
    current_value DECIMAL(12, 2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'stopped'
    sip_date INTEGER, -- Day of month for SIP
    next_sip_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gold Holdings
CREATE TABLE IF NOT EXISTS gold_holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'digital', 'physical'
    quantity_grams DECIMAL(10, 4) NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    current_price_per_gram DECIMAL(10, 2),
    current_value DECIMAL(12, 2),
    provider VARCHAR(100), -- 'mmtc_pamp', 'safegold'
    transaction_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'sold'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Net Worth Snapshots
CREATE TABLE IF NOT EXISTS net_worth_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_assets DECIMAL(15, 2) NOT NULL,
    total_liabilities DECIMAL(15, 2) NOT NULL,
    net_worth DECIMAL(15, 2) NOT NULL,
    breakdown JSONB, -- { bank_balance, mf_value, gold_value, etc. }
    snapshot_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions (for JWT blacklisting)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_id VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_upi_transactions_user_id ON upi_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_upi_transactions_status ON upi_transactions(status);
CREATE INDEX IF NOT EXISTS idx_bill_payments_user_id ON bill_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_mf_investments_user_id ON mutual_fund_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_gold_holdings_user_id ON gold_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_net_worth_user_id ON net_worth_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_id ON user_sessions(token_id);

