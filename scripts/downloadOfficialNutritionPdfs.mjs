#!/usr/bin/env node
/**
 * Downloads official nutrition PDFs into Documents/ for local transcription.
 * Does not commit PDFs to git (see .gitignore).
 *
 * Usage: node scripts/downloadOfficialNutritionPdfs.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "Documents");

/** @type {{ filename: string; url: string; restaurant: string; optional?: boolean }[]} */
const SOURCES = [
  {
    restaurant: "McDonald's",
    filename: "mcdonalds-nutrition-facts.pdf",
    url: "https://fcs.osu.edu/sites/fcs/files/imce/PDFs/mcdonalds-nutrition-facts.pdf"
  },
  {
    restaurant: "Subway",
    filename: "subway.pdf",
    url: "https://www.subway.com/en-us/-/media/northamerica/usa/nutrition/nutritiondocuments/us_nutrition_9-18-24.pdf"
  },
  {
    restaurant: "Wendy's",
    filename: "wendy's.pdf",
    url: "https://www.wendys.com/sites/default/files/2025-02/Core%20Menu.pdf"
  },
  {
    restaurant: "Starbucks (beverages)",
    filename: "Starbucks-beverages.pdf",
    url: "https://starbuckspr.com/wp-content/uploads/2024/06/Beverage-Nutritional-Facts-Jun.pdf"
  },
  {
    restaurant: "Starbucks (food)",
    filename: "Starbucks-food.pdf",
    url: "https://starbuckspr.com/wp-content/uploads/2023/03/Food-Nutritional-Facts.pdf"
  },
  {
    restaurant: "Domino's",
    filename: "DominosNutritionGuide.pdf",
    url: "https://cache.dominos.com/olo/6_168_0/assets/build/market/US/_en/pdf/DominosNutritionGuide.pdf"
  },
  {
    restaurant: "Chipotle",
    filename: "chipotle-us-nutrition-2025.pdf",
    url: "https://www.chipotle.com/content/dam/chipotle/menu/nutrition/US-Nutrition-Facts-Paper-Menu-3-2025.pdf"
  },
  {
    restaurant: "Burger King",
    filename: "burger-king-nutrition.pdf",
    url: "https://bk-use1-prod.sites.rbictg.com/nutrition/nutrition.pdf"
  },
  // Panera CDN URLs change; download from allergen page if this 404s:
  // https://www.panerabread.com/en-us/menu/nutritious-eating/allergen-and-nutrition-information.html
  {
    restaurant: "Panera",
    filename: "panera-nutrition.pdf",
    url: "https://www.panerabread.com/content/dam/panerabread/documents/c2-25-nutrition-guide-bof.pdf",
    optional: true
  },
  {
    restaurant: "Five Guys",
    filename: "five-guys-nutrition.pdf",
    url: "https://www.fiveguys.com/wp-content/uploads/2025/07/five-guys-us-nutrition-allergen-guide-english-1-final.pdf"
  },
  {
    restaurant: "Dave's Hot Chicken (UK guide — verify US)",
    filename: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf",
    url: "https://www.daveshotchickenuk.com/propeller/uploads/2026/04/Nutritional-Guide-April-2026.pdf"
  },
  {
    restaurant: "Chick-fil-A (allergen + reference)",
    filename: "chick-fil-a-allergen.pdf",
    url: "https://d1fd34dzzl09j.cloudfront.net/Allergen%20PDFs/AllergenInfo_1118_v7_1.pdf"
  }
];

async function downloadOne({ filename, url, restaurant }) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Nutritious/1.0 (class project; nutrition PDF download)" }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${restaurant}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const path = join(outDir, filename);
  await writeFile(path, buf);
  return { path, bytes: buf.length };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  console.log(`Saving to ${outDir}\n`);

  const failed = [];
  for (const source of SOURCES) {
    try {
      const { path, bytes } = await downloadOne(source);
      console.log(`OK  ${source.restaurant} → ${path} (${bytes} bytes)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const label = source.optional ? "SKIP (optional)" : "FAIL";
      console.error(`${label} ${source.restaurant}: ${msg}`);
      console.error(`     ${source.url}`);
      if (!source.optional) {
        failed.push(source.restaurant);
      }
    }
  }

  console.log("\n--- Manual / web-only ---");
  console.log("Taco Bell: no stable public PDF — use https://www.tacobell.com/nutrition/info");
  console.log("Panera: download PDF from https://www.panerabread.com/en-us/menu/nutritious-eating/allergen-and-nutrition-information.html");
  console.log("Panda Express: https://www.pandaexpress.com/nutritioninformation");
  console.log("McDonald's (live): https://www.mcdonalds.com/us/en-us/about-our-food/nutrition-calculator.html");

  if (failed.length) {
    console.error(`\n${failed.length} download(s) failed. See docs/OFFICIAL_NUTRITION_SOURCES.md for URLs.`);
    process.exitCode = 1;
  } else {
    console.log("\nAll listed PDFs downloaded. See docs/OFFICIAL_NUTRITION_SOURCES.md for full link list.");
  }
}

void main();
