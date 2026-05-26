import { describe, expect, it } from "vitest";
import {
  getItemDietFlags,
  itemMatchesDietFilters,
  itemSatisfiesDietFlag
} from "./dietFlags";
import { findNutritionItemByName } from "./nutritionDatabase";
import type { NutritionItem } from "./types";

describe("dietFlags", () => {
  it("marks Big Mac as not vegetarian", () => {
    const item = findNutritionItemByName("Big Mac");
    expect(item).not.toBeNull();
    expect(itemSatisfiesDietFlag(item!, "vegetarian")).toBe(false);
  });

  it("marks fries as vegetarian when inferred", () => {
    const item = findNutritionItemByName("fries");
    expect(item).not.toBeNull();
    const flags = getItemDietFlags(item!);
    expect(flags.vegetarian).toBe(true);
  });

  it("filters items by active prefs", () => {
    const item: NutritionItem = {
      id: "salad",
      name: "Side Salad",
      restaurant: "Test",
      aliases: [],
      calories: 50,
      protein: 2,
      carbs: 8,
      fat: 2,
      diet: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true, nutFree: true }
    };
    const burger: NutritionItem = {
      id: "burger",
      name: "Cheeseburger",
      restaurant: "Test",
      aliases: [],
      calories: 500,
      protein: 25,
      carbs: 40,
      fat: 25
    };
    const vegOnly = { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false, nutFree: false, lowCarb: false };
    expect(itemMatchesDietFilters(item, vegOnly)).toBe(true);
    expect(itemMatchesDietFilters(burger, vegOnly)).toBe(false);
  });

  it("Egg McMuffin is not dairy-free or vegetarian (cheese and Canadian bacon)", () => {
    const item = findNutritionItemByName("egg mcmuffin");
    expect(item).not.toBeNull();
    const flags = getItemDietFlags(item!);
    expect(flags.dairyFree).toBe(false);
    expect(flags.vegetarian).toBe(false);
    expect(flags.vegan).toBe(false);
    expect(flags.glutenFree).toBe(false);
  });

  it("respects explicit diet overrides on item", () => {
    const item: NutritionItem = {
      id: "x",
      name: "Mystery Bowl",
      restaurant: "Test",
      aliases: [],
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 10,
      diet: { vegetarian: true }
    };
    expect(getItemDietFlags(item).vegetarian).toBe(true);
  });
});
