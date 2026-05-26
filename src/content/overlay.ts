import { getMacroPercentages } from "../core/macroMath";
import { getRecommendations } from "../core/recommendationEngine";
import type { GoalSettings, NutritionItem } from "../core/types";

export interface OverlayEntry {
  target: HTMLElement;
  item: NutritionItem;
}

const OVERLAY_ROOT_ID = "nutritious-overlay-root";
const ITEM_ATTR = "data-nutritious-for";

function ensureRoot(): HTMLDivElement {
  let root = document.getElementById(OVERLAY_ROOT_ID) as HTMLDivElement | null;
  if (root) {
    return root;
  }

  root = document.createElement("div");
  root.id = OVERLAY_ROOT_ID;
  root.style.position = "absolute";
  root.style.top = "0";
  root.style.left = "0";
  root.style.width = "100%";
  root.style.pointerEvents = "none";
  root.style.zIndex = "2147483646";
  document.documentElement.appendChild(root);
  return root;
}

function createCard(item: NutritionItem, settings: GoalSettings): HTMLDivElement {
  const percentages = getMacroPercentages(
    item,
    settings.macroGoals,
    settings.trackedMacros
  );
  const recommendations = getRecommendations(item, settings);
  const card = document.createElement("div");
  card.style.position = "absolute";
  card.style.pointerEvents = "none";
  card.style.maxWidth = "260px";
  card.style.padding = "8px 10px";
  card.style.borderRadius = "8px";
  card.style.background = "rgba(20, 20, 20, 0.92)";
  card.style.color = "#fff";
  card.style.fontFamily = "Inter, system-ui, -apple-system, sans-serif";
  card.style.fontSize = "12px";
  card.style.lineHeight = "1.4";
  card.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";

  const recommendationText = recommendations
    .map((rec) => `${rec.item.name} (${rec.item.protein}g P, ${rec.item.calories} cal)`)
    .join(" | ");

  card.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 4px;">${item.name}</div>
    <div>${item.calories} cal | P ${item.protein}g | C ${item.carbs}g | F ${item.fat}g</div>
    <div style="opacity: 0.9; margin-top: 2px;">
      Goal: ${percentages.calories}% cal, ${percentages.protein}% protein, ${percentages.carbs}% carbs, ${percentages.fat}% fat
    </div>
    <div style="margin-top: 4px; color: #8df0a1;">
      Better picks: ${recommendationText}
    </div>
  `;
  return card;
}

function cardPositionFor(target: HTMLElement): { top: number; left: number } {
  const rect = target.getBoundingClientRect();
  return {
    top: window.scrollY + rect.top - 8,
    left: window.scrollX + rect.right + 8
  };
}

export function clearOverlays(): void {
  const root = document.getElementById(OVERLAY_ROOT_ID);
  if (root) {
    root.remove();
  }
}

export function renderOverlays(entries: OverlayEntry[], settings: GoalSettings): void {
  clearOverlays();
  const root = ensureRoot();

  for (const entry of entries) {
    const card = createCard(entry.item, settings);
    const pos = cardPositionFor(entry.target);
    card.style.top = `${pos.top}px`;
    card.style.left = `${Math.max(window.scrollX + 8, pos.left)}px`;
    card.setAttribute(ITEM_ATTR, entry.item.id);
    root.appendChild(card);
  }
}
