/*'use client';
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
}*/
// app/notifications/SendNotificationForm.tsx
'use client';
import React, { useState } from 'react';
import { sendNotification, listNotifications } from '../../lib/notifications';

const defaultPkg: any = {
  source: 'user',
  message: { type: 'email', content: '', subject: '' },
  destinations: [{ email: '' }],
  priority: 'medium'
};

export default function SendNotificationForm() {
  const [pkg, setPkg] = useState(defaultPkg);
  const [varsText, setVarsText] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);

  function updateMessage(field: string, value: any) {
    setPkg(p => ({ ...p, message: { ...p.message, [field]: value } }));
  }

  function updateDestination(i:number, field:string, value:any) {
    const d = [...pkg.destinations];
    d[i] = { ...d[i], [field]: value };
    setPkg(p => ({ ...p, destinations: d }));
  }

  function addDestination(){ setPkg(p => ({ ...p, destinations: [...p.destinations, { email: '' }] })); }
  function removeDestination(i:number){ setPkg(p => ({ ...p, destinations: p.destinations.filter((_,idx)=>idx!==i) })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const vars = varsText.trim() ? JSON.parse(varsText) : undefined;
      if (vars) pkg.message.variables = vars;
    } catch (err) {
      setError('Variables: JSON inválido');
      return;
    }

    const toSend = {
      ...pkg,
      createdAt: new Date().toISOString(),
      message: { ...pkg.message, createdAt: new Date().toISOString() }
    };

    setLoading(true);
    try {
      const data = await sendNotification(toSend);
      setResult(data);
    } catch (err: any) {
      setError(err?.data?.error ?? err?.message ?? 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h3 className="text-lg font-semibold">Enviar notificación (PoC)</h3>

      <div className="grid grid-cols-2 gap-2">
        <select value={pkg.message.type} onChange={e=>updateMessage('type', e.target.value)} className="p-2 border rounded">
          <option value="email">email</option>
          <option value="sms">sms</option>
          <option value="push">push</option>
        </select>

        <select value={pkg.priority} onChange={e=>setPkg(p=>({...p,priority:e.target.value}))} className="p-2 border rounded">
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>

      <input placeholder="Asunto" value={pkg.message.subject} onChange={e=>updateMessage('subject', e.target.value)} className="w-full p-2 border rounded" />
      <textarea placeholder="Contenido" value={pkg.message.content} onChange={e=>updateMessage('content', e.target.value)} className="w-full p-2 border rounded h-28" />

      <div>
        <label className="block text-sm">Variables (JSON)</label>
        <textarea value={varsText} onChange={e=>setVarsText(e.target.value)} className="w-full p-2 border rounded h-24" />
      </div>

      <div>
        <label className="block mb-1">Destinatarios</label>
        {pkg.destinations.map((d:any,i:number)=>(
          <div key={i} className="flex gap-2 mb-2">
            <input placeholder="email" value={d.email||''} onChange={e=>updateDestination(i,'email',e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="phone" value={d.phone||''} onChange={e=>updateDestination(i,'phone',e.target.value)} className="w-40 p-2 border rounded" />
            <button type="button" onClick={()=>removeDestination(i)} className="px-2 bg-red-500 text-white rounded">X</button>
          </div>
        ))}
        <button type="button" onClick={addDestination} className="px-3 py-1 bg-gray-200 rounded">Agregar</button>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Enviando...' : 'Enviar'}</button>
        <button type="button" onClick={()=>{ setPkg(defaultPkg); setVarsText('{}'); setError(null); setResult(null); }} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {result && <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}

