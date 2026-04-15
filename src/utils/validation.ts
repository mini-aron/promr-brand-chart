export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isValidPhone(v: string): boolean {
  const digits = v.replace(/[^\d]/g, '');
  return digits.length >= 9 && digits.length <= 11;
}
