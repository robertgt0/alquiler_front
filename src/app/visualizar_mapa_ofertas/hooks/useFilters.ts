'use client';

import { useState, useMemo } from 'react';
import { Offer } from '../interfaces/types';
import { calculateDistance } from '../utils/mapHelpers';

interface FilterOptions {
  categories: string[];
  maxDistance: number;
}

export const useFilters = (
  offers: Offer[],
  userLocation: { lat: number; lng: number }
) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(10); // km

  // Obtener todas las categorías únicas
  const allCategories = useMemo(() => {
    const categories = offers.map(offer => offer.category);
    return Array.from(new Set(categories));
  }, [offers]);

  // Filtrar ofertas según criterios
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      // Filtrar solo ofertas activas
      if (!offer.isActive) return false;

      // Filtrar por categoría
      if (selectedCategories.length > 0 && !selectedCategories.includes(offer.category)) {
        return false;
      }

      // Filtrar por distancia
      const distance = calculateDistance(userLocation, offer.location);
      if (distance > maxDistance) {
        return false;
      }

      return true;
    });
  }, [offers, selectedCategories, maxDistance, userLocation]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxDistance(10);
  };

  return {
    selectedCategories,
    maxDistance,
    allCategories,
    filteredOffers,
    toggleCategory,
    setMaxDistance,
    clearFilters
  };
};