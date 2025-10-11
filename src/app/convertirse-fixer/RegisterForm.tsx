'use client';

import { useState } from 'react';

export default function RegisterForm() {
  const [ci, setCi] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validar que el CI tenga solo números
    if (!/^\d+$/.test(ci)) {
      setMessage('❌ El carnet debe contener solo números.');
      return;
    }

    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci, email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setCi('');
        setEmail('');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="register-form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '800px',
        margin: '2rem auto',
        backgroundColor: '#d2eaebff',
        color: 'white',
        padding: '2rem',
        borderRadius: '60px',
      }}
    >
      <h2>Registro como Fixer</h2>

      <label>
        Carnet de identidad:
        <input
          type="text"
          value={ci}
          onChange={(e) => {
            // Solo permitir números
            const value = e.target.value.replace(/\D/g, '');
            setCi(value);
          }}
          placeholder="Solo números"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #a38e8eff',
            backgroundColor: '#fff',
            color: 'black',
          }}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Escribe tu correo aquí"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #a38e8eff',
            backgroundColor: '#fff',
            color: 'black',
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          backgroundColor: '#0e418dff',
          color: 'white',
          padding: '0.7rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Enviar
      </button>

      {message && (
        <p
          style={{
            textAlign: 'center',
            color: message.includes('✅') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
