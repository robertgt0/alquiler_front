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
// (Lo definimos fuera del componente principal para más limpieza)
function TrabajoCard({ trabajo }: { trabajo: ITrabajo }) {
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
        // --- CAMBIOS AQUÍ: Contenedor de la tarjeta ---
        <li className="p-4 bg-blue-400 rounded-xl shadow-md flex justify-between items-center text-white">
            {/* Sección de detalles (izquierda) */}
            <div>
                <p className="text-lg font-bold mb-1">Nombre del cliente: {trabajo.descripcion}</p>
                <p className="text-sm text-gray-700">Tipo de servicio: {trabajo.monto_a_pagar.toFixed(2)}</p> {/* Usamos monto_a_pagar como ejemplo de "Tipo de servicio" */}
                <p className="text-sm text-gray-700">Fecha programada: {fecha}</p>
            </div>

            {/* Botón de estado (derecha) */}
            <button className={`
                py-2 px-4 rounded-lg font-semibold text-white
                ${getEstadoButtonClass(trabajo.estado)}
                shadow-sm transition duration-200 ease-in-out
                self-center
            `}>
                {trabajo.estado.toUpperCase()}
            </button>
        </li>
        // --- FIN CAMBIOS ---
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
            BUSCAR TRABAJOS
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
          {/* El contenedor principal de los resultados ya tiene el padding y el fondo, no necesitamos form-container adicional */}
          <div className="form-container"> {/* Mantengo form-container para el fondo blanco, aunque no se ve en la imagen */}
            <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
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