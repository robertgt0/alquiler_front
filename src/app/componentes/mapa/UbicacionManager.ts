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