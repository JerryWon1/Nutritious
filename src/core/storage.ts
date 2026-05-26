import { defaultMacroGoals, defaultTrackedMacros } from "./macroFields";
import {
  DEFAULT_DIET_FILTER_PREFS,
  sanitizeDietFilterPrefs,
  type DietFilterPrefs
} from "./dietFlags";
import { normalizeMealLogState, type MealLogState } from "./mealLog";
import type { GoalSettings, MacroGoals, MacroKey, MacroPreset, StoredState, TrackedMacros } from "./types";

export const DEFAULT_GOALS: MacroGoals = defaultMacroGoals();

export const DEFAULT_TRACKED_MACROS: TrackedMacros = defaultTrackedMacros();

export const DEFAULT_GOAL_LENGTH_DAYS = 28;
export const DEFAULT_MEAL_PERCENT = 30;

export const DEFAULT_GOAL_SETTINGS: GoalSettings = {
  macroGoals: DEFAULT_GOALS,
  trackedMacros: DEFAULT_TRACKED_MACROS,
  goalLengthDays: DEFAULT_GOAL_LENGTH_DAYS,
  goalStartDate: new Date().toISOString().slice(0, 10),
  macroPreset: "custom",
  caloriesPerMealPercent: DEFAULT_MEAL_PERCENT
};

export const DEFAULT_STATE: StoredState = {
  goalSettings: DEFAULT_GOAL_SETTINGS,
  overlayEnabled: true
};

const KEYS = {
  goalSettings: "goalSettings",
  macroGoals: "macroGoals",
  overlayEnabled: "overlayEnabled",
  mealLog: "mealLog",
  dietFilters: "dietFilters"
} as const;

const GOAL_LENGTH_OPTIONS = [7, 14, 28, 90] as const;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function sanitizeGoalValue(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}

function sanitizeGoals(goals: unknown): MacroGoals {
  const candidate = (goals ?? {}) as Partial<MacroGoals>;
  const base = defaultMacroGoals();
  return {
    calories: sanitizeGoalValue(candidate.calories, base.calories),
    protein: sanitizeGoalValue(candidate.protein, base.protein),
    carbs: sanitizeGoalValue(candidate.carbs, base.carbs),
    fat: sanitizeGoalValue(candidate.fat, base.fat),
    fiber: sanitizeGoalValue(candidate.fiber, base.fiber),
    sugar: sanitizeGoalValue(candidate.sugar, base.sugar)
  };
}

function sanitizeTrackedMacros(raw: unknown): TrackedMacros {
  const defaults = defaultTrackedMacros();
  const candidate = (raw ?? {}) as Partial<TrackedMacros>;
  const tracked = { ...defaults };
  for (const key of Object.keys(defaults) as MacroKey[]) {
    if (typeof candidate[key] === "boolean") {
      tracked[key] = candidate[key] as boolean;
    }
  }
  tracked.calories = true;
  const anyEnabled = (Object.keys(tracked) as MacroKey[]).some((k) => tracked[k]);
  if (!anyEnabled) {
    return { ...DEFAULT_TRACKED_MACROS };
  }
  return tracked;
}

function sanitizePreset(raw: unknown): MacroPreset {
  if (raw === "balanced" || raw === "high_protein" || raw === "low_carb" || raw === "custom") {
    return raw;
  }
  return "custom";
}

function sanitizeGoalLengthDays(raw: unknown): number {
  const n = typeof raw === "number" && !Number.isNaN(raw) ? Math.round(raw) : DEFAULT_GOAL_LENGTH_DAYS;
  if ((GOAL_LENGTH_OPTIONS as readonly number[]).includes(n)) {
    return n;
  }
  return n >= 1 ? n : DEFAULT_GOAL_LENGTH_DAYS;
}

function sanitizeMealPercent(raw: unknown): number {
  const n =
    typeof raw === "number" && !Number.isNaN(raw)
      ? Math.round(raw)
      : DEFAULT_GOAL_SETTINGS.caloriesPerMealPercent;
  return Math.min(50, Math.max(20, n));
}

function sanitizeStartDate(raw: unknown): string {
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  return todayIso();
}

export function sanitizeGoalSettings(raw: unknown, legacyMacroGoals?: unknown): GoalSettings {
  const candidate = (raw ?? {}) as Partial<GoalSettings>;
  const macroGoals = sanitizeGoals(
    candidate.macroGoals ?? legacyMacroGoals ?? DEFAULT_GOALS
  );
  return {
    macroGoals,
    trackedMacros: sanitizeTrackedMacros(candidate.trackedMacros),
    goalLengthDays: sanitizeGoalLengthDays(candidate.goalLengthDays),
    goalStartDate: sanitizeStartDate(candidate.goalStartDate),
    macroPreset: sanitizePreset(candidate.macroPreset),
    caloriesPerMealPercent: sanitizeMealPercent(candidate.caloriesPerMealPercent)
  };
}

export async function getGoalSettings(): Promise<GoalSettings> {
  const raw = await chrome.storage.sync.get([KEYS.goalSettings, KEYS.macroGoals]);
  return sanitizeGoalSettings(raw[KEYS.goalSettings], raw[KEYS.macroGoals]);
}

export async function getStoredState(): Promise<StoredState> {
  const raw = await chrome.storage.sync.get([
    KEYS.goalSettings,
    KEYS.macroGoals,
    KEYS.overlayEnabled
  ]);
  return {
    goalSettings: sanitizeGoalSettings(raw[KEYS.goalSettings], raw[KEYS.macroGoals]),
    overlayEnabled:
      typeof raw[KEYS.overlayEnabled] === "boolean"
        ? raw[KEYS.overlayEnabled]
        : DEFAULT_STATE.overlayEnabled
  };
}

export async function saveGoalSettings(
  settings: GoalSettings,
  options?: { resetGoalStart?: boolean }
): Promise<GoalSettings> {
  const previous = await getGoalSettings();
  const sanitized = sanitizeGoalSettings({
    ...settings,
    goalStartDate:
      options?.resetGoalStart ||
      settings.goalLengthDays !== previous.goalLengthDays
        ? todayIso()
        : settings.goalStartDate
  });
  await chrome.storage.sync.set({
    [KEYS.goalSettings]: sanitized
  });
  return sanitized;
}

/** @deprecated Use saveGoalSettings */
export async function saveMacroGoals(goals: MacroGoals): Promise<void> {
  const current = await getGoalSettings();
  await saveGoalSettings({ ...current, macroGoals: sanitizeGoals(goals) });
}

export async function saveOverlayEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.sync.set({
    [KEYS.overlayEnabled]: enabled
  });
}

export function getGoalDayProgress(settings: GoalSettings): {
  dayNumber: number;
  totalDays: number;
  endDate: string;
} {
  const start = new Date(settings.goalStartDate + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diffMs = today.getTime() - start.getTime();
  const dayNumber = Math.max(1, Math.floor(diffMs / 86400000) + 1);
  const totalDays = settings.goalLengthDays;
  const end = new Date(start);
  end.setDate(end.getDate() + totalDays - 1);
  const endDate = end.toISOString().slice(0, 10);
  return {
    dayNumber: Math.min(dayNumber, totalDays),
    totalDays,
    endDate
  };
}

export async function getDietFilterPrefs(): Promise<DietFilterPrefs> {
  const raw = await chrome.storage.sync.get(KEYS.dietFilters);
  return sanitizeDietFilterPrefs(raw[KEYS.dietFilters]);
}

export async function saveDietFilterPrefs(prefs: DietFilterPrefs): Promise<DietFilterPrefs> {
  const sanitized = sanitizeDietFilterPrefs(prefs);
  await chrome.storage.sync.set({ [KEYS.dietFilters]: sanitized });
  return sanitized;
}

export { DEFAULT_DIET_FILTER_PREFS };

export async function getMealLog(): Promise<MealLogState> {
  const raw = await chrome.storage.local.get(KEYS.mealLog);
  return normalizeMealLogState(raw[KEYS.mealLog]);
}

export async function saveMealLog(state: MealLogState): Promise<MealLogState> {
  const normalized = normalizeMealLogState(state);
  await chrome.storage.local.set({ [KEYS.mealLog]: normalized });
  return normalized;
}

export async function notifySettingsUpdated(): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, { type: "NUTRITIOUS_SETTINGS_UPDATED" });
    }
  } catch {
    /* content script may not be injected */
  }
}
