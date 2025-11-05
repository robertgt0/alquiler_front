// src/app/hooks/useResetGuia.ts
export function useResetGuia() {
  const resetearGuia = () => {
    localStorage.removeItem('noMostrarGuia');
    localStorage.removeItem('guiaVista');
    // Recargar la página para que el modal aparezca
    window.location.reload();
  };

  return { resetearGuia };
}