import { getBingoCard } from '@/lib/bingo';
import type { BingoTile } from '@/types/bingo';

/**
 * The festival balloon catalogue. Today it equals the bingo-card tiles (one
 * source of truth — same ids, photos and category metadata). When the API/CMS
 * lands, replace only this function's body (e.g.
 * `fetch(process.env.EXPO_PUBLIC_API_URL + '/balloons')`) — the `Balloon`
 * shape stays the same, so neither this screen nor the bingo changes.
 */
export type Balloon = BingoTile;

export async function getBalloons(): Promise<Balloon[]> {
  return (await getBingoCard()).tiles;
}
