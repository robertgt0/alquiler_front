"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TarjetaCategoria from "./TarjetaCategoria"; // 👈 CORRECCIÓN 1: Importación singular 'TarjetaCategoria'
import BotonVerMas from "./BotonVerMas";
import type { Categoria } from "./tipos";

// --- Componentes auxiliares para Carga y Error ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg max-w-lg mx-auto">
    <p className="font-bold">Error al cargar las categorías:</p>
    <p className="font-mono text-sm mt-2">{message}</p>
    <p className="mt-2 text-sm text-gray-700">Asegúrate de que el servidor backend (npm run dev) esté corriendo.</p>
  </div>
);
// --- Fin de componentes auxiliares ---


type Props = {
  filasIniciales?: number;
  filasPorClic?: number;
  onCategoriaClick?: (c: Categoria) => void;
};

/* El hook 'useTarjetasPorFila' no necesita cambios */
function useTarjetasPorFila() {
  const [porFila, setPorFila] = useState(4);
  useEffect(() => {
    const rules = [
      { mq: "(min-width: 1024px)", val: 4 }, // lg
      { mq: "(min-width: 640px)", val: 2 }, // sm
    ];
    const update = () => {
      if (typeof window === "undefined") return;
      for (const { mq, val } of rules) {
        if (window.matchMedia(mq).matches) { setPorFila(val); return; }
      }
      setPorFila(1); // < sm
    };

    if (typeof window === "undefined") return;
    update();
    const subs = rules.map(({ mq }) => {
      const mm = window.matchMedia(mq);
      const cb = () => update();
      mm.addEventListener?.("change", cb);
      return { mm, cb };
    });
    return () => subs.forEach(({ mm, cb }) => mm.removeEventListener?.("change", cb));
  }, []);
  return porFila;
}


export default function ListaCategorias({
  filasIniciales = 2,
  filasPorClic = 3,
  onCategoriaClick,
}: Props) {

  const [allCategories, setAllCategories] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("La variable NEXT_PUBLIC_API_URL no está configurada en .env.local");
        }

        const response = await fetch(`${apiUrl}/api/softwar/categories`);

        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();

        if (jsonData.success) {
          setAllCategories(jsonData.data);
        } else {
          throw new Error(jsonData.message || 'La API no devolvió datos exitosos');
        }

      } catch (err: unknown) { // 👈 CORRECCIÓN 2: 'unknown' en lugar de 'any'
        console.error(err);
        // Manejamos el error de forma segura
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoriasOrdenadas = useMemo(
    () =>
      [...allCategories].sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
      ),
    [allCategories]
  );

  const porFila = useTarjetasPorFila();
  const [visible, setVisible] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (categoriasOrdenadas.length === 0) return;
    
    const base = filasIniciales * porFila;
    const minimoMovil = porFila === 1 ? 4 : 0;
    const minimoDesktop = porFila >= 4 ? 5 * 4 : 0;
    const objetivo = Math.max(base, minimoMovil, minimoDesktop);
    setVisible(Math.min(categoriasOrdenadas.length, objetivo));
  }, [categoriasOrdenadas.length, porFila, filasIniciales]);

  const hayMas = visible < categoriasOrdenadas.length;

  const handleVerMas = () => {
    const previo = visible; // 'previo' está declarado aquí
    const filasExtra = porFila >= 4 ? 3 : filasPorClic;
    const incremento = filasExtra * porFila;
    const nuevo = Math.min(categoriasOrdenadas.length, visible + incremento);
    setVisible(nuevo);
    
    requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (cards && cards.length > previo) {
        // 👈 CORRECCIÓN 3: 'previo' en lugar de 'previa'
        cards[previo]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const items = useMemo(
    () => categoriasOrdenadas.slice(0, visible),
    [categoriasOrdenadas, visible]
  );
  
  // 1. Estado de Carga
  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900">Servicios Disponibles</h2>
          <p className="mt-1 sm:mt-2 text-blue-700/90 text-sm sm:text-base">Descubre todos nuestros servicios</p>
        </div>
        <LoadingSpinner />
      </section>
    );
  }

  // 2. Estado de Error
  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900">Servicios Disponibles</h2>
          <p className="mt-1 sm:mt-2 text-blue-700/90 text-sm sm:text-base">Descubre todos nuestros servicios</p>
        </div>
        <ErrorMessage message={error} />
      </section>
    );
  }

  // 3. Estado Exitoso
  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 flex items-center justify-center gap-2">
          <span>Servicios Disponibles</span>
        </h2>
        <p className="mt-1 sm:mt-2 text-blue-700/90 text-sm sm:text-base">
          Descubre todos nuestros servicios
        </p>
      </div>

      <div
        ref={gridRef}
        className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6 items-stretch"
      >
        {items.map((c) => (
          <div key={c._id} data-card className="h-full">
            <TarjetaCategoria categoria={c} onClick={() => onCategoriaClick?.(c)} />
          </div>
        ))}
      </div>

      {hayMas && (
        <div className="flex justify-center">
          <BotonVerMas onClick={handleVerMas} />
        </div>
      )}
    </section>
  );
}