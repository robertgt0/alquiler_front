import DetalleTerminado from "../modules/DetalleTerminado";
import { fetchTrabajoById } from "../services/TrabajoTerminados.service";

type Props = { params: { id: string } };

export const metadata = { title: "Trabajo - Detalle" };

export default async function Page({ params }: Props) {
  const trabajo = await fetchTrabajoById(Number(params.id));

  if (!trabajo) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div role="alert" style={{ background: "#fff8e1", border: "1px solid #ffe082", padding: 12, borderRadius: 8 }}>
          No se encontró el trabajo solicitado.
        </div>
      </main>
    );
  }

  return (
    <main>
      <DetalleTerminado trabajo={trabajo} />
    </main>
  );
}
