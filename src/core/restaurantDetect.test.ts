import { describe, expect, it } from "vitest";
import { detectRestaurantFromPage } from "./restaurantDetect";

describe("restaurantDetect", () => {
  it("detects McDonald's from hostname", () => {
    expect(detectRestaurantFromPage("https://www.mcdonalds.com/us/en-us/full-menu.html")).toBe(
      "McDonald's"
    );
  });

  it("detects Chipotle from title when host is generic", () => {
    expect(detectRestaurantFromPage("https://order.example.com/menu", "Chipotle Menu")).toBe(
      "Chipotle"
    );
  });

  it("returns null for unknown sites", () => {
    expect(detectRestaurantFromPage("https://example.com/menu", "Lunch")).toBeNull();
  });
});
