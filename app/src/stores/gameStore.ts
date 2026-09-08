import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  CharacterData,
  GameSettings,
  AssessmentAnswer,
  DestinyResult,
  CharacterAppearance,
  SaveSlot,
} from '@/types/game';

// Custom IndexedDB storage adapter
import { get, set, del } from 'idb-keyval';

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get(name);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface GameState {
  // Navigation
  currentScreen: 'title' | 'assessment' | 'creation' | 'appearance' | 'classChoice' | 'reveal' | 'summary' | 'settings' | 'load' | 'classes' | 'worldMap';
  setScreen: (screen: GameState['currentScreen']) => void;

  // Assessment
  assessmentAnswers: AssessmentAnswer[];
  assessmentProgress: number;
  addAnswer: (answer: AssessmentAnswer) => void;
  resetAssessment: () => void;

  // Destiny
  destinyResult: DestinyResult | null;
  setDestinyResult: (result: DestinyResult) => void;

  // Character details are held until the player selects a path.
  pendingCharacter: { name: string; appearance: CharacterAppearance } | null;
  setPendingCharacter: (name: string, appearance: CharacterAppearance) => void;
  clearPendingCharacter: () => void;

  // Character
  character: CharacterData | null;
  createCharacter: (name: string, appearance: CharacterAppearance) => void;

  // Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;

  // Save slots
  saveSlots: SaveSlot[];
  saveGame: () => void;
  loadGame: (slotId: string) => void;
  deleteSave: (slotId: string) => void;

  // Reset
  resetGame: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  difficulty: 'Normal',
  autoSave: true,
  textSpeed: 'Normal',
  theme: 'dark',
};

const initialState = {
  currentScreen: 'title' as const,
  assessmentAnswers: [] as AssessmentAnswer[],
  assessmentProgress: 0,
  destinyResult: null as DestinyResult | null,
  pendingCharacter: null as { name: string; appearance: CharacterAppearance } | null,
  character: null as CharacterData | null,
  settings: { ...DEFAULT_SETTINGS },
  saveSlots: [] as SaveSlot[],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: (screen) => set({ currentScreen: screen }),

      addAnswer: (answer) =>
        set((state) => {
          const existing = state.assessmentAnswers.findIndex(
            (a) => a.questionId === answer.questionId
          );
          let newAnswers;
          if (existing >= 0) {
            newAnswers = [...state.assessmentAnswers];
            newAnswers[existing] = answer;
          } else {
            newAnswers = [...state.assessmentAnswers, answer];
          }
          return {
            assessmentAnswers: newAnswers,
            assessmentProgress: newAnswers.length / 20,
          };
        }),

      resetAssessment: () =>
        set({
          assessmentAnswers: [],
          assessmentProgress: 0,
          destinyResult: null,
        }),

      setDestinyResult: (result) => set({ destinyResult: result }),

      setPendingCharacter: (name, appearance) => set({ pendingCharacter: { name, appearance } }),
      clearPendingCharacter: () => set({ pendingCharacter: null }),

      createCharacter: (name, appearance) => {
        const state = get();
        if (!state.destinyResult) return;

        const char: CharacterData = {
          id: `char_${Date.now()}`,
          name,
          appearance,
          level: 1,
          exp: 0,
          expToNext: 100,
          classId: state.destinyResult.classId,
          subclassId: state.destinyResult.subclassId,
          rank: state.destinyResult.rank,
          stats: state.destinyResult.stats,
          personality: state.destinyResult.personality,
          mbti: state.destinyResult.mbti,
          mbtiDimensions: state.destinyResult.mbtiDimensions,
          zodiac: state.destinyResult.zodiac,
          chineseZodiac: state.destinyResult.chineseZodiac,
          region: state.destinyResult.region,
          storyArc: state.destinyResult.storyArc,
          reputation: state.destinyResult.reputation,
          createdAt: Date.now(),
          lastPlayed: Date.now(),
        };

        set({ character: char });
        set({ pendingCharacter: null });
        if (state.settings.autoSave) get().saveGame();
      },

      updateSettings: (newSettings) => {
        const currentSettings = get().settings;
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        if (newSettings.autoSave === true && !currentSettings.autoSave && get().character) {
          get().saveGame();
        }
      },

      saveGame: () => {
        const state = get();
        if (!state.character) return;

        const slot: SaveSlot = {
          id: `save_${Date.now()}`,
          character: {
            ...state.character,
            lastPlayed: Date.now(),
          },
          timestamp: Date.now(),
          playTime: 0,
        };

        set((state) => ({
          saveSlots: [slot, ...state.saveSlots].slice(0, 10),
        }));
      },

      loadGame: (slotId) => {
        const state = get();
        const slot = state.saveSlots.find((s) => s.id === slotId);
        if (!slot) return;

        set({
          character: slot.character,
          currentScreen: 'summary',
        });
      },

      deleteSave: (slotId) =>
        set((state) => ({
          saveSlots: state.saveSlots.filter((s) => s.id !== slotId),
        })),

      resetGame: () => {
        const { settings, saveSlots } = get();
        set({
          ...initialState,
          settings,
          saveSlots,
        });
      },
    }),
    {
      name: 'persona-rpg-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        settings: state.settings,
        saveSlots: state.saveSlots,
        character: state.character,
        destinyResult: state.destinyResult,
        pendingCharacter: state.pendingCharacter,
      }),
    }
  )
);
