"use client";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function BotonVerMas({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      <span>+</span>
      <span>Ver Más</span>
    </button>
  );
}
