"use client"
import "./ordenamiento.css"
import { useState, useMemo, useEffect } from "react"
import { Search, Calendar } from "lucide-react"
import { AppointmentModal } from "@/components/appointment-modal"
import { Button } from "@/components/ui/button"

interface Item {
    nombre: string
    fecha: string
    calificacion: number
}

// Datos iniciales
const INITIAL_ITEMS: Item[] = [
    { nombre: "A", fecha: "2026-10-05", calificacion: 4 },
    { nombre: "E", fecha: "2024-10-03", calificacion: 5 },
    { nombre: "C", fecha: "2024-10-06", calificacion: 3 },
    { nombre: "N", fecha: "2025-10-01", calificacion: 2 },
    { nombre: "A", fecha: "2025-10-03", calificacion: 5 },
    { nombre: "B", fecha: "2025-10-06", calificacion: 3 },
    { nombre: "O", fecha: "2025-10-01", calificacion: 2 },
]

// Función de ordenamiento
const ordenarItems = (opcion: string, lista: Item[]): Item[] => {
    if (lista.length === 0) return []

    const sorted = [...lista]

    switch (opcion) {
        case "Nombre A-Z":
            sorted.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
            break
        case "Nombre Z-A":
            sorted.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""))
            break
        case "Fecha (Reciente)":
            sorted.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            break
        case "Mayor Calificación (⭐)":
            sorted.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0))
            break
        default:
            break
    }

    return sorted
}

export default function Ordenamiento() {
    const defaultSort = "Fecha (Reciente)"
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState(defaultSort)
    const [activeFilters, setActiveFilters] = useState({})
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

    const opciones = ["Nombre A-Z", "Nombre Z-A", "Fecha (Reciente)", "Mayor Calificación (⭐)"]

    useEffect(() => {
        if (search === "") {
            setSort(defaultSort)
        }
    }, [search])

    const filteredItems = useMemo(() => {
        let list = INITIAL_ITEMS

        if (search) {
            list = list.filter((item) => item.nombre.toLowerCase().includes(search.toLowerCase()))
        }

        return list
    }, [search, activeFilters])

    const itemsToRender = useMemo(() => {
        return ordenarItems(sort, filteredItems)
    }, [sort, filteredItems])

    const handleSearch = () => {
        alert(`Búsqueda terminada. Elementos encontrados: ${itemsToRender.length}`)
    }

    const showNoOrderMessage = search !== "" && filteredItems.length === 0

    return (
        <div className="container">
            <div className="card">
                {/* Buscador */}
                <div className="search-container">
                    <div className="search-input-container">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button onClick={handleSearch} className="search-button">
                        Buscar
                    </button>
                </div>

                <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsAppointmentModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar Cita
                    </Button>
                </div>

                {/* Ordenamiento */}
                <div className="sort-section">
                    <p className="sort-label">Ordenar por:</p>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                        {opciones.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>

                <ul className="item-list">
                    {showNoOrderMessage ? (
                        <li className="error-message">No se puede aplicar el ordenamiento.</li>
                    ) : (
                        itemsToRender.map((item) => (
                            <li key={item.nombre} className="item">
                                <span>{item.nombre}</span> - {item.fecha} - <span className="item-star">⭐ {item.calificacion}</span>
                            </li>
                        ))
                    )}

                    {!showNoOrderMessage && itemsToRender.length === 0 && (
                        <li className="empty-message">No hay elementos disponibles.</li>
                    )}
                </ul>
            </div>

            <AppointmentModal
                open={isAppointmentModalOpen}
                onOpenChange={setIsAppointmentModalOpen}
                patientName="Juan Pérez"
            />
        </div>
    )
}

