import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import QRCode from 'qrcode';
import type { 
  PaymentMethod, 
  PaymentStatus, 
  PaymentLink,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse
} from '../types';

// Interfaces para configuração dos gateways
interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  currency: string;
}

interface PagSeguroConfig {
  email: string;
  token: string;
  sandbox: boolean;
  currency: string;
}

interface PixConfig {
  clientId: string;
  clientSecret: string;
  certificatePath: string;
  environment: 'sandbox' | 'production';
}

interface GatewayConfig {
  stripe: StripeConfig;
  pagseguro: PagSeguroConfig;
  pix: PixConfig;
  defaultGateway: 'stripe' | 'pagseguro' | 'pix';
}

// Interface para resposta unificada dos gateways
interface UnifiedPaymentResponse {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  paymentLink?: PaymentLink;
  error?: string;
  gatewayData?: any;
}

class RealPaymentService {
  private config: GatewayConfig;
  private stripe: Stripe | null = null;
  private stripeElements: StripeElements | null = null;

  constructor() {
    // Configuração inicial - em produção viria das variáveis de ambiente
    this.config = {
      stripe: {
        publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock_key',
        secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_mock_secret',
        webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || 'whsec_mock_webhook',
        currency: 'BRL'
      },
      pagseguro: {
        email: import.meta.env.VITE_PAGSEGURO_EMAIL || 'test@pagseguro.com',
        token: import.meta.env.VITE_PAGSEGURO_TOKEN || 'mock_token',
        sandbox: import.meta.env.VITE_PAGSEGURO_SANDBOX === 'true',
        currency: 'BRL'
      },
      pix: {
        clientId: import.meta.env.VITE_PIX_CLIENT_ID || 'mock_client_id',
        clientSecret: import.meta.env.VITE_PIX_CLIENT_SECRET || 'mock_client_secret',
        certificatePath: import.meta.env.VITE_PIX_CERTIFICATE_PATH || '/path/to/cert.pem',
        environment: (import.meta.env.VITE_PIX_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
      },
      defaultGateway: (import.meta.env.VITE_DEFAULT_GATEWAY as 'stripe' | 'pagseguro' | 'pix') || 'stripe'
    };

    this.initializeStripe();
  }

  /**
   * Inicializa o Stripe
   */
  private async initializeStripe(): Promise<void> {
    if (this.config.stripe.publicKey && this.config.stripe.publicKey !== 'pk_test_mock_key') {
      try {
        this.stripe = await loadStripe(this.config.stripe.publicKey);
      } catch (error) {
        console.error('Erro ao inicializar Stripe:', error);
      }
    }
  }

  /**
   * Processa um pagamento usando o gateway apropriado
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Determinar o gateway baseado no método de pagamento
      const gateway = this.selectGateway(request.paymentMethod);
      
      let response: UnifiedPaymentResponse;

      switch (gateway) {
        case 'stripe':
          response = await this.processStripePayment(request);
          break;
        case 'pagseguro':
          response = await this.processPagSeguroPayment(request);
          break;
        case 'pix':
          response = await this.processPixPayment(request);
          break;
        default:
          throw new Error(`Gateway não suportado: ${gateway}`);
      }

      if (!response.success) {
        throw new Error(response.error || 'Erro ao processar pagamento');
      }

      return {
        id: response.paymentId,
        status: response.status,
        paymentLink: response.paymentLink,
        gatewayResponse: response.gatewayData
      };
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  /**
   * Seleciona o gateway apropriado baseado no método de pagamento
   */
  private selectGateway(paymentMethod: PaymentMethod): 'stripe' | 'pagseguro' | 'pix' {
    switch (paymentMethod) {
      case 'creditCard':
      case 'debitCard':
        return this.config.defaultGateway === 'stripe' ? 'stripe' : 'pagseguro';
      case 'pix':
        return 'pix';
      case 'boleto':
        return 'pagseguro';
      default:
        return this.config.defaultGateway;
    }
  }

  /**
   * Processa pagamento via Stripe
   */
  private async processStripePayment(request: PaymentRequest): Promise<UnifiedPaymentResponse> {
    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    try {
      // Em produção, seria feita uma chamada para o backend
      // que criaria um PaymentIntent no Stripe
      const mockPaymentIntent = {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        status: 'requires_payment_method'
      };

      // Simular criação de PaymentIntent
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paymentLink: PaymentLink = {
        id: mockPaymentIntent.id,
        appointmentId: 0, // Será definido pelo contexto
        amount: request.amount,
        description: request.description,
        url: `https://checkout.stripe.com/pay/${mockPaymentIntent.id}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
        status: 'active',
        createdAt: new Date().toISOString(),
        paymentMethod: request.paymentMethod
      };

      return {
        success: true,
        paymentId: mockPaymentIntent.id,
        status: 'pending',
        paymentLink,
        gatewayData: {
          paymentIntentId: mockPaymentIntent.id,
          clientSecret: mockPaymentIntent.client_secret
        }
      };
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'cancelled',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Processa pagamento via PagSeguro
   */
  private async processPagSeguroPayment(request: PaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      // Simular chamada para API do PagSeguro
      const mockTransaction = {
        code: `TXN${Date.now()}`,
        reference: `REF${Date.now()}`,
        status: 'PENDING'
      };

      await new Promise(resolve => setTimeout(resolve, 1500));

      let paymentLink: PaymentLink;

      if (request.paymentMethod === 'pix') {
        // PIX via PagSeguro
        const pixCode = this.generatePixCode(request.amount, request.description);
        const qrCode = await this.generateQRCode(pixCode);

        paymentLink = {
          id: mockTransaction.code,
          appointmentId: 0,
          amount: request.amount,
          description: request.description,
          url: `https://pagseguro.uol.com.br/pix/${mockTransaction.code}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          createdAt: new Date().toISOString(),
          paymentMethod: 'pix',
          pixCode,
          qrCode
        };
      } else if (request.paymentMethod === 'boleto') {
        // Boleto via PagSeguro
        const boletoData = this.generateBoletoData(request);

        paymentLink = {
          id: mockTransaction.code,
          appointmentId: 0,
          amount: request.amount,
          description: request.description,
          url: `https://pagseguro.uol.com.br/boleto/${mockTransaction.code}`,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          createdAt: new Date().toISOString(),
          paymentMethod: 'boleto',
          boletoUrl: boletoData.url
        };
      } else {
        // Cartão via PagSeguro
        paymentLink = {
          id: mockTransaction.code,
          appointmentId: 0,
          amount: request.amount,
          description: request.description,
          url: `https://pagseguro.uol.com.br/checkout/${mockTransaction.code}`,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          status: 'active',
          createdAt: new Date().toISOString(),
          paymentMethod: request.paymentMethod
        };
      }

      return {
        success: true,
        paymentId: mockTransaction.code,
        status: 'pending',
        paymentLink,
        gatewayData: {
          transactionCode: mockTransaction.code,
          reference: mockTransaction.reference
        }
      };
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'cancelled',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Processa pagamento PIX direto
   */
  private async processPixPayment(request: PaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      // Simular chamada para API PIX
      const pixCode = this.generatePixCode(request.amount, request.description);
      const qrCode = await this.generateQRCode(pixCode);

      const paymentId = `PIX${Date.now()}`;

      const paymentLink: PaymentLink = {
        id: paymentId,
        appointmentId: 0,
        amount: request.amount,
        description: request.description,
        url: `https://pix.cliniflow.com/${paymentId}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        paymentMethod: 'pix',
        pixCode,
        qrCode
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        paymentId,
        status: 'pending',
        paymentLink,
        gatewayData: {
          pixCode,
          qrCode
        }
      };
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'cancelled',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verifica o status de um pagamento
   */
  async checkPaymentStatus(_paymentId: string, _gateway?: 'stripe' | 'pagseguro' | 'pix'): Promise<PaymentStatus> {
    try {
      // Simular verificação de status
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock: 85% dos pagamentos são aprovados
      const isApproved = Math.random() > 0.15;
      return isApproved ? 'paid' : 'pending';
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return 'cancelled';
    }
  }

  /**
   * Processa um estorno
   */
  async processRefund(_request: RefundRequest): Promise<RefundResponse> {
    try {
      // Simular processamento de estorno
      await new Promise(resolve => setTimeout(resolve, 2000));

      const refundId = `refund_${Date.now()}`;
      const estimatedDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

      return {
        id: refundId,
        status: 'processing',
        refundId,
        estimatedDate
      };
    } catch (error) {
      console.error('Erro ao processar estorno:', error);
      throw new Error('Falha ao processar estorno');
    }
  }

  /**
   * Cria elementos de pagamento do Stripe
   */
  async createStripeElements(clientSecret: string, containerId: string): Promise<StripeElements | null> {
    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    try {
      this.stripeElements = this.stripe.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3B82F6',
            colorBackground: '#ffffff',
            colorText: '#1F2937',
            colorDanger: '#EF4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      });

      const paymentElement = this.stripeElements.create('payment');
      paymentElement.mount(`#${containerId}`);

      return this.stripeElements;
    } catch (error) {
      console.error('Erro ao criar elementos do Stripe:', error);
      return null;
    }
  }

  /**
   * Confirma pagamento do Stripe
   */
  async confirmStripePayment(clientSecret: string): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe || !this.stripeElements) {
      return { success: false, error: 'Stripe não inicializado' };
    }

    try {
      const { error } = await this.stripe.confirmPayment({
        elements: this.stripeElements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  /**
   * Gera código PIX
   */
  private generatePixCode(amount: number, _description: string): string {
    const pixKey = 'cliniflow@pagamento.com';
    const merchantName = 'CliniFlow';
    const city = 'São Paulo';
    const amountFormatted = amount.toFixed(2);
    
    // Código PIX simplificado (em produção seria gerado pelo gateway)
    return `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${amountFormatted}5802BR5913${merchantName}6009${city}62070503***6304`;
  }

  /**
   * Gera QR Code para PIX
   */
  private async generateQRCode(pixCode: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(pixCode, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      // Fallback para QR Code mockado
      return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    }
  }

  /**
   * Gera dados do boleto
   */
  private generateBoletoData(request: PaymentRequest) {
    const boletoId = `boleto_${Date.now()}`;
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    
    return {
      id: boletoId,
      amount: request.amount,
      dueDate: dueDate.toISOString(),
      barcode: '23791' + Math.random().toString().slice(2, 15) + Math.random().toString().slice(2, 15),
      digitableLine: '23791' + Math.random().toString().slice(2, 5) + '.' + 
                    Math.random().toString().slice(2, 8) + ' ' + 
                    Math.random().toString().slice(2, 8) + '.' + 
                    Math.random().toString().slice(2, 8) + ' ' + 
                    Math.random().toString().slice(2, 8) + '.' + 
                    Math.random().toString().slice(2, 8) + ' ' + 
                    Math.random().toString().slice(2, 2) + ' ' + 
                    Math.random().toString().slice(2, 14),
      payerName: request.customerData.name,
      payerDocument: request.customerData.document,
      description: request.description,
      url: `https://payment.cliniflow.com/boleto/${boletoId}`,
      status: 'pending' as const
    };
  }

  /**
   * Processa webhooks dos gateways
   */
  async processWebhook(payload: any, signature: string, gateway: 'stripe' | 'pagseguro' | 'pix'): Promise<void> {
    try {
      switch (gateway) {
        case 'stripe':
          await this.processStripeWebhook(payload, signature);
          break;
        case 'pagseguro':
          await this.processPagSeguroWebhook(payload);
          break;
        case 'pix':
          await this.processPixWebhook(payload);
          break;
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }

  private async processStripeWebhook(payload: any, _signature: string): Promise<void> {
    // Em produção, validaria a assinatura do webhook
    console.log('Processando webhook do Stripe:', payload.type);
    
    // Processar eventos do Stripe
    switch (payload.type) {
      case 'payment_intent.succeeded':
        console.log('Pagamento aprovado:', payload.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('Pagamento falhou:', payload.data.object.id);
        break;
    }
  }

  private async processPagSeguroWebhook(payload: any): Promise<void> {
    console.log('Processando webhook do PagSeguro:', payload.notificationType);
    
    // Processar notificações do PagSeguro
    if (payload.notificationType === 'TRANSACTION') {
      console.log('Status da transação:', payload.transaction.status);
    }
  }

  private async processPixWebhook(payload: any): Promise<void> {
    console.log('Processando webhook do PIX:', payload.evento);
    
    // Processar eventos do PIX
    if (payload.evento === 'pix.payment.received') {
      console.log('PIX recebido:', payload.pix);
    }
  }

  /**
   * Obtém configurações dos gateways
   */
  getGatewayConfig(): GatewayConfig {
    return this.config;
  }

  /**
   * Atualiza configurações dos gateways
   */
  updateGatewayConfig(newConfig: Partial<GatewayConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Verifica se um gateway está disponível
   */
  isGatewayAvailable(gateway: 'stripe' | 'pagseguro' | 'pix'): boolean {
    switch (gateway) {
      case 'stripe':
        return this.stripe !== null;
      case 'pagseguro':
        return this.config.pagseguro.token !== 'mock_token';
      case 'pix':
        return this.config.pix.clientId !== 'mock_client_id';
      default:
        return false;
    }
  }
}

// Instância singleton do serviço
export const realPaymentService = new RealPaymentService();

// Exportar tipos
export type { GatewayConfig, UnifiedPaymentResponse };
