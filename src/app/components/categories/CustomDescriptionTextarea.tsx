"use client";

import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  label?: string;
};

export default function CustomDescriptionTextarea({
  value,
  onChange,
  placeholder = "Describe tu experiencia y especialización en este trabajo...",
  maxLength = 500,
  label = "Descripción personalizada",
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value?.length || 0;
  const percentage = (charCount / maxLength) * 100;

  // Determinar color del contador según porcentaje
  const getCounterColor = () => {
    if (percentage >= 90) return "#ef4444"; // rojo
    if (percentage >= 70) return "#f59e0b"; // amarillo
    return "#6b7280"; // gris
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        <span className="ml-1 text-xs font-normal text-gray-500">(opcional)</span>
      </label>
      
      <div
        className={`
          relative rounded-xl border-2 transition-all duration-200
          ${isFocused 
            ? 'border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
          bg-white dark:bg-gray-800
        `}
      >
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={4}
          className="
            w-full px-4 py-3 rounded-xl
            text-sm text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            bg-transparent
            resize-none
            focus:outline-none
            transition-all duration-200
          "
          style={{ minHeight: '100px' }}
        />
        
        {/* Contador de caracteres */}
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <div className="relative w-8 h-8">
            {/* Círculo de progreso */}
            <svg className="w-8 h-8 transform -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke={getCounterColor()}
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - percentage / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
          </div>
          
          <span 
            className="text-xs font-medium tabular-nums"
            style={{ color: getCounterColor() }}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      </div>
      
      {/* Ayuda contextual */}
      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>
          Esta descripción aparecerá en tu perfil cuando los usuarios vean este trabajo. 
          Destaca tu experiencia y especialización.
        </span>
      </p>
    </div>
  );
}