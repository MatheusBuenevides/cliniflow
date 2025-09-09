import React, { useState } from 'react';
import { 
  Link, 
  Copy, 
  Check, 
  ExternalLink, 
  DollarSign,
  Clock,
  EyeOff,
  Trash2,
  Plus,
  Settings
} from 'lucide-react';
import { LoadingButton, FormInput } from '../ui';
import type { PaymentMethod, PaymentLink } from '../../types';

interface PaymentLinkManagerProps {
  appointmentId?: number;
  onLinkCreated: (link: PaymentLink) => void;
  onLinkUpdated: (link: PaymentLink) => void;
  onLinkDeleted: (linkId: string) => void;
  className?: string;
}

interface PaymentLinkForm {
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  expiresInHours: number;
  maxUses?: number;
  isActive: boolean;
}

const PaymentLinkManager: React.FC<PaymentLinkManagerProps> = ({
  appointmentId,
  onLinkCreated,
  onLinkDeleted,
  className = ''
}) => {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);

  const [formData, setFormData] = useState<PaymentLinkForm>({
    amount: 150,
    description: '',
    paymentMethod: 'pix',
    expiresInHours: 24,
    maxUses: undefined,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'pix':
        return '📱';
      case 'creditCard':
      case 'debitCard':
        return '💳';
      case 'boleto':
        return '📄';
      default:
        return '💰';
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'creditCard':
        return 'Cartão de Crédito';
      case 'debitCard':
        return 'Cartão de Débito';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return 'Pagamento';
    }
  };

  const getStatusBadge = (link: PaymentLink) => {
    const now = new Date();
    const expiresAt = new Date(link.expiresAt);
    const isExpired = expiresAt < now;

    if (link.status === 'paid') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Pago</span>;
    }
    if (link.status === 'cancelled') {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Cancelado</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Expirado</span>;
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Ativo</span>;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.expiresInHours < 1) {
      newErrors.expiresInHours = 'Tempo de expiração deve ser pelo menos 1 hora';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentLinkForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simular criação de link de pagamento
      const newLink: PaymentLink = {
        id: `link_${Date.now()}`,
        appointmentId: appointmentId || 0,
        amount: formData.amount,
        description: formData.description,
        url: `https://payment.cliniflow.com/pay/${Date.now()}`,
        expiresAt: new Date(Date.now() + formData.expiresInHours * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        paymentMethod: formData.paymentMethod
      };

      setLinks(prev => [newLink, ...prev]);
      onLinkCreated(newLink);
      
      // Reset form
      setFormData({
        amount: 150,
        description: '',
        paymentMethod: 'pix',
        expiresInHours: 24,
        maxUses: undefined,
        isActive: true
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erro ao criar link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (link: PaymentLink) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este link de pagamento?')) {
      setLinks(prev => prev.filter(link => link.id !== linkId));
      onLinkDeleted(linkId);
    }
  };

  const handleEditLink = (link: PaymentLink) => {
    setEditingLink(link);
    setFormData({
      amount: link.amount,
      description: link.description,
      paymentMethod: link.paymentMethod || 'pix',
      expiresInHours: 24,
      maxUses: undefined,
      isActive: link.status === 'active'
    });
    setShowCreateForm(true);
  };

  const filteredLinks = links.filter(link => {
    if (!showExpired) {
      const now = new Date();
      const expiresAt = new Date(link.expiresAt);
      return expiresAt >= now;
    }
    return true;
  });

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Links de Pagamento
          </h3>
          <p className="text-sm text-slate-600">
            Gerencie links personalizados para pagamentos
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span>Mostrar expirados</span>
          </label>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Link</span>
          </button>
        </div>
      </div>

      {/* Formulário de Criação/Edição */}
      {showCreateForm && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-700">
              {editingLink ? 'Editar Link' : 'Criar Novo Link'}
            </h4>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingLink(null);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <EyeOff className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateLink} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="amount"
                name="amount"
                type="number"
                label="Valor"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                error={errors.amount}
                placeholder="150.00"
                step="0.01"
                min="0.01"
                leftIcon={<DollarSign className="h-5 w-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Método de Pagamento
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pix">PIX</option>
                  <option value="creditCard">Cartão de Crédito</option>
                  <option value="debitCard">Cartão de Débito</option>
                  <option value="boleto">Boleto Bancário</option>
                </select>
              </div>
            </div>

            <FormInput
              id="description"
              name="description"
              type="text"
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={errors.description}
              placeholder="Consulta psicológica - Dr. João Silva"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="expiresInHours"
                name="expiresInHours"
                type="number"
                label="Expira em (horas)"
                value={formData.expiresInHours}
                onChange={(e) => handleInputChange('expiresInHours', parseInt(e.target.value) || 24)}
                error={errors.expiresInHours}
                placeholder="24"
                min="1"
                max="168"
                leftIcon={<Clock className="h-5 w-5" />}
              />

              <FormInput
                id="maxUses"
                name="maxUses"
                type="number"
                label="Máximo de usos (opcional)"
                value={formData.maxUses || ''}
                onChange={(e) => handleInputChange('maxUses', e.target.value ? parseInt(e.target.value) : 0)}
                placeholder="Ilimitado"
                min="1"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                Link ativo
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingLink(null);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              
              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Criando..."
                className="flex-1"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                {editingLink ? 'Atualizar' : 'Criar Link'}
              </LoadingButton>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Links */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-8">
            <Link className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="font-medium text-slate-700 mb-2">
              Nenhum link de pagamento
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              Crie seu primeiro link de pagamento para começar
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Link</span>
            </button>
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div key={link.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPaymentMethodIcon(link.paymentMethod || 'pix')}</span>
                  <div>
                    <h4 className="font-medium text-slate-800">
                      {formatPrice(link.amount)}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {getPaymentMethodName(link.paymentMethod || 'pix')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(link)}
                  <button
                    onClick={() => handleEditLink(link)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Editar"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-3">{link.description}</p>

              <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                <span>Criado em: {formatDate(link.createdAt)}</span>
                <span>Expira em: {formatDate(link.expiresAt)}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Link de pagamento:</p>
                  <p className="text-sm font-mono text-slate-800 truncate">
                    {link.url}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyLink(link)}
                  className="flex items-center space-x-1 px-3 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {copiedLinkId === link.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copiedLinkId === link.id ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  onClick={() => window.open(link.url, '_blank')}
                  className="flex items-center space-x-1 px-3 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Abrir</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { PaymentLinkManager };
