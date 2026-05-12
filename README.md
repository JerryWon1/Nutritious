# Nutritious — Chrome Extension (Alpha 0.1)

Nutritious is a **Manifest V3** Chrome extension that helps you compare quick-service and menu-page items to your **daily macro goals**. It scans visible text for food-like labels, resolves nutrition from a **bundled database** (including **PDF-sourced** entries for major chains), optional **page tables / inline calories**, optional **custom CSV**, and shows **goal rings** and **better picks** in the popup.

**Version:** `0.1.0` (alpha, not Chrome Web Store–listed).

---

## How to install (from source / developers)

1. **Clone** the repository (or your fork):

```bash
git clone https://github.com/JerryWon1/Nutritious.git
cd Nutritious
```

2. Install dependencies and build:

```bash
npm install
npm run build
```

3. Chrome → **`chrome://extensions`** → enable **Developer mode** → **Load unpacked** → select the **`dist/`** folder in this project.

---

## How to install (from Alpha release `.zip`)

1. Download **`nutritious-extension-0.1.0-alpha.zip`** (from your GitHub Release or after running `npm run package`).
2. **Unzip** it. Use the folder whose **root** contains **`manifest.json`** (not a parent folder).
3. Chrome → **`chrome://extensions`** → **Developer mode** → **Load unpacked** → choose that folder.

---

## How to use the extension

1. **Toolbar** — Click the **Nutritious** icon to open the popup.

2. **Goals tab** — Enter daily **calories**, **protein (g)**, **carbs (g)**, **fat (g)** → **Save goals**. Values sync with `chrome.storage.sync`.

3. **Menu Items tab** — Open a restaurant or menu webpage (or a local **`demo-page.html`** via `file://` after the extension is loaded). Click **Refresh current page** to scan.

4. **Each row** — Expand the card (chevron) to see:
   - **Restaurant** and **macros** with **rings** (a full ring = 100% of your saved goal for that macro).
   - **Source** badges: e.g. **Built-in** (database), **Page table** (scraped from the page), **Estimated** (heuristic / nearest match).
   - **Better picks** — suggested alternatives from the same chain when possible.

5. **Optional CSV** (bottom of Menu Items) — **Choose File** to import nutrition rows.  
   **Required columns:** `name,calories,protein,carbs,fat`  
   **Optional:** `restaurant`, `aliases` (pipe `|` separated). CSV matches take priority over the built-in database.

6. **Overlays** — On some pages, small cards may appear near recognized items (depends on site DOM).

---

## Package the Alpha zip (for GitHub / submission)

```bash
npm install
npm run package
```

Creates **`releases/nutritious-extension-0.1.0-alpha.zip`** containing the same files as `dist/` (load that folder’s contents after unzip).

Requires the **`zip`** CLI (macOS/Linux). On Windows, build with `npm run build` then zip the `dist` folder manually to the same layout (manifest at zip root).

---

## Local demo page

1. Build and load **`dist/`** as above.  
2. Open **`demo-page.html`** in Chrome (`file://` is allowed by the manifest).  
3. Open the popup → **Menu Items** → **Refresh current page** and confirm items resolve.

---

## Tech stack

- Manifest V3, TypeScript, Vite  
- `pdfjs-dist` (legacy worker) for optional PDF text hints on pages  
- No backend; optional CSV stays local

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build → `dist/` |
| `npm run typecheck` | TypeScript only |
| `npm run package` | `build` + zip → `releases/nutritious-extension-0.1.0-alpha.zip` |
| `npm run extract-pdf` | Helper to extract text from a PDF (see `scripts/extractPdfText.mjs`) |

---

## License / course use

Add your course-required license or attribution here if applicable.
