"use client";
import React, { useState } from "react";
import { mesesNombres, diasSemanaCortos } from "./Constantes";
import Horarios from "./horarios";

const Calendario: React.FC = () => {
  const hoy = new Date();
  const [currentMonth, setCurrentMonth] = useState(hoy.getMonth());
  const [currentYear, setCurrentYear] = useState(hoy.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  const getDaysInMonth = (month: number, year: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number): number => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
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

  if (fechaSeleccionada) {
    return (
      <Horarios
        fechaSeleccionada={fechaSeleccionada}
        onVolver={() => setFechaSeleccionada(null)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-white py-8 px-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-xl mb-8">
          <div className="border-b-4 border-blue-600 pb-3 mb-8 inline-block">
            <h1 className="text-3xl font-bold text-blue-600">
              AGREGAR DISPONIBILIDAD
            </h1>
          </div>
          
          <div className="flex items-center gap-5 mt-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              JP
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Electricista</h2>
              <p className="text-gray-600 text-base">Juan Pérez</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={mesAnterior}
              className="text-3xl text-blue-600 hover:text-blue-700 transition-all p-3 hover:bg-blue-50 rounded-lg"
              aria-label="Mes anterior"
            >
              ◀
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {mesesNombres[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={mesSiguiente}
              className="text-3xl text-blue-600 hover:text-blue-700 transition-all p-3 hover:bg-blue-50 rounded-lg"
              aria-label="Mes siguiente"
            >
              ▶
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
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendario;