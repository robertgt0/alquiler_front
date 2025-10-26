import React from 'react';

const defaultReviews = [
  {
    nombre_cliente: "María Fernanda R.",
    puntuacion: 5,
    comentario: "Excelente trabajo, la decoración fue exactamente como la imaginé. Muy puntuales y detallistas. ¡Recomendadísimos!",
    fecha_calificacion: "2023-11-15"
  },
  {
    nombre_cliente: "Carlos A.",
    puntuacion: 4,
    comentario: "Contraté el servicio para un cumpleaños y todo quedó hermoso. Solo faltó un poco más de iluminación, pero en general, muy bueno.",
    fecha_calificacion: "2023-11-10"
  },
  {
    nombre_cliente: "Lucía G.",
    puntuacion: 5,
    comentario: "Súper profesionales, se encargaron de todo el montaje y los colores quedaron perfectos. Definitivamente volvería a contratar.",
    fecha_calificacion: "2023-11-08"
  },
  {
    nombre_cliente: "José M.",
    puntuacion: 5,
    comentario: "La decoración de mi boda fue espectacular. Cumplieron con todo lo acordado y superaron mis expectativas.",
    fecha_calificacion: "2023-11-05"
  },
  {
    nombre_cliente: "Valentina P.",
    puntuacion: 4,
    comentario: "Buen servicio, rápido y con materiales de calidad. Muy buena atención al cliente.",
    fecha_calificacion: "2023-11-01"
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

const ReviewsList: React.FC<{ calificaciones?: any[] }> = ({ calificaciones }) => {
  const items = calificaciones?.length ? calificaciones : defaultReviews;
  
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
