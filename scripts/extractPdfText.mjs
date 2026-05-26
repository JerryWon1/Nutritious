/**
 * Dump PDF text for inspection / building nutrition rows.
 *
 * Usage:
 *   node scripts/extractPdfText.mjs <pdf-path> [maxPages]
 *   node scripts/extractPdfText.mjs Documents          # all *.pdf in folder
 *   node scripts/extractPdfText.mjs Documents 50     # max 50 pages per PDF
 */
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const inputArg = process.argv[2];
const maxPages = Math.max(1, Number.parseInt(process.argv[3] ?? "500", 10) || 500);

async function extractOne(pdfPath, outDir) {
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
  const outPath = join(outDir, `${base}.txt`);
  await writeFile(outPath, out.join("\n"), "utf8");
  return { outPath, pages: n, total: pdf.numPages };
}

async function resolvePdfPaths(input) {
  const resolved = resolve(input);
  const st = await stat(resolved);
  if (st.isFile()) {
    return [resolved];
  }
  if (!st.isDirectory()) {
    throw new Error(`Not a file or directory: ${input}`);
  }
  const names = await readdir(resolved);
  return names
    .filter((n) => n.toLowerCase().endsWith(".pdf"))
    .sort()
    .map((n) => join(resolved, n));
}

async function main() {
  if (!inputArg) {
    console.error("Usage: node scripts/extractPdfText.mjs <pdf-or-folder> [maxPages]");
    console.error("Example: node scripts/extractPdfText.mjs Documents");
    process.exit(1);
  }

  const pdfPaths = await resolvePdfPaths(inputArg);
  if (pdfPaths.length === 0) {
    console.error(`No PDF files found in ${inputArg}`);
    process.exit(1);
  }

  const outDir = join(root, "Documents", "extracted");
  await mkdir(outDir, { recursive: true });

  let failed = 0;
  for (const pdfPath of pdfPaths) {
    try {
      const { outPath, pages, total } = await extractOne(pdfPath, outDir);
      console.log(`OK  ${basename(pdfPath)} → ${outPath} (${pages}/${total} pages)`);
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`FAIL ${basename(pdfPath)}: ${msg}`);
    }
  }

  console.log(`\nDone: ${pdfPaths.length - failed}/${pdfPaths.length} → ${outDir}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

void main();
