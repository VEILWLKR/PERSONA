import type { ClassDefinition, ClassTier, StatName } from '@/types/game';

export interface VaelithClassMetadata {
  name: string;
  icon: string;
  tier: ClassTier;
  playstyle: string;
}

const VAELITH_CLASS_METADATA: VaelithClassMetadata[] = [
  { name: 'Iron Warrior', icon: '', tier: 'Common', playstyle: 'Tank/Melee DPS' },
  { name: 'Ember Mage', icon: '', tier: 'Common', playstyle: 'Ranged magical DPS' },
  { name: 'Shadow Rogue', icon: '', tier: 'Common', playstyle: 'Stealth burst DPS' },
  { name: 'Dawn Cleric', icon: '', tier: 'Common', playstyle: 'Support/Healer' },
  { name: 'Wild Ranger', icon: '', tier: 'Common', playstyle: 'Ranged physical DPS' },
  { name: 'Wandering Bard', icon: '', tier: 'Common', playstyle: 'Support/Buffer' },
  { name: 'Forest Druid', icon: '', tier: 'Common', playstyle: 'Hybrid Support/DPS' },
  { name: 'Iron Monk', icon: '', tier: 'Common', playstyle: 'Melee DPS/Tank' },
  { name: 'Field Alchemist', icon: '', tier: 'Common', playstyle: 'Utility/DPS' },
  { name: 'Spirit Summoner', icon: '', tier: 'Common', playstyle: 'Pet class' },
  { name: 'Holy Paladin', icon: '', tier: 'Common', playstyle: 'Tank/Healer hybrid' },
  { name: 'Steel Knight', icon: '', tier: 'Common', playstyle: 'Tank/Melee' },
  { name: 'Dusk Scout', icon: '', tier: 'Common', playstyle: 'Utility/Support' },
  { name: 'Hedge Witch', icon: '', tier: 'Common', playstyle: 'Debuff/Curse specialist' },
  { name: 'Fury Berserker', icon: '', tier: 'Common', playstyle: 'High-risk melee DPS' },
  { name: 'Arcane Scholar', icon: '', tier: 'Common', playstyle: 'Support/Utility' },
  { name: 'Road Mercenary', icon: '', tier: 'Common', playstyle: 'Versatile DPS' },
  { name: 'Forest Herbalist', icon: '', tier: 'Common', playstyle: 'Support/Healer' },
  { name: 'Sea Pirate', icon: '', tier: 'Common', playstyle: 'Swashbuckling DPS' },
  { name: 'Battle Blacksmith', icon: '', tier: 'Common', playstyle: 'Utility/Tank' },
  { name: 'Mirror Illusionist', icon: '', tier: 'Common', playstyle: 'Trickster/Utility' },
  { name: 'Battle Dancer', icon: '', tier: 'Common', playstyle: 'Agility DPS/Buffer' },
  { name: 'Stone Geomancer', icon: '', tier: 'Common', playstyle: 'Control/Tank' },
  { name: 'Wind Caster', icon: '', tier: 'Common', playstyle: 'Mobile DPS' },
  { name: 'Frost Shaper', icon: '', tier: 'Common', playstyle: 'Control/DPS' },
  { name: 'Tribal Shaman', icon: '', tier: 'Common', playstyle: 'Hybrid Support/DPS' },
  { name: 'Arena Gladiator', icon: '', tier: 'Common', playstyle: 'Melee DPS/Performer' },
  { name: 'Gear Tinkerer', icon: '', tier: 'Common', playstyle: 'Utility/DPS' },
  { name: 'Raw Elementalist', icon: '', tier: 'Common', playstyle: 'Versatile Mage' },
  { name: 'Street Thief', icon: '', tier: 'Common', playstyle: 'Stealth/Utility' },
  { name: 'Order Templar', icon: '', tier: 'Common', playstyle: 'Tank/Support' },
  { name: 'Archmage', icon: '', tier: 'Rare', playstyle: 'Supreme magical DPS' },
  { name: 'Iron Warlord', icon: '', tier: 'Rare', playstyle: 'Leader/Tank' },
  { name: 'Crimson Assassin', icon: '', tier: 'Rare', playstyle: 'Burst DPS' },
  { name: 'Storm Caller', icon: '', tier: 'Rare', playstyle: 'AoE DPS/Control' },
  { name: 'Wild Beastmaster', icon: '', tier: 'Rare', playstyle: 'Pet commander' },
  { name: 'Bone Necromancer', icon: '', tier: 'Rare', playstyle: 'Army commander' },
  { name: 'Divine Knight', icon: '', tier: 'Rare', playstyle: 'Holy tank' },
  { name: 'Master Runesmith', icon: '', tier: 'Rare', playstyle: 'Utility/Support' },
  { name: 'Storm Sea Captain', icon: '', tier: 'Rare', playstyle: 'Tactical commander' },
  { name: 'Arcane Artificer', icon: '', tier: 'Rare', playstyle: 'Utility/Pet' },
  { name: 'High Priest', icon: '', tier: 'Rare', playstyle: 'Supreme healer/Buffer' },
  { name: 'Phantom Warrior', icon: '', tier: 'Rare', playstyle: 'Evasion/DPS' },
  { name: 'Void Mage', icon: '', tier: 'Rare', playstyle: 'Chaos DPS' },
  { name: 'Blood Warrior', icon: '', tier: 'Rare', playstyle: 'High-risk DPS' },
  { name: 'Time Walker', icon: '', tier: 'Rare', playstyle: 'Control/Support' },
  { name: 'Spirit Walker', icon: '', tier: 'Rare', playstyle: 'Hybrid Support' },
  { name: 'Shadow Dancer', icon: '', tier: 'Rare', playstyle: 'Evasion DPS' },
  { name: 'Dragonbound', icon: '', tier: 'Rare', playstyle: 'Melee/elemental DPS' },
  { name: 'Arcane Enchantress', icon: '', tier: 'Rare', playstyle: 'Charm/Control' },
  { name: 'Plague Doctor', icon: '', tier: 'Rare', playstyle: 'DoT specialist' },
  { name: 'Sky Knight', icon: '', tier: 'Rare', playstyle: 'Aerial DPS' },
  { name: 'Golem Knight', icon: '', tier: 'Rare', playstyle: 'Ultimate Tank' },
  { name: 'Flame Inquisitor', icon: '', tier: 'Rare', playstyle: 'Hunter/DPS' },
  { name: 'Bounty Hunter', icon: '', tier: 'Rare', playstyle: 'Tracker/DPS' },
  { name: 'Arch-Lich', icon: '', tier: 'Epic', playstyle: 'Undead controller' },
  { name: 'World Conqueror', icon: '', tier: 'Epic', playstyle: 'Battlefield commander' },
  { name: 'Phantom Blade', icon: '', tier: 'Epic', playstyle: 'One-shot specialist' },
  { name: 'Thunder God', icon: '', tier: 'Epic', playstyle: 'Living storm' },
  { name: 'Primal Sovereign', icon: '', tier: 'Epic', playstyle: 'Beast commander' },
  { name: 'True Lich', icon: '', tier: 'Epic', playstyle: 'Necromantic force' },
  { name: 'Archangel Knight', icon: '', tier: 'Epic', playstyle: 'Celestial warrior' },
  { name: 'Void Sovereign', icon: '', tier: 'Epic', playstyle: 'Reality-bending DPS' },
  { name: 'Avatar of Light', icon: '', tier: 'Epic', playstyle: 'Living miracle' },
  { name: 'Chronomancer', icon: '', tier: 'Epic', playstyle: 'Ultimate control' },
  { name: 'Clockwork God', icon: '', tier: 'Epic', playstyle: 'Mechanical overlord' },
  { name: 'Dragon Sovereign', icon: '', tier: 'Epic', playstyle: 'Physical/elemental force' },
  { name: 'Ocean Sovereign', icon: '', tier: 'Epic', playstyle: 'Water domain controller' },
  { name: 'Earth Titan', icon: '', tier: 'Epic', playstyle: 'Ultimate defense tank' },
  { name: 'Fey Queen', icon: '', tier: 'Epic', playstyle: 'Supreme enchantress' },
  { name: 'Runic Sage', icon: '', tier: 'Epic', playstyle: 'Reality alteration' },
  { name: 'Sky Sovereign', icon: '', tier: 'Epic', playstyle: 'Aerial supreme' },
  { name: 'Night Sovereign', icon: '', tier: 'Epic', playstyle: 'Shadow incarnate' },
  { name: 'Soul Sovereign', icon: '', tier: 'Epic', playstyle: 'Soul manipulation' },
  { name: 'Wraith Sovereign', icon: '', tier: 'Epic', playstyle: 'Phase DPS' },
  { name: 'War God', icon: '', tier: 'Legendary', playstyle: 'Living war' },
  { name: 'Grand Inquisitor', icon: '', tier: 'Legendary', playstyle: 'Divine authority' },
  { name: 'Shadow Marshal', icon: '', tier: 'Legendary', playstyle: 'Supreme hunter' },
  { name: 'Pandemic Lord', icon: '', tier: 'Legendary', playstyle: 'Biological weapon' },
  { name: 'Sanguine Lord', icon: '', tier: 'Legendary', playstyle: 'Life-force controller' },
  { name: 'Eternal Arena Champion', icon: '', tier: 'Legendary', playstyle: 'Perfect combatant' },
  { name: 'Grandmaster of Fists', icon: '', tier: 'Legendary', playstyle: 'Transcendent unarmed fighter' },
  { name: 'World Archdruid', icon: '', tier: 'Legendary', playstyle: 'World controller' },
  { name: 'Storm Dancer', icon: '', tier: 'Legendary', playstyle: 'Speed incarnate' },
  { name: 'Glacial Lord', icon: '', tier: 'Legendary', playstyle: 'Unstoppable control' },
  { name: 'Immortal Skald', icon: '', tier: 'Legendary', playstyle: 'Reality-altering support' },
  { name: 'Legendary Corsair', icon: '', tier: 'Legendary', playstyle: 'Swashbuckling supreme' },
  { name: 'Sword Dancer of Eternity', icon: '', tier: 'Legendary', playstyle: 'Perfect melee DPS' },
  { name: 'Supreme Enchanter', icon: '', tier: 'Legendary', playstyle: 'Equipment transformer' },
  { name: 'World Eater', icon: '', tier: 'Hidden', playstyle: 'Apocalyptic DPS' },
  { name: 'Star Weaver', icon: '', tier: 'Hidden', playstyle: 'Fate manipulation' },
  { name: 'Paradox Knight', icon: '', tier: 'Hidden', playstyle: 'Reality-glitch fighter' },
  { name: 'Void Born', icon: '', tier: 'Hidden', playstyle: 'Void manifestation' },
  { name: 'Soul Merchant', icon: '', tier: 'Hidden', playstyle: 'Bargain and consequence' },
  { name: 'Blind Prophet', icon: '', tier: 'Hidden', playstyle: 'Prophecy-based combat' },
  { name: 'Last Mortal', icon: '', tier: 'Hidden', playstyle: 'Desperation-powered' },
  { name: 'The Primordial', icon: '', tier: 'Mythical', playstyle: 'Transcends all mechanics' },
  { name: 'Fate Weaver', icon: '', tier: 'Mythical', playstyle: 'Absolute fate control' },
  { name: 'The First Flame', icon: '', tier: 'Mythical', playstyle: 'Living genesis' },
];

function toId(name: string): string {
  return `vaelith_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
}

function getStats(name: string, playstyle: string, index: number): { primary: StatName[]; secondary: StatName[] } {
  const identity = `${name} ${playstyle}`.toLowerCase();
  const archetypes: Array<[string[], StatName[], StatName[]]> = [
    [['mage', 'caster', 'archmage', 'enchanter', 'witch', 'elementalist'], ['intelligence', 'wisdom'], ['perception', 'luck']],
    [['cleric', 'priest', 'paladin', 'inquisitor', 'light', 'angel'], ['wisdom', 'vitality'], ['charisma', 'intelligence']],
    [['rogue', 'assassin', 'thief', 'shadow', 'dancer'], ['agility', 'dexterity'], ['luck', 'perception']],
    [['ranger', 'scout', 'hunter', 'captain', 'corsair'], ['dexterity', 'perception'], ['agility', 'luck']],
    [['druid', 'herbalist', 'shaman', 'fey'], ['wisdom', 'vitality'], ['intelligence', 'perception']],
    [['monk', 'fist', 'gladiator'], ['strength', 'agility'], ['endurance', 'vitality']],
    [['lich', 'necromancer', 'void', 'wraith', 'pandemic'], ['intelligence', 'luck'], ['wisdom', 'perception']],
    [['knight', 'warrior', 'warlord', 'titan', 'god', 'berserker', 'conqueror'], ['strength', 'vitality'], ['endurance', 'agility']],
  ];
  const match = archetypes.find(([keywords]) => keywords.some((keyword) => identity.includes(keyword)));
  if (match) return { primary: match[1], secondary: match[2] };
  const fallback: Array<[StatName, StatName, StatName, StatName]> = [
    ['charisma', 'luck', 'wisdom', 'perception'],
    ['intelligence', 'dexterity', 'luck', 'agility'],
    ['vitality', 'endurance', 'strength', 'wisdom'],
  ];
  const [primaryA, primaryB, secondaryA, secondaryB] = fallback[index % fallback.length];
  return { primary: [primaryA, primaryB], secondary: [secondaryA, secondaryB] };
}

function getLoadout(name: string, playstyle: string, index: number) {
  const identity = `${name} ${playstyle}`.toLowerCase();
  if (identity.includes('mage') || identity.includes('caster') || identity.includes('witch')) {
    return { attacks: ['Staff Arc', 'Runic Detonation'], abilities: ['Mana Weave', 'Spellbook Memory'], ultimate: 'Grand Arcanum', equipment: ['Focus staff', 'Spell folio', 'Aether lens'], restrictions: ['Cannot wear heavy armor'] };
  }
  if (identity.includes('rogue') || identity.includes('assassin') || identity.includes('shadow') || identity.includes('thief')) {
    return { attacks: ['Razorstep', 'Twin Fang'], abilities: ['Vanish', 'Marked Prey'], ultimate: 'Perfect Ambush', equipment: ['Twin daggers', 'Smoke vials', 'Silent cloak'], restrictions: ['Cannot use tower shields'] };
  }
  if (identity.includes('cleric') || identity.includes('priest') || identity.includes('paladin') || identity.includes('inquisitor')) {
    return { attacks: ['Consecrated Edge', 'Judgment Arc'], abilities: ['Oathguard', 'Radiant Mend'], ultimate: 'Covenant of Dawn', equipment: ['Relic mace', 'Sanctified shield', 'Prayer codex'], restrictions: ['Must uphold a chosen oath'] };
  }
  if (identity.includes('ranger') || identity.includes('scout') || identity.includes('hunter') || identity.includes('captain') || identity.includes('corsair')) {
    return { attacks: ['Farshot', 'Pinning Volley'], abilities: ['Trail Sense', 'Tactical Mark'], ultimate: 'Horizon Barrage', equipment: ['Composite bow', 'Field compass', 'Utility line'], restrictions: ['Requires a ranged weapon'] };
  }
  if (identity.includes('druid') || identity.includes('herbalist') || identity.includes('shaman') || identity.includes('fey')) {
    return { attacks: ['Thorn Lash', 'Verdant Sweep'], abilities: ['Wild Communion', 'Rootsnare'], ultimate: 'Heart of the Wild', equipment: ['Living staff', 'Herbal satchel', 'Seed charms'], restrictions: ['Cannot equip forged heavy weapons'] };
  }
  if (identity.includes('monk') || identity.includes('fist') || identity.includes('gladiator')) {
    return { attacks: ['Comet Fist', 'Rising Palm'], abilities: ['Iron Breath', 'Counterflow'], ultimate: 'Hundred-Hand Tempest', equipment: ['Weighted wraps', 'Meditation beads', 'Arena sash'], restrictions: ['Cannot use conventional weapons'] };
  }
  if (identity.includes('lich') || identity.includes('necromancer') || identity.includes('void') || identity.includes('wraith')) {
    return { attacks: ['Grave Lance', 'Soul Rend'], abilities: ['Dread Channel', 'Unliving Presence'], ultimate: 'Eclipse of Names', equipment: ['Soul vessel', 'Obsidian grimoire', 'Ritual mantle'], restrictions: ['Healing received is reduced'] };
  }
  return { attacks: ['Vaelith Cleave', 'Bulwark Crash'], abilities: ['Battle Temper', 'Hold the Line'], ultimate: `Sovereign ${index % 2 === 0 ? 'Ascension' : 'Breaker'}`, equipment: ['Forged greatblade', 'Reinforced cuirass', 'War standard'], restrictions: ['Heavy equipment reduces travel speed'] };
}

export const VAELITH_CLASSES: ClassDefinition[] = VAELITH_CLASS_METADATA.map((metadata, index) => {
  const stats = getStats(metadata.name, metadata.playstyle, index);
  const loadout = getLoadout(metadata.name, metadata.playstyle, index);
  const statBoost = 9 + (index % 5) + (metadata.tier === 'Rare' ? 2 : metadata.tier === 'Epic' ? 4 : metadata.tier === 'Legendary' ? 6 : metadata.tier === 'Hidden' ? 8 : metadata.tier === 'Mythical' ? 10 : 0);
  const baseStatModifiers = Object.fromEntries(
    [...stats.primary, ...stats.secondary].map((stat, statIndex) => [stat, Math.max(4, statBoost - statIndex * 2)]),
  ) as Partial<Record<StatName, number>>;

  return {
    id: toId(metadata.name),
    name: metadata.name,
    tier: metadata.tier,
    description: `${metadata.playstyle} class from the Vaelith tradition.`,
    lore: `${metadata.name} is a recognized path in the Vaelith class tradition.`,
    primaryStats: stats.primary,
    secondaryStats: stats.secondary,
    baseStatModifiers,
    passives: [
      { name: loadout.abilities[0], description: `${metadata.name} gains an edge through ${metadata.playstyle.toLowerCase()}.`, trigger: 'Always' },
      { name: loadout.abilities[1], description: `Improves ${stats.primary.map((stat) => stat).join(' and ')} when the class fights on its own terms.`, trigger: 'Combat' },
    ],
    ultimate: {
      name: loadout.ultimate,
      description: `Unleash ${loadout.ultimate.toLowerCase()} to turn the ${metadata.name.toLowerCase()}'s defining discipline into a decisive advantage.`,
      cooldown: 45 + index,
      effect: metadata.playstyle,
    },
    evolutionPath: null,
    restrictions: loadout.restrictions,
    skillTree: loadout.attacks.map((attack, attackIndex) => ({
      id: `${toId(metadata.name)}_${attackIndex}`,
      name: attack,
      description: `${attack} is a practiced ${metadata.playstyle.toLowerCase()} action with a clear tactical purpose.`,
      tier: attackIndex + 1,
      prerequisites: attackIndex === 0 ? [] : [`${toId(metadata.name)}_${attackIndex - 1}`],
      unlocked: attackIndex === 0,
    })),
    startingEquipment: loadout.equipment,
    loreEntry: `${metadata.name} walks the ${metadata.tier.toLowerCase()} path through the Vaelith tradition.`,
    icon: metadata.icon,
    playstyle: metadata.playstyle,
  };
});

export const VAELITH_CLASS_COUNT = VAELITH_CLASSES.length;
