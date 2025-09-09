import { apiClient } from './api';
import type { 
  Transaction, 
  FinancialReport, 
  TransactionFilters,
  TransactionCategoryConfig,
  RecurrenceConfig,
  ReceiptFile,
  BankReconciliation,
  PaymentDueAlert
} from '../types';

// Serviço para gerenciar dados financeiros
export class FinancialService {
  // Buscar transações com filtros
  async getTransactions(filters?: TransactionFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.status) queryParams.append('status', filters.status);

    const endpoint = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<Transaction[]>(endpoint);
  }

  // Buscar transação por ID
  async getTransactionById(id: number) {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  }

  // Criar nova transação
  async createTransaction(data: Partial<Transaction>) {
    return apiClient.post<Transaction>('/transactions', data);
  }

  // Atualizar transação
  async updateTransaction(id: number, data: Partial<Transaction>) {
    return apiClient.put<Transaction>(`/transactions/${id}`, data);
  }

  // Deletar transação
  async deleteTransaction(id: number) {
    return apiClient.delete(`/transactions/${id}`);
  }

  // Gerar relatório financeiro
  async getFinancialReport(startDate: string, endDate: string) {
    return apiClient.get<FinancialReport>(`/financials/report?startDate=${startDate}&endDate=${endDate}`);
  }

  // Buscar receita mensal
  async getMonthlyRevenue(year: number) {
    return apiClient.get(`/financials/revenue/monthly?year=${year}`);
  }

  // Buscar estatísticas financeiras
  async getFinancialStats() {
    return apiClient.get('/financials/stats');
  }

  // ===== GESTÃO DE CATEGORIAS =====
  
  // Buscar categorias personalizadas
  async getCustomCategories(psychologistId: number) {
    return apiClient.get<TransactionCategoryConfig[]>(`/financials/categories?psychologistId=${psychologistId}`);
  }

  // Criar nova categoria
  async createCategory(categoryData: Omit<TransactionCategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<TransactionCategoryConfig>('/financials/categories', categoryData);
  }

  // Atualizar categoria
  async updateCategory(id: string, categoryData: Partial<TransactionCategoryConfig>) {
    return apiClient.put<TransactionCategoryConfig>(`/financials/categories/${id}`, categoryData);
  }

  // Deletar categoria
  async deleteCategory(id: string) {
    return apiClient.delete(`/financials/categories/${id}`);
  }

  // ===== GESTÃO DE RECORRÊNCIA =====
  
  // Criar transações recorrentes
  async createRecurringTransactions(parentTransactionId: number, recurrenceConfig: RecurrenceConfig) {
    return apiClient.post<Transaction[]>('/financials/recurring', {
      parentTransactionId,
      recurrenceConfig
    });
  }

  // Buscar transações recorrentes
  async getRecurringTransactions(psychologistId: number) {
    return apiClient.get<Transaction[]>(`/financials/recurring?psychologistId=${psychologistId}`);
  }

  // Pausar/reativar recorrência
  async toggleRecurrence(transactionId: number, isActive: boolean) {
    return apiClient.patch(`/financials/recurring/${transactionId}`, { isActive });
  }

  // ===== UPLOAD DE COMPROVANTES =====
  
  // Upload de arquivo de comprovante
  async uploadReceipt(transactionId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('transactionId', transactionId.toString());
    
    return apiClient.post<ReceiptFile>('/financials/receipts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Download de comprovante
  async downloadReceipt(receiptId: string) {
    return apiClient.get(`/financials/receipts/${receiptId}/download`, {
      responseType: 'blob'
    });
  }

  // Deletar comprovante
  async deleteReceipt(receiptId: string) {
    return apiClient.delete(`/financials/receipts/${receiptId}`);
  }

  // ===== CONCILIAÇÃO BANCÁRIA =====
  
  // Buscar conciliações
  async getBankReconciliations(psychologistId: number, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    params.append('psychologistId', psychologistId.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return apiClient.get<BankReconciliation[]>(`/financials/reconciliations?${params.toString()}`);
  }

  // Criar conciliação
  async createReconciliation(reconciliationData: Omit<BankReconciliation, 'id' | 'reconciledAt'>) {
    return apiClient.post<BankReconciliation>('/financials/reconciliations', reconciliationData);
  }

  // Atualizar conciliação
  async updateReconciliation(id: string, reconciliationData: Partial<BankReconciliation>) {
    return apiClient.put<BankReconciliation>(`/financials/reconciliations/${id}`, reconciliationData);
  }

  // ===== ALERTAS DE VENCIMENTO =====
  
  // Buscar alertas de vencimento
  async getPaymentDueAlerts(psychologistId: number) {
    return apiClient.get<PaymentDueAlert[]>(`/financials/alerts/due?psychologistId=${psychologistId}`);
  }

  // Marcar alerta como lido
  async markAlertAsRead(alertId: string) {
    return apiClient.patch(`/financials/alerts/${alertId}/read`);
  }

  // ===== AÇÕES EM LOTE =====
  
  // Editar transações em lote
  async bulkUpdateTransactions(transactionIds: number[], updates: Partial<Transaction>) {
    return apiClient.patch('/financials/transactions/bulk', {
      transactionIds,
      updates
    });
  }

  // Deletar transações em lote
  async bulkDeleteTransactions(transactionIds: number[]) {
    return apiClient.delete('/financials/transactions/bulk', {
      data: { transactionIds }
    });
  }

  // Exportar transações
  async exportTransactions(filters: TransactionFilters, format: 'csv' | 'excel' | 'pdf') {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    queryParams.append('format', format);
    
    return apiClient.get(`/financials/transactions/export?${queryParams.toString()}`, {
      responseType: 'blob'
    });
  }

  // ===== VALIDAÇÕES =====
  
  // Validar duplicação de transação
  async validateTransactionDuplication(transactionData: Partial<Transaction>) {
    return apiClient.post<{ isDuplicate: boolean; similarTransactions: Transaction[] }>(
      '/financials/transactions/validate-duplication',
      transactionData
    );
  }

  // Buscar transações similares
  async findSimilarTransactions(transactionData: Partial<Transaction>) {
    return apiClient.post<Transaction[]>('/financials/transactions/similar', transactionData);
  }
}

// Instância do serviço
export const financialService = new FinancialService();
