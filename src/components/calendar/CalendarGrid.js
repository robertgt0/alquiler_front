'use client';
export default function CalendarGrid({ calendarDays, selectedDate, onDateSelect, getDayClass }) {
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="calendar-grid">
      {weekdays.map(day => (
        <div key={day} className="weekday">{day}</div>
      ))}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={getDayClass(day)}
          onClick={() => onDateSelect(day)}
        >
          {day.date.getDate()}
          {day.isHoliday && <span className="indicator holiday-indicator">🎉</span>}
          {day.isBooked && <span className="indicator booked-indicator">✓</span>}
          {!day.available && day.currentMonth && !day.isHoliday && !day.isBooked && (
            <span className="indicator unavailable-indicator">✗</span>
          )}
        </div>
      ))}
    </div>
  );
}