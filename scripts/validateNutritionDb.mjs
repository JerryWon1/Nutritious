#!/usr/bin/env node
/**
 * CI-friendly check: bundled nutrition DB has unique ids and full fiber/sugar.
 * Run: node scripts/validateNutritionDb.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pdfPath = join(root, "src/core/pdfSourcedItems.ts");
const legacyPath = join(root, "src/core/nutritionDatabase.ts");

function extractIds(content) {
  const ids = [];
  const re = /\bid:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

function countMissingFiberSugar(content) {
  const blocks = content.split(/\{\s*id:/);
  let missing = 0;
  for (const block of blocks.slice(1)) {
    if (!/fiber:\s*\d/.test(block) || !/sugar:\s*\d/.test(block)) {
      missing += 1;
    }
  }
  return missing;
}

const pdf = readFileSync(pdfPath, "utf8");
const legacy = readFileSync(legacyPath, "utf8");
const pdfIds = extractIds(pdf);
const legacyIds = extractIds(legacy);
const allIds = [...pdfIds, ...legacyIds];
const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
const pdfMissing = countMissingFiberSugar(pdf);
const legacyMissing = countMissingFiberSugar(legacy);

let failed = false;
if (dupes.length > 0) {
  console.error("Duplicate nutrition ids:", [...new Set(dupes)].slice(0, 10));
  failed = true;
}
if (pdfMissing > 0) {
  console.error(`pdfSourcedItems: ${pdfMissing} blocks missing fiber or sugar`);
  failed = true;
}
if (legacyMissing > 0) {
  console.error(`nutritionDatabase legacy: ${legacyMissing} blocks missing fiber or sugar`);
  failed = true;
}
if (failed) {
  process.exit(1);
}
console.log(
  `OK: ${pdfIds.length} PDF items, ${legacyIds.length} legacy ids scanned, no duplicate ids, fiber/sugar present`
);
