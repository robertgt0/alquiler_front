// app/en-construccion/page.tsx

'use client';
import React from 'react';

const C = {
  title: '#0C4FE9',
  text: '#1140BC',
  borderMain: '#0C4FE9',
  white: '#FFFFFF',
} as const;

export default function EnConstruccionPage() {
  return (
    <main style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: C.white,
    }}>
      <div style={{
        padding: '2rem 3rem',
        border: `3px dashed ${C.borderMain}`,
        borderRadius: '12px',
        color: C.text,
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        🚧 EN CONSTRUCCIÓN 🚧<br />
        Aplicando lógica...
      </div>
    </main>
  );
}
