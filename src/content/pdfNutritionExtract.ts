import * as pdfjsLib from "pdfjs-dist";
import { normalizeFoodName } from "../core/nutritionDatabase";
import type { PageNutritionHint } from "../core/nutritionResolver";

let workerConfigured = false;

export function ensurePdfWorker(): void {
  if (workerConfigured || typeof chrome === "undefined" || !chrome.runtime?.getURL) {
    return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf.worker.min.mjs");
  workerConfigured = true;
}

function collectPdfUrls(doc: Document): string[] {
  const urls = new Set<string>();
  for (const a of Array.from(doc.querySelectorAll('a[href$=".pdf"], a[href*=".pdf?"]'))) {
    const href = (a as HTMLAnchorElement).href;
    if (href.startsWith("http://") || href.startsWith("https://")) {
      urls.add(href.split("#")[0]);
    }
  }
  for (const embed of Array.from(doc.querySelectorAll('embed[type="application/pdf"]'))) {
    const src = embed.getAttribute("src");
    if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
      urls.add(src.split("#")[0]);
    }
  }
  for (const iframe of Array.from(doc.querySelectorAll("iframe"))) {
    const src = iframe.getAttribute("src") ?? "";
    if (src.includes(".pdf") && (src.startsWith("http://") || src.startsWith("https://"))) {
      urls.add(src.split("#")[0]);
    }
  }
  return [...urls];
}

async function fetchPdfBytes(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url, { credentials: "omit", mode: "cors" });
    if (!res.ok) {
      return null;
    }
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

/**
 * Lines that look like: "Crunchwrap Supreme    530 16 71 21" or comma-separated.
 */
function parseNutritionLines(text: string): PageNutritionHint[] {
  const lines = text.split(/\r?\n/);
  const hints: PageNutritionHint[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 8 || trimmed.length > 220) {
      continue;
    }

    const parts = trimmed.split(/[\t|,|]+/).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 5) {
      const maybeNums = parts.slice(-4).map((p) => Number.parseFloat(p.replace(/[^0-9.-]/g, "")));
      if (maybeNums.every((n) => Number.isFinite(n))) {
        const namePart = parts.slice(0, -4).join(" ");
        if (namePart.length < 2) {
          continue;
        }
        const [calories, protein, carbs, fat] = maybeNums;
        if (calories > 0 || protein > 0 || carbs > 0 || fat > 0) {
          hints.push({
            key: normalizeFoodName(namePart),
            calories,
            protein,
            carbs,
            fat
          });
        }
      }
    }

    const tailNums = [...trimmed.matchAll(/\b(\d{2,4})\b/g)].map((m) => Number.parseFloat(m[1]));
    if (tailNums.length >= 4) {
      const lastFour = tailNums.slice(-4);
      const [calories, protein, carbs, fat] = lastFour;
      const nameGuess = trimmed.slice(0, trimmed.lastIndexOf(String(lastFour[0]))).trim();
      if (nameGuess.length >= 3 && calories >= 50 && calories < 6000) {
        hints.push({
          key: normalizeFoodName(nameGuess),
          calories,
          protein,
          carbs,
          fat
        });
      }
    }
  }

  const dedup = new Map<string, PageNutritionHint>();
  for (const h of hints) {
    if (!dedup.has(h.key)) {
      dedup.set(h.key, h);
    }
  }
  return [...dedup.values()];
}

async function extractHintsFromPdfBytes(data: Uint8Array): Promise<PageNutritionHint[]> {
  ensurePdfWorker();
  const loadingTask = pdfjsLib.getDocument({ data, verbosity: 0 });
  const pdf = await loadingTask.promise;
  let fullText = "";
  const maxPages = Math.min(pdf.numPages, 40);

  for (let p = 1; p <= maxPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? String((item as { str?: string }).str ?? "") : ""))
      .join(" ");
    fullText += `\n${pageText}`;
  }

  return parseNutritionLines(fullText);
}

/** Attempt PDF URLs found on the page; skips failures (CORS, worker issues). */
export async function extractPdfNutritionHints(doc: Document): Promise<PageNutritionHint[]> {
  const urls = collectPdfUrls(doc);
  const merged = new Map<string, PageNutritionHint>();

  for (const url of urls.slice(0, 3)) {
    const bytes = await fetchPdfBytes(url);
    if (!bytes) {
      continue;
    }
    try {
      const hints = await extractHintsFromPdfBytes(bytes);
      for (const h of hints) {
        if (!merged.has(h.key)) {
          merged.set(h.key, h);
        }
      }
    } catch {
      // Worker/CORS/font parsing — ignore and continue.
    }
  }

  return [...merged.values()];
}
