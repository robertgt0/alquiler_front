import { sendNotification } from "./api";

// 1️⃣ Registro de usuario
export const notifyUserRegister = async (email: string, name: string) => {
  return sendNotification({
    subject: "🎉 Bienvenido a la plataforma",
    message: `Hola ${name}, gracias por registrarte con nosotros.`,
    destinations: [{ email, name }],
    fromName: "Equipo Fixer",
  });
};

// 2️⃣ Usuario solicita a un fixer
export const notifyFixerRequest = async (fixerEmail: string, clientName: string, details: string) => {
  return sendNotification({
    subject: "🛠️ Nueva consulta de trabajo",
    message: `${clientName} te ha enviado una solicitud:\n${details}`,
    destinations: [{ email: fixerEmail, name: "Fixer" }],
    fromName: "Sistema Fixer",
  });
};

// 3️⃣ Fixer acepta la solicitud
export const notifyClientAccepted = async (clientEmail: string, fixerName: string) => {
  return sendNotification({
    subject: "✅ Tu solicitud ha sido aceptada",
    message: `Buenas noticias, ${fixerName} ha aceptado tu solicitud de trabajo`,
    destinations: [{ email: clientEmail, name: "Cliente" }],
    fromName: "Fixer",
  });
};
