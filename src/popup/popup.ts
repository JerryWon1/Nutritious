import "./popup.css";
import {
  activeDietFilterCount,
  DEFAULT_DIET_FILTER_PREFS,
  dietMetaTagsHtml,
  itemMatchesDietFilters,
  type DietFilterPrefs
} from "../core/dietFlags";
import {
  DEFAULT_GOAL_SETTINGS,
  getDietFilterPrefs,
  getGoalDayProgress,
  getGoalSettings,
  getMealLog,
  notifySettingsUpdated,
  saveDietFilterPrefs,
  saveGoalSettings,
  saveMealLog
} from "../core/storage";
import { applyPresetToGoals } from "../core/goalPresets";
import { getItemMacroDisplay, type MacroKnownMap } from "../core/macroKnown";
import { sumMealLogItems, type MealLogEntry, type MealLogState } from "../core/mealLog";
import { getItemMacro, MACRO_FIELD_META, MACRO_KEYS } from "../core/macroFields";
import { getMacroPercentages, mealFraction, type MacroPercentages } from "../core/macroMath";
import { detectRestaurantFromPage } from "../core/restaurantDetect";
import {
  getRecommendations,
  recommendationsUnavailableReason
} from "../core/recommendationEngine";
import {
  resolveNutritionForName,
  type NutritionSource,
  type PageNutritionHint,
  type ResolveContext
} from "../core/nutritionResolver";
import { loadUserNutritionRows, parseNutritionCsv, saveUserNutritionRows } from "../core/userNutritionCsv";
import { isJunkMenuLabel } from "../content/menuItemFilters";
import type { GoalSettings, MacroKey, MacroPreset, NutritionItem, TrackedMacros } from "../core/types";

const form = document.getElementById("goals-form") as HTMLFormElement;
const statusEl = document.getElementById("status") as HTMLParagraphElement;
const goalProgressEl = document.getElementById("goal-progress") as HTMLElement;
const goalProgressMacrosEl = document.getElementById("goal-progress-macros") as HTMLElement;
const chainBarEl = document.getElementById("chain-bar") as HTMLElement;
const chainBarTextEl = document.getElementById("chain-bar-text") as HTMLElement;
const goalWeeksInput = document.getElementById("goal-weeks") as HTMLInputElement;
const goalExtraDaysInput = document.getElementById("goal-extra-days") as HTMLInputElement;
const headerRefreshBtn = document.getElementById("header-refresh") as HTMLButtonElement;
const filterPanelEl = document.getElementById("diet-filters") as HTMLElement;
const filterPanelToggle = document.getElementById("filter-panel-toggle") as HTMLButtonElement;
const filterLowCarbInput = document.getElementById("filter-low-carb") as HTMLInputElement;
const lastRefreshedEl = document.getElementById("last-refreshed") as HTMLElement;
const caloriesInput = document.getElementById("calories") as HTMLInputElement;
const proteinInput = document.getElementById("protein") as HTMLInputElement;
const carbsInput = document.getElementById("carbs") as HTMLInputElement;
const fatInput = document.getElementById("fat") as HTMLInputElement;
const fiberInput = document.getElementById("fiber") as HTMLInputElement;
const sugarInput = document.getElementById("sugar") as HTMLInputElement;
const goalLengthSelect = document.getElementById("goal-length") as HTMLSelectElement;
const macroPresetSelect = document.getElementById("macro-preset") as HTMLSelectElement;
const mealPercentSelect = document.getElementById("meal-percent") as HTMLSelectElement;
const applyPresetBtn = document.getElementById("apply-preset") as HTMLButtonElement;
const trackProteinInput = document.getElementById("track-protein") as HTMLInputElement;
const trackCarbsInput = document.getElementById("track-carbs") as HTMLInputElement;
const trackFatInput = document.getElementById("track-fat") as HTMLInputElement;
const trackFiberInput = document.getElementById("track-fiber") as HTMLInputElement;
const trackSugarInput = document.getElementById("track-sugar") as HTMLInputElement;
const tabItemsBtn = document.getElementById("tab-items") as HTMLButtonElement;
const tabGoalsBtn = document.getElementById("tab-goals") as HTMLButtonElement;
const itemsView = document.getElementById("items-view") as HTMLElement;
const goalsView = document.getElementById("goals-view") as HTMLElement;
const itemsListEl = document.getElementById("items-list") as HTMLDivElement;
const mealCartPanelEl = document.getElementById("meal-cart-panel") as HTMLDivElement;
const comparePanelEl = document.getElementById("compare-panel") as HTMLDivElement;
const comparePanelTitleEl = document.getElementById("compare-panel-title") as HTMLHeadingElement;
const comparePanelGridEl = document.getElementById("compare-panel-grid") as HTMLDivElement;
const comparePanelCloseBtn = document.getElementById("compare-panel-close") as HTMLButtonElement;
const csvImportInput = document.getElementById("csv-import") as HTMLInputElement | null;
const filterVegetarianInput = document.getElementById("filter-vegetarian") as HTMLInputElement;
const filterVeganInput = document.getElementById("filter-vegan") as HTMLInputElement;
const filterGlutenFreeInput = document.getElementById("filter-gluten-free") as HTMLInputElement;
const filterDairyFreeInput = document.getElementById("filter-dairy-free") as HTMLInputElement;
const filterNutFreeInput = document.getElementById("filter-nut-free") as HTMLInputElement;

const MAX_COMPARE = 3;
const CHEVRON_SVG = `<svg class="item-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 9l6 6 6-6"/></svg>`;

let currentSettings: GoalSettings = DEFAULT_GOAL_SETTINGS;
let dietFilterPrefs: DietFilterPrefs = { ...DEFAULT_DIET_FILTER_PREFS };
let lastRefreshAt: number | null = null;
let cachedCsvRows: Awaited<ReturnType<typeof loadUserNutritionRows>> = [];
let mealLogState: MealLogState = { date: "", entries: [] };
let detectedRestaurant: string | null = null;
let lastScannedItems: NutritionItem[] = [];
const compareSelectedIds = new Set<string>();
const resolutionMeta = new Map<
  string,
  { source: NutritionSource; note?: string; knownMacros: MacroKnownMap }
>();

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MACRO_RING_R = 17;
const MACRO_RING_C = 2 * Math.PI * MACRO_RING_R;

const MACRO_RING_CONFIG = MACRO_KEYS.map((key) => {
  const meta = MACRO_FIELD_META[key];
  return { key, label: meta.label, unit: meta.unit, stroke: meta.ringStroke };
});

function macroRingCell(config: {
  label: string;
  centerLine: string;
  unitLine: string;
  pctOfGoal: number;
  stroke: string;
  known: boolean;
}): string {
  const unknownClass = config.known ? "" : " macro-ring--unknown";
  const pct = config.known ? Math.max(0, Math.round(config.pctOfGoal)) : 0;
  const fillFrac = config.known ? Math.min(Math.max(config.pctOfGoal / 100, 0), 1) : 0;
  const dashOffset = MACRO_RING_C * (1 - fillFrac);
  const overClass = config.known && config.pctOfGoal > 100 ? " macro-pct--over" : "";
  const pctLabel = config.known ? `${pct}% of goal` : "—";
  const pctClass = config.known ? "" : " macro-pct--unknown";
  return `
    <div class="macro-cell${unknownClass}">
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
      <span class="macro-pct${overClass}${pctClass}">${pctLabel}</span>
    </div>
  `;
}

function macroRingsRow(
  item: NutritionItem,
  pcts: MacroPercentages,
  tracked: TrackedMacros,
  knownMacros: MacroKnownMap
): string {
  const cells = MACRO_RING_CONFIG.filter((c) => tracked[c.key]).map((c) => {
    const display = getItemMacroDisplay(item, c.key, knownMacros);
    const known = display !== null;
    return macroRingCell({
      label: c.label,
      centerLine: known ? String(display) : "—",
      unitLine: c.unit,
      pctOfGoal: known ? pcts[c.key] : 0,
      stroke: c.stroke,
      known
    });
  });
  if (cells.length === 0) {
    return "";
  }
  const colClass = `macro-rings-row--cols-${Math.min(cells.length, 6)}`;
  return `
    <div class="macro-rings-row ${colClass}" role="group" aria-label="Macros vs your daily goals">
      ${cells.join("")}
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

function trackedFromForm(): TrackedMacros {
  return {
    calories: true,
    protein: trackProteinInput.checked,
    carbs: trackCarbsInput.checked,
    fat: trackFatInput.checked,
    fiber: trackFiberInput.checked,
    sugar: trackSugarInput.checked
  };
}

function goalLengthDaysFromWeeksInputs(): number {
  const weeks = Math.max(1, Math.round(Number(goalWeeksInput.value) || 1));
  const extra = Math.min(6, Math.max(0, Math.round(Number(goalExtraDaysInput.value) || 0)));
  return weeks * 7 + extra;
}

function syncWeeksInputsFromDays(totalDays: number): void {
  const weeks = Math.max(1, Math.floor(totalDays / 7));
  const extra = totalDays % 7;
  goalWeeksInput.value = String(weeks);
  goalExtraDaysInput.value = String(extra);
  goalLengthSelect.value = String(totalDays);
}

function settingsFromForm(): GoalSettings {
  const preset = macroPresetSelect.value as MacroPreset;
  const goalLengthDays = goalLengthDaysFromWeeksInputs();
  return {
    macroGoals: {
      calories: Number(caloriesInput.value),
      protein: Number(proteinInput.value),
      carbs: Number(carbsInput.value),
      fat: Number(fatInput.value),
      fiber: Number(fiberInput.value) || currentSettings.macroGoals.fiber,
      sugar: Number(sugarInput.value) || currentSettings.macroGoals.sugar
    },
    trackedMacros: trackedFromForm(),
    goalLengthDays,
    goalStartDate: currentSettings.goalStartDate,
    macroPreset: preset,
    caloriesPerMealPercent: Number(mealPercentSelect.value)
  };
}

function updateChainBar(): void {
  if (detectedRestaurant) {
    chainBarTextEl.textContent = `${detectedRestaurant} on this tab`;
    chainBarEl.classList.remove("hidden");
  } else {
    chainBarEl.classList.add("hidden");
  }
}

function updateLastRefreshedLabel(): void {
  if (lastRefreshAt == null) {
    lastRefreshedEl.textContent = "Last refreshed —";
    return;
  }
  const mins = Math.max(0, Math.floor((Date.now() - lastRefreshAt) / 60000));
  lastRefreshedEl.textContent =
    mins === 0 ? "Last refreshed just now" : `Last refreshed ${mins}m ago`;
}

function progressMacroStatus(
  key: MacroKey,
  goal: number,
  consumed: number
): { amount: number; label: string; over: boolean; pct: number } {
  const meta = MACRO_FIELD_META[key];
  const over = consumed > goal;
  const amount = over ? consumed - goal : Math.max(0, goal - consumed);
  const label =
    key === "calories"
      ? over
        ? "calories over"
        : "calories remaining"
      : over
        ? `${meta.label.toLowerCase()} over`
        : `${meta.label.toLowerCase()} remaining`;
  const pct = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : consumed > 0 ? 100 : 0;
  return { amount, label, over, pct };
}

function renderGoalProgressMacros(settings: GoalSettings): void {
  const logged = sumMealLogItems(mealLogState.entries);
  const rows = MACRO_KEYS.filter((key) => settings.trackedMacros[key]).map((key) => {
    const meta = MACRO_FIELD_META[key];
    const goal = settings.macroGoals[key];
    const consumed = getItemMacro(logged, key);
    const { amount, label, over, pct } = progressMacroStatus(key, goal, consumed);
    const unitSuffix = meta.unit === "cal" ? "" : meta.unit;
    const numberColor = over ? "#f87171" : meta.ringStroke;
    const fillColor = over ? "#f87171" : meta.ringStroke;
    const rowClass = over ? " progress-macro-row--over" : "";
    return `
      <div class="progress-macro-row${rowClass}">
        <p class="progress-card__remaining">
          <span class="progress-card__number" style="color: ${numberColor}">${amount.toLocaleString()}${unitSuffix ? `<span class="progress-card__unit">${unitSuffix}</span>` : ""}</span>
          <span class="progress-card__label">${escapeHtml(label)}</span>
        </p>
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(meta.label)} consumed today">
          <div class="progress-bar__fill" style="width: ${pct}%; background: ${fillColor}"></div>
        </div>
      </div>
    `;
  });
  goalProgressMacrosEl.innerHTML =
    rows.length > 0
      ? rows.join("")
      : `<p class="progress-card__empty">Select macros to track below, then save goals.</p>`;
}

function updateGoalProgressDisplay(settings: GoalSettings): void {
  const { dayNumber, totalDays } = getGoalDayProgress(settings);
  const weeks = Math.max(1, Math.ceil(totalDays / 7));
  const weekNum = Math.min(weeks, Math.max(1, Math.ceil(dayNumber / 7)));
  goalProgressEl.textContent = `Week ${weekNum} of ${weeks}`;
  renderGoalProgressMacros(settings);
}

function syncPresetPills(): void {
  const preset = macroPresetSelect.value;
  document.querySelectorAll(".preset-pill").forEach((btn) => {
    btn.classList.toggle(
      "active",
      (btn as HTMLElement).dataset.preset === preset && preset !== "custom"
    );
  });
}

function setActiveTab(name: "items" | "goals"): void {
  const showItems = name === "items";
  tabItemsBtn.classList.toggle("active", showItems);
  tabGoalsBtn.classList.toggle("active", !showItems);
  tabItemsBtn.setAttribute("aria-selected", String(showItems));
  tabGoalsBtn.setAttribute("aria-selected", String(!showItems));
  itemsView.classList.toggle("hidden", !showItems);
  goalsView.classList.toggle("hidden", showItems);
  if (!showItems) {
    updateGoalProgressDisplay(currentSettings);
  }
}

function renderMealCartPanel(): void {
  const entries = mealLogState.entries;
  if (entries.length === 0) {
    mealCartPanelEl.classList.add("hidden");
    mealCartPanelEl.innerHTML = "";
    updateGoalProgressDisplay(currentSettings);
    return;
  }
  const totals = sumMealLogItems(entries);
  const entryRows = entries
    .map((e) => {
      const cal = e.item.calories * e.quantity;
      return `
        <div class="meal-cart__row">
          <span>${escapeHtml(e.item.name)}${e.quantity > 1 ? ` ×${e.quantity}` : ""}</span>
          <span class="meal-cart__row-cal">
            <span>${cal} cal</span>
            <button type="button" class="meal-cart__remove" data-remove-meal="${escapeHtml(e.id)}" aria-label="Remove">×</button>
          </span>
        </div>`;
    })
    .join("");
  mealCartPanelEl.classList.remove("hidden");
  mealCartPanelEl.innerHTML = `
    <div class="meal-cart__head">
      <h2 class="card-title">Your meal</h2>
      <button type="button" id="clear-meal-log" class="meal-cart__clear">Clear</button>
    </div>
    ${entryRows}
    <div class="meal-cart__total">
      <span>Total</span>
      <span>${totals.calories} cal</span>
    </div>
  `;
  mealCartPanelEl.querySelectorAll("[data-remove-meal]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = (btn as HTMLElement).dataset.removeMeal;
      if (!id) {
        return;
      }
      mealLogState = await saveMealLog({
        ...mealLogState,
        entries: mealLogState.entries.filter((e) => e.id !== id)
      });
      renderMealCartPanel();
      updateGoalProgressDisplay(currentSettings);
    });
  });
  document.getElementById("clear-meal-log")?.addEventListener("click", async () => {
    mealLogState = await saveMealLog({ ...mealLogState, entries: [] });
    compareSelectedIds.clear();
    renderMealCartPanel();
    renderItems(lastScannedItems);
  });
  updateGoalProgressDisplay(currentSettings);
}

function closeComparePanel(): void {
  compareSelectedIds.clear();
  comparePanelGridEl.innerHTML = "";
  comparePanelEl.classList.add("hidden");
  renderItems(lastScannedItems);
}

function renderComparePanel(items: NutritionItem[]): void {
  const selected = items.filter((i) => compareSelectedIds.has(i.id));
  if (selected.length < 2) {
    comparePanelGridEl.innerHTML = "";
    comparePanelEl.classList.add("hidden");
    return;
  }
  const settings = currentSettings;
  const mealPct = Math.round(settings.caloriesPerMealPercent);
  const mealFrac = mealFraction(settings);
  const cols = selected.map((item) => {
    const meta = resolutionMeta.get(item.id);
    const known = meta?.knownMacros ?? {
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
      fiber: true,
      sugar: true
    };
    const pcts = getMacroPercentages(item, settings.macroGoals, settings.trackedMacros, known);
    const stats: string[] = [];
    if (settings.trackedMacros.calories) {
      const mealCal = Math.round(settings.macroGoals.calories * mealFrac);
      stats.push(`Cal: ${item.calories} (${pcts.calories}% day · ${mealCal > 0 ? Math.round((item.calories / mealCal) * 100) : 0}% of ${mealPct}% meal)`);
    }
    if (settings.trackedMacros.protein) {
      stats.push(`Protein: ${item.protein}g (${pcts.protein}%)`);
    }
    if (settings.trackedMacros.carbs) {
      stats.push(`Carbs: ${item.carbs}g (${pcts.carbs}%)`);
    }
    if (settings.trackedMacros.fat) {
      stats.push(`Fat: ${item.fat}g (${pcts.fat}%)`);
    }
    if (settings.trackedMacros.fiber) {
      const f = getItemMacroDisplay(item, "fiber", known);
      stats.push(`Fiber: ${f === null ? "—" : `${f}g`} (${f === null ? "—" : `${pcts.fiber}%`})`);
    }
    if (settings.trackedMacros.sugar) {
      const s = getItemMacroDisplay(item, "sugar", known);
      stats.push(`Sugar: ${s === null ? "—" : `${s}g`} (${s === null ? "—" : `${pcts.sugar}%`})`);
    }
    return `
      <div class="compare-col">
        <h3>${escapeHtml(item.name)}</h3>
        <div class="compare-stat">${escapeHtml(item.restaurant)}</div>
        ${stats.map((s) => `<div class="compare-stat">${escapeHtml(s)}</div>`).join("")}
      </div>
    `;
  });
  comparePanelTitleEl.textContent = `Compare (${selected.length})`;
  comparePanelGridEl.innerHTML = cols.join("");
  comparePanelEl.classList.remove("hidden");
}

async function addItemToMealLog(item: NutritionItem): Promise<void> {
  const entries = [...mealLogState.entries];
  const existing = entries.find((e) => e.item.id === item.id);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + 1);
  } else {
    entries.push({
      id: `meal_${item.id}_${Date.now()}`,
      item: { ...item },
      addedAt: new Date().toISOString(),
      quantity: 1
    });
  }
  mealLogState = await saveMealLog({ ...mealLogState, entries });
  renderMealCartPanel();
  updateGoalProgressDisplay(currentSettings);
  setStatus("Added to your meal");
}

function dietFiltersFromForm(): DietFilterPrefs {
  return {
    vegetarian: filterVegetarianInput.checked,
    vegan: filterVeganInput.checked,
    glutenFree: filterGlutenFreeInput.checked,
    dairyFree: filterDairyFreeInput.checked,
    nutFree: filterNutFreeInput.checked,
    lowCarb: filterLowCarbInput.checked
  };
}

function loadDietFiltersToForm(): void {
  filterVegetarianInput.checked = dietFilterPrefs.vegetarian;
  filterVeganInput.checked = dietFilterPrefs.vegan;
  filterGlutenFreeInput.checked = dietFilterPrefs.glutenFree;
  filterDairyFreeInput.checked = dietFilterPrefs.dairyFree;
  filterNutFreeInput.checked = dietFilterPrefs.nutFree;
  filterLowCarbInput.checked = dietFilterPrefs.lowCarb;
}

async function persistDietFilters(): Promise<void> {
  dietFilterPrefs = await saveDietFilterPrefs(dietFiltersFromForm());
  renderItems(lastScannedItems);
}

function renderItems(items: NutritionItem[]): void {
  const settings = currentSettings;
  lastScannedItems = items;
  renderMealCartPanel();
  const filterCount = activeDietFilterCount(dietFilterPrefs);
  const visible =
    filterCount > 0 ? items.filter((i) => itemMatchesDietFilters(i, dietFilterPrefs)) : items;
  renderComparePanel(visible);

  updateChainBar();

  const filterNote =
    filterCount > 0
      ? `<p class="items-filtered-note">Showing ${visible.length} of ${items.length} items matching active diet filters. Better picks respect filters too.</p>`
      : "";

  if (items.length === 0) {
    itemsListEl.innerHTML =
      '<div class="item-card item-card--message">No recognizable menu items found on this page.</div>';
    return;
  }

  if (visible.length === 0) {
    itemsListEl.innerHTML =
      filterNote +
      '<div class="item-card item-card--message">No scanned items match your diet filters. Try clearing filters or import a CSV with diet columns.</div>';
    return;
  }

  itemsListEl.innerHTML =
    filterNote +
    visible
    .map((item) => {
      const meta = resolutionMeta.get(item.id);
      const knownMacros = meta?.knownMacros ?? {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        fiber: true,
        sugar: true
      };
      const percentages = getMacroPercentages(
        item,
        settings.macroGoals,
        settings.trackedMacros,
        knownMacros
      );
      const recommendations = getRecommendations(
        item,
        settings,
        cachedCsvRows,
        filterCount > 0 ? dietFilterPrefs : undefined
      );
      const unavailable = recommendationsUnavailableReason(item);
      const dietTags = dietMetaTagsHtml(item);
      const recList =
        recommendations.length > 0
          ? `<ul class="rec-list">${recommendations
              .map(
                (rec) =>
                  `<li><span class="rec-name">${escapeHtml(rec.item.name)}</span><span class="rec-meta">${rec.item.protein}g protein · ${rec.item.calories} cal</span><span class="rec-reason">${escapeHtml(rec.reason)}</span></li>`
              )
              .join("")}</ul>`
          : `<p class="rec-empty">${escapeHtml(
              unavailable ??
                (filterCount > 0
                  ? "No alternatives match your diet filters for this restaurant."
                  : "No alternatives in the database for this restaurant. See docs/RESTAURANT_COVERAGE.md.")
            )}</p>`;
      const sourceBadge = meta ? sourceBadgeHtml(meta.source) : sourceBadgeHtml("database");
      const noteLabel =
        meta?.note && (meta.source === "estimated" || meta.source === "page" || meta.source === "pdf" || meta.source === "database")
          ? `<div class="item-note">${escapeHtml(meta.note)}</div>`
          : "";
      const rings = macroRingsRow(item, percentages, settings.trackedMacros, knownMacros);
      const compareChecked = compareSelectedIds.has(item.id) ? "checked" : "";
      const compareDisabled =
        !compareSelectedIds.has(item.id) && compareSelectedIds.size >= MAX_COMPARE
          ? "disabled"
          : "";
      const metaLine = [
        item.restaurant ? `<span>${escapeHtml(item.restaurant)}</span>` : "",
        dietTags
      ]
        .filter(Boolean)
        .join("");
      return `
        <details class="item-card">
          <summary class="item-summary">
            <div class="item-summary__main">
              <div class="item-summary__title-row">
                <span class="item-title">${escapeHtml(item.name)}</span>
                ${sourceBadge}
              </div>
              ${metaLine ? `<div class="item-meta-line">${metaLine}</div>` : ""}
            </div>
            ${CHEVRON_SVG}
          </summary>
          <div class="item-body">
            <div class="item-actions">
              <button type="button" class="add-meal-btn" data-add-meal="${escapeHtml(item.id)}">Add to meal</button>
              <label class="compare-label">
                <input type="checkbox" class="compare-check" data-compare-id="${escapeHtml(item.id)}" ${compareChecked} ${compareDisabled} />
                Compare
              </label>
            </div>
            ${rings}
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

  itemsListEl.querySelectorAll("[data-add-meal]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const id = (btn as HTMLElement).dataset.addMeal;
      const item = items.find((i) => i.id === id);
      if (item) {
        await addItemToMealLog(item);
      }
    });
  });

  itemsListEl.querySelectorAll(".compare-check").forEach((input) => {
    input.addEventListener("change", () => {
      const id = (input as HTMLInputElement).dataset.compareId;
      if (!id) {
        return;
      }
      if ((input as HTMLInputElement).checked) {
        if (compareSelectedIds.size >= MAX_COMPARE) {
          (input as HTMLInputElement).checked = false;
          setStatus(`Compare up to ${MAX_COMPARE} items`);
          return;
        }
        compareSelectedIds.add(id);
      } else {
        compareSelectedIds.delete(id);
      }
      renderComparePanel(lastScannedItems);
      itemsListEl.querySelectorAll(".compare-check").forEach((el) => {
        const cid = (el as HTMLInputElement).dataset.compareId;
        if (!cid) {
          return;
        }
        const disabled = !compareSelectedIds.has(cid) && compareSelectedIds.size >= MAX_COMPARE;
        (el as HTMLInputElement).disabled = disabled;
      });
    });
  });
}

function getSidebarHostTabId(): number | undefined {
  const raw = new URLSearchParams(location.search).get("hostTabId");
  if (!raw) {
    return undefined;
  }
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

async function resolveScanTab(): Promise<chrome.tabs.Tab | undefined> {
  const hostTabId = getSidebarHostTabId();
  if (hostTabId != null) {
    try {
      return await chrome.tabs.get(hostTabId);
    } catch {
      return undefined;
    }
  }
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

function bindHostTabRefresh(): void {
  const hostTabId = getSidebarHostTabId();
  if (hostTabId == null) {
    return;
  }
  chrome.tabs.onActivated.addListener((info) => {
    if (info.tabId === hostTabId) {
      void refreshItems();
    }
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (tabId === hostTabId && (changeInfo.status === "complete" || changeInfo.url)) {
      void refreshItems();
    }
  });
}

async function getItemsFromActiveTab(): Promise<NutritionItem[]> {
  try {
    const tab = await resolveScanTab();
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
      })) as PageScanResponse;
      return resolveItems(response);
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"]
      });
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      const response = (await chrome.tabs.sendMessage(tab.id, {
        type: "NUTRITIOUS_GET_ITEMS"
      })) as PageScanResponse;
      return resolveItems(response);
    }
  } catch {
    return [];
  }
}

interface PageScanResponse {
  itemNames?: string[];
  pageNutritionHints?: PageNutritionHint[];
  pdfNutritionHints?: PageNutritionHint[];
  pageUrl?: string;
  pageTitle?: string;
}

async function resolveItems(response: PageScanResponse): Promise<NutritionItem[]> {
  resolutionMeta.clear();
  const userRows = await loadUserNutritionRows();
  cachedCsvRows = userRows;
  detectedRestaurant = detectRestaurantFromPage(
    response.pageUrl ?? "",
    response.pageTitle
  );
  const ctx: ResolveContext = {
    userRows,
    pageHints: response.pageNutritionHints ?? [],
    pdfHints: response.pdfNutritionHints ?? [],
    detectedRestaurant
  };

  const names = (response.itemNames ?? []).filter((name) => !isJunkMenuLabel(name));

  const resolved = names.map((name) => {
    const r = resolveNutritionForName(name, ctx);
    resolutionMeta.set(r.item.id, {
      source: r.source,
      note: r.note,
      knownMacros: r.knownMacros
    });
    return r.item;
  });

  const uniqueById = new Map<string, NutritionItem>();
  for (const item of resolved) {
    uniqueById.set(item.id, item);
  }
  updateChainBar();
  return Array.from(uniqueById.values());
}

async function loadForm(): Promise<void> {
  currentSettings = await getGoalSettings();
  const g = currentSettings.macroGoals;
  caloriesInput.value = String(g.calories);
  proteinInput.value = String(g.protein);
  carbsInput.value = String(g.carbs);
  fatInput.value = String(g.fat);
  fiberInput.value = String(g.fiber);
  sugarInput.value = String(g.sugar);
  syncWeeksInputsFromDays(currentSettings.goalLengthDays);
  macroPresetSelect.value = currentSettings.macroPreset;
  mealPercentSelect.value = String(currentSettings.caloriesPerMealPercent);
  syncPresetPills();
  trackProteinInput.checked = currentSettings.trackedMacros.protein;
  trackCarbsInput.checked = currentSettings.trackedMacros.carbs;
  trackFatInput.checked = currentSettings.trackedMacros.fat;
  trackFiberInput.checked = currentSettings.trackedMacros.fiber;
  trackSugarInput.checked = currentSettings.trackedMacros.sugar;
  cachedCsvRows = await loadUserNutritionRows();
  updateGoalProgressDisplay(currentSettings);
}

async function refreshItems(): Promise<void> {
  itemsListEl.innerHTML =
    '<div class="item-card item-card--message">Scanning current page...</div>';
  const items = await getItemsFromActiveTab();
  lastRefreshAt = Date.now();
  updateLastRefreshedLabel();
  renderItems(items);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const previousLength = currentSettings.goalLengthDays;
    const next = settingsFromForm();
    const resetStart = next.goalLengthDays !== previousLength;
    currentSettings = await saveGoalSettings(next, { resetGoalStart: resetStart });
    updateGoalProgressDisplay(currentSettings);
    await notifySettingsUpdated();
    await refreshItems();
    setStatus("Goals saved");
  } catch {
    setStatus("Could not save. Try again.");
  }
});

applyPresetBtn.addEventListener("click", () => {
  const preset = macroPresetSelect.value;
  if (preset === "custom") {
    setStatus("Choose a preset first");
    return;
  }
  const calories = Number(caloriesInput.value) || currentSettings.macroGoals.calories;
  const applied = applyPresetToGoals(
    calories,
    preset as "balanced" | "high_protein" | "low_carb"
  );
  caloriesInput.value = String(applied.calories);
  proteinInput.value = String(applied.protein);
  carbsInput.value = String(applied.carbs);
  fatInput.value = String(applied.fat);
  syncPresetPills();
  setStatus(`Applied ${preset.replace("_", " ")} split`);
});

document.querySelectorAll(".preset-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = (btn as HTMLElement).dataset.preset;
    if (!preset) {
      return;
    }
    macroPresetSelect.value = preset;
    syncPresetPills();
  });
});

filterPanelToggle.addEventListener("click", () => {
  const collapsed = filterPanelEl.classList.toggle("filter-panel--collapsed");
  filterPanelToggle.setAttribute("aria-expanded", String(!collapsed));
});

headerRefreshBtn.addEventListener("click", () => {
  void refreshItems();
});

tabItemsBtn.addEventListener("click", () => {
  setActiveTab("items");
});

tabGoalsBtn.addEventListener("click", () => {
  setActiveTab("goals");
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
      cachedCsvRows = rows;
      csvImportInput.value = "";
      setStatus(rows.length ? `Imported ${rows.length} CSV rows` : "No rows parsed — check header");
      await refreshItems();
    } catch {
      setStatus("CSV import failed");
    }
  });
}

function bindDietFilterInputs(): void {
  const inputs = [
    filterVegetarianInput,
    filterVeganInput,
    filterGlutenFreeInput,
    filterDairyFreeInput,
    filterNutFreeInput,
    filterLowCarbInput
  ];
  for (const input of inputs) {
    input.addEventListener("change", () => {
      void persistDietFilters();
    });
  }
}

async function init(): Promise<void> {
  setActiveTab("items");
  bindHostTabRefresh();
  comparePanelCloseBtn.addEventListener("click", () => {
    closeComparePanel();
  });
  await loadForm();
  dietFilterPrefs = await getDietFilterPrefs();
  loadDietFiltersToForm();
  bindDietFilterInputs();
  mealLogState = await getMealLog();
  renderMealCartPanel();
  await refreshItems();
}

void init();
