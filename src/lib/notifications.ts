import { sendNotification } from "./api";

const validateEmail = (email: string) => {
  // Valida que tenga formato correcto y termine en gmail.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
  return emailRegex.test(email) && email.includes("@gmail.com");
};

// 1️⃣ Registro de usuario
export const notifyUserRegister = async (email: string, name: string) => {
  if (!validateEmail(email)) {
    throw new Error("Correo electrónico no válido. Debe ser un Gmail (ejemplo: usuario@gmail.com)");
  }

  return sendNotification({
    subject: "🎉 Bienvenido a la plataforma",
    message: `Hola ${name}, gracias por registrarte con nosotros.`,
    destinations: [{ email, name }],
    fromName: "Equipo Fixer",
  });
};

// 2️⃣ Usuario solicita a un fixer
export const notifyFixerRequest = async (fixerEmail: string, clientName: string, details: string) => {
  if (!validateEmail(fixerEmail)) {
    throw new Error("Correo electrónico del fixer no válido. Debe ser un Gmail (ejemplo: usuario@gmail.com)");
  }

  return sendNotification({
    subject: "🛠️ Nueva consulta de trabajo",
    message: `${clientName} te ha enviado una solicitud:\n${details}`,
    destinations: [{ email: fixerEmail, name: "Fixer" }],
    fromName: "Sistema Fixer",
  });
};

// 3️⃣ Fixer acepta la solicitud
export const notifyClientAccepted = async (clientEmail: string, fixerName: string) => {
  if (!validateEmail(clientEmail)) {
    throw new Error("Correo electrónico del cliente no válido. Debe ser un Gmail (ejemplo: usuario@gmail.com)");
  }

  return sendNotification({
    subject: "✅ Tu solicitud ha sido aceptada",
    message: `Buenas noticias, ${fixerName} ha aceptado tu solicitud de trabajo`,
    destinations: [{ email: clientEmail, name: "Cliente" }],
    fromName: "Fixer",
  });
};
