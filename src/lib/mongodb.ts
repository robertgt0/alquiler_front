// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

// Leemos la variable de entorno
const uri = process.env.MONGODB_URI;

// Creamos una promesa de conexión segura
let clientPromise: Promise<MongoClient>;

// ✅ Si la variable no existe (como en build de Vercel), no rompemos el proceso
if (!uri) {
  console.warn("⚠️ MONGODB_URI no configurada. Saltando conexión a MongoDB.");

  // Creamos una promesa rechazada solo para evitar errores de compilación
  clientPromise = Promise.reject("MONGODB_URI no definida") as unknown as Promise<MongoClient>;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
