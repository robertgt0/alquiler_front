'use client';

import { useState } from 'react';

export default function SendEmail() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');

  const handleSendEmail = async () => {
    setSending(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'mark2004andy@gmail.com', // 👈 correo de destino
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult('✅ Correo enviado correctamente.');
      } else {
        setResult('❌ Error al enviar el correo.');
      }
    } catch (error) {
      console.error(error);
      setResult('⚠️ No se pudo conectar con el servidor.');
    }

    setSending(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>📢 Enviar correo de solicitud de trabajo</h2>
      <button
        onClick={handleSendEmail}
        disabled={sending}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: sending ? '#999' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: sending ? 'not-allowed' : 'pointer',
        }}
      >
        {sending ? 'Enviando...' : 'Enviar correo'}
      </button>
      {result && <p style={{ marginTop: '20px' }}>{result}</p>}
    </div>
  );
}
