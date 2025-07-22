-- Criar tabela para simulações FGTS
CREATE TABLE IF NOT EXISTS fgts_simulacao (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  rg VARCHAR(20) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_fgts_cpf ON fgts_simulacao(cpf);
CREATE INDEX IF NOT EXISTS idx_fgts_created_at ON fgts_simulacao(created_at);

-- Comentários para documentação
COMMENT ON TABLE fgts_simulacao IS 'Tabela para armazenar solicitações de antecipação FGTS';
COMMENT ON COLUMN fgts_simulacao.nome_completo IS 'Nome completo do solicitante';
COMMENT ON COLUMN fgts_simulacao.cpf IS 'CPF do solicitante formatado';
COMMENT ON COLUMN fgts_simulacao.rg IS 'RG do solicitante';
COMMENT ON COLUMN fgts_simulacao.telefone IS 'Telefone do solicitante formatado';
