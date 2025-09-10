import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Copy } from 'lucide-react';
import type { NotificationTemplate } from '../../types';

interface TemplateSelectorProps {
  templates: NotificationTemplate[];
  onSelect: (template: NotificationTemplate) => void;
  onEdit?: (template: NotificationTemplate) => void;
  onDelete?: (templateId: string) => void;
  onDuplicate?: (template: NotificationTemplate) => void;
  onCreateNew?: () => void;
  selectedTemplateId?: string;
  type?: 'email' | 'sms' | 'whatsapp';
}

interface TemplateFilters {
  type: 'all' | 'email' | 'sms' | 'whatsapp';
  event: 'all' | string;
  isActive: 'all' | 'active' | 'inactive';
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  selectedTemplateId,
  type
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TemplateFilters>({
    type: type || 'all',
    event: 'all',
    isActive: 'all'
  });
  const [showPreview, setShowPreview] = useState<string | null>(null);

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || template.type === filters.type;
    const matchesEvent = filters.event === 'all' || template.event === filters.event;
    const matchesActive = filters.isActive === 'all' || 
                         (filters.isActive === 'active' ? template.isActive : !template.isActive);

    return matchesSearch && matchesType && matchesEvent && matchesActive;
  });

  // Obter eventos únicos
  const uniqueEvents = Array.from(new Set(templates.map(t => t.event)));

  // Obter tipos únicos
  const uniqueTypes = Array.from(new Set(templates.map(t => t.type)));

  // Preview do template
  const renderPreview = (template: NotificationTemplate) => {
    if (template.type === 'email') {
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-900">
            Assunto: {template.subject}
          </div>
          <div 
            className="text-sm text-gray-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: template.template.substring(0, 200) + (template.template.length > 200 ? '...' : '')
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="text-sm text-gray-600">
          {template.template.substring(0, 150) + (template.template.length > 150 ? '...' : '')}
        </div>
      );
    }
  };

  // Obter ícone do tipo
  const getTypeIcon = (templateType: string) => {
    switch (templateType) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'whatsapp':
        return '💬';
      default:
        return '📄';
    }
  };

  // Obter cor do tipo
  const getTypeColor = (templateType: string) => {
    switch (templateType) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'sms':
        return 'bg-green-100 text-green-800';
      case 'whatsapp':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Template
          </button>
        )}
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-3">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {/* Tipo */}
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os tipos</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type === 'email' ? 'Email' : type === 'sms' ? 'SMS' : 'WhatsApp'}
              </option>
            ))}
          </select>

          {/* Evento */}
          <select
            value={filters.event}
            onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os eventos</option>
            {uniqueEvents.map(event => (
              <option key={event} value={event}>
                {event.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.isActive}
            onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value as any }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {/* Lista de Templates */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📄</div>
            <div>Nenhum template encontrado</div>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Criar primeiro template
              </button>
            )}
          </div>
        ) : (
          filteredTemplates.map(template => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedTemplateId === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(template.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                      {template.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {template.event.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {!template.isActive && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {template.subject || 'Sem assunto'}
                  </div>
                  
                  {showPreview === template.id ? (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      {renderPreview(template)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {template.template.substring(0, 100)}...
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(showPreview === template.id ? null : template.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {onDuplicate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(template);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(template);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja excluir este template?')) {
                          onDelete(template.id);
                        }
                      }}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estatísticas */}
      <div className="text-sm text-gray-500 text-center">
        {filteredTemplates.length} de {templates.length} templates
      </div>
    </div>
  );
};

export default TemplateSelector;
