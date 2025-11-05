import React from 'react';
import { MetodoAutenticacion, ModosInterfaz } from '../interfaces/types';
import AuthButton from './AuthButton';

interface MetodoActivoPanelProps {
  metodosActivos: MetodoAutenticacion[];
  modos: ModosInterfaz;
  metodos: MetodoAutenticacion[];
  onToggleEliminar: (id: string) => void;
  onActivarModoSeleccion: () => void;
  onActivarModoEliminar: () => void;
  onDesactivarModos: () => void;
  onEliminarMetodos: () => void;
}

export default function MetodoActivoPanel({
  metodosActivos,
  modos,
  metodos,
  onToggleEliminar,
  onActivarModoSeleccion,
  onActivarModoEliminar,
  onDesactivarModos,
  onEliminarMetodos
}: MetodoActivoPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Encabezado con título y botones alineados */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Métodos Activos
        </h2>
        <div className="flex space-x-3">
          {/* Botón NUEVO - Siempre dice "Nuevo" */}
          <AuthButton
            texto="Nuevo"
            tipo="primario"
            onClick={onActivarModoSeleccion}
            className="px-4 py-2"
          />
          <AuthButton
            texto="Eliminar"
            tipo="peligro"
            onClick={onActivarModoEliminar}
            deshabilitado={metodosActivos.length === 0 || modos.modoEliminar || metodosActivos.length <= 1}
            className="px-4 py-2"
          />
        </div>
      </div>

      {/* Lista vertical de métodos activos */}
      <div className="space-y-3">
        {metodosActivos.length > 0 ? (
          metodosActivos.map((metodo) => {
            const estaSeleccionadoParaEliminar = modos.metodosAEliminar.includes(metodo.id);
            const esMetodoRegistro = metodo.esMetodoRegistro;
            const puedeEliminar = !esMetodoRegistro && metodosActivos.length > 1;

            return (
              <div key={metodo.id} className="flex items-center space-x-3">
                {/* Checkbox para eliminar (solo en modo eliminar) */}
                {modos.modoEliminar && (
                  <div 
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                      puedeEliminar ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    } ${
                      estaSeleccionadoParaEliminar 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300 bg-white hover:border-blue-500'
                    }`}
                    onClick={() => puedeEliminar && onToggleEliminar(metodo.id)}
                  >
                    {estaSeleccionadoParaEliminar && (
                      <span className="text-white text-sm font-bold">✓</span>
                    )}
                  </div>
                )}

                {/* Cuadro del método activo */}
                <div className={`border-2 rounded-lg p-4 w-full transition-all ${
                  modos.modoEliminar && estaSeleccionadoParaEliminar 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    {/* Icono del método */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      metodo.color === 'blue' ? 'bg-blue-100' :
                      metodo.color === 'red' ? 'bg-red-100' :
                      metodo.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-xl">{metodo.icono}</span>
                    </div>

                    {/* Nombre del método y estado */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <h3 className="text-base font-semibold text-gray-800">
                            {metodo.nombre}
                          </h3>
                          {/* ✅ INDICADOR DE MÉTODO DE REGISTRO */}
                          {esMetodoRegistro && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                              Registro
                            </span>
                          )}
                        </div>
                        {/* Indicador de estado activo */}
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Activo
                        </span>
                      </div>
                      
                      {/* Mensaje informativo para método de registro */}
                      {esMetodoRegistro && modos.modoEliminar && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          No se puede eliminar el método de registro
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">No hay métodos activos</p>
            <p className="text-yellow-600 text-sm mt-1">
              Presiona "Nuevo" para agregar un método
            </p>
          </div>
        )}
      </div>

      {/* Botones Aceptar/Cancelar (solo en modo eliminar) */}
      {modos.modoEliminar && metodosActivos.length > 0 && (
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200">
          <AuthButton
            texto="Cancelar"
            tipo="secundario"
            onClick={onDesactivarModos}
            className="px-6 py-2"
          />
          <AuthButton
            texto={`Aceptar ${modos.metodosAEliminar.length > 0 ? `(${modos.metodosAEliminar.length})` : ''}`}
            tipo="peligro"
            onClick={onEliminarMetodos}
            deshabilitado={modos.metodosAEliminar.length === 0 || metodosActivos.length <= 1}
            className="px-6 py-2"
          />
        </div>
      )}
    </div>
  );
}