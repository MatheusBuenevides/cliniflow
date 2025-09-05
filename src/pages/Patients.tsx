import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { mockData } from '../services/mockData';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPatients = mockData.patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Pacientes</h1>
        <div className="relative w-full max-w-xs">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Nome</th>
              <th className="p-4 font-semibold text-slate-600">Última Consulta</th>
              <th className="p-4 font-semibold text-slate-600">Contato</th>
              <th className="p-4 font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-slate-800 font-medium">{patient.name}</td>
                <td className="p-4 text-slate-600">
                  {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-slate-600">
                  <div>{patient.phone}</div>
                  <div className="text-sm text-slate-400">{patient.email}</div>
                </td>
                <td className="p-4">
                  <button className="text-purple-600 hover:text-purple-800 font-semibold">
                    Ver Prontuário
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
