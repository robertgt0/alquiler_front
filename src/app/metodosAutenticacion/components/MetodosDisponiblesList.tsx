import React from 'react';
import { MetodoAutenticacion, ModosInterfaz } from '../interfaces/types';
import AuthButton from './AuthButton';

interface MetodosDisponiblesListProps {
  metodosDisponibles: MetodoAutenticacion[];
  metodosActivos: MetodoAutenticacion[];
  modos: ModosInterfaz;
  cargandoGoogle?: boolean;
  onToggleSeleccion: (id: string) => void;
  onDesactivarModos: () => void;
  onActivarMetodos: () => void;
}

export default function MetodosDisponiblesList({
  metodosDisponibles,
  metodosActivos,
  modos,
  cargandoGoogle = false,
  onToggleSeleccion,
  onDesactivarModos,
  onActivarMetodos
}: MetodosDisponiblesListProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Métodos de Autenticación Disponibles
      </h2>
      <div className="space-y-3 max-w-xs mx-auto">
        {metodosDisponibles.map((metodo) => {
          const estaSeleccionado = modos.metodosSeleccionados.includes(metodo.id);
          const estaActivo = metodosActivos.find(m => m.id === metodo.id);
          const esMetodoYaActivo = estaActivo && modos.modoSeleccion;
          const esGoogleCargando = metodo.id === 'google' && cargandoGoogle;
          
          return (
            <div key={metodo.id} className="flex flex-col"> {/* Cambiado a flex-col */}
              
              {/* CONTENEDOR HORIZONTAL: Checkbox + Cuadro del Método */}
              <div className="flex items-center space-x-3">
                
                {/* Checkbox FUERA del cuadro (solo en modo selección) */}
                {modos.modoSeleccion && (
                  <div 
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center  ${
                      estaSeleccionado 
                        ? 'bg-black-800 border-black-800'
                        : 'border-black-800 bg-blue-50 hover:border-black-800' 
                    } ${esGoogleCargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !esGoogleCargando && onToggleSeleccion(metodo.id)}
                  >
                    {estaSeleccionado && !esGoogleCargando && (
                      <span className="text-black text-sm font-bold">✓</span>
                    )}
                    {esGoogleCargando && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    )}
                  </div>
                )}

                {/* Cuadro del método SIN checkbox dentro */}
                <div
                  className={`border-2 rounded-lg p-4 transition-all duration-200 w-full cursor-pointer flex-1 ${
                    modos.modoSeleccion
                      ? estaSeleccionado
                        ? 'border-black-800 bg-blue-50 shadow-md' 
                        : 'border-black bg-blue-50 hover:border-black-800' 
                      : estaActivo
                        ? 'border-black-800 bg-blue-50 shadow-md' 
                        : 'border-black bg-blue-50 hover:border-black-800' 
                  } ${modos.modoSeleccion && !esGoogleCargando ? '' : 'cursor-default'} ${
                    esGoogleCargando ? 'opacity-70' : ''
                  }`}
                  onClick={() => modos.modoSeleccion && !esGoogleCargando && onToggleSeleccion(metodo.id)}
                >
                  <div className="flex items-center space-x-3">
                    {/* Icono del método */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      metodo.color === 'blue' ? 'bg-blue-100' :
                      metodo.color === 'red' ? 'bg-red-100' :
                      metodo.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {esGoogleCargando ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                      ) : (
                        <span className="text-xl">{metodo.icono}</span>
                      )}
                    </div>

                    {/* Nombre del método */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-800">
                          {metodo.nombre}
                        </h3>
                        {esGoogleCargando && (
                          <span className="text-blue-600 text-xs font-medium">
                            Conectando...
                          </span>
                        )}
                      </div>
                      {/* EL MENSAJE FUE ELIMINADO DE AQUÍ */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje "Este método ya está activo" - AHORA DEBAJO del cuadro del método */}
              {esMetodoYaActivo && (
                <div className="mt-1 ml-9 flex"> {/* ml-9 para alinear con el contenido del método */}
                  <div className="w-6 shrink-0"></div> {/* Espacio para alinear con el checkbox */}
                  <p className="text-red-500 text-xs font-medium">
                    Este método ya está habilitado
                  </p>
                </div>
              )}
              
            </div>
          );
        })}

        {/* Botones Aceptar/Cancelar DEBAJO de todas las opciones (solo en modo selección) */}
        {modos.modoSeleccion && (
          <div className="flex justify-end space-x-3 pt-4 mt-4">
            <AuthButton
              texto="Cancelar"
              tipo="secundario"
              onClick={onDesactivarModos}
              className="px-6 py-2"
            />
            <AuthButton
              texto={`Aceptar ${modos.metodosSeleccionados.length > 0 ? `(${modos.metodosSeleccionados.length})` : ''}`}
              tipo="primario"
              onClick={onActivarMetodos}
              deshabilitado={modos.metodosSeleccionados.length === 0 || cargandoGoogle}
              className="px-6 py-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}