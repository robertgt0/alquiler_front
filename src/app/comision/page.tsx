"use client";
// 1. Importa useState y useEffect
import { useState, useEffect } from "react";

// --- 2. INTERFAZ PARA LOS TRABAJOS (de tu backend) ---
interface ITrabajo {
  _id: string;
  descripcion: string;
  estado: string;
  monto_a_pagar: number; // Usaremos esto como "Tipo de servicio" o similar
  fecha_creacion: string; // Usaremos esto como "Fecha programada"
  fixer_id: string; // Este campo no se muestra en la tarjeta, pero es parte de la interfaz
}

// --- 3. INTERFAZ DE ERRORES (simplificada) ---
interface FormErrors {
  usuario?: string;
}

// --- 4. COMPONENTE DE TARJETA DE TRABAJO (para los resultados) ---

// --- Propiedades actualizadas para incluir onClick ---
interface TrabajoCardProps {
  trabajo: ITrabajo;
  onClick: (trabajo: ITrabajo) => void;
}

function TrabajoCard({ trabajo, onClick }: TrabajoCardProps) {
    const fecha = new Date(trabajo.fecha_creacion).toLocaleDateString("es-ES", {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Función para obtener clases de color para el botón de estado
    const getEstadoButtonClass = (estado: string) => {
        switch (estado) {
            case 'completado':
                return 'bg-[#2A87FF] hover:bg-blue-600'; // Azul
            case 'pagado':
                return 'bg-green-500 hover:bg-green-600'; // Verde
            case 'pendiente':
                return 'bg-yellow-500 hover:bg-yellow-600'; // Amarillo
            default:
                return 'bg-gray-500 hover:bg-gray-600'; // Gris
        }
    };

    return (
        // --- CAMBIO AQUÍ: Ahora todas las tarjetas son cliqueables ---
        <li 
          className={`
            p-4 bg-blue-400 rounded-xl shadow-md flex justify-between items-center text-white
            cursor-pointer transition duration-300 hover:bg-blue-500
          `}
          onClick={() => onClick(trabajo)} // Llama a la función del padre
        >
            {/* Sección de detalles (izquierda) */}
            <div>
                <p className="text-lg font-bold mb-1">Tipo de servicio: {trabajo.descripcion}</p>
                <p className="text-sm text-gray-700">Precio: {trabajo.monto_a_pagar.toFixed(2)}</p>
                <p className="text-sm text-gray-700">Fecha programada: {fecha}</p>
            </div>

            {/* Botón de estado (derecha) */}
            <button className={`
                py-2 px-4 rounded-lg font-semibold text-white
                ${getEstadoButtonClass(trabajo.estado)}
                shadow-sm transition duration-200 ease-in-out
                self-center
                pointer-events-none
            `}>
                {trabajo.estado.toUpperCase()}
            </button>
        </li>
    );
}

// --- 5. COMPONENTE MODAL (MODIFICADO) ---
// --- CAMBIO AQUÍ: Se eliminó la prop 'trabajo' y el contenido ---
interface ModalProps {
  onClose: () => void;
}

// Renombramos el componente para más claridad, aunque mantenemos el nombre 'CompletadoModal'
// para que coincida con tu código original.
function CompletadoModal({ onClose }: ModalProps) {
  // Ya no necesitamos la 'fecha' ni 'trabajo'

  return (
    // Fondo oscuro
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose} // Cierra al hacer clic en el fondo
    >
      {/* Contenedor del Modal */}
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic en el modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Modal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
        </div>
        
        {/* --- CAMBIO AQUÍ: Contenido del Modal ahora vacío --- */}
        <div className="space-y-3 text-gray-700" style={{ minHeight: '150px' }}>
          {/* El contenido está vacío, como solicitaste */}
          <p className="text-center text-gray-400 pt-8">Contenido del modal...</p>
        </div>

        {/* Botón de Cerrar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-lg font-semibold text-white bg-[#2A87FF] hover:bg-blue-700 transition duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


// --- 6. COMPONENTE PRINCIPAL (adaptado de tu ejemplo) ---
export default function HomePage() {
  // --- Estados para el buscador ---
  const [usuario, setUsuario] = useState("");
  const [trabajos, setTrabajos] = useState<ITrabajo[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- CAMBIO AQUÍ: ESTADOS DEL MODAL SIMPLIFICADOS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Ya no necesitamos 'selectedTrabajo'
  // const [selectedTrabajo, setSelectedTrabajo] = useState<ITrabajo | null>(null);

  // --- Manejador de cambio (simplificado) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setUsuario(value);
      setMessage(""); // Limpia mensajes al escribir
      
      // Limpia errores al escribir
      if (errors.usuario) {
          setErrors({});
      }
  };

  // --- Manejador de envío (sin cambios) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setTrabajos([]); // Limpiar resultados anteriores
    let currentErrors: FormErrors = {};

    // Validación (como en tu ejemplo)
    if (!usuario) {
      currentErrors.usuario = "Requerido";
    }
    
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setMessage("Por favor, ingrese un usuario.");
      return;
    }

    setLoading(true);
    setMessage("Procesando..."); // (Como en tu ejemplo)

    try {
      // Usamos el endpoint del backend
      const response = await fetch(`http://localhost:5000/api/trabajos/${usuario}`);
      const data = await response.json();

      if (!response.ok) {
        // Si el backend da un 404 o 500, usamos su mensaje
        throw new Error(data.message || "Error al buscar trabajos.");
      }
      
      if (data.length > 0) {
        setTrabajos(data);
        setMessage(""); // Limpiamos "Procesando..."
      } else {
        setMessage(`No se encontraron trabajos para el usuario "${usuario}".`);
      }

    } catch (err: any) {
      console.error("Error en fetch:", err);
      setMessage(err.message || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Función de ayuda para clases (de tu ejemplo)
  const inputClass = (fieldName: keyof FormErrors) => `form-input ${errors[fieldName] ? 'input-error' : ''}`;
  
  // --- CAMBIO AQUÍ: FUNCIONES DEL MODAL SIMPLIFICADAS ---
  const handleTrabajoClick = (trabajo: ITrabajo) => {
    // Ya no comprobamos el estado, siempre abrimos el modal
    // if (trabajo.estado === 'completado') {
      // Ya no guardamos el trabajo seleccionado
      // setSelectedTrabajo(trabajo); 
      setIsModalOpen(true);
    // }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Ya no limpiamos el trabajo seleccionado
    // setSelectedTrabajo(null);
  };

  return (
    <div className="page-container">
      {/* Columna 1: Título (Centrado y más grande) */}
      <div>
        <h1 className="hero-title text-center text-5xl font-bold my-8">
          BUSCAR TRABAJOS
        </h1>
      </div>

      {/* Columna 2: Formulario (Modificado) */}
      <div className="form-wrapper">
        <div className="form-blur-background"></div>

        {/* Tarjeta Blanca */}
        <div className="form-container">
          <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
            
            <div className="form-layout-internal"> 

              {/* Columna ÚNICA */}
              <div className="form-column" style={{ width: '100%' }}>
                
                {/* Input de Usuario */}
                <div className="form-group flex flex-col">
                  <label 
                    htmlFor="usuario" 
                    className="form-label-styled text-xl text-center"
                  >
                    Usuario del Fixer
                  </label>
                  <input 
                    id="usuario" 
                    name="usuario" 
                    placeholder="Escribe el usuario" 
                    value={usuario} 
                    onChange={handleChange} 
                    required 
                    className={inputClass('usuario') + " mx-auto w-64"} 
                  />
                  <p className="form-error text-center">{errors.usuario || " "}</p>
                </div>


                {/* Contenedor de botón (Centrado) */}
                <div className="button-container flex justify-center">
                  <button 
                    type="submit" 
                    className="
                      py-3 w-64 rounded-lg font-semibold text-white 
                      bg-[#2A87FF] 
                      hover:bg-blue-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      shadow-md hover:shadow-lg transition duration-300 ease-in-out
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    disabled={loading}
                  >
                    {loading ? "Buscando..." : "BUSCAR"}
                  </button>
                </div>
              </div> 
              
            </div> 

            {/* Mensaje General (como en tu ejemplo) */}
            {message && <p className="form-message">{message}</p>}
          </form>
        </div> {/* Fin form-container */}
      </div> {/* Fin form-wrapper */}

      {/* --- 7. SECCIÓN DE RESULTADOS (Modificada) --- */}
      {trabajos.length > 0 && (
        <div className="form-wrapper" style={{ marginTop: '2rem' }}>
          <div className="form-container">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
              Resultados
            </h2>
            <ul className="space-y-4">
              {trabajos.map(trabajo => (
                <TrabajoCard 
                  key={trabajo._id} 
                  trabajo={trabajo} 
                  onClick={handleTrabajoClick} // La función ahora abre el modal vacío
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* --- 8. RENDERIZADO DEL MODAL (Nuevo) --- */}
      {/* --- CAMBIO AQUÍ: Renderizado simplificado --- */}
      {isModalOpen && (
        <CompletadoModal 
          onClose={closeModal} 
          // Ya no pasamos la prop 'trabajo'
        />
      )}
      
    </div> 
  );
}