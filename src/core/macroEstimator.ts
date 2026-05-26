import { findClosestNutritionItem } from "./nutritionDatabase";
import type { NutritionItem } from "./types";

export interface EstimatedNutrition {
  item: NutritionItem;
  confidence: "low" | "medium";
  note: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Free local heuristic estimator for unknown food names.
export function estimateNutritionFromName(rawName: string): EstimatedNutrition {
  const name = rawName.trim();
  const lower = name.toLowerCase();

  let protein = 20;
  let carbs = 35;
  let fat = 14;
  let fiber = 4;
  let sugar = 12;
  const reasons: string[] = [];

  if (/(salad|veggie|vegetable)/.test(lower)) {
    carbs -= 10;
    fat -= 3;
    fiber += 6;
    sugar -= 4;
    reasons.push("vegetable/salad keyword");
  }
  if (/(bowl|rice|burrito|pasta|noodle)/.test(lower)) {
    carbs += 18;
    reasons.push("grain-heavy keyword");
  }
  if (/(grilled|chicken|turkey|tuna|steak|egg|protein)/.test(lower)) {
    protein += 14;
    reasons.push("lean protein keyword");
  }
  if (/(fried|crispy|breaded|burger|fries|cheese|bacon|mayo)/.test(lower)) {
    fat += 10;
    protein += 2;
    sugar += 4;
    fiber -= 2;
    reasons.push("fried/high-fat keyword");
  }
  if (/(dessert|cookie|cake|shake|soda|sweet|frappuccino|syrup)/.test(lower)) {
    sugar += 18;
    fiber -= 1;
    reasons.push("sweet/dessert keyword");
  }
  if (/(wrap|sandwich|taco|quesadilla)/.test(lower)) {
    carbs += 10;
    fat += 4;
    reasons.push("wrap/sandwich keyword");
  }

  protein = clamp(Math.round(protein), 8, 55);
  carbs = clamp(Math.round(carbs), 8, 90);
  fat = clamp(Math.round(fat), 4, 45);
  fiber = clamp(Math.round(fiber), 0, 25);
  sugar = clamp(Math.round(sugar), 0, 80);
  let calories = Math.round(protein * 4 + carbs * 4 + fat * 9);

  const closest = findClosestNutritionItem(name);
  let noteParts: string[] = [];
  if (reasons.length > 0) {
    noteParts.push(`Keywords: ${reasons.join(", ")}`);
  } else {
    noteParts.push("Generic fast-casual meal profile");
  }

  if (closest && closest.score >= 0.12) {
    const t = closest.item;
    const templateCal = Math.max(1, t.calories);
    const scale = calories / templateCal;
    protein = clamp(Math.round(t.protein * scale), 4, 80);
    carbs = clamp(Math.round(t.carbs * scale), 4, 120);
    fat = clamp(Math.round(t.fat * scale), 2, 70);
    fiber = clamp(Math.round((t.fiber ?? fiber) * scale), 0, 25);
    sugar = clamp(Math.round((t.sugar ?? sugar) * scale), 0, 80);
    calories = Math.round(protein * 4 + carbs * 4 + fat * 9);
    const src = t.nutritionSource ? ` (${t.nutritionSource})` : "";
    noteParts.push(
      `Macros scaled from closest database match "${t.name}" at ${t.restaurant}${src}; token overlap ${Math.round(closest.score * 100)}%.`
    );
  }

  const confidence: "low" | "medium" =
    closest && closest.score >= 0.12 ? "medium" : reasons.length >= 2 ? "medium" : "low";
  const note = `Estimated nutrition. ${noteParts.join(" ")}`;

  return {
    item: {
      id: `estimated_${slugify(name) || "meal"}`,
      name,
      restaurant: "Estimated",
      aliases: [],
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar
    },
    confidence,
    note
  };
}
