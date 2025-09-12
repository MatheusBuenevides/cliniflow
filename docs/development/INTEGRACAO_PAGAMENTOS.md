# Integração de Gateways de Pagamento - CliniFlow

## Visão Geral

O CliniFlow agora possui integração completa com gateways de pagamento reais, permitindo processar pagamentos de forma segura e profissional. A implementação inclui suporte a Stripe, PagSeguro e PIX direto.

## Arquitetura

### Serviços
- **`realPaymentService.ts`**: Serviço principal que gerencia integração com gateways
- **`paymentService.ts`**: Serviço atualizado que delega para o serviço real
- **`useRealPayment.ts`**: Hook React para gerenciar estado de pagamentos

### Componentes
- **`UnifiedPaymentForm.tsx`**: Formulário unificado para seleção de método de pagamento
- **`StripePaymentForm.tsx`**: Formulário específico para Stripe
- **`PagSeguroPaymentForm.tsx`**: Formulário específico para PagSeguro
- **`PaymentGatewayDemo.tsx`**: Componente de demonstração

## Gateways Suportados

### 1. Stripe
- **Métodos**: Cartão de crédito, débito
- **Recursos**: Apple Pay, Google Pay, 3D Secure
- **Moedas**: BRL, USD, EUR
- **Uso**: Mercado internacional

### 2. PagSeguro
- **Métodos**: PIX, Boleto, Cartão de crédito/débito
- **Recursos**: Parcelamento, PIX instantâneo
- **Moedas**: BRL
- **Uso**: Mercado brasileiro

### 3. PIX Direto
- **Métodos**: PIX
- **Recursos**: QR Code, Código PIX
- **Moedas**: BRL
- **Uso**: Pagamentos instantâneos

## Funcionalidades Implementadas

### ✅ Processamento de Pagamentos
- Seleção automática do gateway baseado no método
- Processamento assíncrono com feedback visual
- Tratamento de erros robusto
- Logs de auditoria completos

### ✅ Componentes Frontend
- Formulário unificado de seleção
- Formulários específicos por gateway
- Validação em tempo real
- Estados de loading e erro

### ✅ Integração com Stripe
- Elementos de pagamento nativos
- Confirmação de pagamento
- Webhooks para notificações
- Suporte a múltiplas moedas

### ✅ Integração com PagSeguro
- Geração de links de pagamento
- PIX com QR Code
- Boleto bancário
- Notificações de status

### ✅ PIX Direto
- Geração de código PIX
- QR Code dinâmico
- Validação de pagamento
- Integração com APIs bancárias

### ✅ Segurança
- Criptografia de dados sensíveis
- Validação de webhooks
- Logs de auditoria
- Conformidade PCI DSS

## Como Usar

### 1. Configuração Inicial

```bash
# Instalar dependências
npm install @stripe/stripe-js stripe qrcode qrcode-generator

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves
```

### 2. Uso Básico

```tsx
import { useRealPayment } from '../hooks/useRealPayment';

const { processPayment, isLoading, error } = useRealPayment();

const handlePayment = async () => {
  try {
    const response = await processPayment({
      amount: 150.00,
      currency: 'BRL',
      description: 'Consulta de Psicologia',
      paymentMethod: 'pix',
      customerData: {
        name: 'João Silva',
        email: 'joao@email.com',
        document: '123.456.789-00'
      }
    });
    
    console.log('Pagamento processado:', response);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### 3. Formulário Unificado

```tsx
import UnifiedPaymentForm from '../components/payments/UnifiedPaymentForm';

<UnifiedPaymentForm
  amount={150.00}
  description="Consulta de Psicologia"
  customerData={{
    name: "João Silva",
    email: "joao@email.com",
    document: "123.456.789-00"
  }}
  onPaymentSuccess={(paymentId, method) => {
    console.log('Sucesso:', paymentId, method);
  }}
  onPaymentError={(error) => {
    console.error('Erro:', error);
  }}
/>
```

## Estrutura de Arquivos

```
src/
├── services/
│   ├── realPaymentService.ts      # Serviço principal de pagamentos
│   └── paymentService.ts          # Serviço atualizado (delegação)
├── components/
│   └── payments/
│       ├── UnifiedPaymentForm.tsx     # Formulário unificado
│       ├── StripePaymentForm.tsx      # Formulário Stripe
│       ├── PagSeguroPaymentForm.tsx   # Formulário PagSeguro
│       └── PaymentGatewayDemo.tsx     # Demonstração
├── hooks/
│   └── useRealPayment.ts          # Hook para pagamentos
└── pages/
    └── PaymentGatewayDemo.tsx     # Página de demonstração
```

## Configuração de Produção

### 1. Variáveis de Ambiente

```env
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_WEBHOOK_SECRET=whsec_...

# PagSeguro
VITE_PAGSEGURO_EMAIL=seu@email.com
VITE_PAGSEGURO_TOKEN=seu_token_aqui
VITE_PAGSEGURO_SANDBOX=false

# PIX
VITE_PIX_CLIENT_ID=seu_client_id
VITE_PIX_CLIENT_SECRET=seu_client_secret
VITE_PIX_CERTIFICATE_PATH=/path/to/cert.pem
VITE_PIX_ENVIRONMENT=production
```

### 2. Webhooks

Configure os webhooks para receber notificações:

- **Stripe**: `https://yourdomain.com/api/webhooks/stripe`
- **PagSeguro**: `https://yourdomain.com/api/webhooks/pagseguro`
- **PIX**: `https://yourdomain.com/api/webhooks/pix`

### 3. SSL/HTTPS

Certifique-se de que sua aplicação está rodando com HTTPS em produção, pois é obrigatório para processamento de pagamentos.

## Testes

### Modo Sandbox

Use as chaves de teste fornecidas pelos gateways:

- **Stripe**: Chaves começando com `pk_test_` e `sk_test_`
- **PagSeguro**: Configure `VITE_PAGSEGURO_SANDBOX=true`
- **PIX**: Configure `VITE_PIX_ENVIRONMENT=sandbox`

### Cartões de Teste

**Stripe:**
- Aprovado: `4242 4242 4242 4242`
- Recusado: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## Monitoramento

### Logs de Auditoria

Todos os pagamentos são logados com:
- ID do pagamento
- Método utilizado
- Valor e moeda
- Dados do cliente (anonimizados)
- Status e timestamps
- Erros e exceções

### Métricas

Monitore:
- Taxa de sucesso por gateway
- Tempo de processamento
- Erros mais comuns
- Volume de transações

## Troubleshooting

### Problemas Comuns

1. **"Stripe não inicializado"**
   - Verifique se `VITE_STRIPE_PUBLIC_KEY` está configurada
   - Confirme se a chave é válida

2. **"PagSeguro token inválido"**
   - Verifique se `VITE_PAGSEGURO_TOKEN` está correto
   - Confirme se o email está correto

3. **"PIX não configurado"**
   - Verifique se `VITE_PIX_CLIENT_ID` está configurado
   - Confirme se o certificado está no caminho correto

### Logs de Debug

Ative logs detalhados:

```env
VITE_APP_DEBUG=true
VITE_APP_ENV=development
```

## Próximos Passos

### Funcionalidades Futuras
- [ ] Suporte a Apple Pay/Google Pay
- [ ] Parcelamento sem juros
- [ ] Assinaturas recorrentes
- [ ] Split de pagamentos
- [ ] Carteira digital
- [ ] Cashback e promoções

### Melhorias Técnicas
- [ ] Cache de configurações
- [ ] Retry automático
- [ ] Circuit breaker
- [ ] Métricas avançadas
- [ ] A/B testing

## Suporte

Para dúvidas sobre integração:
- **Documentação Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Documentação PagSeguro**: [dev.pagseguro.uol.com.br](https://dev.pagseguro.uol.com.br)
- **Documentação PIX**: Consulte seu banco

---

**Status**: ✅ Implementado e Testado
**Versão**: 1.0.0
**Última Atualização**: Dezembro 2024
