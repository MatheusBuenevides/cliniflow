# Configuração de Gateways de Pagamento

Este documento descreve como configurar os gateways de pagamento integrados no CliniFlow.

## Gateways Suportados

### 1. Stripe (Internacional)
- **Uso**: Cartões de crédito e débito internacionais
- **Moedas**: BRL, USD, EUR
- **Recursos**: Apple Pay, Google Pay, 3D Secure

### 2. PagSeguro (Brasileiro)
- **Uso**: PIX, Boleto, Cartões nacionais
- **Moedas**: BRL
- **Recursos**: Parcelamento, PIX instantâneo

### 3. PIX Direto
- **Uso**: Pagamentos instantâneos
- **Moedas**: BRL
- **Recursos**: QR Code, Código PIX

## Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Stripe (Gateway Internacional)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# PagSeguro (Gateway Brasileiro)
VITE_PAGSEGURO_EMAIL=your_email@pagseguro.com
VITE_PAGSEGURO_TOKEN=your_pagseguro_token_here
VITE_PAGSEGURO_SANDBOX=true

# PIX (Pagamento Instantâneo)
VITE_PIX_CLIENT_ID=your_pix_client_id_here
VITE_PIX_CLIENT_SECRET=your_pix_client_secret_here
VITE_PIX_CERTIFICATE_PATH=/path/to/your/certificate.pem
VITE_PIX_ENVIRONMENT=sandbox

# Gateway Padrão (stripe, pagseguro, pix)
VITE_DEFAULT_GATEWAY=stripe

# Configurações de Desenvolvimento
VITE_APP_ENV=development
VITE_APP_DEBUG=true
```

## Configuração do Stripe

### 1. Criar Conta
1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta de desenvolvedor
3. Acesse o Dashboard

### 2. Obter Chaves
1. Vá para **Developers > API Keys**
2. Copie a **Publishable key** (pk_test_...)
3. Copie a **Secret key** (sk_test_...)

### 3. Configurar Webhooks
1. Vá para **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o **Signing secret** (whsec_...)

## Configuração do PagSeguro

### 1. Criar Conta
1. Acesse [pagseguro.uol.com.br](https://pagseguro.uol.com.br)
2. Crie uma conta de desenvolvedor
3. Acesse o painel administrativo

### 2. Obter Credenciais
1. Vá para **Integrações > API**
2. Copie o **Email** da conta
3. Gere um **Token** de integração
4. Configure o ambiente (Sandbox/Produção)

### 3. Configurar Notificações
1. Vá para **Integrações > Notificações**
2. URL: `https://yourdomain.com/api/webhooks/pagseguro`
3. Eventos: `TRANSACTION`, `PIX`

## Configuração do PIX

### 1. Configurar Banco
1. Entre em contato com seu banco
2. Solicite acesso à API PIX
3. Obtenha certificado digital

### 2. Configurar Aplicação
1. Registre sua aplicação no banco
2. Obtenha **Client ID** e **Client Secret**
3. Configure o certificado digital

## Uso nos Componentes

### Formulário Unificado
```tsx
import UnifiedPaymentForm from '../components/payments/UnifiedPaymentForm';

<UnifiedPaymentForm
  amount={150.00}
  description="Consulta de Psicologia"
  customerData={{
    name: "João Silva",
    email: "joao@email.com",
    document: "123.456.789-00",
    phone: "(11) 99999-9999"
  }}
  onPaymentSuccess={(paymentId, method) => {
    console.log('Pagamento aprovado:', paymentId, method);
  }}
  onPaymentError={(error) => {
    console.error('Erro no pagamento:', error);
  }}
/>
```

### Hook de Pagamento
```tsx
import { useRealPayment } from '../hooks/useRealPayment';

const { processPayment, isLoading, error } = useRealPayment();

const handlePayment = async () => {
  try {
    const response = await processPayment({
      amount: 150.00,
      currency: 'BRL',
      description: 'Consulta',
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

## Testes

### Modo Sandbox
- Use chaves de teste para desenvolvimento
- Pagamentos não são processados realmente
- Use cartões de teste do Stripe

### Cartões de Teste (Stripe)
- **Aprovado**: 4242 4242 4242 4242
- **Recusado**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

### PIX de Teste
- Use valores pequenos para teste
- QR Code será gerado normalmente
- Pagamento será simulado

## Produção

### Checklist de Produção
- [ ] Substituir chaves de teste por chaves de produção
- [ ] Configurar webhooks com URLs reais
- [ ] Testar todos os métodos de pagamento
- [ ] Configurar monitoramento de erros
- [ ] Implementar logs de auditoria
- [ ] Configurar backup de transações

### Segurança
- Nunca commite chaves de produção
- Use variáveis de ambiente
- Configure HTTPS obrigatório
- Implemente rate limiting
- Monitore tentativas de fraude

## Troubleshooting

### Erro: "Stripe não inicializado"
- Verifique se `VITE_STRIPE_PUBLIC_KEY` está configurada
- Confirme se a chave é válida
- Verifique se não há erros de CORS

### Erro: "PagSeguro token inválido"
- Verifique se `VITE_PAGSEGURO_TOKEN` está correto
- Confirme se o email está correto
- Verifique se está no ambiente correto (sandbox/produção)

### Erro: "PIX não configurado"
- Verifique se `VITE_PIX_CLIENT_ID` está configurado
- Confirme se o certificado está no caminho correto
- Verifique se as permissões estão corretas

## Suporte

Para dúvidas sobre configuração:
- **Stripe**: [support.stripe.com](https://support.stripe.com)
- **PagSeguro**: [dev.pagseguro.uol.com.br](https://dev.pagseguro.uol.com.br)
- **PIX**: Entre em contato com seu banco
