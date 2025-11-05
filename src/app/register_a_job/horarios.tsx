// src/app/register_a_job/disponibilidad/horarios.tsx
"use client";

import React, { useState, useEffect } from "react";
import { diasSemanaCompletos, mesesNombres } from "./Constantes";
import type { Horario as HorarioType } from "./Constantes";
import ModalHorario from "./disponibilidad/components/ModalHorario";

// --- Props del Componente ---
interface HorarioProps {
  fechaSeleccionada: Date;
  onVolver: () => void; // Función para regresar al calendario
}

interface HorarioFromAPI {
  _id: string;
  horaInicio: string;
  horaFin: string;
  costo: number;
  // Agrega aquí otras propiedades si tu API las devuelve
}

// --- Funciones de Utilidad --- formato de fecha ej Lunes 20 de Octubre
function formatearFecha(fecha: Date): string {
  const dia = fecha.getDate();
  const mes = mesesNombres[fecha.getMonth()];
  const diaSemana = diasSemanaCompletos[fecha.getDay()];
  return `${diaSemana} ${dia} de ${mes}`;
}
//
function getFechaKey(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}



// --- Componente Principal ---
const Horarios: React.FC<HorarioProps> = ({ fechaSeleccionada, onVolver }) => {
  const fechaKey = getFechaKey(fechaSeleccionada);
  console.log(fechaKey)
  
  // Usaremos 'useState' para que los horarios puedan cambiar (agregarse, eliminarse, etc.)
  const [horarios, setHorarios] = useState<HorarioType[]>([]);
  const [cargando, setCargando] = useState(true);

  
  //lista de eliminados temporales
  const [horariosEliminados, setHorariosEliminados] = useState<string[]>([]);

  // Estado para controlar la visibilidad del modal (ventana emergente)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para guardar el horario que se está editando
  const [horarioAEditar, setHorarioAEditar] = useState<HorarioType | null>(null);
  
  // Estado para controlar si el botón 'Guardar' general está habilitado
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);

  useEffect(() => {
    const fetchHorarios = async () => {
      setCargando(true);
      try {
        const res = await fetch(`https://back-los-vengadores-4.onrender.com/api/los_vengadores/horarios/${fechaKey}`);
        if (!res.ok) throw new Error("Error al cargar horarios");
        //const data = await res.json();
        //setHorarios(data.data || []);
      
        const data = await res.json();

        // 🔹 Asegura que cada horario tenga un id único
        const horariosConId = (data.data || []).map((h: HorarioFromAPI) => ({
          ...h,
          id: h._id?.toString() || crypto.randomUUID(), // todos los ids como string
        }));
        setHorarios(horariosConId);
      
      } catch (err) {
        console.error(err);
        setHorarios([]);
      } finally {
        setCargando(false);
      }
    };
    fetchHorarios();
  }, [fechaKey]);

  // --- Lógica de Validación ---
  const validarDisponibilidad = (nuevoHorario: HorarioType): boolean => {
    // Convierte horas como "08:00" a minutos (480) para facilitar la comparación
    const aMinutos = (hora: string) => {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    };

    const inicioNuevo = aMinutos(nuevoHorario.horaInicio);
    const finNuevo = aMinutos(nuevoHorario.horaFin);

    if (inicioNuevo >= finNuevo) {
        alert("Error: La hora de inicio no puede ser mayor o igual a la hora de fin.");
        return false;
    }

    // Comprueba si se solapa con otros horarios existentes
    for (const horario of horarios) {
        // Ignora el propio horario que se está editando
        if (horario.id === nuevoHorario.id) continue;

        const inicioExistente = aMinutos(horario.horaInicio);
        const finExistente = aMinutos(horario.horaFin);
        
        // Lógica de solapamiento
        if (Math.max(inicioNuevo, inicioExistente) < Math.min(finNuevo, finExistente)) {
            alert(`Error: El horario se solapa con el existente de ${horario.horaInicio} a ${horario.horaFin}.`);
            return false;
        }
    }
    return true; // No hay conflictos
  };

  // --- Manejadores de Eventos ---
  const handleGuardarHorario = (horarioGuardado: HorarioType) => {
    if (!validarDisponibilidad(horarioGuardado)) return;
  
    if (horarioAEditar) {
      // Editando un horario existente
      setHorarios(prev =>
        prev.map(h => (h.id === horarioAEditar.id ? { ...horarioGuardado, id: h.id } : h))
      );
    } else {
      // Nuevo horario → ID temporal
      const nuevoHorario = {
        ...horarioGuardado,
        id: "temp-" + crypto.randomUUID(),
      };
      setHorarios(prev => [...prev, nuevoHorario]);
    }
  
    setCambiosSinGuardar(true);
    setIsModalOpen(false);
    setHorarioAEditar(null);
  };
  
  const handleEliminarHorario = (id: string) => {
    // Muestra una ventana de confirmación
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este horario?"
    );

    // Si el usuario no confirma, no hace nada
    if (!confirmacion) {
      return; 
    }
    setHorarios(prev => prev.filter(h => h.id !== id));
  
    // Solo agregar a eliminados si es un ID real de la BD
    if (!id.startsWith("temp-")) {
      setHorariosEliminados(prev => [...prev, id]);
    }
  
    setCambiosSinGuardar(true);
  };
  
  const handleAbrirModalParaEditar = (horario: HorarioType) => {
    setHorarioAEditar(horario);
    setIsModalOpen(true);
  };
  
  const handleAbrirModalParaNuevo = () => {
    setHorarioAEditar(null); // Asegura que no haya datos de edición
    setIsModalOpen(true);
  };

  const handleGuardarCambiosEnServidor = async () => {
    try {
      // Primero eliminamos los horarios marcados
      for (const id of horariosEliminados) {
        await fetch(`https://back-los-vengadores-4.onrender.com/api/los_vengadores/horarios/${id}`, {
          method: "DELETE",
        });
      }
  
      // Luego procesamos los nuevos/actualizados horarios
      for (const horario of horarios) {
        if (horario.id.startsWith("temp-")) {
          // Crear nuevo horario
          const res = await fetch(`https://back-los-vengadores-4.onrender.com/api/los_vengadores/horarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fecha: fechaKey,
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              costo: horario.costo,
            }),
          });
          const data = await res.json();
          // Reemplaza ID temporal con ID real de la BD
          setHorarios(prev =>
            prev.map(h => h.id === horario.id ? { ...data.data, id: data.data._id } : h)
          );
        } else {
          // Actualizar horario existente
          const res = await fetch(`https://back-los-vengadores-4.onrender.com/api/los_vengadores/horarios/${horario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              costo: horario.costo,
            }),
          });
          const data = await res.json();
          // Actualiza la lista localmente con la versión más reciente de la BD
          setHorarios(prev =>
            prev.map(h => h.id === horario.id ? { ...data.data, id: data.data._id } : h)
          );
        }
      }
  
      // Limpia la lista de eliminados
      setHorariosEliminados([]);
      setCambiosSinGuardar(false);
      alert("¡Cambios guardados correctamente!");
      onVolver();
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 sm:p-8">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">HORARIOS DISPONIBLES</h1>
            <p className="text-sm sm:text-base text-gray-600">Para: <span className="font-semibold">{formatearFecha(fechaSeleccionada)}</span></p>
          </div>
          <button
            onClick={handleAbrirModalParaNuevo}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow"
          >
            Nuevo Horario
          </button>
        </div>

        {/* Lista de Horarios */}
        <div className="space-y-4">
          {horarios.length > 0 ? (
            horarios.map((horario, index) => (
              <div key={horario.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-100 rounded-lg">
                <div className="md:col-span-2">
                  <span className="font-bold text-gray-700">Horario {index + 1}</span>
                </div>
                
                {/* Inputs para edición */}
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-500">Hora inicio</label>
                  <p className="p-2 bg-white rounded border border-gray-300">{horario.horaInicio}</p>
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-500">Hora fin</label>
                  <p className="p-2 bg-white rounded border border-gray-300">{horario.horaFin}</p>
                </div>
                <div className="md:col-span-2">
                   <label className="text-xs font-semibold text-gray-500">Costo/Hora</label>
                   <p className="p-2 bg-white rounded border border-gray-300">{horario.costo} Bs/Hr.</p>
                </div>

                {/* Botones de acción */}
                <div className="md:col-span-2 flex items-center justify-end space-x-2">
                  <button onClick={() => handleAbrirModalParaEditar(horario)} className="text-blue-500 hover:text-blue-700">✏️</button>
                  <button onClick={() => handleEliminarHorario(horario.id)} className="bg-red-500 text-white w-8 h-8 rounded-md hover:bg-red-600 flex items-center justify-center font-bold">X</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No hay horarios definidos para este día. ¡Agrega uno!</p>
          )}
        </div>
        
        {/* Botones de Navegación (Atrás y Guardar) */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
                onClick={onVolver}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Atrás
            </button>
            <button
                onClick={handleGuardarCambiosEnServidor}
                disabled={!cambiosSinGuardar}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow"
            >
                Guardar
            </button>
        </div>
      </div>

      {/* Renderizado Condicional del Modal */}
      {isModalOpen && (
        <ModalHorario
            horarioInicial={horarioAEditar}
            onClose={() => { setIsModalOpen(false); setHorarioAEditar(null); }}
            onSave={handleGuardarHorario}
        />
      )}
    </div>
  );
};//

export default Horarios;