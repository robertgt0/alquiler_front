"use client";

import { useEffect, useMemo, useState } from "react";
import StepIdentity from "./steps/StepIdentity";
import StepLocation from "./steps/StepLocation";
import StepCategories from "./steps/StepCategories";
import StepPayment from "./steps/StepPayment";
import StepTermsView from "./steps/StepTermsView";

type StepKey = "identity" | "location" | "categories" | "payment" | "terms";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "identity",    label: "Datos del Fixer" },                // HU01
  { key: "location",    label: "Establece tu ubicación" },         // HU02
  { key: "categories",  label: "¿Qué trabajos sabes hacer?" },     // HU03
  { key: "payment",     label: "Método de pago" },                 // HU04 (placeholder)
  { key: "terms",       label: "Términos y condiciones" },         // HU05 (placeholder)
];

const LS_STEP = "FIXER_WIZARD_STEP";

export default function ConvertirseFixer() {
  // Arranca en HU01 (index 0)
  const [stepIndex, setStepIndex] = useState(0);

  // Restaurar paso guardado
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(LS_STEP);
    if (saved) setStepIndex(Number(saved) || 0);
  }, []);

  // Guardar paso
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_STEP, String(stepIndex));
  }, [stepIndex]);

  const step = STEPS[stepIndex].key;

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Barra de progreso simple */}
      <div className="text-sm text-gray-600">{stepIndex + 1}/{STEPS.length}</div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-blue-600 rounded"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <h1 className="text-3xl font-bold">{
        step === "identity"   ? "¿Cuál es tu número de C.I.?"
      : step === "location"   ? "Establece tu ubicación"
      : step === "categories" ? "¿Qué tipos de trabajo sabes hacer?"
      : step === "payment"    ? "Método de pago"
      : "Términos y condiciones"
      }</h1>

      {/* Render de pasos */}
      {step === "identity"   && <StepIdentity onNext={next} onBack={prev} />}
      {step === "location"   && <StepLocation onNext={next} onBack={prev} />}
      {step === "categories" && <StepCategories onNext={next} onBack={prev} />}
      {step === "payment"    && <StepPayment onNext={next} onBack={prev} />}
      {step === "terms"      && <StepTermsView onNext={next} onBack={prev} />}
    </div>
  );
}
