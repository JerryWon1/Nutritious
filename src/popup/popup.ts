import "./popup.css";
import { getStoredState, saveMacroGoals, DEFAULT_GOALS } from "../core/storage";
import { getMacroPercentages } from "../core/macroMath";
import { getRecommendations } from "../core/recommendationEngine";
import {
  resolveNutritionForName,
  type NutritionSource,
  type PageNutritionHint,
  type ResolveContext
} from "../core/nutritionResolver";
import { loadUserNutritionRows, parseNutritionCsv, saveUserNutritionRows } from "../core/userNutritionCsv";
import type { MacroGoals, NutritionItem } from "../core/types";

const form = document.getElementById("goals-form") as HTMLFormElement;
const statusEl = document.getElementById("status") as HTMLParagraphElement;
const caloriesInput = document.getElementById("calories") as HTMLInputElement;
const proteinInput = document.getElementById("protein") as HTMLInputElement;
const carbsInput = document.getElementById("carbs") as HTMLInputElement;
const fatInput = document.getElementById("fat") as HTMLInputElement;
const tabItemsBtn = document.getElementById("tab-items") as HTMLButtonElement;
const tabGoalsBtn = document.getElementById("tab-goals") as HTMLButtonElement;
const itemsView = document.getElementById("items-view") as HTMLElement;
const goalsView = document.getElementById("goals-view") as HTMLElement;
const refreshItemsBtn = document.getElementById("refresh-items") as HTMLButtonElement;
const itemsListEl = document.getElementById("items-list") as HTMLDivElement;
const csvImportInput = document.getElementById("csv-import") as HTMLInputElement | null;
let currentGoals: MacroGoals | null = null;
const resolutionMeta = new Map<string, { source: NutritionSource; note?: string }>();

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MACRO_RING_R = 17;
const MACRO_RING_C = 2 * Math.PI * MACRO_RING_R;

function macroRingCell(config: {
  label: string;
  centerLine: string;
  unitLine: string;
  pctOfGoal: number;
  stroke: string;
}): string {
  const pct = Math.max(0, Math.round(config.pctOfGoal));
  const fillFrac = Math.min(Math.max(config.pctOfGoal / 100, 0), 1);
  const dashOffset = MACRO_RING_C * (1 - fillFrac);
  const overClass = config.pctOfGoal > 100 ? " macro-pct--over" : "";
  return `
    <div class="macro-cell">
      <div class="macro-ring-visual" aria-hidden="true">
        <svg class="macro-ring-svg" viewBox="0 0 44 44" width="56" height="56">
          <circle class="macro-ring-track" cx="22" cy="22" r="${MACRO_RING_R}" fill="none" stroke-width="3.5" />
          <g transform="rotate(-90 22 22)">
            <circle
              class="macro-ring-progress"
              cx="22"
              cy="22"
              r="${MACRO_RING_R}"
              fill="none"
              stroke="${config.stroke}"
              stroke-width="3.5"
              stroke-linecap="round"
              stroke-dasharray="${MACRO_RING_C} ${MACRO_RING_C}"
              stroke-dashoffset="${dashOffset}"
            />
          </g>
        </svg>
        <div class="macro-ring-center">
          <span class="macro-ring-value">${escapeHtml(config.centerLine)}</span>
          <span class="macro-ring-unit">${escapeHtml(config.unitLine)}</span>
        </div>
      </div>
      <span class="macro-ring-caption">${escapeHtml(config.label)}</span>
      <span class="macro-pct${overClass}">${pct}% of goal</span>
    </div>
  `;
}

function macroRingsRow(item: NutritionItem, pcts: ReturnType<typeof getMacroPercentages>): string {
  return `
    <div class="macro-rings-row" role="group" aria-label="Macros vs your daily goals">
      ${macroRingCell({
        label: "Calories",
        centerLine: String(item.calories),
        unitLine: "cal",
        pctOfGoal: pcts.calories,
        stroke: "#e8b44f"
      })}
      ${macroRingCell({
        label: "Protein",
        centerLine: String(item.protein),
        unitLine: "g",
        pctOfGoal: pcts.protein,
        stroke: "#5ce19b"
      })}
      ${macroRingCell({
        label: "Carbs",
        centerLine: String(item.carbs),
        unitLine: "g",
        pctOfGoal: pcts.carbs,
        stroke: "#7eb8ff"
      })}
      ${macroRingCell({
        label: "Fat",
        centerLine: String(item.fat),
        unitLine: "g",
        pctOfGoal: pcts.fat,
        stroke: "#f078a6"
      })}
    </div>
  `;
}

function sourceBadgeHtml(source: NutritionSource): string {
  switch (source) {
    case "csv":
      return `<span class="source-badge csv">CSV</span>`;
    case "database":
      return `<span class="source-badge exact">Built-in</span>`;
    case "page":
      return `<span class="source-badge page">Page table</span>`;
    case "pdf":
      return `<span class="source-badge pdf">PDF</span>`;
    case "estimated":
      return `<span class="source-badge estimated">Estimated</span>`;
    default:
      return `<span class="source-badge exact">Built-in</span>`;
  }
}

function setStatus(message: string): void {
  statusEl.textContent = message;
  window.setTimeout(() => {
    statusEl.textContent = "";
  }, 1800);
}

function goalsFromForm(): MacroGoals {
  return {
    calories: Number(caloriesInput.value),
    protein: Number(proteinInput.value),
    carbs: Number(carbsInput.value),
    fat: Number(fatInput.value)
  };
}

function setActiveTab(name: "items" | "goals"): void {
  const showItems = name === "items";
  tabItemsBtn.classList.toggle("active", showItems);
  tabGoalsBtn.classList.toggle("active", !showItems);
  itemsView.classList.toggle("hidden", !showItems);
  goalsView.classList.toggle("hidden", showItems);
}

function renderItems(items: NutritionItem[]): void {
  const goals = currentGoals ?? DEFAULT_GOALS;
  if (items.length === 0) {
    itemsListEl.innerHTML =
      '<div class="item-card item-card--message"><div class="item-meta">No recognizable menu items found on this page.</div></div>';
    return;
  }

  itemsListEl.innerHTML = items
    .map((item) => {
      const percentages = getMacroPercentages(item, goals);
      const recommendations = getRecommendations(item, goals);
      const recList =
        recommendations.length > 0
          ? `<ul class="rec-list">${recommendations
              .map(
                (rec) =>
                  `<li><span class="rec-name">${escapeHtml(rec.name)}</span><span class="rec-meta">${rec.protein}g protein · ${rec.calories} cal</span></li>`
              )
              .join("")}</ul>`
          : `<p class="rec-empty">No alternatives in the database for this restaurant.</p>`;
      const meta = resolutionMeta.get(item.id);
      const sourceBadge = meta ? sourceBadgeHtml(meta.source) : sourceBadgeHtml("database");
      const noteLabel =
        meta?.note && (meta.source === "estimated" || meta.source === "page" || meta.source === "pdf")
          ? `<div class="item-note">${escapeHtml(meta.note)}</div>`
          : "";
      return `
        <details class="item-card">
          <summary class="item-summary">
            <div class="item-summary-main">
              <div class="item-title-row">
                <span class="item-title">${escapeHtml(item.name)}</span>
                <span class="item-disclosure" aria-hidden="true"></span>
              </div>
              <span class="item-badges">${sourceBadge}</span>
            </div>
          </summary>
          <div class="item-body">
            <div class="item-restaurant">${escapeHtml(item.restaurant)}</div>
            ${macroRingsRow(item, percentages)}
            ${noteLabel}
            <div class="better-picks">
              <div class="better-picks-label">Better picks</div>
              ${recList}
            </div>
          </div>
        </details>
      `;
    })
    .join("");
}

async function getItemsFromActiveTab(): Promise<NutritionItem[]> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url) {
      return [];
    }

    const isInjectableUrl =
      tab.url.startsWith("http://") ||
      tab.url.startsWith("https://") ||
      tab.url.startsWith("file://");
    if (!isInjectableUrl) {
      return [];
    }

    try {
      const response = (await chrome.tabs.sendMessage(tab.id, {
        type: "NUTRITIOUS_GET_ITEMS"
      })) as {
        itemNames?: string[];
        pageNutritionHints?: PageNutritionHint[];
        pdfNutritionHints?: PageNutritionHint[];
      };
      return resolveItems(
        response?.itemNames ?? [],
        response?.pageNutritionHints ?? [],
        response?.pdfNutritionHints ?? []
      );
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"]
      });
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      const response = (await chrome.tabs.sendMessage(tab.id, {
        type: "NUTRITIOUS_GET_ITEMS"
      })) as {
        itemNames?: string[];
        pageNutritionHints?: PageNutritionHint[];
        pdfNutritionHints?: PageNutritionHint[];
      };
      return resolveItems(
        response?.itemNames ?? [],
        response?.pageNutritionHints ?? [],
        response?.pdfNutritionHints ?? []
      );
    }
  } catch {
    return [];
  }
}

async function resolveItems(
  itemNames: string[],
  pageHints: PageNutritionHint[],
  pdfHints: PageNutritionHint[]
): Promise<NutritionItem[]> {
  resolutionMeta.clear();
  const userRows = await loadUserNutritionRows();
  const ctx: ResolveContext = {
    userRows,
    pageHints,
    pdfHints
  };

  const resolved = itemNames.map((name) => {
    const r = resolveNutritionForName(name, ctx);
    resolutionMeta.set(r.item.id, { source: r.source, note: r.note });
    return r.item;
  });

  const uniqueById = new Map<string, NutritionItem>();
  for (const item of resolved) {
    uniqueById.set(item.id, item);
  }
  return Array.from(uniqueById.values());
}

async function loadForm(): Promise<void> {
  const state = await getStoredState();
  currentGoals = state.macroGoals;
  caloriesInput.value = String(state.macroGoals.calories);
  proteinInput.value = String(state.macroGoals.protein);
  carbsInput.value = String(state.macroGoals.carbs);
  fatInput.value = String(state.macroGoals.fat);
}

async function refreshItems(): Promise<void> {
  itemsListEl.innerHTML =
    '<div class="item-card item-card--message"><div class="item-meta">Scanning current page...</div></div>';
  const items = await getItemsFromActiveTab();
  renderItems(items);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const goals = goalsFromForm();
    await saveMacroGoals(goals);
    currentGoals = goals;
    await refreshItems();
    setStatus("Goals saved");
  } catch {
    setStatus("Could not save. Try again.");
  }
});

tabItemsBtn.addEventListener("click", () => {
  setActiveTab("items");
});

tabGoalsBtn.addEventListener("click", () => {
  setActiveTab("goals");
});

refreshItemsBtn.addEventListener("click", async () => {
  await refreshItems();
});

if (csvImportInput) {
  csvImportInput.addEventListener("change", async () => {
    const file = csvImportInput.files?.[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const rows = parseNutritionCsv(text);
      await saveUserNutritionRows(rows);
      csvImportInput.value = "";
      setStatus(rows.length ? `Imported ${rows.length} CSV rows` : "No rows parsed — check header");
      await refreshItems();
    } catch {
      setStatus("CSV import failed");
    }
  });
}

async function init(): Promise<void> {
  setActiveTab("items");
  await loadForm();
  await refreshItems();
}

void init();
