import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronDown, Filter, Search, Shield, Sparkles, Swords, Users } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { CLASS_DATABASE } from '@/data/classes';
import { getTierColor } from '@/engines/destinyEngine';
import type { ClassDefinition, ClassTier, StatName } from '@/types/game';

const TIERS: ClassTier[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Hidden', 'Mythical'];
const STATS: StatName[] = ['strength', 'agility', 'intelligence', 'vitality', 'luck', 'charisma', 'wisdom', 'dexterity', 'endurance', 'perception'];
const RACES = ['Human', 'Elf', 'Dwarf', 'Orc', 'Fey', 'Draconic', 'Undead', 'Construct'];
const formatLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const RARITY_COUNTS: Record<ClassTier, number> = { Common: 2, Rare: 3, Epic: 4, Legendary: 5, Hidden: 6, Mythical: 7 };
const UNLOCK_LEVELS = [1, 4, 8, 13, 19, 26, 34];

type CodexMove = { name: string; level: number; detail: string };

function getRole(classDefinition: ClassDefinition) {
  const playstyle = classDefinition.playstyle?.toLowerCase() ?? '';
  if (playstyle.includes('healer') || playstyle.includes('support') || classDefinition.primaryStats.includes('wisdom')) return 'Support';
  if (playstyle.includes('tank') || classDefinition.primaryStats.includes('vitality')) return 'Vanguard';
  if (playstyle.includes('magic') || playstyle.includes('mage') || classDefinition.primaryStats.includes('intelligence')) return 'Mystic';
  if (playstyle.includes('stealth') || playstyle.includes('assassin') || classDefinition.primaryStats.includes('agility')) return 'Skirmisher';
  return 'Striker';
}

function getAvailableRaces(classDefinition: ClassDefinition) {
  if (classDefinition.tier === 'Mythical' || classDefinition.tier === 'Hidden') return RACES;
  const role = getRole(classDefinition);
  if (role === 'Mystic') return ['Human', 'Elf', 'Fey', 'Draconic'];
  if (role === 'Vanguard') return ['Human', 'Dwarf', 'Orc', 'Construct'];
  if (role === 'Support') return ['Human', 'Elf', 'Fey', 'Undead'];
  if (role === 'Skirmisher') return ['Human', 'Elf', 'Orc', 'Fey'];
  return ['Human', 'Dwarf', 'Orc', 'Draconic'];
}

function isWeaponFocused(classDefinition: ClassDefinition) {
  const role = getRole(classDefinition);
  const style = classDefinition.playstyle?.toLowerCase() ?? '';
  return role === 'Vanguard' || role === 'Skirmisher' || style.includes('melee') || style.includes('physical') || style.includes('tank');
}

function getCodexMoves(classDefinition: ClassDefinition) {
  const identity = classDefinition.name.replace(/^(The |A |An )/i, '');
  const count = RARITY_COUNTS[classDefinition.tier];
  const weaponFocused = isWeaponFocused(classDefinition);
  const attackSources = [
    ...classDefinition.skillTree.map((skill) => ({ name: skill.name, detail: skill.description })),
    { name: classDefinition.ultimate.name, detail: `${classDefinition.ultimate.description} ${classDefinition.ultimate.effect}.` },
    ...classDefinition.startingEquipment.map((item) => ({ name: `${identity} ${item} Maneuver`, detail: `A ${weaponFocused ? 'weapon-led' : 'practical'} action using ${item.toLowerCase()} in the ${identity} style.` })),
    { name: `${identity} ${classDefinition.primaryStats[0]} Break`, detail: `A focused attack that converts ${formatLabel(classDefinition.primaryStats[0])} into pressure against a single target.` },
    { name: `${identity} ${formatLabel(classDefinition.secondaryStats[0])} Counter`, detail: `A reactive strike that turns ${formatLabel(classDefinition.secondaryStats[0])} into an opening after an enemy commits.` },
    { name: `${identity} ${classDefinition.tier} Finale`, detail: `A late-path attack reserved for the class's ${classDefinition.tier.toLowerCase()} mastery.` },
  ];
  const abilitySources = [
    ...classDefinition.passives.map((passive) => ({ name: passive.name, detail: `${passive.description}. Trigger: ${passive.trigger}.` })),
    ...classDefinition.restrictions.filter((restriction) => restriction !== 'None').map((restriction) => ({ name: `${identity} Discipline`, detail: `This discipline is shaped by the rule: ${restriction}.` })),
    { name: `${identity} Lore`, detail: `${classDefinition.loreEntry} It grants an advantage during exploration and roleplay.` },
    { name: `${identity} ${formatLabel(classDefinition.secondaryStats[0])}`, detail: `A class feature that rewards investing in ${formatLabel(classDefinition.secondaryStats[0])} outside direct combat.` },
    { name: `${identity} Evolution`, detail: classDefinition.evolutionPath ? `Progression points toward ${formatLabel(classDefinition.evolutionPath)}.` : 'This path has reached its final form and develops through mastery.' },
  ];
  const spellSources = [
    { name: `${classDefinition.ultimate.name} Invocation`, detail: `A spell-form expression of ${classDefinition.ultimate.effect.toLowerCase()} that can solve a combat or exploration problem.` },
    ...classDefinition.passives.map((passive) => ({ name: `${passive.name} Rite`, detail: `A ritualized version of ${passive.description.toLowerCase()}, useful when the class has time to prepare.` })),
    { name: `${identity} ${formatLabel(classDefinition.primaryStats[0])} Formula`, detail: `A spell that channels ${formatLabel(classDefinition.primaryStats[0])} into the class's ${getRole(classDefinition).toLowerCase()} specialty.` },
    { name: `${identity} ${formatLabel(classDefinition.secondaryStats[0])} Canticle`, detail: `A utility spell keyed to ${formatLabel(classDefinition.secondaryStats[0])}, useful in and out of battle.` },
    { name: `${identity} Lorebrand`, detail: `A signature spell drawn from the class lore: ${classDefinition.lore.toLowerCase()}` },
    { name: `${identity} Ultimate Echo`, detail: `A late-game spell that echoes ${classDefinition.ultimate.name} without replacing the class ultimate.` },
  ];
  const uniqueMoves = (sources: Array<{ name: string; detail: string }>, total: number, offset = 0) => {
    const moves: CodexMove[] = [];
    const seen = new Set<string>();
    for (const source of sources) {
      if (moves.length >= total) break;
      const baseName = source.name.startsWith(identity) ? source.name : `${identity}: ${source.name}`;
      const name = seen.has(baseName) ? `${baseName} ${moves.length + 1}` : baseName;
      seen.add(baseName);
      moves.push({ name, level: UNLOCK_LEVELS[Math.min(moves.length + offset, UNLOCK_LEVELS.length - 1)], detail: source.detail });
    }
    return moves;
  };
  const attacks = uniqueMoves(attackSources, count);
  const abilities = uniqueMoves(abilitySources, count);
  const spellCount = weaponFocused ? Math.max(1, Math.ceil(count / 3)) : Math.max(2, count - 1);
  const spells = uniqueMoves(spellSources, spellCount, weaponFocused ? 1 : 0);
  return { attacks, abilities, spells };
}

function getEvolutionName(classDefinition: ClassDefinition) {
  if (!classDefinition.evolutionPath) return 'Final path or transcendent class';
  return CLASS_DATABASE.find((candidate) => candidate.id === classDefinition.evolutionPath)?.name ?? formatLabel(classDefinition.evolutionPath);
}

function DetailList({ items, empty = 'None recorded' }: { items: string[]; empty?: string }) {
  return items.length > 0 ? <ul className="space-y-1.5">{items.map((item) => <li key={item} className="fantasy-text text-xs text-amber-100/65">{item}</li>)}</ul> : <p className="fantasy-text text-xs text-amber-100/35">{empty}</p>;
}

function MoveList({ moves, accent }: { moves: CodexMove[]; accent: string }) {
  return <div className="space-y-1.5">{moves.map((move) => (
    <div key={move.name} className="group/move relative flex items-center gap-2 rounded border border-white/5 bg-white/[0.025] px-2 py-1.5">
      <span className="w-10 shrink-0 text-[10px] uppercase tracking-wider" style={{ color: accent }}>Lv. {move.level}</span>
      <span className="fantasy-text text-xs text-amber-100/75">{move.name}</span>
      <div className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-64 rounded-md border border-amber-300/25 bg-[#0c151f] p-3 text-xs shadow-2xl group-hover/move:block">
        <p className="mb-1 fantasy-heading text-[10px] uppercase tracking-wider text-amber-300">{move.name}</p>
        <p className="fantasy-text leading-relaxed text-amber-100/70">{move.detail}</p>
      </div>
    </div>
  ))}</div>;
}

function RaceList({ races }: { races: string[] }) {
  return races.length === RACES.length
    ? <p className="fantasy-text text-xs text-amber-100/65">Any Race</p>
    : <DetailList items={races} />;
}

function ClassEntry({ classDefinition }: { classDefinition: ClassDefinition }) {
  const tierColor = getTierColor(classDefinition.tier);
  const role = getRole(classDefinition);
  const races = getAvailableRaces(classDefinition);
  const { attacks, abilities, spells } = getCodexMoves(classDefinition);
  return (
    <details className="panel-fantasy-inner group relative" style={{ borderColor: `${tierColor}35` }}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border" style={{ borderColor: `${tierColor}70`, color: tierColor }}><Swords className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h2 className="fantasy-heading text-base text-amber-100">{classDefinition.name}</h2><span className="text-[10px] uppercase tracking-wider" style={{ color: tierColor }}>{classDefinition.tier}</span></div><p className="mt-1 truncate fantasy-text text-xs text-amber-100/50">{classDefinition.description}</p></div>
        <span className="hidden shrink-0 text-[10px] uppercase tracking-wider text-teal-200/60 sm:block">{role}</span><ChevronDown className="h-4 w-4 shrink-0 text-amber-200/45 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/10 bg-black/15 p-4"><div className="grid gap-4 xl:grid-cols-3">
        <section><h3 className="mb-2 flex items-center gap-2 fantasy-heading text-xs uppercase tracking-wider text-amber-300"><Shield className="h-3.5 w-3.5" />Base profile</h3><div className="space-y-3"><div className="flex flex-wrap gap-1.5">{classDefinition.primaryStats.map((stat) => <span key={stat} className="rounded border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-[10px] text-amber-200">Primary: {formatLabel(stat)}</span>)}{classDefinition.secondaryStats.map((stat) => <span key={stat} className="rounded border border-teal-300/20 bg-teal-300/5 px-2 py-1 text-[10px] text-teal-100/70">Secondary: {formatLabel(stat)}</span>)}</div><div className="space-y-2">{STATS.filter((stat) => classDefinition.baseStatModifiers[stat] !== undefined).map((stat) => { const value = classDefinition.baseStatModifiers[stat] ?? 0; return <div key={stat}><div className="mb-1 flex justify-between fantasy-text text-[10px] text-amber-100/60"><span>{formatLabel(stat)}</span><strong className="text-amber-200">+{value}</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-300" style={{ width: `${Math.min(100, value * 4)}%` }} /></div></div>; })}</div><div className="border-t border-white/10 pt-2"><p className="mb-1 fantasy-heading text-[10px] uppercase tracking-wider text-amber-100/40">Passives</p><DetailList items={classDefinition.passives.map((passive) => `${passive.name}: ${passive.description} (${passive.trigger})`)} /></div></div></section>
        <section><h3 className="mb-2 flex items-center gap-2 fantasy-heading text-xs uppercase tracking-wider text-amber-300"><Swords className="h-3.5 w-3.5" />Attacks by level</h3><MoveList moves={attacks} accent="#f5c76b" /></section>
        <section><h3 className="mb-2 flex items-center gap-2 fantasy-heading text-xs uppercase tracking-wider text-amber-300"><Shield className="h-3.5 w-3.5" />Abilities by level</h3><MoveList moves={abilities} accent="#7dd3c7" /></section>
        <section><h3 className="mb-2 flex items-center gap-2 fantasy-heading text-xs uppercase tracking-wider text-amber-300"><Sparkles className="h-3.5 w-3.5" />Spells by level</h3><MoveList moves={spells} accent="#a78bfa" /></section>
        <section className="xl:col-span-2"><h3 className="mb-2 flex items-center gap-2 fantasy-heading text-xs uppercase tracking-wider text-amber-300"><Users className="h-3.5 w-3.5" />Availability &amp; progression</h3><div className="grid gap-3 sm:grid-cols-3"><div><p className="mb-1 fantasy-heading text-[10px] uppercase text-amber-100/40">Races</p><RaceList races={races} /></div><div><p className="mb-1 fantasy-heading text-[10px] uppercase text-amber-100/40">Evolution</p><p className="fantasy-text text-xs text-amber-100/65">{getEvolutionName(classDefinition)}</p></div><div><p className="mb-1 fantasy-heading text-[10px] uppercase text-amber-100/40">Restrictions</p><DetailList items={classDefinition.restrictions.filter((restriction) => restriction !== 'None')} empty="Open access" /></div></div></section>
        <section><h3 className="mb-2 fantasy-heading text-xs uppercase tracking-wider text-amber-300">Starting kit</h3><DetailList items={classDefinition.startingEquipment} /></section>
      </div></div>
    </details>
  );
}

export function ClassesScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<'All' | ClassTier>('All');
  const [role, setRole] = useState('All');
  const [primaryStat, setPrimaryStat] = useState<'All' | StatName>('All');
  const [race, setRace] = useState('All');
  const filteredClasses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return CLASS_DATABASE.filter((classDefinition) => {
      const searchableText = `${classDefinition.name} ${classDefinition.description} ${classDefinition.playstyle ?? ''}`.toLowerCase();
      return (!normalizedQuery || searchableText.includes(normalizedQuery))
        && (tier === 'All' || classDefinition.tier === tier)
        && (role === 'All' || getRole(classDefinition) === role)
        && (primaryStat === 'All' || classDefinition.primaryStats.includes(primaryStat))
        && (race === 'All' || getAvailableRaces(classDefinition).includes(race));
    });
  }, [primaryStat, query, race, role, tier]);
  return (
    <div className="min-h-screen px-4 py-8"><div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><button onClick={() => setScreen('title')} className="btn-fantasy-secondary flex items-center gap-2 rounded-md px-4 py-2"><ArrowLeft className="h-4 w-4" />Back</button><div className="text-right"><p className="fantasy-heading text-sm uppercase text-amber-200/60">Persona Codex</p><h1 className="fantasy-title text-3xl text-amber-300">Class Archives</h1></div></div>
      <div className="mb-6 panel-fantasy p-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-amber-300" /><p className="fantasy-text text-sm text-stone-300/70">Study paths, powers, and the routes beyond them.</p></div><p className="fantasy-heading text-xs uppercase tracking-wider text-teal-200/70">{filteredClasses.length} of {CLASS_DATABASE.length} entries</p></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-100/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search classes" className="w-full rounded-md border border-amber-400/15 bg-black/25 py-2 pl-9 pr-3 text-sm text-amber-100 outline-none focus:border-amber-400/50" /></label>
        <label className="relative"><Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-100/35" /><select value={tier} onChange={(event) => setTier(event.target.value as 'All' | ClassTier)} className="w-full appearance-none rounded-md border border-amber-400/15 bg-[#101923] py-2 pl-9 pr-3 text-sm text-amber-100 outline-none"><option value="All">All rarities</option>{TIERS.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-md border border-amber-400/15 bg-[#101923] px-3 py-2 text-sm text-amber-100 outline-none"><option value="All">All roles</option>{['Vanguard', 'Mystic', 'Support', 'Skirmisher', 'Striker'].map((value) => <option key={value} value={value}>{value}</option>)}</select>
        <select value={primaryStat} onChange={(event) => setPrimaryStat(event.target.value as 'All' | StatName)} className="rounded-md border border-amber-400/15 bg-[#101923] px-3 py-2 text-sm text-amber-100 outline-none"><option value="All">Any primary stat</option>{STATS.map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select>
        <select value={race} onChange={(event) => setRace(event.target.value)} className="rounded-md border border-amber-400/15 bg-[#101923] px-3 py-2 text-sm text-amber-100 outline-none"><option value="All">Any race</option>{RACES.map((value) => <option key={value} value={value}>{value}</option>)}</select>
      </div></div>
      <div className="space-y-3">{filteredClasses.map((classDefinition) => <ClassEntry key={classDefinition.id} classDefinition={classDefinition} />)}{filteredClasses.length === 0 && <div className="panel-fantasy p-10 text-center"><p className="fantasy-heading text-amber-200">No paths match these filters.</p><p className="mt-2 fantasy-text text-sm text-amber-100/45">Clear a filter or try another search.</p></div>}</div>
    </div></div>
  );
}
