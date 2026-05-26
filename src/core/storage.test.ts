import { describe, expect, it } from "vitest";
import { DEFAULT_GOALS, getGoalDayProgress, sanitizeGoalSettings } from "./storage";

describe("storage", () => {
  it("migrates legacy macroGoals-only storage shape", () => {
    const settings = sanitizeGoalSettings(undefined, {
      calories: 1800,
      protein: 150,
      carbs: 200,
      fat: 60
    });
    expect(settings.macroGoals.calories).toBe(1800);
    expect(settings.macroGoals.protein).toBe(150);
    expect(settings.macroGoals.carbs).toBe(200);
    expect(settings.macroGoals.fat).toBe(60);
    expect(settings.macroGoals.fiber).toBeGreaterThan(0);
    expect(settings.macroGoals.sugar).toBeGreaterThan(0);
    expect(settings.trackedMacros.calories).toBe(true);
    expect(settings.goalLengthDays).toBe(28);
    expect(settings.caloriesPerMealPercent).toBe(30);
  });

  it("clamps meal percent to 20–50", () => {
    const low = sanitizeGoalSettings({ caloriesPerMealPercent: 5 });
    const high = sanitizeGoalSettings({ caloriesPerMealPercent: 99 });
    expect(low.caloriesPerMealPercent).toBe(20);
    expect(high.caloriesPerMealPercent).toBe(50);
  });

  it("forces calories tracked even if disabled in input", () => {
    const settings = sanitizeGoalSettings({
      trackedMacros: { calories: false, protein: false, carbs: false, fat: false }
    });
    expect(settings.trackedMacros.calories).toBe(true);
  });

  it("getGoalDayProgress returns day 1 on start date", () => {
    const today = new Date().toISOString().slice(0, 10);
    const progress = getGoalDayProgress({
      macroGoals: DEFAULT_GOALS,
      trackedMacros: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        fiber: false,
        sugar: false
      },
      goalLengthDays: 28,
      goalStartDate: today,
      macroPreset: "custom",
      caloriesPerMealPercent: 30
    });
    expect(progress.dayNumber).toBe(1);
    expect(progress.totalDays).toBe(28);
  });
});
