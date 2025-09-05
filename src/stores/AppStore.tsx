import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockData } from '../services/mockData';

// Tipos para o estado da aplicação
interface AppState {
  user: typeof mockData.user;
  activePage: string;
  todayAppointments: typeof mockData.todayAppointments;
  patients: typeof mockData.patients;
  financials: typeof mockData.financials;
  calendarAppointments: typeof mockData.calendarAppointments;
}

interface AppContextType {
  state: AppState;
  setActivePage: (page: string) => void;
  updatePatients: (patients: typeof mockData.patients) => void;
  updateAppointments: (appointments: typeof mockData.todayAppointments) => void;
}

// Estado inicial
const initialState: AppState = {
  user: mockData.user,
  activePage: 'Dashboard',
  todayAppointments: mockData.todayAppointments,
  patients: mockData.patients,
  financials: mockData.financials,
  calendarAppointments: mockData.calendarAppointments,
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setActivePage = (page: string) => {
    setState(prev => ({ ...prev, activePage: page }));
  };

  const updatePatients = (patients: typeof mockData.patients) => {
    setState(prev => ({ ...prev, patients }));
  };

  const updateAppointments = (appointments: typeof mockData.todayAppointments) => {
    setState(prev => ({ ...prev, todayAppointments: appointments }));
  };

  const value: AppContextType = {
    state,
    setActivePage,
    updatePatients,
    updateAppointments,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useAppStore = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore deve ser usado dentro de um AppProvider');
  }
  return context;
};
