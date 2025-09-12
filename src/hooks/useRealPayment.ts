import { useState, useCallback } from 'react';
import { realPaymentService } from '../services/realPaymentService';
import type { 
  PaymentStatus, 
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse
} from '../types';

interface UseRealPaymentReturn {
  // Estados
  isLoading: boolean;
  error: string | null;
  paymentStatus: PaymentStatus | null;
  currentPayment: PaymentResponse | null;
  
  // Ações
  processPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  checkPaymentStatus: (paymentId: string, gateway?: 'stripe' | 'pagseguro' | 'pix') => Promise<PaymentStatus>;
  processRefund: (request: RefundRequest) => Promise<RefundResponse>;
  clearError: () => void;
  reset: () => void;
  
  // Utilitários
  isGatewayAvailable: (gateway: 'stripe' | 'pagseguro' | 'pix') => boolean;
  getAvailableGateways: () => ('stripe' | 'pagseguro' | 'pix')[];
}

export const useRealPayment = (): UseRealPaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [currentPayment, setCurrentPayment] = useState<PaymentResponse | null>(null);

  const processPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentStatus('pending');

      const response = await realPaymentService.processPayment(request);
      
      setCurrentPayment(response);
      setPaymentStatus(response.status);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
      setPaymentStatus('cancelled');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (
    paymentId: string, 
    gateway?: 'stripe' | 'pagseguro' | 'pix'
  ): Promise<PaymentStatus> => {
    try {
      setIsLoading(true);
      setError(null);

      const status = await realPaymentService.checkPaymentStatus(paymentId, gateway);
      setPaymentStatus(status);
      
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processRefund = useCallback(async (request: RefundRequest): Promise<RefundResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await realPaymentService.processRefund(request);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar estorno';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setPaymentStatus(null);
    setCurrentPayment(null);
  }, []);

  const isGatewayAvailable = useCallback((gateway: 'stripe' | 'pagseguro' | 'pix'): boolean => {
    return realPaymentService.isGatewayAvailable(gateway);
  }, []);

  const getAvailableGateways = useCallback((): ('stripe' | 'pagseguro' | 'pix')[] => {
    const gateways: ('stripe' | 'pagseguro' | 'pix')[] = [];
    
    if (isGatewayAvailable('stripe')) {
      gateways.push('stripe');
    }
    if (isGatewayAvailable('pagseguro')) {
      gateways.push('pagseguro');
    }
    if (isGatewayAvailable('pix')) {
      gateways.push('pix');
    }
    
    return gateways;
  }, [isGatewayAvailable]);

  return {
    // Estados
    isLoading,
    error,
    paymentStatus,
    currentPayment,
    
    // Ações
    processPayment,
    checkPaymentStatus,
    processRefund,
    clearError,
    reset,
    
    // Utilitários
    isGatewayAvailable,
    getAvailableGateways
  };
};
