import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import ProfileHeader from './components/ProfileHeader';
import ServicesList from './components/ServicesList';
import PortfolioGrid from './components/PortfolioGrid';
import ReviewsList from './components/ReviewsList';

type UsuarioAPI = {
  _id?: string;
  id_usuario?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
  fecha_registro?: string;
  ciudad?: any;
  especialidades?: Array<any>;
  servicios?: Array<any>;
  calificaciones?: Array<any>;
  portfolio?: Array<any>;
  descripcion?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

async function getUser(id: string) {
  const endpoint = `${API_BASE}/borbotones/usuarios/${id}`;
  console.log('Fetching from:', endpoint);
  
  try {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  try {
    if (!API_BASE) {
      console.error('API_BASE is not defined');
      return <div className="p-6">Error: API_BASE no está definido</div>;
    }

    const id = params.id;
    if (!id) {
      return (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-xl font-semibold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700">No se proporcionó un ID de usuario válido.</p>
            <Link href="/alquiler/paginacion" className="mt-4 inline-block text-blue-600 hover:underline">
              Volver a la lista de usuarios
            </Link>
          </div>
        </div>
      );
    }

    console.log('API_BASE:', API_BASE);
    console.log('ID del usuario:', id);
    
    // Primero intentar con el endpoint usando id_usuario
    // Intentar obtener usuario por id_usuario o por _id
    // Intentar obtener usuario con manejo de timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
    
    // Asegurarse de que la URL se construya correctamente
    const endpoint = `${API_BASE}/borbotones/usuarios/${id}`;
    console.log('Intentando fetch a:', endpoint);
    
    const res = await fetch(endpoint, { 
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      // Si no encontrado, mostrar mensaje amigable con opción para volver
      if (res.status === 404) {
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Usuario no encontrado</h2>
            <p className="text-gray-600 mb-4">No pudimos encontrar un profesional con el identificador proporcionado.</p>
            <div className="flex gap-3">
              <Link href="/alquiler/paginacion" className="px-4 py-2 bg-blue-600 text-white rounded">Volver a resultados</Link>
              <Link href="/alquiler" className="px-4 py-2 border border-gray-300 rounded">Ir al inicio</Link>
            </div>
            <div className="mt-4 text-xs text-gray-400">Endpoint intentado: {endpoint}</div>
          </div>
        );
      }
      return <div className="p-6">Error al obtener los datos: {res.status}</div>;
    }

    const json = await res.json();
    const usuario: UsuarioAPI = json.data;

    if (!usuario) return <div className="p-6">Usuario sin datos.</div>;

    const postedDate = usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : '';

    // Resolver origen del servidor (sin /api) para imágenes relativas
    const SERVER_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/api\/?$/, '');

    // calcular rating promedio si existe
    const promedio = (usuario.calificaciones && usuario.calificaciones.length > 0)
      ? (usuario.calificaciones.reduce((acc:any, c:any) => acc + (c.puntuacion || 0), 0) / usuario.calificaciones.length)
      : undefined;

  const avatar = (usuario as any).avatar || (usuario as any).foto || (usuario.portfolio && usuario.portfolio[0] && (usuario.portfolio[0].url || usuario.portfolio[0].path)) || undefined;

    return (
      <div className="min-h-screen w-full" style={{ background: 'linear-gradient(135deg, #e5e7eb 0%, #bfc5d2 100%)' }}>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Link href="/alquiler/paginacion" className="mb-4 inline-flex items-center px-6 py-3 text-base font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a las ofertas
          </Link>

          <ProfileHeader
            nombre={usuario.nombre}
            servicios={usuario.servicios}
            activo={usuario.activo}
            fecha_registro={usuario.fecha_registro}
            avatarUrl={avatar && String(avatar).startsWith('http') ? String(avatar) : (avatar ? `${SERVER_ORIGIN}${avatar}` : undefined)}
            rating={promedio ? Number(promedio.toFixed(1)) : undefined}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Descripción */}
              <div className="bg-white rounded-lg shadow p-6 border" style={{ borderColor: '#1769ff' }}>
                <h2 className="font-medium text-lg mb-2 text-blue-600">Sobre el Profesional</h2>
                <p className="leading-relaxed text-gray-700">{usuario.descripcion || 'Sin descripción. Este profesional no ha añadido una descripción todavía.'}</p>
              </div>

              <ServicesList servicios={usuario.servicios} />

              <PortfolioGrid portfolio={usuario.portfolio} serverOrigin={SERVER_ORIGIN} />

              <ReviewsList calificaciones={usuario.calificaciones} />
            </div>

            <div className="space-y-6">
              {/* Sidebar: contacto / botones */}
              <div className="bg-white rounded-lg shadow p-6 border" style={{ borderColor: '#1769ff' }}>
                <h3 className="text-lg font-medium mb-3">Contactar</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 rounded">Solicitar Presupuesto</button>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded">WhatsApp</button>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded">Videollamada</button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border" style={{ borderColor: '#1769ff' }}>
                <h4 className="text-sm text-gray-500">Ubicación</h4>
                <div className="mt-2 font-medium">{usuario.ciudad?.nombre || usuario.ciudad || 'Sin ubicación'}</div>
                <div className="mt-4 text-sm text-gray-500">Registrado desde {postedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetch usuario:', error);
    return <div className="p-6">Error al cargar los datos.</div>;
  }
}
