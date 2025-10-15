import { JobFrontend } from '../types/job';

class JobService {
  private static API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  static async getJobsFromBackend(): Promise<JobFrontend[]> {
    try {
      // ✅ CORREGIDO: usa la variable API_BASE en lugar de string hardcodeado
      const url = `${this.API_BASE}/busqueda?q=alquiler`;
      console.log('🔗 URL:', url);

      const response = await fetch(url); // ← Usa la variable 'url'

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Datos del backend:', data);

      if (data.success && data.resultados) {
        console.log('✅ Resultados encontrados:', data.resultados.length);
        return this.convertBackendResults(data.resultados);
      }

      console.log('⚠️ No hay resultados en la base de datos');
      return [];

    } catch (error) {
      console.error('❌ Error obteniendo jobs:', error);
      throw new Error('No se pudieron cargar los trabajos desde el servidor');
    }
  }

  static async searchJobsInBackend(query: string): Promise<JobFrontend[]> {
    try {
      console.log('🔍 Buscando en backend:', query);

      if (!query.trim()) {
        return this.getJobsFromBackend();
      }

      // ✅ Ruta correcta para búsquedas
      const response = await fetch(`${this.API_BASE}/busqueda?q=${encodeURIComponent(query)}`);

      console.log('🔗 URL de búsqueda:', `${this.API_BASE}/busqueda?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.resultados) {
        console.log('✅ Resultados de búsqueda:', data.resultados);
        return this.convertBackendResults(data.resultados);
      }

      // ❌ NO hay búsqueda local - si no hay resultados, array vacío
      return [];

    } catch (error) {
      console.error('❌ Error en búsqueda backend:', error);
      throw new Error('Error al buscar trabajos en el servidor');
    }
  }

  private static convertBackendResults(resultados: string[]): JobFrontend[] {
    console.log('🔄 [CONVERSIÓN] Resultados recibidos:', resultados);
    console.log('🔄 [CONVERSIÓN] Tipo de resultados:', typeof resultados);
    console.log('🔄 [CONVERSIÓN] Es array?', Array.isArray(resultados));

    // ✅ CONVERSIÓN CORREGIDA
    const converted = resultados.map((especialidad, index) => {
      const job = {
        id: (index + 1).toString(),
        title: `Servicio de ${especialidad}`,
        company: `${especialidad} Professionals`,
        service: especialidad,
        location: "Bolivia",
        postedDate: "Publicado recientemente",
        salaryRange: "Bs 5,000 - Bs 15,000",
        employmentType: "Servicios",
        employmentTypeColor: "bg-green-100 text-green-800"
      };
      console.log(`🔄 [CONVERSIÓN] Job ${index}:`, job);
      return job;
    });

    console.log('🔄 [CONVERSIÓN] Total convertido:', converted.length);
    return converted;
  }
}

// Exportaciones
export const getJobs = async (): Promise<JobFrontend[]> => {
  return await JobService.getJobsFromBackend();
};

export const searchJobs = async (query: string): Promise<JobFrontend[]> => {
  return await JobService.searchJobsInBackend(query);
};

export default JobService;