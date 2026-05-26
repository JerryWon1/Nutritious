import { describe, expect, it } from "vitest";
import { defaultMacroGoals, defaultTrackedMacros, getItemMacro } from "./macroFields";
import type { NutritionItem } from "./types";

describe("macroFields", () => {
  it("defaults fiber and sugar goals", () => {
    const goals = defaultMacroGoals();
    expect(goals.fiber).toBe(28);
    expect(goals.sugar).toBe(50);
  });

  it("fiber and sugar off by default in tracked macros", () => {
    const tracked = defaultTrackedMacros();
    expect(tracked.fiber).toBe(false);
    expect(tracked.sugar).toBe(false);
  });

  it("getItemMacro returns 0 when fiber/sugar missing on item", () => {
    const item: NutritionItem = {
      id: "x",
      name: "X",
      restaurant: "R",
      aliases: [],
      calories: 100,
      protein: 10,
      carbs: 10,
      fat: 5
    };
    expect(getItemMacro(item, "fiber")).toBe(0);
    expect(getItemMacro({ ...item, fiber: 6 }, "fiber")).toBe(6);
    expect(getItemMacro({ ...item, fiber: 0 }, "fiber")).toBe(0);
  });
});
