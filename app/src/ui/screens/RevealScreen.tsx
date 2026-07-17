import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Sword, Scroll, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { CLASS_DATABASE } from '@/data/classes';
import { RANK_DEFINITIONS } from '@/systems/rankSystem';
import { getTierColor, getTierGlow } from '@/engines/destinyEngine';
import { getMBTIDescription } from '@/engines/personalityEngine';

export function RevealScreen() {
  const { destinyResult, character, setScreen } = useGameStore();
  const [phase, setPhase] = useState<'intro' | 'tier' | 'class' | 'details' | 'complete'>('intro');

  const classDef = destinyResult ? CLASS_DATABASE.find(c => c.id === destinyResult.classId) : null;

  useEffect(() => {
    if (!destinyResult) {
      setScreen('title');
      return;
    }

    const timers = [
      setTimeout(() => setPhase('tier'), 2000),
      setTimeout(() => setPhase('class'), 4000),
      setTimeout(() => setPhase('details'), 6000),
      setTimeout(() => setPhase('complete'), 9000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [destinyResult, setScreen]);

  if (!destinyResult || !classDef) return null;

  const tierColor = getTierColor(classDef.tier);
  const tierGlow = getTierGlow(classDef.tier);
  const rankDef = RANK_DEFINITIONS[destinyResult.rank];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Dynamic background glow based on tier */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: phase === 'complete'
            ? `radial-gradient(circle at center, ${tierColor}15 0%, transparent 70%)`
            : 'radial-gradient(circle at center, rgba(251,191,36,0.05) 0%, transparent 70%)'
        }}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 text-center max-w-lg">
        <AnimatePresence mode="wait">
          {/* Phase 1: The Intro */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="mb-6"
              >
                <Sparkles className="w-20 h-20 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="fantasy-title text-3xl text-amber-300 mb-3">The Veil Lifts</h2>
              <p className="fantasy-text text-amber-200/50">Your destiny approaches...</p>
            </motion.div>
          )}

          {/* Phase 2: Tier Reveal */}
          {phase === 'tier' && (
            <motion.div
              key="tier"
              initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, type: 'spring' }}
            >
              <motion.p
                className="fantasy-heading text-lg mb-4"
                style={{ color: tierColor }}
                animate={{ textShadow: tierGlow }
                }
              >
                The Fates have spoken...
              </motion.p>
              <motion.h2
                className="fantasy-title text-5xl md:text-6xl font-black"
                style={{
                  color: tierColor,
                  textShadow: tierGlow,
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 1.5 }}
              >
                {classDef.tier.toUpperCase()}
              </motion.h2>
              <motion.div
                className="mt-4 h-px mx-auto"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tierColor}80, transparent)`,
                }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.div>
          )}

          {/* Phase 3: Class Name */}
          {phase === 'class' && (
            <motion.div
              key="class"
              initial={{ opacity: 0, scale: 2, filter: 'blur(30px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, type: 'spring', bounce: 0.3 }}
            >
              <motion.div
                className="mb-4 inline-block px-4 py-1 rounded-full border text-sm fantasy-heading"
                style={{
                  borderColor: `${tierColor}60`,
                  color: tierColor,
                  background: `${tierColor}10`,
                }}
              >
                {classDef.tier}
              </motion.div>
              <h2
                className="fantasy-title text-5xl md:text-7xl font-black mb-4"
                style={{
                  color: tierColor,
                  textShadow: tierGlow,
                }}
              >
                {classDef.name}
              </h2>
              <p className="fantasy-text text-lg text-amber-200/70 italic">
                {classDef.description}
              </p>
            </motion.div>
          )}

          {/* Phase 4: Details */}
          {phase === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              <h2
                className="fantasy-title text-4xl font-black"
                style={{ color: tierColor, textShadow: tierGlow }}
              >
                {classDef.name}
              </h2>

              <div className="panel-fantasy p-5 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="fantasy-heading text-xs text-amber-200/50 uppercase">Rank</span>
                    <p className="fantasy-text text-lg" style={{ color: rankDef.color }}>
                      {destinyResult.rank} — {rankDef.label}
                    </p>
                  </div>
                </div>

                <div className="divider-fantasy" />

                <div className="flex items-start gap-3">
                  <Scroll className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <span className="fantasy-heading text-xs text-amber-200/50 uppercase">Personality</span>
                    <p className="fantasy-text text-sm text-amber-100/70">
                      {getMBTIDescription(destinyResult.mbti)}
                    </p>
                  </div>
                </div>

                <div className="divider-fantasy" />

                <div className="flex items-start gap-3">
                  <Sword className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <span className="fantasy-heading text-xs text-amber-200/50 uppercase">Starting Region</span>
                    <p className="fantasy-text text-sm text-amber-100/70">{destinyResult.region}</p>
                  </div>
                </div>

                <div className="divider-fantasy" />

                <div>
                  <span className="fantasy-heading text-xs text-amber-200/50 uppercase">Lore</span>
                  <p className="fantasy-text text-sm text-amber-100/60 italic mt-1">
                    &ldquo;{classDef.loreEntry}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 5: Complete */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <div>
                <motion.div
                  className="mb-3 inline-block"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-12 h-12 mx-auto" style={{ color: tierColor }} />
                </motion.div>
                <h2 className="fantasy-title text-3xl text-amber-300 mb-1">
                  {character?.name}, the {classDef.name}
                </h2>
                <p className="fantasy-heading text-sm" style={{ color: tierColor }}>
                  {destinyResult.rank} Rank &middot; {classDef.tier} Class
                </p>
              </div>

              <motion.button
                onClick={() => setScreen('summary')}
                className="btn-fantasy py-4 px-8 rounded-lg text-lg flex items-center justify-center gap-3 mx-auto"
                style={{
                  borderColor: `${tierColor}80`,
                  color: tierColor,
                  boxShadow: tierGlow,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Details
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
