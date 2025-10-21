'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import Modal from "react-modal";
import { UsuarioDocument } from "@/app/registro/interfaces/types";
import { crearUsuario } from "@/app/teamsys/services/UserService";

// 🧭 Fix de íconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
}

interface SelectableMapProps {
  ubicacion: Location | null;
  setUbicacion: (loc: Location) => void;
  zoom?: number;
  height?: string;
  width?: string;
}

const SelectableMap: React.FC<SelectableMapProps> = ({ ubicacion, setUbicacion, zoom = 15, height = "200px", width = "200px" }) => {
  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        setUbicacion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={ubicacion || { lat: -17.3939, lng: -66.1568 }}
      zoom={zoom}
      style={{ width, height, borderRadius: "0.5rem" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler />
      {ubicacion && (
        <>
          <Marker position={ubicacion} />
          <Circle center={ubicacion} radius={1000} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />
        </>
      )}
    </MapContainer>
  );
};

export default function RegistroImagen() {
  const router = useRouter();
  const [datosFormulario, setDatosFormulario] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null); // URL (Google o blob)
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const isHttpUrl = (v: any) =>
  typeof v === "string" && /^https?:\/\//i.test(v);
  
 
const maxSize = 1 * 1024 * 1024;
const allowedTypes = ["image/png", "image/jpeg"]; 

  // 🧠 Recuperar datos del sessionStorage (Google o formulario manual)
  // Función auxiliar para verificar si es una URL HTTP válida
useEffect(() => {
  const datosGuardados = sessionStorage.getItem("datosUsuarioParcial");
  if (!datosGuardados) {
    console.warn("⚠️ No hay datos en sessionStorage.");
    return;
  }

  try {
    const datos = JSON.parse(datosGuardados);
    console.log("🔍 Datos en sessionStorage:", datos);

    let datosAdaptados: any = {};

    // ✅ Caso 1: formulario tradicional
    if (datos.contraseña && datos.email) {
      datosAdaptados = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        correoElectronico: datos.email,
        password: datos.contraseña,
        terminosYCondiciones: datos.terminosYCondiciones,
      };
    }

    // ✅ Caso 2: viene de Google
    else if (datos.correoElectronico) {
      datosAdaptados = {
        nombre: datos.nombre,
        correoElectronico: datos.correoElectronico,
        fotoPerfil:datos.fotoPerfil,
        terminosYCondiciones: false,
      };
    }

    setDatosFormulario(datosAdaptados);
    console.log("✅ Datos adaptados para envío:", datosAdaptados);

    // 🖼️ Si hay una foto de Google, mostrarla
    if (isHttpUrl(datos.fotoPerfil)) {
      setPreviewImage(datos.fotoPerfil);
    }

  } catch (err) {
    console.error("❌ Error al parsear sessionStorage:", err);
  }
}, []);


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  if (!allowedTypes.includes(selected.type)) {
    setError("Formato no permitido. Sube una imagen PNG o JPG.");
    setFile(null);
    setFilePreview(null);
    return;
  }
  if (selected.size > maxSize) {
    setError("Archivo demasiado grande. Tamaño máximo: 1 MB.");
    setFile(null);
    setFilePreview(null);
    return;
  }

  setError("");
  setFile(selected);
  const url = URL.createObjectURL(selected); // preview local
  setFilePreview(url);
};


// Limpia la objectURL cuando cambie el archivo o se desmonte
useEffect(() => {
  return () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  };
}, [filePreview]);


  // 🚀 Continuar registro
const handleContinuar = async () => {
  if (!accepted) return setError("Debes aceptar los términos y condiciones.");
  if (!ubicacion) return setError("Selecciona tu ubicación en el mapa.");

  // ✅ Foto obligatoria: debe venir del input de archivo
  if (!file) return setError("Debes subir una foto de perfil en PNG o JPG (máx 1 MB).");

  try {
    // Revalidación por robustez
    if (!allowedTypes.includes(file.type)) {
      return setError("Formato no permitido. Sube una imagen PNG o JPG.");
    }
    if (file.size > maxSize) {
      return setError("Archivo demasiado grande. Tamaño máximo: 1 MB.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const fotoBuffer = Buffer.from(arrayBuffer);

    const usuario: any = {
      nombre: datosFormulario?.nombre ?? "",
      correoElectronico: datosFormulario?.correoElectronico ?? "",
      terminosYCondiciones: accepted,
      fotoPerfil: fotoBuffer,
      ubicacion: {
        type: "Point",
        coordinates: [ubicacion.lng, ubicacion.lat],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (datosFormulario?.apellido) usuario.apellido = datosFormulario.apellido;
    if (datosFormulario?.telefono) usuario.telefono = datosFormulario.telefono;
    if (datosFormulario?.password) usuario.password = datosFormulario.password;

    await crearUsuario(usuario);

    alert("Usuario registrado exitosamente 🎉");
    sessionStorage.removeItem("datosUsuarioParcial");
    router.push("/");
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    setError("Hubo un error al registrar el usuario.");
  }
};
return (
  <div className="min-h-screen flex items-center justify-center bg-blue-600">
    <form className="flex flex-col gap-4 items-center border p-6 rounded-xl shadow-md w-11/12 sm:w-full max-w-md bg-white">
      <h2 className="text-lg sm:text-xl font-bold text-center">
        Subir Imagen y añadir una Ubicación
      </h2>

      {/* Imagen + Mapa responsivo */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full">
        {/* Bloque: Foto */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 border rounded overflow-hidden">
            <img
              src={filePreview ?? previewImage ?? DEFAULT_AVATAR}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Botón debajo de la imagen */}
          <label
            htmlFor="fileInput"
            className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 cursor-pointer w-full sm:w-auto"
          >
            Insertar Foto de perfil
          </label>

          {/* input de archivo (único) */}
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            id="fileInput"
            className="hidden"
          />
        </div>

        {/* Bloque: Mapa */}
        <div className="flex flex-col items-center">
          {/* Contenedor con tamaño responsivo */}
          <div
            onClick={() => setModalOpen(true)}
            className="cursor-pointer border rounded overflow-hidden relative w-28 h-28 sm:w-32 sm:h-32"
          >
            <SelectableMap
              ubicacion={ubicacion}
              setUbicacion={setUbicacion}
              height="100%"
              width="100%"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white font-bold">
              📍
            </div>
          </div>

          {/* Botón debajo del mapa */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 w-full sm:w-auto"
          >
            Insertar tu ubicación
          </button>
        </div>
      </div>

      {/* Modal mapa grande (responsivo) */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="mx-auto mt-10 bg-white rounded shadow-lg p-4 w-[90vw] max-w-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h3 className="text-center mb-2 font-bold">Selecciona tu ubicación</h3>
        <SelectableMap
          ubicacion={ubicacion}
          setUbicacion={setUbicacion}
          zoom={15}
          height="400px"
          width="100%"
        />
        <button
          onClick={() => setModalOpen(false)}
          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 mx-auto block"
        >
          Confirmar
        </button>
      </Modal>

      {/* Checkbox */}
      <div className="flex items-start space-x-2 w-full">
        <input
          type="checkbox"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
          className="mt-1"
        />
        <span className="text-sm text-gray-700">
          Acepto los{" "}
          <Link href="/terminos" className="text-blue-600 underline">
            Términos y Condiciones
          </Link>{" "}
          y la{" "}
          <Link href="/privacidad" className="text-blue-600 underline">
            Política de Privacidad
          </Link>
          .
        </span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleContinuar}
        className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-red-600 w-full"
      >
        Terminar Registro
      </button>
    </form>
  </div>
);
}