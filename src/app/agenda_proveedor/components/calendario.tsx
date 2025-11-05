"use client";
import React, { useState, useEffect } from "react";
import { mesesNombres, diasSemanaCortos } from "./constantes";
import Horario from "./horarios";
import { DisponibilidadAPIService, InfoProveedor } from "../services/disponibilidad-api.service";

const Calendario: React.FC = () => {
  const [mostrarHorarios, setMostrarHorarios] = useState(false);

  const hoy = new Date();
  const [currentMonth, setCurrentMonth] = useState(hoy.getMonth());
  const [currentYear, setCurrentYear] = useState(hoy.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  
  // Estado para la info del proveedor
  const [infoProveedor, setInfoProveedor] = useState<InfoProveedor>({
    nombre: "Cargando...",
    profesion: "Cargando...",
    descripcion: ""
  });
  const [cargandoInfo, setCargandoInfo] = useState(true);

  // --- INICIO: Estados para el Modal de WhatsApp ---
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const numeroWhatsapp = "59177999766";
  // --- FIN: Estados para el Modal de WhatsApp ---

  // Cargar info del proveedor al montar el componente
  useEffect(() => {
    const cargarInfoProveedor = async () => {
      try {
        setCargandoInfo(true);
        const info = await DisponibilidadAPIService.obtenerInfoProveedor("proveedor_123");
        setInfoProveedor(info);
      } catch (error)
{
        console.error("Error al cargar info del proveedor:", error);
        setInfoProveedor({
          nombre: "Juan Pérez",
          profesion: "Electricista",
          descripcion: "Especialista en electricidad"
        });
      } finally {
        setCargandoInfo(false);
      }
    };

    cargarInfoProveedor();
  }, []);

  // --- INICIO: Funciones del Modal de WhatsApp ---
  const abrirModalWhatsApp = () => {
    // 1. Generar el mensaje pre-cargado
    let mensajeTexto = "Hola, estoy interesado en sus servicios.";
    if (!cargandoInfo && infoProveedor.nombre && infoProveedor.nombre !== "Cargando...") {
      mensajeTexto = `Hola ${infoProveedor.nombre}, estoy interesado en sus servicios.`;
    }
    // 2. Setearlo en el estado del modal
    setMensajeModal(mensajeTexto);
    // 3. Mostrar el modal
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const handleContactarModal = () => {
    // Construye la URL con el mensaje (potencialmente editado)
    const whatsappUrl = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeModal)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    cerrarModal();
  };
  // --- FIN: Funciones del Modal de WhatsApp ---

  const getDaysInMonth = (month: number, year: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number): number => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // 0 = Domingo, 1 = Lunes... -> Lunes = 0, Domingo = 6
  };

  const isToday = (date1: Date, date2: Date): boolean =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const seleccionarFecha = (day: number) => {
    const nuevaFecha = new Date(currentYear, currentMonth, day);
    setFechaSeleccionada(nuevaFecha);
  };

  const mesAnterior = () => {
    let nuevoMes = currentMonth - 1;
    let nuevoAnio = currentYear;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio--;
    }
    setCurrentMonth(nuevoMes);
    setCurrentYear(nuevoAnio);
    setFechaSeleccionada(null);
  };

  const mesSiguiente = () => {
    let nuevoMes = currentMonth + 1;
    let nuevoAnio = currentYear;
    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio++;
    }
    setCurrentMonth(nuevoMes);
    setCurrentYear(nuevoAnio);
    setFechaSeleccionada(null);
  };

  const handleSiguiente = () => {
    if (fechaSeleccionada) {
      setMostrarHorarios(true);
    }
  };

  const generarDias = (): React.ReactElement[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const celdas: React.ReactElement[] = [];

    for (let i = 0; i < firstDay; i++) {
      celdas.push(<div key={`empty-${i}`} className="w-full h-20"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fecha = new Date(currentYear, currentMonth, day);
      fecha.setHours(0, 0, 0, 0);
      const isCurrentDay = isToday(fecha, today);
      const esPasado = fecha < today && !isCurrentDay;
      const isSelected = fechaSeleccionada && isToday(fecha, fechaSeleccionada);

      let clases = "w-full h-20 flex items-center justify-center rounded-lg font-bold transition-all duration-200 text-lg cursor-pointer ";

      if (esPasado) {
        clases += "bg-gray-200 text-gray-400 cursor-not-allowed";
      } else if (isSelected) {
        clases += "bg-blue-700 text-white ring-4 ring-blue-600 scale-105 shadow-lg";
      } else {
        clases += "bg-blue-400 text-white hover:bg-blue-500 hover:scale-105 shadow-md";
      }

      celdas.push(
        <div
          key={day}
          className={clases}
          onClick={() => !esPasado && seleccionarFecha(day)}
        >
          {day}
        </div>
      );
    }

    return celdas;
  };

  if (mostrarHorarios && fechaSeleccionada) {
    return (
      <Horario
        fechaSeleccionada={fechaSeleccionada}
        proveedorId="proveedor_123"
        infoProveedor={infoProveedor}
        onVolver={() => {
          setFechaSeleccionada(null);
          setMostrarHorarios(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-white py-4 px-4 sm:py-8 sm:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-xl mb-8">
          <div className="border-b-4 border-blue-600 pb-3 mb-8 inline-block">
            <h1 className="text-3xl font-bold text-blue-600">
              AGENDA TU SERVICIO
            </h1>
          </div>
          
          <div className="flex items-center justify-between gap-5 mt-4">
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {cargandoInfo ? "..." : infoProveedor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {cargandoInfo ? "Cargando..." : infoProveedor.profesion}
                </h2>
                <p className="text-gray-600 text-base"> {/* <- Estilo de "Juan Perez" */}
                  {cargandoInfo ? "Cargando..." : infoProveedor.nombre}
                </p>
              </div>
            </div>
            
            <button
              onClick={abrirModalWhatsApp}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Contactar por WhatsApp"
            >
              <img
                src="/wpp.png"
                alt="Contactar por WhatsApp"
                className="w-14 h-14"
              />
              <span className="text-base text-gray-600 mt-2">
                contactar
              </span>
            </button>
            
          </div>
        </div>

        <div className="bg-white rounded-xl">
          <div className="flex items-center justify-center gap-8 mb-8">
            <button
              onClick={mesAnterior}
              className="text-blue-600 hover:text-blue-700 transition-all hover:bg-blue-50 rounded-lg p-2"
              aria-label="Mes anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
              {mesesNombres[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={mesSiguiente}
              className="text-blue-600 hover:text-blue-700 transition-all hover:bg-blue-50 rounded-lg p-2"
              aria-label="Mes siguiente"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-4">
            {diasSemanaCortos.map((dia, index) => (
              <div
                key={index}
                className="text-center font-bold text-gray-700 text-base py-3 bg-blue-50 rounded-lg"
              >
                {dia.substring(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 mb-8">
            {generarDias()}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSiguiente}
              disabled={!fechaSeleccionada}
              className="px-20 py-3 rounded-lg text-base font-bold transition-all shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* --- INICIO: MODAL DE WHATSAPP --- */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Mensaje</h3>
            <p className="text-sm text-gray-600 mb-2">Edita tu mensaje antes de enviarlo por WhatsApp:</p>
            <textarea
              value={mensajeModal}
              onChange={(e) => setMensajeModal(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-900" // <-- COLOR AÑADIDO AQUÍ
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={cerrarModal}
                className="px-6 py-2 rounded-lg text-base font-bold transition-all bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleContactarModal}
                className="px-6 py-2 rounded-lg text-base font-bold transition-all shadow-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Contactar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- FIN: MODAL DE WHATSAPP --- */}
    </div>
  );
};

export default Calendario;