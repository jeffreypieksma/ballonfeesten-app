export type HomeScreenStateKey =
  | 'new'
  | 'active'
  | 'rowCompleted'
  | 'noProgram'
  | 'offline'
  | 'cancelled'
  | 'loading'
  | 'error';

export type BingoProgress = {
  found: number;
  total: number;
};

export type EventStatusKind =
  | 'expected'
  | 'buildingUp'
  | 'inTheAir'
  | 'decisionPending'
  | 'eveningProgram'
  | 'cancelled'
  | 'alternative';

export type EventStatus = {
  kind: EventStatusKind;
  title: string;
  nextUpdateLabel: string;
};

export type Mission = {
  title: string;
  hint: string;
  points: number;
  progressLabel: string;
};

export type PassportStamp = {
  label: string;
  category: string;
  points: number;
  date: string;
};

export type BalloonCollection = {
  count: number;
  total: number;
};

export type ProgramItem = {
  time: string;
  title: string;
  location: string;
  category: string;
  bingoTieIn?: string;
};

export type LevelProgress = {
  levelName: string;
  score: number;
  nextLevelThreshold: number;
  nextLevelName: string;
  lastBadge: string;
};

export type FeaturedBalloon = {
  name: string;
  category: string;
  funFact: string;
  points: number;
  spotted: boolean;
};

export type Sponsor = {
  name: string;
  missionLabel: string;
};

export type HomeMockData = {
  nickname: string;
  level: LevelProgress;
  bingo: BingoProgress;
  lastBalloon: string;
  lastStamp: PassportStamp;
  collection: BalloonCollection;
  eventStatus: EventStatus;
  recommendedMission: Mission;
  program: ProgramItem[];
  featuredBalloon: FeaturedBalloon;
  sponsor: Sponsor;
};
