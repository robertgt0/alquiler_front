// src/app/components/UbicacionManager.ts
import { Fixer, Ubicacion } from "../../types";

type PermissionStateLike = "granted" | "denied" | "prompt";
type PermissionStatusLike = { state: PermissionStateLike };

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
    if (typeof navigator === "undefined" || !("permissions" in navigator)) {
      return false;
    }

    try {
      const permissions = (navigator as unknown) as {
        query: (params: { name: "geolocation" }) => Promise<PermissionStatusLike>;
      };
      const result = await permissions.query({ name: "geolocation" });
      return result.state === "granted";
    } catch (error) {
      console.log("Error al verificar permisos:", error);
      return false;
    }
  }

  // 📍 Solicitar permisos de geolocalización (intenta obtener la posición)
  public async solicitarPermisosGeolocalizacion(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
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
          maximumAge: Infinity,
        }
      );
    });
  }

  // 📍 Guarda la ubicación actual
  public setUbicacion(ubicacion: Ubicacion): void {
    this.ubicacionActual = ubicacion;
    try {
      localStorage.setItem("ubicacionActual", JSON.stringify(ubicacion));
    } catch (e) {
      console.warn("No se pudo guardar ubicación en localStorage:", e);
    }
  }

  // 📤 Obtiene la ubicación (de memoria o localStorage)
  public getUbicacion(): Ubicacion | null {
    if (this.ubicacionActual) return this.ubicacionActual;
    try {
      const guardada = localStorage.getItem("ubicacionActual");
      if (guardada) {
        this.ubicacionActual = JSON.parse(guardada) as Ubicacion;
        return this.ubicacionActual;
      }
    } catch (e) {
      console.warn("Error leyendo localStorage:", e);
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
  public limpiarUbicacion(): void {
    this.ubicacionActual = null;
    try {
      localStorage.removeItem("ubicacionActual");
    } catch (e) {
      /* no-op */
    }
  }
}
