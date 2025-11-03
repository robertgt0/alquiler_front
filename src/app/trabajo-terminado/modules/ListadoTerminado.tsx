"use client";
import React from "react";
import JobCard from "../components/JobCard";
import Skeleton from "../components/Skeleton";
import { useTrabajosTerminados } from "../hooks/TrabajosTerminados";

export default function ListadoTerminados() {
  const { data, loading, error } = useTrabajosTerminados();

  return (
    <section aria-labelledby="ttitulo" style={{ padding: "16px" }}>
      <h1
        id="ttitulo"
        style={{ color: "#0056ff", fontWeight: 800, textAlign: "center" }}
      >
        Trabajos Terminados
      </h1>

      {loading && <Skeleton />}

      {!loading && error && (
        <div
          role="alert"
          style={{
            background: "#fff8e1",
            border: "1px solid #ffe082",
            padding: 12,
            borderRadius: 8,
            marginTop: 12,
            maxWidth: 980,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 16,
            maxWidth: 980,          // << opcional: ancho máx. del listado
            marginLeft: "auto",     // << opcional: centra el grid
            marginRight: "auto",    // << opcional: centra el grid
          }}
        >
          {data.map((t) => (
            <JobCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </section>
  );
}
