/**
 * Pull a short menu-item label from noisy card copy (price, calories, CTAs).
 * Tuned for patterns like: "Soft Taco $1.99 | 180 Cal" and multi-line cards.
 */
export function extractMenuItemLabel(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }

  const firstLine = cleaned.split(/\n/)[0]?.trim() ?? cleaned;

  // "Name | 180 Cal" (common on Taco Bell cards)
  const pipeCal = firstLine.match(/^(.+?)\s*\|\s*(\d{2,4})\s*[Cc]al\b/i);
  if (pipeCal?.[1]) {
    const name = pipeCal[1].trim();
    if (name.length >= 3) {
      return stripTrailingNoise(name);
    }
  }

  // "Name $price" or "Name | $price"
  const beforePrice = firstLine.split(/\$/)[0]?.trim();
  if (beforePrice && beforePrice.length >= 3 && beforePrice.length < 120) {
    const pipe = beforePrice.split("|")[0]?.trim();
    if (pipe && pipe.length >= 3) {
      return stripTrailingNoise(pipe);
    }
    return stripTrailingNoise(beforePrice);
  }

  // "Name 180 Cal" or "Name | 180 Cal"
  const calMatch = firstLine.match(/^(.+?)\s+(\d{2,4})\s*[Cc]al\b/);
  if (calMatch?.[1]) {
    const name = calMatch[1].split("|")[0]?.trim() ?? calMatch[1].trim();
    if (name.length >= 3) {
      return stripTrailingNoise(name);
    }
  }

  const short = firstLine.length <= 100 ? firstLine : firstLine.slice(0, 100).trim();
  return short.length >= 3 ? stripTrailingNoise(short) : null;
}

/** Collapse repeated calorie snippets (e.g. McDonald's PDP: "310 Cal. 310 Cal."). */
export function collapseDuplicateCaloriesInTitle(title: string): string {
  const seen = new Set<string>();
  return title
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b(\d{2,4})\s*Cal\.?\b/gi, (full, num: string) => {
      const key = num.toLowerCase();
      if (seen.has(key)) {
        return "";
      }
      seen.add(key);
      return full;
    })
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,])/g, "$1")
    .trim();
}

function stripTrailingNoise(value: string): string {
  return value
    .replace(/\s*(ADD TO ORDER|CUSTOMIZE|VIEW NUTRITION|NUTRITION).*$/i, "")
    .replace(/\s*\|\s*$/g, "")
    .replace(/\s+\$\s*\d+(?:\.\d{1,2})?\s*$/g, "")
    .replace(/^\s*\$\s*\d+(?:\.\d{1,2})?\s+/g, "")
    .trim();
}
