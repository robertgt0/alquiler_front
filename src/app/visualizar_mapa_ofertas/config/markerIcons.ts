// Configuración de íconos de marcadores por categoría de servicio

export const MARKER_COLORS = {
  Plomería: '#3B82F6',      // Azul
  Electricidad: '#EAB308',  // Amarillo
  Carpintería: '#8B4513',   // Marrón
  Limpieza: '#10B981',      // Verde
  Pintura: '#EC4899',       // Rosa
  Jardinería: '#22C55E',    // Verde claro
  default: '#EF4444'        // Rojo por defecto
};

export const MARKER_ICONS = {
  Plomería: '🔧',
  Electricidad: '⚡',
  Carpintería: '🪚',
  Limpieza: '🧹',
  Pintura: '🎨',
  Jardinería: '🌿',
  default: '🛠️'
};

export const getMarkerColor = (category: string): string => {
  return MARKER_COLORS[category as keyof typeof MARKER_COLORS] || MARKER_COLORS.default;
};

export const getMarkerIcon = (category: string): string => {
  return MARKER_ICONS[category as keyof typeof MARKER_ICONS] || MARKER_ICONS.default;
};