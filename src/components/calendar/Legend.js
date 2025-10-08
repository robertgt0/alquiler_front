'use client';
export default function Legend() {
  return (
    <div className="legend-container">
      <div className="legend-title">Leyenda:</div>
      <div className="legend-items">
        <div className="legend-item-box">
          <div className="color-box unavailable-box"></div>
          <span>No disponible</span>
        </div>
        <div className="legend-item-box">
          <div className="color-box holiday-box"></div>
          <span>Día festivo/Feriados</span>
        </div>
        <div className="legend-item-box">
          <div className="color-box booked-box"></div>
          <span>Programada</span>
        </div>
      </div>
    </div>
  );
}