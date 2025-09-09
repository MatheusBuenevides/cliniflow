import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Tag, 
  Repeat, 
  Upload, 
  X, 
  Plus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { 
  Transaction, 
  TransactionType, 
  TransactionCategory, 
  PaymentMethod, 
  TransactionStatus,
  RecurrenceConfig
} from '../../types';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: string;
  date: string;
  paymentMethod?: PaymentMethod;
  status: TransactionStatus;
  notes?: string;
  tags: string[];
  dueDate?: string;
  isRecurring: boolean;
  recurrenceConfig?: RecurrenceConfig;
  receiptFile?: File | null;
}

const TRANSACTION_CATEGORIES = {
  income: [
    { value: 'consultation', label: 'Consulta', icon: '👥' },
    { value: 'supervision', label: 'Supervisão', icon: '👨‍🏫' },
    { value: 'workshop', label: 'Workshop', icon: '🎓' },
    { value: 'other_income', label: 'Outras Receitas', icon: '💰' }
  ],
  expense: [
    { value: 'rent', label: 'Aluguel', icon: '🏢' },
    { value: 'supervision_cost', label: 'Custo de Supervisão', icon: '👨‍🏫' },
    { value: 'education', label: 'Educação', icon: '📚' },
    { value: 'materials', label: 'Materiais', icon: '📋' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'taxes', label: 'Impostos', icon: '📄' },
    { value: 'other_expense', label: 'Outras Despesas', icon: '💸' }
  ]
};

const PAYMENT_METHODS = [
  { value: 'creditCard', label: 'Cartão de Crédito', icon: '💳' },
  { value: 'debitCard', label: 'Cartão de Débito', icon: '💳' },
  { value: 'pix', label: 'PIX', icon: '📱' },
  { value: 'boleto', label: 'Boleto', icon: '📄' },
  { value: 'cash', label: 'Dinheiro', icon: '💵' },
  { value: 'transfer', label: 'Transferência', icon: '🏦' }
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente', color: 'text-yellow-600' },
  { value: 'completed', label: 'Concluído', color: 'text-green-600' },
  { value: 'cancelled', label: 'Cancelado', color: 'text-red-600' },
  { value: 'refunded', label: 'Reembolsado', color: 'text-gray-600' }
];

const RECURRENCE_FREQUENCIES = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' }
];

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    type: 'income',
    category: 'consultation',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'pix',
    status: 'completed',
    notes: '',
    tags: [],
    dueDate: '',
    isRecurring: false,
    recurrenceConfig: undefined,
    receiptFile: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount.toString(),
        date: transaction.date,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        notes: transaction.notes || '',
        tags: transaction.tags || [],
        dueDate: transaction.dueDate || '',
        isRecurring: transaction.isRecurring,
        recurrenceConfig: transaction.recurrenceConfig,
        receiptFile: null
      });
    }
  }, [transaction]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (formData.type === 'expense' && !formData.paymentMethod) {
      newErrors.paymentMethod = 'Método de pagamento é obrigatório para despesas';
    }

    if (formData.isRecurring && !formData.recurrenceConfig?.frequency) {
      newErrors.recurrence = 'Configuração de recorrência é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

      const submitData = {
        type: formData.type,
        category: formData.category,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        notes: formData.notes?.trim(),
        tags: formData.tags,
        dueDate: formData.dueDate || undefined,
        isRecurring: formData.isRecurring,
        recurrenceConfig: formData.isRecurring ? formData.recurrenceConfig : undefined,
        psychologistId: 1, // TODO: Pegar do contexto de autenticação
        appointmentId: transaction?.appointmentId,
        isReconciled: false
      };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'income' ? 'consultation' : 'rent'
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const updateRecurrenceConfig = (updates: Partial<RecurrenceConfig>) => {
    setFormData(prev => ({
      ...prev,
      recurrenceConfig: {
        ...prev.recurrenceConfig,
        ...updates,
        isActive: true
      } as RecurrenceConfig
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          receiptFile: 'Apenas arquivos JPG, PNG e PDF são permitidos'
        }));
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          receiptFile: 'Arquivo deve ter no máximo 5MB'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, receiptFile: file }));
      setErrors(prev => ({ ...prev, receiptFile: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {transaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Transação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Transação
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === 'income'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Receita</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === 'expense'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Despesa</span>
              </div>
            </button>
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TransactionCategory }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TRANSACTION_CATEGORIES[formData.type].map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Consulta com Maria Santos"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Valor e Data */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0,00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* Método de Pagamento e Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pagamento
            </label>
            <select
              value={formData.paymentMethod || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method.value} value={method.value}>
                  {method.icon} {method.label}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.paymentMethod}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TransactionStatus }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data de Vencimento (para despesas) */}
        {formData.type === 'expense' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adicionar tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload de Comprovante */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comprovante
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              id="receipt-upload"
            />
            <label
              htmlFor="receipt-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
            >
              Clique para fazer upload
            </label>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG ou PDF (máximo 5MB)
            </p>
            {formData.receiptFile && (
              <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {formData.receiptFile.name}
              </p>
            )}
            {errors.receiptFile && (
              <p className="mt-1 text-sm text-red-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.receiptFile}
              </p>
            )}
          </div>
        </div>

        {/* Recorrência */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
              <Repeat className="w-4 h-4 inline mr-1" />
              Transação Recorrente
            </label>
          </div>

          {formData.isRecurring && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência
                  </label>
                  <select
                    value={formData.recurrenceConfig?.frequency || ''}
                    onChange={(e) => updateRecurrenceConfig({ frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {RECURRENCE_FREQUENCIES.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervalo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.recurrenceConfig?.interval || 1}
                    onChange={(e) => updateRecurrenceConfig({ interval: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim (opcional)
                </label>
                <input
                  type="date"
                  value={formData.recurrenceConfig?.endDate || ''}
                  onChange={(e) => updateRecurrenceConfig({ endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.recurrence && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.recurrence}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observações adicionais..."
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {transaction ? 'Atualizar' : 'Criar'} Transação
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
