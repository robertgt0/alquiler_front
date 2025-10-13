// Servicio para manejar autenticación y registro
export interface UserData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  contraseña: string;
  confirmarContraseña: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  token?: string;
  error?: string;
}

export const authApi = {
  // Registro tradicional
  async register(userData: UserData): Promise<AuthResponse> {
    try {
      // Simulación de llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validación adicional del servidor
      if (userData.contraseña !== userData.confirmarContraseña) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Aquí iría la llamada real a tu backend
      console.log('Enviando datos al servidor:', userData);
      
      // Simulación de respuesta exitosa
      return {
        success: true,
        user: {
          id: 'user-' + Date.now(),
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          telefono: userData.telefono
        },
        token: 'mock-jwt-token-' + Date.now()
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en el registro'
      };
    }
  },

  // Autenticación con Google
  async googleLogin(): Promise<AuthResponse> {
    try {
      // Simulación de autenticación con Google
      console.log('Iniciando autenticación con Google...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En una implementación real, aquí integrarías:
      // 1. Google Sign-In API
      // 2. Envío del token a tu backend
      // 3. Validación en el servidor

      // Simulación de respuesta exitosa
      return {
        success: true,
        user: {
          id: 'google-user-' + Date.now(),
          nombre: 'Usuario',
          apellido: 'Google',
          email: 'usuario@gmail.com',
          telefono: ''
        },
        token: 'google-auth-token-' + Date.now()
      };
    } catch (error) {
      console.error('Error en autenticación Google:', error);
      return {
        success: false,
        error: 'Error en la autenticación con Google'
      };
    }
  },

  // Autenticación con Apple (para futuro)
  async appleLogin(): Promise<AuthResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        user: {
          id: 'apple-user-' + Date.now(),
          nombre: 'Usuario',
          apellido: 'Apple',
          email: 'usuario@apple.com',
          telefono: ''
        },
        token: 'apple-auth-token-' + Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error en la autenticación con Apple'
      };
    }
  }
};