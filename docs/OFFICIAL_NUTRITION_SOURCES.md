# Official nutrition pages and PDFs (US-focused)

This document lists **primary sources** for each chain in the Nutritious bundled database. Use these for transcribing items, verifying macros, and updating `nutritionSource` fields.

**Important**

- Links are for **reference and manual download**; do not commit large PDFs to git unless your course allows it.
- Menus change often — check **effective dates** on each PDF/page.
- PDFs in [`src/core/pdfSourcedItems.ts`](../src/core/pdfSourcedItems.ts) were transcribed from files named in the “Local filename” column (often saved under a project `Documents/` folder).

To download many of these automatically into `Documents/`:

```bash
node scripts/downloadOfficialNutritionPdfs.mjs
```

---

## Quick reference

| Restaurant | Official web (start here) | Official PDF (direct, when available) | Local filename used in repo |
|------------|---------------------------|----------------------------------------|------------------------------|
| McDonald's | [Nutrition calculator](https://www.mcdonalds.com/us/en-us/about-our-food/nutrition-calculator.html) · [Nutrition info](https://www.mcdonalds.com/us/en-us/mcdonalds-app/nutrition.html) | [USA popular items PDF (OSU mirror of classic sheet)](https://fcs.osu.edu/sites/fcs/files/imce/PDFs/mcdonalds-nutrition-facts.pdf) | `mcdonalds-nutrition-facts.pdf` |
| Taco Bell | [Full nutrition info](https://www.tacobell.com/nutrition/info) · [Calculator](https://www.tacobell.com/nutrition/calculator) · [Allergens](https://www.tacobell.com/nutrition/allergen-info) | No single US PDF on site; use web tables or franchise PDF if provided | `Taco_bell.pdf` |
| Subway | [Nutrition & allergies (USA)](https://www.subway.com/en-us/menunutrition/nutrition) | [US nutrition Sep 2024 PDF](https://www.subway.com/en-us/-/media/northamerica/usa/nutrition/nutritiondocuments/us_nutrition_9-18-24.pdf) | `subway.pdf` |
| Wendy's | [Nutrition & allergens](https://www.wendys.com/nutrition-allergens) | [US Core Menu PDF (Feb 2025)](https://www.wendys.com/sites/default/files/2025-02/Core%20Menu.pdf) | `wendy's.pdf` |
| Starbucks | [Menu nutrition hub](https://www.starbucks.com/menu/nutrition) · per-item e.g. [product nutrition](https://www.starbucks.com/menu/product/367/single/nutrition) | [Beverage nutritional facts (Jun 2024)](https://starbuckspr.com/wp-content/uploads/2024/06/Beverage-Nutritional-Facts-Jun.pdf) · [Food nutritional facts (Mar 2023)](https://starbuckspr.com/wp-content/uploads/2023/03/Food-Nutritional-Facts.pdf) | `Starbucks.pdf` |
| Domino's | [Nutrition / Cal-o-meter](https://www.dominos.com/en/pages/content/nutrition) | [Domino's Nutrition Guide (US)](https://cache.dominos.com/olo/6_168_0/assets/build/market/US/_en/pdf/DominosNutritionGuide.pdf) | `DominosNutritionGuide.pdf` |
| Dave's Hot Chicken | [US site](https://daveshotchicken.com/) · [Menu ordering](https://store.daveshotchicken.com/menu/) | [UK nutritional guide Apr 2026](https://www.daveshotchickenuk.com/propeller/uploads/2026/04/Nutritional-Guide-April-2026.pdf) (US PDF often in-store; ask manager) | `Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf` |
| Chipotle | [Nutrition calculator](https://www.chipotle.com/nutrition-calculator) · [Allergens](https://www.chipotle.com/allergens) | [US nutrition facts paper menu (Mar 2025)](https://www.chipotle.com/content/dam/chipotle/menu/nutrition/US-Nutrition-Facts-Paper-Menu-3-2025.pdf) | — (legacy DB / web) |
| Panda Express | [Nutrition & allergen info](https://www.pandaexpress.com/nutritioninformation) | Same page exports table; archived PDF mirrors exist | — (legacy DB / web) |
| Chick-fil-A | [Nutrition & allergens](https://www.chick-fil-a.com/nutrition-allergens) | [Allergen PDF (CDN)](https://d1fd34dzzl09j.cloudfront.net/Allergen%20PDFs/AllergenInfo_1118_v7_1.pdf) (includes nutrition columns on web) | — (legacy DB / web) |
| Burger King | [BK.com nutrition](https://www.bk.com/menu/nutrition) | [USA nutrition Nov 2022 PDF](https://bk-use1-prod.sites.rbictg.com/nutrition/nutrition.pdf) · [Allergens PDF](https://bk-use1-prod.sites.rbictg.com/nutrition/allergens.pdf) | `burger-king-nutrition.pdf` |
| Panera | [Allergen & nutrition](https://www.panerabread.com/en-us/menu/nutritious-eating/allergen-and-nutrition-information.html) | PDF link on that page (CDN path changes; download manually) | `panera-nutrition.pdf` |
| Five Guys | [Nutrition & ingredients](https://www.fiveguys.com/menu/nutrition-allergens) | [US nutrition & allergen guide Jul 2025](https://www.fiveguys.com/wp-content/uploads/2025/07/five-guys-us-nutrition-allergen-guide-english-1-final.pdf) | `five-guys-nutrition.pdf` |

---

## Notes by chain

### McDonald's

- **Best for automation:** nutrition calculator (every SKU, current formulas).
- **PDF:** The classic “USA Nutrition Facts for Popular Menu Items” sheet is widely mirrored; macros include **fiber and sugar** columns — good for your extended tracked macros.

### Taco Bell

- Taco Bell publishes **HTML nutrition tables**, not a stable public PDF URL on tacobell.com.
- Your `Taco_bell.pdf` likely came from a franchise/operator packet; re-verify against [Full Nutrition Info](https://www.tacobell.com/nutrition/info) when updating items.

### Subway

- Use the **September 2024** US PDF linked above (newer than June 2023 archive).
- Footlong values are typically **2×** the 6" values per Subway’s footnotes.

### Wendy's

- Official **Core Menu** PDF on wendys.com is the authoritative US table (kcal, fat, carbs, sugars, fibre, protein, salt).

### Starbucks

- US nutrition is split **beverage** vs **food** PDFs on the Puerto Rico corporate CDN (`starbuckspr.com`); the main starbucks.com menu also has per-product pages.
- Sizes (Short/Tall/Grande/Venti) matter — transcribe the size you expect users to order.

### Domino's

- Nutrition is **per crust/topping/slice**; the PDF is large and modular. Extension items use simplified “1/3 small pizza” style rows.

### Dave's Hot Chicken

- **US:** No stable public PDF found on daveshotchicken.com; nutrition is often available in-store or via operator guides.
- **UK PDF** (linked above) is a useful structure reference; **verify US values** before replacing US rows.

### Chipotle, Panda Express, Chick-fil-A

- Built-in items in [`nutritionDatabase.ts`](../src/core/nutritionDatabase.ts) were transcribed from **official web calculators / nutrition pages**, not from bundled PDFs.
- Chipotle’s **Mar 2025** paper-menu PDF is the best single downloadable US reference.

### Burger King, Panera, Five Guys

- These were added at launch with **representative** filenames (`burger-king-nutrition.pdf`, etc.).
- Re-transcribe from the **official PDFs linked above** to replace approximate values and add fiber/sugar where listed.
- **Panera:** open the allergen & nutrition page and use the site’s “Nutrition Guide” PDF download (direct CDN URLs change and may return 404 from scripts).

---

## Maintenance workflow

1. Download or open the official source for a chain.
2. Transcribe into [`pdfSourcedItems.ts`](../src/core/pdfSourcedItems.ts) or `LEGACY_NUTRITION_ITEMS` in [`nutritionDatabase.ts`](../src/core/nutritionDatabase.ts).
3. Set `nutritionSource` to the PDF filename or URL path for traceability.
4. Extract text from all PDFs in `Documents/`, then transcribe:

   ```bash
   npm run extract-pdf -- Documents
   ```

   Output: `Documents/extracted/*.txt`

---

## Disclaimer

Nutrition data belongs to each restaurant brand. This project uses small **samples** for education/demo purposes. For production or health decisions, always use the brand’s current official tools.
