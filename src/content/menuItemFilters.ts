/**
 * Heuristics to drop nav chrome, category tabs, and logo alt text from menu scans.
 */

import { collapseDuplicateCaloriesInTitle } from "./menuTextExtract";

const FOOD_HINT_WORDS = [
  "cinnamon",
  "twist",
  "churro",
  "brownie",
  "cookie",
  "bowl",
  "salad",
  "burger",
  "sandwich",
  "wrap",
  "taco",
  "burrito",
  "pizza",
  "pasta",
  "nuggets",
  "fries",
  "chicken",
  "steak",
  "rice",
  "nacho",
  "quesadilla",
  "chalupa",
  "gordita",
  "crunchwrap",
  "supreme",
  "cheesy",
  "loaded",
  "queso",
  "bean",
  "grilled",
  "stacker",
  "enchilada",
  "empanada",
  "tamale",
  "fajitas",
  "sofritas",
  "mcmuffin",
  "egg"
];

const SINGLE_WORD_MENU_OK = new Set([
  "quesadilla",
  "burrito",
  "chalupa",
  "gordita",
  "nachos",
  "enchilada",
  "empanada",
  "tamale",
  "fajitas"
]);

function escapeRegexChar(c: string): string {
  return c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordOrPluralPattern(word: string): string {
  const esc = word.split("").map(escapeRegexChar).join("");
  if (esc.endsWith("s")) {
    return `(?:${esc}|${esc.slice(0, -1)})`;
  }
  return `(?:${esc}|${esc}s?)`;
}

/** Consent / CMP UI — not bakery items (FOOD_HINT_WORDS includes "cookie"). */
function isCookieOrPrivacyChrome(normalized: string): boolean {
  if (!/\bcookies?\b/.test(normalized)) {
    return /\b(ad settings|preference center|opens the preference|privacy (settings|choices)|consent preferences|tracking preferences)\b/.test(
      normalized
    );
  }
  if (
    /\b(chocolate|oatmeal|sugar|chip|snickerdoodle|macadamia|birthday|gingerbread|shortbread|peanut butter)\b/.test(
      normalized
    )
  ) {
    return false;
  }
  return /\b(ad|ads|advertising|settings|preferences|preference|consent|privacy|tracking|banner|cmp)\b/.test(
    normalized
  );
}

/** Match whole tokens only (avoids "taco" inside unrelated tokens when combined with denies). */
export function hasFoodWordHint(normalized: string): boolean {
  if (isCookieOrPrivacyChrome(normalized)) {
    return false;
  }
  for (const w of FOOD_HINT_WORDS) {
    const pat = new RegExp(`(^|\\s)${wordOrPluralPattern(w)}(\\s|$)`);
    if (pat.test(normalized)) {
      return true;
    }
  }
  return false;
}

export function singleWordMenuAllowed(normalized: string): boolean {
  const words = normalized.split(" ").filter(Boolean);
  if (words.length !== 1) {
    return false;
  }
  const w = words[0];
  if (SINGLE_WORD_MENU_OK.has(w)) {
    return true;
  }
  return w.length >= 6 && hasFoodWordHint(normalized);
}

const DENY_SUBSTRINGS_NORMALIZED = [
  "cookie and ad settings",
  "cookies and ad settings",
  "cookie ad settings",
  "ad settings",
  "preference center",
  "opens the preference",
  "manage cookies",
  "manage cookie",
  "privacy settings",
  "your privacy choices",
  "do not sell",
  "consent preferences",
  "tracking preferences",
  "estimated",
  "taco bell home",
  "skip to content",
  "skip to main",
  "sign in",
  "log in",
  "start order",
  "find a store",
  "gift cards",
  "nutrition calculator",
  // Taco Bell (and similar) promo / app banners
  "scan to download",
  "download the app",
  "download taco bell",
  "taco bell app",
  "redeem exclusive",
  "exclusive rewards",
  "only on the app",
  "rewards only on",
  "get the app",
  "order in the app",
  // Footer / corporate nav
  "about taco bell",
  "about us",
  "taco bell purpose",
  "contact us",
  "privacy policy",
  "terms of use",
  "careers at",
  "franchise info",
  "taco shop"
];

/** Category / chrome lines that end like nav, not dish names. */
function endsLikeCategoryNav(normalized: string): boolean {
  if (/\bmenu\s*$/.test(normalized)) {
    return true;
  }
  if (/\b(home|logo)\s*$/.test(normalized) && normalized.length < 48) {
    return true;
  }
  return false;
}

function normalizeScanKeyChars(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sidebar / category rails on McDonald's and similar ordering sites (not dishes). */
const RESTAURANT_MENU_CATEGORY_KEYS = new Set(
  [
    "burgers",
    "breakfast",
    "chicken and fish sandwiches",
    "chicken and fish",
    "mcnuggets and mccrispy strips",
    "mcnuggets and mccrispy",
    "mcnuggets mccrispy strips",
    "mccrispy strips",
    "fries and sides",
    "happy meal",
    "happy meals",
    "beverages",
    "desserts",
    "salads",
    "condiments",
    "mccafe",
    "mccafe coffees",
    "sweets and treats",
    "dollar menu",
    "limited time offers",
    "snack wrap",
    "wraps",
    "combos",
    "combo meals",
    "coffee",
    "tea",
    "bakery",
    "shakes",
    "smoothies",
    "featured",
    "deals",
    "value menu",
    "family meal",
    "family meals",
    "a la carte"
  ].map((s) => normalizeScanKeyChars(s))
);

function isRestaurantRailCategory(normalized: string): boolean {
  if (RESTAURANT_MENU_CATEGORY_KEYS.has(normalized)) {
    return true;
  }
  if (normalized.length > 48) {
    return false;
  }
  if (/\sand sides$/.test(normalized)) {
    return true;
  }
  if (/\sand sandwiches$/.test(normalized)) {
    return true;
  }
  if (/\sand strips$/.test(normalized)) {
    return true;
  }
  return false;
}

/**
 * Restaurant SPAs often use all caps for real product titles (e.g. "CINNAMON TWISTS"), not only
 * category rails. Treat as a nav tab only when the normalized text matches known rail headings.
 */
const ALLCAPS_CATEGORY_TAB_KEYS = new Set(
  [
    "menu",
    "home",
    "deals",
    "delivery",
    "rewards",
    "gift cards",
    "drinks",
    "burritos",
    "tacos",
    "nachos",
    "quesadillas",
    "specialties",
    "combos",
    "breakfast",
    "vegetarian",
    "sweets",
    "featured",
    "new",
    "value",
    "party packs",
    "best sellers",
    "see menu",
    "nutrition",
    "locations",
    "find a store",
    "order now",
    "start order"
  ].map((s) => normalizeScanKeyChars(s))
);

function isAllCapsCategoryTab(label: string): boolean {
  const trimmed = label.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (wordCount > 2 || trimmed.length > 28) {
    return false;
  }
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 4 || letters.length > 22) {
    return false;
  }
  if (letters !== letters.toUpperCase()) {
    return false;
  }
  const key = normalizeScanKeyChars(trimmed);
  return ALLCAPS_CATEGORY_TAB_KEYS.has(key);
}

/** Long shouting lines (hero promos), not dish cards (those are usually title case + price). */
function isLongAllCapsPromoBanner(label: string): boolean {
  const trimmed = label.trim();
  if (trimmed.length < 30) {
    return false;
  }
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 24) {
    return false;
  }
  return letters === letters.toUpperCase();
}

/** Stacked footer / legal labels (e.g. "ABOUT US About Taco Bell Purpose"). */
function looksLikeFooterNavStack(normalized: string): boolean {
  if (/\babout us\b/.test(normalized) && /\babout taco bell\b/.test(normalized)) {
    return true;
  }
  if (/\babout us\b/.test(normalized) && /\bpurpose\b/.test(normalized)) {
    return true;
  }
  return false;
}

/** Category rail titles, not a food name. */
function isTacoBellCategoryHeader(normalized: string): boolean {
  if (!normalized.includes("taco bell")) {
    return false;
  }
  return /\bbest sellers\b/.test(normalized);
}

/** Marketing sentences (multiple clauses), not a single dish line. */
function looksLikeLongMarketingSentence(displayText: string, normalized: string): boolean {
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length < 16) {
    return false;
  }
  const periods = (displayText.match(/\./g) ?? []).length;
  if (periods >= 1 && words.length >= 12) {
    return true;
  }
  if (words.length >= 20) {
    return true;
  }
  return false;
}

/** Drop consent banners, a11y boilerplate, and bare "Estimated" before showing in the popup. */
export function isJunkMenuLabel(displayText: string): boolean {
  const normalized = normalizeScanKeyChars(displayText);
  if (!normalized || normalized === "estimated") {
    return true;
  }
  if (isCookieOrPrivacyChrome(normalized)) {
    return true;
  }
  if (/\bopens the\b/.test(normalized) && normalized.length < 120) {
    return true;
  }
  return shouldExcludeScrapedLabel(displayText, normalized, new Set());
}

export function shouldExcludeScrapedLabel(
  displayText: string,
  normalized: string,
  knownNormalizedSet: Set<string>
): boolean {
  if (knownNormalizedSet.has(normalized)) {
    return false;
  }
  if (normalized === "estimated" || isCookieOrPrivacyChrome(normalized)) {
    return true;
  }
  if (/\bopens the\b/.test(normalized) && !hasFoodWordHint(normalized)) {
    return true;
  }
  if (isRestaurantRailCategory(normalized)) {
    return true;
  }
  if (/\bingredients in the\b/.test(normalized)) {
    return true;
  }
  for (const d of DENY_SUBSTRINGS_NORMALIZED) {
    if (normalized.includes(d)) {
      return true;
    }
  }
  if (/\btaco bell\s+(home|logo|rewards|menu|locations|delivery)\b/.test(normalized)) {
    return true;
  }
  if (isTacoBellCategoryHeader(normalized)) {
    return true;
  }
  if (endsLikeCategoryNav(normalized)) {
    return true;
  }
  if (isAllCapsCategoryTab(displayText)) {
    return true;
  }
  if (isLongAllCapsPromoBanner(displayText)) {
    return true;
  }
  if (looksLikeFooterNavStack(normalized)) {
    return true;
  }
  if (looksLikeLongMarketingSentence(displayText, normalized)) {
    return true;
  }
  return false;
}

/**
 * Merge headings like "Ingredients in the Sausage Burrito" with "Sausage Burrito 310 Cal."
 * into one card title (prefer the real dish line, shorter, no ingredients prefix).
 */
export function dedupeScannedTitlesPreferringDishHeading(names: string[]): string[] {
  const groupKey = (raw: string) => {
    let n = normalizeScanKeyChars(collapseDuplicateCaloriesInTitle(raw));
    n = n.replace(/\b\d{2,4}\s*cal\b/g, "").replace(/\s+/g, " ").trim();
    n = n.replace(/\bingredients in the\b/g, "").replace(/\s+/g, " ").trim();
    return n;
  };

  const groups = new Map<string, string[]>();
  for (const name of names) {
    const k = groupKey(name);
    if (!k) {
      continue;
    }
    const arr = groups.get(k) ?? [];
    arr.push(name);
    groups.set(k, arr);
  }

  const picked: string[] = [];
  for (const arr of groups.values()) {
    picked.push(
      [...arr].sort((a, b) => {
        const ai = /^ingredients in the\b/i.test(a.trim()) ? 1 : 0;
        const bi = /^ingredients in the\b/i.test(b.trim()) ? 1 : 0;
        if (ai !== bi) {
          return ai - bi;
        }
        return collapseDuplicateCaloriesInTitle(a).length - collapseDuplicateCaloriesInTitle(b).length;
      })[0]
    );
  }
  return picked;
}

function preferMenuLabel(a: string, b: string): string {
  const a$ = a.includes("$");
  const b$ = b.includes("$");
  if (a$ !== b$) {
    return a$ ? b : a;
  }
  return a.length <= b.length ? a : b;
}

/** Collapse "Large Nacho Fries $3.79" vs "Large Nacho Fries" into one cleaner label. */
export function dedupeMenuItemNames(names: string[]): string[] {
  const keyFor = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s*\$\s*\d+(?:\.\d{1,2})?\s*/g, " ")
      .replace(/\s*\|\s*\d{2,4}\s*cal\b/gi, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const best = new Map<string, string>();
  for (const name of names) {
    const key = keyFor(name);
    if (!key) {
      continue;
    }
    const prev = best.get(key);
    best.set(key, prev ? preferMenuLabel(name, prev) : name);
  }
  return Array.from(best.values());
}
