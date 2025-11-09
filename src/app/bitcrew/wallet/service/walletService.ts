export const getWalletStatus = async (usuario: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/wallet/${usuario}`);
    if (!response.ok) throw new Error('Error al obtener el estado de la billetera');
    const data = await response.json();
    return data.billetera;
  } catch (error) {
    console.error('❌ Error consultando billetera:', error);
    return null;
  }
};
