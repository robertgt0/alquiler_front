"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Clock, Edit, Trash2 } from "lucide-react";
import EditAppointmentModal from "./components/EditAppointmentModal";
import ConfirmationModal from "./components/confirmationModal";
import Sidebar from "@/app/agenda/components/Sidebar";

interface Cita {
	_id: string;
	fecha: string;
	horario: {
		inicio: string;
		fin: string;
	};
	estado: string;
	servicioId: {
		_id: string;
		nombre: string;
	} | null;
	clienteId: {
		_id: string;
		nombre: string;
	} | null;
}

export default function FixerCitas() {
	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
	const FIXER_ID = "690c29d00c736bec44e473e4"; // ID del fixer

	const [citas, setCitas] = useState<Cita[]>([]);
	const [citaToEdit, setCitaToEdit] = useState<Cita | null>(null);
	const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDemo, setIsDemo] = useState(false);

	// Datos de ejemplo para mostrar en modo offline/demo
	const sampleCitas: Cita[] = [
		{
			_id: 'demo-1',
			fecha: new Date().toISOString().split('T')[0],
			horario: { inicio: '10:00', fin: '11:00' },
			estado: 'agendado',
			servicioId: { _id: 's1', nombre: 'Instalación de persiana' },
			clienteId: { _id: 'c1', nombre: 'María López' },
		},
		{
			_id: 'demo-2',
			fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			horario: { inicio: '14:00', fin: '15:00' },
			estado: 'cancelado',
			servicioId: { _id: 's2', nombre: 'Reparación de cerradura' },
			clienteId: { _id: 'c2', nombre: 'Carlos García' },
		},
	];

	const fetchCitas = async () => {
		setError(null);
		setLoading(true);
		// Añadir timeout para evitar que quede indefinidamente en "Cargando..."
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		try {
			const res = await fetch(`${API_URL}/api/devcode/citas/proveedor/${FIXER_ID}`, { signal: controller.signal });
			if (!res.ok) throw new Error('Error al cargar citas');
			const data = await res.json();
			if (!data.success) throw new Error(data.error || 'Error al cargar citas');
			setCitas(data.data);
		} catch (err: any) {
			console.error('Error:', err);
			// Si falla la petición, cargar datos de ejemplo para que la UI muestre el flujo
			setCitas(sampleCitas);
			setIsDemo(true);
			if (err?.name === 'AbortError') {
				setError('La solicitud tardó demasiado. Mostrando datos de ejemplo.');
			} else {
				setError((err && err.message) ? err.message + '. Mostrando datos de ejemplo.' : 'Error al cargar citas. Mostrando datos de ejemplo.');
			}
		} finally {
			clearTimeout(timeout);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCitas();
	}, []);

	// Formatea fecha en español con día de la semana y capitaliza la primera letra
	const formatDate = (isoDate: string) => {
		try {
			const d = new Date(isoDate + 'T12:00:00');
			const formatted = d.toLocaleDateString('es-ES', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			});
			return formatted.charAt(0).toUpperCase() + formatted.slice(1);
		} catch (e) {
			return isoDate;
		}
	};

	const handleEdit = (cita: Cita) => {
		setCitaToEdit(cita);
		setIsEditModalOpen(true);
	};

	const handleCancelRequest = (cita: Cita) => {
		setCitaToDelete(cita);
		setIsConfirmModalOpen(true);
	};

	const handleCancelConfirm = async () => {
		if (!citaToDelete) return;
		// Si estamos en modo demo/offline, aplicar el cambio localmente y salir
		if (isDemo) {
			setCitas(prev => prev.map(c => c._id === citaToDelete._id ? { ...c, estado: 'cancelado' } : c));
			setIsConfirmModalOpen(false);
			setCitaToDelete(null);
			return;
		}

		// Optimistic update: aplicar cambio en UI inmediatamente y revertir si falla
		const previous = [...citas];
		setCitas(prev => prev.map(c => c._id === citaToDelete._id ? { ...c, estado: 'cancelado' } : c));

		try {
			const res = await fetch(`${API_URL}/api/devcode/citas/${citaToDelete._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ estado: 'cancelado', proveedorId: FIXER_ID }),
			});

			if (!res.ok) {
				const errText = await res.text().catch(() => null);
				throw new Error(errText || 'Error al cancelar la cita');
			}
		} catch (error) {
			console.error('Error:', error);
			// Revertir UI si falla
			setCitas(previous);
		} finally {
			// Limpiar estados
			setIsConfirmModalOpen(false);
			setCitaToDelete(null);
		}
	};

	if (loading) {
		return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
	}

	// Si hubo error, mostramos una alerta en la UI pero dejamos la lista (posiblemente demo)

	return (
		<>
			<Sidebar />
			<div className="ml-0 md:ml-64 min-h-screen bg-gray-50">
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-2xl font-bold mb-6">Gestiona tus citas programadas</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{citas.map((cita) => {
							const estado = (cita.estado || '').toLowerCase();
							const estadoMap: Record<string, { label: string; color: string }> = {
								agendado: { label: 'Agendado', color: 'bg-green-500' },
								cancelado: { label: 'Cancelado', color: 'bg-red-500' },
								concluido: { label: 'Concluido', color: 'bg-gray-400' },
								reprogramar: { label: 'Reprogramar Cita', color: 'bg-orange-400' },
								// fallback
								'': { label: 'Agendado', color: 'bg-green-500' },
							};
							const estadoInfo = estadoMap[estado] || estadoMap[''];

							return (
								<div key={cita._id} className="bg-white rounded-lg shadow-sm border border-[#1C3FAA] overflow-hidden">
									{/* Header azul */}
									<div className="flex items-center gap-4 bg-[#1C3FAA] text-white p-4 rounded-t-lg">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-white/20 rounded-[10px] flex items-center justify-center">
												{/* avatar placeholder */}
												<div className="w-8 h-8 bg-white rounded-[10px]" />
											</div>
											<div>
												<div className="font-semibold">{cita.servicioId?.nombre || 'Servicio no especificado'}</div>
												<div className="text-sm opacity-90">{(cita as any).proveedorId?.nombre || 'Saitama'}</div>
											</div>
										</div>
									</div>

									{/* Body */}
									<div className="p-4">
										<div className="flex items-center gap-3 text-gray-700 mb-3">
											<CalendarDays className="w-5 h-5 text-[#1C3FAA]" />
											<div className="text-sm open-sans">{formatDate(cita.fecha)}</div>
										</div>

										<div className="flex items-center gap-3 text-gray-700 mb-3">
											<Clock className="w-5 h-5 text-[#1C3FAA]" />
											<div className="text-sm open-sans">{cita.horario.inicio} - {cita.horario.fin}</div>
										</div>

										<div className="flex items-center gap-2">
											<span className={`${estadoInfo.color} inline-block w-3 h-3 rounded-[10px]`} />
											<span className="text-sm font-medium text-gray-700 open-sans">{estadoInfo.label}</span>
										</div>
									</div>

									{/* Footer acciones */}
									<div className="p-4 flex justify-end gap-3 bg-white">
										<button
											onClick={() => handleCancelRequest(cita)}
											className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
										>
											Cancelar
										</button>
										<button
											onClick={() => handleEdit(cita)}
											className="px-3 py-1.5 text-sm font-medium rounded-md bg-[#1C3FAA] text-white hover:bg-[#163688]"
										>
											Reprogramar
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{citaToEdit && (
						<EditAppointmentModal
							isOpen={isEditModalOpen}
							onClose={() => {
								setIsEditModalOpen(false);
								setCitaToEdit(null);
							}}
							cita={citaToEdit}
							proveedorId={FIXER_ID}
							isDemo={isDemo}
							onUpdate={(updated) => {
								if (!updated) return;
								// actualizar usando el _id que recibimos del modal
								setCitas(prev => prev.map(c => c._id === updated._id ? { ...c, estado: updated.estado ?? 'agendado', fecha: updated?.fecha ?? c.fecha, horario: updated?.horario ?? c.horario } : c));
								// Si no estamos en modo demo, recargar desde servidor para garantizar persistencia
								if (!isDemo) {
									fetchCitas();
								}
							}}
						/>
					)}

					{citaToDelete && (
						<ConfirmationModal
							isOpen={isConfirmModalOpen}
							onClose={() => {
								setIsConfirmModalOpen(false);
								setCitaToDelete(null);
							}}
							onConfirm={handleCancelConfirm}
							title="Cancelar Cita"
							message="¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer."
						/>
					)}
				</div>
			</div>
		</>
	);
}
