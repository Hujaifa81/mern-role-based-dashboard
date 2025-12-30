import { useState } from "react";

export interface DateRangePickerProps {
  value: { startDate?: string; endDate?: string };
  onChange: (value: { startDate?: string; endDate?: string }) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
}

export function DateRangePicker({ value, onChange, startPlaceholder, endPlaceholder }: DateRangePickerProps) {
  const [start, setStart] = useState(value.startDate || "");
  const [end, setEnd] = useState(value.endDate || "");

  return (
    <div className="flex gap-2 items-center">
      <input
        type="date"
        value={start}
        onChange={e => {
          setStart(e.target.value);
          onChange({ startDate: e.target.value, endDate: end });
        }}
        placeholder={startPlaceholder}
        className="border rounded px-2 py-1"
      />
      <span>-</span>
      <input
        type="date"
        value={end}
        onChange={e => {
          setEnd(e.target.value);
          onChange({ startDate: start, endDate: e.target.value });
        }}
        placeholder={endPlaceholder}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
