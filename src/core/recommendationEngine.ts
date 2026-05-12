import { macroDistance, proteinPerCalorie } from "./macroMath";
import { NUTRITION_ITEMS } from "./nutritionDatabase";
import type { MacroGoals, NutritionItem } from "./types";

function scoreItem(candidate: NutritionItem, goals: MacroGoals): number {
  let score = 0;
  score += proteinPerCalorie(candidate) * 500;
  score -= macroDistance(candidate, goals) * 100;

  // Penalize very fat-heavy options when fat goal is modest.
  const fatTargetPerMeal = goals.fat * 0.3;
  if (candidate.fat > fatTargetPerMeal * 1.3) {
    score -= (candidate.fat - fatTargetPerMeal) * 1.5;
  }
  return score;
}

export function getRecommendations(item: NutritionItem, goals: MacroGoals): NutritionItem[] {
  const sameRestaurant = NUTRITION_ITEMS.filter(
    (candidate) => candidate.id !== item.id && candidate.restaurant === item.restaurant
  );
  const candidatePool = sameRestaurant.length >= 3
    ? sameRestaurant
    : NUTRITION_ITEMS.filter((candidate) => candidate.id !== item.id);

  return candidatePool
    .map((candidate) => ({ candidate, score: scoreItem(candidate, goals) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.candidate);
}
