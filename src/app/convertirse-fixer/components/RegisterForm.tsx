'use client';

import { useState ,type FormEvent } from 'react';

type Props = {
  onSuccess: (data: { ci: string; email: string }) => void;
}; 

export default function RegisterForm({ onSuccess }: Props) {
  const [ci, setCi] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    // Validar que el CI tenga solo números
    if (!/^\d+$/.test(ci)) {
      setMessage('❌ El carnet debe contener solo números.');
      return;
    }

    // ============================
    // 🔧 MODO PRUEBA (sin backend)
    // Avanza al siguiente paso sin llamar a /api/test
    // ============================
    setMessage("🧪 Modo prueba: saltando validación del servidor…");
    onSuccess({ ci, email });
    return; // <-- Importante para NO ejecutar el bloque comentado de abajo

    // ============================================================
    // ✅ MODO REAL (descomenta para volver a validar con el backend)
    // ============================================================
    /*
    setLoading(true);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci, email }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMessage(data?.message ?? "❌ Error de validación.");
        setLoading(false);
        return;
      }
      setMessage(data.message ?? "✅ OK, continuemos.");
      onSuccess({ ci, email }); 
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
    */
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
        disabled={loading}
        style={{
          backgroundColor: '#0e418dff',
          color: 'white',
          padding: '0.8rem',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
        }}
      >
        {loading ? "Validando..." : "Siguiente"}
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
