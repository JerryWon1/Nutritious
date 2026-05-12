import { estimateNutritionFromName } from "./macroEstimator";
import { findNutritionItemByName, normalizeFoodName } from "./nutritionDatabase";
import type { NutritionItem } from "./types";
import { findUserNutritionMatch, type UserNutritionRow } from "./userNutritionCsv";

export type NutritionSource = "csv" | "database" | "page" | "pdf" | "estimated";

export interface PageNutritionHint {
  /** normalizeFoodName key */
  key: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ResolvedNutrition {
  item: NutritionItem;
  source: NutritionSource;
  note?: string;
}

export interface ResolveContext {
  userRows: UserNutritionRow[];
  pageHints: PageNutritionHint[];
  pdfHints: PageNutritionHint[];
}

function hintToItem(hint: PageNutritionHint, displayName: string, source: NutritionSource): NutritionItem {
  return {
    id: `${source}_${hint.key.replace(/\s+/g, "_")}`,
    name: displayName.trim(),
    restaurant: source === "page" ? "This page" : "PDF on page",
    aliases: [],
    calories: Math.round(hint.calories),
    protein: Math.round(hint.protein),
    carbs: Math.round(hint.carbs),
    fat: Math.round(hint.fat)
  };
}

function hintKeyMatchesName(hintKey: string, normalized: string): boolean {
  if (!hintKey || !normalized) {
    return false;
  }
  if (hintKey === normalized) {
    return true;
  }
  if (normalized.includes(hintKey)) {
    return true;
  }
  /** Avoid "Soft Taco" latching onto "Spicy Potato Soft Taco" (longer hint). */
  if (hintKey.includes(normalized) && hintKey.length <= normalized.length + 3) {
    return true;
  }
  return false;
}

function hintMacroFillScore(h: PageNutritionHint): number {
  let s = 0;
  if (h.protein > 0.5) {
    s += 1;
  }
  if (h.carbs > 0.5) {
    s += 1;
  }
  if (h.fat > 0.5) {
    s += 1;
  }
  return s;
}

function pickBestPageHint(candidates: PageNutritionHint[], normalized: string): PageNutritionHint {
  const exact = candidates.find((h) => h.key === normalized);
  if (exact) {
    return exact;
  }
  const contained = candidates.filter((h) => normalized.includes(h.key));
  const pool = contained.length > 0 ? contained : candidates;
  return [...pool].sort((a, b) => {
    const ds = hintMacroFillScore(b) - hintMacroFillScore(a);
    if (ds !== 0) {
      return ds;
    }
    return b.key.length - a.key.length;
  })[0];
}

function findHintMatch(hints: PageNutritionHint[], rawName: string): PageNutritionHint | null {
  const normalized = normalizeFoodName(rawName);
  if (!normalized) {
    return null;
  }

  const candidates = hints.filter(
    (h) => h.calories > 0 && hintKeyMatchesName(h.key, normalized) && !/^ingredients in the\b/i.test(h.key)
  );
  if (candidates.length === 0) {
    return null;
  }

  return pickBestPageHint(candidates, normalized);
}

/** When the page only has calories (menu cards), scale keyword macros to match those calories. */
function enrichHintMacrosFromEstimate(rawName: string, hint: PageNutritionHint): PageNutritionHint {
  const hasMacros = hint.protein > 0.5 || hint.carbs > 0.5 || hint.fat > 0.5;
  if (hasMacros) {
    return hint;
  }
  const est = estimateNutritionFromName(rawName);
  const denom = Math.max(1, est.item.calories);
  const scale = hint.calories / denom;
  return {
    ...hint,
    protein: Math.max(1, Math.round(est.item.protein * scale)),
    carbs: Math.max(1, Math.round(est.item.carbs * scale)),
    fat: Math.max(1, Math.round(est.item.fat * scale))
  };
}

/**
 * Resolution order: imported CSV → bundled database → DOM hints (nutrition tables + inline card calories) → PDF text on the page → keyword estimate.
 */
export function resolveNutritionForName(rawName: string, ctx: ResolveContext): ResolvedNutrition {
  const csvItem = findUserNutritionMatch(ctx.userRows, rawName);
  if (csvItem) {
    return { item: csvItem, source: "csv" };
  }

  const dbItem = findNutritionItemByName(rawName);
  if (dbItem) {
    return { item: dbItem, source: "database" };
  }

  const pageHint = findHintMatch(ctx.pageHints, rawName);
  if (pageHint && pageHint.calories > 0) {
    const macroScore = hintMacroFillScore(pageHint);
    const hadFullMacros = macroScore >= 3;
    const hadPartialMacros = macroScore >= 1 && macroScore < 3;
    const enriched = enrichHintMacrosFromEstimate(rawName, pageHint);
    return {
      item: hintToItem(enriched, rawName, "page"),
      source: "page",
      note: hadFullMacros
        ? "Pulled from a nutrition table on the current page."
        : hadPartialMacros
          ? "Partial macros from this page; remaining values scaled to match calories."
          : "Calories from text on this page (e.g. menu card); protein/carbs/fat scaled from the keyword estimate to match those calories."
    };
  }

  const pdfHint = findHintMatch(ctx.pdfHints, rawName);
  if (pdfHint && pdfHint.calories > 0) {
    const macroScore = hintMacroFillScore(pdfHint);
    const hadFullMacros = macroScore >= 3;
    const hadPartialMacros = macroScore >= 1 && macroScore < 3;
    const enriched = enrichHintMacrosFromEstimate(rawName, pdfHint);
    return {
      item: hintToItem(enriched, rawName, "pdf"),
      source: "pdf",
      note: hadFullMacros
        ? "Parsed from PDF text linked or embedded on this page (best effort)."
        : hadPartialMacros
          ? "Partial macros from PDF text; remaining values scaled to match calories."
          : "Calories parsed from PDF text on this page; macros scaled from the keyword estimate to match those calories."
    };
  }

  const estimated = estimateNutritionFromName(rawName);
  return {
    item: estimated.item,
    source: "estimated",
    note: estimated.note
  };
}
