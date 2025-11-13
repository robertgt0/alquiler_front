'use client';

// 👈 CORRECCIÓN: Comentamos los hooks que ya no se usan
// import { useState, useEffect, useMemo, Suspense } from "react";
import { Suspense } from "react"; // (Dejamos solo Suspense)
// 👈 CORRECCIÓN: Quitamos useRouter que no se usa
import { useSearchParams } from "next/navigation"; 
// import JobCard from "./components/jobCard";
// import { UserProfileCard } from "./components/UserProfileCard";
// import Pagination from "./components/Pagination";
// import { getJobs } from "./services/jobService";
// import { usePagination } from "./hooks/usePagination";
// 👈 CORRECCIÓN: Comentamos el tipo 'Job' que no se usa
// import { Job } from "./types/job";
// import BusquedaAutocompletado from "../Busqueda/busquedaAutocompletado";
// import FiltrosForm from "../Feature/Componentes/FiltroForm";
// import { UsuarioResumen } from "../Feature/Types/filtroType";

// Componente de carga
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center p-8 min-h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando búsqueda...</span>
    </div>
  );
}

// Componente principal que usa useSearchParams - envuelto en Suspense
function BusquedaContent() {
  // 👈 CORRECCIÓN: Comentamos 'router' porque no se usa
  // const router = useRouter(); 

  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // ---------------- Render ----------------
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-500">Página de Paginación (Desactivada Temporalmente)</h1>
      <p className="text-gray-700 mt-2">
        {/* 👈 CORRECCIÓN: Usamos &apos; en lugar de comillas simples */}
        Esta página (&apos;alquiler/paginacion&apos;) se desactivó temporalmente porque
        las importaciones de componentes que trajo la fusión del Sprint 2
        están rotas y rompían el &apos;build&apos;.
      </p>
      <p className="text-gray-500 mt-4">Query buscado: {urlQuery}</p>
    </div>
  );
}

// Componente principal exportado
export default function BusquedaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusquedaContent />
    </Suspense>
  );
}