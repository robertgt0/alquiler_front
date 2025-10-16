"use client";

import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import TarjetaCategoria from "./TarjetaCategoria";
import BotonVerMas from "./BotonVerMas";
import type { Categoria } from "./tipos";

type Props = {
  categorias: Categoria[];
  /** filas a mostrar al cargar */
  filasIniciales?: number; // 2 por defecto
  /** filas que se agregan por clic */
  filasPorClic?: number;   // 3 por defecto
  /** callback opcional al hacer click en una tarjeta */
  onCategoriaClick?: (c: Categoria) => void;
};

/** Detecta cuántas tarjetas caben por fila según breakpoints de Tailwind usados en la grilla */
function useTarjetasPorFila() {
  const [porFila, setPorFila] = useState(4); // coincide con lg:grid-cols-4

  useEffect(() => {
    const rules = [
      { mq: "(min-width: 1024px)", val: 4 }, // lg
      { mq: "(min-width: 640px)",  val: 2 }, // sm
    ];
    const update = () => {
      for (const { mq, val } of rules) {
        if (window.matchMedia(mq).matches) { setPorFila(val); return; }
      }
      setPorFila(1); // < sm
    };
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
  categorias,
  filasIniciales = 2,
  filasPorClic = 3,
  onCategoriaClick,
}: Props) {
  // Orden A–Z sin mutar la prop original
  const categoriasOrdenadas = useMemo(
    () =>
      [...categorias].sort((a, b) =>
        a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
      ),
    [categorias]
  );

  const porFila = useTarjetasPorFila();
  const [visible, setVisible] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // visibles según filasIniciales x porFila, con mínimo 4 en móvil
  useEffect(() => {
  // filas iniciales que ya usas (p.ej. 2) multiplicado por columnas detectadas
  const base = filasIniciales * porFila;

  // reglas por breakpoint
  const minimoMovil = porFila === 1 ? 4 : 0;         // 4 items min en móvil
  const minimoDesktop = porFila >= 4 ? 5 * 4 : 0;    // 20 items min en desktop (5x4)

  const objetivo = Math.max(base, minimoMovil, minimoDesktop);

  setVisible(Math.min(categorias.length, objetivo));
}, [categorias.length, porFila, filasIniciales]);


  const hayMas = visible < categoriasOrdenadas.length;

  const handleVerMas = () => {
  const previo = visible;

  // en desktop (>=4 columnas) agregamos 3 filas por clic; en otros tamaños, lo que ya tengas
  const filasExtra = porFila >= 4 ? 3 : filasPorClic;  // 3 filas en desktop
  const incremento = filasExtra * porFila;

  const nuevo = Math.min(categorias.length, visible + incremento);
  setVisible(nuevo);

  // scroll suave al primer item recién revelado
  requestAnimationFrame(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
    if (cards && cards.length > previo) {
      cards[previo]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};


  // ✅ AQUÍ definimos 'items' antes de usarlo
  const items = useMemo(
    () => categoriasOrdenadas.slice(0, visible),
    [categoriasOrdenadas, visible]
  );

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

      {/* 2 cols en sm, 4 en lg. gap-4 = 16px mínimo */}
      <div
        ref={gridRef}
        className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
      >
        {items.map((c) => (
          // data-card debe estar en un nodo DOM real para el scroll
          <div key={c.id} data-card>
            <TarjetaCategoria
              categoria={c}
              onClick={() => onCategoriaClick?.(c)}
            />
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
