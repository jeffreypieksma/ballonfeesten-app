const WEEKDAYS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

/**
 * Formats an ISO timestamp as a short Dutch spot moment: "vr 17 jul · 19:32".
 * Returns null for unparseable input (caller shows a fallback label).
 */
export function formatSpotMoment(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
