import { describe, expect, it } from "vitest";
import { applyPresetToGoals, PRESET_SPLITS } from "./goalPresets";

describe("goalPresets", () => {
  it("defines splits for all non-custom presets", () => {
    expect(PRESET_SPLITS.balanced).toBeDefined();
    expect(PRESET_SPLITS.high_protein).toBeDefined();
    expect(PRESET_SPLITS.low_carb).toBeDefined();
  });

  it("applyPresetToGoals produces positive grams from calories", () => {
    const result = applyPresetToGoals(2000, "balanced");
    expect(result.calories).toBe(2000);
    expect(result.protein).toBeGreaterThan(0);
    expect(result.carbs).toBeGreaterThan(0);
    expect(result.fat).toBeGreaterThan(0);
  });

  it("high_protein preset yields more protein than low_carb at same calories", () => {
    const hp = applyPresetToGoals(2000, "high_protein");
    const lc = applyPresetToGoals(2000, "low_carb");
    expect(hp.protein).toBeGreaterThan(lc.protein);
  });
});
