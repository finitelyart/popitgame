import { create } from 'zustand';

type GameMode = 'freePlay' | 'popRace' | 'memoryPop' | 'alphabetPop';

interface AppState {
  currentMode: GameMode;
  unlockedToys: string[]; // e.g., ['square', 'circle']
  selectedToy: string;
  totalStars: number;
  settings: {
    masterVolume: number;
    musicOn: boolean;
    reducedMotion: boolean;
  };
  setMode: (mode: GameMode) => void;
  unlockToy: (toy: string) => void;
  addStars: (stars: number) => void;
  setMasterVolume: (volume: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentMode: 'freePlay',
  unlockedToys: ['square'],
  selectedToy: 'square',
  totalStars: 0,
  settings: {
    masterVolume: 0.8,
    musicOn: true,
    reducedMotion: false,
  },
  setMode: (mode) => set({ currentMode: mode }),
  unlockToy: (toy) => set((state) => ({ unlockedToys: [...state.unlockedToys, toy] })),
  addStars: (stars) => set((state) => ({ totalStars: state.totalStars + stars })),
  setMasterVolume: (volume) => set((state) => ({
    settings: { ...state.settings, masterVolume: volume }
  })),
}));