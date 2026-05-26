/**
 * Best-effort chain detection from page URL and document title.
 * Used to bias nutrition matching and better picks toward the current site.
 */

const HOST_RULES: Array<{ pattern: RegExp; restaurant: string }> = [
  { pattern: /(^|\.)mcdonalds\.com$/i, restaurant: "McDonald's" },
  { pattern: /(^|\.)tacobell\.com$/i, restaurant: "Taco Bell" },
  { pattern: /(^|\.)subway\.com$/i, restaurant: "Subway" },
  { pattern: /(^|\.)wendys\.com$/i, restaurant: "Wendy's" },
  { pattern: /(^|\.)starbucks\.com$/i, restaurant: "Starbucks" },
  { pattern: /(^|\.)burgerking\.com$/i, restaurant: "Burger King" },
  { pattern: /(^|\.)bk\.com$/i, restaurant: "Burger King" },
  { pattern: /(^|\.)chipotle\.com$/i, restaurant: "Chipotle" },
  { pattern: /(^|\.)dominos\.com$/i, restaurant: "Domino's" },
  { pattern: /(^|\.)fiveguys\.com$/i, restaurant: "Five Guys" },
  { pattern: /(^|\.)panerabread\.com$/i, restaurant: "Panera" },
  { pattern: /(^|\.)pandaexpress\.com$/i, restaurant: "Panda Express" },
  { pattern: /(^|\.)chick-fil-a\.com$/i, restaurant: "Chick-fil-A" },
  { pattern: /(^|\.)cfa\.com$/i, restaurant: "Chick-fil-A" },
  { pattern: /(^|\.)dave\.com$/i, restaurant: "Dave's Hot Chicken" },
  { pattern: /daves.*hot.*chicken/i, restaurant: "Dave's Hot Chicken" }
];

const TITLE_RULES: Array<{ pattern: RegExp; restaurant: string }> = [
  { pattern: /mcdonald/i, restaurant: "McDonald's" },
  { pattern: /taco\s*bell/i, restaurant: "Taco Bell" },
  { pattern: /\bsubway\b/i, restaurant: "Subway" },
  { pattern: /wendy/i, restaurant: "Wendy's" },
  { pattern: /starbucks/i, restaurant: "Starbucks" },
  { pattern: /burger\s*king|\bbk\b/i, restaurant: "Burger King" },
  { pattern: /chipotle/i, restaurant: "Chipotle" },
  { pattern: /domino/i, restaurant: "Domino's" },
  { pattern: /five\s*guys/i, restaurant: "Five Guys" },
  { pattern: /panera/i, restaurant: "Panera" },
  { pattern: /panda\s*express/i, restaurant: "Panda Express" },
  { pattern: /chick[\s-]*fil[\s-]*a/i, restaurant: "Chick-fil-A" },
  { pattern: /dave[\s']*s?\s*hot\s*chicken/i, restaurant: "Dave's Hot Chicken" }
];

function hostnameFromUrl(pageUrl: string): string {
  try {
    return new URL(pageUrl).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export function detectRestaurantFromPage(pageUrl: string, pageTitle?: string): string | null {
  const host = hostnameFromUrl(pageUrl);
  if (host) {
    for (const rule of HOST_RULES) {
      if (rule.pattern.test(host)) {
        return rule.restaurant;
      }
    }
  }
  const title = (pageTitle ?? "").trim();
  if (title) {
    for (const rule of TITLE_RULES) {
      if (rule.pattern.test(title)) {
        return rule.restaurant;
      }
    }
  }
  return null;
}
