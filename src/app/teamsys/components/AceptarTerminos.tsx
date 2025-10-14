"use client";
import Link from "next/link";

interface Props {
  aceptado: boolean;
  onToggle: () => void;
}

export default function AceptarTerminos({ aceptado, onToggle }: Props) {
  return (
    <div className="flex items-start space-x-2 w-full">
      <input
        type="checkbox"
        checked={aceptado}
        onChange={onToggle}
        className="mt-1"
      />
      <span className="text-sm text-gray-700">
        Acepto los{" "}
        <Link href="/terminos" className="text-blue-600 underline">
          Términos y Condiciones
        </Link>{" "}
        y la{" "}
        <Link href="/privacidad" className="text-blue-600 underline">
          Política de Privacidad
        </Link>
        .
      </span>
    </div>
  );
}