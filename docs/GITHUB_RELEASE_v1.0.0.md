# GitHub Release: Nutritious v1.0.0

Use the text below as the **Release title** and **Release description** when you publish a GitHub Release.

---

## Release title

`Nutritious v1.0.0`

---

## Release description (copy from here)

### v1.0 — Launch build

Nutritious is a **Manifest V3** Chrome extension that scans menu-style food names on web pages, shows **calories and macros**, compares them to your **customizable daily goals**, and suggests **better picks** from an expanded built-in nutrition database.

---

### What’s new in v1.0

- **Macro goal customization** — Presets (balanced, high protein, low carb), adjustable **meal target %** of daily goals
- **Customize tracked macros** — Show rings and scoring only for the macros you care about
- **Customize goal length** — 1–12 week programs with **Day N of M** progress on the Goals tab
- **Meal recommendations** — Explainable Better picks; CSV items included when `restaurant` matches
- **Restaurant coverage** — ~2× bundled items; Burger King, Panera, Five Guys; more Chipotle / Panda / Chick-fil-A (see `docs/RESTAURANT_COVERAGE.md`)

---

### How to install (from the attached `.zip`)

1. **Download** `nutritious-extension-1.0.0.zip` from this release.
2. **Unzip** so the folder root contains `manifest.json`.
3. Chrome → **`chrome://extensions`** → **Developer mode** → **Load unpacked** → select that folder.

---

### How to use

1. **Toolbar** — Click the Nutritious icon to open the **sidebar** on the right (overlays the page; does not resize the site).
2. **Goals** tab — Set program length, macro preset (optional), daily macros, meal %, and which macros to track → **Save goals**. Progress shows calories and other tracked macros (remaining or “over” if past goal).
3. **Menu Items** tab — Open a restaurant menu page → click the **refresh** icon in the sidebar header to scan.
4. Expand an item card for macro rings, source badges (**Built-in**, **Page table**, etc.), and **Better picks**.
5. **Add to meal** to log items; totals appear under **Your meal**.
6. **Compare** — Check **Compare** on up to 3 items; use **×** on the compare panel to close.
7. Optional: import a CSV at the bottom for custom or missing restaurants (`name,calories,protein,carbs,fat` plus optional `restaurant`, `aliases`).

---

### Build from source

```bash
npm install
npm run build
npm run package
```

Produces `releases/nutritious-extension-1.0.0.zip`.
