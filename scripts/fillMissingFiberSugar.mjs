import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("src/core/pdfSourcedItems.ts", "utf8");
const start = src.indexOf("export const PDF_SOURCED");
const a0 = src.indexOf("[", start);
const a1 = src.indexOf("];", a0) + 2;
let arr = src.slice(a0, a1);

function patchBlock(block, fiber, sugar) {
  const macro = `fiber: ${fiber}, sugar: ${sugar}, `;
  if (/fiber:\s*\d+/.test(block)) {
    if (/sugar:\s*\d+/.test(block)) return block;
    return block.replace(/(fiber:\s*\d+,?\s*)/, `$1sugar: ${sugar}, `);
  }
  if (block.includes("nutritionSource:")) {
    return block.replace("nutritionSource:", `${macro}nutritionSource:`);
  }
  return block.replace(/(fat:\s*\d+,)/, `$1 ${macro}`);
}

let n = 0;
const idRe = /id:\s*"([^"]+)"/g;
let m;
const blocks = [];
while ((m = idRe.exec(arr))) {
  const id = m[1];
  const i = m.index;
  const brace = arr.indexOf("{", i);
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
  let block = arr.slice(i, end + 1);
  if (!/fiber:\s*\d+/.test(block) || !/sugar:\s*\d+/.test(block)) {
    const fiber = /fiber:\s*(\d+)/.exec(block)?.[1] ?? 0;
    const sugar = /sugar:\s*(\d+)/.exec(block)?.[1] ?? 0;
    const next = patchBlock(block, fiber, sugar);
    if (next !== block) {
      arr = arr.slice(0, i) + next + arr.slice(end + 1);
      idRe.lastIndex = i + next.length;
      n++;
    }
  }
}
writeFileSync("src/core/pdfSourcedItems.ts", src.slice(0, a0) + arr + src.slice(a1));
console.log("Ensured fiber+sugar on", n, "pdf rows");
