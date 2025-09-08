// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Callback para logout automático
let logoutCallback: (() => void) | null = null;

// Função para registrar callback de logout
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Função para obter token de autenticação
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token');
};

// Função para verificar se o token está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true;
  }
};

// Cliente HTTP base com interceptors
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Interceptor de request - adicionar token de autenticação
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !isTokenExpired(token)) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Interceptor de response - verificar erros de autenticação
      if (response.status === 401) {
        // Token inválido ou expirado
        if (logoutCallback) {
          logoutCallback();
        }
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Sessão expirada')) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Método para refresh de token
  async refreshToken(): Promise<string | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await this.post<{ token: string }>('/auth/refresh', { token });
      const newToken = response.data.token;
      
      localStorage.setItem('auth-token', newToken);
      return newToken;
    } catch (error) {
      // Se o refresh falhar, fazer logout
      if (logoutCallback) {
        logoutCallback();
      }
      return null;
    }
  }
}

// Instância do cliente API
export const apiClient = new ApiClient(API_BASE_URL);
