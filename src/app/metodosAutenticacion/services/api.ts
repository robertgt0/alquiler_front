// services/api.ts
import { MetodoAutenticacion } from '../interfaces/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // ✅ MÉTODOS DE AUTENTICACIÓN - CORREGIDOS

  async getAuthMethods(): Promise<MetodoAutenticacion[]> {
    return this.request<MetodoAutenticacion[]>('/auth/methods');
  }

  // ✅ CORREGIDO: Método para configurar Google con email
  async setupGoogleAuth(email: string): Promise<void> {
    return this.request<void>('/auth/setup-google', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // ✅ CORREGIDO: Método para configurar Email/Contraseña
  async setupEmailPassword(email: string, password: string): Promise<void> {
    return this.request<void>('/auth/setup-email-password', {
      method: 'POST', 
      body: JSON.stringify({ email, password }),
    });
  }

  async activateAuthMethod(methodId: string, data?: any): Promise<void> {
    return this.request<void>(`/auth/methods/${methodId}/activate`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async deactivateAuthMethod(methodId: string): Promise<void> {
    return this.request<void>(`/auth/methods/${methodId}/deactivate`, {
      method: 'POST',
    });
  }

  // ✅ CORREGIDO: Renombrar este método para evitar conflicto
  async initiateGoogleOAuth(): Promise<{ authUrl: string }> {
    return this.request<{ authUrl: string }>('/auth/initiate-google-oauth', {
      method: 'POST',
    });
  }

  async checkGoogleAuthStatus(): Promise<{ configured: boolean }> {
    return this.request<{ configured: boolean }>('/auth/google/status');
  }

  // ✅ MÉTODOS EXISTENTES (mantener compatibilidad)
  async register(userData: any): Promise<any> {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: any): Promise<any> {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

async getCurrentUser(): Promise<any> {
  return this.request<any>('/auth/me');
}
}

// ✅ EXPORTAR LA INSTANCIA
export const apiService = new ApiService();
export { ApiService };