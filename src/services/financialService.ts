import { apiClient } from './api';
import type { Transaction, FinancialReport, TransactionFilters } from '../types';

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
}

// Instância do serviço
export const financialService = new FinancialService();
