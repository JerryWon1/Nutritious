import { describe, expect, it } from "vitest";
import { findNutritionItemByName, NUTRITION_ITEMS, normalizeFoodName } from "./nutritionDatabase";

describe("nutritionDatabase", () => {
  it("has roughly 2x launch target item count", () => {
    expect(NUTRITION_ITEMS.length).toBeGreaterThanOrEqual(90);
  });

  it("includes new launch chains Burger King, Panera, Five Guys", () => {
    const restaurants = new Set(NUTRITION_ITEMS.map((i) => i.restaurant));
    expect(restaurants.has("Burger King")).toBe(true);
    expect(restaurants.has("Panera")).toBe(true);
    expect(restaurants.has("Five Guys")).toBe(true);
  });

  it("findNutritionItemByName resolves alias", () => {
    const item = findNutritionItemByName("quarter pounder with cheese");
    expect(item).not.toBeNull();
    expect(item!.restaurant).toBe("McDonald's");
  });

  it("normalizeFoodName lowercases and strips punctuation", () => {
    expect(normalizeFoodName("Filet-O-Fish")).toBe("filet o fish");
  });

  it("McDonald's has at least 3 items for same-restaurant recommendations", () => {
    const mcCount = NUTRITION_ITEMS.filter((i) => i.restaurant === "McDonald's").length;
    expect(mcCount).toBeGreaterThanOrEqual(3);
  });

  it("every item has unique id", () => {
    const ids = NUTRITION_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has fiber and sugar defined", () => {
    const missingFiber = NUTRITION_ITEMS.filter((i) => i.fiber == null);
    const missingSugar = NUTRITION_ITEMS.filter((i) => i.sugar == null);
    expect(missingFiber).toEqual([]);
    expect(missingSugar).toEqual([]);
  });

  it("prefers detected restaurant on fuzzy match", () => {
    const item = findNutritionItemByName("egg mcmuffin", "McDonald's");
    expect(item).not.toBeNull();
    expect(item!.restaurant).toBe("McDonald's");
  });
});
