import { normalizeFoodName } from "../core/nutritionDatabase";
import type { PageNutritionHint } from "../core/nutritionResolver";
import { extractMenuItemLabel } from "./menuTextExtract";

function parseNumberCell(text: string): number {
  const n = Number.parseFloat(text.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function rowCells(row: HTMLTableRowElement): string[] {
  return Array.from(row.querySelectorAll("th, td")).map((cell) => cell.textContent?.trim() ?? "");
}

function looksLikeHeader(cells: string[]): boolean {
  const joined = cells.join(" ").toLowerCase();
  return (
    joined.includes("calorie") &&
    (joined.includes("protein") || joined.includes("pro")) &&
    (joined.includes("carb") || joined.includes("carbohydrate")) &&
    joined.includes("fat")
  );
}

function columnIndices(headerCells: string[]): {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
} | null {
  const lower = headerCells.map((c) => c.toLowerCase());

  const cal = lower.findIndex((h) => h.includes("calorie") || /\bcal\b/.test(h));
  const protein = lower.findIndex((h) => h.includes("protein"));
  let carbs = lower.findIndex((h) => h.includes("carb") && !h.includes("fiber") && !h.includes("sugar"));
  if (carbs < 0) {
    carbs = lower.findIndex((h) => h.includes("total carbohydrate"));
  }
  let fat = lower.findIndex((h) => /\bfat\b/.test(h) && !h.includes("saturated") && !h.includes("trans"));
  if (fat < 0) {
    fat = lower.findIndex((h) => h.includes("total fat"));
  }
  const fiber = lower.findIndex(
    (h) => h.includes("dietary fiber") || h === "fiber" || (h.includes("fiber") && !h.includes("sugar"))
  );
  const sugar = lower.findIndex(
    (h) => h.includes("total sugar") || h === "sugars" || h === "sugar" || h.includes("added sugar")
  );

  if (cal < 0 || protein < 0 || carbs < 0 || fat < 0) {
    return null;
  }
  return { cal, protein, carbs, fat, fiber, sugar };
}

/**
 * Best-effort scrape of HTML nutrition tables (common on chain restaurant sites).
 */
export function scrapeNutritionTables(root: Document | HTMLElement): PageNutritionHint[] {
  const tables = Array.from(root.querySelectorAll("table"));
  const results: PageNutritionHint[] = [];

  for (const table of tables) {
    const rows = Array.from(table.querySelectorAll("tr"));
    if (rows.length < 2) {
      continue;
    }

    let headerIdx = -1;
    let indices: ReturnType<typeof columnIndices> = null;

    for (let i = 0; i < Math.min(rows.length, 6); i++) {
      const cells = rowCells(rows[i]);
      if (cells.length < 5) {
        continue;
      }
      if (looksLikeHeader(cells)) {
        indices = columnIndices(cells);
        if (indices) {
          headerIdx = i;
          break;
        }
      }
    }

    if (headerIdx < 0 || !indices) {
      continue;
    }

    const nameCol = 0;

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const cells = rowCells(rows[i]);
      if (cells.length <= Math.max(indices.cal, indices.protein, indices.carbs, indices.fat)) {
        continue;
      }
      const name = cells[nameCol];
      if (!name || name.length > 200) {
        continue;
      }

      const calories = parseNumberCell(cells[indices.cal] ?? "");
      const protein = parseNumberCell(cells[indices.protein] ?? "");
      const carbs = parseNumberCell(cells[indices.carbs] ?? "");
      const fat = parseNumberCell(cells[indices.fat] ?? "");
      const fiber = indices.fiber >= 0 ? parseNumberCell(cells[indices.fiber] ?? "") : 0;
      const sugar = indices.sugar >= 0 ? parseNumberCell(cells[indices.sugar] ?? "") : 0;

      if (calories <= 0 && protein <= 0 && carbs <= 0 && fat <= 0) {
        continue;
      }

      const hint: PageNutritionHint = {
        key: normalizeFoodName(name),
        calories,
        protein,
        carbs,
        fat
      };
      if (fiber > 0) {
        hint.fiber = fiber;
      }
      if (sugar > 0) {
        hint.sugar = sugar;
      }
      results.push(hint);
    }
  }

  return results;
}

const INLINE_CAL_MAX_NODES = 5000;
const INLINE_CAL_SELECTOR =
  "article, [data-testid], div, span, a, button, p, li, h2, h3, h4, section";

const INLINE_CAL_REGEX = /\b(\d{2,4})\s*[Cc]al(?:ories)?\b/;

function isVisibleElement(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function mergeInlineHintByKey(map: Map<string, PageNutritionHint>, hint: PageNutritionHint): void {
  const prev = map.get(hint.key);
  if (!prev) {
    map.set(hint.key, hint);
    return;
  }
  if (hint.key.length > prev.key.length) {
    map.set(hint.key, hint);
    return;
  }
  if (hint.key.length === prev.key.length && hint.calories !== prev.calories) {
    map.set(hint.key, hint.calories > prev.calories ? hint : prev);
  }
}

/**
 * Parse calorie lines on menu cards (e.g. Taco Bell: "Soft Taco $1.99 | 180 Cal").
 * Produces calories-only hints; resolver scales macros from the keyword estimate.
 */
export function scrapeInlineMenuCalories(root: Document | HTMLElement = document): PageNutritionHint[] {
  const byKey = new Map<string, PageNutritionHint>();
  const nodes = Array.from(root.querySelectorAll(INLINE_CAL_SELECTOR));
  let scanned = 0;

  for (const node of nodes) {
    if (scanned++ >= INLINE_CAL_MAX_NODES) {
      break;
    }
    if (!(node instanceof HTMLElement) || !isVisibleElement(node)) {
      continue;
    }
    const text = (node.innerText || "").replace(/\s+/g, " ").trim();
    if (text.length < 8 || text.length > 1600) {
      continue;
    }
    if (!INLINE_CAL_REGEX.test(text)) {
      continue;
    }
    const calMatch = text.match(INLINE_CAL_REGEX);
    if (!calMatch) {
      continue;
    }
    const calories = Number.parseInt(calMatch[1] ?? "", 10);
    if (!Number.isFinite(calories) || calories < 25 || calories > 3500) {
      continue;
    }

    const name = extractMenuItemLabel(text);
    if (!name || name.length < 3 || name.length > 120) {
      continue;
    }
    if (/^ingredients in the\b/i.test(name.trim())) {
      continue;
    }

    const key = normalizeFoodName(name);
    if (!key) {
      continue;
    }

    mergeInlineHintByKey(byKey, { key, calories, protein: 0, carbs: 0, fat: 0 });
  }

  return Array.from(byKey.values());
}

/** Table rows win over inline snippets when keys collide (full macros). */
export function mergePageNutritionHints(
  inlineHints: PageNutritionHint[],
  tableHints: PageNutritionHint[]
): PageNutritionHint[] {
  const map = new Map<string, PageNutritionHint>();
  for (const h of inlineHints) {
    map.set(h.key, h);
  }
  for (const h of tableHints) {
    map.set(h.key, h);
  }
  return Array.from(map.values());
}
