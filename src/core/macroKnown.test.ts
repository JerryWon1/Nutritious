import { describe, expect, it } from "vitest";
import { getItemMacroDisplay, isItemMacroKnown, knownMacrosForResolved } from "./macroKnown";
import type { NutritionItem } from "./types";

describe("macroKnown", () => {
  const base: NutritionItem = {
    id: "x",
    name: "Test",
    restaurant: "R",
    aliases: [],
    calories: 400,
    protein: 20,
    carbs: 40,
    fat: 10
  };

  it("treats missing fiber/sugar on page items as unknown", () => {
    const known = knownMacrosForResolved(base, "page");
    expect(known.fiber).toBe(false);
    expect(known.sugar).toBe(false);
    expect(getItemMacroDisplay(base, "fiber", known)).toBeNull();
  });

  it("shows zero fiber when explicitly set", () => {
    const item = { ...base, fiber: 0, sugar: 2 };
    const known = knownMacrosForResolved(item, "page");
    expect(isItemMacroKnown(item, "fiber", known)).toBe(true);
    expect(getItemMacroDisplay(item, "fiber", known)).toBe(0);
  });

  it("database source marks optional macros known", () => {
    const known = knownMacrosForResolved({ ...base, fiber: 0, sugar: 0 }, "database");
    expect(known.fiber).toBe(true);
    expect(known.sugar).toBe(true);
  });
});
