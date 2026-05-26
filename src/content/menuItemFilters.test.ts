import { describe, expect, it } from "vitest";
import {
  hasFoodWordHint,
  isJunkMenuLabel,
  shouldExcludeScrapedLabel
} from "./menuItemFilters";

describe("menuItemFilters consent / chrome", () => {
  it("excludes cookie consent UI", () => {
    expect(isJunkMenuLabel("Cookie & Ad Settings")).toBe(true);
    expect(
      isJunkMenuLabel("Cookie & Ad Settings, Opens the preference center dialog")
    ).toBe(true);
    expect(hasFoodWordHint("cookie and ad settings")).toBe(false);
  });

  it("still allows real cookies", () => {
    expect(hasFoodWordHint("chocolate chip cookie")).toBe(true);
    expect(isJunkMenuLabel("Chocolate Chip Cookie")).toBe(false);
  });

  it("excludes bare Estimated label", () => {
    expect(isJunkMenuLabel("Estimated")).toBe(true);
    expect(shouldExcludeScrapedLabel("Estimated", "estimated", new Set())).toBe(true);
  });
});
