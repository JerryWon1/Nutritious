import type { MacroGoals, StoredState } from "./types";

export const DEFAULT_GOALS: MacroGoals = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fat: 70
};

export const DEFAULT_STATE: StoredState = {
  macroGoals: DEFAULT_GOALS,
  overlayEnabled: true
};

const KEYS = {
  macroGoals: "macroGoals",
  overlayEnabled: "overlayEnabled"
} as const;

function sanitizeGoalValue(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}

function sanitizeGoals(goals: unknown): MacroGoals {
  const candidate = (goals ?? {}) as Partial<MacroGoals>;
  return {
    calories: sanitizeGoalValue(candidate.calories, DEFAULT_GOALS.calories),
    protein: sanitizeGoalValue(candidate.protein, DEFAULT_GOALS.protein),
    carbs: sanitizeGoalValue(candidate.carbs, DEFAULT_GOALS.carbs),
    fat: sanitizeGoalValue(candidate.fat, DEFAULT_GOALS.fat)
  };
}

export async function getStoredState(): Promise<StoredState> {
  const raw = await chrome.storage.sync.get([KEYS.macroGoals, KEYS.overlayEnabled]);
  return {
    macroGoals: sanitizeGoals(raw[KEYS.macroGoals]),
    overlayEnabled:
      typeof raw[KEYS.overlayEnabled] === "boolean"
        ? raw[KEYS.overlayEnabled]
        : DEFAULT_STATE.overlayEnabled
  };
}

export async function saveMacroGoals(goals: MacroGoals): Promise<void> {
  await chrome.storage.sync.set({
    [KEYS.macroGoals]: sanitizeGoals(goals)
  });
}

export async function saveOverlayEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.sync.set({
    [KEYS.overlayEnabled]: enabled
  });
}
