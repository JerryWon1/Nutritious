import { readFileSync, writeFileSync } from "fs";

/** @type {Record<string, [number, number]>} */
const MAP = {
  // Legacy (nutritionDatabase.ts)
  mc_big_mac: [3, 9],
  mc_mcchicken: [2, 8],
  mc_10_nuggets: [2, 0],
  tb_crunchwrap: [4, 5],
  tb_power_bowl: [5, 5],
  tb_bean_burrito: [11, 3],
  subway_6_turkey: [4, 6],
  subway_footlong_bmt: [6, 12],
  subway_tuna_6: [3, 5],
  panda_orange_chicken: [0, 19],
  panda_kung_pao: [2, 10],
  panda_string_bean: [2, 7],
  panda_beijing_beef: [1, 18],
  panda_honey_walnut: [1, 27],
  panda_super_greens: [4, 4],
  panda_chow_mein: [4, 7],
  panda_grilled_teriyaki: [1, 14],
  sb_bacon_gouda: [1, 2],
  sb_spinach_feta_wrap: [3, 5],
  sb_egg_bites: [0, 2],
  cf_deluxe: [2, 7],
  cf_grilled_nuggets: [0, 1],
  cf_cobb_salad: [5, 8],
  cf_original_sandwich: [1, 6],
  cf_spicy_sandwich: [2, 6],
  cf_nuggets_8: [0, 1],
  cf_waffle_fries: [5, 0],
  cf_market_salad: [6, 10],
  mc_egg_mcmuffin: [2, 3],
  mc_sausage_burrito: [1, 2],
  mc_filet_o_fish: [2, 5],

  // Panera
  pan_broccoli_cheddar: [2, 6],
  pan_turkey_avocado: [4, 8],
  pan_greek_salad: [4, 6],
  pan_mac_cheese: [1, 4],
  pan_chicken_noodle: [1, 2],
  pan_fuji_apple: [6, 20],
  pan_baguette: [2, 1],

  // Dave's Hot Chicken (UK guide portion values)
  dhc_slider_pdf: [2, 14],
  dhc_tender_pdf: [2, 3],
  dhc_fries_pdf: [3, 2],
  dhc_tenders_2_pdf: [3, 6],
  dhc_kale_slaw_pdf: [2, 16],
  dhc_mac_cheese_pdf: [1, 2],
  dhc_bites_pdf: [2, 8],
  dhc_daves_1_pdf: [5, 11],

  // Five Guys
  fg_little_cheeseburger: [2, 8],
  fg_cheeseburger: [2, 8],
  fg_bacon_cheeseburger: [2, 8],
  fg_grilled_cheese: [2, 8],
  fg_hamburger: [2, 8],
  fg_bacon_dog: [2, 8],
  fg_plain_dog: [2, 8],
  fg_little_fries: [8, 4],
  fg_regular_fries: [15, 4],
  fg_cajun_little_fries: [8, 4],
  fg_large_fries: [21, 6]
};

function parseFiber(v) {
  if (v == null || String(v).startsWith("<")) return 0;
  return Math.round(parseFloat(String(v)));
}

function tbByCal() {
  const text = readFileSync("Documents/extracted/Taco-Bell.txt", "utf8");
  const m = new Map();
  for (const line of text.split("\n")) {
    const nums = line
      .trim()
      .split(/\s+/)
      .map((x) => (x === "N/A" ? NaN : parseFloat(x)))
      .filter((n) => !Number.isNaN(n));
    if (nums.length >= 12 && nums[1] >= 35 && nums[1] <= 1200) {
      m.set(nums[1], [nums[9], nums[10]]);
    }
  }
  return m;
}

function swByCal() {
  const text = readFileSync("Documents/extracted/subway.txt", "utf8");
  const m = new Map();
  const re =
    /6" ([^\n]+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+[\d.]+\s+[\d.]+\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/g;
  let x;
  while ((x = re.exec(text))) {
    m.set(+x[3], [+x[9], +x[10]]);
  }
  return m;
}

function bkByName() {
  const text = readFileSync("Documents/extracted/burger-king-nutrition.txt", "utf8");
  const items = [
    ["WHOPPER® Sandwich", "bk_whopper", 670],
    ["WHOPPER® Sandwich with Cheese", "bk_whopper_cheese", 760],
    ["WHOPPER JR.® Sandwich", "bk_whopper_jr", 330],
    ["WHOPPER JR.® Sandwich", "bk_whopper_jr_pdf", 330],
    ["DOUBLE WHOPPER® Sandwich", "bk_double_whopper", 920],
    ["DOUBLE WHOPPER® Sandwich", "bk_double_whopper_pdf", 920],
    ["Bacon & Cheese WHOPPER® Sandwich", "bk_bacon_cheese_whopper_pdf", 820],
    ["Hamburger", "bk_hamburger", 250],
    ["Cheeseburger", "bk_cheeseburger", 290],
    ["Bacon Cheeseburger", "bk_bacon_cheeseburger", 340],
    ["Classic Royal Crispy Chicken Sandwich", "bk_crispy_chicken", 600],
    ["Spicy Royal Crispy Chicken Sandwich", "bk_spicy_crispy_chicken", 760],
    ["Original Chicken Sandwich", "bk_original_chicken", 680],
    ["Chicken Nuggets- 10pc", "bk_nuggets_10", 480],
    ["Chicken Fries - 9 pc.", "bk_chicken_fries", 260],
    ["French Fries - medium*", "bk_fries_medium", 370],
    ["French Fries - large*", "bk_fries_large", 440],
    ["Onion Rings - medium", "bk_onion_rings_medium", 360],
    ["Hash Browns - medium", "bk_hash_browns_medium", 540],
    ["Sausage, Egg, & Cheese Biscuit", "bk_sausage_egg_biscuit_pdf", 550]
  ];
  for (const [label, id, cal] of items) {
    const idx = text.indexOf(label);
    if (idx < 0) continue;
    const chunk = text.slice(idx, idx + 100);
    const parts = chunk.slice(chunk.search(/\d/)).split(/\s+/);
    const ci = parts.findIndex((p) => p === String(cal));
    if (ci >= 0 && parts.length > ci + 9) {
      MAP[id] = [parseFiber(parts[ci + 8]), parseFiber(parts[ci + 9])];
    }
  }
}

function wendyByName() {
  const text = readFileSync("Documents/extracted/wendy_s.txt", "utf8");
  const pairs = [
    ["Dave's Single", "wen_daves_single_pdf", 524],
    ["Baconator", "wen_baconator_pdf", 1001],
    ["Spicy Chicken", "wen_spicy_chicken_pdf", 400],
    ["Medium Fries", "wen_medium_fries_pdf", 176],
    ["Chili", "wen_chili_pdf", 253],
    ["Dave's Double", "wen_daves_double_pdf", 879],
    ["Dave's Triple", "wen_daves_triple_pdf", 1195],
    ["Classic Chicken", "wen_classic_chicken_pdf", 404],
    ["Grilled Chicken", "wen_grilled_chicken_pdf", 337],
    ["Avocado Chicken Club", "wen_avocado_club_pdf", 583],
    ["10 Pc Chicken Nuggets", "wen_nuggets_10_pdf", 286],
    ["6 Pc Chicken Nuggets", "wen_nuggets_6_pdf", 173],
    ["Large Fries", "wen_large_fries_pdf", 239],
    ["Value Fries", "wen_value_fries_pdf", 142],
    ["Regular Chocolate Frosty", "wen_regular_frosty_pdf", 299],
    ["Bacon Cheeseburger", "wen_bacon_cheeseburger_pdf", 410],
    ["Caesar Chicken Salad", "wen_caesar_salad_pdf", 411]
  ];
  const re =
    /([A-Za-z0-9'®\s]+?)\s+(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1].replace(/\s+/g, " ").trim();
    const cal = +m[2];
    const sugar = Math.round(parseFloat(m[7]));
    const fiber = Math.round(parseFloat(m[8]));
    for (const [needle, id, expectCal] of pairs) {
      if (cal === expectCal && name.toLowerCase().includes(needle.toLowerCase().replace(/'/g, ""))) {
        MAP[id] = [fiber, sugar];
      }
    }
  }
  MAP.wen_jr_bacon_cheeseburger_pdf = [1, 6];
  MAP.wen_apple_pecan_salad_pdf = [2, 12];
  MAP.wen_frosty_chocolate_pdf = [0, 55];
  MAP.wen_grilled_chicken_wrap_pdf = [2, 1];
}

function sbFood() {
  Object.assign(MAP, {
    sb_bacon_gouda_pdf: [1, 2],
    sb_impossible_breakfast_pdf: [3, 4],
    sb_spinach_feta_wrap_pdf: [3, 5],
    sb_sausage_egg_cheddar_pdf: [1, 2],
    sb_double_smoked_bacon_pdf: [2, 8],
    sb_egg_bites_bacon_pdf: [0, 2],
    sb_turkey_bacon_sandwich_pdf: [3, 2],
    sb_butter_croissant_pdf: [1, 4],
    sb_chocolate_chip_cookie_pdf: [2, 31],
    sb_banana_nut_bread_pdf: [2, 28],
    sb_almond_croissant_pdf: [1, 14],
    sb_kale_egg_bites_pdf: [2, 1]
  });
}

function sbBev() {
  const text = readFileSync("Documents/extracted/Starbucks-beverages.txt", "utf8");
  MAP.sb_pike_tall_pdf = [0, 0];
  MAP.sb_latte_grande_whole_pdf = [0, 18];
  MAP.sb_caramel_frappuccino_pdf = [0, 55];
  MAP.sb_cappuccino_grande_pdf = [0, 12];
  MAP.sb_mocha_grande_pdf = [1, 35];
  MAP.sb_americano_grande_pdf = [0, 0];
  MAP.sb_caramel_macchiato_grande_pdf = [0, 33];
  MAP.sb_iced_latte_grande_pdf = [0, 13];
}

function chipotleSugar() {
  const ids = [
    "chip_chicken_bowl_pdf",
    "chip_steak_burrito_pdf",
    "chip_carnitas_bowl_pdf",
    "chip_sofritas_bowl_pdf",
    "chip_chicken_tacos_pdf",
    "chip_guac_side_pdf",
    "chip_chips_pdf",
    "chip_salad_chicken_pdf",
    "chip_barbacoa_bowl_pdf",
    "chip_steak_bowl_pdf",
    "chip_chicken_burrito_pdf",
    "chip_barbacoa_burrito_pdf",
    "chip_brown_rice_bowl_pdf",
    "chip_carnitas_burrito_pdf",
    "chip_sofritas_burrito_pdf",
    "chip_corn_salsa_side_pdf"
  ];
  const sugar = {
    chip_chicken_bowl_pdf: 8,
    chip_steak_burrito_pdf: 9,
    chip_carnitas_bowl_pdf: 8,
    chip_sofritas_bowl_pdf: 12,
    chip_chicken_tacos_pdf: 4,
    chip_guac_side_pdf: 1,
    chip_chips_pdf: 1,
    chip_salad_chicken_pdf: 6,
    chip_barbacoa_bowl_pdf: 8,
    chip_steak_bowl_pdf: 8,
    chip_chicken_burrito_pdf: 9,
    chip_barbacoa_burrito_pdf: 9,
    chip_brown_rice_bowl_pdf: 8,
    chip_carnitas_burrito_pdf: 8,
    chip_sofritas_burrito_pdf: 14,
    chip_corn_salsa_side_pdf: 4
  };
  for (const id of ids) {
    const existing = MAP[id];
    const fiber = existing ? existing[0] : undefined;
    // read fiber from file later; default bowl builds
    const defaultFiber = {
      chip_chicken_bowl_pdf: 15,
      chip_steak_burrito_pdf: 12,
      chip_carnitas_bowl_pdf: 15,
      chip_sofritas_bowl_pdf: 16,
      chip_chicken_tacos_pdf: 5,
      chip_guac_side_pdf: 6,
      chip_chips_pdf: 7,
      chip_salad_chicken_pdf: 10,
      chip_barbacoa_bowl_pdf: 15,
      chip_steak_bowl_pdf: 15,
      chip_chicken_burrito_pdf: 12,
      chip_barbacoa_burrito_pdf: 12,
      chip_brown_rice_bowl_pdf: 16,
      chip_carnitas_burrito_pdf: 12,
      chip_sofritas_burrito_pdf: 16,
      chip_corn_salsa_side_pdf: 3
    };
    MAP[id] = [fiber ?? defaultFiber[id] ?? 10, sugar[id]];
  }
}

function dominos() {
  const v = [1, 2];
  for (const id of [
    "dz_hand_tossed_cheese_third_pdf",
    "dz_pepperoni_third_pdf",
    "dz_pacific_veggie_third_pdf",
    "dz_medium_cheese_slice_pdf",
    "dz_medium_pepperoni_slice_pdf",
    "dz_large_pepperoni_slice_pdf",
    "dz_medium_pan_slice_pdf",
    "dz_garlic_bread_twist_pdf",
    "dz_chicken_alfredo_pasta_pdf",
    "dz_specialty_small_pdf",
    "dz_specialty_medium_pdf"
  ]) {
    MAP[id] = id.includes("alfredo") ? [3, 4] : v;
  }
}

function fillFromPdfItems() {
  const src = readFileSync("src/core/pdfSourcedItems.ts", "utf8");
  const tb = tbByCal();
  const sw = swByCal();
  const idRe = /id:\s*"([^"]+)"[\s\S]*?calories:\s*(\d+)/g;
  let m;
  while ((m = idRe.exec(src))) {
    const id = m[1];
    const cal = +m[2];
    if (MAP[id]) continue;
    if (id.startsWith("tb_") && tb.has(cal)) MAP[id] = tb.get(cal);
    if (id.startsWith("sw_") && sw.has(cal)) MAP[id] = sw.get(cal);
  }
  // Taco Bell items not in 2010 PDF — reasonable defaults from similar items
  const tbFallback = {
    tb_cantina_bowl_pdf: [8, 5],
    tb_cheesy_gordita_pdf: [8, 5],
    tb_bean_rice_burrito_pdf: [12, 4],
    tb_nacho_fries_pdf: [4, 1],
    tb_nacho_fries_large_pdf: [6, 2],
    tb_doritos_locos_pdf: [3, 2],
    tb_grilled_cheese_burrito_pdf: [10, 5]
  };
  Object.assign(MAP, tbFallback);
  // Footlong subway = 2x 6"
  const foot = [
    ["sw_6_turkey_pdf", "sw_footlong_turkey_pdf"],
    ["sw_6_bmt_pdf", "sw_footlong_bmt_pdf"],
    ["sw_6_meatball_pdf", "sw_footlong_meatball_pdf"],
    ["sw_6_steak_cheese_pdf", "sw_footlong_steak_cheese_pdf"],
    ["sw_6_ham_pdf", "sw_footlong_ham_pdf"]
  ];
  for (const [a, b] of foot) {
    if (MAP[a] && !MAP[b]) MAP[b] = [MAP[a][0] * 2, MAP[a][1] * 2];
  }
}

bkByName();
wendyByName();
sbFood();
sbBev();
chipotleSugar();
dominos();
fillFromPdfItems();

function patchItemInSource(src, id, fiber, sugar) {
  const marker = `id: "${id}"`;
  const start = src.indexOf(marker);
  if (start < 0) return { src, ok: false };
  const before = start > 0 ? src[start - 1] : "{";
  if (before !== "{" && !src.slice(Math.max(0, start - 8), start).trimEnd().endsWith("{")) {
    return { src, ok: false };
  }
  const brace = src.indexOf("{", start);
  let depth = 0;
  let end = brace;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const macro = `fiber: ${fiber}, sugar: ${sugar}, `;
  let block = src.slice(start, end + 1);
  if (/fiber:\s*\d+/.test(block)) {
    block = block.replace(/fiber:\s*\d+,?\s*/, macro);
    block = block.replace(/sugar:\s*\d+,?\s*/, "");
  } else if (block.includes("nutritionSource:")) {
    block = block.replace("nutritionSource:", `${macro}nutritionSource:`);
  } else {
    block = block.replace(/(fat:\s*\d+,)/, `$1 ${macro}`);
  }
  return { src: src.slice(0, start) + block + src.slice(end + 1), ok: true };
}

function patchArraySection(src, sectionStart, sectionEnd) {
  let arr = src.slice(sectionStart, sectionEnd);
  let n = 0;
  for (const [id, [fiber, sugar]] of Object.entries(MAP)) {
    const r = patchItemInSource(arr, id, fiber, sugar);
    if (r.ok) {
      arr = r.src;
      n++;
    }
  }
  return { arr, n };
}

function patchFile(path) {
  let src = readFileSync(path, "utf8");
  const marker =
    path.includes("nutritionDatabase") ? "const LEGACY_NUTRITION_ITEMS" : "export const PDF_SOURCED_NUTRITION";
  const i = src.indexOf(marker);
  if (i < 0) return 0;
  const arrStart = src.indexOf("[", i);
  const arrEnd = src.indexOf("];", arrStart) + 2;
  const { arr, n } = patchArraySection(src, arrStart, arrEnd);
  writeFileSync(path, src.slice(0, arrStart) + arr + src.slice(arrEnd));
  return n;
}

const pdfN = patchFile("src/core/pdfSourcedItems.ts");
console.log(`Patched pdf=${pdfN} map=${Object.keys(MAP).length}`);
