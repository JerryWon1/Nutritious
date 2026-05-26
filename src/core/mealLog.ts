import type { MacroPercentages } from "./macroFields";
import { getMacroPercentages } from "./macroMath";
import type { GoalSettings, MacroGoals, MacroKey, NutritionItem, TrackedMacros } from "./types";

export interface MealLogEntry {
  id: string;
  item: NutritionItem;
  addedAt: string;
  quantity: number;
}

export interface MealLogState {
  /** ISO date (local) for daily bucket */
  date: string;
  entries: MealLogEntry[];
}

export function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function emptyMealLogState(): MealLogState {
  return { date: todayLocalDate(), entries: [] };
}

export function normalizeMealLogState(raw: unknown): MealLogState {
  const today = todayLocalDate();
  if (!raw || typeof raw !== "object") {
    return emptyMealLogState();
  }
  const candidate = raw as Partial<MealLogState>;
  const date =
    typeof candidate.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(candidate.date)
      ? candidate.date
      : today;
  const entries: MealLogEntry[] = [];
  if (Array.isArray(candidate.entries)) {
    for (const e of candidate.entries) {
      if (!e || typeof e !== "object") {
        continue;
      }
      const row = e as Partial<MealLogEntry>;
      const item = row.item;
      if (!item || typeof item.name !== "string" || typeof item.calories !== "number") {
        continue;
      }
      const qty =
        typeof row.quantity === "number" && row.quantity > 0 && row.quantity <= 20
          ? Math.round(row.quantity)
          : 1;
      entries.push({
        id: typeof row.id === "string" ? row.id : `meal_${Date.now()}_${entries.length}`,
        item: {
          id: String(item.id ?? `meal_item_${entries.length}`),
          name: item.name,
          restaurant: String(item.restaurant ?? ""),
          aliases: Array.isArray(item.aliases) ? item.aliases.map(String) : [],
          calories: Math.round(item.calories),
          protein: Math.round(item.protein ?? 0),
          carbs: Math.round(item.carbs ?? 0),
          fat: Math.round(item.fat ?? 0),
          fiber: item.fiber != null ? Math.round(item.fiber) : undefined,
          sugar: item.sugar != null ? Math.round(item.sugar) : undefined,
          nutritionSource:
            typeof item.nutritionSource === "string" ? item.nutritionSource : undefined
        },
        addedAt: typeof row.addedAt === "string" ? row.addedAt : new Date().toISOString(),
        quantity: qty
      });
    }
  }
  if (date !== today) {
    return { date: today, entries: [] };
  }
  return { date, entries };
}

export function sumMealLogItems(entries: MealLogEntry[]): NutritionItem {
  const totals: NutritionItem = {
    id: "meal_log_sum",
    name: "Today's log",
    restaurant: "",
    aliases: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0
  };
  let hasFiber = false;
  let hasSugar = false;
  for (const entry of entries) {
    const q = entry.quantity;
    totals.calories += entry.item.calories * q;
    totals.protein += entry.item.protein * q;
    totals.carbs += entry.item.carbs * q;
    totals.fat += entry.item.fat * q;
    if (entry.item.fiber != null) {
      hasFiber = true;
      totals.fiber = (totals.fiber ?? 0) + entry.item.fiber * q;
    }
    if (entry.item.sugar != null) {
      hasSugar = true;
      totals.sugar = (totals.sugar ?? 0) + entry.item.sugar * q;
    }
  }
  if (!hasFiber) {
    delete totals.fiber;
  }
  if (!hasSugar) {
    delete totals.sugar;
  }
  return totals;
}

export function getMealLogMacroPercentages(
  totals: NutritionItem,
  goals: MacroGoals,
  trackedMacros: TrackedMacros
): MacroPercentages {
  return getMacroPercentages(totals, goals, trackedMacros);
}

export function formatMealTotalsSummary(
  totals: NutritionItem,
  settings: GoalSettings
): string {
  const g = settings.macroGoals;
  const parts: string[] = [];
  parts.push(`${totals.calories} / ${g.calories} cal`);
  if (settings.trackedMacros.protein) {
    parts.push(`${totals.protein}g / ${g.protein}g protein`);
  }
  if (settings.trackedMacros.carbs) {
    parts.push(`${totals.carbs}g / ${g.carbs}g carbs`);
  }
  if (settings.trackedMacros.fat) {
    parts.push(`${totals.fat}g / ${g.fat}g fat`);
  }
  return parts.join(" · ");
}
