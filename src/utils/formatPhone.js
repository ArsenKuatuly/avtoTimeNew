export function formatPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const d = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  if (d.length === 0) return '+7';
  let result = '+7';
  if (d.length > 0) result += ' ' + d.slice(0, 3);
  if (d.length > 3) result += ' ' + d.slice(3, 6);
  if (d.length > 6) result += ' ' + d.slice(6, 8);
  if (d.length > 8) result += ' ' + d.slice(8, 10);
  return result;
}
