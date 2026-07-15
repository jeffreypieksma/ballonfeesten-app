/**
 * Types for the Ballonbingo game.
 *
 * Two strictly separated concerns:
 * - The card DEFINITION (`BingoCard`) — owned by the CMS later; served through
 *   the `getBingoCard()` seam in `@/lib/bingo`.
 * - The player's PROGRESS — a locally stored set of spotted tile ids, keyed by
 *   `card.id` (see `@/lib/bingo-storage`), so a new CMS card starts fresh.
 */

export type BingoCategory = 'specialShape' | 'kleurrijk' | 'klassiek' | 'nightglow';

export type BingoTile = {
  /** Stable id, e.g. 'sinneblom'. Progress is stored as a set of these ids. */
  id: string;
  /** Display name, e.g. 'De Fryske Hûn'. */
  name: string;
  category: BingoCategory;
  /** Emoji placeholder until the CMS provides imagery. */
  emoji: string;
  funFact?: string;
  points?: number;
};

export type BingoCard = {
  /** Stable card id, e.g. 'joure-2026-standaard'. Progress is keyed by this. */
  id: string;
  title: string;
  /** Festival edition, e.g. 2026. The card with the highest year is active. */
  year: number;
  /** Exactly 9 tiles in row-major order (indexes 0..8). */
  tiles: BingoTile[];
};

export type BingoLineKind = 'row' | 'column' | 'diagonal';

export type BingoLine = {
  /** 'row-0' | 'col-2' | 'diag-main' | 'diag-anti' */
  id: string;
  kind: BingoLineKind;
  /** Row-major tile indexes into `card.tiles`. */
  indexes: [number, number, number];
};
