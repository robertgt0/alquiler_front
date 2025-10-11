import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { ci, email } = await req.json();
    const client = await clientPromise;
    const db = client.db("fixersdb"); // Usa el nombre de tu base
    const collection = db.collection("fixers");

    // Verificar si el carnet ya existe
    const exists = await collection.findOne({ ci });

    if (exists) {
      return NextResponse.json({ success: false, message: "❌ El carnet ya está registrado" });
    }

    // Si no existe, insertar nuevo fixer
    await collection.insertOne({ ci, email });
    return NextResponse.json({ success: true, message: "✅ Fixer registrado correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "❌ Error en el servidor" });
  }
}

