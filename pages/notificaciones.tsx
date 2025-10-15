import { useState } from "react";

export default function Notificaciones() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setErrorMsg("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          recipient: { email, name: nombre },
          data: { message: mensaje }
        })
      });

      if (res.ok) setEstado("ok");
      else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error || body?.message || "Error desconocido");
        setEstado("error");
      }
    } catch (err: any) {
      setErrorMsg(String(err));
      setEstado("error");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📨 Enviar Notificación (T4)</h1>

      {estado === "ok" ? (
        <div style={styles.card}>
          <h3>✅ Notificación enviada</h3>
          <button style={styles.button} onClick={() => { setEstado("idle"); setEmail(""); setNombre(""); setMensaje(""); }}>
            Enviar otra
          </button>
        </div>
      ) : estado === "error" ? (
        <div style={styles.card}>
          <h3>⚠️ Error al enviar</h3>
          <p>{errorMsg}</p>
          <button style={styles.button} onClick={() => setEstado("idle")}>Reintentar</button>
        </div>
      ) : (
        <form onSubmit={enviar} style={styles.form}>
          <label style={styles.label}>Correo:</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

OBOBOB          <label style={styles.label}>Nombre:</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={styles.input} />
OBOBOB
          <label style={styles.label}>Mensaje:</label>
OBOBOB          <textarea required value={mensaje} onChange={(e) => setMensaje(e.target.value)} style={styles.textarea} />

          <button type="submit" style={styles.button} disabled={estado === "enviando"}>
            {estado === "enviando" ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: { fontFamily: "Inter, Roboto, sans-serif", minHeight: "100vh", background: "#f3f4f6", paddingTop: 48, display: "flex", justifyContent: "center" },
  title: { textAlign: "center", marginBottom: 16 },
  form: { background: "white", width: 360, padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 12 },
  label: { fontWeight: 600 },
  input: { padding: 8, borderRadius: 8, border: "1px solid #d1d5db" },
  textarea: { minHeight: 90, padding: 8, borderRadius: 8, border: "1px solid #d1d5db" },
  button: { background: "#2563eb", color: "white", padding: 10, borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700 },
  card: { background: "white", width: 360, padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", textAlign: "center" }
};
