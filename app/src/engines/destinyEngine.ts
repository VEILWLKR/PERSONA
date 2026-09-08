import type {
  CharacterStats,
  ClassDefinition,
  ClassTier,
  DestinyResult,
  MBTIType,
  StatName,
  PersonalityProfile,
  Rank,
  Region,
  ReputationState,
  StoryArc,
  ZodiacSign,
  ChineseZodiac,
} from '@/types/game';
import { CLASS_DATABASE } from '@/data/classes';
import { SUBCLASS_DATABASE } from '@/data/subclasses';
import { getStatMultiplier, RANKS } from '@/systems/rankSystem';

// Seeded random number generator for reproducibility
function seededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  }
  return () => {
    s = (s * 1103515245 + 12345) | 0;
    return ((s >>> 0) / 4294967295);
  };
}

export interface DestinyInput {
  personality: PersonalityProfile;
  mbti: MBTIType;
  mbtiDimensions: { ei: number; sn: number; tf: number; jp: number };
  zodiac: ZodiacSign | null;
  chineseZodiac: ChineseZodiac | null;
  birthMonth: number;
  birthDay: number;
  birthYear: number;
  favoriteColor: string;
}

export function generateDestiny(input: DestinyInput): DestinyResult {
  // Create a seed from all inputs for reproducible "fate"
  const seedStr = `${input.mbti}-${input.zodiac || 'none'}-${input.chineseZodiac || 'none'}-${input.birthMonth}-${input.birthDay}-${input.birthYear}-${input.favoriteColor}-${JSON.stringify(input.personality)}`;
  const rng = seededRandom(seedStr);

  // Step 1: Determine Class
  const classId = selectClass(input, rng);
  const classDef = CLASS_DATABASE.find(c => c.id === classId)!;

  // Step 2: Determine personality subclass
  const subclassCandidates = getTopSubclassCandidates(input.personality).map((subclass) => subclass.id);
  const subclassId = subclassCandidates[0];

  // Step 3: Determine Rank
  const rank = selectRank(input, rng, classDef.tier);

  // Step 4: Generate Stats
  const stats = generateStats(input.personality, classDef, rank, rng);

  // Step 5: Determine Region
  const region = selectRegion(input, rng);

  // Step 6: Determine Story Arc
  const storyArc = selectStoryArc(input, rng);

  // Step 7: Generate Reputation
  const reputation = generateReputation(input.personality, region);

  return {
    classId,
    classCandidates: getTopClassCandidates(input).map((candidate) => candidate.id),
    subclassId,
    subclassCandidates,
    rank,
    stats,
    zodiac: input.zodiac as ZodiacSign,
    chineseZodiac: input.chineseZodiac as ChineseZodiac,
    birthYear: input.birthYear,
    region,
    storyArc,
    personality: input.personality,
    mbti: input.mbti,
    mbtiDimensions: input.mbtiDimensions,
    reputation,
  };
}

function getAffinityScore(input: DestinyInput, cls: ClassDefinition): number {
  let score = 0;

  for (const stat of cls.primaryStats) {
    score += getStatPersonalityScore(stat, input.personality);
  }
  for (const stat of cls.secondaryStats) {
    score += getStatPersonalityScore(stat, input.personality) * 0.5;
  }

  score += getMBTIClassAffinity(input.mbti, cls) * 3;
  if (input.zodiac) score += getZodiacClassAffinity(input.zodiac, cls) * 2;

  return score;
}

export function getTopClassCandidates(input: DestinyInput): ClassDefinition[] {
  const compatibleClasses = CLASS_DATABASE.filter((cls) => getClassMBTIAffinities(cls).includes(input.mbti));
  const roster = compatibleClasses.length >= 3 ? compatibleClasses : CLASS_DATABASE;

  return roster
    .map((cls, index) => ({ cls, score: getAffinityScore(input, cls), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ cls }) => cls);
}

export function applyClassSelection(result: DestinyResult, classId: string): DestinyResult {
  const classDef = CLASS_DATABASE.find((candidate) => candidate.id === classId);
  if (!classDef) return result;

  const seed = `${classId}-${result.mbti}-${result.rank}-${JSON.stringify(result.personality)}`;
  const stats = generateStats(result.personality, classDef, result.rank, seededRandom(seed));

  return { ...result, classId, stats };
}

function getSubclassAffinityScore(personality: PersonalityProfile, subclass: typeof SUBCLASS_DATABASE[number]): number {
  return Object.entries(subclass.personalityWeights).reduce(
      (total, [trait, weight]) =>
        total + personality[trait as keyof PersonalityProfile] * (weight || 0),
      0,
    );
}

export function getTopSubclassCandidates(personality: PersonalityProfile) {
  return SUBCLASS_DATABASE
    .map((subclass, index) => ({ subclass, score: getSubclassAffinityScore(personality, subclass), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ subclass }) => subclass);
}

export function applySubclassSelection(result: DestinyResult, subclassId: string): DestinyResult {
  const classExists = CLASS_DATABASE.some((classDef) => classDef.id === subclassId);
  const subclassExists = SUBCLASS_DATABASE.some((subclass) => subclass.id === subclassId);
  return classExists || subclassExists ? { ...result, subclassId } : result;
}

function selectClass(input: DestinyInput, rng: () => number): string {
  // Score each class based on personality-MBTI alignment
  const compatibleClasses = CLASS_DATABASE.filter((cls) => getClassMBTIAffinities(cls).includes(input.mbti));
  const roster = compatibleClasses.length ? compatibleClasses : CLASS_DATABASE;
  const scored = roster.map(cls => {
    let score = 0;

    // Primary stat alignment with personality
    for (const stat of cls.primaryStats) {
      score += getStatPersonalityScore(stat, input.personality);
    }
    for (const stat of cls.secondaryStats) {
      score += getStatPersonalityScore(stat, input.personality) * 0.5;
    }

    // MBTI alignment boosts
    score += getMBTIClassAffinity(input.mbti, cls) * 3;

    // Tier weighting — add controlled randomness to tier
    const tierRoll = rng();
    if (cls.tier === 'Mythical' && tierRoll > 0.98) score += 50;
    if (cls.tier === 'Hidden' && tierRoll > 0.95) score += 40;
    if (cls.tier === 'Legendary' && tierRoll > 0.90) score += 30;
    if (cls.tier === 'Epic' && tierRoll > 0.75) score += 20;
    if (cls.tier === 'Rare' && tierRoll > 0.50) score += 10;
    if (cls.tier === 'Common') score += 5;

    // Zodiac affinity
    if (input.zodiac) {
      score += getZodiacClassAffinity(input.zodiac, cls) * 2;
    }

    // Add controlled randomness
    score += rng() * 10;

    return { classId: cls.id, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick from the full roster with weighted random. Every class remains
  // assignable, while personality, MBTI, zodiac, and tier still shape odds.
  const weightedRoster = scored.map((entry) => ({
    ...entry,
    score: Math.max(0.1, entry.score),
  }));
  const totalScore = weightedRoster.reduce((s, c) => s + c.score, 0);
  let roll = rng() * totalScore;

  for (const entry of weightedRoster) {
    roll -= entry.score;
    if (roll <= 0) return entry.classId;
  }

  return weightedRoster[0].classId;
}

function getStatPersonalityScore(stat: string, profile: PersonalityProfile): number {
  const mappings: Record<string, (keyof PersonalityProfile)[]> = {
    strength: ['aggression', 'honor'],
    agility: ['independence', 'curiosity'],
    intelligence: ['curiosity', 'cunning'],
    vitality: ['order', 'empathy'],
    luck: ['chaos', 'curiosity'],
    charisma: ['empathy', 'honor'],
    wisdom: ['spirituality', 'order'],
    dexterity: ['cunning', 'curiosity'],
    endurance: ['order', 'honor'],
    perception: ['curiosity', 'order'],
  };

  const traits = mappings[stat] || [];
  return traits.reduce((sum, t) => sum + (profile[t] || 5), 0) / traits.length;
}

const MBTI_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const MBTI_STAT_PROFILES: Record<MBTIType, Partial<Record<StatName, number>>> = {
  INTJ: { intelligence: 5, wisdom: 4, perception: 3, dexterity: 1 },
  INTP: { intelligence: 5, wisdom: 3, dexterity: 2, luck: 1 },
  ENTJ: { strength: 4, charisma: 4, intelligence: 3, endurance: 2 },
  ENTP: { intelligence: 4, agility: 3, charisma: 3, luck: 2 },
  INFJ: { wisdom: 5, charisma: 3, vitality: 3, perception: 2 },
  INFP: { charisma: 4, wisdom: 4, agility: 3, luck: 2 },
  ENFJ: { charisma: 5, vitality: 3, strength: 2, wisdom: 2 },
  ENFP: { charisma: 4, agility: 4, luck: 3, perception: 2 },
  ISTJ: { endurance: 5, vitality: 4, strength: 3, perception: 2 },
  ISFJ: { vitality: 5, endurance: 4, wisdom: 3, charisma: 2 },
  ESTJ: { strength: 4, endurance: 4, charisma: 3, vitality: 2 },
  ESFJ: { charisma: 5, vitality: 4, luck: 2, endurance: 2 },
  ISTP: { dexterity: 5, agility: 4, perception: 3, strength: 2 },
  ISFP: { agility: 4, dexterity: 4, luck: 3, charisma: 2 },
  ESTP: { strength: 4, agility: 4, luck: 3, charisma: 2 },
  ESFP: { charisma: 4, agility: 4, luck: 4, vitality: 2 },
};

export function getClassMBTIAffinities(cls: ClassDefinition): MBTIType[] {
  return MBTI_TYPES
    .map((mbti, index) => {
      const preferences = MBTI_STAT_PROFILES[mbti];
      const statScore = cls.primaryStats.reduce((sum, stat) => sum + (preferences[stat] || 0) * 2, 0)
        + cls.secondaryStats.reduce((sum, stat) => sum + (preferences[stat] || 0), 0);
      const explicitScore = getMBTIClassAffinity(mbti, cls);
      return { mbti, score: statScore + explicitScore * 2, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ mbti }) => mbti);
}

function getMBTIClassAffinity(mbti: MBTIType, cls: ClassDefinition): number {
  const affinities: Record<string, Record<string, number>> = {
    INTJ: { archmage: 10, chronomancer: 8, oracle: 7, necromancer: 6 },
    INTP: { archmage: 10, alchemist: 8, scholar: 7, elementalist: 6 },
    ENTJ: { dragon_lord: 10, crusader: 8, templar: 7, knight: 6 },
    ENTP: { chaos_avatar: 10, illusionist: 8, warlock: 7, phantom_weaver: 6 },
    INFJ: { saint: 10, druid: 8, shaman: 7, paladin: 6 },
    INFP: { primal_divinity: 10, beastmaster: 8, ranger: 7, bard: 6 },
    ENFJ: { paladin: 10, crusader: 8, dragon_lord: 7, spellsword_paragon: 6 },
    ENFP: { chaos_avatar: 8, bard: 10, beast_lord: 7, spellsword_paragon: 6 },
    ISTJ: { sentinel: 10, knight: 8, runesmith: 7, templar: 6 },
    ISFJ: { defender: 10, cleric: 8, druid: 7, paladin: 6 },
    ESTJ: { crusader: 10, knight: 8, templar: 7, dragoon: 6 },
    ESFJ: { paladin: 10, cleric: 8, bard: 7, spellsword_paragon: 6 },
    ISTP: { demon_hunter: 10, rogue: 8, hunter: 7, saboteur: 6 },
    ISFP: { beastmaster: 10, ranger: 8, soulbeast: 7, bard: 6 },
    ESTP: { dragoon: 10, duelist: 8, pirate: 7, demon_hunter: 6 },
    ESFP: { bard: 10, pirate: 8, beast_lord: 7, entertainer: 6 },
  };

  return affinities[mbti]?.[cls.id] || 0;
}

function getZodiacClassAffinity(zodiac: ZodiacSign, cls: ClassDefinition): number {
  const affinities: Record<string, string[]> = {
    Aries: ['warrior', 'knight', 'dragoon', 'berserker'],
    Taurus: ['sentinel', 'blacksmith', 'farmer', 'juggernaut'],
    Gemini: ['illusionist', 'bard', 'scholar', 'chaos_avatar'],
    Cancer: ['cleric', 'druid', 'paladin', 'world_tree_druid'],
    Leo: ['dragon_lord', 'paladin', 'crusader', 'beast_lord'],
    Virgo: ['alchemist', 'scholar', 'herbalist', 'alchemist'],
    Libra: ['bard', 'duelist', 'templar', 'spellsword_paragon'],
    Scorpio: ['assassin', 'necromancer', 'shadowblade', 'blood_mage'],
    Sagittarius: ['ranger', 'hunter', 'oracle', 'fateseer'],
    Capricorn: ['templar', 'runesmith', 'knight', 'colossus'],
    Aquarius: ['archmage', 'chronomancer', 'voidwalker', 'celestial_ascendant'],
    Pisces: ['shaman', 'druid', 'phantom_weaver', 'creator'],
  };

  return affinities[zodiac]?.includes(cls.id) ? 5 : 0;
}

function selectRank(input: DestinyInput, rng: () => number, tier: ClassTier): Rank {
  // Base rank influenced by tier and personality
  let rankIndex = 0;

  switch (tier) {
    case 'Common': rankIndex = 0; break;
    case 'Rare': rankIndex = 1; break;
    case 'Epic': rankIndex = 2; break;
    case 'Legendary': rankIndex = 3; break;
    case 'Hidden': rankIndex = 4; break;
    case 'Mythical': rankIndex = 5; break;
  }

  // Luck and chaos can modify rank
  if (input.personality.luck > 7) rankIndex += 1;
  if (input.personality.chaos > 7 && rng() > 0.5) rankIndex += 1;
  if (input.personality.order > 7) rankIndex += 0; // Order doesn't boost, it's reliable

  // Add controlled randomness
  const roll = rng();
  if (roll > 0.95) rankIndex += 2;
  else if (roll > 0.85) rankIndex += 1;
  else if (roll < 0.05) rankIndex -= 1;

  // Clamp
  rankIndex = Math.max(0, Math.min(RANKS.length - 1, rankIndex));

  return RANKS[rankIndex];
}

function generateStats(
  personality: PersonalityProfile,
  classDef: ClassDefinition,
  rank: Rank,
  rng: () => number
): CharacterStats {
  const multiplier = getStatMultiplier(rank);

  const baseStats: CharacterStats = {
    strength: 5,
    agility: 5,
    intelligence: 5,
    vitality: 5,
    luck: 5,
    charisma: 5,
    wisdom: 5,
    dexterity: 5,
    endurance: 5,
    perception: 5,
  };

  // Apply class base modifiers
  for (const [key, value] of Object.entries(classDef.baseStatModifiers)) {
    if (key in baseStats && value !== undefined) {
      baseStats[key as keyof CharacterStats] = value;
    }
  }

  // Apply personality influences
  baseStats.strength += Math.floor(personality.aggression * 0.5 + personality.honor * 0.3);
  baseStats.agility += Math.floor(personality.cunning * 0.4 + personality.independence * 0.3);
  baseStats.intelligence += Math.floor(personality.curiosity * 0.5);
  baseStats.vitality += Math.floor((personality.honor + personality.order) * 0.3);
  baseStats.luck += Math.floor(personality.chaos * 0.3);
  baseStats.charisma += Math.floor(personality.empathy * 0.5);
  baseStats.wisdom += Math.floor(personality.spirituality * 0.5 + personality.order * 0.3);
  baseStats.dexterity += Math.floor(personality.cunning * 0.3 + perceptionToDex(personality));
  baseStats.endurance += Math.floor(personality.order * 0.4 + personality.honor * 0.3);
  baseStats.perception += Math.floor(personality.curiosity * 0.3 + personality.spirituality * 0.2);

  // Add controlled variance
  const variance = () => Math.floor(rng() * 4) - 2; // -2 to +1
  for (const key of Object.keys(baseStats) as (keyof CharacterStats)[]) {
    baseStats[key] += variance();
    baseStats[key] = Math.max(1, baseStats[key]);
  }

  // Apply rank multiplier
  for (const key of Object.keys(baseStats) as (keyof CharacterStats)[]) {
    baseStats[key] = Math.round(baseStats[key] * multiplier);
  }

  return baseStats;
}

function perceptionToDex(profile: PersonalityProfile): number {
  // Map perception-like traits to dexterity
  return Math.floor((profile.cunning + profile.curiosity) * 0.15);
}

function selectRegion(input: DestinyInput, rng: () => number): Region {
  const regions: Region[] = ['Aetheria', 'Shadowmere', 'Ironhold', 'Verdantia', 'Crystallis', 'Emberfall', 'Stormhaven', 'Sunkenreach'];

  // Personality influences region
  const weights = regions.map(r => getRegionAffinity(r, input.personality));
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  let roll = rng() * totalWeight;
  for (let i = 0; i < regions.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return regions[i];
  }

  return regions[Math.floor(rng() * regions.length)];
}

function getRegionAffinity(region: Region, profile: PersonalityProfile): number {
  const affinities: Record<string, number> = {
    Aetheria: profile.spirituality * 2 + profile.order,
    Shadowmere: profile.cunning * 2 + profile.chaos,
    Ironhold: profile.order * 2 + profile.honor,
    Verdantia: profile.empathy * 2 + profile.spirituality,
    Crystallis: profile.curiosity * 2 + profile.cunning,
    Emberfall: profile.aggression * 2 + profile.honor,
    Stormhaven: profile.independence * 2 + profile.chaos,
    Sunkenreach: profile.cunning * 2 + profile.curiosity,
  };

  return affinities[region] || 5;
}

function selectStoryArc(input: DestinyInput, rng: () => number): StoryArc {
  const arcs: StoryArc[] = [
    'The Chosen Path',
    'The Unseen Hand',
    'Fallen Rising',
    'Harmony Seeker',
    'Chaosbringer',
    'Warden of Ages',
    'Shadowdancer',
    'Celestial Voyage',
  ];

  const weights = arcs.map(a => getArcAffinity(a, input.personality));
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  let roll = rng() * totalWeight;
  for (let i = 0; i < arcs.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return arcs[i];
  }

  return arcs[Math.floor(rng() * arcs.length)];
}

function getArcAffinity(arc: StoryArc, profile: PersonalityProfile): number {
  const affinities: Record<string, number> = {
    'The Chosen Path': profile.honor + profile.order + profile.spirituality,
    'The Unseen Hand': profile.cunning + profile.chaos + profile.independence,
    'Fallen Rising': profile.aggression + profile.courage + profile.chaos,
    'Harmony Seeker': profile.empathy + profile.spirituality + profile.order,
    'Chaosbringer': profile.chaos + profile.aggression + profile.independence,
    'Warden of Ages': profile.order + profile.honor + profile.courage,
    'Shadowdancer': profile.cunning + profile.agility + profile.independence,
    'Celestial Voyage': profile.curiosity + profile.spirituality + profile.luck,
  };

  return affinities[arc] || 5;
}

function generateReputation(
  profile: PersonalityProfile,
  homeRegion: Region
): ReputationState {
  const base = 0;
  const regions: (keyof ReputationState)[] = ['aetheria', 'shadowmere', 'ironhold', 'verdantia', 'crystallis', 'emberfall', 'stormhaven', 'sunkenreach'];

  const rep: ReputationState = {
    global: base,
    aetheria: base,
    shadowmere: base,
    ironhold: base,
    verdantia: base,
    crystallis: base,
    emberfall: base,
    stormhaven: base,
    sunkenreach: base,
  };

  // Home region gets bonus
  const homeKey = homeRegion.toLowerCase() as keyof ReputationState;
  rep[homeKey] = 10;

  // Personality affects starting reputation
  if (profile.honor > 7) rep.global += 5;
  if (profile.empathy > 7) {
    regions.forEach(r => { rep[r] += 3; });
  }
  if (profile.chaos > 7) {
    regions.forEach(r => { rep[r] -= 2; });
  }

  return rep;
}

// Utility to get tier color
export function getTierColor(tier: ClassTier): string {
  const colors: Record<ClassTier, string> = {
    Common: '#9CA3AF',
    Rare: '#6EE7B7',
    Epic: '#60A5FA',
    Legendary: '#FBBF24',
    Hidden: '#A78BFA',
    Mythical: '#EF4444',
  };
  return colors[tier];
}

export function getTierGlow(tier: ClassTier): string {
  const glows: Record<ClassTier, string> = {
    Common: '0 0 10px rgba(156,163,175,0.3)',
    Rare: '0 0 20px rgba(110,231,183,0.4)',
    Epic: '0 0 25px rgba(96,165,250,0.5)',
    Legendary: '0 0 30px rgba(251,191,36,0.6)',
    Hidden: '0 0 35px rgba(167,139,250,0.6)',
    Mythical: '0 0 40px rgba(239,68,68,0.7)',
  };
  return glows[tier];
}
