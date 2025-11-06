"use client";
// 1. Importa useState y useEffect
import { useState, useEffect } from "react";

// --- 2. INTERFAZ PARA LOS TRABAJOS (de tu backend) ---
interface ITrabajo {
  _id: string;
  descripcion: string;
  estado: string;
  monto_a_pagar: number;
  fecha_creacion: string;
  fixer_id: string;
}

// --- 3. INTERFAZ DE ERRORES (simplificada) ---
interface FormErrors {
  usuario?: string;
}

// --- 4. COMPONENTE DE TARJETA DE TRABAJO (para los resultados) ---
// (Lo definimos fuera del componente principal para más limpieza)
function TrabajoCard({ trabajo }: { trabajo: ITrabajo }) {
    const fecha = new Date(trabajo.fecha_creacion).toLocaleDateString("es-ES", {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Clases de Tailwind para los estados
    const getEstadoClass = (estado: string) => {
        switch (estado) {
            case 'completado':
                return 'bg-green-100 text-green-800';
            case 'pagado':
                return 'bg-blue-100 text-blue-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <li className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getEstadoClass(trabajo.estado)}`}>
                    {trabajo.estado.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-900">
                    Bs {trabajo.monto_a_pagar.toFixed(2)}
                </span>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">{trabajo.descripcion}</p>
            <p className="text-sm text-gray-500">Creado: {fecha}</p>
        </li>
    );
}


// --- 5. COMPONENTE PRINCIPAL (adaptado de tu ejemplo) ---
export default function HomePage() {
  // --- Estados para el buscador ---
  const [usuario, setUsuario] = useState("");
  const [trabajos, setTrabajos] = useState<ITrabajo[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // (Se eliminaron los estados 'isModalOpen' y 'formData' del ejemplo)

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

  // --- Manejador de envío (nueva lógica de búsqueda) ---
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
  
  // (Se eliminaron las funciones y el useEffect del Modal)

  return (
    <div className="page-container">
      {/* Columna 1: Título (Centrado y más grande) */}
      <div>
        <h1 className="hero-title text-center text-5xl font-bold my-8">
            BUSCADOR DE TRABAJOS
        </h1>
      </div>

      {/* Columna 2: Formulario (Modificado) */}
      <div className="form-wrapper">
        <div className="form-blur-background"></div>

        {/* Tarjeta Blanca */}
        <div className="form-container">
          <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
            
            {/* Layout simplificado. Usamos 'form-layout-internal' 
                pero con una sola columna para el buscador.
            */}
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
                  {/* --- CAMBIO AQUÍ: Ancho fijo --- */}
                  <input 
                    id="usuario" 
                    name="usuario" 
                    placeholder="Escribe el usuario (ej: tmolina, alopez)" 
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
                    // --- CAMBIO AQUÍ: Ancho fijo (removido px-6) ---
                    className="
                      py-3 w-64 rounded-lg font-semibold text-white 
                      bg-[#2A87FF] 
                      hover:bg-blue-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      shadow-md hover:shadow-lg transition duration-300 ease-in-out
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    // --- FIN CLASES ---
                    disabled={loading}
                  >
                    {loading ? "Buscando..." : "BUSCAR"}
                  </button>
                  {/* (Se eliminó el botón "Ver Info") */}
                </div>
              </div> 
              
            </div> 

            {/* Mensaje General (como en tu ejemplo) */}
            {message && <p className="form-message">{message}</p>}
          </form>
        </div> {/* Fin form-container */}
      </div> {/* Fin form-wrapper */}

      {/* --- 6. SECCIÓN DE RESULTADOS (Nueva) ---
        La mostramos debajo del formulario, usando el mismo estilo de 'wrapper'
      */}
      {trabajos.length > 0 && (
        <div className="form-wrapper" style={{ marginTop: '2rem' }}>
          <div className="form-container">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Resultados para "{usuario}"
            </h2>
            <ul className="space-y-4">
              {trabajos.map(trabajo => (
                <TrabajoCard key={trabajo._id} trabajo={trabajo} />
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* (Se eliminó el Modal) */}
      
    </div> 
  );
}