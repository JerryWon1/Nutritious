# GitHub Release: Nutritious v0.1.0 (Alpha)

Use the text below as the **Release title** and **Release description** when you publish [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

---

## Release title

`Nutritious v0.1.0-alpha`

---

## Release description (copy from here)

### Alpha 0.1 — Nutritious Chrome Extension

Nutritious is a **Manifest V3** Chrome extension that detects menu-style food names on web pages, shows **calories and macros**, compares them to your **daily goals**, and suggests **better picks** from a built-in nutrition database (including many **PDF-sourced** chain items).

This is an **alpha** build for local installation and class submission. It is not published on the Chrome Web Store.

---

### How to install (from the attached `.zip`)

1. **Download** `nutritious-extension-0.1.0-alpha.zip` from this release (or use the zip produced by `npm run package` in the repository).
2. **Unzip** the file. You should see a folder whose **root** contains `manifest.json`, `popup.html`, `background.js`, `contentScript.js`, etc.  
   - If your unzip tool created a nested folder, use the **inner** folder that directly contains `manifest.json`.
3. Open Chrome and go to **`chrome://extensions`**.
4. Turn **Developer mode** on (top right).
5. Click **Load unpacked**.
6. Select the unzipped folder (the one that contains `manifest.json`).

The Nutritious icon should appear in the toolbar. If the popup does not open on first click, reload the extension on `chrome://extensions` and try again.

---

### How to use

1. **Open the popup**  
   Click the Nutritious toolbar icon.

2. **Set your daily goals**  
   - Open the **Goals** tab.  
   - Enter **calories**, **protein (g)**, **carbs (g)**, and **fat (g)**.  
   - Click **Save goals**. Goals are stored in **Chrome sync** (`chrome.storage.sync`).

3. **Scan a page**  
   - Go to a restaurant or menu site (or open `demo-page.html` from the repo via `file://` after loading the extension).  
   - Open the **Menu Items** tab and use **Refresh current page** to re-scan.

4. **Read each item**  
   - Items appear as collapsible cards. Expand a row to see **restaurant**, **macros**, **goal rings** (full ring = 100% of that goal), source badges (**Built-in**, **Page table**, **Estimated**, etc.), and **Better picks**.

5. **Optional: custom CSV**  
   At the bottom of the Menu Items tab you can **Choose File** to import a CSV.  
   **Columns:** `name,calories,protein,carbs,fat`  
   **Optional:** `restaurant`, `aliases` (pipe-separated).  
   Imported rows override the built-in database for matching names.

6. **On-page overlay**  
   On supported pages, the content script can attach small nutrition cards near recognized text (behavior depends on the site’s DOM).

---

### Permissions (why they exist)

| Permission        | Purpose |
|------------------|---------|
| `storage`        | Save macro goals and optional user CSV data. |
| `tabs`           | Read the active tab so the popup can request a scan from the content script. |
| `scripting`      | Inject the content script on demand if it was not already loaded. |
| `<all_urls>`     | Run on HTTPS/HTTP menu sites. |
| `file://*/*`     | Allow local demos (e.g. `demo-page.html`). |

---

### Repository

- **Browse:** [https://github.com/JerryWon1/Nutritious](https://github.com/JerryWon1/Nutritious)  
- **Clone:** `git clone https://github.com/JerryWon1/Nutritious.git`

Local rebuild of the zip:

```bash
npm install
npm run package
```

Output: `releases/nutritious-extension-0.1.0-alpha.zip`

---

### Known limitations (alpha)

- Menu detection is **heuristic**; some sites show category labels or noisy text.
- Nutrition for unknown strings may be **estimated** or scaled from the closest database row.
- Official PDFs are referenced in data where transcribed; not every SKU is in the database.

---

### Version

- **Manifest / package version:** `0.1.0`  
- **Release label:** `v0.1.0-alpha`
