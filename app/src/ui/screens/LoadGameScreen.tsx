import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Trash2, Calendar, Clock, Sword } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { CLASS_DATABASE } from '@/data/classes';
import { getTierColor } from '@/engines/destinyEngine';
import { RANK_DEFINITIONS } from '@/systems/rankSystem';

export function LoadGameScreen() {
  const { saveSlots, loadGame, deleteSave, setScreen } = useGameStore();

  if (saveSlots.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <Upload className="w-12 h-12 text-amber-200/30 mx-auto mb-4" />
          <h2 className="fantasy-title text-2xl text-amber-300 mb-2">No Saved Journeys</h2>
          <p className="fantasy-text text-amber-200/50 mb-6">Begin a new adventure to create your first save.</p>
          <button
            onClick={() => setScreen('title')}
            className="btn-fantasy py-3 px-6 rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Title
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Upload className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2 className="fantasy-title text-3xl text-amber-300 mb-2">Continue Journey</h2>
          <p className="fantasy-text text-amber-200/50">Select a saved character to resume</p>
        </motion.div>

        <div className="space-y-3">
          {saveSlots.map((slot, index) => {
            const cls = CLASS_DATABASE.find(c => c.id === slot.character.classId);
            const tierColor = cls ? getTierColor(cls.tier) : '#9CA3AF';
            const rankDef = RANK_DEFINITIONS[slot.character.rank];
            const date = new Date(slot.timestamp).toLocaleDateString();
            const time = new Date(slot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={slot.id}
                className="panel-fantasy p-4 flex items-center gap-4 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    borderColor: tierColor,
                    background: `linear-gradient(135deg, ${tierColor}20, transparent)`,
                  }}
                >
                  <Sword className="w-6 h-6" style={{ color: tierColor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="fantasy-heading text-lg text-amber-100 truncate">
                    {slot.character.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: tierColor }}>{cls?.name || 'Unknown'}</span>
                    <span className="text-amber-200/30">|</span>
                    <span style={{ color: rankDef.color }}>{slot.character.rank}</span>
                    <span className="text-amber-200/30">|</span>
                    <span className="text-amber-200/40">Lv.{slot.character.level}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-amber-200/30">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {time}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <motion.button
                    onClick={() => loadGame(slot.id)}
                    className="btn-fantasy py-2 px-4 rounded text-xs flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="w-3 h-3" />
                    Load
                  </motion.button>
                  <motion.button
                    onClick={() => deleteSave(slot.id)}
                    className="py-2 px-4 rounded text-xs flex items-center gap-1 border border-red-400/20 text-red-400/60 hover:bg-red-400/10 hover:border-red-400/40 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setScreen('title')}
            className="flex items-center gap-2 text-amber-200/50 hover:text-amber-300 transition-colors fantasy-heading text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Title
          </button>
        </motion.div>
      </div>
    </div>
  );
}
