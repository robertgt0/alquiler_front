//Componente del botón agendar cita + estado de abrir/cerrar el modal
"use client";
import { useState } from "react";
import AgendarCitaModal from "../components/AgendarCitaModal";

//import ModalWrapper from "./ModalWrapper";
//import CalendarPicker from "./CalendarPicker";

export default function AgendarCitaButton() {
  const [open, setOpen] = useState(false);

  //const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  //const handleDateSelect = (date: Date) => {
    //setSelectedDate(date);
  //};

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-[#4289CC] text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-300 font-medium"
      >
        + Appointment
      </button>

      {/* 🪟 Modal */}
      {open && <AgendarCitaModal onClose={() => setOpen(false)} />}

    </>
  );
}
