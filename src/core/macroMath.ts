import {
  getGoalMacro,
  getItemMacro,
  MACRO_KEYS,
  type MacroPercentages
} from "./macroFields";
import { isItemMacroKnown, type MacroKnownMap } from "./macroKnown";
import type { GoalSettings, MacroGoals, NutritionItem, TrackedMacros } from "./types";

export type { MacroPercentages } from "./macroFields";

export function mealFraction(settings: Pick<GoalSettings, "caloriesPerMealPercent">): number {
  return settings.caloriesPerMealPercent / 100;
}

export function safePercent(value: number, goal: number): number {
  if (goal <= 0) {
    return 0;
  }
  return Math.round((value / goal) * 100);
}

export function getMacroPercentages(
  item: NutritionItem,
  goals: MacroGoals,
  trackedMacros?: TrackedMacros,
  knownMacros?: MacroKnownMap
): MacroPercentages {
  const tracked = trackedMacros ?? {
    calories: true,
    protein: true,
    carbs: true,
    fat: true,
    fiber: false,
    sugar: false
  };
  const result = {} as MacroPercentages;
  for (const key of MACRO_KEYS) {
    if (!tracked[key] || !isItemMacroKnown(item, key, knownMacros)) {
      result[key] = 0;
      continue;
    }
    result[key] = safePercent(getItemMacro(item, key), getGoalMacro(goals, key));
  }
  return result;
}

export function sumItemsMacros(items: NutritionItem[]): NutritionItem {
  const totals: NutritionItem = {
    id: "sum",
    name: "Sum",
    restaurant: "",
    aliases: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  let hasFiber = false;
  let hasSugar = false;
  for (const item of items) {
    totals.calories += item.calories;
    totals.protein += item.protein;
    totals.carbs += item.carbs;
    totals.fat += item.fat;
    if (item.fiber != null) {
      hasFiber = true;
      totals.fiber = (totals.fiber ?? 0) + item.fiber;
    }
    if (item.sugar != null) {
      hasSugar = true;
      totals.sugar = (totals.sugar ?? 0) + item.sugar;
    }
  }
  if (!hasFiber) {
    delete totals.fiber;
  }
  if (!hasSugar) {
    delete totals.sugar;
  }
  return totals;
}

export function proteinPerCalorie(item: NutritionItem): number {
  return item.calories > 0 ? item.protein / item.calories : 0;
}

export function macroDistance(
  item: NutritionItem,
  goals: MacroGoals,
  options?: {
    trackedMacros?: TrackedMacros;
    mealPercent?: number;
  }
): number {
  const tracked = options?.trackedMacros ?? {
    calories: true,
    protein: true,
    carbs: true,
    fat: true,
    fiber: false,
    sugar: false
  };
  const mealFrac = (options?.mealPercent ?? 30) / 100;
  let total = 0;
  let count = 0;

  for (const key of MACRO_KEYS) {
    if (!tracked[key]) {
      continue;
    }
    const goalVal = getGoalMacro(goals, key);
    if (goalVal <= 0) {
      continue;
    }
    if (!isItemMacroKnown(item, key)) {
      continue;
    }
    const itemVal = getItemMacro(item, key);
    const target = goalVal * mealFrac;
    total += Math.abs(itemVal - target) / goalVal;
    count += 1;
  }

  return count > 0 ? total : 0;
}
