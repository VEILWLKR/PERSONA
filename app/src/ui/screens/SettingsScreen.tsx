import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gauge, Moon, Palette, Play, Sun, Type, Volume2, VolumeX, Zap } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

type PreviewKind = 'music' | 'sfx';

function playPreview(kind: PreviewKind, volume: number, enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = kind === 'music' ? 'sine' : 'triangle';
  oscillator.frequency.setValueAtTime(kind === 'music' ? 220 : 520, now);
  oscillator.frequency.exponentialRampToValueAtTime(kind === 'music' ? 330 : 260, now + (kind === 'music' ? 0.7 : 0.16));
  gain.gain.setValueAtTime(Math.max(0.001, volume * 0.12), now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (kind === 'music' ? 0.8 : 0.2));
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + (kind === 'music' ? 0.8 : 0.2));
  oscillator.addEventListener('ended', () => void context.close());
}

function RangeSetting({ label, value, onChange, onPreview }: { label: string; value: number; onChange: (value: number) => void; onPreview: () => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="fantasy-heading text-sm text-amber-200">{label}</label>
        <div className="flex items-center gap-2"><span className="fantasy-text text-xs text-amber-100/55">{Math.round(value * 100)}%</span><button type="button" onClick={onPreview} aria-label={`Preview ${label}`} title={`Preview ${label}`} className="rounded border border-amber-400/20 p-1.5 text-amber-300 transition-colors hover:bg-amber-400/10"><Play className="h-3 w-3" /></button></div>
      </div>
      <input aria-label={label} type="range" min="0" max="1" step="0.1" value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-amber-400" />
    </div>
  );
}

export function SettingsScreen() {
  const { settings, updateSettings, setScreen } = useGameStore();
  const [preview, setPreview] = useState<PreviewKind | null>(null);
  const previewSound = (kind: PreviewKind) => {
    setPreview(kind);
    playPreview(kind, kind === 'music' ? settings.musicVolume : settings.sfxVolume, settings.soundEnabled);
    window.setTimeout(() => setPreview(null), 700);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <motion.div className="mb-6 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="fantasy-title text-3xl text-amber-300">Settings</h2>
          <p className="mt-2 fantasy-text text-sm text-amber-200/50">Tune the current journey</p>
        </motion.div>

        <motion.div className="panel-fantasy p-4 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3"><span className="shrink-0">{settings.soundEnabled ? <Volume2 className="h-5 w-5 text-amber-400" /> : <VolumeX className="h-5 w-5 text-amber-200/30" />}</span><div><p className="fantasy-heading text-sm text-amber-200">Sound</p><p className="fantasy-text text-xs text-amber-200/40">Controls audio previews and future game audio</p></div></div>
              <button type="button" role="switch" aria-checked={settings.soundEnabled} aria-label="Enable sound" onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })} className={`relative h-6 w-12 shrink-0 rounded-full transition-all ${settings.soundEnabled ? 'bg-amber-400/40' : 'bg-amber-400/10'}`}><motion.span className="absolute top-0.5 h-5 w-5 rounded-full bg-amber-400" animate={{ left: settings.soundEnabled ? 26 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} /></button>
            </div>
            <div className="divider-fantasy" />
            <RangeSetting label="Music Volume" value={settings.musicVolume} onChange={(value) => updateSettings({ musicVolume: value })} onPreview={() => previewSound('music')} />
            <div className="divider-fantasy" />
            <RangeSetting label="Sound Effects Volume" value={settings.sfxVolume} onChange={(value) => updateSettings({ sfxVolume: value })} onPreview={() => previewSound('sfx')} />
            {preview && <p className="fantasy-text text-xs text-teal-200/70">{settings.soundEnabled ? `Playing ${preview === 'music' ? 'music' : 'sound effect'} preview at ${Math.round((preview === 'music' ? settings.musicVolume : settings.sfxVolume) * 100)}%.` : 'Sound is disabled.'}</p>}
          </section>

          <div className="my-5 divider-fantasy" />
          <section className="space-y-5">
            <div><div className="mb-3 flex items-center gap-3"><Gauge className="h-5 w-5 text-amber-400" /><div><p className="fantasy-heading text-sm text-amber-200">Difficulty</p><p className="fantasy-text text-xs text-amber-200/40">Applied to the active journey rules</p></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(['Easy', 'Normal', 'Hard', 'Nightmare'] as const).map((diff) => <button type="button" key={diff} onClick={() => updateSettings({ difficulty: diff })} className={`min-w-0 rounded-lg border px-2 py-2 text-xs fantasy-heading transition-all ${settings.difficulty === diff ? 'border-amber-400/60 bg-amber-400/10 text-amber-300' : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'}`}>{diff}</button>)}</div><p className="mt-2 fantasy-text text-xs text-amber-100/50">{settings.difficulty === 'Easy' ? 'More forgiving encounters and generous progression.' : settings.difficulty === 'Hard' ? 'Stronger opposition and tighter resource pressure.' : settings.difficulty === 'Nightmare' ? 'The most demanding ruleset with little room for error.' : 'The balanced default ruleset.'}</p></div>
            <div className="divider-fantasy" />
            <div><div className="mb-3 flex items-center gap-3"><Type className="h-5 w-5 text-amber-400" /><div><p className="fantasy-heading text-sm text-amber-200">Text Speed</p><p className="fantasy-text text-xs text-amber-200/40">Controls screen transition pacing</p></div></div><div className="grid grid-cols-3 gap-2">{(['Slow', 'Normal', 'Fast'] as const).map((speed) => <button type="button" key={speed} onClick={() => updateSettings({ textSpeed: speed })} className={`min-w-0 rounded-lg border px-2 py-2 text-xs fantasy-heading transition-all ${settings.textSpeed === speed ? 'border-amber-400/60 bg-amber-400/10 text-amber-300' : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'}`}>{speed}</button>)}</div></div>
          </section>

          <div className="my-5 divider-fantasy" />
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><Zap className="h-5 w-5 shrink-0 text-amber-400" /><div><p className="fantasy-heading text-sm text-amber-200">Auto Save</p><p className="fantasy-text text-xs text-amber-200/40">Save a completed character when enabled</p></div></div><button type="button" role="switch" aria-checked={settings.autoSave} aria-label="Enable auto save" onClick={() => updateSettings({ autoSave: !settings.autoSave })} className={`relative h-6 w-12 shrink-0 rounded-full transition-all ${settings.autoSave ? 'bg-amber-400/40' : 'bg-amber-400/10'}`}><motion.span className="absolute top-0.5 h-5 w-5 rounded-full bg-amber-400" animate={{ left: settings.autoSave ? 26 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} /></button></div>
            <div className="divider-fantasy" />
            <div><div className="mb-3 flex items-center gap-3"><Palette className="h-5 w-5 text-amber-400" /><div><p className="fantasy-heading text-sm text-amber-200">Theme</p><p className="fantasy-text text-xs text-amber-200/40">Applies immediately across the interface</p></div></div><div className="grid grid-cols-2 gap-2">{(['dark', 'light'] as const).map((theme) => <button type="button" key={theme} onClick={() => updateSettings({ theme })} className={`flex min-w-0 items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs capitalize fantasy-heading transition-all ${settings.theme === theme ? 'border-amber-400/60 bg-amber-400/10 text-amber-300' : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'}`}>{theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}{theme}</button>)}</div></div>
          </section>
        </motion.div>

        <motion.div className="mt-5 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}><button type="button" onClick={() => setScreen('title')} className="flex items-center gap-2 fantasy-heading text-sm text-amber-200/50 transition-colors hover:text-amber-300"><ArrowLeft className="h-4 w-4" />Back to Title</button></motion.div>
      </div>
    </div>
  );
}
