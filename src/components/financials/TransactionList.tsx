import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Repeat,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import type { 
  Transaction, 
  TransactionFilters, 
  TransactionStatus 
} from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  onView: (transaction: Transaction) => void;
  onExport?: () => void;
  onFiltersChange: (filters: TransactionFilters) => void;
  currentFilters: TransactionFilters;
}

const TRANSACTION_TYPES = {
  income: { label: 'Receita', color: 'text-green-600', bgColor: 'bg-green-100' },
  expense: { label: 'Despesa', color: 'text-red-600', bgColor: 'bg-red-100' }
};

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock },
  completed: { label: 'Concluído', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
  refunded: { label: 'Reembolsado', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle }
};

// const PAYMENT_METHOD_ICONS = {
//   creditCard: '💳',
//   debitCard: '💳',
//   pix: '📱',
//   boleto: '📄',
//   cash: '💵',
//   transfer: '🏦'
// };

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  onExport,
  onFiltersChange,
  currentFilters
}) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);

  // Filtrar e ordenar transações
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Aplicar busca por texto
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Aplicar filtros
    if (currentFilters.type) {
      filtered = filtered.filter(transaction => transaction.type === currentFilters.type);
    }

    if (currentFilters.category) {
      filtered = filtered.filter(transaction => transaction.category === currentFilters.category);
    }

    if (currentFilters.status) {
      filtered = filtered.filter(transaction => transaction.status === currentFilters.status);
    }

    if (currentFilters.startDate) {
      filtered = filtered.filter(transaction => transaction.date >= currentFilters.startDate!);
    }

    if (currentFilters.endDate) {
      filtered = filtered.filter(transaction => transaction.date <= currentFilters.endDate!);
    }

    // Ordenar
    const sortBy = currentFilters.sortBy || 'date';
    const sortOrder = currentFilters.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description;
          bValue = b.description;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default: // date
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, currentFilters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...currentFilters, search: value });
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({ ...currentFilters, [key]: value });
  };

  const handleSortChange = (sortBy: string) => {
    const currentSortBy = currentFilters.sortBy;
    const currentSortOrder = currentFilters.sortOrder;

    let newSortOrder: 'asc' | 'desc' = 'desc';
    if (currentSortBy === sortBy && currentSortOrder === 'desc') {
      newSortOrder = 'asc';
    }

    onFiltersChange({
      ...currentFilters,
      sortBy: sortBy as any,
      sortOrder: newSortOrder
    });
  };

  const handleSelectTransaction = (id: number) => {
    setSelectedTransactions(prev =>
      prev.includes(id)
        ? prev.filter(transactionId => transactionId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusIcon = (status: TransactionStatus) => {
    const Icon = STATUS_CONFIG[status].icon;
    return <Icon className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header com busca e filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {filteredTransactions.length} transação(ões) encontrada(s)
          </div>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={currentFilters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={currentFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={currentFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={currentFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de transações */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSortChange('date')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Data</span>
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSortChange('description')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Descrição</span>
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSortChange('amount')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Valor</span>
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id)}
                    onChange={() => handleSelectTransaction(transaction.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {transaction.description}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {transaction.tags?.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {transaction.isRecurring && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        <Repeat className="w-3 h-3 mr-1" />
                        Recorrente
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    TRANSACTION_TYPES[transaction.type].bgColor
                  } ${TRANSACTION_TYPES[transaction.type].color}`}>
                    {TRANSACTION_TYPES[transaction.type].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_CONFIG[transaction.status].bgColor
                  } ${STATUS_CONFIG[transaction.status].color}`}>
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1">{STATUS_CONFIG[transaction.status].label}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm || Object.values(currentFilters).some(v => v)
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando sua primeira transação.'}
            </p>
          </div>
        )}
      </div>

      {/* Ações em lote */}
      {selectedTransactions.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedTransactions.length} transação(ões) selecionada(s)
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Exportar Selecionadas
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Excluir Selecionadas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
