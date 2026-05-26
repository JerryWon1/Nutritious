import type { MacroGoals, MacroKey, NutritionItem } from "./types";

export const MACRO_KEYS: readonly MacroKey[] = [
  "calories",
  "protein",
  "carbs",
  "fat",
  "fiber",
  "sugar"
] as const;

export interface MacroFieldMeta {
  key: MacroKey;
  label: string;
  unit: string;
  ringStroke: string;
  /** Default daily goal when not set */
  defaultGoal: number;
  /** Default tracked on first install */
  defaultTracked: boolean;
  isCalorie: boolean;
}

export const MACRO_FIELD_META: Record<MacroKey, MacroFieldMeta> = {
  calories: {
    key: "calories",
    label: "Calories",
    unit: "cal",
    ringStroke: "#e8b44f",
    defaultGoal: 2000,
    defaultTracked: true,
    isCalorie: true
  },
  protein: {
    key: "protein",
    label: "Protein",
    unit: "g",
    ringStroke: "#5ce19b",
    defaultGoal: 120,
    defaultTracked: true,
    isCalorie: false
  },
  carbs: {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    ringStroke: "#7eb8ff",
    defaultGoal: 250,
    defaultTracked: true,
    isCalorie: false
  },
  fat: {
    key: "fat",
    label: "Fat",
    unit: "g",
    ringStroke: "#f078a6",
    defaultGoal: 70,
    defaultTracked: true,
    isCalorie: false
  },
  fiber: {
    key: "fiber",
    label: "Fiber",
    unit: "g",
    ringStroke: "#b88cff",
    defaultGoal: 28,
    defaultTracked: false,
    isCalorie: false
  },
  sugar: {
    key: "sugar",
    label: "Sugar",
    unit: "g",
    ringStroke: "#ff9f6b",
    defaultGoal: 50,
    defaultTracked: false,
    isCalorie: false
  }
};

export type MacroPercentages = Record<MacroKey, number>;

export function getItemMacro(item: NutritionItem, key: MacroKey): number {
  const display =
    key === "calories"
      ? item.calories
      : key === "protein"
        ? item.protein
        : key === "carbs"
          ? item.carbs
          : key === "fat"
            ? item.fat
            : item[key];
  return typeof display === "number" ? display : 0;
}

export function getGoalMacro(goals: MacroGoals, key: MacroKey): number {
  return goals[key];
}

export function defaultMacroGoals(): MacroGoals {
  return {
    calories: MACRO_FIELD_META.calories.defaultGoal,
    protein: MACRO_FIELD_META.protein.defaultGoal,
    carbs: MACRO_FIELD_META.carbs.defaultGoal,
    fat: MACRO_FIELD_META.fat.defaultGoal,
    fiber: MACRO_FIELD_META.fiber.defaultGoal,
    sugar: MACRO_FIELD_META.sugar.defaultGoal
  };
}

export function defaultTrackedMacros(): Record<MacroKey, boolean> {
  return Object.fromEntries(
    MACRO_KEYS.map((k) => [k, MACRO_FIELD_META[k].defaultTracked])
  ) as Record<MacroKey, boolean>;
}
