# Real Estate Financing App

## 📋 Descrição

Aplicação web de simulação de financiamento imobiliário com design clean e responsivo, desenvolvida para funcionar perfeitamente em dispositivos móveis e desktop. O sistema permite simular financiamentos com taxa de juros amortizada de 12% ao ano e entrada mínima de 20%.

**🔗 Demo:** [https://financing-simulation-kiwify.vercel.app/](https://financing-simulation-kiwify.vercel.app/)

## ✨ Funcionalidades

### 🏠 Simulador de Financiamento
- Interface clean e intuitiva em tela única
- Formulário de simulação com validação completa
- Cálculo automático com taxa de juros de 12% a.a.
- Entrada mínima obrigatória de 20% do valor do imóvel
- Máscaras de formatação para valores monetários
- Validação de CPF, email e telefone
- Responsivo para mobile e desktop

### 📊 Resultados da Simulação
- Exibição detalhada do valor das parcelas
- Apresentação dos valores totais do financiamento
- Resumo completo da proposta
- Interface otimizada para diferentes tamanhos de tela

### 📄 Assinatura Digital e Documentos
- Botão "Aceitar Proposta" na tela de resultados
- Geração automática de PDF com detalhes da proposta
- Sistema de assinatura digital integrado
- Download instantâneo do PDF assinado
- Armazenamento seguro dos documentos

### 🔐 Painel Administrativo
- Interface de administração protegida por senha
- Visualização de todas as submissões
- Listagem completa das propostas aceitas
- Dashboard com estatísticas básicas
- Sistema de autenticação simples

### 💾 Banco de Dados
- Armazenamento persistente das submissões
- Histórico completo das simulações realizadas
- Backup automático das propostas aceitas
- Estrutura otimizada para consultas rápidas

## 🚀 Tecnologias Utilizadas

- **Frontend:** React.js
- **Estilização:** TailwindCSS
- **Ícones:** Lucide React
- **Validações:** Validação customizada em JavaScript
- **PDF:** Geração dinâmica de documentos
- **Responsividade:** Mobile-first design
- **Deploy:** Vercel

## 📱 Compatibilidade

- ✅ Chrome (Desktop/Mobile)
- ✅ Firefox (Desktop/Mobile)
- ✅ Safari (Desktop/Mobile)
- ✅ Edge (Desktop/Mobile)
- ✅ Dispositivos iOS
- ✅ Dispositivos Android

## 🛠️ Instalação e Configuração

### Pré-requisitos
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Clone do Repositório
```bash
git clone https://github.com/seu-usuario/real-estate-financing-app.git
cd real-estate-financing-app
```

### Instalação das Dependências
```bash
npm install
```

### Configuração do Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis necessárias
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=your_admin_password
```

### Execução em Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
npm start
```

## 📐 Estrutura do Projeto

```
├── components/
│   ├── SimulationForm.js
│   ├── ResultsDisplay.js
│   ├── AdminPanel.js
│   └── PDFGenerator.js
├── pages/
│   ├── index.js
│   ├── admin.js
│   └── api/
│       ├── simulate.js
│       ├── submissions.js
│       └── generate-pdf.js
├── styles/
│   └── globals.css
├── utils/
│   ├── calculations.js
│   ├── validations.js
│   └── formatters.js
├── public/
│   └── assets/
└── database/
    └── schema.sql
```

## 🔢 Cálculos Financeiros

### Taxa de Juros
- **Taxa nominal:** 12% ao ano
- **Taxa efetiva mensal:** 0,9489% (juros compostos)
- **Sistema de amortização:** Tabela Price (SAC)

### Validações Implementadas
- Entrada mínima: 20% do valor do imóvel
- Valor máximo do imóvel: R$ 10.000.000,00
- Prazo: 12 a 420 meses (1 a 35 anos)
- CPF válido (algoritmo de verificação)
- Email em formato válido
- Telefone com DDD brasileiro

## 📋 Funcionalidades Detalhadas

### Simulador Principal
- [x] Campo valor do imóvel com máscara monetária
- [x] Cálculo automático da entrada mínima (20%)
- [x] Seleção do prazo de financiamento
- [x] Validação em tempo real
- [x] Prevenção de envio com dados inválidos
- [x] Feedback visual de erros

### Tela de Resultados
- [x] Valor da parcela mensal
- [x] Valor total a ser pago
- [x] Valor total dos juros
- [x] Resumo detalhado da operação
- [x] Botão de aceitar proposta
- [x] Design responsivo

### Sistema de PDF
- [x] Geração dinâmica com dados da simulação
- [x] Layout profissional e limpo
- [x] Campos para assinatura digital
- [x] Download automático
- [x] Numeração sequencial de contratos

### Painel Admin
- [x] Autenticação por senha
- [x] Lista de todas as submissões
- [x] Filtros por data e status
- [x] Exportação de dados
- [x] Dashboard com métricas

## 🔒 Segurança

- Validação de entrada em frontend e backend
- Sanitização de dados do usuário
- Proteção contra XSS e SQL Injection
- Autenticação segura no painel admin
- Criptografia dos dados sensíveis
- Rate limiting nas APIs

## 📊 Performance

- Carregamento inicial < 2s
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

## 🔄 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Outras Plataformas
- **Netlify:** Build command: `npm run build`
- **Heroku:** Adicionar buildpack Node.js
- **AWS:** Configurar S3 + CloudFront

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro de validação de CPF:**
```javascript
// Verificar se está usando a máscara correta
const cpfMask = value => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
```

**PDF não gera:**
```javascript
// Verificar dependências do PDF
npm install jspdf html2canvas
```

**Responsividade quebrada:**
```css
/* Verificar se o TailwindCSS está configurado corretamente */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📈 Métricas e Analytics

- Google Analytics integrado
- Tracking de conversões
- Heatmaps de usuário
- Métricas de performance
- Monitoramento de erros

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor Principal:** Seu Nome
- **UX/UI Designer:** Nome do Designer
- **Product Owner:** Nome do PO

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:

- **Email:** suporte@seudominio.com
- **Documentação:** [Wiki do Projeto](link-para-wiki)
- **Issues:** [GitHub Issues](link-para-issues)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
