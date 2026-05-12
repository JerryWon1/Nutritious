import { findNutritionItemByName, normalizeFoodName } from "../core/nutritionDatabase";
import type { NutritionItem } from "../core/types";

export interface ScanMatch {
  element: HTMLElement;
  item: NutritionItem;
  matchedText: string;
}

const CANDIDATE_SELECTOR =
  "h1, h2, h3, h4, li, p, span, a, button, div, [aria-label], [data-testid]";
const MAX_NODES_PER_SCAN = 1200;

function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getCandidateText(element: HTMLElement): string {
  const ariaLabel = element.getAttribute("aria-label")?.trim();
  if (ariaLabel) {
    return ariaLabel;
  }
  return (element.innerText || element.textContent || "").trim();
}

export function scanForFoodItems(root: ParentNode = document): ScanMatch[] {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(CANDIDATE_SELECTOR)).slice(
    0,
    MAX_NODES_PER_SCAN
  );
  const seenElements = new Set<HTMLElement>();
  const matches: ScanMatch[] = [];

  for (const element of nodes) {
    if (seenElements.has(element) || !isVisible(element)) {
      continue;
    }
    const rawText = getCandidateText(element);
    if (!rawText || rawText.length > 120) {
      continue;
    }
    const normalized = normalizeFoodName(rawText);
    if (!normalized || normalized.split(" ").length > 10) {
      continue;
    }

    const item = findNutritionItemByName(normalized);
    if (!item) {
      continue;
    }

    seenElements.add(element);
    matches.push({
      element,
      item,
      matchedText: rawText
    });
  }

  return matches;
}
