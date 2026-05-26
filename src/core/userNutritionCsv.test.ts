import { describe, expect, it } from "vitest";
import { findUserNutritionMatch, parseNutritionCsv } from "./userNutritionCsv";

describe("userNutritionCsv", () => {
  it("parses minimal CSV with header", () => {
    const csv = `name,calories,protein,carbs,fat
Campus Bowl,500,35,45,12`;
    const rows = parseNutritionCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Campus Bowl");
    expect(rows[0].calories).toBe(500);
  });

  it("parses optional fiber and sugar columns", () => {
    const csv = `name,calories,protein,carbs,fat,fiber,sugar
Oat Bowl,350,12,55,8,9,6`;
    const rows = parseNutritionCsv(csv);
    expect(rows[0].fiber).toBe(9);
    expect(rows[0].sugar).toBe(6);
  });

  it("parses optional restaurant and aliases", () => {
    const csv = `name,calories,protein,carbs,fat,restaurant,aliases
Salad,300,20,25,10,Campus Cafe,bowl|greens`;
    const rows = parseNutritionCsv(csv);
    expect(rows[0].restaurant).toBe("Campus Cafe");
    expect(rows[0].aliases).toEqual(["bowl", "greens"]);
  });

  it("findUserNutritionMatch matches alias", () => {
    const rows = parseNutritionCsv(`name,calories,protein,carbs,fat,aliases
Power Bowl,400,30,40,10,greens bowl`);
    const match = findUserNutritionMatch(rows, "greens bowl");
    expect(match?.name).toBe("Power Bowl");
  });
});
