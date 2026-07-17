import type { Rank, RankDefinition } from '@/types/game';

export const RANKS: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export const RANK_DEFINITIONS: Record<Rank, RankDefinition> = {
  E: {
    rank: 'E',
    label: 'Novice',
    minLevel: 1,
    statMultiplier: 1.0,
    description: 'A fledgling adventurer taking their first steps into a vast world.',
    color: '#9CA3AF',
  },
  D: {
    rank: 'D',
    label: 'Apprentice',
    minLevel: 5,
    statMultiplier: 1.15,
    description: 'Basic competence earned through early trials.',
    color: '#6EE7B7',
  },
  C: {
    rank: 'C',
    label: 'Adept',
    minLevel: 15,
    statMultiplier: 1.35,
    description: 'Proven capability recognized by peers and guilds.',
    color: '#60A5FA',
  },
  B: {
    rank: 'B',
    label: 'Veteran',
    minLevel: 30,
    statMultiplier: 1.6,
    description: 'Battle-hardened expertise forged in fire.',
    color: '#818CF8',
  },
  A: {
    rank: 'A',
    label: 'Elite',
    minLevel: 50,
    statMultiplier: 2.0,
    description: 'Among the finest warriors in the realm.',
    color: '#A78BFA',
  },
  S: {
    rank: 'S',
    label: 'Hero',
    minLevel: 70,
    statMultiplier: 2.5,
    description: 'A legend in the making, spoken of in taverns.',
    color: '#FBBF24',
  },
  SS: {
    rank: 'SS',
    label: 'Champion',
    minLevel: 85,
    statMultiplier: 3.2,
    description: 'A force that shapes the destiny of kingdoms.',
    color: '#F97316',
  },
  SSS: {
    rank: 'SSS',
    label: 'Mythic',
    minLevel: 100,
    statMultiplier: 4.0,
    description: 'Transcendent power that echoes through eternity.',
    color: '#EF4444',
  },
};

export function getRankFromLevel(level: number): Rank {
  if (level >= 100) return 'SSS';
  if (level >= 85) return 'SS';
  if (level >= 70) return 'S';
  if (level >= 50) return 'A';
  if (level >= 30) return 'B';
  if (level >= 15) return 'C';
  if (level >= 5) return 'D';
  return 'E';
}

export function getRankColor(rank: Rank): string {
  return RANK_DEFINITIONS[rank].color;
}

export function getNextRank(rank: Rank): Rank | null {
  const idx = RANKS.indexOf(rank);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

export function getStatMultiplier(rank: Rank): number {
  return RANK_DEFINITIONS[rank].statMultiplier;
}
