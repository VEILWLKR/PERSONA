import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Save, RotateCcw, User, Brain, Sword, Shield,
  Sparkles, MapPin, BookOpen, ChevronRight, Heart,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { CLASS_DATABASE } from '@/data/classes';
import { getTierColor } from '@/engines/destinyEngine';
import { getMBTIDescription, getPersonalityArchetype } from '@/engines/personalityEngine';
import { getSubclassById } from '@/data/subclasses';
import type { CharacterStats } from '@/types/game';

const STAT_LABELS: Record<string, string> = {
  strength: 'Strength',
  agility: 'Agility',
  intelligence: 'Intelligence',
  vitality: 'Vitality',
  luck: 'Luck',
  charisma: 'Charisma',
  wisdom: 'Wisdom',
  dexterity: 'Dexterity',
  endurance: 'Endurance',
  perception: 'Perception',
};

function StatBar({ label, value, max = 50 }: { label: string; value: number; max?: number }) {
  const percentage = Math.min(100, (value / max) * 100);
  const getColor = (v: number) => {
    if (v >= 40) return 'from-red-400 to-red-500';
    if (v >= 30) return 'from-amber-400 to-amber-500';
    if (v >= 20) return 'from-blue-400 to-blue-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="fantasy-heading text-xs text-amber-200/60 w-24 text-right uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 stat-bar">
        <motion.div
          className={`stat-bar-fill bg-gradient-to-r ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <span className="fantasy-text text-sm text-amber-100 w-8">{value}</span>
    </div>
  );
}

export function SummaryScreen() {
  const { character, destinyResult, setScreen, saveGame, resetGame } = useGameStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'personality' | 'class' | 'lore'>('overview');
  const [saved, setSaved] = useState(false);

  if (!character || !destinyResult) {
    setScreen('title');
    return null;
  }

  const classDef = CLASS_DATABASE.find(c => c.id === character.classId);
  const subclassDef = getSubclassById(character.subclassId) ?? (() => {
    const subclassClass = CLASS_DATABASE.find((candidate) => candidate.id === character.subclassId);
    return subclassClass
      ? { name: subclassClass.name, description: subclassClass.description }
      : undefined;
  })();
  if (!classDef || !subclassDef) return null;

  const tierColor = getTierColor(classDef.tier);
  const archetype = getPersonalityArchetype(character.personality);

  const handleSave = () => {
    saveGame();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReroll = () => {
    if (window.confirm('This will reset your current character and start a new assessment. Continue?')) {
      resetGame();
      setScreen('assessment');
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'personality' as const, label: 'Personality', icon: Brain },
    { id: 'class' as const, label: 'Class', icon: Sword },
    { id: 'lore' as const, label: 'Lore', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="fantasy-title text-3xl md:text-4xl text-amber-300 mb-1">
            {character.name}
          </h1>
          <p className="fantasy-heading text-sm" style={{ color: tierColor }}>
            {classDef.name} / {subclassDef.name} &middot; {character.rank} Rank &middot; {classDef.tier}
          </p>
        </motion.div>

        {/* Character Visual */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-lg border-4"
            style={{
              borderColor: tierColor,
              boxShadow: `0 18px 34px ${tierColor}24`,
              background: `linear-gradient(145deg, ${character.appearance.skinTone}45, ${character.appearance.outfitColor}55)`,
            }}
          >
            <div
              className="h-16 w-16 rounded-md border-2"
              style={{
                borderColor: character.appearance.eyeColor,
                background: `linear-gradient(180deg, ${character.appearance.hairColor}, ${character.appearance.skinTone})`,
              }}
            />
            <div
              className="absolute bottom-4 h-3 w-20 rounded-sm"
              style={{ backgroundColor: character.appearance.outfitColor }}
            />
            <div
              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-bold"
              style={{
                borderColor: tierColor,
                background: 'rgba(15,22,32,0.94)',
                color: tierColor,
              }}
            >
              {character.rank}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all fantasy-heading text-xs uppercase tracking-wider ${
                activeTab === tab.id
                  ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                  : 'border-amber-400/10 bg-black/20 text-amber-200/40 hover:border-amber-400/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="panel-fantasy p-6 mb-8"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center panel-fantasy-inner p-3">
                  <Shield className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <p className="fantasy-heading text-xs text-amber-200/50">Level</p>
                  <p className="fantasy-title text-xl text-amber-300">{character.level}</p>
                </div>
                <div className="text-center panel-fantasy-inner p-3">
                  <Sword className="w-5 h-5 mx-auto mb-1" style={{ color: tierColor }} />
                  <p className="fantasy-heading text-xs text-amber-200/50">Class</p>
                  <p className="fantasy-heading text-sm" style={{ color: tierColor }}>{classDef.tier}</p>
                </div>
                <div className="text-center panel-fantasy-inner p-3">
                  <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <p className="fantasy-heading text-xs text-amber-200/50">Subclass</p>
                  <p className="fantasy-heading text-xs text-amber-200">{subclassDef.name}</p>
                </div>
                <div className="text-center panel-fantasy-inner p-3">
                  <MapPin className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="fantasy-heading text-xs text-amber-200/50">Region</p>
                  <p className="fantasy-heading text-sm text-blue-300">{character.region}</p>
                </div>
                <div className="text-center panel-fantasy-inner p-3">
                  <BookOpen className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="fantasy-heading text-xs text-amber-200/50">Arc</p>
                  <p className="fantasy-heading text-xs text-purple-300">{character.storyArc}</p>
                </div>
              </div>

              <div className="divider-fantasy" />

              <div>
                <h3 className="fantasy-heading text-sm text-amber-200/70 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Core Attributes
                </h3>
                <div className="space-y-2">
                  {(Object.keys(character.stats) as (keyof CharacterStats)[]).map((stat) => (
                    <StatBar
                      key={stat}
                      label={STAT_LABELS[stat]}
                      value={character.stats[stat]}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Personality Tab */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="fantasy-heading text-xs text-amber-200/50 uppercase tracking-widest mb-1">MBTI Type</p>
                <p className="fantasy-title text-3xl text-purple-300 mb-2">{character.mbti}</p>
                <p className="fantasy-text text-sm text-amber-200/60 italic max-w-md mx-auto">
                  {getMBTIDescription(character.mbti)}
                </p>
              </div>

              <div className="divider-fantasy" />

              <div className="text-center">
                <p className="fantasy-heading text-xs text-amber-200/50 uppercase tracking-widest mb-1">Archetype</p>
                <p className="fantasy-title text-2xl text-amber-300 mb-4">{archetype}</p>
              </div>

              <div className="divider-fantasy" />

              <div>
                <h3 className="fantasy-heading text-sm text-amber-200/70 mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Personality Traits
                </h3>
                <div className="space-y-3">
                  {Object.entries(character.personality).map(([trait, value]) => (
                    <div key={trait} className="flex items-center gap-3">
                      <span className="fantasy-heading text-xs text-amber-200/50 w-28 text-right capitalize">
                        {trait}
                      </span>
                      <div className="flex-1 stat-bar">
                        <motion.div
                          className="stat-bar-fill bg-gradient-to-r from-purple-400 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${value * 10}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <span className="fantasy-text text-sm text-amber-100 w-6">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Class Tab */}
          {activeTab === 'class' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3
                  className="fantasy-title text-3xl mb-2"
                  style={{ color: tierColor }}
                >
                  {classDef.name}
                </h3>
                <span
                  className="inline-block px-3 py-1 rounded-full border text-xs fantasy-heading"
                  style={{
                    borderColor: `${tierColor}60`,
                    color: tierColor,
                    background: `${tierColor}10`,
                  }}
                >
                  {classDef.tier} Class
                </span>
              </div>

              <p className="fantasy-text text-amber-100/70 text-center">
                {classDef.description}
              </p>

              <div className="panel-fantasy-inner p-4">
                <h4 className="fantasy-heading text-xs text-amber-200/50 uppercase mb-2">Personality Subclass</h4>
                <p className="fantasy-heading text-lg text-amber-200">{subclassDef.name}</p>
                <p className="fantasy-text text-sm text-amber-100/60">{subclassDef.description}</p>
              </div>

              <div className="divider-fantasy" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="panel-fantasy-inner p-4">
                  <h4 className="fantasy-heading text-xs text-amber-200/50 uppercase mb-3">Primary Stats</h4>
                  <div className="flex flex-wrap gap-2">
                    {classDef.primaryStats.map((stat) => (
                      <span
                        key={stat}
                        className="px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs fantasy-heading capitalize"
                      >
                        {STAT_LABELS[stat] || stat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="panel-fantasy-inner p-4">
                  <h4 className="fantasy-heading text-xs text-amber-200/50 uppercase mb-3">Secondary Stats</h4>
                  <div className="flex flex-wrap gap-2">
                    {classDef.secondaryStats.map((stat) => (
                      <span
                        key={stat}
                        className="px-2 py-1 rounded bg-purple-400/10 border border-purple-400/20 text-purple-300 text-xs fantasy-heading capitalize"
                      >
                        {STAT_LABELS[stat] || stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel-fantasy-inner p-4">
                <h4 className="fantasy-heading text-xs text-amber-200/50 uppercase mb-3">Passive Abilities</h4>
                <div className="space-y-2">
                  {classDef.passives.map((passive, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="fantasy-heading text-sm text-amber-200">{passive.name}</p>
                        <p className="fantasy-text text-xs text-amber-200/50">{passive.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-fantasy-inner p-4">
                <h4 className="fantasy-heading text-xs text-amber-200/50 uppercase mb-3">Ultimate Ability</h4>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="fantasy-heading text-sm text-red-300">{classDef.ultimate.name}</p>
                    <p className="fantasy-text text-xs text-amber-200/50">{classDef.ultimate.description}</p>
                  </div>
                </div>
              </div>

              {classDef.evolutionPath && (
                <div className="panel-fantasy-inner p-4">
                  <h4 className="fantasy-heading text-xs text-amber-200/50 uppercase mb-2">Evolution Path</h4>
                  <div className="flex items-center gap-2">
                    <span className="fantasy-heading text-sm text-amber-200">{classDef.name}</span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    <span className="fantasy-heading text-sm" style={{ color: tierColor }}>
                      {CLASS_DATABASE.find(c => c.id === classDef.evolutionPath)?.name || classDef.evolutionPath}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lore Tab */}
          {activeTab === 'lore' && (
            <div className="space-y-6">
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h3 className="fantasy-title text-2xl text-amber-300 mb-2">Class Lore</h3>
              </div>

              <div className="panel-fantasy-inner p-5">
                <p className="fantasy-text text-amber-100/80 leading-relaxed italic">
                  &ldquo;{classDef.lore}&rdquo;
                </p>
              </div>

              <div className="panel-fantasy-inner p-5">
                <p className="fantasy-heading text-xs text-amber-200/50 uppercase mb-2">Starting Equipment</p>
                <div className="flex flex-wrap gap-2">
                  {classDef.startingEquipment.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 text-sm fantasy-heading"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {classDef.restrictions.length > 0 && classDef.restrictions[0] !== 'None' && (
                <div className="panel-fantasy-inner p-5">
                  <p className="fantasy-heading text-xs text-amber-200/50 uppercase mb-2">Restrictions</p>
                  <div className="space-y-1">
                    {classDef.restrictions.map((r, i) => (
                      <p key={i} className="fantasy-text text-sm text-red-300/80">• {r}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="panel-fantasy-inner p-5">
                <p className="fantasy-heading text-xs text-amber-200/50 uppercase mb-2">Story Arc</p>
                <p className="fantasy-title text-lg text-purple-300">{character.storyArc}</p>
                <p className="fantasy-text text-sm text-amber-200/50 mt-2">
                  Your personal journey through the world of Persona.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col gap-3 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-lg border flex items-center justify-center gap-2 transition-all fantasy-heading ${
              saved
                ? 'border-green-400/60 bg-green-400/10 text-green-400'
                : 'border-amber-400/40 bg-amber-400/5 text-amber-400 hover:bg-amber-400/15'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Character Saved!' : 'Save Character'}
          </button>

          <button
            onClick={handleReroll}
            className="w-full py-3 rounded-lg border border-purple-400/40 bg-purple-400/5 text-purple-400 hover:bg-purple-400/15 transition-all flex items-center justify-center gap-2 fantasy-heading"
          >
            <RotateCcw className="w-4 h-4" />
            Re-roll Destiny
          </button>

          <button
            onClick={() => setScreen('title')}
            className="w-full py-3 rounded-lg border border-amber-400/20 text-amber-200/40 hover:text-amber-200/60 hover:border-amber-400/40 transition-all flex items-center justify-center gap-2 fantasy-heading text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Title
          </button>
        </motion.div>
      </div>
    </div>
  );
}
