import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Psychologist } from '../types/psychologist';

interface AuthState {
  // Estado
  user: Psychologist | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<Psychologist, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProfile: (userData: Partial<Psychologist>) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data temporário para desenvolvimento
const mockUser: Psychologist = {
  id: 1,
  name: 'Dr. Ana Silva',
  crp: '06/123456',
  email: 'ana.silva@email.com',
  phone: '(11) 99999-9999',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  bio: 'Psicóloga clínica especializada em terapia cognitivo-comportamental e atendimento de adolescentes.',
  specialties: ['TCC', 'Adolescentes', 'Ansiedade', 'Depressão'],
  customUrl: 'ana-silva',
  workingHours: {
    monday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    tuesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    wednesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    thursday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    friday: { start: '08:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
  },
  sessionPrices: {
    initial: 150,
    followUp: 120,
    online: 100,
    duration: 50,
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simular delay da API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock de validação - em produção, isso seria uma chamada para a API
          if (email === 'ana.silva@email.com' && password === '123456') {
            // Simular criação de JWT token
            const tokenPayload = {
              sub: mockUser.id.toString(),
              email: mockUser.email,
              name: mockUser.name,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
            };
            
            // Mock JWT token (em produção seria gerado pelo backend)
            const mockToken = btoa(JSON.stringify(tokenPayload));
            localStorage.setItem('auth-token', mockToken);
            
            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Credenciais inválidas');
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erro ao fazer login',
          });
        }
      },

      logout: () => {
        // Limpar token do localStorage
        localStorage.removeItem('auth-token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simular delay da API
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock de criação de usuário
          const newUser: Psychologist = {
            ...userData,
            id: Date.now(), // ID temporário
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Simular criação de JWT token para novo usuário
          const tokenPayload = {
            sub: newUser.id.toString(),
            email: newUser.email,
            name: newUser.name,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
          };
          
          const mockToken = btoa(JSON.stringify(tokenPayload));
          localStorage.setItem('auth-token', mockToken);
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erro ao criar conta',
          });
        }
      },

      updateProfile: async (userData) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          // Simular delay da API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const updatedUser: Psychologist = {
            ...user,
            ...userData,
            updatedAt: new Date().toISOString(),
          };
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
