import { motion } from 'framer-motion';
import {
  ArrowRight,
  Axe,
  BookOpen,
  Crown,
  Flame,
  Leaf,
  Shield,
  Sparkles,
  Swords,
  WandSparkles,
} from 'lucide-react';
import { CLASS_DATABASE } from '@/data/classes';
import { applySubclassSelection, getTierColor } from '@/engines/destinyEngine';
import { useGameStore } from '@/stores/gameStore';
import type { ClassDefinition } from '@/types/game';

const iconForClass = (classDef: ClassDefinition) => {
  const stats = [...classDef.primaryStats, ...classDef.secondaryStats];
  if (stats.includes('intelligence') || stats.includes('wisdom')) return WandSparkles;
  if (stats.includes('charisma')) return Crown;
  if (stats.includes('vitality') || stats.includes('endurance')) return Shield;
  if (stats.includes('agility') || stats.includes('dexterity')) return Swords;
  if (stats.includes('strength')) return Axe;
  if (classDef.name.toLowerCase().includes('flame')) return Flame;
  if (classDef.name.toLowerCase().includes('druid')) return Leaf;
  return BookOpen;
};

export function ClassChoiceScreen() {
  const { destinyResult, pendingCharacter, setDestinyResult, createCharacter, setScreen } = useGameStore();

  if (!destinyResult || !pendingCharacter) return null;

  const storedCandidateIds = destinyResult.classCandidates?.filter((id) => id !== destinyResult.classId) ?? [];
  const fallbackCandidateIds = CLASS_DATABASE
    .filter((classDef) => classDef.id !== destinyResult.classId)
    .slice(0, 3)
    .map((classDef) => classDef.id);
  const candidateIds = [...new Set([...storedCandidateIds, ...fallbackCandidateIds])].slice(0, 3);
  const candidates = candidateIds
    .map((id) => CLASS_DATABASE.find((classDef) => classDef.id === id))
    .filter((classDef): classDef is ClassDefinition => Boolean(classDef));
  const mainClass = CLASS_DATABASE.find((classDef) => classDef.id === destinyResult.classId);

  const chooseSubclass = (subclassId: string) => {
    const finalDestiny = applySubclassSelection(destinyResult, subclassId);
    setDestinyResult(finalDestiny);
    createCharacter(pendingCharacter.name, pendingCharacter.appearance);
    setScreen('reveal');
  };

  return (
    <div className="h-screen overflow-hidden flex items-center px-2 sm:px-4 py-4 sm:py-6">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 mx-auto mb-2" />
          <p className="fantasy-heading text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] text-amber-200/55">Your class has been chosen</p>
          <h2 className="fantasy-title text-2xl sm:text-4xl text-amber-200 mt-1 sm:mt-2">Choose Your Subclass Path</h2>
          <p className="fantasy-text text-xs sm:text-sm text-amber-100/55 max-w-2xl mx-auto mt-2">
            Your first calling is set. Let your personality guide the specialization that follows.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {candidates.map((classDef, index) => {
            const Icon = iconForClass(classDef);
            const tierColor = mainClass ? getTierColor(mainClass.tier) : '#FBBF24';

            return (
              <motion.button
                key={classDef.id}
                type="button"
                onClick={() => chooseSubclass(classDef.id)}
                className="group panel-fantasy text-center p-2 sm:p-4 lg:p-6 h-[min(58vh,430px)] min-h-0 border border-amber-300/15 hover:border-amber-300/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300/70 flex flex-col items-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.45 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <div
                    className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center bg-black/25"
                    style={{ borderColor: tierColor, color: tierColor }}
                  >
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="fantasy-heading text-[8px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.2em]" style={{ color: tierColor }}>
                      {mainClass?.tier ?? 'Destiny'} specialization
                    </p>
                    <h3 className="fantasy-title text-lg sm:text-2xl text-amber-100 mt-1 break-words">{classDef.name}</h3>
                  </div>
                </div>

                <p className="fantasy-text text-[11px] sm:text-sm text-amber-100/60 leading-relaxed mt-3 sm:mt-5 line-clamp-4">
                  {classDef.description}
                </p>

                <div className="flex items-center justify-center gap-2 mt-auto pt-3 sm:pt-4 border-t border-amber-200/10 w-full">
                  <span className="text-amber-300/70 group-hover:text-amber-200 transition-colors" aria-hidden="true">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
