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
  
  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

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


  // 📸 Manejar imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  if (!allowedTypes.includes(selected.type)) {
    setError("Formato no permitido. Usa JPG o PNG.");
    setFile(null);
    setFilePreview(null);
    return;
  }
  if (selected.size > maxSize) {
    setError("Archivo demasiado grande. Máx 2MB.");
    setFile(null);
    setFilePreview(null);
    return;
  }

  setError("");
  setFile(selected);

  // crea una URL local para previsualizar el file
  const url = URL.createObjectURL(selected);
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

  try {
    let fotoBuffer: Buffer | undefined = undefined;

    if (file) {
      // Caso 1: el usuario subió un archivo
      const arrayBuffer = await file.arrayBuffer();
      fotoBuffer = Buffer.from(arrayBuffer);
    } else if (isHttpUrl(previewImage)) {
      // Caso 2: imagen de Google
      const res = await fetch(previewImage as string);
      const arrayBuffer = await res.arrayBuffer();
      fotoBuffer = Buffer.from(arrayBuffer);
    } else {
      return setError("Selecciona una imagen o usa tu foto de Google.");
    }

    // 🧩 Crear objeto base
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

    // 🧱 Agregar campos opcionales solo si existen
    if (datosFormulario?.apellido) usuario.apellido = datosFormulario.apellido;
    if (datosFormulario?.telefono) usuario.telefono = datosFormulario.telefono;
    if (datosFormulario?.password) usuario.password = datosFormulario.password;

    console.log("📤 Usuario listo para crear:", usuario);

    await crearUsuario(usuario);

    alert("Usuario registrado exitosamente 🎉");
    sessionStorage.removeItem("datosUsuarioParcial");
    router.push("/");
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    setError("Hubo un error al registrar el usuario.");
  }
};

  // 🧩 Render
  return (
    <form className="flex flex-col gap-4 items-center border p-6 rounded shadow-md w-full max-w-md bg-white mx-auto">
      <h2 className="text-xl font-bold text-center">Subir Imagen y añadir una Ubicación</h2>

      <div className="flex gap-4 items-start">
        <div className="w-32 h-32 border rounded overflow-hidden">
  <img
    src={filePreview ?? previewImage ?? DEFAULT_AVATAR}
    alt="preview"
    className="w-32 h-32 object-cover"
  />
</div>

        {/* Mapa mini */}
        <div onClick={() => setModalOpen(true)} className="cursor-pointer border w-32 h-32 rounded overflow-hidden relative">
          <SelectableMap ubicacion={ubicacion} setUbicacion={setUbicacion} height="128px" width="128px" />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white font-bold">
            📍
          </div>
        </div>
      </div>

      {/* Modal mapa grande */}
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="mx-auto mt-20 bg-white rounded shadow-lg p-4 max-w-lg" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
        <h3 className="text-center mb-2 font-bold">Selecciona tu ubicación</h3>
        <SelectableMap ubicacion={ubicacion} setUbicacion={setUbicacion} zoom={15} height="400px" width="100%" />
        <button onClick={() => setModalOpen(false)} className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 mx-auto block">
          Confirmar
        </button>
      </Modal>

      {/* Subir archivo */}
      <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} id="fileInput" className="hidden" />
      <label htmlFor="fileInput" className="bg-blue-600 text-white py-1 px-4 rounded cursor-pointer hover:bg-blue-700">
        Insertar Foto
      </label>

      {/* Checkbox */}
      <div className="flex items-start space-x-2 w-full">
        <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="mt-1" />
        <span className="text-sm text-gray-700">
          Acepto los <Link href="/terminos" className="text-blue-600 underline">Términos y Condiciones</Link> y la <Link href="/privacidad" className="text-blue-600 underline">Política de Privacidad</Link>.
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
  );
}
