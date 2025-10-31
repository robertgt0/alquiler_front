import { useState, useEffect } from 'react';

interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  rating: number;
  proveedorId: {
    _id: string;
    nombre: string;
  };
}

export const useServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/devcode/servicios`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setServicios(data.data);
        } else {
          setError("Respuesta inesperada del backend");
          setServicios([]);
        }
      } catch (err) {
        setError("Error al cargar servicios");
        console.error("Error al cargar servicios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [API_URL]);

  return { servicios, loading, error };
};