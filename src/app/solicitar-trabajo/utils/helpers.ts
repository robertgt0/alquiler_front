export const formatearHora = (hora: string): string => {
  const [h, m] = hora.split(":");
  return `${h}:${m}`;
};
