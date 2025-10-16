// /src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("❌ Falta la variable de entorno MONGODB_URI");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// En desarrollo, usa el cache global para evitar crear múltiples clientes en HMR
const g = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };

if (process.env.NODE_ENV !== "production") {
  if (!g._mongoClientPromise) {
    client = new MongoClient(uri);
    g._mongoClientPromise = client.connect();
  }
  clientPromise = g._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
