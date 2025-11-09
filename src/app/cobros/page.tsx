"use client";
import React, { useEffect, useState } from "react";

// ----- Estilos -----
const styles = `
:root{
  --bg:#f7fbff;
  --card:#e1f0ff;
  --accent:#57a9ff;
  --accent-strong:#3291ff;
  --ok:#23c55e;
  --danger:#ef4444;
  --ink:#0f172a;
  --muted:#64748b;
  --ring:#93c5fd;
  --white:#fff;
  --shadow:0 6px 20px rgba(2,8,23,.08);
  --radius:16px;
}
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
  background: var(--bg);
  color: var(--ink);
}
.layout{display:grid;grid-template-columns:280px 1fr;gap:20px;padding:20px;max-width:1200px;margin:auto;}
.sidebar{background:var(--white);border:2px dashed #8ec5ff;border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);}
.brand{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.logo{width:56px;height:56px;border-radius:999px;border:2px dashed #8ec5ff;display:grid;place-items:center;font-weight:700;color:#8ec5ff;}
.nav{display:grid;gap:10px}
.nav button{appearance:none;border:0;text-align:left;background:var(--card);padding:12px 14px;border-radius:12px;color:#0b2a4a;font-weight:600;cursor:pointer;}
.nav button.active{outline:2px solid var(--accent);background:#d7ebff}
.wallet{margin-top:18px;background:#f0f7ff;border-radius:12px;padding:14px;border:1px solid #dbeafe;}
.wallet h4{margin:0 0 6px 0}
.money{font-size:24px;font-weight:800}
.content{background:var(--white);border:2px dashed #8ec5ff;border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);min-height:calc(100vh - 80px);}
h1{margin:0 0 18px 0;letter-spacing:.3px}
.hint{color:var(--muted);font-size:14px;margin-bottom:18px}
.job{background:#d8ecff;border-radius:999px;padding:14px 14px 14px 18px;display:flex;align-items:center;justify-content:space-between;margin:16px 0;box-shadow:0 1px 0 rgba(2,8,23,.04) inset;}
.job .meta{display:grid;gap:3px;}
.job .title{font-weight:800}
.job .sub{font-size:13px;color:#123a66}
.chip{background:var(--accent);color:white;font-weight:800;border:none;cursor:pointer;padding:10px 18px;border-radius:999px;box-shadow:var(--shadow);}
.chip:disabled{opacity:.6;cursor:not-allowed}
.pill{font-size:12px;padding:6px 10px;border-radius:999px;background:#ecfeff;border:1px solid #bae6fd;color:#0369a1;font-weight:700;}
.grid{display:grid;gap:12px}
.card{border:2px dashed #8ec5ff;border-radius:18px;padding:16px;background:#f6fbff;}
.table th,td{padding:10px 12px;border-bottom:1px solid #e5e7eb}
.empty{padding:30px;text-align:center;color:var(--muted)}
.footer-note{font-size:12px;color:var(--muted);margin-top:10px}
dialog::backdrop{background:rgba(2,8,23,.35)}
dialog{border:none;border-radius:20px;padding:0;overflow:hidden;width:min(520px,92vw);box-shadow:0 20px 60px rgba(2,8,23,.25);}
.modal{padding:20px;background:var(--white);}
.msg{display:none;margin:10px 0 0;padding:10px 12px;border-radius:10px;font-size:14px;}
.msg.error{display:block;background:#fee2e2;color:#7f1d1d;border:1px solid #fecaca}
.msg.ok{display:block;background:#dcfce7;color:#14532d;border:1px solid #bbf7d0}
.row{display:flex;gap:10px;align-items:center;justify-content:flex-end}
.btn{appearance:none;border:none;border-radius:12px;padding:10px 14px;font-weight:700;cursor:pointer;}
.btn.secondary{background:#eef2ff}
.btn.primary{background:var(--accent-strong);color:white}
`;

interface Trabajo {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  monto: number;
  estado: string;
  comision?: number;
  fechaPago?: string;
}

const COMMISSION_RATE = 0.12;

const mockDB = {
  wallet: { saldo: 120.0 },
  trabajosActivos: [
    { id: 1, cliente: "Juan Pérez", servicio: "Limpieza de Jardín", fecha: "2025-11-07 16:00", monto: 200, estado: "listo" },
    { id: 2, cliente: "María López", servicio: "Pintura Interior", fecha: "2025-11-08 10:00", monto: 350, estado: "listo" },
    { id: 3, cliente: "Carlos Ramos", servicio: "Reparación Eléctrica", fecha: "2025-11-09 14:30", monto: 150, estado: "listo" },
  ] as Trabajo[],
  historial: [] as Trabajo[],
};

// Utilidades
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => `Bs ${n.toFixed(2)}`;

// API simulada
const api = {
  async obtenerSaldo() {
    await delay(200);
    return { saldo: round2(mockDB.wallet.saldo) };
  },
  async listarActivos() {
    await delay(150);
    return [...mockDB.trabajosActivos];
  },
  async listarHistorial() {
    await delay(150);
    return [...mockDB.historial];
  },
  async descontarComision(id: number) {
    await delay(300);
    const job = mockDB.trabajosActivos.find((j) => j.id === id);
    if (!job) throw new Error("Trabajo no encontrado");
    const comision = round2(job.monto * COMMISSION_RATE);
    if (mockDB.wallet.saldo < comision) throw new Error("SALDO_INSUFICIENTE");

    mockDB.wallet.saldo = round2(mockDB.wallet.saldo - comision);
    mockDB.trabajosActivos = mockDB.trabajosActivos.filter((j) => j.id !== id);
    mockDB.historial.unshift({ ...job, comision, fechaPago: new Date().toISOString(), estado: "pagado-efectivo" });
    return { saldo: mockDB.wallet.saldo, comision };
  },
};

const ConfigEfectivo: React.FC = () => {
  const [saldo, setSaldo] = useState<number>(0);
  const [activos, setActivos] = useState<Trabajo[]>([]);
  const [historial, setHistorial] = useState<Trabajo[]>([]);
  const [vista, setVista] = useState<"activos" | "historial" | "billetera">("activos");
  const [modalOpen, setModalOpen] = useState(false);
  const [trabajoSel, setTrabajoSel] = useState<Trabajo | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error" | null; texto: string }>({ tipo: null, texto: "" });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const s = await api.obtenerSaldo();
    const a = await api.listarActivos();
    setSaldo(s.saldo);
    setActivos(a);
  };

  const handleConfirmar = async () => {
    if (!trabajoSel) return;
    try {
      const res = await api.descontarComision(trabajoSel.id);
      setMensaje({ tipo: "ok", texto: `Comisión descontada: ${money(res.comision)}. Nuevo saldo: ${money(res.saldo)}` });
      setSaldo(res.saldo);
      setActivos(await api.listarActivos());
      setHistorial(await api.listarHistorial());
      setTimeout(() => setModalOpen(false), 1000);
    } catch (e) {
      if (e instanceof Error && e.message === "SALDO_INSUFICIENTE") {
        setMensaje({ tipo: "error", texto: "Saldo insuficiente." });
      } else {
        setMensaje({ tipo: "error", texto: "Ocurrió un error." });
      }
    }
  };

  const abrirModal = (t: Trabajo) => {
    setTrabajoSel(t);
    setMensaje({ tipo: null, texto: "" });
    setModalOpen(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <div className="logo">FX</div>
            <div>
              <div style={{ fontWeight: 900 }}>FIXER</div>
              <div className="pill">Panel</div>
            </div>
          </div>

          <nav className="nav">
            <button className={vista === "activos" ? "active" : ""} onClick={() => setVista("activos")}>Trabajos Activos</button>
            <button className={vista === "historial" ? "active" : ""} onClick={async () => { setVista("historial"); setHistorial(await api.listarHistorial()); }}>Historial</button>
            <button className={vista === "billetera" ? "active" : ""} onClick={async () => { setVista("billetera"); const s = await api.obtenerSaldo(); setSaldo(s.saldo); }}>Mi Billetera</button>
            <button disabled>Configuración</button>
          </nav>

          <div className="wallet">
            <h4>Mi Billetera</h4>
            <div className="money">{money(saldo)}</div>
            <div className="footer-note">Se descuenta sólo la <b>comisión</b> al confirmar cobro en efectivo.</div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="content">
          <h1>CONFIGURACIÓN EN EFECTIVO</h1>
          <div className="hint">Selecciona un trabajo completado y confirma si el cliente pagó en efectivo.</div>

          {/* Vista Activos */}
          {vista === "activos" && (
            <section className="grid">
              {activos.length === 0 ? (
                <div className="empty">No hay trabajos activos.</div>
              ) : (
                activos.map((t) => {
                  const comision = round2(t.monto * COMMISSION_RATE);
                  return (
                    <article key={t.id} className="job">
                      <div className="meta">
                        <div className="title">{t.cliente}</div>
                        <div className="sub">
                          {t.servicio} · {t.fecha} · Monto: <b>{money(t.monto)}</b> · Comisión: <b>{money(comision)}</b>
                        </div>
                      </div>
                      <button className="chip" onClick={() => abrirModal(t)}>Completado</button>
                    </article>
                  );
                })
              )}
            </section>
          )}

          {/* Vista Historial */}
          {vista === "historial" && (
            <section className="grid">
              <div className="card">
                <h2>Historial de Trabajos</h2>
                {historial.length === 0 ? (
                  <div className="empty">No hay trabajos completados aún.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Cliente</th><th>Servicio</th><th>Fecha</th><th>Monto</th><th>Comisión</th><th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((h) => (
                        <tr key={h.id}>
                          <td>{h.cliente}</td>
                          <td>{h.servicio}</td>
                          <td>{h.fecha}</td>
                          <td>{money(h.monto)}</td>
                          <td>{money(h.comision || 0)}</td>
                          <td><span className="pill">Pagado (Efectivo)</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          )}

          {/* Vista Billetera */}
          {vista === "billetera" && (
            <section className="grid">
              <div className="card" style={{ textAlign: "right" }}>
                <h2>Saldo disponible</h2>
                <div className="money">{money(saldo)}</div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Modal de Confirmación */}
      {modalOpen && (
        <dialog open>
          <form className="modal" method="dialog">
            <h3>¿El cliente pagó en efectivo?</h3>
            <p>Se descontará una comisión de {money(round2((trabajoSel?.monto || 0) * COMMISSION_RATE))}.</p>
            {mensaje.tipo && <div className={`msg ${mensaje.tipo}`}>{mensaje.texto}</div>}
            <div className="row">
              <button type="button" className="btn secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button type="button" className="btn primary" onClick={handleConfirmar}>Confirmar</button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
};

export default ConfigEfectivo;
