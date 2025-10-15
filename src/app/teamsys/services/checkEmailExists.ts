// src/utils/checkEmailExists.ts
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!email) return false;

  try {
    const res = await fetch(`/api/users/exists?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Error en la solicitud');

    const data = await res.json();
    return data.exists; // true si ya existe, false si no
  } catch (error) {
    console.error('Error verificando correo:', error);
    return false; // por seguridad, asumimos que no existe si hay error
  }
}
