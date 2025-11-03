import ListadoTerminados from "./modules/ListadoTerminado";

export const metadata = { title: "Trabajos Terminados" };

export default function Page() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <ListadoTerminados />
    </main>
  );
}
