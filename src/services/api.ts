// API Configuration for CliniFlow
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private logoutCallback: (() => void) | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('accessToken');
  }

  setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          this.clearToken();
          if (this.logoutCallback) {
            this.logoutCallback();
          } else {
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        throw new Error(data.error?.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // HTTP Methods
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

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth Methods
  async login(email: string, password: string) {
    const response = await this.post('/auth/login', { email, password });
    
    if (response.success && response.data?.tokens) {
      this.setToken(response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    
    return response;
  }

  async register(userData: any) {
    const response = await this.post('/auth/register', userData);
    
    if (response.success && response.data?.tokens) {
      this.setToken(response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    
    return response;
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await this.post('/auth/logout', { refreshToken });
    }
    this.clearToken();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.post('/auth/refresh', { refreshToken });
    
    if (response.success && response.data?.tokens) {
      this.setToken(response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    
    return response;
  }

  // Patient Methods
  async getPatients(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/patients${queryParams ? `?${queryParams}` : ''}`);
  }

  async getPatient(id: string) {
    return this.get(`/patients/${id}`);
  }

  async createPatient(patientData: any) {
    return this.post('/patients', patientData);
  }

  async updatePatient(id: string, patientData: any) {
    return this.put(`/patients/${id}`, patientData);
  }

  async deletePatient(id: string) {
    return this.delete(`/patients/${id}`);
  }

  // Appointment Methods
  async getAppointments(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/appointments${queryParams ? `?${queryParams}` : ''}`);
  }

  async getAppointment(id: string) {
    return this.get(`/appointments/${id}`);
  }

  async createAppointment(appointmentData: any) {
    return this.post('/appointments', appointmentData);
  }

  async updateAppointment(id: string, appointmentData: any) {
    return this.put(`/appointments/${id}`, appointmentData);
  }

  async deleteAppointment(id: string) {
    return this.delete(`/appointments/${id}`);
  }

  // Session Methods
  async getSessions(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/sessions${queryParams ? `?${queryParams}` : ''}`);
  }

  async getSession(id: string) {
    return this.get(`/sessions/${id}`);
  }

  async createSession(sessionData: any) {
    return this.post('/sessions', sessionData);
  }

  async updateSession(id: string, sessionData: any) {
    return this.put(`/sessions/${id}`, sessionData);
  }

  async deleteSession(id: string) {
    return this.delete(`/sessions/${id}`);
  }

  // Financial Methods
  async getTransactions(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/financial/transactions${queryParams ? `?${queryParams}` : ''}`);
  }

  async getTransaction(id: string) {
    return this.get(`/financial/transactions/${id}`);
  }

  async createTransaction(transactionData: any) {
    return this.post('/financial/transactions', transactionData);
  }

  async updateTransaction(id: string, transactionData: any) {
    return this.put(`/financial/transactions/${id}`, transactionData);
  }

  async deleteTransaction(id: string) {
    return this.delete(`/financial/transactions/${id}`);
  }

  async getFinancialDashboard() {
    return this.get('/financial/dashboard');
  }

  // Video Session Methods
  async getVideoSessions(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/video/sessions${queryParams ? `?${queryParams}` : ''}`);
  }

  async getVideoSession(id: string) {
    return this.get(`/video/sessions/${id}`);
  }

  async createVideoSession(sessionData: any) {
    return this.post('/video/sessions', sessionData);
  }

  async startVideoSession(id: string) {
    return this.post(`/video/sessions/${id}/start`);
  }

  async endVideoSession(id: string) {
    return this.post(`/video/sessions/${id}/end`);
  }

  // Notification Methods
  async getNotifications(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.get(`/notifications${queryParams ? `?${queryParams}` : ''}`);
  }

  async markNotificationAsRead(id: string) {
    return this.patch(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.patch('/notifications/mark-all-read');
  }

  // Settings Methods
  async getProfile() {
    return this.get('/settings/profile');
  }

  async updateProfile(profileData: any) {
    return this.put('/settings/profile', profileData);
  }

  async getWorkingHours() {
    return this.get('/settings/working-hours');
  }

  async updateWorkingHours(workingHours: any) {
    return this.put('/settings/working-hours', workingHours);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export callback function
export const setLogoutCallback = (callback: () => void) => {
  apiClient.setLogoutCallback(callback);
};

// Export types
export type { ApiResponse, PaginatedResponse };