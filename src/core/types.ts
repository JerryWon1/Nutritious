export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export type MacroKey = "calories" | "protein" | "carbs" | "fat" | "fiber" | "sugar";

export type MacroPreset = "custom" | "balanced" | "high_protein" | "low_carb";

export type TrackedMacros = Record<MacroKey, boolean>;

/** Best-effort diet / allergen flags; true = likely yes, false = likely no, undefined = unknown */
export type DietFlagKey = "vegetarian" | "vegan" | "glutenFree" | "dairyFree" | "nutFree";

export type DietFlags = Partial<Record<DietFlagKey, boolean>>;

export interface GoalSettings {
  macroGoals: MacroGoals;
  trackedMacros: TrackedMacros;
  goalLengthDays: number;
  goalStartDate: string;
  macroPreset: MacroPreset;
  caloriesPerMealPercent: number;
}

export interface NutritionItem {
  id: string;
  name: string;
  restaurant: string;
  aliases: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Grams; omitted in bundled DB rows default to 0 at read time */
  fiber?: number;
  /** Grams; omitted in bundled DB rows default to 0 at read time */
  sugar?: number;
  /** Official PDF filename when values were transcribed from chain nutrition PDFs. */
  nutritionSource?: string;
  /** Explicit diet/allergen overrides (merged with name-based inference) */
  diet?: DietFlags;
}

export interface ExtensionSettings {
  overlayEnabled: boolean;
}

export interface StoredState {
  goalSettings: GoalSettings;
  overlayEnabled: boolean;
}
