"use client";

import { useEffect, useState } from "react";
import { useFiltros } from "app/alquiler/Feature/Hooks/useFiltro";

interface FiltrosFormProps {
    onResults?: (usuarios: any[]) => void;
    
    // Props pasadas desde paginacion para Ordenamiento y Búsqueda
    sort: string;
    setSort: (value: string) => void;
    search: string;
    setSearch: (value: string) => void;
    opcionesOrdenamiento: string[];
    totalItems: number; // Conteo de resultados de trabajos
}

export default function FiltrosForm({ 
    onResults,
    sort, 
    setSort, 
    search, 
    setSearch, 
    opcionesOrdenamiento = [],
    totalItems
}: FiltrosFormProps) {
    const {
        ciudades,
        provincias,
        disponibilidad,
        especialidades,
        filtro,
        handleChange,
        buscarPorServicio,
        usuarios,
        loadingUsuarios,
        errorUsuarios,
    } = useFiltros();

    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    useEffect(() => {
        if (onResults) {
            onResults(usuarios);
        }
    }, [usuarios, onResults]);

    const handleBuscarProfesional = () => {
        buscarPorServicio();
    };


    return (
        <div className="w-full bg-white rounded-xl p-6 md:p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
            
            
            {/*FILTROS SECUNDARIOS DESPLEGABLES */}
            <div className={`pt-4 ${mostrarFiltros ? 'border-t' : ''}`}>
                <h3
                    className="font-semibold text-base text-blue-600 hover:text-blue-700 transition cursor-pointer flex items-center mb-3"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                    Filtrar por: <span className="ml-2 text-blue-600">{mostrarFiltros ? '▼' : '▶'}</span>
                </h3>
            
                {/* solo se muestran cuando mostrarFiltros  */}
                {mostrarFiltros && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {/* Ciudad */}
                        <select
                            value={filtro.ciudad || ""}
                            onChange={(e) => handleChange("ciudad", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                             <option value="">Elige una ciudad</option>
                            {ciudades.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                        </select>

                        {/* Provincia */}
                        <select
                            value={filtro.provincia || ""}
                            onChange={(e) => handleChange("provincia", e.target.value)}
                            disabled={provincias.length === 0}
                            className={`border rounded-lg px-3 py-2 text-sm w-full ${provincias.length === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`}
                        >
                            <option value="">Elige una provincia</option>
                            {provincias.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                        </select>
                        
                        {/* Disponibilidad */}
                        <select
                            value={filtro.disponibilidad || ""}
                            onChange={(e) => handleChange("disponibilidad", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Disponibilidad</option>
                            {disponibilidad.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                        </select>
                        
                        {/* Tipo de Especialidad */}
                        <select
                            value={filtro.tipoEspecialidad || ""}
                            onChange={(e) => handleChange("tipoEspecialidad", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tipo de Especialidad</option>
                            {especialidades.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                        </select>
                    </div>
                )}
            </div>
            
            {/* ORDENAMIENTO Y CONTEO (El diseño de botón lateral) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4 mt-4">
                
                {/* ORDENAR POR (SELECT) */}
                <div className="flex items-center gap-2 mb-3 sm:mb-0">
                    <p className="font-semibold text-base text-blue-600">Ordenar por:</p>
                    <select
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)} 
                        className="border border-gray-400 rounded-lg px-3 py-2 text-sm text-black focus:ring-blue-500 focus:border-blue-500"
                    >
                        {opcionesOrdenamiento?.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CONTEO DE RESULTADOS (Mostrando 0 de 0...) */}
                <div className="text-sm text-gray-600 font-medium">
                    Total de Ofertas: {totalItems}
                </div>
                
            </div>
            {/* Solo se deja el feedback de carga y error si es necesario */}
            {loadingUsuarios && <p className="text-black/70 mt-4">Buscando profesionales...</p>}
            {errorUsuarios && (<p className="text-red-600 text-sm font-medium mt-4">⚠ {errorUsuarios}</p>)}

        </div>
    );
}