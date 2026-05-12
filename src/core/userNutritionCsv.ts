import type { NutritionItem } from "./types";
import { normalizeFoodName } from "./nutritionDatabase";

const STORAGE_KEY = "nutritionUserCsvRows";

export interface UserNutritionRow {
  name: string;
  restaurant: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  aliases: string[];
}

export async function loadUserNutritionRows(): Promise<UserNutritionRow[]> {
  const raw = await chrome.storage.local.get(STORAGE_KEY);
  const rows = raw[STORAGE_KEY];
  return Array.isArray(rows) ? (rows as UserNutritionRow[]) : [];
}

export async function saveUserNutritionRows(rows: UserNutritionRow[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: rows });
}

/** Minimal CSV: header row required. Columns: name,calories,protein,carbs,fat[,restaurant][,aliases] */
export function parseNutritionCsv(text: string): UserNutritionRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return [];
  }

  const header = splitCsvLine(lines[0]).map((cell) => cell.trim().toLowerCase());
  const nameIdx = header.findIndex((h) => h === "name" || h === "item" || h === "menu item");
  const calIdx = header.findIndex((h) => h.includes("calorie") || h === "cal" || h === "cals");
  const pIdx = header.findIndex((h) => h === "protein" || h === "p");
  const cIdx = header.findIndex((h) => (h.includes("carb") && !h.includes("fiber")) || h === "carbs");
  const fIdx = header.findIndex((h) => h === "fat" || (h.includes("fat") && !h.includes("saturated")));
  const restIdx = header.findIndex((h) => h === "restaurant" || h === "brand");
  const aliasIdx = header.findIndex((h) => h === "aliases" || h === "alias");

  if (nameIdx < 0 || calIdx < 0 || pIdx < 0 || cIdx < 0 || fIdx < 0) {
    return [];
  }

  const rows: UserNutritionRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const name = cells[nameIdx]?.trim();
    if (!name) {
      continue;
    }
    const aliasesRaw = aliasIdx >= 0 ? cells[aliasIdx]?.trim() ?? "" : "";
    const aliases = aliasesRaw
      ? aliasesRaw.split(/[|;]/).map((a) => a.trim()).filter(Boolean)
      : [];

    rows.push({
      name,
      restaurant: restIdx >= 0 ? cells[restIdx]?.trim() || "Custom" : "Custom",
      calories: parseNumericCell(cells[calIdx]),
      protein: parseNumericCell(cells[pIdx]),
      carbs: parseNumericCell(cells[cIdx]),
      fat: parseNumericCell(cells[fIdx]),
      aliases
    });
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === "," && !inQuotes) || (ch === ";" && !inQuotes)) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map((s) => s.trim());
}

function parseNumericCell(raw: string | undefined): number {
  if (!raw) {
    return 0;
  }
  const n = Number.parseFloat(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function rowToNutritionItem(row: UserNutritionRow): NutritionItem {
  const id = `csv_${normalizeFoodName(row.name).replace(/\s+/g, "_")}`;
  return {
    id,
    name: row.name,
    restaurant: row.restaurant,
    aliases: row.aliases,
    calories: Math.round(row.calories),
    protein: Math.round(row.protein),
    carbs: Math.round(row.carbs),
    fat: Math.round(row.fat)
  };
}

function indexKeysForRow(row: UserNutritionRow): string[] {
  const keys = new Set<string>();
  keys.add(normalizeFoodName(row.name));
  for (const a of row.aliases) {
    keys.add(normalizeFoodName(a));
  }
  return [...keys];
}

export function findUserNutritionMatch(rows: UserNutritionRow[], rawName: string): NutritionItem | null {
  const normalized = normalizeFoodName(rawName);
  if (!normalized) {
    return null;
  }

  for (const row of rows) {
    for (const key of indexKeysForRow(row)) {
      if (key === normalized) {
        return rowToNutritionItem(row);
      }
    }
  }

  for (const row of rows) {
    for (const key of indexKeysForRow(row)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return rowToNutritionItem(row);
      }
    }
  }

  return null;
}
