// src/app/register_a_job/disponibilidad/components/ModalHorario.tsx
"use client";
import React, { useState, useEffect } from "react";
import type { Horario } from "../../Constantes";
import TimePicker from "./TimePicker";


const PROVEEDOR_ID = "6902c43438df4e88b6680640";
// --- Props del Componente ---
interface ModalHorarioProps {
  onClose: () => void;
  onSave: (horario: Horario) => void;
  horarioInicial: Horario | null; // null para nuevo, o un objeto Horario para editar
}

// --- Componente ---
const ModalHorario: React.FC<ModalHorarioProps> = ({ onClose, onSave, horarioInicial }) => {
  // Estado para manejar los datos del formulario
  const [horaInicio, setHoraInicio] = useState("00:00");
  const [horaFin, setHoraFin] = useState("00:00");

  // useEffect se ejecuta cuando el componente se monta o cuando `horarioInicial` cambia.
  // Sirve para llenar el formulario con los datos del horario que se quiere editar.
  useEffect(() => {
    if (horarioInicial) {
      setHoraInicio(horarioInicial.horaInicio);
      setHoraFin(horarioInicial.horaFin);
    }
  }, [horarioInicial]);
  
  
  const handleGuardar = () => {
    // Validamos que el costo no esté vacío
    
    
    // Creamos el objeto horario para enviarlo al componente padre
    const horarioAGuardar: Horario = {
        id: horarioInicial ? horarioInicial.id : "",
        proveedorId:PROVEEDOR_ID, // 0 si es nuevo, para que el padre le asigne ID
        horaInicio,
        horaFin
    };
    onSave(horarioAGuardar);
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {horarioInicial ? "Editar Horario" : "Crear Nuevo Horario"}
        </h2>
        
        {/* Formulario */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <TimePicker label="Hora Inicio" value={horaInicio} onChange={setHoraInicio} />
            <TimePicker label="Hora Fin" value={horaFin} onChange={setHoraFin} />
          </div>
          
        </div>
        
        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHorario;