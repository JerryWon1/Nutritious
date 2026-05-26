import { getItemMacro } from "./macroFields";
import { macroDistance, proteinPerCalorie } from "./macroMath";
import { NUTRITION_ITEMS } from "./nutritionDatabase";
import { rowToNutritionItem, type UserNutritionRow } from "./userNutritionCsv";
import { itemMatchesDietFilters, type DietFilterPrefs } from "./dietFlags";
import type { GoalSettings, NutritionItem } from "./types";

const WEAK_RESTAURANTS = new Set(["Estimated", "This page", "Custom", ""]);

export interface RecommendationResult {
  item: NutritionItem;
  reason: string;
}

function buildCandidatePool(
  item: NutritionItem,
  csvRows: UserNutritionRow[],
  dietFilters?: DietFilterPrefs
): NutritionItem[] {
  const csvItems = csvRows.map(rowToNutritionItem);
  const byId = new Map<string, NutritionItem>();
  for (const candidate of [...NUTRITION_ITEMS, ...csvItems]) {
    if (candidate.id !== item.id) {
      byId.set(candidate.id, candidate);
    }
  }
  let all = [...byId.values()];
  if (dietFilters) {
    all = all.filter((c) => itemMatchesDietFilters(c, dietFilters));
  }
  const sameRestaurant = all.filter((c) => c.restaurant === item.restaurant);
  return sameRestaurant.length >= 3 ? sameRestaurant : all;
}

function scoreItem(candidate: NutritionItem, settings: GoalSettings): number {
  const { macroGoals, trackedMacros, caloriesPerMealPercent } = settings;
  let score = 0;
  if (trackedMacros.protein) {
    score += proteinPerCalorie(candidate) * 500;
  }
  score -=
    macroDistance(candidate, macroGoals, {
      trackedMacros,
      mealPercent: caloriesPerMealPercent
    }) * 100;

  if (trackedMacros.fat) {
    const fatTargetPerMeal = macroGoals.fat * (caloriesPerMealPercent / 100);
    if (candidate.fat > fatTargetPerMeal * 1.3) {
      score -= (candidate.fat - fatTargetPerMeal) * 1.5;
    }
  }
  if (trackedMacros.sugar) {
    const sugarTargetPerMeal = macroGoals.sugar * (caloriesPerMealPercent / 100);
    const candSugar = getItemMacro(candidate, "sugar");
    if (candSugar > sugarTargetPerMeal * 1.2) {
      score -= (candSugar - sugarTargetPerMeal) * 2;
    }
  }
  if (trackedMacros.fiber) {
    const fiberTargetPerMeal = macroGoals.fiber * (caloriesPerMealPercent / 100);
    const candFiber = getItemMacro(candidate, "fiber");
    if (candFiber >= fiberTargetPerMeal * 0.8) {
      score += 8;
    }
  }
  return score;
}

function explainRecommendation(
  candidate: NutritionItem,
  current: NutritionItem,
  settings: GoalSettings
): string {
  const parts: string[] = [];
  if (settings.trackedMacros.protein && candidate.protein > current.protein) {
    parts.push("higher protein");
  }
  const distCurrent = macroDistance(current, settings.macroGoals, {
    trackedMacros: settings.trackedMacros,
    mealPercent: settings.caloriesPerMealPercent
  });
  const distCandidate = macroDistance(candidate, settings.macroGoals, {
    trackedMacros: settings.trackedMacros,
    mealPercent: settings.caloriesPerMealPercent
  });
  if (distCandidate < distCurrent - 0.05) {
    parts.push(`closer to your ${settings.caloriesPerMealPercent}% meal target`);
  } else if (settings.trackedMacros.calories && candidate.calories < current.calories) {
    parts.push("fewer calories");
  }
  if (
    settings.trackedMacros.sugar &&
    getItemMacro(candidate, "sugar") < getItemMacro(current, "sugar") - 1
  ) {
    parts.push("less sugar");
  }
  if (
    settings.trackedMacros.fiber &&
    getItemMacro(candidate, "fiber") > getItemMacro(current, "fiber") + 1
  ) {
    parts.push("more fiber");
  }
  if (parts.length === 0) {
    return "Balanced alternative for your goals";
  }
  const joined = parts.join(", ");
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

export function recommendationsUnavailableReason(item: NutritionItem): string | null {
  if (WEAK_RESTAURANTS.has(item.restaurant)) {
    return "Add a CSV with restaurant names or browse a supported chain (see docs/RESTAURANT_COVERAGE.md).";
  }
  return null;
}

export function getRecommendations(
  item: NutritionItem,
  settings: GoalSettings,
  csvRows: UserNutritionRow[] = [],
  dietFilters?: DietFilterPrefs
): RecommendationResult[] {
  const unavailable = recommendationsUnavailableReason(item);
  if (unavailable) {
    return [];
  }

  const pool = buildCandidatePool(item, csvRows, dietFilters);
  if (pool.length === 0) {
    return [];
  }

  return pool
    .map((candidate) => ({
      candidate,
      score: scoreItem(candidate, settings)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ candidate }) => ({
      item: candidate,
      reason: explainRecommendation(candidate, item, settings)
    }));
}
