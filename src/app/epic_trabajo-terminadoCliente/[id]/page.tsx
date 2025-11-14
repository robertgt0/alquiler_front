import DetalleTerminado from "../modules/DetalleTerminado";
import { fetchTrabajoById } from "../services/TrabajoTerminados.service";
import { headers } from "next/headers";

export const metadata = { title: "Trabajo - Detalle" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ← construimos el origin actual sin usar .env
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const origin = `${proto}://${host}`;

  const trabajo = await fetchTrabajoById(id, origin); // ← origin se pasa al servicio

  if (!trabajo) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div role="alert" style={{ background: "#fff8e1", border: "1px solid #ffe082", padding: 12, borderRadius: 8 }}>
          No se encontró el trabajo solicitado o no se pudo conectar con el servidor.
        </div>
        <pre style={{ fontSize: 12, color: "#666", marginTop: 8 }}>ID: {id}</pre>
      </main>
    );
  }

  return (
    <main>
      <DetalleTerminado trabajo={trabajo} />
    </main>
  );
}
