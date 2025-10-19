"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  diasSemanaCompletos,
  mesesNombres,
  type Horario,
} from "./constantes";
import { DisponibilidadAPIService, HorarioAPI, InfoProveedor } from "../services/disponibilidad-api.service";

interface HorarioProps {
  fechaSeleccionada: Date;
  proveedorId: string;
  infoProveedor: InfoProveedor;
  onVolver: () => void;
}

function formatearFecha(fecha: Date): string {
  const dia = fecha.getDate();
  const mes = mesesNombres[fecha.getMonth()];
  const diaSemana = diasSemanaCompletos[fecha.getDay()];
  return `${diaSemana} ${dia} de ${mes}`;
}

function getFechaKey(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 🆕 Convertir formato del backend al formato del frontend
function convertirHorariosAPI(horariosAPI: HorarioAPI[]): Horario[] {
  return horariosAPI.map((h, index) => ({
    id: index + 1,
    horaInicio: h.horaInicio,
    horaFin: h.horaFin,
    costo: h.costoHora,
    moneda: "Bs/Hr."
  }));
}

const Horario: React.FC<HorarioProps> = ({ 
  fechaSeleccionada, 
  proveedorId, 
  infoProveedor,
  onVolver 
}) => {
  const router = useRouter();
  const fechaKey = getFechaKey(fechaSeleccionada);
  
  // 🆕 Estados para manejar los horarios del backend
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // 🆕 Cargar horarios desde el backend cuando se monta el componente
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        setCargando(true);
        setError(null);
        setMensaje(null);

        console.log(`📅 Cargando horarios para ${proveedorId} en fecha ${fechaKey}`);
        
        const respuesta = await DisponibilidadAPIService.obtenerHorariosDia(
          proveedorId,
          fechaKey
        );

        if (respuesta.mensaje) {
          // El backend nos dice que no hay horarios disponibles
          setMensaje(respuesta.mensaje);
          setHorarios([]);
        } else if (respuesta.horarios && respuesta.horarios.length > 0) {
          // Convertir los horarios al formato del frontend
          const horariosConvertidos = convertirHorariosAPI(respuesta.horarios);
          setHorarios(horariosConvertidos);
        } else {
          setMensaje("No hay horarios disponibles para esta fecha");
          setHorarios([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar horarios:", err);
        setError("No se pudieron cargar los horarios. Verifica que el backend esté corriendo.");
        setHorarios([]);
      } finally {
        setCargando(false);
      }
    };

    cargarHorarios();
  }, [proveedorId, fechaKey]);

  const solicitarTrabajo = () => {
    if (horarios.length === 0) return;

    const params = new URLSearchParams();
    params.set("date", fechaKey);

    horarios.forEach((h) => {
      params.append("s", `${h.horaInicio}-${h.horaFin}`);
    });

    router.push(`/solicitud-trabajo?${params.toString()}`);
  };

  return (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="w-full px-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
              {infoProveedor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{infoProveedor.profesion}</h2>
              <p className="text-gray-600 text-base">{infoProveedor.nombre}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-600">
                HORARIOS DISPONIBLES
              </h3>
              <p className="text-gray-700 text-sm">
                Para:{" "}
                <span className="font-semibold">
                  {formatearFecha(fechaSeleccionada)}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-8 min-h-[250px]">
            {/* 🆕 Mostrar estado de carga */}
            {cargando ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <p className="text-gray-500 text-base text-center">
                  Cargando horarios disponibles...
                </p>
              </div>
            ) : error ? (
              /* 🆕 Mostrar error si falla la conexión */
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-500 text-base text-center font-semibold mb-2">
                  {error}
                </p>
                <p className="text-gray-500 text-sm text-center">
                  Asegúrate de que el backend esté corriendo en http://localhost:5000
                </p>
              </div>
            ) : mensaje || horarios.length === 0 ? (
              /* 🆕 Mostrar mensaje del backend o "sin horarios" */
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500 text-base text-center">
                  {mensaje || "No hay horarios disponibles para esta fecha"}
                </p>
              </div>
            ) : (
              /* ✅ Mostrar horarios cargados desde el backend */
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-6 text-center font-bold text-gray-700 text-base pb-3 border-b-2 border-gray-200">
                  <div className="text-left">Horario</div>
                  <div>Hora inicio</div>
                  <div>Hora fin</div>
                  <div>Costo/Hora</div>
                </div>

                {horarios.map((h, index) => (
                  <div
                    key={h.id}
                    className="grid grid-cols-4 gap-6 items-center py-5 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <div className="text-blue-600 font-bold text-lg">
                      Horario {index + 1}
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gray-800">
                        {h.horaInicio.split(":")[0]}
                      </span>
                      <span className="text-2xl text-gray-800 mx-1">:</span>
                      <span className="text-3xl font-bold text-gray-800">
                        {h.horaInicio.split(":")[1]}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gray-800">
                        {h.horaFin.split(":")[0]}
                      </span>
                      <span className="text-2xl text-gray-800 mx-1">:</span>
                      <span className="text-3xl font-bold text-gray-800">
                        {h.horaFin.split(":")[1]}
                      </span>
                    </div>
                    <div className="text-center text-base font-semibold text-gray-800">
                      {h.costo} <span className="text-gray-600">{h.moneda}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6 pt-4">
            <button
              onClick={solicitarTrabajo}
              className="bg-blue-600 text-white px-10 py-3 rounded-lg text-base font-bold hover:bg-gray-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={horarios.length === 0 || cargando}
            >
              {cargando ? "Cargando..." : "Solicitar Trabajo"}
            </button>
            <button
              onClick={onVolver}
              className="bg-blue-600 text-white px-10 py-3 rounded-lg text-base font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horario;