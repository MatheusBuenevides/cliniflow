import { create } from 'zustand';
import type { 
  Transaction, 
  TransactionType, 
  TransactionCategory, 
  TransactionStatus,
  PaymentMethod,
  FinancialReport,
  TransactionFilters,
  MonthlyRevenue,
  MonthlyExpense
} from '../types/index';

interface FinancialState {
  // Estado
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  financialReport: FinancialReport | null;
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;

  // Actions
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  getTransactionById: (id: number) => Transaction | null;
  createTransaction: (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (id: number, transactionData: Partial<Transaction>) => Promise<Transaction>;
  deleteTransaction: (id: number) => Promise<void>;
  generateFinancialReport: (startDate: string, endDate: string) => Promise<FinancialReport>;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  setFilters: (filters: TransactionFilters) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data temporário para desenvolvimento
const mockTransactions: Transaction[] = [
  {
    id: 1,
    appointmentId: 1,
    psychologistId: 1,
    type: 'income',
    category: 'consultation',
    description: 'Consulta - Maria Santos',
    amount: 120,
    date: '2025-01-25',
    paymentMethod: 'pix',
    paymentId: 'pay_123456',
    status: 'completed',
    receipt: 'https://example.com/receipt1.pdf',
    notes: 'Pagamento via PIX',
    isRecurring: false,
    isReconciled: false,
    createdAt: '2024-01-25T14:30:00.000Z',
    updatedAt: '2024-01-25T14:30:00.000Z',
  },
  {
    id: 2,
    appointmentId: 2,
    psychologistId: 1,
    type: 'income',
    category: 'consultation',
    description: 'Consulta Online - João Oliveira',
    amount: 100,
    date: '2025-01-25',
    paymentMethod: 'creditCard',
    paymentId: 'pay_789012',
    status: 'pending',
    notes: 'Pagamento pendente',
    isRecurring: false,
    isReconciled: false,
    createdAt: '2024-01-25T16:00:00.000Z',
    updatedAt: '2024-01-25T16:00:00.000Z',
  },
  {
    id: 3,
    appointmentId: 3,
    psychologistId: 1,
    type: 'income',
    category: 'consultation',
    description: 'Consulta - Ana Costa',
    amount: 120,
    date: '2025-01-26',
    paymentMethod: 'pix',
    paymentId: 'pay_345678',
    status: 'completed',
    receipt: 'https://example.com/receipt3.pdf',
    notes: 'Pagamento via PIX',
    isRecurring: false,
    isReconciled: false,
    createdAt: '2024-01-26T10:30:00.000Z',
    updatedAt: '2024-01-26T10:30:00.000Z',
  },
  {
    id: 4,
    psychologistId: 1,
    type: 'expense',
    category: 'rent',
    description: 'Aluguel do consultório',
    amount: 2500,
    date: '2024-01-01',
    paymentMethod: 'transfer',
    status: 'completed',
    notes: 'Aluguel mensal',
    isRecurring: false,
    isReconciled: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    psychologistId: 1,
    type: 'expense',
    category: 'supervision_cost',
    description: 'Supervisão clínica',
    amount: 300,
    date: '2024-01-15',
    paymentMethod: 'pix',
    status: 'completed',
    notes: 'Supervisão mensal',
    isRecurring: false,
    isReconciled: false,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 6,
    psychologistId: 1,
    type: 'expense',
    category: 'education',
    description: 'Curso de especialização',
    amount: 800,
    date: '2024-01-10',
    paymentMethod: 'creditCard',
    status: 'completed',
    notes: 'Curso online de TCC',
    isRecurring: false,
    isReconciled: false,
    createdAt: '2024-01-10T14:00:00.000Z',
    updatedAt: '2024-01-10T14:00:00.000Z',
  },
];

export const useFinancialStore = create<FinancialState>((set, get) => ({
  // Estado inicial
  transactions: mockTransactions,
  currentTransaction: null,
  financialReport: null,
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  fetchTransactions: async (filters?: TransactionFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredTransactions = [...mockTransactions];
      
      // Aplicar filtros
      if (filters?.startDate) {
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.date >= filters.startDate!
        );
      }
      
      if (filters?.endDate) {
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.date <= filters.endDate!
        );
      }
      
      if (filters?.type) {
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.type === filters.type
        );
      }
      
      if (filters?.category) {
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.category === filters.category
        );
      }
      
      if (filters?.status) {
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.status === filters.status
        );
      }
      
      // Ordenar por data (mais recente primeiro)
      filteredTransactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      
      set({
        transactions: filteredTransactions,
        isLoading: false,
        error: null,
        filters: filters || {},
      });
    } catch (error) {
      set({
        transactions: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar transações',
      });
    }
  },

  getTransactionById: (id: number) => {
    const { transactions } = get();
    return transactions.find(transaction => transaction.id === id) || null;
  },

  createTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now(), // ID temporário
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        transactions: [newTransaction, ...state.transactions],
        isLoading: false,
        error: null,
      }));
      
      return newTransaction;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar transação',
      });
      throw error;
    }
  },

  updateTransaction: async (id: number, transactionData: Partial<Transaction>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedTransaction: Transaction = {
        ...get().transactions.find(t => t.id === id)!,
        ...transactionData,
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        transactions: state.transactions.map(transaction =>
          transaction.id === id ? updatedTransaction : transaction
        ),
        currentTransaction: state.currentTransaction?.id === id ? updatedTransaction : state.currentTransaction,
        isLoading: false,
        error: null,
      }));
      
      return updatedTransaction;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar transação',
      });
      throw error;
    }
  },

  deleteTransaction: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set(state => ({
        transactions: state.transactions.filter(transaction => transaction.id !== id),
        currentTransaction: state.currentTransaction?.id === id ? null : state.currentTransaction,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir transação',
      });
    }
  },

  generateFinancialReport: async (startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const { transactions } = get();
      
      // Filtrar transações pelo período
      const periodTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
      
      // Calcular receitas
      const incomeTransactions = periodTransactions.filter(t => t.type === 'income');
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Calcular despesas
      const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');
      const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Agrupar receitas por categoria
      const incomeByCategory = incomeTransactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<TransactionCategory, number>);
      
      // Agrupar despesas por categoria
      const expensesByCategory = expenseTransactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<TransactionCategory, number>);
      
      // Calcular receita mensal
      const monthlyRevenue: MonthlyRevenue[] = [];
      const monthlyExpenses: MonthlyExpense[] = [];
      
      // Agrupar por mês
      const monthlyData = periodTransactions.reduce((acc, transaction) => {
        const month = transaction.date.substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { income: 0, expenses: 0, consultations: 0 };
        }
        
        if (transaction.type === 'income') {
          acc[month].income += transaction.amount;
          if (transaction.category === 'consultation') {
            acc[month].consultations += 1;
          }
        } else {
          acc[month].expenses += transaction.amount;
        }
        
        return acc;
      }, {} as Record<string, { income: number; expenses: number; consultations: number }>);
      
      // Converter para arrays
      Object.entries(monthlyData).forEach(([month, data]) => {
        monthlyRevenue.push({
          month,
          amount: data.income,
          consultations: data.consultations,
        });
        
        monthlyExpenses.push({
          month,
          amount: data.expenses,
        });
      });
      
      // Estatísticas de consultas
      const consultationTransactions = incomeTransactions.filter(t => t.category === 'consultation');
      const completedConsultations = consultationTransactions.filter(t => t.status === 'completed');
      const cancelledConsultations = consultationTransactions.filter(t => t.status === 'cancelled');
      const pendingConsultations = consultationTransactions.filter(t => t.status === 'pending');
      
      const financialReport: FinancialReport = {
        period: {
          start: startDate,
          end: endDate,
        },
        income: {
          total: totalIncome,
          byCategory: incomeByCategory,
          byMonth: monthlyRevenue,
        },
        expenses: {
          total: totalExpenses,
          byCategory: expensesByCategory,
          byMonth: monthlyExpenses,
        },
        netProfit: totalIncome - totalExpenses,
        consultationStats: {
          total: consultationTransactions.length,
          completed: completedConsultations.length,
          cancelled: cancelledConsultations.length,
          noShow: 0, // Seria calculado baseado nos agendamentos
          averageValue: consultationTransactions.length > 0 
            ? consultationTransactions.reduce((sum, t) => sum + t.amount, 0) / consultationTransactions.length 
            : 0,
        },
      };
      
      set({
        financialReport,
        isLoading: false,
        error: null,
      });
      
      return financialReport;
    } catch (error) {
      set({
        financialReport: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao gerar relatório financeiro',
      });
      throw error;
    }
  },

  setCurrentTransaction: (transaction: Transaction | null) => {
    set({ currentTransaction: transaction });
  },

  setFilters: (filters: TransactionFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
