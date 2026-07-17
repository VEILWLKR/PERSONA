import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Gauge, Type, Zap } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

export function SettingsScreen() {
  const { settings, updateSettings, setScreen } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="fantasy-title text-3xl text-amber-300 mb-2">Settings</h2>
          <p className="fantasy-text text-amber-200/50">Customize your experience</p>
        </motion.div>

        <motion.div
          className="panel-fantasy p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-amber-200/30" />
              )}
              <div>
                <p className="fantasy-heading text-sm text-amber-200">Sound</p>
                <p className="fantasy-text text-xs text-amber-200/40">Enable or disable all audio</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-all relative ${
                settings.soundEnabled ? 'bg-amber-400/40' : 'bg-amber-400/10'
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-amber-400 absolute top-0.5"
                animate={{ left: settings.soundEnabled ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="divider-fantasy" />

          {/* Music Volume */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <p className="fantasy-heading text-sm text-amber-200">Music Volume</p>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.musicVolume}
              onChange={(e) => updateSettings({ musicVolume: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="divider-fantasy" />

          {/* SFX Volume */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <p className="fantasy-heading text-sm text-amber-200">Sound Effects Volume</p>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.sfxVolume}
              onChange={(e) => updateSettings({ sfxVolume: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="divider-fantasy" />

          {/* Difficulty */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Gauge className="w-5 h-5 text-amber-400" />
              <p className="fantasy-heading text-sm text-amber-200">Difficulty</p>
            </div>
            <div className="flex gap-2">
              {(['Easy', 'Normal', 'Hard', 'Nightmare'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => updateSettings({ difficulty: diff })}
                  className={`flex-1 py-2 rounded-lg border text-xs fantasy-heading transition-all ${
                    settings.difficulty === diff
                      ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                      : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-fantasy" />

          {/* Text Speed */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Type className="w-5 h-5 text-amber-400" />
              <p className="fantasy-heading text-sm text-amber-200">Text Speed</p>
            </div>
            <div className="flex gap-2">
              {(['Slow', 'Normal', 'Fast'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ textSpeed: speed })}
                  className={`flex-1 py-2 rounded-lg border text-xs fantasy-heading transition-all ${
                    settings.textSpeed === speed
                      ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                      : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-fantasy" />

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <p className="fantasy-heading text-sm text-amber-200">Auto Save</p>
                <p className="fantasy-text text-xs text-amber-200/40">Save automatically</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ autoSave: !settings.autoSave })}
              className={`w-12 h-6 rounded-full transition-all relative ${
                settings.autoSave ? 'bg-amber-400/40' : 'bg-amber-400/10'
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-amber-400 absolute top-0.5"
                animate={{ left: settings.autoSave ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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
