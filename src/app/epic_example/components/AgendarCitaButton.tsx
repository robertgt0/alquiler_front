"use client";

import { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import CalendarPicker from "./CalendarPicker";

export default function AgendarCitaButton() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#4289CC] text-white rounded hover:bg-blue-500 transition"
      >
        Agendar Cita
      </button>

      <ModalWrapper isOpen={open} onClose={() => setOpen(false)}>
        <h1 className="text-2xl font-bold mb-6">Agendar cita</h1>
        <CalendarPicker onDateSelect={handleDateSelect} />

        {selectedDate && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                console.log("Fecha confirmada:", selectedDate);
                setOpen(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Confirmar
            </button>
          </div>
        )}
      </ModalWrapper>
    </>
  );
}
