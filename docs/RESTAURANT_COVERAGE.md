# Restaurant coverage (v1.0)

Nutritious ships a **bundled, local-only** nutrition database. Coverage means enough menu items per chain that **same-restaurant Better picks** can suggest alternatives (needs ≥3 items per `restaurant` name).

## Chains and item counts

| Restaurant | Approx. items | Primary source |
|------------|---------------|----------------|
| McDonald's | 38 | `mcdonalds-nutrition-facts.pdf` |
| Taco Bell | 37 | `Taco-Bell.pdf` / `Taco_bell.pdf` |
| Subway | 25 | `subway.pdf` |
| Wendy's | 21 | `wendy's.pdf` |
| Starbucks | 20 | `Starbucks-food.pdf` + `Starbucks-beverages.pdf` |
| Burger King | 20 | `burger-king-nutrition.pdf` |
| Chipotle | 16 | `chipotle-us-nutrition-2025.pdf` |
| Domino's | 11 | `DominosNutritionGuide.pdf` |
| Five Guys | 11 | `five-guys-nutrition.pdf` |
| Dave's Hot Chicken | 8 | `Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf` (UK guide) |
| Panera | 7 | Representative placeholders (no PDF in `Documents/` yet) |
| Panda Express | 8+ | Legacy (official nutrition pages) |
| Chick-fil-A | 8+ | Legacy (official nutrition pages) |

**Total bundled items:** ~240+ PDF-sourced rows plus legacy chains (see `src/core/nutritionDatabase.ts`).

## Not covered

- Full menus for every SKU at every chain
- Automatic brand detection from the page URL
- Restaurants without rows in the built-in DB (use **CSV import** in the popup)

## CSV override

Import `name,calories,protein,carbs,fat` with optional `restaurant` and `aliases` to add coverage for campus dining, local spots, or missing chains. CSV rows are included in **Better picks** when the `restaurant` column matches.

## Official sources

See **[OFFICIAL_NUTRITION_SOURCES.md](OFFICIAL_NUTRITION_SOURCES.md)** for links to each chain’s nutrition page/PDF. Download PDFs locally:

```bash
node scripts/downloadOfficialNutritionPdfs.mjs
```

## Adding more items

1. Transcribe from the chain’s official nutrition PDF or calculator (sources above).
2. Add to `src/core/pdfSourcedItems.ts` (preferred) or `LEGACY_NUTRITION_ITEMS` in `src/core/nutritionDatabase.ts`.
3. Set `nutritionSource` when from a PDF.
4. Add `aliases` that match how menu text appears on websites.
