import { describe, expect, it } from "vitest";
import { defaultMacroGoals } from "./macroFields";
import { getMacroPercentages, macroDistance, mealFraction, safePercent } from "./macroMath";
import type { NutritionItem } from "./types";

const sampleItem: NutritionItem = {
  id: "test_item",
  name: "Test Bowl",
  restaurant: "Test Chain",
  aliases: [],
  calories: 600,
  protein: 40,
  carbs: 50,
  fat: 20
};

const goals = defaultMacroGoals();

describe("macroMath", () => {
  it("safePercent returns 0 when goal is zero", () => {
    expect(safePercent(100, 0)).toBe(0);
  });

  it("safePercent rounds percentage of goal", () => {
    expect(safePercent(600, 2000)).toBe(30);
  });

  it("getMacroPercentages omits disabled tracked macros", () => {
    const pcts = getMacroPercentages(sampleItem, goals, {
      calories: true,
      protein: true,
      carbs: false,
      fat: false,
      fiber: false,
      sugar: false
    });
    expect(pcts.calories).toBe(30);
    expect(pcts.protein).toBe(33);
    expect(pcts.carbs).toBe(0);
    expect(pcts.fat).toBe(0);
  });

  it("macroDistance uses only tracked macros", () => {
    const offTarget: NutritionItem = { ...sampleItem, calories: 900 };
    const full = macroDistance(offTarget, goals, { mealPercent: 30 });
    const calOnly = macroDistance(offTarget, goals, {
      trackedMacros: {
        calories: true,
        protein: false,
        carbs: false,
        fat: false,
        fiber: false,
        sugar: false
      },
      mealPercent: 30
    });
    const proteinOnly = macroDistance(offTarget, goals, {
      trackedMacros: {
        calories: false,
        protein: true,
        carbs: false,
        fat: false,
        fiber: false,
        sugar: false
      },
      mealPercent: 30
    });
    expect(calOnly).toBeGreaterThan(0);
    expect(full).toBeGreaterThan(calOnly);
    expect(proteinOnly).not.toBe(calOnly);
  });

  it("mealFraction converts percent to decimal", () => {
    expect(mealFraction({ caloriesPerMealPercent: 25 })).toBe(0.25);
  });
});
