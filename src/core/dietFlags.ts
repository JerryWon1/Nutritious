import { normalizeFoodName } from "./nutritionDatabase";
import type { DietFlagKey, DietFlags, NutritionItem } from "./types";

export type DietFilterKey = DietFlagKey | "lowCarb";

export const DIET_FLAG_KEYS: readonly DietFlagKey[] = [
  "vegetarian",
  "vegan",
  "glutenFree",
  "dairyFree",
  "nutFree"
] as const;

export const DIET_FILTER_KEYS: readonly DietFilterKey[] = [
  ...DIET_FLAG_KEYS,
  "lowCarb"
] as const;

export interface DietFlagMeta {
  key: DietFlagKey;
  label: string;
  shortLabel: string;
  badgeClass: string;
}

export const DIET_FLAG_META: Record<DietFlagKey, DietFlagMeta> = {
  vegetarian: { key: "vegetarian", label: "Vegetarian", shortLabel: "Veg", badgeClass: "diet-badge--veg" },
  vegan: { key: "vegan", label: "Vegan", shortLabel: "Vegan", badgeClass: "diet-badge--vegan" },
  glutenFree: { key: "glutenFree", label: "Gluten-free", shortLabel: "GF", badgeClass: "diet-badge--gf" },
  dairyFree: { key: "dairyFree", label: "Dairy-free", shortLabel: "DF", badgeClass: "diet-badge--df" },
  nutFree: { key: "nutFree", label: "Nut-free", shortLabel: "NF", badgeClass: "diet-badge--nf" }
};

export type DietFilterPrefs = Record<DietFilterKey, boolean>;

export const DEFAULT_DIET_FILTER_PREFS: DietFilterPrefs = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  nutFree: false,
  lowCarb: false
};

const MEAT_RE =
  /\b(chicken|beef|pork|bacon|sausage|ham|turkey|fish|salmon|tuna|shrimp|steak|meat|patty|nugget|mcrib|anchovy|pepperoni|chorizo|brisket|barbacoa|carnitas|carne|pollo|birria|burger|pounder|mcchicken|filet|mccrispy|sandwich(?!\s*only))\b/i;
/** Egg McMuffin includes Canadian bacon; name does not say bacon */
const IMPLICIT_MEAT_RE = /\b(egg mcmuffin|egg and cheese mcmuffin)\b/i;
const EGG_RE = /\b(egg|eggs|omelette|omelet|mcgriddle|mcmuffin)\b/i;
const DAIRY_RE =
  /\b(cheese|milk|cream|butter|yogurt|whey|queso|sour cream|mozzarella|cheddar|feta|parmesan|ricotta|creamy|ranch|caesar|shake|frappuccino|latte|mocha|macchiato|cappuccino|custard|ice cream|mcflurry|quesadilla)\b/i;
/** McMuffin / McGriddle / biscuit breakfast sandwiches include cheese even when not in the name */
const IMPLICIT_DAIRY_RE = /\b(mcmuffin|mcgriddle|biscuit)\b/i;
const GLUTEN_RE =
  /\b(bun|biscuit|bread|wrap|tortilla|crouton|muffin|mcmuffin|mcgriddle|bagel|crust|pasta|noodle|waffle|pancake|croissant|baguette|flatbread|pita|macaroni|spaghetti|breading|breaded|crispy chicken|mcflurry|cookie|brownie|cake|pie)\b/i;
const GLUTEN_FREE_RE = /\b(gluten[\s-]*free|gf\b)\b/i;
const NUT_RE =
  /\b(peanut|almond|pecan|walnut|cashew|pistachio|hazelnut|macadamia|tree nut|nuts\b|nut butter|pb\b|marzipan)\b/i;
const VEG_PRODUCE_RE =
  /\b(salad|fries|apple slice|fruit|soda|coke|sprite|tea|coffee|water|juice|lemonade|iced tea|black beans|rice|beans|corn|salsa|lettuce|guac|guacamole|veggie|vegetable|sofi?ta)\b/i;

function textBlob(item: NutritionItem): string {
  return [item.name, ...item.aliases].join(" ").toLowerCase();
}

/** Curated flags for items whose menu names omit cheese, meat, or gluten */
const KNOWN_DIET_BY_KEY: Record<string, DietFlags> = {
  "egg mcmuffin": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: true
  }
};

function lookupKnownDiet(item: NutritionItem): DietFlags | undefined {
  const keys = [normalizeFoodName(item.name), ...item.aliases.map((a) => normalizeFoodName(a))];
  for (const key of keys) {
    if (key && KNOWN_DIET_BY_KEY[key]) {
      return KNOWN_DIET_BY_KEY[key];
    }
  }
  return undefined;
}

function inferFromName(item: NutritionItem): DietFlags {
  const known = lookupKnownDiet(item);
  if (known) {
    return known;
  }

  const t = textBlob(item);
  const glutenFreeExplicit = GLUTEN_FREE_RE.test(t);
  const hasDairy = DAIRY_RE.test(t) || IMPLICIT_DAIRY_RE.test(t);
  const hasMeat = MEAT_RE.test(t) || IMPLICIT_MEAT_RE.test(t);

  let vegetarian: boolean | undefined;
  let vegan: boolean | undefined;
  let glutenFree: boolean | undefined;
  let dairyFree: boolean | undefined;
  let nutFree: boolean | undefined;

  if (hasMeat) {
    vegetarian = false;
    vegan = false;
  } else if (VEG_PRODUCE_RE.test(t) || /\b(black coffee|diet coke|unsweetened)\b/i.test(t)) {
    vegetarian = true;
    vegan = !hasDairy && !EGG_RE.test(t);
  } else if (EGG_RE.test(t) && !hasMeat) {
    vegetarian = !hasDairy || /\b(egg white|veggie)\b/i.test(t);
    vegan = false;
  } else if (hasDairy && !hasMeat) {
    vegetarian = true;
    vegan = false;
  }

  if (glutenFreeExplicit) {
    glutenFree = true;
  } else if (GLUTEN_RE.test(t)) {
    glutenFree = false;
  } else if (/\b(salad|bowl|burrito bowl)\b/i.test(t) && !/\b(tortilla|wrap|bun)\b/i.test(t)) {
    glutenFree = undefined;
  } else if (vegetarian === true && !GLUTEN_RE.test(t)) {
    glutenFree = undefined;
  }

  if (hasDairy) {
    dairyFree = false;
  } else if (hasMeat && !hasDairy) {
    dairyFree = true;
  } else if (/\b(black coffee|diet coke|soda|sprite|tea|water)\b/i.test(t)) {
    dairyFree = true;
  } else if (VEG_PRODUCE_RE.test(t) && !hasDairy && !EGG_RE.test(t)) {
    dairyFree = true;
  }

  if (NUT_RE.test(t)) {
    nutFree = false;
  } else if (/\b(oreo|reeses|m&m|heath|snickers)\b/i.test(t)) {
    nutFree = false;
  } else if (dairyFree === true || vegetarian === true) {
    nutFree = undefined;
  }

  if (nutFree === undefined && (dairyFree === true || /\b(fries|nugget|patty)\b/i.test(t))) {
    nutFree = undefined;
  }

  return { vegetarian, vegan, glutenFree, dairyFree, nutFree };
}

export function getItemDietFlags(item: NutritionItem): DietFlags {
  const inferred = inferFromName(item);
  const explicit = item.diet ?? {};
  const merged: DietFlags = {};
  for (const key of DIET_FLAG_KEYS) {
    merged[key] = explicit[key] ?? inferred[key];
  }
  return merged;
}

export function itemSatisfiesDietFlag(item: NutritionItem, flag: DietFlagKey): boolean {
  return getItemDietFlags(item)[flag] === true;
}

export function itemSatisfiesLowCarb(item: NutritionItem, maxCarbs = 35): boolean {
  return item.carbs <= maxCarbs;
}

export function itemMatchesDietFilters(item: NutritionItem, filters: DietFilterPrefs): boolean {
  for (const key of DIET_FLAG_KEYS) {
    if (filters[key] && !itemSatisfiesDietFlag(item, key)) {
      return false;
    }
  }
  if (filters.lowCarb && !itemSatisfiesLowCarb(item)) {
    return false;
  }
  return true;
}

export function activeDietFilterCount(filters: DietFilterPrefs): number {
  return DIET_FILTER_KEYS.filter((k) => filters[k]).length;
}

export function sanitizeDietFilterPrefs(raw: unknown): DietFilterPrefs {
  const out = { ...DEFAULT_DIET_FILTER_PREFS };
  if (!raw || typeof raw !== "object") {
    return out;
  }
  const candidate = raw as Partial<DietFilterPrefs>;
  for (const key of DIET_FILTER_KEYS) {
    if (typeof candidate[key] === "boolean") {
      out[key] = candidate[key] as boolean;
    }
  }
  return out;
}

/** Human-readable diet tags for item meta line (Figma style) */
export function dietMetaTagsHtml(item: NutritionItem): string {
  const flags = getItemDietFlags(item);
  const parts: string[] = [];
  for (const key of DIET_FLAG_KEYS) {
    if (flags[key] === true) {
      parts.push(`<span class="meta-tag">${DIET_FLAG_META[key].label}</span>`);
    }
  }
  return parts.join("");
}

export function dietFlagBadgesHtml(item: NutritionItem, options?: { showNegative?: boolean }): string {
  const flags = getItemDietFlags(item);
  const showNegative = options?.showNegative ?? false;
  const parts: string[] = [];
  for (const key of DIET_FLAG_KEYS) {
    const val = flags[key];
    if (val === true) {
      const meta = DIET_FLAG_META[key];
      parts.push(
        `<span class="diet-badge ${meta.badgeClass}" title="${meta.label}">${meta.shortLabel}</span>`
      );
    } else if (showNegative && val === false) {
      const meta = DIET_FLAG_META[key];
      parts.push(
        `<span class="diet-badge diet-badge--no" title="Not ${meta.label.toLowerCase()}">✕ ${meta.shortLabel}</span>`
      );
    }
  }
  const anyKnown = DIET_FLAG_KEYS.some((k) => flags[k] !== undefined);
  if (parts.length === 0 && !anyKnown) {
    return `<span class="diet-badge diet-badge--unknown" title="Diet flags unknown — name-based estimate inconclusive">?</span>`;
  }
  if (parts.length === 0 && anyKnown) {
    return `<span class="diet-badge diet-badge--neutral" title="No selected diet flags match; see filters">—</span>`;
  }
  return parts.join("");
}
