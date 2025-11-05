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
            deshabilitado={metodosActivos.length === 0 || modos.modoEliminar || metodos.length <= 1}
            className="px-4 py-2"
          />
        </div>
      </div>

      {/* Lista vertical de métodos activos */}
      <div className="space-y-3">
        {metodosActivos.length > 0 ? (
          metodosActivos.map((metodo) => {
            const estaSeleccionadoParaEliminar = modos.metodosAEliminar.includes(metodo.id);

            return (
              <div key={metodo.id} className="flex items-center space-x-3">
                {/* Checkbox para eliminar (solo en modo eliminar) */}
                {modos.modoEliminar && (
                  <div 
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                      estaSeleccionadoParaEliminar 
                        ? 'border-black-500' 
                        : 'border-black-300 bg-white hover:border-black-500'
                    } ${
                      metodos.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => metodos.length > 1 && onToggleEliminar(metodo.id)}
                  >
                    {estaSeleccionadoParaEliminar && (
                      <span className="text-black text-sm font-bold">✓</span>
                    )}
                  </div>
                )}

                {/* Cuadro del método activo */}
                <div className=" p-4 w-full">
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
                        <h3 className="text-base font-semibold text-black-800">
                          {metodo.nombre}
                        </h3>
                      </div>
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
            deshabilitado={modos.metodosAEliminar.length === 0 || metodos.length <= 1}
            className="px-6 py-2"
          />
        </div>
      )}
    </div>
  );
}