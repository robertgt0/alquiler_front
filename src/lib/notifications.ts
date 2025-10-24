// src/lib/notifications.ts
type Dest = { email: string; name?: string };

type ApiResult = {
    success?: boolean;
    message?: string;
    error?: string;
    details?: string[] | string;
    httpStatus?: number;
    [k: string]: any;
};

function detailsToText(details: ApiResult["details"]) {
    if (!details) return "";
    return Array.isArray(details) ? details.join(", ") : String(details);
}

async function postNotification(payload: {
    subject: string;
    message: string;
    destinations: Dest[];
    type?: string;
}): Promise<ApiResult> {
    const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    let data: ApiResult = {};
    try {
        data = await res.json();
    } catch {
        data = {};
    }

    // ⚠️ Lanzar error SOLO si HTTP no es 2xx o success === false explícito
    const bodySaysFailure = typeof data.success !== "undefined" && data.success === false;
    if (!res.ok || bodySaysFailure) {
        const txtDetails =
            detailsToText(data.details) ||
            detailsToText(data.response?.details) ||
            detailsToText(data.data?.details);

        const code = data.error || data.response?.error;
        const msg =
            code === "INVALID_EMAIL"
                ? `Correo no entregable${txtDetails ? ` — ${txtDetails}` : ""}`
                : data.message ||
                data.response?.message ||
                `Error HTTP ${res.status}`;

        const err: any = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    // ✅ éxito (2xx y no hubo success:false). Devolvemos el body para que el form muestre mensaje
    return data;
}

export function notifyUserRegister(email: string, name: string) {
    return postNotification({
        subject: "🎉 Bienvenido a la plataforma",
        message: `Hola ${name}, gracias por registrarte con nosotros.`,
        destinations: [{ email, name }],
        type: "generic",
    });
}

export function notifyFixerRequest(email: string, name: string, details = "") {
    return postNotification({
        subject: "🧰 Nueva solicitud",
        message: `Hola ${name}, llegó una solicitud.\n${details}`,
        destinations: [{ email, name }],
        type: "fixer_request",
    });
}

export function notifyClientAccepted(email: string, fixerName: string) {
    return postNotification({
        subject: "✅ Tu solicitud fue aceptada",
        message: `${fixerName} aceptó tu trabajo.`,
        destinations: [{ email }],
        type: "client_accepted",
    });
}
