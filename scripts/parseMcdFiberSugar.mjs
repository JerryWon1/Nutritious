import { readFileSync } from "fs";

const text = readFileSync("Documents/extracted/mcdonalds-nutrition-facts.txt", "utf8").replace(/\s+/g, " ");

/** Fixed offsets from calories value in PDF row */
function parseFromName(namePattern, expectedCal) {
  const escaped = namePattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`${escaped}`, "i");
  const m = re.exec(text);
  if (!m) return null;
  const slice = text.slice(m.index, m.index + 550);
  const nums = slice.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let calIdx = nums.findIndex((n, i) => i > 2 && Math.abs(n - expectedCal) <= 15);
  if (calIdx < 0) return null;
  if (calIdx + 16 >= nums.length) return null;
  return {
    fiber: nums[calIdx + 13],
    sugar: nums[calIdx + 15],
    protein: nums[calIdx + 16]
  };
}

const items = [
  ["Big Mac", 540],
  ["McChicken ®", 370],
  ["Chicken McNuggets® (10 piece)", 470],
  ["Chicken McNuggets® (6 piece)", 280],
  ["Chicken McNuggets® (4 piece)", 190],
  ["Chicken McNuggets® (20 piece)", 940],
  ["Quarter Pounder® with Cheese", 520],
  ["Hamburger", 250],
  ["Cheeseburger", 300],
  ["McDouble", 390],
  ["Double Cheeseburger", 440],
  ["Double Quarter Pounder with Cheese", 780],
  ["Small French Fries", 230],
  ["Medium French Fries", 340],
  ["Large French Fries", 480],
  ["Kids Fries", 110],
  ["Egg McMuffin®", 300],
  ["Sausage Burrito", 300],
  ["Sausage McMuffin®", 370],
  ["Filet-O-Fish", 390],
  ["HASH BROWNS", 150],
  ["Artisan Grilled Chicken Sandwich", 360],
  ["Buttermilk Crispy Chicken Sandwich", 580],
  ["Spicy McChicken", 400],
  ["McFlurry with OREO Cookies", 510],
  ["Baked Apple Pie", 230],
  ["Bacon, Egg & Cheese Biscuit (Regular Size Biscuit)", 460],
  ["Sausage, Egg & Cheese McGriddles®", 550],
  ["Sausage McGriddles®", 420],
  ["Big Breakfast® (Regular Size Biscuit)", 740],
  ["Ranch Snack Wrap® (Crispy)", 360],
  ["Premium McWrap Chicken & Ranch (Crispy)", 610],
  ["Bacon Clubhouse Burger", 740],
  ["Bacon Clubhouse Grilled Chicken Sandwich", 610],
  ["Premium McWrap Chicken Sweet Chili (Grilled)", 400],
  ["Premium Southwest Salad with Grilled Chicken", 330],
  ["Premium Asian Salad with Grilled Chicken", 270],
  ["Premium Bacon Ranch Salad with Crispy Chicken", 450],
  ["Premium Southwest Salad with Buttermilk Crispy Chicken", 510],
  ["Premium Asian Salad with Buttermilk Crispy Chicken", 450],
  ["Premium Bacon Ranch Salad with Buttermilk Crispy Chicken", 490],
  ["Premium Bacon Ranch Salad with Grilled Chicken", 310]
];

for (const [pat, cal] of items) {
  console.log(pat.slice(0, 40), parseFromName(pat, cal) ?? "MISS");
}
