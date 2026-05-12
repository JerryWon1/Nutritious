import { PDF_SOURCED_NUTRITION } from "./pdfSourcedItems";
import type { NutritionItem } from "./types";

const LEGACY_NUTRITION_ITEMS: NutritionItem[] = [
  { id: "mc_big_mac", name: "Big Mac", restaurant: "McDonald's", aliases: ["big mac"], calories: 550, protein: 25, carbs: 45, fat: 30 },
  { id: "mc_mcchicken", name: "McChicken", restaurant: "McDonald's", aliases: ["mcchicken"], calories: 400, protein: 14, carbs: 40, fat: 21 },
  { id: "mc_10_nuggets", name: "10 pc Chicken McNuggets", restaurant: "McDonald's", aliases: ["10 piece chicken mcnuggets", "10 pc nuggets"], calories: 410, protein: 23, carbs: 26, fat: 24 },
  { id: "chipotle_chicken_bowl", name: "Chicken Burrito Bowl", restaurant: "Chipotle", aliases: ["chicken bowl", "chipotle chicken bowl"], calories: 540, protein: 41, carbs: 52, fat: 19 },
  { id: "chipotle_steak_burrito", name: "Steak Burrito", restaurant: "Chipotle", aliases: ["chipotle steak burrito"], calories: 650, protein: 36, carbs: 64, fat: 25 },
  { id: "chipotle_sofritas_bowl", name: "Sofritas Bowl", restaurant: "Chipotle", aliases: ["sofritas bowl"], calories: 500, protein: 22, carbs: 57, fat: 20 },
  { id: "tb_crunchwrap", name: "Crunchwrap Supreme", restaurant: "Taco Bell", aliases: ["crunchwrap supreme"], calories: 530, protein: 16, carbs: 71, fat: 21 },
  { id: "tb_power_bowl", name: "Power Menu Bowl Chicken", restaurant: "Taco Bell", aliases: ["power bowl chicken", "power menu bowl"], calories: 470, protein: 27, carbs: 50, fat: 18 },
  { id: "tb_bean_burrito", name: "Bean Burrito", restaurant: "Taco Bell", aliases: ["bean burrito"], calories: 360, protein: 13, carbs: 54, fat: 10 },
  { id: "subway_6_turkey", name: "6-inch Turkey Breast", restaurant: "Subway", aliases: ["6 inch turkey breast", "turkey breast 6"], calories: 280, protein: 18, carbs: 46, fat: 4 },
  { id: "subway_footlong_bmt", name: "Footlong B.M.T.", restaurant: "Subway", aliases: ["footlong bmt", "subway bmt"], calories: 820, protein: 36, carbs: 88, fat: 36 },
  { id: "subway_tuna_6", name: "6-inch Tuna", restaurant: "Subway", aliases: ["6 inch tuna", "subway tuna"], calories: 480, protein: 20, carbs: 44, fat: 25 },
  { id: "panda_orange_chicken", name: "Orange Chicken", restaurant: "Panda Express", aliases: ["orange chicken"], calories: 490, protein: 23, carbs: 51, fat: 23 },
  { id: "panda_kung_pao", name: "Kung Pao Chicken", restaurant: "Panda Express", aliases: ["kung pao chicken"], calories: 320, protein: 16, carbs: 14, fat: 19 },
  { id: "panda_string_bean", name: "String Bean Chicken Breast", restaurant: "Panda Express", aliases: ["string bean chicken"], calories: 210, protein: 14, carbs: 13, fat: 9 },
  { id: "sb_bacon_gouda", name: "Bacon Gouda Sandwich", restaurant: "Starbucks", aliases: ["bacon gouda"], calories: 360, protein: 19, carbs: 34, fat: 18 },
  { id: "sb_spinach_feta_wrap", name: "Spinach Feta Wrap", restaurant: "Starbucks", aliases: ["spinach feta wrap"], calories: 290, protein: 20, carbs: 34, fat: 8 },
  { id: "sb_egg_bites", name: "Egg White & Roasted Red Pepper Egg Bites", restaurant: "Starbucks", aliases: ["egg white bites", "starbucks egg bites"], calories: 170, protein: 13, carbs: 11, fat: 7 },
  { id: "cf_deluxe", name: "Chick-fil-A Deluxe Sandwich", restaurant: "Chick-fil-A", aliases: ["chick fil a deluxe sandwich", "deluxe sandwich"], calories: 500, protein: 29, carbs: 43, fat: 23 },
  { id: "cf_grilled_nuggets", name: "8-count Grilled Nuggets", restaurant: "Chick-fil-A", aliases: ["grilled nuggets"], calories: 130, protein: 25, carbs: 1, fat: 3 },
  { id: "cf_cobb_salad", name: "Cobb Salad", restaurant: "Chick-fil-A", aliases: ["cobb salad"], calories: 510, protein: 40, carbs: 28, fat: 28 },
  { id: "mc_egg_mcmuffin", name: "Egg McMuffin", restaurant: "McDonald's", aliases: ["egg mcmuffin"], calories: 310, protein: 17, carbs: 30, fat: 13 },
  { id: "mc_sausage_burrito", name: "Sausage Burrito", restaurant: "McDonald's", aliases: ["sausage burrito"], calories: 310, protein: 13, carbs: 25, fat: 17 },
  { id: "mc_filet_o_fish", name: "Filet-O-Fish", restaurant: "McDonald's", aliases: ["filet o fish"], calories: 390, protein: 16, carbs: 38, fat: 19 }
];

function collectNormalizedKeys(item: NutritionItem): string[] {
  return [item.name, ...item.aliases].map(normalizeFoodName).filter(Boolean);
}

const pdfNormalizedKeys = new Set<string>();
for (const item of PDF_SOURCED_NUTRITION) {
  for (const k of collectNormalizedKeys(item)) {
    pdfNormalizedKeys.add(k);
  }
}

function legacyConflictsPdf(item: NutritionItem): boolean {
  return collectNormalizedKeys(item).some((k) => pdfNormalizedKeys.has(k));
}

/** PDF-sourced rows override legacy entries when any name or alias key collides. */
export const NUTRITION_ITEMS: NutritionItem[] = [
  ...LEGACY_NUTRITION_ITEMS.filter((item) => !legacyConflictsPdf(item)),
  ...PDF_SOURCED_NUTRITION
];

export function normalizeFoodName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const lookupIndex = new Map<string, NutritionItem>();
for (const item of NUTRITION_ITEMS) {
  const keys = [item.name, ...item.aliases];
  for (const key of keys) {
    lookupIndex.set(normalizeFoodName(key), item);
  }
}

export function findNutritionItemByName(rawName: string): NutritionItem | null {
  const normalized = normalizeFoodName(rawName);
  if (!normalized) {
    return null;
  }
  if (lookupIndex.has(normalized)) {
    return lookupIndex.get(normalized) ?? null;
  }

  const MIN_KEY = 3;
  let best: NutritionItem | null = null;
  let bestScore = -1;

  for (const [indexKey, item] of lookupIndex.entries()) {
    if (indexKey.length < MIN_KEY) {
      continue;
    }
    let score = -1;
    if (normalized.includes(indexKey)) {
      score = 1000 + indexKey.length * 4;
    } else if (indexKey.includes(normalized)) {
      score = indexKey.length * 4 + (normalized.length >= 4 ? 2 : 0);
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}

function tokenSetForMatch(raw: string): Set<string> {
  const norm = normalizeFoodName(raw);
  return new Set(
    norm
      .split(" ")
      .filter((t) => t.length >= 2 && !["the", "and", "with", "pc", "oz"].includes(t))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) {
    return 0;
  }
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) {
      inter += 1;
    }
  }
  const union = a.size + b.size - inter;
  return union > 0 ? inter / union : 0;
}

function itemMatchTokens(item: NutritionItem): Set<string> {
  const acc = new Set<string>();
  for (const t of tokenSetForMatch(item.name)) {
    acc.add(t);
  }
  for (const al of item.aliases) {
    for (const t of tokenSetForMatch(al)) {
      acc.add(t);
    }
  }
  return acc;
}

/**
 * Best-effort nearest menu row for fuzzy / unknown strings (Jaccard on normalized tokens).
 * Used to shape keyword estimates toward real published macro ratios.
 */
export function findClosestNutritionItem(rawName: string): { item: NutritionItem; score: number } | null {
  const q = tokenSetForMatch(rawName);
  if (q.size === 0) {
    return null;
  }
  if (q.size === 1) {
    const only = [...q][0];
    if (only.length < 4) {
      return null;
    }
  }

  let best: NutritionItem | null = null;
  let bestScore = 0;
  for (const item of NUTRITION_ITEMS) {
    const itemTokens = itemMatchTokens(item);
    const score = jaccard(q, itemTokens);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (!best || bestScore < 0.08) {
    return null;
  }
  return { item: best, score: bestScore };
}
