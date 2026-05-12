import type { MacroGoals, NutritionItem } from "./types";

export interface MacroPercentages {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function safePercent(value: number, goal: number): number {
  if (goal <= 0) {
    return 0;
  }
  return Math.round((value / goal) * 100);
}

export function getMacroPercentages(item: NutritionItem, goals: MacroGoals): MacroPercentages {
  return {
    calories: safePercent(item.calories, goals.calories),
    protein: safePercent(item.protein, goals.protein),
    carbs: safePercent(item.carbs, goals.carbs),
    fat: safePercent(item.fat, goals.fat)
  };
}

export function proteinPerCalorie(item: NutritionItem): number {
  return item.calories > 0 ? item.protein / item.calories : 0;
}

export function macroDistance(item: NutritionItem, goals: MacroGoals): number {
  // Lower is better. This keeps rules understandable for the MVP.
  const calorieDelta = Math.abs(item.calories - goals.calories * 0.3) / goals.calories;
  const proteinDelta = Math.abs(item.protein - goals.protein * 0.3) / goals.protein;
  const carbsDelta = Math.abs(item.carbs - goals.carbs * 0.3) / goals.carbs;
  const fatDelta = Math.abs(item.fat - goals.fat * 0.3) / goals.fat;
  return calorieDelta + proteinDelta + carbsDelta + fatDelta;
}
