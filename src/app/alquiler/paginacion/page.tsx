'use client';

import { useState, useEffect, useMemo } from "react";
import JobCard from "./components/jobCard";
import Pagination from "./components/Pagination";
import { getJobs } from "./services/jobService";
import { usePagination } from "./hooks/usePagination";
import { Job } from "./types/job";
// import Ordenamiento from "../Ordenamiento/ordenamiento"; //YA NO SE IMPORTA AQUÍ
import FiltrosForm from "../Feature/Componentes/FiltroForm";
import { UsuarioResumen } from "../Feature/Types/filtroType";

export default function BusquedaPage() {
    // Estados principales
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [sortBy, setSortBy] = useState("Fecha (Reciente)");
    const [search, setSearch] = useState("");
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioResumen[]>([]);
    const [modoVista, setModoVista] = useState<"jobs" | "usuarios">("jobs");

    const itemsPerPage = 10;
    
    // Opciones para el select de ordenamiento
    const opcionesOrdenamiento = ["Fecha (Reciente)", "Nombre A-Z", "Nombre Z-A", "Mayor Calificación (⭐)"];

    // Función de ordenamiento
    const ordenarItems = (opcion: string, lista: Job[]) => {
        const sorted = [...lista];
        switch (opcion) {
            case "Nombre A-Z":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "Nombre Z-A":
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "Fecha (Reciente)":
                sorted.sort(
                    (a, b) =>
                        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
                );
                break;
            case "Mayor Calificación (⭐)":
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); 
                break;
            default:
                break;
        }
        return sorted;
    };

    // Filtrado + ordenamiento
    const filteredAndSortedJobs = useMemo(() => {
        let filtered = allJobs;
        if (search.trim() !== "") {
            filtered = filtered.filter((job) =>
                job.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        return ordenarItems(sortBy, filtered);
    }, [allJobs, sortBy, search]);

    // Hook de paginación
    const {
        currentPage,
        totalPages,
        currentItems,
        handlePageChange,
        handleNextPage,
        handlePrevPage,
        totalItems,
    } = usePagination(filteredAndSortedJobs, itemsPerPage);

    // Acción al ver detalles
    const handleViewDetails = (job: Job) => {
        console.log("Ver detalles de:", job);
    };

    // Cargar trabajos al montar
    useEffect(() => {
        const loadJobs = async () => {
            const jobs = await getJobs();
            setAllJobs(jobs);
        };
        loadJobs();
    }, []);

    return (
        //  Fondo con gradiente más sutil
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-white">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/*  Título con borde lateral y color oscuro */}
                <h1 className="text-4xl font-extrabold text-blue-600 mb-10 border-l-4 border-blue-600 pl-4 tracking-wide">
                    Ofertas de Trabajo Disponibles
                </h1>
                {/* Filtros (Ahora maneja filtros Y ordenamiento/búsqueda) */}
                <div className="mb-12">
                    <FiltrosForm
                        // Props de Resultados
                        onResults={(usuarios: UsuarioResumen[]) => {
                            setUsuariosFiltrados(usuarios);
                            if (usuarios && usuarios.length > 0) {
                                setModoVista("usuarios");
                            } else {
                                setModoVista("jobs");
                            }
                        }}
                        // Props de Búsqueda y Ordenamiento
                        sort={sortBy}
                        setSort={setSortBy}
                        search={search}
                        setSearch={setSearch}
                        opcionesOrdenamiento={opcionesOrdenamiento}
                        totalItems={totalItems} 
                    />
                </div>

                {/*Vista de Usuarios Filtrados */}
                {modoVista === "usuarios" && usuariosFiltrados.length > 0 && (
                    <div className="space-y-6 mt-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-3">
                            Resultados de Profesionales
                        </h2>
                        {usuariosFiltrados.map((u) => (
                            <div
                                key={u._id}
                                className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                            >
                                <h3 className="font-semibold text-lg text-gray-900">{u.nombre}</h3>
                            </div>
                        ))}

                        {/* Botón para volver a ver trabajos */}
                        <button
                            onClick={() => setModoVista("jobs")}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition shadow-md"
                        >
                            Volver a ofertas
                        </button>
                    </div>
                )}

                {modoVista === "jobs" && (
                    <>
                        <div className="text-xl text-blue-700 font-semibold mb-6">
                            Mostrando {currentItems.length} de {totalItems} Ofertas Disponibles
                        </div>

                        {/* Lista */}
                        <div className="space-y-6">
                            {currentItems.map((job, index) => (
                                <JobCard
                                    key={`${job.title}-${index}`}
                                    {...job}
                                    onViewDetails={() => handleViewDetails(job)}
                                />
                            ))}
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="mt-10">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                    handleNextPage={handleNextPage}
                                    handlePrevPage={handlePrevPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
