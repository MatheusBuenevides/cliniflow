import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface SpecialtySelectorProps {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
  className?: string;
}

const COMMON_SPECIALTIES = [
  'Terapia Cognitivo-Comportamental',
  'Psicanálise',
  'Terapia Humanista',
  'Terapia Familiar',
  'Terapia de Casal',
  'Neuropsicologia',
  'Psicologia Clínica',
  'Psicologia Hospitalar',
  'Psicologia Organizacional',
  'Psicologia Social',
  'Psicologia do Desenvolvimento',
  'Terapia EMDR',
  'Terapia Comportamental',
  'Terapia Gestalt',
  'Terapia Sistêmica',
  'Psicologia Positiva',
  'Mindfulness',
  'Terapia de Aceitação e Compromisso (ACT)',
  'Terapia Dialética Comportamental (DBT)',
  'Terapia de Esquemas'
];

const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({
  selectedSpecialties,
  onSpecialtiesChange,
  className = ''
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleAddSpecialty = (specialty: string) => {
    if (specialty && !selectedSpecialties.includes(specialty)) {
      onSpecialtiesChange([...selectedSpecialties, specialty]);
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    onSpecialtiesChange(selectedSpecialties.filter(s => s !== specialty));
  };

  const handleAddCustomSpecialty = () => {
    if (newSpecialty.trim()) {
      handleAddSpecialty(newSpecialty.trim());
      setNewSpecialty('');
      setIsAdding(false);
    }
  };

  const availableSpecialties = COMMON_SPECIALTIES.filter(
    specialty => !selectedSpecialties.includes(specialty)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Especialidades
        </label>
        <p className="text-sm text-slate-500 mb-4">
          Selecione suas especialidades para que os pacientes possam encontrá-lo mais facilmente.
        </p>
      </div>

      {/* Especialidades selecionadas */}
      {selectedSpecialties.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Selecionadas:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSpecialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {specialty}
                <button
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Especialidades disponíveis */}
      {availableSpecialties.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Disponíveis:</h4>
          <div className="flex flex-wrap gap-2">
            {availableSpecialties.slice(0, 10).map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleAddSpecialty(specialty)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <Plus size={14} className="mr-1" />
                {specialty}
              </button>
            ))}
          </div>
          {availableSpecialties.length > 10 && (
            <p className="text-xs text-slate-500">
              E mais {availableSpecialties.length - 10} especialidades disponíveis...
            </p>
          )}
        </div>
      )}

      {/* Adicionar especialidade personalizada */}
      <div className="space-y-2">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Adicionar especialidade personalizada
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Digite sua especialidade..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSpecialty()}
              autoFocus
            />
            <button
              onClick={handleAddCustomSpecialty}
              disabled={!newSpecialty.trim()}
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewSpecialty('');
              }}
              className="px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedSpecialties.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>Nenhuma especialidade selecionada.</p>
          <p className="text-sm">Adicione especialidades para melhorar sua visibilidade.</p>
        </div>
      )}
    </div>
  );
};

export default SpecialtySelector;
