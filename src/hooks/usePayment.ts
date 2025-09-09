import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import type { 
  PaymentStatus, 
  PaymentLink,
  PaymentRequest,
  RefundRequest 
} from '../types';

interface UsePaymentState {
  loading: boolean;
  error: string | null;
  paymentStatus: PaymentStatus | null;
  paymentLink: PaymentLink | null;
  transactionId: string | null;
}

interface UsePaymentActions {
  processPayment: (request: PaymentRequest) => Promise<void>;
  checkPaymentStatus: (paymentId: string) => Promise<PaymentStatus>;
  processRefund: (request: RefundRequest) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePayment = (): UsePaymentState & UsePaymentActions => {
  const [state, setState] = useState<UsePaymentState>({
    loading: false,
    error: null,
    paymentStatus: null,
    paymentLink: null,
    transactionId: null
  });

  const processPayment = useCallback(async (request: PaymentRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await paymentService.processPayment(request);
      
      setState(prev => ({
        ...prev,
        loading: false,
        paymentStatus: response.status,
        paymentLink: response.paymentLink || null,
        transactionId: response.transactionId || null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao processar pagamento'
      }));
    }
  }, []);

  const checkPaymentStatus = useCallback(async (paymentId: string): Promise<PaymentStatus> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const status = await paymentService.checkPaymentStatus(paymentId);
      
      setState(prev => ({
        ...prev,
        loading: false,
        paymentStatus: status
      }));

      return status;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar status do pagamento'
      }));
      
      throw error;
    }
  }, []);

  const processRefund = useCallback(async (request: RefundRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await paymentService.processRefund(request);
      
      setState(prev => ({
        ...prev,
        loading: false,
        paymentStatus: 'refunded'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao processar estorno'
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      paymentStatus: null,
      paymentLink: null,
      transactionId: null
    });
  }, []);

  return {
    ...state,
    processPayment,
    checkPaymentStatus,
    processRefund,
    clearError,
    reset
  };
};

// Hook específico para PIX
export const usePixPayment = () => {
  const payment = usePayment();

  const generatePixPayment = useCallback(async (
    amount: number,
    description: string,
    customerData: PaymentRequest['customerData']
  ) => {
    const request: PaymentRequest = {
      amount,
      currency: 'BRL',
      description,
      paymentMethod: 'pix',
      customerData
    };

    await payment.processPayment(request);
  }, [payment]);

  return {
    ...payment,
    generatePixPayment
  };
};

// Hook específico para cartão
export const useCardPayment = () => {
  const payment = usePayment();

  const processCardPayment = useCallback(async (
    amount: number,
    description: string,
    customerData: PaymentRequest['customerData'],
    cardData: {
      number: string;
      holder: string;
      expiry: string;
      cvv: string;
      installments?: number;
    }
  ) => {
    const request: PaymentRequest = {
      amount,
      currency: 'BRL',
      description,
      paymentMethod: cardData.installments ? 'creditCard' : 'debitCard',
      customerData,
      metadata: {
        cardNumber: cardData.number,
        cardHolder: cardData.holder,
        expiryDate: cardData.expiry,
        cvv: cardData.cvv,
        installments: cardData.installments?.toString() || '1'
      }
    };

    await payment.processPayment(request);
  }, [payment]);

  return {
    ...payment,
    processCardPayment
  };
};

// Hook específico para boleto
export const useBoletoPayment = () => {
  const payment = usePayment();

  const generateBoletoPayment = useCallback(async (
    amount: number,
    description: string,
    customerData: PaymentRequest['customerData']
  ) => {
    const request: PaymentRequest = {
      amount,
      currency: 'BRL',
      description,
      paymentMethod: 'boleto',
      customerData
    };

    await payment.processPayment(request);
  }, [payment]);

  return {
    ...payment,
    generateBoletoPayment
  };
};

// Hook para gerenciar estornos
export const useRefund = () => {
  const payment = usePayment();

  const requestRefund = useCallback(async (
    paymentId: string,
    amount: number,
    reason: string,
    notes?: string
  ) => {
    const request: RefundRequest = {
      paymentId,
      amount,
      reason,
      notes
    };

    await payment.processRefund(request);
  }, [payment]);

  return {
    ...payment,
    requestRefund
  };
};
