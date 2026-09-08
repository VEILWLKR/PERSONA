// ============================================================
// Core Game Types for Persona RPG
// ============================================================

export type StatName =
  | 'strength'
  | 'agility'
  | 'intelligence'
  | 'vitality'
  | 'luck'
  | 'charisma'
  | 'wisdom'
  | 'dexterity'
  | 'endurance'
  | 'perception';

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ChineseZodiac =
  | 'Rat' | 'Ox' | 'Tiger' | 'Rabbit'
  | 'Dragon' | 'Snake' | 'Horse' | 'Goat'
  | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export type ClassTier = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Hidden' | 'Mythical';

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export type Region =
  | 'Aetheria'
  | 'Shadowmere'
  | 'Ironhold'
  | 'Verdantia'
  | 'Crystallis'
  | 'Emberfall'
  | 'Stormhaven'
  | 'Sunkenreach';

export type StoryArc =
  | 'The Chosen Path'
  | 'The Unseen Hand'
  | 'Fallen Rising'
  | 'Harmony Seeker'
  | 'Chaosbringer'
  | 'Warden of Ages'
  | 'Shadowdancer'
  | 'Celestial Voyage';

export interface CharacterStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  luck: number;
  charisma: number;
  wisdom: number;
  dexterity: number;
  endurance: number;
  perception: number;
}

export interface PersonalityProfile {
  aggression: number;
  empathy: number;
  curiosity: number;
  honor: number;
  chaos: number;
  order: number;
  courage: number;
  cunning: number;
  spirituality: number;
  independence: number;
  luck: number;
  intelligence: number;
  agility: number;
  endurance: number;
}

export interface MBTIDimensions {
  ei: number;  // -10 (Introvert) to +10 (Extrovert)
  sn: number;  // -10 (Sensing) to +10 (Intuition)
  tf: number;  // -10 (Thinking) to +10 (Feeling)
  jp: number;  // -10 (Judging) to +10 (Perceiving)
}

export interface ClassDefinition {
  id: string;
  name: string;
  icon?: string;
  playstyle?: string;
  tier: ClassTier;
  description: string;
  lore: string;
  primaryStats: StatName[];
  secondaryStats: StatName[];
  baseStatModifiers: Partial<CharacterStats>;
  passives: PassiveAbility[];
  ultimate: UltimateAbility;
  evolutionPath: string | null;
  restrictions: string[];
  skillTree: SkillNode[];
  startingEquipment: string[];
  loreEntry: string;
}

export interface PassiveAbility {
  name: string;
  description: string;
  trigger: string;
}

export interface UltimateAbility {
  name: string;
  description: string;
  cooldown: number;
  effect: string;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  prerequisites: string[];
  unlocked: boolean;
}

export interface RankDefinition {
  rank: Rank;
  label: string;
  minLevel: number;
  statMultiplier: number;
  description: string;
  color: string;
}

export interface CharacterData {
  id: string;
  name: string;
  appearance: CharacterAppearance;
  level: number;
  exp: number;
  expToNext: number;
  classId: string;
  subclassId: string;
  rank: Rank;
  stats: CharacterStats;
  personality: PersonalityProfile;
  mbti: MBTIType;
  mbtiDimensions: MBTIDimensions;
  zodiac: ZodiacSign | null;
  chineseZodiac: ChineseZodiac | null;
  region: Region;
  storyArc: StoryArc;
  reputation: ReputationState;
  createdAt: number;
  lastPlayed: number;
}

export interface CharacterAppearance {
  skinId?: string;
  eyesId?: string;
  eyebrowsId?: string;
  hairId?: string;
  shirtId?: string;
  pantsId?: string;
  shoesId?: string;
  accessoryId?: string;
  headwearId?: string;
  expressionId?: string;
  direction?: 'down' | 'up' | 'left' | 'right';
  frame?: number;
  gender: 'Male' | 'Female' | 'NonBinary';
  hairStyle: number;
  hairColor: string;
  skinTone: string;
  eyeColor: string;
  faceType: number;
  outfitColor: string;
  accessory?: 'none' | 'glasses' | 'cap' | 'scarf' | 'earrings';
}

export interface ReputationState {
  global: number;
  aetheria: number;
  shadowmere: number;
  ironhold: number;
  verdantia: number;
  crystallis: number;
  emberfall: number;
  stormhaven: number;
  sunkenreach: number;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOption: number;
  answerText: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  category: keyof PersonalityProfile | 'mbti_ei' | 'mbti_sn' | 'mbti_tf' | 'mbti_jp';
  options: {
    text: string;
    values: Record<string, number>;
    mbtiDimension?: string;
    mbtiValue?: number;
  }[];
}

export interface DestinyResult {
  classId: string;
  classCandidates?: string[];
  subclassId: string;
  subclassCandidates?: string[];
  rank: Rank;
  stats: CharacterStats;
  zodiac: ZodiacSign;
  chineseZodiac: ChineseZodiac;
  birthYear: number;
  region: Region;
  storyArc: StoryArc;
  personality: PersonalityProfile;
  mbti: MBTIType;
  mbtiDimensions: MBTIDimensions;
  reputation: ReputationState;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Nightmare';
  autoSave: boolean;
  textSpeed: 'Slow' | 'Normal' | 'Fast';
  theme: 'dark' | 'light';
}

export interface SaveSlot {
  id: string;
  character: CharacterData;
  timestamp: number;
  playTime: number;
}
