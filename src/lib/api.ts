export const BACKEND_URL = "http://localhost:5000/api/notifications";

export const sendNotification = async (data: any) => {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
      body: JSON.stringify({
        ...data,
        isRegistration: Boolean(data.isRegistration), // 👈 fuerza booleano siempre
      }),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        result?.error ||
        result?.details?.message ||
        result?.message ||
        `Error ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: any) {
    throw new Error(err.message || "Error de conexión con el servidor");
  }
};
