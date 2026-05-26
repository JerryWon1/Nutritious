import { describe, expect, it } from "vitest";
import { normalizeMealLogState, sumMealLogItems } from "./mealLog";
import type { NutritionItem } from "./types";

describe("mealLog", () => {
  const item: NutritionItem = {
    id: "a",
    name: "Burger",
    restaurant: "Test",
    aliases: [],
    calories: 500,
    protein: 25,
    carbs: 40,
    fat: 20,
    fiber: 2,
    sugar: 8
  };

  it("sums quantities in meal log", () => {
    const totals = sumMealLogItems([
      { id: "1", item, addedAt: "", quantity: 2 },
      { id: "2", item: { ...item, id: "b", calories: 100 }, addedAt: "", quantity: 1 }
    ]);
    expect(totals.calories).toBe(1100);
    expect(totals.protein).toBe(75);
  });

  it("clears entries when log date is not today", () => {
    const state = normalizeMealLogState({
      date: "2000-01-01",
      entries: [{ id: "1", item, addedAt: "", quantity: 1 }]
    });
    expect(state.entries).toEqual([]);
  });
});
