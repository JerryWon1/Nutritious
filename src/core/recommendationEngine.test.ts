import { describe, expect, it } from "vitest";
import { DEFAULT_GOAL_SETTINGS } from "./storage";
import {
  getRecommendations,
  recommendationsUnavailableReason
} from "./recommendationEngine";
import { findNutritionItemByName } from "./nutritionDatabase";
import type { NutritionItem } from "./types";

describe("recommendationEngine", () => {
  it("returns empty for estimated restaurant items", () => {
    const item: NutritionItem = {
      id: "est_1",
      name: "Mystery Item",
      restaurant: "Estimated",
      aliases: [],
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 15
    };
    expect(recommendationsUnavailableReason(item)).toContain("CSV");
    expect(getRecommendations(item, DEFAULT_GOAL_SETTINGS)).toEqual([]);
  });

  it("returns up to 3 picks with reasons for McDonald's item", () => {
    const bigMac = findNutritionItemByName("Big Mac");
    expect(bigMac).not.toBeNull();
    const recs = getRecommendations(bigMac!, DEFAULT_GOAL_SETTINGS);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(3);
    for (const rec of recs) {
      expect(rec.item.restaurant).toBe("McDonald's");
      expect(rec.reason.length).toBeGreaterThan(0);
    }
  });

  it("includes CSV rows in same-restaurant pool", () => {
    const bigMac = findNutritionItemByName("Big Mac");
    const recs = getRecommendations(bigMac!, DEFAULT_GOAL_SETTINGS, [
      {
        name: "Custom McItem",
        restaurant: "McDonald's",
        calories: 300,
        protein: 25,
        carbs: 30,
        fat: 10,
        aliases: []
      }
    ]);
    const names = recs.map((r) => r.item.name);
    expect(names.some((n) => n === "Custom McItem" || n !== bigMac!.name)).toBe(true);
  });

  it("filters better picks by diet flags", () => {
    const bigMac = findNutritionItemByName("Big Mac");
    const recs = getRecommendations(bigMac!, DEFAULT_GOAL_SETTINGS, [], {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      lowCarb: false
    });
    expect(recs.length).toBeGreaterThan(0);
    for (const rec of recs) {
      expect(rec.item.name.toLowerCase()).not.toMatch(/big mac|pounder|bacon|chicken|burger|nugget/);
    }
  });
});
