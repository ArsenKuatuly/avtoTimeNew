export function formatPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  // Strip leading 7 only when 11 digits total (country code 7 + 10 local digits)
  const d = digits.length === 11 ? digits.slice(1) : digits;
  if (d.length === 0) return '+7';
  let result = '+7';
  if (d.length > 0) result += ' ' + d.slice(0, 3);
  if (d.length > 3) result += ' ' + d.slice(3, 6);
  if (d.length > 6) result += ' ' + d.slice(6, 8);
  if (d.length > 8) result += ' ' + d.slice(8, 10);
  return result;
}
