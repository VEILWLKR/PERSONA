# Persona — Milestone Plan
## A Dynamic Open-World Fantasy RPG

**Goal:** Production-ready foundation with clean architecture, scalable modules, and future AI integration paths.
**Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Zustand, IndexedDB.
**Milestones:** 8 playable increments.

---

## Milestone 1: The Destiny Engine & Character Creation
**Theme:** "Who Are You?" — The player discovers their identity.

**Systems:**
- **Project scaffolding** — Feature-based folder structure (`/engines`, `/systems`, `/ui`, `/data`, `/stores`, `/types`, `/hooks`, `/utils`).
- **Game state foundation** — Zustand store with slices (`character`, `world`, `quest`, `inventory`, `combat`, `settings`).
- **Personality Assessment Engine** — Immersive conversational questionnaire that adapts based on answers.
  - Hidden personality attributes (aggression, empathy, curiosity, honor, chaos, etc.)
  - MBTI estimation from answer patterns
  - Optional: Zodiac / Chinese zodiac input
- **Destiny Engine** — Core algorithm combining personality data, MBTI, zodiac, and controlled randomness to determine:
  - Fantasy Class (from 100 unique classes across Common → Mythical tiers)
  - Starting Rank (E → SSS)
  - Starting stat distribution (STR, AGI, INT, VIT, LUCK, CHA, etc.)
  - Starting region
  - Initial reputation tilt
  - Predicted story arc
- **Class System** — Full data definitions for all 100 classes including:
  - Tier, lore, growth curves, skill trees, restrictions, passives, ultimates, evolution paths
- **Character Creation UI** — Name input, appearance customization, class reveal animation, stat breakdown.
- **Rank System** — E, D, C, B, A, S, SS, SSS with progression thresholds.
- **Save/Load foundation** — IndexedDB persistence for character profiles.

**Deliverable:** Player can complete personality assessment, receive a unique class assignment with full stat breakdown, customize appearance, and save their character. A "re-roll" option allows experiencing different destinies.

---

## Milestone 2: World Foundation & Exploration
**Theme:** "The World Awakens" — The player steps into the world.

**Systems:**
- **World Map Engine** — Interactive region-based world map with:
  - 6–8 distinct regions (kingdoms, wilderness, dungeons, cities)
  - Fog of war / discovery system
  - Fast-travel nodes (unlockable)
- **Location System** — Detailed locations within each region:
  - Taverns, shops, guild halls, dungeons, landmarks
  - Scene-based exploration (illustrated backgrounds + navigation)
- **Exploration UI** — Map screen, location detail view, travel transitions (Framer Motion).
- **Mock Content** — 30+ locations, region lore, discovery logs.
- **Navigation State** — Tracking current location, visited places, discovered secrets.

**Deliverable:** Player can explore the world map, enter locations, view region lore, and travel between discovered areas. Character from M1 carries over seamlessly.

---

## Milestone 3: Quest Engine & Story Branching
**Theme:** "A Purpose Found" — The player's journey gains direction.

**Systems:**
- **Quest Engine** — Robust quest system supporting:
  - Quest types: fetch, kill, escort, investigation, moral choice, puzzle, social
  - Branching objectives (player choice alters quest path)
  - Multi-stage quests with prerequisites
  - Quest giver associations
  - Rewards: XP, gold, items, reputation, relationship points
- **Journal System** — Quest log with active/completed/failed tabs, detailed quest descriptions, hint system.
- **Story Branching Engine** — Rule-based dynamic story generation:
  - Choice recording and consequence tracking
  - Story flags that persist across sessions
  - Arc builder (personalized questline based on class + choices)
- **Mock Content** — 20+ quests, 3–4 mini-storylines, world-building lore entries.

**Deliverable:** Player can accept quests from NPC quest-givers, track progress in the journal, make branching choices that affect quest outcomes, and complete questlines for rewards.

---

## Milestone 4: NPCs, Dialogue & Relationships
**Theme:** "Connections Forged" — The world fills with memorable characters.

**Systems:**
- **NPC Database** — 50+ fully defined NPCs with:
  - Name, portrait, race, class, faction, personality traits
  - Schedule/location preferences
  - Unique dialogue trees
- **Dialogue Engine** — Branching conversation system:
  - Context-aware greetings (time, relationship, past choices)
  - Topic-based dialogue branches
  - Persuasion/intimidation skill checks
  - Lore delivery system
- **NPC Memory System** — NPCs remember:
  - First meeting, past conversations, favors, betrayals
  - Shared history impacts future dialogue options
- **Relationship System** — Affinity tracking per NPC:
  - Tiers: Stranger → Acquaintance → Friend → Close Friend → Beloved
  - Relationship affects: prices, quest access, combat aid, story outcomes
- **Romance Mechanics** — Compatible companion candidates, romance arcs, gift-giving, date events.
- **Companion System** — Invite companions to join party, companion skills in combat (preparation for M5).

**Deliverable:** Player can talk to NPCs with branching dialogue, build relationships through choices and gifts, unlock romance paths with certain NPCs, and recruit companions.

---

## Milestone 5: Combat System
**Theme:** "Steel Meets Sorcery" — Battle is joined.

**Systems:**
- **Combat Engine** — Turn-based tactical combat with:
  - Initiative system based on AGI
  - Action economy (move, attack, skill, item, flee)
  - Enemy AI (aggression patterns, ability selection)
- **Skill System** — Class-based abilities:
  - Basic attacks, class skills, passives, ultimate abilities
  - Mana/stamina/energy costs
  - Cooldowns and combos
- **Monster Bestiary** — 40+ enemy types with:
  - Stats, behaviors, loot tables, habitats, lore
- **Encounter System** — Region-based random encounters + boss fights
- **Combat UI** — Battle screen with animations (Framer Motion), HP/MP bars, action menu, combat log, loot screen.
- **Death & Respawn** — Defeat consequences, respawn mechanics.

**Deliverable:** Player can engage in turn-based combat using class abilities, fight monsters in the world, earn XP and loot, and face boss encounters. Companions from M4 participate in combat.

---

## Milestone 6: Inventory, Equipment & Crafting
**Theme:** "The Artisan's Touch" — Gear and economy come alive.

**Systems:**
- **Inventory System** — Grid or list-based inventory:
  - Categories: weapons, armor, consumables, materials, quest items, lore
  - Stack management, sorting, filtering
  - Weight/space limits based on stats
- **Equipment System** — Slot-based gear:
  - Weapon, offhand, head, body, gloves, boots, accessories (2)
  - Rarity tiers: Common → Mythical (color-coded)
  - Stat modifiers, set bonuses
  - Equip/unequip with visual feedback
- **Crafting Engine** — Recipe-based crafting:
  - Recipe discovery (learn from NPCs, find in world, experiment)
  - Material requirements, success chances
  - Crafting categories: weapons, armor, potions, enchantments
- **Economy System** — Currency (gold), shops, buy/sell with haggling skill, merchant reputation.
- **Item Database** — 200+ items with descriptions, lore, stats, and visuals.

**Deliverable:** Player can manage inventory, equip gear that changes stats, craft items from gathered materials, buy and sell at shops, and discover rare recipes.

---

## Milestone 7: Factions, Reputation & Dynamic World Events
**Theme:** "The World Reacts" — The player's legend grows.

**Systems:**
- **Faction System** — Multiple factions with:
  - Reputation tracks (Hated → Exalted)
  - Faction-specific quests, rewards, and storylines
  - Faction conflicts and alliances
  - Join/leave/betray mechanics
- **Reputation Engine** — Cross-cutting reputation:
  - Per-region, per-faction, per-race reputation
  - Reputation affects: prices, guard behavior, quest availability, companion recruitment
- **Dynamic World Events** — Scheduled and triggered events:
  - Monster invasions, festivals, political shifts, natural disasters
  - Player actions can trigger or prevent events
  - Event consequences persist
- **Kingdom Influence** — High-level mechanic where player decisions shape:
  - Territory control, laws, trade routes, alliances between kingdoms
- **News System** — World news board reflecting player actions and world events.

**Deliverable:** Player can join factions, build reputation, participate in dynamic world events, and see the world change based on their cumulative choices.

---

## Milestone 8: Polish, Audio & AI Integration Architecture
**Theme:** "The Final Polish" — Production-ready completeness.

**Systems:**
- **Audio Engine** — Atmospheric sound design:
  - Ambient region music, combat music, UI sounds
  - Sound effects for abilities, combat, crafting, discovery
  - Volume controls, audio settings
- **Animation Polish** — Framer Motion throughout:
  - Screen transitions, combat animations, UI feedback, reveal effects
- **Responsive UI** — Mobile-friendly layout adaptations, touch controls.
- **StoryEngine Interface** — Clean abstraction layer for future AI integration:
  - `IStoryEngine` interface with methods like `generateQuest()`, `generateDialogue()`, `generateEvent()`
  - `RuleBasedEngine` (default, fully functional)
  - `AIEngine` (placeholder implementing the interface, ready for LLM integration)
  - Feature flags to toggle between engines
- **Settings System** — Graphics, audio, gameplay, accessibility options.
- **Performance Optimization** — Code splitting, lazy loading, memoization.
- **Complete Save/Load** — Full game state serialization, multiple save slots, export/import.
- **Mock Content Completion** — All mock data finalized for NPCs, items, quests, monsters, classes, lore.

**Deliverable:** Fully playable foundation with polished UI/UX, atmospheric audio, complete save system, and a clean architecture ready for AI-powered storytelling expansion. The game functions entirely without AI while being ready for it.

---

## Architecture Principles (All Milestones)

| Principle | Implementation |
|-----------|----------------|
| **Clean Architecture** | `/engines` (game logic), `/systems` (data/rules), `/ui` (React components), `/stores` (Zustand), `/types` (TypeScript) |
| **State Management** | Zustand with domain slices; engines are pure functions, stores manage persistence |
| **Reusable Components** | UI kit in `/ui/components` — Button, Panel, StatBar, Tooltip, Modal, etc. |
| **Type Safety** | Strict TypeScript; shared types in `/types` directory |
| **Persistence** | IndexedDB via Zustand middleware; auto-save on key events |
| **AI-Readiness** | All content generation goes through `IContentGenerator` interface; default is rule-based |
| **Scalability** | Feature modules are self-contained; adding a new system doesn't touch existing code |

---

## Milestone Dependency Graph

```
M1: Destiny Engine & Character Creation
  |
M2: World Foundation & Exploration
  |
M3: Quest Engine & Story Branching
  |
M4: NPCs, Dialogue & Relationships
  |\
M5: Combat System      M6: Inventory, Equipment & Crafting
  |                      |
  +----------+-----------+
             |
M7: Factions, Reputation & World Events
             |
M8: Polish, Audio & AI Integration Architecture
```

M5 and M6 can be developed in parallel after M4. All other milestones are sequential.
