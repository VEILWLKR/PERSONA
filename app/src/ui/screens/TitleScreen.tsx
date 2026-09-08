import { motion } from 'framer-motion';
import { BookOpen, Map, Settings, Shield, Sparkles, Sword, Upload } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { CLASS_COUNT } from '@/data/classes';

export function TitleScreen() {
  const { setScreen, saveSlots, resetAssessment } = useGameStore();

  const handleNewGame = () => {
    resetAssessment();
    setScreen('assessment');
  };

  const hasSaves = saveSlots.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          className="border-l border-amber-300/35 pl-6 md:pl-10"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="mb-5 flex items-center gap-3 text-amber-300">
            <Sword className="h-7 w-7" />
            <span className="fantasy-heading text-sm uppercase text-stone-300/70">
              Milestone 1 / Destiny Engine
            </span>
          </div>

          <h1 className="fantasy-title mb-4 text-6xl font-black leading-none text-stone-100 md:text-8xl">
            PERSONA
          </h1>
          <p className="fantasy-heading max-w-xl text-xl text-amber-200 md:text-2xl">
            A dynamic open-world fantasy RPG
          </p>
          <p className="fantasy-text mt-5 max-w-xl text-base leading-7 text-stone-300/75">
            Begin with a personality-driven origin, then let the engine forge a class,
            rank, homeland, and story arc from your choices.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { icon: Sparkles, label: '20 questions' },
              { icon: Shield, label: '8 ranks' },
              { icon: Map, label: `${CLASS_COUNT} classes` },
            ].map((item) => (
              <div key={item.label} className="panel-fantasy-inner flex items-center gap-3 px-4 py-3">
                <item.icon className="h-4 w-4 text-teal-200" />
                <span className="fantasy-heading text-sm text-stone-200">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="panel-fantasy w-full p-5 md:p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.75 }}
        >
          <div className="mb-5">
            <p className="fantasy-heading text-sm uppercase text-amber-200/60">Command</p>
            <h2 className="fantasy-title text-2xl text-stone-100">Choose your entry point</h2>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={handleNewGame}
              className="btn-fantasy flex items-center justify-center gap-3 rounded-md px-6 py-4 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="h-5 w-5" />
              Begin Your Journey
            </motion.button>

            <motion.button
              onClick={() => setScreen('load')}
              className="btn-fantasy-secondary flex items-center justify-center gap-3 rounded-md px-6 py-3 disabled:opacity-30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!hasSaves}
            >
              <Upload className="h-5 w-5" />
              Continue Journey
              {hasSaves && (
                <span className="rounded-full bg-teal-300/15 px-2 py-0.5 text-xs text-teal-100">
                  {saveSlots.length}
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={() => setScreen('settings')}
              className="btn-fantasy-secondary flex items-center justify-center gap-3 rounded-md px-6 py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="h-5 w-5" />
              Settings
            </motion.button>

            <motion.button
              onClick={() => setScreen('classes')}
              className="btn-fantasy-secondary flex items-center justify-center gap-3 rounded-md px-6 py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="h-5 w-5" />
              View All Classes
            </motion.button>

            <motion.button
              onClick={() => setScreen('worldMap')}
              className="btn-fantasy-secondary flex items-center justify-center gap-3 rounded-md px-6 py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Map className="h-5 w-5" />
              Explore the World Map
            </motion.button>
          </div>

          <div className="divider-fantasy my-6" />

          <div>
            <BookOpen className="mb-3 h-5 w-5 text-amber-300/70" />
            <p className="fantasy-text text-sm italic leading-6 text-stone-300/65">
              &ldquo;In a world where destiny weaves the threads of fate, your choices
              shall determine who you become and what the world remembers.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
