"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TarjetaCategoria from "./TarjetaCategoria";
import BotonVerMas from "./BotonVerMas";
import type { Categoria } from "./tipos";

type Props = {
  categorias: Categoria[];
  /** filas a mostrar al cargar */
  filasIniciales?: number; // 2 por defecto
  /** filas que se agregan por clic */
  filasPorClic?: number;   // 3 por defecto
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
        if (window.matchMedia(mq).matches) return setPorFila(val);
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
}: Props) {
  const porFila = useTarjetasPorFila();
  const [visible, setVisible] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // establece visibles según filasIniciales x porFila
  useEffect(() => {
    setVisible(Math.min(categorias.length, filasIniciales * porFila));
  }, [categorias.length, porFila, filasIniciales]);

  const hayMas = visible < categorias.length;

  const handleVerMas = () => {
    const previo = visible;
    const nuevo = Math.min(categorias.length, visible + filasPorClic * porFila);
    setVisible(nuevo);

    // scroll suave al primer item recién revelado
    requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (cards && cards.length > previo) {
        cards[previo]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const items = useMemo(() => categorias.slice(0, visible), [categorias, visible]);

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

      {/* misma grilla que ya usabas: 2 cols en sm, 4 en lg */}
      <div
        ref={gridRef}
        className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6"
      >
        {items.map((c) => (
          <TarjetaCategoria key={c.id} categoria={c} onClick={undefined} data-card />
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
