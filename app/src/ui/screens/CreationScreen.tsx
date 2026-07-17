import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Sparkles, ArrowRight, Star, Calendar } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { generateDestiny } from '@/engines/destinyEngine';
import { computePersonality } from '@/engines/personalityEngine';
import type { CharacterAppearance, ZodiacSign, ChineseZodiac } from '@/types/game';

const HAIR_STYLES = [
  { id: 0, name: 'Short' },
  { id: 1, name: 'Long' },
  { id: 2, name: 'Braided' },
  { id: 3, name: 'Spiky' },
  { id: 4, name: 'Ponytail' },
  { id: 5, name: 'Bald' },
];

const HAIR_COLORS = [
  '#1a1a2e', '#4a2c2a', '#8B4513', '#DAA520', '#FFD700',
  '#DC143C', '#4B0082', '#C0C0C0', '#FFFFFF', '#FF69B4',
];

const SKIN_TONES = [
  '#FFE0BD', '#FFCD94', '#EAC086', '#C68642', '#8D5524',
  '#523620', '#F5E0D5', '#FFDBAC', '#D4A574', '#A0522D',
];

const EYE_COLORS = [
  '#4B3621', '#8B6914', '#228B22', '#4682B4', '#4B0082',
  '#808080', '#DC143C', '#FFD700', '#00CED1', '#FF69B4',
];

const OUTFIT_COLORS = [
  '#1a1a2e', '#2c1810', '#4a2c2a', '#1a3a2c', '#2a1a3a',
  '#3a1a1a', '#1a2a3a', '#2a2a1a', '#3a2a1a', '#1a1a3a',
];

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const CHINESE_ZODIAC: ChineseZodiac[] = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
];

export function CreationScreen() {
  const { assessmentAnswers, setDestinyResult, createCharacter, setScreen } = useGameStore();
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState<CharacterAppearance>({
    gender: 'NonBinary',
    hairStyle: 0,
    hairColor: HAIR_COLORS[3],
    skinTone: SKIN_TONES[2],
    eyeColor: EYE_COLORS[3],
    faceType: 1,
    outfitColor: OUTFIT_COLORS[2],
  });
  const [zodiac, setZodiac] = useState<ZodiacSign | null>(null);
  const [chineseZodiac, setChineseZodiac] = useState<ChineseZodiac | null>(null);
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthDay, setBirthDay] = useState(15);
  const [favoriteColor, setFavoriteColor] = useState('blue');
  const [step, setStep] = useState<'identity' | 'appearance' | 'destiny'>('identity');

  const handleGenerateDestiny = () => {
    // Re-compute destiny with full birth info
    const { profile, mbti, mbtiDimensions } = computePersonality(assessmentAnswers);

    const destiny = generateDestiny({
      personality: profile,
      mbti,
      mbtiDimensions,
      zodiac,
      chineseZodiac,
      birthMonth,
      birthDay,
      favoriteColor,
    });

    setDestinyResult(destiny);
    createCharacter(name, appearance);
    setScreen('reveal');
  };

  const canProceed = name.trim().length >= 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <User className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2 className="fantasy-title text-3xl text-amber-300 mb-2">Forge Your Identity</h2>
          <p className="fantasy-text text-amber-200/50">Shape the vessel that shall carry your soul</p>
        </motion.div>

        {/* Step tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {(['identity', 'appearance', 'destiny'] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`fantasy-heading text-xs uppercase tracking-widest pb-1 border-b-2 transition-all ${
                step === s
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-amber-200/30 hover:text-amber-200/50'
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="panel-fantasy p-6">
            {/* Step 1: Identity */}
            {step === 'identity' && (
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your character's name..."
                    className="w-full bg-black/30 border border-amber-400/20 rounded-lg px-4 py-3 text-amber-100 placeholder:text-amber-200/20 focus:outline-none focus:border-amber-400/50 fantasy-text"
                    maxLength={20}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    Form
                  </label>
                  <div className="flex gap-3">
                    {(['Male', 'Female', 'NonBinary'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setAppearance(prev => ({ ...prev, gender: g }))}
                        className={`flex-1 py-2 rounded-lg border transition-all fantasy-heading text-sm ${
                          appearance.gender === g
                            ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                            : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'
                        }`}
                      >
                        {g === 'NonBinary' ? 'Other' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Birth Date
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(Number(e.target.value))}
                      className="flex-1 bg-black/30 border border-amber-400/20 rounded-lg px-3 py-2 text-amber-100 fantasy-text focus:outline-none focus:border-amber-400/50"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(Number(e.target.value))}
                      className="w-20 bg-black/30 border border-amber-400/20 rounded-lg px-3 py-2 text-amber-100 fantasy-text focus:outline-none focus:border-amber-400/50"
                    >
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  onClick={() => setStep('appearance')}
                  disabled={!canProceed}
                  className="w-full btn-fantasy py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  whileHover={canProceed ? { scale: 1.02 } : {}}
                  whileTap={canProceed ? { scale: 0.98 } : {}}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            {/* Step 2: Appearance */}
            {step === 'appearance' && (
              <div className="space-y-5">
                {/* Hair Style */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Hair Style
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {HAIR_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setAppearance(prev => ({ ...prev, hairStyle: style.id }))}
                        className={`px-3 py-2 rounded-lg border transition-all fantasy-heading text-xs ${
                          appearance.hairStyle === style.id
                            ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                            : 'border-amber-400/10 bg-black/20 text-amber-200/40'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">Hair Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {HAIR_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, hairColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          appearance.hairColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Skin Tone */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">Skin Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setAppearance(prev => ({ ...prev, skinTone: tone }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          appearance.skinTone === tone ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: tone }}
                      />
                    ))}
                  </div>
                </div>

                {/* Eye Color */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">Eye Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {EYE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, eyeColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          appearance.eyeColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Outfit Color */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">Attire Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {OUTFIT_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAppearance(prev => ({ ...prev, outfitColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          appearance.outfitColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('identity')}
                    className="flex-1 btn-fantasy-secondary py-3 rounded-lg"
                  >
                    Back
                  </button>
                  <motion.button
                    onClick={() => setStep('destiny')}
                    className="flex-1 btn-fantasy py-3 rounded-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Step 3: Destiny Details */}
            {step === 'destiny' && (
              <div className="space-y-5">
                {/* Zodiac */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    Zodiac Sign (Optional)
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setZodiac(null)}
                      className={`px-3 py-1.5 rounded-lg border transition-all fantasy-heading text-xs ${
                        zodiac === null
                          ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                          : 'border-amber-400/10 bg-black/20 text-amber-200/40'
                      }`}
                    >
                      Unknown
                    </button>
                    {ZODIAC_SIGNS.map((sign) => (
                      <button
                        key={sign}
                        onClick={() => setZodiac(sign)}
                        className={`px-3 py-1.5 rounded-lg border transition-all fantasy-heading text-xs ${
                          zodiac === sign
                            ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                            : 'border-amber-400/10 bg-black/20 text-amber-200/40'
                        }`}
                      >
                        {sign}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chinese Zodiac */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    Chinese Zodiac (Optional)
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setChineseZodiac(null)}
                      className={`px-3 py-1.5 rounded-lg border transition-all fantasy-heading text-xs ${
                        chineseZodiac === null
                          ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                          : 'border-amber-400/10 bg-black/20 text-amber-200/40'
                      }`}
                    >
                      Unknown
                    </button>
                    {CHINESE_ZODIAC.map((animal) => (
                      <button
                        key={animal}
                        onClick={() => setChineseZodiac(animal)}
                        className={`px-3 py-1.5 rounded-lg border transition-all fantasy-heading text-xs ${
                          chineseZodiac === animal
                            ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                            : 'border-amber-400/10 bg-black/20 text-amber-200/40'
                        }`}
                      >
                        {animal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Favorite Color */}
                <div>
                  <label className="fantasy-heading text-sm text-amber-200/70 block mb-2">
                    Resonant Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['red', 'blue', 'green', 'gold', 'purple', 'silver', 'black', 'white'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFavoriteColor(color)}
                        className={`px-3 py-1.5 rounded-lg border capitalize transition-all fantasy-heading text-xs ${
                          favoriteColor === color
                            ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                            : 'border-amber-400/10 bg-black/20 text-amber-200/40'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep('appearance')}
                    className="flex-1 btn-fantasy-secondary py-3 rounded-lg"
                  >
                    Back
                  </button>
                  <motion.button
                    onClick={handleGenerateDestiny}
                    className="flex-1 btn-fantasy py-3 rounded-lg flex items-center justify-center gap-2 glow-gold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Reveal Destiny
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
