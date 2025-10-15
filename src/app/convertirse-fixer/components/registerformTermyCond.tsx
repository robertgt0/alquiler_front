"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onBack: () => void;
  onFinish: (data: {
    categoria?: string;
    newsletter?: boolean;
    metodo?: string;
    aceptaTerminos?: boolean;
  }) => void;
};

export default function RegisterFormTerminos({ onBack, onFinish }: Props) {
  const [agree, setAgree] = useState(false);
  const [disagree, setDisagree] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    if (!agree || disagree) {
      setMsg("❌ Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    onFinish({ aceptaTerminos: true });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        maxWidth: 900,
        margin: "2rem auto",
        backgroundColor: "#ffffff",
        color: "#0b1b2b",
        padding: "2rem",
        borderRadius: 24,
        border: "1px solid #e6e9ef",
      }}
    >
      {/* Encabezado tipo 5/5 + barra */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>5/5</div>
        <div style={{ height: 6, background: "#e6e9ef", borderRadius: 999 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#0e418d",
              borderRadius: 999,
              transition: "width 250ms ease",
            }}
          />
        </div>
      </div>

      {/* Título centrado con línea */}
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <div
          style={{
            height: 4,
            width: "100%",
            background: "#0e418d",
            borderRadius: 999,
            margin: "0 auto 18px",
            maxWidth: 740,
          }}
        />
        <h2 style={{ margin: 0, fontSize: 28 }}>Términos y Condiciones</h2>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Por favor lee y acepta los términos y condiciones para continuar. Al aceptar, declaras
          que estás de acuerdo con seguir las reglas y regulaciones presentes del servicio.
        </p>
      </div>

      {/* Checks (mutuamente excluyentes) */}
      <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked);
            if (e.target.checked) setDisagree(false);
          }}
        />
        Estoy de acuerdo con los términos y condiciones
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={disagree}
          onChange={(e) => {
            setDisagree(e.target.checked);
            if (e.target.checked) setAgree(false);
          }}
        />
        No estoy de acuerdo con los términos y condiciones
      </label>

      {/* Botones */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "transparent",
            color: "#0e418d",
            border: "1px solid #0e418d",
            borderRadius: 999,
            padding: "0.7rem 1.2rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Atrás
        </button>

        <button
          type="submit"
          disabled={!agree || disagree}
          style={{
            background: (!agree || disagree) ? "#9fb5da" : "#0e418d",
            color: "white",
            border: "none",
            borderRadius: 999,
            padding: "0.7rem 1.2rem",
            fontWeight: 600,
            cursor: (!agree || disagree) ? "not-allowed" : "pointer",
          }}
        >
          Aceptar y continuar
        </button>
      </div>

      {msg && (
        <p style={{ color: "crimson", fontWeight: 600, margin: 0, textAlign: "center" }}>
          {msg}
        </p>
      )}
    </form>
  );
}
