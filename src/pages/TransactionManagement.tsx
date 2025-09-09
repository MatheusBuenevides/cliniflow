import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Settings,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';
import { 
  TransactionForm, 
  TransactionList, 
  CategorySelector,
  FileViewer
} from '../components/financials';
import { useFinancialStore } from '../stores/useFinancialStore';
import { financialService } from '../services/financialService';
import type { 
  Transaction, 
  TransactionFilters, 
  TransactionCategoryConfig,
  ReceiptFile
} from '../types';

export const TransactionManagement: React.FC = () => {
  const {
    transactions,
    isLoading,
    error,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    clearError
  } = useFinancialStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [viewingFile, setViewingFile] = useState<ReceiptFile | null>(null);
  const [customCategories, setCustomCategories] = useState<TransactionCategoryConfig[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  // const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    fetchTransactions();
    loadCustomCategories();
  }, []);

  const loadCustomCategories = async () => {
    try {
      const response = await financialService.getCustomCategories(1); // TODO: Pegar do contexto
      setCustomCategories(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleCreateTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createTransaction(transactionData);
      setShowTransactionForm(false);
      setEditingTransaction(null);
      
      // Se for uma transação recorrente, criar as próximas ocorrências
      if (transactionData.isRecurring && transactionData.recurrenceConfig) {
        // TODO: Implementar criação de transações recorrentes
        console.log('Criando transações recorrentes...');
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  const handleUpdateTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, transactionData);
      setShowTransactionForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setViewingTransaction(transaction);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleExportTransactions = async () => {
    try {
      const response = await financialService.exportTransactions(filters, 'excel');
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transacoes_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar transações:', error);
    }
  };

  const handleCreateCategory = async (categoryData: Omit<TransactionCategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await financialService.createCategory(categoryData);
      setCustomCategories(prev => [...prev, response.data]);
      setShowCategoryManager(false);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: Partial<TransactionCategoryConfig>) => {
    try {
      const response = await financialService.updateCategory(id, categoryData);
      setCustomCategories(prev => 
        prev.map(cat => cat.id === id ? response.data : cat)
      );
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await financialService.deleteCategory(id);
      setCustomCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  const handleViewFile = (file: ReceiptFile) => {
    setViewingFile(file);
    setShowFileViewer(true);
  };

  const handleDownloadFile = async (file: ReceiptFile) => {
    try {
      const response = await financialService.downloadReceipt(file.id);
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
    }
  };

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const handleCloseViewer = () => {
    setViewingTransaction(null);
    setShowFileViewer(false);
    setViewingFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Transações</h1>
              <p className="mt-2 text-gray-600">
                Gerencie suas receitas e despesas de forma organizada
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCategoryManager(true)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Categorias
              </button>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </button>
            </div>
          </div>
        </div>

        {/* Alertas de Erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Lista de Transações */}
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onView={handleViewTransaction}
          onExport={handleExportTransactions}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />

        {/* Modal de Formulário de Transação */}
        {showTransactionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-full overflow-y-auto">
              <TransactionForm
                transaction={editingTransaction}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
                onCancel={handleCloseTransactionForm}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Modal de Visualização de Transação */}
        {viewingTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalhes da Transação
                  </h2>
                  <button
                    onClick={handleCloseViewer}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <p className="text-gray-900">{viewingTransaction.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      <p className={`font-medium ${
                        viewingTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {viewingTransaction.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(viewingTransaction.amount)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data
                      </label>
                      <p className="text-gray-900">
                        {new Date(viewingTransaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        viewingTransaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : viewingTransaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingTransaction.status === 'completed' && 'Concluído'}
                        {viewingTransaction.status === 'pending' && 'Pendente'}
                        {viewingTransaction.status === 'cancelled' && 'Cancelado'}
                        {viewingTransaction.status === 'refunded' && 'Reembolsado'}
                      </span>
                    </div>
                  </div>

                  {/* Comprovante */}
                  {viewingTransaction.receiptFile && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comprovante
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {viewingTransaction.receiptFile.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(viewingTransaction.receiptFile.uploadedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewFile(viewingTransaction.receiptFile!)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(viewingTransaction.receiptFile!)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {viewingTransaction.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {viewingTransaction.notes}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {viewingTransaction.tags && viewingTransaction.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {viewingTransaction.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      onClick={handleCloseViewer}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={() => {
                        handleCloseViewer();
                        handleEditTransaction(viewingTransaction);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Gerenciamento de Categorias */}
        {showCategoryManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Gerenciar Categorias
                  </h2>
                  <button
                    onClick={() => setShowCategoryManager(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <CategorySelector
                  type="income"
                  selectedCategory="consultation"
                  onCategoryChange={() => {}}
                  onCategoryCreate={handleCreateCategory}
                  onCategoryUpdate={handleUpdateCategory}
                  onCategoryDelete={handleDeleteCategory}
                  customCategories={customCategories}
                />
              </div>
            </div>
          </div>
        )}

        {/* Visualizador de Arquivos */}
        {showFileViewer && viewingFile && (
          <FileViewer
            file={viewingFile}
            onClose={() => {
              setShowFileViewer(false);
              setViewingFile(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
