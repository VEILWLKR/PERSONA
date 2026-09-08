import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { generateDestiny } from '@/engines/destinyEngine';
import { computePersonality } from '@/engines/personalityEngine';
import { calculateChineseZodiac, calculateZodiac } from '@/engines/zodiacEngine';
import type { CharacterAppearance } from '@/types/game';

const DEFAULT_APPEARANCE: CharacterAppearance = {
  gender: 'NonBinary',
  hairStyle: 0,
  hairColor: '#DAA520',
  skinTone: '#EAC086',
  eyeColor: '#4682B4',
  faceType: 1,
  outfitColor: '#4a2c2a',
};

const TODAY = new Date().toISOString().split('T')[0];

export function CreationScreen() {
  const { assessmentAnswers, setDestinyResult, setPendingCharacter, setScreen } = useGameStore();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleGenerateDestiny = () => {
    const parsedDate = new Date(`${birthDate}T00:00:00`);
    if (!birthDate || Number.isNaN(parsedDate.getTime())) return;

    const { profile, mbti, mbtiDimensions } = computePersonality(assessmentAnswers);
    const birthMonth = parsedDate.getMonth() + 1;
    const birthDay = parsedDate.getDate();
    const birthYear = parsedDate.getFullYear();
    const destiny = generateDestiny({
      personality: profile,
      mbti,
      mbtiDimensions,
      zodiac: calculateZodiac(birthMonth, birthDay),
      chineseZodiac: calculateChineseZodiac(birthYear),
      birthMonth,
      birthDay,
      birthYear,
      favoriteColor: 'blue',
    });

    setDestinyResult(destiny);
    setPendingCharacter(name.trim(), DEFAULT_APPEARANCE);
    setScreen('classChoice');
  };

  const canProceed = name.trim().length >= 2 && birthDate.length > 0 && birthDate <= TODAY;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <User className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2 className="fantasy-title text-3xl text-amber-300 mb-2">Begin Your Journey</h2>
          <p className="fantasy-text text-amber-200/50">Tell us who you are and when your story began</p>
        </motion.div>

        <div className="panel-fantasy p-6 space-y-6">
          <div>
            <label htmlFor="character-name" className="fantasy-heading text-sm text-amber-200/70 block mb-2">
              Your Name
            </label>
            <input
              id="character-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your character's name..."
              className="w-full bg-black/30 border border-amber-400/20 rounded-lg px-4 py-3 text-amber-100 placeholder:text-amber-200/20 focus:outline-none focus:border-amber-400/50 fantasy-text"
              maxLength={20}
            />
          </div>

          <div>
            <label htmlFor="birth-date" className="fantasy-heading text-sm text-amber-200/70 block mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date of Birth
            </label>
            <input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              max={TODAY}
              className="w-full bg-black/30 border border-amber-400/20 rounded-lg px-4 py-3 text-amber-100 fantasy-text focus:outline-none focus:border-amber-400/50"
              required
            />
            <p className="fantasy-text text-xs text-amber-200/40 mt-2">
              Your zodiac sign and animal will be revealed from your birth date.
            </p>
          </div>

          <motion.button
            onClick={handleGenerateDestiny}
            disabled={!canProceed}
            className="w-full btn-fantasy py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            whileHover={canProceed ? { scale: 1.02 } : undefined}
            whileTap={canProceed ? { scale: 0.98 } : undefined}
          >
            Reveal My Destiny
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
