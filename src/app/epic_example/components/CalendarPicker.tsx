"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarPickerProps {
  onDateSelect: (date: Date) => void;
}

export default function CalendarPicker({ onDateSelect }: CalendarPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      onDateSelect(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
      onDateSelect(value[0]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Calendar onChange={handleChange} value={selectedDate} />
      {selectedDate && (
        <p className="mt-4 text-gray-700 text-sm">
          Fecha seleccionada: {selectedDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
