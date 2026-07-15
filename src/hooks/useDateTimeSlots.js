import { useState, useEffect } from 'react';
import { BASE_URL } from '../config/api.config';

export const toApiDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const groupSlots = (slots) => {
  const groups = [
    { label: 'Утро',  from: 6,  to: 11, slots: [] },
    { label: 'День',  from: 12, to: 17, slots: [] },
    { label: 'Вечер', from: 18, to: 23, slots: [] },
  ];
  slots.forEach(s => {
    const hour = parseInt(s.time.slice(0, 2), 10);
    const group = groups.find(g => hour >= g.from && hour <= g.to);
    if (group) group.slots.push({ t: s.time.slice(0, 5), ok: s.is_available });
  });
  return groups.filter(g => g.slots.length > 0);
};

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

export function useDateTimeSlots(companyId) {
  const [pickerDate, setPickerDate] = useState(startOfToday);
  const [pickerSlot, setPickerSlot] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [timeGroups, setTimeGroups] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || !pickerDate) return;
    setSlotsLoading(true);
    setPickerSlot(null);
    fetch(`${BASE_URL}/partners/get-time-slots/${companyId}?date=${toApiDate(pickerDate)}`)
      .then(r => r.json())
      .then(data => setTimeGroups(groupSlots(data?.data || [])))
      .catch(() => setTimeGroups([]))
      .finally(() => setSlotsLoading(false));
  }, [companyId, pickerDate]);

  const today = startOfToday();
  const dayOfWeek = (today.getDay() + 6) % 7;
  const monday = new Date(today); monday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
  });
  const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

  const pickerTime = pickerSlot ? timeGroups[pickerSlot.g]?.slots[pickerSlot.i]?.t : null;

  return {
    pickerDate, setPickerDate,
    pickerSlot, setPickerSlot,
    weekOffset, setWeekOffset,
    timeGroups, slotsLoading,
    today, weekDays, isSameDay,
    pickerTime,
  };
}
