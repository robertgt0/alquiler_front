'use client';

import { useState, type FormEvent } from 'react';
type Props = {
  onBack: () => void;
  onFinish: (data: {
    categoria?: string;
    newsletter?: boolean;
    metodo?: string;
    aceptaTerminos?: boolean;
  }) => void;
};

export default function Registerform_prefpago({ onBack, onFinish }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Nombre: ${name}\nEmail: ${email}`);
    setName('');
    setEmail('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="Registerform_prefpago-form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '800px',
        margin: '2rem auto',
        backgroundColor: '#000000ff',
        color: 'white',
        padding: '2rem',
        borderRadius: '60px',
      }}
    >
      <h2>Registro como Fixer</h2>

      <label>
        Registra tu carnet de identidad :
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Coloca tu carnet de identidad"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #a38e8eff',
            backgroundColor: '#ffffffff',
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
          placeholder="Escribe tu nombre aquí"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #a38e8eff',
            backgroundColor: '#ffffffff',
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
    </form>
  );
}
