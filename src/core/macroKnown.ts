import type { MacroKey, NutritionItem } from "./types";
import type { NutritionSource } from "./nutritionResolver";

export type MacroKnownMap = Record<MacroKey, boolean>;

const CORE_MACROS: MacroKey[] = ["calories", "protein", "carbs", "fat"];
const OPTIONAL_MACROS: MacroKey[] = ["fiber", "sugar"];

export function allMacrosKnown(): MacroKnownMap {
  return {
    calories: true,
    protein: true,
    carbs: true,
    fat: true,
    fiber: true,
    sugar: true
  };
}

export function knownMacrosForResolved(
  item: NutritionItem,
  source: NutritionSource
): MacroKnownMap {
  const known = allMacrosKnown();
  if (source === "database" || source === "csv" || source === "estimated") {
    return known;
  }
  for (const key of OPTIONAL_MACROS) {
    known[key] = item[key] !== undefined;
  }
  return known;
}

export function isItemMacroKnown(
  item: NutritionItem,
  key: MacroKey,
  known?: MacroKnownMap
): boolean {
  if (known) {
    return known[key];
  }
  if (CORE_MACROS.includes(key)) {
    return true;
  }
  return item[key] !== undefined;
}

/** Display value for UI; null means show em dash */
export function getItemMacroDisplay(
  item: NutritionItem,
  key: MacroKey,
  known?: MacroKnownMap
): number | null {
  if (!isItemMacroKnown(item, key, known)) {
    return null;
  }
  const v = item[key];
  if (v === undefined) {
    return null;
  }
  return typeof v === "number" ? v : null;
}
