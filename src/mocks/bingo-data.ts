import type { BingoCard } from '@/types/bingo';

/**
 * Mock Ballonbingo card for Friese Ballonfeesten 2026.
 * Consumed only through `getBingoCard()` in `@/lib/bingo`; a CMS will provide
 * this later. Player progress is keyed by `id`, so shipping a new card id
 * automatically starts everyone on a fresh card.
 *
 * Photos live in assets/balloons/<tile-id>.jpeg and are mapped in the UI layer
 * (`@/components/bingo/balloon-images`) so this data file stays plain data.
 * Tiles without a photo fall back to their emoji.
 */
export const bingoCard: BingoCard = {
  id: 'joure-2026-standaard',
  title: 'Ballonbingo Joure 2026',
  tiles: [
    {
      id: 'poppke',
      name: 'It Poppke',
      category: 'specialShape',
      emoji: '👶',
      funFact: '"Poppe" is Fries voor baby — deze reuzenbaby verliest zijn speen nooit.',
      points: 25,
    },
    {
      id: 'sinneblom',
      name: 'Sinneblom',
      category: 'specialShape',
      emoji: '🌻',
      funFact: 'Een reusachtige zonnebloem met een lach — draait het liefst met de zon mee.',
      points: 25,
    },
    {
      id: 'lieveheersbeestje',
      name: 'Het Lieveheersbeestje',
      category: 'specialShape',
      emoji: '🐞',
      funFact: 'Rood met zwarte stippen. Spotten betekent geluk, zeggen ze in Joure.',
      points: 25,
    },
    {
      id: 'schildpad',
      name: 'De Schildpad',
      category: 'specialShape',
      emoji: '🐢',
      funFact: 'De langzaamste van het veld? Schijn bedriegt — hij vliegt iedereen voorbij.',
      points: 25,
    },
    {
      id: 'lachebek',
      name: 'De Lachebek',
      category: 'specialShape',
      emoji: '😄',
      funFact: 'Lacht altijd — zelfs bij tegenwind. Zwaai maar terug!',
      points: 25,
    },
    {
      id: 'oranje-kater',
      name: 'De Oranje Kater',
      category: 'specialShape',
      emoji: '🐱',
      funFact: 'Deze kater houdt van lasagne én van hoogte.',
      points: 25,
    },
    {
      id: 'rode-vier',
      name: 'De Rode Vier',
      category: 'klassiek',
      emoji: '4️⃣',
      funFact: 'Waarom een 4? Zelfs de piloot weet het niet meer.',
      points: 15,
    },
    {
      id: 'regenboog',
      name: 'De Regenboogreus',
      category: 'kleurrijk',
      emoji: '🌈',
      funFact: 'Blauw, oranje en wit — bij zonsopkomst dubbel zo mooi.',
      points: 15,
    },
    {
      id: 'blauwe-reus',
      name: 'De Blauwe Reus',
      category: 'klassiek',
      emoji: '🎈',
      funFact: 'Blauw-witte banen zover je kunt kijken — de reus van het veld.',
      points: 15,
    },
  ],
};
