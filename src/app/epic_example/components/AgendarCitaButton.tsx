"use client";
import { useState } from "react";

export default function AppointmentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#4289CC] text-white rounded hover:bg-blue-500"
      >
        Agendar Cita
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded shadow-lg w-[400px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ×
            </button>

            <h1 className="text-4xl font-bold mb-6">Agendar cita</h1>
            <p>...Aquí irá el calendario con horarios...</p>
          </div>
        </div>
      )}
    </>
  );
}