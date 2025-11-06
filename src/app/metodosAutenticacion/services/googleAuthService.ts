// services/googleAuthService.ts
export class GoogleAuthService {
  private static clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  private static baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  private static redirectUri = `${this.baseUrl}/auth/google/callback`;

  // Inicia el flujo OAuth - redirige a Google
  static signInWithGoogle(type: 'register' | 'login' | 'setup' = 'register'): void {
    if (!this.clientId) {
      throw new Error('Google Client ID no configurado');
    }
    const authParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: btoa(JSON.stringify({ 
        timestamp: Date.now().toString(), 
        type 
      })),
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
    window.location.href = googleAuthUrl;
  }

  // Procesa el callback de Google
  static async handleGoogleCallback(code: string): Promise<any> {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
    
    const response = await fetch(`${backend}/api/teamsys/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la autenticación con Google');
    }

    return data;
  }

  // Guarda los tokens y datos del usuario
  static saveAuthData(data: any): void {
    // Extraer datos correctamente desde data.data
    const user = data.data.user;
    const accessToken = data.data.accessToken;
    const refreshToken = data.data.refreshToken;

    // Guardar token y usuario
    localStorage.setItem('userToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(user));

    // Guardar en sessionStorage para ImagenLocalizacion
    sessionStorage.setItem('datosUsuarioParcial', JSON.stringify(user));
  }

  // Maneja caso de usuario ya registrado
  static handleExistingUser(data: any): void {
    const token = data.token ?? data.data.token; 

    if (token) sessionStorage.setItem('authToken', token);

    sessionStorage.setItem('userData', JSON.stringify(data));
    
    // Disparar evento de login exitoso para que el Header se actualice
    const eventLogin = new CustomEvent("login-exitoso");
    window.dispatchEvent(eventLogin);
  }

  // Configurar Google Auth para un usuario existente
  static async setupGoogleAuth(userEmail: string): Promise<void> {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
    
    const response = await fetch(`${backend}/api/teamsys/auth/setup-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al configurar Google Auth');
    }

    return data;
  }

  // Cerrar sesión
  static signOut(): void {
    // Limpiar localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('datosUsuarioParcial');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('emailParaValidarGoogle');
    sessionStorage.removeItem('accionGoogle');
    sessionStorage.removeItem('resultadoActivacionGoogle');
    sessionStorage.removeItem('mensajeErrorGoogle');
    
    // Opcional: cerrar sesión de Google
    const googleLogoutUrl = 'https://accounts.google.com/Logout';
    const logoutWindow = window.open(googleLogoutUrl, '_blank');
    
    // Cerrar la ventana después de un tiempo
    if (logoutWindow) {
      setTimeout(() => {
        logoutWindow.close();
      }, 1000);
    }
    
    // Disparar evento de logout
    const eventLogout = new CustomEvent("logout-exitoso");
    window.dispatchEvent(eventLogout);
  }

  // Verificar si está autenticado
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken') || !!sessionStorage.getItem('authToken');
  }

  // Obtener datos del usuario
  static getUserData(): any {
    const localData = localStorage.getItem('userData');
    const sessionData = sessionStorage.getItem('userData');
    
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (error) {
        console.error('Error parsing localStorage userData:', error);
      }
    }
    
    if (sessionData) {
      try {
        return JSON.parse(sessionData);
      } catch (error) {
        console.error('Error parsing sessionStorage userData:', error);
      }
    }
    
    return null;
  }

  // Obtener token de acceso
  static getAccessToken(): string | null {
    return localStorage.getItem('userToken') || sessionStorage.getItem('authToken');
  }

  // Obtener email del usuario actual
  static getCurrentUserEmail(): string | null {
    const userData = this.getUserData();
    if (!userData) return null;

    return userData.correo || userData.email || null;
  }

  // Verificar si hay una activación de Google pendiente
  static hasPendingGoogleActivation(): boolean {
    return !!sessionStorage.getItem('emailParaValidarGoogle');
  }

  // Limpiar datos de activación pendiente
  static clearPendingActivation(): void {
    sessionStorage.removeItem('emailParaValidarGoogle');
    sessionStorage.removeItem('accionGoogle');
    sessionStorage.removeItem('resultadoActivacionGoogle');
    sessionStorage.removeItem('mensajeErrorGoogle');
  }

  // Guardar resultado de activación
  static saveActivationResult(success: boolean, message?: string): void {
    sessionStorage.setItem('resultadoActivacionGoogle', success ? 'exito' : 'error');
    if (message) {
      sessionStorage.setItem('mensajeErrorGoogle', message);
    }
  }

  // Obtener resultado de activación
  static getActivationResult(): { success: boolean; message?: string } | null {
    const resultado = sessionStorage.getItem('resultadoActivacionGoogle');
    const mensaje = sessionStorage.getItem('mensajeErrorGoogle');

    if (!resultado) return null;

    return {
      success: resultado === 'exito',
      message: mensaje || undefined
    };
  }
}