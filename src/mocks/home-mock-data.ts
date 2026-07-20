import type { HomeMockData, HomeScreenStateKey } from '@/types/home';

const base: HomeMockData = {
  nickname: 'Luchtverkenner',
  level: {
    levelName: 'Luchtverkenner',
    score: 340,
    nextLevelThreshold: 500,
    nextLevelName: 'Ballonkenner',
    lastBadge: 'Vroege Vogel',
  },
  bingo: { found: 4, total: 9 },
  lastBalloon: 'De Fryske Hûn',
  lastStamp: {
    label: 'De Fryske Hûn',
    category: 'Special Shape',
    points: 25,
    date: 'Vandaag',
  },
  collection: { count: 12, total: 24 },
  eventStatus: {
    kind: 'expected',
    title: 'Ballonvaart verwacht om 19:30',
    nextUpdateLabel: 'Nieuwe weersbeslissing om 17:00',
  },
  recommendedMission: {
    title: 'Spot een ballon met drie kleuren',
    hint: 'Kijk goed rond boven Joure — een driekleurige ballon telt dubbel.',
    points: 15,
    progressLabel: 'Nog niet gestart',
  },
  featuredBalloon: {
    name: 'De Fryske Hûn',
    category: 'Special Shape',
    funFact: 'Deze ballon is vernoemd naar de Friese hond en is 35 meter hoog.',
    points: 25,
    spotted: true,
  },
  sponsor: {
    name: 'Bakkerij Van der Wal',
    missionLabel: 'Missie mogelijk gemaakt door Bakkerij Van der Wal',
  },
};

export const mockDataByState: Record<HomeScreenStateKey, HomeMockData> = {
  new: {
    ...base,
    level: { ...base.level, score: 0, lastBadge: '' },
    bingo: { found: 0, total: 9 },
    collection: { count: 0, total: 24 },
  },
  active: base,
  rowCompleted: {
    ...base,
    bingo: { found: 9, total: 9 },
    level: { ...base.level, score: 365 },
    lastStamp: { ...base.lastStamp, label: 'De Fryske Hûn', points: 25, date: 'Zojuist' },
  },
  noProgram: base,
  offline: base,
  cancelled: {
    ...base,
    eventStatus: {
      kind: 'cancelled',
      title: 'Ballonvaart gaat vandaag niet door',
      nextUpdateLabel: 'Alternatief programma actief',
    },
  },
  loading: base,
  error: base,
};

export const homeMockData = base;
