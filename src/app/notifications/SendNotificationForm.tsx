'use client';
import React, { useState } from 'react';
import { sendNotification } from '../../lib/notifications';

export default function SendNotificationForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [fromName, setFromName] = useState('Sistema Servineo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const payload = {
      subject,
      message: `<p>${message}</p>`,
      destinations: [{ email }],
      fromName,
    };

    try {
      const res = await sendNotification(payload);
      if (res.ok) {
        setResult(res);
      } else {
        setError(res.error || 'Error desconocido');
      }
    } catch (err: any) {
      setError(err?.data?.error || 'Error de conexión con el backend');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-center">Enviar notificación de prueba</h2>

      <input
        type="text"
        placeholder="Nombre del remitente"
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Correo destino"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Asunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Mensaje (texto o HTML)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded h-28"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Enviando...' : 'Enviar notificación'}
      </button>

      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  );
}
