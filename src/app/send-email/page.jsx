'use client';

import { useState } from 'react';

export default function SendEmail() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');

  const handleSendEmail = async () => {
    setSending(true);
    setResult('');

    try {
      // 👇 Dirección de tu backend
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'mark2004andy@gmail.com', // 👈 Correo del destinatario
        }),
      });

      const data = await response.json();
      setResult(data.success ? '✅ Correo enviado correctamente' : '❌ Error al enviar el correo');
    } catch (error) {
      console.error('Error:', error);
      setResult('⚠️ No se pudo conectar con el servidor.');
    }

    setSending(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <h1>📧 Enviar correo de solicitud de trabajo</h1>
      <button
        onClick={handleSendEmail}
        disabled={sending}
        style={{
          padding: '12px 25px',
          fontSize: '18px',
          backgroundColor: sending ? '#999' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: sending ? 'not-allowed' : 'pointer',
          transition: '0.3s',
        }}
      >
        {sending ? 'Enviando...' : 'Enviar correo'}
      </button>
      {result && <p style={{ marginTop: '20px', fontSize: '16px' }}>{result}</p>}
    </div>
  );
}
