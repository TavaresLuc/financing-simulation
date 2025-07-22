-- Create vehicle simulation table
CREATE TABLE IF NOT EXISTS veiculos_simulacao (
  id SERIAL PRIMARY KEY,
  
  -- Dados pessoais
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_cpf VARCHAR(14) NOT NULL,
  
  -- Dados do veículo
  vehicle_type VARCHAR(10) NOT NULL,
  knows_model BOOLEAN NOT NULL DEFAULT false,
  client_cep VARCHAR(9),
  vehicle_year INTEGER,
  vehicle_brand VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_value DECIMAL(15, 2) NOT NULL,
  
  -- Dados do vendedor
  purchase_timeline VARCHAR(20),
  seller_type VARCHAR(20),
  
  -- Dados do financiamento
  down_payment_percentage DECIMAL(5, 2) NOT NULL,
  down_payment_amount DECIMAL(15, 2) NOT NULL,
  loan_amount DECIMAL(15, 2) NOT NULL,
  loan_term_months INTEGER NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  monthly_payment DECIMAL(15, 2) NOT NULL,
  total_payment DECIMAL(15, 2) NOT NULL,
  total_interest DECIMAL(15, 2) NOT NULL,
  
  -- Metadados
  proposal_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_veiculos_simulacao_created_at ON veiculos_simulacao(created_at);
CREATE INDEX IF NOT EXISTS idx_veiculos_simulacao_client_email ON veiculos_simulacao(client_email);
