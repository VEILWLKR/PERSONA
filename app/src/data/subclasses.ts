import type { PersonalityProfile } from '@/types/game';

export interface SubclassDefinition {
  id: string;
  name: string;
  description: string;
  personalityWeights: Partial<Record<keyof PersonalityProfile, number>>;
}

export const SUBCLASS_DATABASE: SubclassDefinition[] = [
  {
    id: 'vanguard',
    name: 'Vanguard',
    description: 'A resolute frontline specialist who meets every challenge head-on.',
    personalityWeights: { courage: 3, honor: 2, aggression: 2, endurance: 1 },
  },
  {
    id: 'strategist',
    name: 'Strategist',
    description: 'A calculating tactician who turns preparation into victory.',
    personalityWeights: { intelligence: 3, order: 2, cunning: 2, curiosity: 1 },
  },
  {
    id: 'mystic',
    name: 'Mystic',
    description: 'A contemplative adept guided by intuition, spirit, and hidden patterns.',
    personalityWeights: { spirituality: 3, curiosity: 2, empathy: 2, order: 1 },
  },
  {
    id: 'trickster',
    name: 'Trickster',
    description: 'An unpredictable operator who makes opportunity from chaos.',
    personalityWeights: { cunning: 3, chaos: 2, luck: 2, agility: 1 },
  },
  {
    id: 'warden',
    name: 'Warden',
    description: 'A steadfast protector who keeps allies and ideals safe.',
    personalityWeights: { empathy: 3, honor: 2, endurance: 2, order: 1 },
  },
  {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'An independent explorer drawn toward discovery and possibility.',
    personalityWeights: { independence: 3, curiosity: 2, courage: 2, agility: 1 },
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'A persuasive bridge-builder who changes the world through connection.',
    personalityWeights: { empathy: 3, honor: 2, intelligence: 1, curiosity: 1 },
  },
  {
    id: 'reaver',
    name: 'Reaver',
    description: 'A relentless force who converts fierce emotion into momentum.',
    personalityWeights: { aggression: 3, chaos: 2, courage: 2, independence: 1 },
  },
];

export function getSubclassById(id: string): SubclassDefinition | undefined {
  return SUBCLASS_DATABASE.find((subclass) => subclass.id === id);
}
