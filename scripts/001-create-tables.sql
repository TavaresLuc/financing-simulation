-- Create the simulations table to store all mortgage simulation data
CREATE TABLE IF NOT EXISTS simulations (
    id SERIAL PRIMARY KEY,
    property_value DECIMAL(12,2) NOT NULL,
    down_payment_percentage INTEGER NOT NULL,
    down_payment_amount DECIMAL(12,2) NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    loan_term_years INTEGER NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL DEFAULT 12.00,
    monthly_payment DECIMAL(10,2) NOT NULL,
    total_payment DECIMAL(12,2) NOT NULL,
    total_interest DECIMAL(12,2) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_cpf VARCHAR(14) NOT NULL,
    proposal_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON simulations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_simulations_email ON simulations(client_email);
