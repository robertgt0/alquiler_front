'use client';
export default function TimeSlots({ timeSlots, selectedTime, onTimeSelect }) {
  return (
    <div className="time-selection">
      <h3>Horarios Disponibles</h3>
      <div className="time-slots">
        {timeSlots.map((time, index) => (
          <div
            key={index}
            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => onTimeSelect(time)}
          >
            <span className="time-range-full">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}