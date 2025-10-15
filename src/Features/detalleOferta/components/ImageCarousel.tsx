'use client';
import { useState } from 'react';

export default function ImageCarousel({ images = [] as string[] }) {
  if (!images || images.length === 0) {
    return <p>Esta oferta no tiene imágenes.</p>;
  }

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((idx - 1 + images.length) % images.length);
  const next = () => setIdx((idx + 1) % images.length);

  return (
    <div style={{ position: 'relative', maxWidth: 720, marginTop: 8 }}>
      <img
        src={images[idx]}
        alt={`Foto ${idx + 1}`}
        style={{ width: '100%', height: 'auto', borderRadius: 8 }}
      />
      <button
        onClick={prev}
        aria-label="Anterior"
        style={{ position: 'absolute', top: '50%', left: 8 }}
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        style={{ position: 'absolute', top: '50%', right: 8 }}
      >
        ›
      </button>
      <p style={{ textAlign: 'center', marginTop: 8 }}>
        {idx + 1} / {images.length}
      </p>
    </div>
  );
}
