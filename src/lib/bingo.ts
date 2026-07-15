import { seedDemoArchiveSpots } from '@/lib/bingo-storage';
import { bingoCard2025Demo, bingoCards, demoArchiveSpots2025 } from '@/mocks/bingo-data';
import type { AppThemeColor } from '@/constants/theme';
import type { BingoCard, BingoCategory, BingoLine } from '@/types/bingo';

/**
 * Backend-agnostic data source for the bingo cards (one per festival edition).
 *
 * Today it returns local mock cards. When the CMS lands, replace only these
 * function bodies — the `BingoCard` shape stays the same, so no UI changes.
 * Player progress is stored separately (see `@/lib/bingo-storage`) keyed by
 * `card.id`, so a new CMS card automatically starts with fresh progress.
 */
export async function getBingoCards(): Promise<BingoCard[]> {
  // DEMO — dev-only: geef de 2025-demokaart wat voorbeeldstempels zodat het
  // jaararchief iets toont. Verdwijnt samen met de demokaart zodra het CMS
  // echte edities levert.
  await seedDemoArchiveSpots(bingoCard2025Demo.id, demoArchiveSpots2025);
  return [...bingoCards].sort((a, b) => b.year - a.year);
}

/** The active card: the edition with the highest year. Bingo and the balloon catalogue play on this one. */
export async function getBingoCard(): Promise<BingoCard> {
  const cards = await getBingoCards();
  return cards[0];
}

type CategoryMeta = {
  label: string;
  emoji: string;
  colorRole: AppThemeColor;
};

const CATEGORY_META: Record<BingoCategory, CategoryMeta> = {
  specialShape: { label: 'Special Shape', emoji: '⭐', colorRole: 'gold' },
  kleurrijk: { label: 'Kleurrijk', emoji: '🌈', colorRole: 'balloonPurple' },
  klassiek: { label: 'Klassiek', emoji: '🎈', colorRole: 'primary' },
  nightglow: { label: 'Night Glow', emoji: '🌌', colorRole: 'secondary' },
};

export function categoryMeta(category: BingoCategory): CategoryMeta {
  return CATEGORY_META[category];
}

/** All 8 winnable lines on a 3×3 card (row-major tile indexes). */
export const BINGO_LINES: BingoLine[] = [
  { id: 'row-0', kind: 'row', indexes: [0, 1, 2] },
  { id: 'row-1', kind: 'row', indexes: [3, 4, 5] },
  { id: 'row-2', kind: 'row', indexes: [6, 7, 8] },
  { id: 'col-0', kind: 'column', indexes: [0, 3, 6] },
  { id: 'col-1', kind: 'column', indexes: [1, 4, 7] },
  { id: 'col-2', kind: 'column', indexes: [2, 5, 8] },
  { id: 'diag-main', kind: 'diagonal', indexes: [0, 4, 8] },
  { id: 'diag-anti', kind: 'diagonal', indexes: [2, 4, 6] },
];

/** Lines whose three tiles are all spotted. Ids not on the card are ignored. */
export function getCompletedLines(card: BingoCard, spottedIds: readonly string[]): BingoLine[] {
  const spotted = new Set(spottedIds);
  return BINGO_LINES.filter((line) =>
    line.indexes.every((index) => {
      const tile = card.tiles[index];
      return tile != null && spotted.has(tile.id);
    })
  );
}

export function isCardComplete(card: BingoCard, spottedIds: readonly string[]): boolean {
  const spotted = new Set(spottedIds);
  return card.tiles.length > 0 && card.tiles.every((tile) => spotted.has(tile.id));
}

/** Lines present in `after` but not in `before` (diffed by line id). */
export function getNewlyCompletedLines(before: BingoLine[], after: BingoLine[]): BingoLine[] {
  const seen = new Set(before.map((line) => line.id));
  return after.filter((line) => !seen.has(line.id));
}

/** The `{found,total}` shape the home hero (`BingoProgress`) consumes. */
export function getBingoSummary(
  card: BingoCard,
  spottedIds: readonly string[]
): { found: number; total: number } {
  const spotted = new Set(spottedIds);
  return {
    found: card.tiles.filter((tile) => spotted.has(tile.id)).length,
    total: card.tiles.length,
  };
}
