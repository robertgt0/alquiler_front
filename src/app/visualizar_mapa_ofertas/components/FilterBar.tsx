'use client';

import React, { useState, useEffect } from 'react';
import { getMarkerIcon } from '../config/markerIcons';

interface FilterBarProps {
  allCategories: string[];
  selectedCategories: string[];
  maxDistance: number;
  onToggleCategory: (category: string) => void;
  onDistanceChange: (distance: number) => void;
  onClearFilters: () => void;
  totalOffers: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  allCategories,
  selectedCategories,
  maxDistance,
  onToggleCategory,
  onDistanceChange,
  onClearFilters,
  totalOffers,
  filteredCount
}) => {
  // Leer estado inicial desde localStorage
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('filterBarExpanded');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterBarExpanded', String(isExpanded));
    }
  }, [isExpanded]);

  return (
    <div className="absolute top-4 left-4 z-[1001] bg-white rounded-lg shadow-2xl max-w-xs">
      {/* Header con indicador de estado */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-bold text-base flex items-center gap-2">
          <span>🔍</span>
          Filtros
          {!isExpanded && (
            <span className="text-xs bg-blue-700 px-2 py-1 rounded">
              {filteredCount}/{totalOffers}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button
              onClick={onClearFilters}
              className="text-xs bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded font-semibold transition"
              title="Limpiar filtros"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-blue-700 rounded p-2 transition"
            title={isExpanded ? "Contraer panel" : "Expandir panel"}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Body expandible */}
      {isExpanded && (
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Filtro por Categoría */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              📋 Categorías:
            </label>
            <div className="space-y-2">
              {allCategories.map(category => {
                const emoji = getMarkerIcon(category);
                const isSelected = selectedCategories.includes(category);
                
                return (
                  <button
                    key={category}
                    onClick={() => onToggleCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {emoji} {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtro por Distancia */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              📍 Distancia: <span className="text-blue-600">{maxDistance} km</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={maxDistance}
              onChange={(e) => onDistanceChange(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-center">
              <span className="font-bold text-green-700 text-lg">{filteredCount}</span>
              <span className="text-gray-600"> de </span>
              <span className="font-bold text-gray-800">{totalOffers}</span>
              <span className="text-gray-600"> ofertas</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};