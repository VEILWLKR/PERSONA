import type { AssessmentAnswer, MBTIDimensions, MBTIType, PersonalityProfile } from '@/types/game';
import { ASSESSMENT_QUESTIONS } from '@/data/questions';

const DEFAULT_PROFILE: PersonalityProfile = {
  aggression: 5,
  empathy: 5,
  curiosity: 5,
  honor: 5,
  chaos: 5,
  order: 5,
  courage: 5,
  cunning: 5,
  spirituality: 5,
  independence: 5,
  luck: 5,
  intelligence: 5,
  agility: 5,
  endurance: 5,
};

const DEFAULT_MBTI: MBTIDimensions = {
  ei: 0,
  sn: 0,
  tf: 0,
  jp: 0,
};

export function computePersonality(answers: AssessmentAnswer[]): {
  profile: PersonalityProfile;
  mbti: MBTIType;
  mbtiDimensions: MBTIDimensions;
} {
  const profile = { ...DEFAULT_PROFILE };
  const mbtiDims = { ...DEFAULT_MBTI };

  for (const answer of answers) {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === answer.questionId);
    if (!question) continue;

    const selectedOption = question.options[answer.selectedOption];
    if (!selectedOption) continue;

    // Apply personality values
    for (const [key, value] of Object.entries(selectedOption.values)) {
      if (key in profile) {
        const k = key as keyof PersonalityProfile;
        profile[k] = Math.max(0, Math.min(10, profile[k] + value));
      }
    }

    // Apply MBTI dimensions
    if (selectedOption.mbtiDimension && selectedOption.mbtiValue !== undefined) {
      const dim = selectedOption.mbtiDimension as keyof MBTIDimensions;
      mbtiDims[dim] += selectedOption.mbtiValue;
      // Clamp to -10 to +10
      mbtiDims[dim] = Math.max(-10, Math.min(10, mbtiDims[dim]));
    }
  }

  // Derive MBTI type from dimensions
  const mbti = deriveMBTI(mbtiDims);

  return { profile, mbti, mbtiDimensions: mbtiDims };
}

function deriveMBTI(dims: MBTIDimensions): MBTIType {
  const e = dims.ei > 0 ? 'E' : 'I';
  const s = dims.sn > 0 ? 'N' : 'S';
  const t = dims.tf > 0 ? 'F' : 'T';
  const j = dims.jp > 0 ? 'J' : 'P';
  return `${e}${s}${t}${j}` as MBTIType;
}

export function getMBTIDescription(type: MBTIType): string {
  const descriptions: Record<MBTIType, string> = {
    INTJ: 'The Architect — Strategic, independent, and visionary. You see patterns where others see chaos.',
    INTP: 'The Logician — Analytical, curious, and inventive. You seek to understand the universe.',
    ENTJ: 'The Commander — Bold, strategic, and charismatic. You were born to lead.',
    ENTP: 'The Debater — Clever, innovative, and unconventional. You challenge the status quo.',
    INFJ: 'The Advocate — Insightful, compassionate, and determined. You fight for what matters.',
    INFP: 'The Mediator — Idealistic, empathetic, and creative. You seek harmony and meaning.',
    ENFJ: 'The Protagonist — Charismatic, inspiring, and altruistic. You bring out the best in others.',
    ENFP: 'The Campaigner — Enthusiastic, creative, and free-spirited. You see endless possibilities.',
    ISTJ: 'The Logistician — Practical, reliable, and dutiful. You uphold traditions and order.',
    ISFJ: 'The Defender — Warm, protective, and meticulous. You guard those you love.',
    ESTJ: 'The Executive — Efficient, organized, and commanding. You get things done.',
    ESFJ: 'The Consul — Caring, social, and supportive. You build strong communities.',
    ISTP: 'The Virtuoso — Observant, practical, and adventurous. You master tools and techniques.',
    ISFP: 'The Adventurer — Flexible, artistic, and sensitive. You live in the moment.',
    ESTP: 'The Entrepreneur — Energetic, perceptive, and bold. You thrive on action and risk.',
    ESFP: 'The Entertainer — Spontaneous, enthusiastic, and social. You bring joy everywhere.',
  };
  return descriptions[type] || 'A unique personality that defies categorization.';
}

export function getPersonalityArchetype(profile: PersonalityProfile): string {
  const scores = Object.entries(profile).map(([trait, value]) => ({
    trait,
    // Personality starts at five, so compare the player's choices against
    // that neutral baseline instead of letting the first tied trait win.
    score: value - 5,
  }));

  const highestScore = Math.max(...scores.map(({ score }) => score));
  if (highestScore <= 0) return 'The Enigma';

  const contenders = scores.filter(({ score }) => highestScore - score <= 0.5);
  const top = contenders
    .sort((a, b) => b.score - a.score || b.trait.localeCompare(a.trait))[0].trait;
  const second = scores
    .filter(({ trait }) => trait !== top)
    .sort((a, b) => b.score - a.score || b.trait.localeCompare(a.trait))[0]?.trait;

  const archetypes: Record<string, string> = {
    aggression: 'The Conqueror',
    empathy: 'The Empath',
    curiosity: 'The Seeker',
    honor: 'The Paragon',
    chaos: 'The Wildcard',
    order: 'The Strategist',
    courage: 'The Hero',
    cunning: 'The Schemer',
    spirituality: 'The Mystic',
    independence: 'The Lone Wolf',
    intelligence: 'The Sage',
    agility: 'The Wanderer',
    endurance: 'The Bastion',
    luck: 'The Fortunate',
  };

  // Special combinations
  if (top === 'aggression' && second === 'honor') return 'The Crusader';
  if (top === 'cunning' && second === 'chaos') return 'The Trickster';
  if (top === 'empathy' && second === 'spirituality') return 'The Saint';
  if (top === 'curiosity' && second === 'cunning') return 'The Scholar-Rogue';
  if (top === 'order' && second === 'honor') return 'The Lawbringer';
  if (top === 'courage' && second === 'independence') return 'The Maverick';

  return archetypes[top] || 'The Enigma';
}
