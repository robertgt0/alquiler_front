import React from 'react';

type Review = {
  nombre_cliente: string;
  puntuacion: number;
  comentario: string;
  fecha_calificacion: string;
};

const defaultReviews: Review[] = [
  {
    nombre_cliente: "Andrea S.",
    puntuacion: 5,
    comentario: "Excelente trabajo, mandé a hacer unas repisas y quedaron perfectas. La madera es de buena calidad y entregaron antes del plazo. ¡Muy recomendados!",
    fecha_calificacion: "2023-10-25"
  },
  {
    nombre_cliente: "Luis F.",
    puntuacion: 4,
    comentario: "Mandé a reparar una mesa antigua y quedó como nueva. Solo tardaron un día más de lo acordado, pero valió la pena por el resultado.",
    fecha_calificacion: "2023-10-18"
  },
  {
    nombre_cliente: "Camila T.",
    puntuacion: 5,
    comentario: "Encargué un ropero a medida y me encantó. Muy buena atención, escucharon todas mis ideas y el acabado quedó profesional.",
    fecha_calificacion: "2023-10-10"
  },
  {
    nombre_cliente: "Rodrigo M.",
    puntuacion: 4,
    comentario: "Buen servicio y precios razonables. Me hicieron una puerta de madera muy resistente, aunque el color final fue un poco más claro que el que pedí.",
    fecha_calificacion: "2023-10-05"
  },
  {
    nombre_cliente: "Doryan P.",
    puntuacion: 5,
    comentario: "Súper cumplidos y detallistas. Me fabricaron un mueble para TV hermoso, todo encaja perfecto. ¡Sin duda volvería a contratarlos!",
    fecha_calificacion: "2023-09-28"
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

interface ReviewsListProps {
  calificaciones?: any[];
  nombreUsuario?: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ calificaciones, nombreUsuario }) => {
  // Solo mostrar las reseñas por defecto si es Ana María Flores
  const items = nombreUsuario === "Ana María Flores" ? defaultReviews : (calificaciones ?? []);
  
  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <h3 className="text-blue-600 font-semibold text-xl mb-6">Opiniones de Clientes Verificados</h3>
      <div className="space-y-6">
        {items.map((review, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <div className="font-semibold text-gray-900">{review.nombre_cliente}</div>
                {review.fecha_calificacion && (
                  <div className="text-sm text-gray-500">
                    {new Date(review.fecha_calificacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
              <StarRating rating={review.puntuacion} />
            </div>
            <p className="text-gray-700 leading-relaxed mt-2">{review.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
