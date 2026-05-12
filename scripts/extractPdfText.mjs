/**
 * One-off: dump PDF text for inspection / building nutrition rows.
 * Usage: node scripts/extractPdfText.mjs <pdf-path> [maxPages]
 */
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const pdfPath = process.argv[2];
const maxPages = Math.max(1, Number.parseInt(process.argv[3] ?? "500", 10) || 500);

if (!pdfPath) {
  console.error("Usage: node scripts/extractPdfText.mjs <pdf> [maxPages]");
  process.exit(1);
}

const data = new Uint8Array(await readFile(pdfPath));
const loadingTask = getDocument({
  data,
  useSystemFonts: true,
  disableFontFace: true,
  isEvalSupported: false
});
const pdf = await loadingTask.promise;
const out = [];
const n = Math.min(pdf.numPages, maxPages);
for (let i = 1; i <= n; i++) {
  const page = await pdf.getPage(i);
  const tc = await page.getTextContent();
  const line = tc.items.map((it) => ("str" in it ? it.str : "")).join(" ");
  out.push(`\n--- page ${i} ---\n${line}`);
}
const base = basename(pdfPath, ".pdf").replace(/[^a-z0-9_-]+/gi, "_");
await writeFile(`/tmp/nutritious_${base}.txt`, out.join("\n"), "utf8");
console.log(`Wrote /tmp/nutritious_${base}.txt pages=${n}/${pdf.numPages}`);
