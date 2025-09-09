import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { 
  TransactionType, 
  TransactionCategory, 
  TransactionCategoryConfig 
} from '../../types';

interface CategorySelectorProps {
  type: TransactionType;
  selectedCategory: TransactionCategory;
  onCategoryChange: (category: TransactionCategory) => void;
  onCategoryCreate?: (category: Omit<TransactionCategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCategoryUpdate?: (id: string, category: Partial<TransactionCategoryConfig>) => Promise<void>;
  onCategoryDelete?: (id: string) => Promise<void>;
  customCategories?: TransactionCategoryConfig[];
}

const DEFAULT_CATEGORIES = {
  income: [
    { value: 'consultation', label: 'Consulta', icon: '👥', color: '#10B981' },
    { value: 'supervision', label: 'Supervisão', icon: '👨‍🏫', color: '#3B82F6' },
    { value: 'workshop', label: 'Workshop', icon: '🎓', color: '#8B5CF6' },
    { value: 'other_income', label: 'Outras Receitas', icon: '💰', color: '#F59E0B' }
  ],
  expense: [
    { value: 'rent', label: 'Aluguel', icon: '🏢', color: '#EF4444' },
    { value: 'supervision_cost', label: 'Custo de Supervisão', icon: '👨‍🏫', color: '#F97316' },
    { value: 'education', label: 'Educação', icon: '📚', color: '#06B6D4' },
    { value: 'materials', label: 'Materiais', icon: '📋', color: '#84CC16' },
    { value: 'marketing', label: 'Marketing', icon: '📢', color: '#EC4899' },
    { value: 'taxes', label: 'Impostos', icon: '📄', color: '#6B7280' },
    { value: 'other_expense', label: 'Outras Despesas', icon: '💸', color: '#9CA3AF' }
  ]
};

const COLOR_PRESETS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#06B6D4', 
  '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#9CA3AF', '#374151'
];

const ICON_PRESETS = [
  '💰', '💳', '📊', '📈', '📉', '🏦', '💼', '🎯', '📋', '📝',
  '🔔', '⚡', '🎨', '🔧', '📱', '💻', '🏠', '🚗', '✈️', '🍕'
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  type,
  selectedCategory,
  onCategoryChange,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  customCategories = []
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TransactionCategoryConfig | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '💰',
    color: '#3B82F6'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allCategories = [
    ...DEFAULT_CATEGORIES[type].map(cat => ({
      ...cat,
      isDefault: true,
      id: cat.value,
      usageCount: 0,
      name: cat.label,
      type: type,
      color: cat.color,
      icon: cat.icon,
      psychologistId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    ...customCategories.filter(cat => cat.type === type)
  ];

  const handleCreateCategory = async () => {
    const newErrors: Record<string, string> = {};

    if (!newCategory.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (allCategories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      newErrors.name = 'Já existe uma categoria com este nome';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && onCategoryCreate) {
      try {
        await onCategoryCreate({
          name: newCategory.name.trim(),
          type,
          color: newCategory.color,
          icon: newCategory.icon,
          isDefault: false,
          psychologistId: 1, // TODO: Pegar do contexto
          usageCount: 0
        });
        
        setNewCategory({ name: '', icon: '💰', color: '#3B82F6' });
        setShowCreateForm(false);
        setErrors({});
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
      }
    }
  };

  const handleUpdateCategory = async (category: TransactionCategoryConfig) => {
    if (onCategoryUpdate) {
      try {
        await onCategoryUpdate(category.id, {
          name: category.name,
          color: category.color,
          icon: category.icon
        });
        setEditingCategory(null);
      } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (onCategoryDelete && window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await onCategoryDelete(categoryId);
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
      }
    }
  };

  const selectedCategoryData = allCategories.find(cat => 
    'value' in cat ? cat.value === selectedCategory : cat.name === selectedCategory
  );

  return (
    <div className="space-y-4">
      {/* Categoria Selecionada */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoria Selecionada
        </label>
        {selectedCategoryData && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: selectedCategoryData.color }}
            >
              {selectedCategoryData.icon}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {'label' in selectedCategoryData ? String(selectedCategoryData.label) : String(selectedCategoryData.name)}
              </div>
              <div className="text-sm text-gray-500">
                {selectedCategoryData.isDefault ? 'Categoria padrão' : 'Categoria personalizada'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Categorias */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Categorias Disponíveis
          </label>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nova Categoria
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {allCategories.map((category) => (
            <div key={category.id}>
              {editingCategory?.id === category.id ? (
                <CategoryEditForm
                  category={editingCategory}
                  onSave={handleUpdateCategory}
                  onCancel={() => setEditingCategory(null)}
                />
              ) : (
                <button
                  onClick={() => onCategoryChange(('value' in category ? category.value : category.name) as TransactionCategory)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedCategory === ('value' in category ? category.value : category.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {'label' in category ? String(category.label) : String(category.name)}
                      </div>
                      {category.usageCount > 0 && (
                        <div className="text-xs text-gray-500">
                          {category.usageCount} uso(s)
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!category.isDefault && (
                    <div className="flex items-center justify-end space-x-1 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(category);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulário de Nova Categoria */}
      {showCreateForm && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Nova Categoria</h3>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewCategory({ name: '', icon: '💰', color: '#3B82F6' });
                setErrors({});
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Consultoria"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <div className="grid grid-cols-10 gap-2">
                {ICON_PRESETS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center text-lg ${
                      newCategory.icon === icon
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor
              </label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PRESETS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded border-2 ${
                      newCategory.color === color
                        ? 'border-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewCategory({ name: '', icon: '💰', color: '#3B82F6' });
                  setErrors({});
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Criar Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para edição inline de categoria
interface CategoryEditFormProps {
  category: TransactionCategoryConfig;
  onSave: (category: TransactionCategoryConfig) => Promise<void>;
  onCancel: () => void;
}

const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
  category,
  onSave,
  onCancel
}) => {
  const [editData, setEditData] = useState({
    name: category.name,
    icon: category.icon,
    color: category.color
  });

  const handleSave = async () => {
    await onSave({
      ...category,
      ...editData
    });
  };

  return (
    <div className="p-3 bg-white border-2 border-blue-500 rounded-lg">
      <div className="space-y-2">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        
        <div className="flex items-center space-x-2">
          <div className="grid grid-cols-4 gap-1">
            {ICON_PRESETS.slice(0, 4).map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setEditData(prev => ({ ...prev, icon }))}
                className={`w-6 h-6 rounded text-xs ${
                  editData.icon === icon ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-1">
            {COLOR_PRESETS.slice(0, 3).map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setEditData(prev => ({ ...prev, color }))}
                className={`w-4 h-4 rounded border ${
                  editData.color === color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-1">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-800"
            title="Salvar"
          >
            <Save className="w-3 h-3" />
          </button>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Cancelar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
