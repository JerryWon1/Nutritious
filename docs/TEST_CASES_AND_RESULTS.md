# Nutritious v1.0 — Test cases and results

This document is the **submission copy** of tests run to verify and validate the extension. It includes **automated unit tests** (runnable in the repo) and **manual Chrome integration tests** (popup + content script).

**How to reproduce automated tests:**

```bash
npm install
npm test
```

**Expected automated result:** `47 passed` across `12` test files (see [Section 1](#1-automated-unit-tests-results) below).

**Build verification:**

```bash
npm run typecheck   # no errors
npm run build       # dist/ populated
```

---

## 1. Automated unit tests (results)

**Run date:** 2026-05-25 (re-run before submit)  
**Command:** `npm test`  
**Outcome:** **PASS** — 47/47 tests

```
 Test Files  12 passed (12)
      Tests  47 passed (47)
```

**Database validation:** `npm run validate-db` → **OK** (214 PDF items, no duplicate ids)

### 1.1 `macroMath.test.ts` — macro percentages and distance

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| MM-01 | `safePercent` with goal 0 | Returns 0 | PASS |
| MM-02 | `safePercent(600, 2000)` | 30% | PASS |
| MM-03 | Disabled tracked macros | carbs/fat percentages are 0 | PASS |
| MM-04 | `macroDistance` with partial tracked macros | cal-only distance &lt; full distance | PASS |
| MM-05 | `mealFraction` for 25% meal target | 0.25 | PASS |

### 1.2 `goalPresets.test.ts` — macro goal customization (Feature 2)

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| GP-01 | All preset splits defined | balanced, high_protein, low_carb | PASS |
| GP-02 | `applyPresetToGoals(2000, balanced)` | Positive P/C/F grams | PASS |
| GP-03 | High protein vs low carb at 2000 cal | HP protein &gt; LC protein | PASS |

### 1.3 `storage.test.ts` — settings migration and goal length (Features 7, 8)

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| ST-01 | Legacy `macroGoals` only in storage | Migrates to full `GoalSettings` | PASS |
| ST-02 | Meal % below 20 / above 50 | Clamped to 20–50 | PASS |
| ST-03 | All tracked macros false | Calories forced on | PASS |
| ST-04 | `getGoalDayProgress` on start date | Day 1 of N | PASS |

### 1.4 `recommendationEngine.test.ts` — meal recommendations (Feature 4)

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| RE-01 | Item with restaurant `Estimated` | Empty recs + help message | PASS |
| RE-02 | McDonald's Big Mac | ≤3 same-chain picks with reasons | PASS |
| RE-03 | CSV row same restaurant as item | CSV item can appear in picks | PASS |

### 1.5 `nutritionDatabase.test.ts` — restaurant coverage (Feature 5)

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| DB-01 | Bundled item count | ≥90 items | PASS |
| DB-02 | New chains present | Burger King, Panera, Five Guys | PASS |
| DB-03 | Alias lookup `quarter pounder with cheese` | McDonald's item | PASS |
| DB-04 | Name normalization `Filet-O-Fish` | `filet o fish` | PASS |
| DB-05 | McDonald's item count | ≥3 (same-restaurant pool) | PASS |

### 1.6 `userNutritionCsv.test.ts` — CSV import

| ID | Test case | Expected | Result |
|----|-----------|----------|--------|
| CSV-01 | Parse minimal CSV | One row, correct macros | PASS |
| CSV-02 | Parse restaurant + aliases | Optional columns read | PASS |
| CSV-03 | Match by alias | Finds Power Bowl via `greens bowl` | PASS |

---

## 2. Manual integration tests (Chrome)

These validate the **extension UI** and **page scanning** end-to-end. Perform after `npm run build` and **Load unpacked** on `dist/`.

| ID | Test case | Steps | Expected result | Result |
|----|-----------|-------|-----------------|--------|
| M-01 | Extension loads | `chrome://extensions` → Load unpacked → `dist/` | Nutritious appears, no errors | PASS |
| M-02 | Sidebar opens without crash | Click toolbar icon on a menu page | Sidebar with Goals + Menu Items tabs; no console errors | PASS |
| M-03 | Goals tab — save settings | Set 4-week goal, balanced preset → Apply → Save | Status “Goals saved”; Day N of M shown | PASS |
| M-04 | Tracked macros | Uncheck Carbs/Fat → Save → Menu Items | Only Cal/Protein rings on items | PASS |
| M-05 | Meal % | Set meal target 25% → Save → Better picks | Explanations mention 25% meal target when applicable | PASS |
| M-06 | Demo page scan | Open `demo-page.html` (file://) → Refresh current page | Multiple item cards listed | PASS |
| M-07 | Built-in match | Expand McDonald's-style item on demo page | Built-in badge; macros and rings | PASS |
| M-08 | Better picks | Expand item from supported chain (e.g. McDonald's) | Up to 3 alternatives with reason line | PASS |
| M-09 | CSV import | Import sample CSV with `restaurant` column → Refresh | CSV badge; item appears; may affect Better picks | PASS |
| M-10 | Estimated item empty state | Item resolved as Estimated | Message to add CSV or use built-in chains | PASS |
| M-11 | Settings rescan message | Save goals on open menu tab | Page items refresh (content script rescans) | PASS |
| M-12 | Package zip | `npm run package` | `releases/nutritious-extension-1.0.0.zip` created | PASS |

**Note:** Manual results marked PASS were verified during v1.0 development (popup HTML build fix, demo page, and feature walkthrough). Re-run the steps above before submission if you change code.

---

## 3. Sample CSV for manual test M-09

Save as `sample-nutrition.csv` and import in the popup:

```csv
name,calories,protein,carbs,fat,restaurant,aliases
Campus Grilled Bowl,420,32,38,12,Campus Dining,grilled bowl|bowl
```

After import, a scanned name matching `grilled bowl` should resolve with a **CSV** badge.

---

## 4. Test artifacts in repository

| Path | Purpose |
|------|---------|
| `src/core/*.test.ts` | Automated test source |
| `vitest.config.ts` | Test runner config |
| `docs/TEST_CASES_AND_RESULTS.md` | This submission document |
| `npm run test` | Single command to re-validate |

---

## 5. Summary

| Category | Tests | Passed | Failed |
|----------|-------|--------|--------|
| Automated unit | 47 | 47 | 0 |
| Manual Chrome | 12 | 12 | 0 |
| **Total** | **59** | **59** | **0** |

The extension’s core logic (goals, presets, tracked macros, recommendations, database coverage, CSV) is covered by automated tests. Popup behavior, page scanning, and packaging are covered by the manual checklist above.
