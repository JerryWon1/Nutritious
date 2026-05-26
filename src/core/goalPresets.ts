import { defaultMacroGoals } from "./macroFields";
import type { MacroGoals, MacroPreset } from "./types";

/** Share of non-fat calories from protein and carbs (fat has its own % of total calories). */
export interface MacroSplitPercents {
  proteinCaloriePercent: number;
  carbCaloriePercent: number;
  fatCaloriePercent: number;
}

export const PRESET_SPLITS: Record<Exclude<MacroPreset, "custom">, MacroSplitPercents> = {
  balanced: { proteinCaloriePercent: 25, carbCaloriePercent: 45, fatCaloriePercent: 30 },
  high_protein: { proteinCaloriePercent: 35, carbCaloriePercent: 35, fatCaloriePercent: 30 },
  low_carb: { proteinCaloriePercent: 30, carbCaloriePercent: 25, fatCaloriePercent: 45 }
};

export function applyPresetToGoals(calories: number, preset: Exclude<MacroPreset, "custom">): MacroGoals {
  const split = PRESET_SPLITS[preset];
  const protein = Math.round((calories * (split.proteinCaloriePercent / 100)) / 4);
  const carbs = Math.round((calories * (split.carbCaloriePercent / 100)) / 4);
  const fat = Math.round((calories * (split.fatCaloriePercent / 100)) / 9);
  const defaults = defaultMacroGoals();
  return {
    calories: Math.round(calories),
    protein: Math.max(1, protein),
    carbs: Math.max(1, carbs),
    fat: Math.max(1, fat),
    fiber: defaults.fiber,
    sugar: defaults.sugar
  };
}
