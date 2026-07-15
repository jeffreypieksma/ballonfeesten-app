import type { ProgramDay } from '@/types/program';

/**
 * Full Friese Ballonfeesten 2026 programme (Wed 15 – Sun 19 July).
 * Source order is preserved; entries listed at 00:00 / 01:00 / 01:30 belong to
 * the festival day they are printed under, even though the clock has passed midnight.
 *
 * This is the local data source consumed by `getProgram()` in `@/lib/program`.
 * Replacing that function's internals with a DB/API call keeps this file's shape.
 */
export const programDays: ProgramDay[] = [
  {
    id: '2026-07-15',
    date: '2026-07-15',
    weekday: 'Woensdag',
    label: 'Woensdag 15 juli',
    shortLabel: 'Wo 15',
    entries: [
      { id: '2026-07-15-1600-terrein', time: '16:00', title: 'Terrein en kermis open', category: 'terrein' },
      {
        id: '2026-07-15-1645-defile',
        time: '16:45',
        title: 'Start defilé van de deelnemende ballonteams vanaf McDonalds Joure richting de Midstraat',
        category: 'defile',
      },
      { id: '2026-07-15-1700-defile', time: '17:00', title: 'Defilé ballonteams door de Midstraat', category: 'defile' },
      {
        id: '2026-07-15-1830-opening',
        time: '18:30',
        title: 'Opening van de Ballonfeesten door burgemeester Leo Pieter Stoel van De Fryske Marren, met oprijden ballonteams',
        category: 'opening',
      },
      { id: '2026-07-15-1845-stuntshow', time: '18:45', title: 'Stuntvliegshow boven terrein', category: 'stuntshow' },
      {
        id: '2026-07-15-1900-ballonvaart',
        time: '19:00',
        title: 'Start van (max.) 40 heteluchtballonnen en special shapes',
        category: 'ballonvaart',
      },
      {
        id: '2026-07-15-2100-inloop',
        time: '21:00',
        title: 'Ballonterrein open voor inloop-ballonnen en miniatuur-ballonnen',
        category: 'inloop',
      },
      { id: '2026-07-15-0000-einde', time: '00:00', title: 'Einde', category: 'einde' },
    ],
  },
  {
    id: '2026-07-16',
    date: '2026-07-16',
    weekday: 'Donderdag',
    label: 'Donderdag 16 juli',
    shortLabel: 'Do 16',
    entries: [
      { id: '2026-07-16-1600-terrein', time: '16:00', title: 'Terrein en kermis open', category: 'terrein' },
      {
        id: '2026-07-16-1830-ballonvaart',
        time: '18:30',
        title: 'Start van (max.) 40 heteluchtballonnen en special shapes',
        category: 'ballonvaart',
      },
      { id: '2026-07-16-2030-muziek', time: '20:30', title: 'Muziekplein met Pubquiz XL', category: 'muziek' },
      {
        id: '2026-07-16-2100-inloop',
        time: '21:00',
        title: 'Ballonterrein open voor inloop-ballonnen en miniatuur-ballonnen',
        category: 'inloop',
      },
      { id: '2026-07-16-0000-einde', time: '00:00', title: 'Einde', category: 'einde' },
    ],
  },
  {
    id: '2026-07-17',
    date: '2026-07-17',
    weekday: 'Vrijdag',
    label: 'Vrijdag 17 juli',
    shortLabel: 'Vr 17',
    entries: [
      { id: '2026-07-17-0600-ballonvaart', time: '06:00', title: 'Ochtendvaart', category: 'ballonvaart' },
      { id: '2026-07-17-1600-terrein', time: '16:00', title: 'Terrein en kermis open', category: 'terrein' },
      {
        id: '2026-07-17-1830-ballonvaart',
        time: '18:30',
        title: 'Start van (max.) 40 heteluchtballonnen en special shapes',
        category: 'ballonvaart',
      },
      { id: '2026-07-17-2030-muziek', time: '20:30', title: 'Muziekplein met optreden van Spaltenbridge', category: 'muziek' },
      {
        id: '2026-07-17-2100-inloop',
        time: '21:00',
        title: 'Ballonterrein open voor inloop-ballonnen en miniatuur-ballonnen',
        category: 'inloop',
      },
      { id: '2026-07-17-2145-muziek', time: '21:45', title: 'Muziekplein met optreden van Rondje Doe Maar', category: 'muziek' },
      { id: '2026-07-17-2300-nightglow', time: '23:00', title: 'Night Glow met heteluchtballonnen', category: 'nightglow' },
      { id: '2026-07-17-2315-muziek', time: '23:15', title: 'Muziekplein met optreden van The Fortunate Sons', category: 'muziek' },
      { id: '2026-07-17-0100-einde', time: '01:00', title: 'Einde', category: 'einde' },
    ],
  },
  {
    id: '2026-07-18',
    date: '2026-07-18',
    weekday: 'Zaterdag',
    label: 'Zaterdag 18 juli',
    shortLabel: 'Za 18',
    entries: [
      { id: '2026-07-18-0600-ballonvaart', time: '06:00', title: 'Ochtendvaart', category: 'ballonvaart' },
      { id: '2026-07-18-1300-terrein', time: '13:00', title: 'Terrein en kermis open', category: 'terrein' },
      { id: '2026-07-18-1300-oldtimers', time: '13:00', title: 'Start oldtimershow', category: 'oldtimers' },
      { id: '2026-07-18-1700-oldtimers', time: '17:00', title: 'Einde oldtimershow', category: 'oldtimers' },
      {
        id: '2026-07-18-1830-ballonvaart',
        time: '18:30',
        title: 'Start van (max.) 40 heteluchtballonnen en special shapes',
        category: 'ballonvaart',
      },
      { id: '2026-07-18-2030-muziek', time: '20:30', title: 'Muziekplein met optreden van Vluchtheuvel', category: 'muziek' },
      {
        id: '2026-07-18-2100-inloop',
        time: '21:00',
        title: 'Ballonterrein open voor inloop-ballonnen en miniatuur-ballonnen',
        category: 'inloop',
      },
      { id: '2026-07-18-2130-muziek', time: '21:30', title: 'Muziekplein met optreden van Feest DJ Sipke', category: 'muziek' },
      { id: '2026-07-18-2200-muziek', time: '22:00', title: 'Muziekplein met optreden van Vangrail', category: 'muziek' },
      { id: '2026-07-18-2300-nightglow', time: '23:00', title: 'Night Glow met heteluchtballonnen', category: 'nightglow' },
      { id: '2026-07-18-2315-muziek', time: '23:15', title: 'Muziekplein met optreden van Feest DJ Sipke', category: 'muziek' },
      { id: '2026-07-18-0000-muziek', time: '00:00', title: 'Muziekplein met optreden van Vangrail', category: 'muziek' },
      { id: '2026-07-18-0130-einde', time: '01:30', title: 'Einde', category: 'einde' },
    ],
  },
  {
    id: '2026-07-19',
    date: '2026-07-19',
    weekday: 'Zondag',
    label: 'Zondag 19 juli',
    shortLabel: 'Zo 19',
    entries: [
      { id: '2026-07-19-1300-terrein', time: '13:00', title: 'Terrein en kermis open', category: 'terrein' },
      {
        id: '2026-07-19-1830-ballonvaart',
        time: '18:30',
        title: 'Start van (max.) 40 heteluchtballonnen en special shapes',
        category: 'ballonvaart',
      },
      { id: '2026-07-19-2200-einde', time: '22:00', title: 'Einde', category: 'einde' },
    ],
  },
];
