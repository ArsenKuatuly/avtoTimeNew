import { useCallback } from 'react';

export function formatPhoneValue(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  const d = digits.startsWith('8') || digits.startsWith('7') ? digits.slice(1) : digits;
  const g1 = d.slice(0, 3);
  const g2 = d.slice(3, 6);
  const g3 = d.slice(6, 8);
  const g4 = d.slice(8, 10);
  let result = '+7';
  if (g1) result += ' ' + g1;
  if (g2) result += ' ' + g2;
  if (g3) result += ' ' + g3;
  if (g4) result += ' ' + g4;
  return result;
}

export function usePhoneFormat(setValue) {
  return useCallback((e) => setValue(formatPhoneValue(e.target.value)), [setValue]);
}
