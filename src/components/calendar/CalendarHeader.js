'use client';
export default function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth }) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="calendar-header">
      <button className="nav-button" onClick={onPrevMonth}>‹</button>
      <h2 className="month-year">
        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </h2>
      <button className="nav-button" onClick={onNextMonth}>›</button>
    </div>
  );
}