"use client";
import { useState } from "react";
import type { WizardStepProps } from "./types";

export default function StepIdentity({ onNext, onBack }: WizardStepProps) {
  const [ci, setCi] = useState("");

  function handleNext() {
    if (!ci) return alert("El campo C.I. es obligatorio");
    if (!/^\d+$/.test(ci)) return alert("C.I. inválido — solo números");
    if (ci.length < 6 || ci.length > 10)
      return alert("El C.I. no cumple con la longitud permitida");
    localStorage.setItem("FIXER_CI", ci);
    onNext();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">¿Cuál es tu número de C.I.?</h2>
      <input
        type="text"
        value={ci}
        onChange={(e) => setCi(e.target.value)}
        placeholder="Ingresa tu número de C.I."
        className="border border-gray-300 rounded-md p-2 w-72 text-center"
      />
      <div className="flex gap-3">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-md">
          Atrás
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Siguiente
        </button>
      </div>
    </div>
  );
}
