import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
  allowCustomTags?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  onChange,
  disabled = false,
  maxTags = 10,
  allowCustomTags = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const handleTagToggle = (tag: string) => {
    if (disabled) return;
    
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < maxTags) {
      onChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (disabled) return;
    onChange(selectedTags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (disabled || !customTag.trim() || selectedTags.includes(customTag.trim())) return;
    
    if (selectedTags.length < maxTags) {
      onChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
      setIsOpen(false);
    }
  };

  const filteredAvailableTags = availableTags.filter(tag => !selectedTags.includes(tag));

  return (
    <div className="space-y-3">
      {/* Tags selecionadas */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
          >
            <Tag className="h-3 w-3" />
            <span>{tag}</span>
            {!disabled && (
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-purple-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        
        {/* Botão para adicionar nova tag */}
        {!disabled && selectedTags.length < maxTags && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center space-x-1 px-3 py-1 border-2 border-dashed border-slate-300 text-slate-500 rounded-full text-sm hover:border-purple-400 hover:text-purple-600 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Adicionar tag</span>
          </button>
        )}
      </div>

      {/* Dropdown de tags disponíveis */}
      {isOpen && !disabled && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {/* Tags disponíveis */}
            {filteredAvailableTags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Tags disponíveis:</p>
                <div className="flex flex-wrap gap-1">
                  {filteredAvailableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="px-2 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionar tag personalizada */}
            {allowCustomTags && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-2">Nova tag:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                    placeholder="Digite o nome da tag..."
                    className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contador de tags */}
      <div className="text-xs text-slate-500">
        {selectedTags.length} de {maxTags} tags selecionadas
      </div>
    </div>
  );
};

export { TagSelector };
