// Dates are stored as "YYYY-MM-DD" strings (the value of <input type="date">).
// Parsing them manually avoids timezone shifts from new Date("YYYY-MM-DD").

export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDate(iso) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(iso, status) {
  // ISO date strings compare correctly as plain strings.
  return Boolean(iso) && status !== 'Completed' && iso < todayISO();
}
