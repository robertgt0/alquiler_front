'use client';
import { useState } from 'react';
import { sendNotification } from '@/lib/notifications';

export default function SendNotificationForm() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendNotification({ to, subject, message });
    alert('Correo enviado con éxito ✅');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Enviar notificación por Gmail</h2>
      <input type="email" placeholder="Destinatario" value={to} onChange={e => setTo(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
      <input type="text" placeholder="Asunto" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
      <textarea placeholder="Mensaje" value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Enviar</button>
    </form>
  );
}
