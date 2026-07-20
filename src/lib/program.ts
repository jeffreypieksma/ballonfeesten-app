import { programDays } from '@/mocks/program-data';
import type { AppThemeColor } from '@/constants/theme';
import type { ProgramCategory, ProgramDay, ProgramEntry } from '@/types/program';

/**
 * Backend-agnostic data source for the festival programme.
 *
 * Today it returns the local 2026 schedule. To load from a database/API later,
 * replace only this function's body (e.g. `fetch(process.env.EXPO_PUBLIC_API_URL + '/program')`)
 * — the returned `ProgramDay[]` shape stays the same, so no UI changes are needed.
 */
export async function getProgram(): Promise<ProgramDay[]> {
  return programDays;
}

type CategoryMeta = {
  emoji: string;
  /** Theme colour role used for the timeline dot / category tint. */
  colorRole: AppThemeColor;
};

const CATEGORY_META: Record<ProgramCategory, CategoryMeta> = {
  ballonvaart: { emoji: '🎈', colorRole: 'primary' },
  terrein: { emoji: '🎪', colorRole: 'secondary' },
  defile: { emoji: '🎺', colorRole: 'balloonPurple' },
  opening: { emoji: '🎉', colorRole: 'gold' },
  stuntshow: { emoji: '✈️', colorRole: 'accent' },
  muziek: { emoji: '🎵', colorRole: 'balloonGreen' },
  nightglow: { emoji: '🌌', colorRole: 'balloonPurple' },
  oldtimers: { emoji: '🚗', colorRole: 'sunrise' },
  inloop: { emoji: '🎈', colorRole: 'secondary' },
  einde: { emoji: '🏁', colorRole: 'textSecondary' },
  overig: { emoji: '📍', colorRole: 'textSecondary' },
};

export function categoryMeta(category: ProgramCategory): CategoryMeta {
  return CATEGORY_META[category] ?? CATEGORY_META.overig;
}

export type ProgramLiveStatus = {
  /** The day that should be selected by default (active day, else first/last). */
  dayId: string;
  /** Entry that is currently happening, if the festival is live. */
  currentEntryId: string | null;
  /** The next upcoming entry, if any. */
  nextEntryId: string | null;
  /** The next upcoming entry regardless of the "straks" lead window. */
  upcomingEntryId: string | null;
};

/** Fallback window for the very last entry of the festival (no "next" to bound it). */
const LAST_ENTRY_WINDOW_MS = 3 * 60 * 60 * 1000;

/** "Straks" only shows once the next entry starts within this window from now. */
const STRAKS_LEAD_MS = 2 * 60 * 60 * 1000;

/**
 * Absolute moment of `entries[index]`, accounting for after-midnight rollover
 * within a day block (a time smaller than the previous one means the clock
 * has crossed into the next calendar day).
 */
function entryDateTime(day: ProgramDay, index: number): Date {
  let offsetDays = 0;
  let prevMinutes = -1;
  for (let i = 0; i <= index; i++) {
    const [h, m] = day.entries[i].time.split(':').map(Number);
    const minutes = h * 60 + m;
    if (i > 0 && minutes < prevMinutes) offsetDays += 1;
    prevMinutes = minutes;
  }
  const [h, m] = day.entries[index].time.split(':').map(Number);
  const date = new Date(`${day.date}T00:00:00`);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(h, m, 0, 0);
  return date;
}

type FlatEntry = { dayId: string; entryId: string; category: ProgramCategory; start: number };

/**
 * Determines which day to show by default and which entry is happening now /
 * up next, based on `now`.
 *
 * - `currentEntryId` ("NU"): the entry that has started and not yet been
 *   superseded by the next one — i.e. actually happening right now. Closing
 *   markers (`einde`) never count as "running".
 * - `nextEntryId` ("STRAKS"): the next upcoming entry, but only once it starts
 *   within `STRAKS_LEAD_MS` — so it stays hidden when the festival is still far away.
 * - `dayId`: the day to open on — the active day while live, otherwise the first
 *   day (before the festival) or the last day (after it).
 */
export function getProgramLiveStatus(days: ProgramDay[], now: Date = new Date()): ProgramLiveStatus {
  if (days.length === 0) {
    return { dayId: '', currentEntryId: null, nextEntryId: null, upcomingEntryId: null };
  }

  const flat: FlatEntry[] = [];
  for (const day of days) {
    day.entries.forEach((entry, index) => {
      flat.push({
        dayId: day.id,
        entryId: entry.id,
        category: entry.category,
        start: entryDateTime(day, index).getTime(),
      });
    });
  }
  flat.sort((a, b) => a.start - b.start);

  const t = now.getTime();
  let currentIndex = -1;
  for (let i = 0; i < flat.length; i++) {
    if (flat[i].start <= t) currentIndex = i;
    else break;
  }

  // First entry that hasn't started yet (also covers the pre-festival case).
  const next = flat[currentIndex + 1] ?? null;
  const nextEntryId = next && next.start - t <= STRAKS_LEAD_MS ? next.entryId : null;
  const upcomingEntryId = next?.entryId ?? null;

  // Before the festival: nothing is running yet.
  if (currentIndex === -1) {
    return { dayId: days[0].id, currentEntryId: null, nextEntryId, upcomingEntryId };
  }

  const current = flat[currentIndex];
  const currentEnd = next ? next.start : current.start + LAST_ENTRY_WINDOW_MS;
  const isRunning = t < currentEnd && current.category !== 'einde';

  return {
    dayId: current.dayId,
    currentEntryId: isRunning ? current.entryId : null,
    nextEntryId,
    upcomingEntryId,
  };
}

/** Resolves an entry id to its day + entry, or null if it no longer exists. */
export function findProgramEntry(
  days: ProgramDay[],
  entryId: string,
): { day: ProgramDay; entry: ProgramEntry } | null {
  for (const day of days) {
    const entry = day.entries.find((candidate) => candidate.id === entryId);
    if (entry) return { day, entry };
  }
  return null;
}

/** Local calendar date as 'YYYY-MM-DD', matching `ProgramDay.date`. */
export function toLocalYmd(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Convenience: the day the selector should open on for the given moment. */
export function getDefaultDayId(days: ProgramDay[], now: Date = new Date()): string {
  return getProgramLiveStatus(days, now).dayId;
}
