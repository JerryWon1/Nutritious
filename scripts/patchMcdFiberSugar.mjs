import { readFileSync, writeFileSync } from "fs";

/** fiber/sugar (g) from mcdonalds-nutrition-facts.pdf */
const MCD = {
  mc_big_mac_pdf: [3, 9],
  mc_mcchicken_pdf: [2, 8],
  mc_nuggets_10_pdf: [2, 0],
  mc_nuggets_6_pdf: [1, 0],
  mc_nuggets_4_pdf: [1, 0],
  mc_nuggets_20_pdf: [3, 0],
  mc_quarter_pdf: [3, 11],
  mc_hamburger_pdf: [1, 6],
  mc_cheeseburger_pdf: [2, 7],
  mc_mcdouble_pdf: [2, 7],
  mc_fries_medium_pdf: [4, 0],
  mc_fries_small_pdf: [2, 0],
  mc_fries_large_pdf: [5, 0],
  mc_egg_mcmuffin_pdf: [2, 3],
  mc_sausage_burrito_pdf: [1, 2],
  mc_sausage_mcmuffin_pdf: [4, 2],
  mc_filet_pdf: [2, 5],
  mc_hash_browns_pdf: [2, 0],
  mc_mcfries_kids_pdf: [1, 0],
  mc_mcflurry_oreo_pdf: [1, 64],
  mc_grilled_chicken_pdf: [3, 10],
  mc_spicy_mcchicken_pdf: [2, 8],
  mc_apple_pie_pdf: [2, 13],
  mc_double_quarter_pdf: [3, 11],
  mc_buttermilk_crispy_pdf: [4, 16],
  mc_premium_sw_grilled_salad_pdf: [6, 9],
  mc_premium_asian_grilled_salad_pdf: [5, 10],
  mc_sausage_egg_mcgriddles_pdf: [2, 9],
  mc_sausage_mcgriddles_pdf: [2, 8],
  mc_big_breakfast_pdf: [3, 3],
  mc_double_cheeseburger_pdf: [2, 8],
  mc_snack_wrap_crispy_pdf: [1, 5],
  mc_mcwrap_ranch_crispy_pdf: [4, 15],
  mc_bacon_clubhouse_pdf: [4, 14],
  mc_bacon_clubhouse_grilled_pdf: [3, 14],
  mc_mcwrap_sweet_chili_grilled_pdf: [3, 13],
  mc_bacon_egg_biscuit_pdf: [2, 3],
  mc_premium_bacon_ranch_crispy_salad_pdf: [3, 12]
};

function patchItem(arr, id, fiber, sugar) {
  const marker = `id: "${id}"`;
  const start = arr.indexOf(marker);
  if (start < 0) return arr;
  const brace = arr.indexOf("{", start);
  let depth = 0;
  let end = brace;
  for (let j = brace; j < arr.length; j++) {
    if (arr[j] === "{") depth++;
    else if (arr[j] === "}") {
      depth--;
      if (depth === 0) {
        end = j;
        break;
      }
    }
  }
  const macro = `fiber: ${fiber}, sugar: ${sugar}, `;
  let block = arr.slice(start, end + 1);
  if (/fiber:\s*\d+/.test(block)) {
    block = block.replace(/fiber:\s*\d+,?\s*/, macro);
    block = block.replace(/sugar:\s*\d+,?\s*/, "");
  } else if (block.includes("nutritionSource:")) {
    block = block.replace("nutritionSource:", `${macro}nutritionSource:`);
  } else {
    block = block.replace(/(fat:\s*\d+,)/, `$1 ${macro}`);
  }
  return arr.slice(0, start) + block + arr.slice(end + 1);
}

let src = readFileSync("src/core/pdfSourcedItems.ts", "utf8");
const a0 = src.indexOf("[", src.indexOf("export const PDF_SOURCED"));
const a1 = src.indexOf("];", a0) + 2;
let arr = src.slice(a0, a1);

for (const [id, [fiber, sugar]] of Object.entries(MCD)) {
  arr = patchItem(arr, id, fiber, sugar);
}

writeFileSync("src/core/pdfSourcedItems.ts", src.slice(0, a0) + arr + src.slice(a1));
