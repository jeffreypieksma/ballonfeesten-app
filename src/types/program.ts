/**
 * Types for the multi-day festival programme (Friese Ballonfeesten).
 * The shape is deliberately backend-agnostic: `getProgram()` in
 * `@/lib/program` returns `ProgramDay[]` today from local mock data and can
 * later return the same shape from a database/API without UI changes.
 */

export type ProgramCategory =
  | 'terrein'
  | 'defile'
  | 'opening'
  | 'ballonvaart'
  | 'stuntshow'
  | 'muziek'
  | 'nightglow'
  | 'oldtimers'
  | 'inloop'
  | 'einde'
  | 'overig';

export type ProgramEntry = {
  /** Stable id, e.g. '2026-07-15-1600-terrein'. */
  id: string;
  /** Clock time as shown, 'HH:MM'. Entries at 00:00/01:30 belong to the same festival day. */
  time: string;
  title: string;
  category: ProgramCategory;
};

export type ProgramDay = {
  /** ISO date of the festival day the block belongs to, e.g. '2026-07-15'. */
  id: string;
  date: string;
  /** Dutch weekday, e.g. 'Woensdag'. */
  weekday: string;
  /** Full label, e.g. 'Woensdag 15 juli'. */
  label: string;
  /** Compact label for the day selector, e.g. 'Wo 15'. */
  shortLabel: string;
  /** Entries in source (chronological) order. */
  entries: ProgramEntry[];
};
