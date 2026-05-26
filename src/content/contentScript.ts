import { collapseDuplicateCaloriesInTitle, extractMenuItemLabel } from "./menuTextExtract";
import {
  dedupeMenuItemNames,
  dedupeScannedTitlesPreferringDishHeading,
  hasFoodWordHint,
  isJunkMenuLabel,
  shouldExcludeScrapedLabel,
  singleWordMenuAllowed
} from "./menuItemFilters";
import { mergePageNutritionHints, scrapeInlineMenuCalories, scrapeNutritionTables } from "./pageNutritionScraper";
import { extractPdfNutritionHints } from "./pdfNutritionExtract";
import type { PageNutritionHint } from "../core/nutritionResolver";
import { openSidebar, persistSidebarOpen, shouldRestoreSidebar, toggleSidebar } from "./sidebarHost";

const RESCAN_DELAY_MS = 300;
let scanTimer: number | null = null;
let observer: MutationObserver | null = null;
let latestItemNames: string[] = [];

const KNOWN_MENU_NAMES = [
  "Big Mac",
  "McChicken",
  "4 Piece Chicken McNuggets",
  "6 Piece Chicken McNuggets",
  "10 pc Chicken McNuggets",
  "Chicken Burrito Bowl",
  "Steak Burrito",
  "Sofritas Bowl",
  "Crunchwrap Supreme",
  "Power Menu Bowl Chicken",
  "Bean Burrito",
  "6-inch Turkey Breast",
  "Footlong B.M.T.",
  "6-inch Tuna",
  "Orange Chicken",
  "Kung Pao Chicken",
  "String Bean Chicken Breast",
  "Bacon Gouda Sandwich",
  "Spinach Feta Wrap",
  "Egg White & Roasted Red Pepper Egg Bites",
  "Chick-fil-A Deluxe Sandwich",
  "8-count Grilled Nuggets",
  "Cobb Salad",
  "Filet-O-Fish",
  "Egg McMuffin",
  "Sausage Burrito",
  // Taco Bell card copy (substring match on noisy lines)
  "Soft Taco",
  "Crunchy Taco",
  "Cheesy Gordita Crunch",
  "Nacho Fries",
  "Large Nacho Fries",
  "Mexican Pizza",
  "Quesarito",
  "Beefy Melt Burrito",
  "Chicken Quesadilla",
  "Cinnamon Twists"
];

const CANDIDATE_SELECTOR =
  "article, h1, h2, h3, h4, h5, li, p, span, a, button, div, img[alt], [aria-label], [data-testid]";
const MAX_NODES_PER_SCAN = 8000;
/** Raw node text can be long (price, calories, CTAs on one card). */
const MAX_RAW_TEXT_LEN = 2400;
/**
 * Depth-first: enter each open shadow root before collecting matches at the current root,
 * so we do not burn MAX_NODES on outer light-DOM wrappers (common on restaurant SPAs).
 */
function querySelectorAllDeep(selector: string, max: number): HTMLElement[] {
  const results: HTMLElement[] = [];
  const seenShadow = new WeakSet<ShadowRoot>();

  function walk(root: Document | ShadowRoot): void {
    if (results.length >= max) {
      return;
    }
    for (const el of Array.from(root.querySelectorAll("*"))) {
      if (results.length >= max) {
        return;
      }
      const sr = (el as HTMLElement).shadowRoot;
      if (sr && !seenShadow.has(sr)) {
        seenShadow.add(sr);
        walk(sr);
      }
    }
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(selector))) {
      if (results.length >= max) {
        return;
      }
      results.push(el);
    }
  }

  walk(document);
  return results;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function scanCurrentPage(): string[] {
  const known = KNOWN_MENU_NAMES.map((name) => ({ raw: name, normalized: normalize(name) }));
  const knownNormalizedSet = new Set(known.map((k) => k.normalized));
  const nodes = querySelectorAllDeep(CANDIDATE_SELECTOR, MAX_NODES_PER_SCAN);
  const results = new Set<string>();

  for (const node of nodes) {
    if (!isVisible(node)) {
      continue;
    }
    const rawFull = (() => {
      if (node.tagName === "IMG") {
        return (node as HTMLImageElement).alt?.trim() ?? "";
      }
      return (node.getAttribute("aria-label") || node.innerText || node.textContent || "").trim();
    })();
    if (!rawFull) {
      continue;
    }
    const rawForExtract =
      rawFull.length > MAX_RAW_TEXT_LEN ? rawFull.slice(0, MAX_RAW_TEXT_LEN) : rawFull;
    const extracted = extractMenuItemLabel(rawForExtract);
    const displayTextRaw =
      extracted ??
      (rawFull.length <= 140 ? rawFull.trim() : extractMenuItemLabel(rawFull) ?? null);
    if (!displayTextRaw) {
      continue;
    }
    const displayText = collapseDuplicateCaloriesInTitle(displayTextRaw.trim());
    if (!displayText) {
      continue;
    }
    const normalizedText = normalize(displayText);
    if (!normalizedText) {
      continue;
    }
    const words = normalizedText.split(" ").filter(Boolean);
    if (words.length > 14) {
      continue;
    }
    if (shouldExcludeScrapedLabel(displayText, normalizedText, knownNormalizedSet)) {
      continue;
    }
    const hasFoodHint = hasFoodWordHint(normalizedText);
    const singleOk = words.length === 1 && singleWordMenuAllowed(normalizedText);
    if (words.length < 2 && !singleOk) {
      continue;
    }

    if (hasFoodHint) {
      results.add(displayText);
    }

    for (const item of known) {
      if (normalizedText.includes(item.normalized) || item.normalized.includes(normalizedText)) {
        results.add(item.raw);
      }
    }
  }

  const deduped = dedupeScannedTitlesPreferringDishHeading(dedupeMenuItemNames(Array.from(results)));
  return deduped.filter((name) => !isJunkMenuLabel(name));
}

function scheduleScan(): void {
  if (scanTimer !== null) {
    window.clearTimeout(scanTimer);
  }
  scanTimer = window.setTimeout(runScan, RESCAN_DELAY_MS);
}

async function runScan(): Promise<void> {
  latestItemNames = scanCurrentPage();
}

function startObserver(): void {
  if (observer) {
    observer.disconnect();
  }
  observer = new MutationObserver(() => scheduleScan());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

chrome.runtime.onMessage.addListener(
  (
    message: { type?: string },
    _sender,
    sendResponse: (
      response?: {
        itemNames: string[];
        pageNutritionHints: PageNutritionHint[];
        pdfNutritionHints: PageNutritionHint[];
        pageUrl?: string;
        pageTitle?: string;
      }
    ) => void
  ) => {
    if (message.type === "NUTRITIOUS_TOGGLE_SIDEBAR") {
      const open = toggleSidebar();
      void persistSidebarOpen(open);
      sendResponse?.({ open });
      return undefined;
    }
    if (message.type === "NUTRITIOUS_SETTINGS_UPDATED") {
      scheduleScan();
      return undefined;
    }
    if (message.type === "NUTRITIOUS_GET_ITEMS") {
      void (async () => {
        latestItemNames = scanCurrentPage();
        const pageNutritionHints = mergePageNutritionHints(
          scrapeInlineMenuCalories(document),
          scrapeNutritionTables(document)
        ).filter((h) => !/^ingredients in the\b/i.test(h.key));
        let pdfNutritionHints: PageNutritionHint[] = [];
        try {
          pdfNutritionHints = await extractPdfNutritionHints(document);
        } catch {
          pdfNutritionHints = [];
        }
        sendResponse({
          itemNames: latestItemNames,
          pageNutritionHints,
          pdfNutritionHints,
          pageUrl: location.href,
          pageTitle: document.title
        });
      })();
      return true;
    }
    return undefined;
  }
);

async function init(): Promise<void> {
  startObserver();
  scheduleScan();
  window.addEventListener("scroll", scheduleScan, { passive: true });
  window.addEventListener("resize", scheduleScan);
  if (await shouldRestoreSidebar()) {
    await openSidebar();
  }
}

void init();
