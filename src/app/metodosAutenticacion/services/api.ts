// services/api.ts
import { MetodoAutenticacion } from '../interfaces/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  /*private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
  }*/

  // ✅ MÉTODOS DE AUTENTICACIÓN - CORREGIDOS

  async getAuthMethods(): Promise<MetodoAutenticacion[]> {
    // Simulamos la respuesta con solo 2 métodos
    const metodos: MetodoAutenticacion[] = [
      {
        id: 'correo',
        nombre: 'Correo Electrónico',
        tipo: 'correo',
        icono: '📧',
        color: 'blue',
        activo: false,
        fechaActivacion: new Date('2024-01-15'),
        configurado: true,
        esMetodoRegistro: false
      },
      {
        id: 'google',
        nombre: 'Google Account', 
        tipo: 'google',
        icono: '🔐',
        color: 'red',
        activo: true,
        fechaActivacion: new Date('2024-01-10'),
        configurado: true,
        esMetodoRegistro: true
      }
    ];
    
    return metodos;
    
    // Si quieres mantener la llamada real al backend, descomenta esta línea:
    // return this.request<MetodoAutenticacion[]>('/auth/methods');
  }
/*
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
*/
async getCurrentUser(): Promise<any> {
    try {
      const userDataString = sessionStorage.getItem("userData");
      
      if (!userDataString) {
        throw new Error("No se encontraron datos de usuario en sessionStorage");
      }
      
      const userData = JSON.parse(userDataString);
      
      // Devuelve el objeto completo de sessionStorage
      return userData;
      
    } catch (error) {
      console.error('Error al obtener usuario de sessionStorage:', error);
      throw new Error("Error al cargar datos del usuario");
    }
  }
}

// ✅ EXPORTAR LA INSTANCIA
export const apiService = new ApiService();
export { ApiService };