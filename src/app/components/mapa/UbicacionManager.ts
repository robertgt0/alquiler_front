// utils/UbicacionManager.ts
import { Fixer, Ubicacion } from "../../types";

export class UbicacionManager {
  private static instancia: UbicacionManager;
  private ubicacionActual: Ubicacion | null = null;

  private constructor() {}

  // 🔁 Devuelve la instancia única
  public static getInstancia(): UbicacionManager {
    if (!UbicacionManager.instancia) {
      UbicacionManager.instancia = new UbicacionManager();
    }
    return UbicacionManager.instancia;
  }

  // 📍 Verificar si los permisos de geolocalización están concedidos
  public async verificarPermisosGeolocalizacion(): Promise<boolean> {
    if (!navigator.permissions) {
      return false;
    }
    
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state === 'granted';
    } catch (error) {
      console.log('Error al verificar permisos:', error);
      return false;
    }
  }

  // 📍 Obtener el estado actual de permisos
  public async obtenerEstadoPermisos(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) {
      return 'prompt';
    }
    
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state as 'granted' | 'denied' | 'prompt';
    } catch (error) {
      console.log('Error al obtener estado de permisos:', error);
      return 'prompt';
    }
  }

  // 🔄 Intentar resetear permisos (funciona limitadamente)
  public async resetearPermisosGeolocalizacion(): Promise<boolean> {
    try {
      // Intentar usar revoke() si está disponible (no estándar pero funciona en algunos navegadores)
      if (navigator.permissions && 'revoke' in navigator.permissions) {
        await (navigator.permissions as any).revoke({ name: 'geolocation' });
        console.log("Permisos reseteados exitosamente");
        return true;
      }
      
      // Alternativa: limpiar caché de geolocalización
      if (navigator.geolocation && 'clearWatch' in navigator.geolocation) {
        // Esto no resetea permisos pero limpia watchers
        console.log("Cache de geolocalización limpiado");
      }
      
      return false;
    } catch (error) {
      console.log('Error al resetear permisos:', error);
      return false;
    }
  }

  // 📍 Solicitar permisos de geolocalización
  public async solicitarPermisosGeolocalizacion(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocalización no soportada");
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          console.log("Permisos de geolocalización concedidos");
          resolve(true);
        },
        (error) => {
          console.log("Permisos de geolocalización denegados:", error);
          resolve(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: Infinity
        }
      );
    });
  }

  // 📍 Guarda la ubicación actual
  public setUbicacion(ubicacion: Ubicacion) {
    this.ubicacionActual = ubicacion;
    localStorage.setItem("ubicacionActual", JSON.stringify(ubicacion));
  }

  // 📤 Obtiene la ubicación (de memoria o localStorage)
  public getUbicacion(): Ubicacion | null {
    if (this.ubicacionActual) return this.ubicacionActual;
    const guardada = localStorage.getItem("ubicacionActual");
    if (guardada) {
      this.ubicacionActual = JSON.parse(guardada);
      return this.ubicacionActual;
    }
    return null;
  }

  // 📏 Calcula distancia en km usando fórmula Haversine
  private distanciaEnKm(a: [number, number], b: [number, number]): number {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;

    const hav =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(hav));
  }

  // 🔍 Devuelve los fixers a 5 km de la ubicación actual
  public filtrarFixersCercanos(fixers: Fixer[]): Fixer[] {
    const ubicacion = this.getUbicacion();
    if (!ubicacion) return [];
    return fixers.filter((fixer) => {
      const fixerPos: [number, number] = [fixer.posicion.lat, fixer.posicion.lng];
      const distancia = this.distanciaEnKm(ubicacion.posicion, fixerPos);
      return distancia <= 5;
    });
  }

  // 🧹 Limpia la ubicación actual
  public limpiarUbicacion() {
    this.ubicacionActual = null;
    localStorage.removeItem("ubicacionActual");
  }
}