// src/app/teamsys/realtime/socketClient.ts
"use client";

import io from "socket.io-client";

type Socket = ReturnType<typeof io>;

let socket: Socket | null = null;

export function getSocket(): Socket {
    console.log("🔥 getSocket fue llamado");

  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    console.log("🌐 [socketClient] creando socket hacia:", url);

    socket = io(url, {
      autoConnect: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ [socketClient] conectado. id =", socket?.id);
    });

    // 👇 SOLO CAMBIA ESTO: tipa el parámetro
    socket.on("connect_error", (err: any) => {
      console.log("❌ [socketClient] connect_error:", err?.message ?? err);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("🔌 [socketClient] disconnect. reason =", reason);
    });
  }

  return socket;
}
