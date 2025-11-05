// services/googleAuthService.ts
export class GoogleAuthService {
  private static clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  private static isGoogleLoaded = false;

  // Cargar Google API
  static loadGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isGoogleLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isGoogleLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  // Iniciar autenticación con Google
  static async signInWithGoogle(): Promise<{ email: string; name: string; idToken: string }> {
    await this.loadGoogleAuth();

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !(window as any).google) {
        reject(new Error('Google API not available'));
        return;
      }

      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'email profile openid',
        callback: async (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          try {
            // Obtener información del usuario con el access token
            const userInfo = await this.getUserInfo(response.access_token);
            resolve({
              email: userInfo.email,
              name: userInfo.name,
              idToken: response.access_token
            });
          } catch (error) {
            reject(error);
          }
        },
      });

      client.requestAccessToken();
    });
  }

  // Obtener información del usuario desde Google
  private static async getUserInfo(accessToken: string): Promise<{ email: string; name: string }> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info from Google');
    }

    return response.json();
  }

  // Cerrar sesión de Google
  static signOut(): void {
    if (typeof window !== 'undefined' && (window as any).google) {
      const auth2 = (window as any).google.accounts.oauth2;
      if (auth2) {
        auth2.revoke(localStorage.getItem('google_access_token'), () => {
          console.log('Google session revoked');
        });
      }
    }
  }

  // Verificar si el usuario está autenticado con Google
  static isSignedIn(): boolean {
    return !!localStorage.getItem('google_access_token');
  }
}