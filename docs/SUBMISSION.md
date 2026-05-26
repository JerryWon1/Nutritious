# Assignment submission — Nutritious Chrome extension

Use this checklist when attaching links and files to your course submission.

---

## 1. GitHub repository

**Link to submit:**

**https://github.com/JerryWon1/Nutritious**

Clone URL (if the form asks): `https://github.com/JerryWon1/Nutritious.git`

Ensure your latest code is pushed:

```bash
git add -A
git commit -m "Prepare submission: sidebar UI, tests, release docs"
git push origin main
```

---

## 2. GitHub Release + release notes

Create a release on GitHub so reviewers can read install/use instructions and download the zip.

1. Open **https://github.com/JerryWon1/Nutritious/releases** → **Draft a new release**
2. **Tag:** `v1.0.0` (or `v0.1.0-alpha` if your rubric requires the 0.1 label — see zip section below)
3. **Title:** `Nutritious v1.0.0`
4. **Description:** Copy the body from **`docs/GITHUB_RELEASE_v1.0.0.md`** (install steps, how to use the sidebar, permissions)
5. **Attach assets:** Upload the zip from **`releases/`** (see section 4)
6. Publish the release

**Release notes source files:**

| Version | Copy from |
|---------|-----------|
| Launch / v1.0 | `docs/GITHUB_RELEASE_v1.0.0.md` |
| Alpha 0.1 | `docs/GITHUB_RELEASE_v0.1.0.md` |

---

## 3. Chrome Web Store link

The extension is **not** on the Chrome Web Store unless you publish it yourself.

**If the assignment requires a live store listing:**

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time developer registration fee (if you have not already)
3. Run `npm run package` and upload **`releases/nutritious-extension-1.0.0.zip`** (or zip `dist/` with manifest at root)
4. Complete listing (description, screenshots, privacy — no remote data collection beyond `chrome.storage`)
5. Submit for review; after approval, paste the public extension URL in your assignment

**If publishing is optional for your course:** State in your submission:

> Chrome Web Store: Not published. Install from GitHub Release zip or Load unpacked (`dist/`). Repository: https://github.com/JerryWon1/Nutritious

Confirm with your instructor whether a store link is mandatory.

---

## 4. Downloadable `.zip` (local install in Chrome)

Rebuild and verify **before** submitting:

```bash
npm install
npm run build
npm test
npm run validate-db
npm run package
```

| File | When to use |
|------|-------------|
| **`releases/nutritious-extension-1.0.0.zip`** | Current validated launch build (manifest `1.0.0`) — **recommended** |
| **`releases/nutritious-extension-0.1.0-alpha.zip`** | Alpha 0.1 filename; run `npm run package:alpha` to refresh from current `dist/` |

**Install for grader:**

1. Unzip so **`manifest.json`** is at the **root** of the folder (not inside an extra parent folder)
2. Chrome → **`chrome://extensions`** → **Developer mode** → **Load unpacked** → select that folder

**Quick smoke test after install:**

1. Click the Nutritious toolbar icon → sidebar opens on the right (overlays the page)
2. Open a menu site (e.g. Taco Bell, McDonald’s) → **Menu Items** → refresh icon
3. **Goals** tab → set macros → **Save goals**

---

## 5. Test cases and results

**Document to attach or link:**

**`docs/TEST_CASES_AND_RESULTS.md`**

Reproduce automated tests:

```bash
npm test
```

Expected: **47/47 tests passed** (12 test files). See the doc for manual Chrome checklist (M-01–M-12).

Optional: export test output:

```bash
npm test > test-results.txt 2>&1
```

Attach `test-results.txt` with your submission if required.

---

## 6. Suggested text for the assignment form

Copy and adapt:

| Field | Suggested value |
|-------|-----------------|
| **GitHub repo** | https://github.com/JerryWon1/Nutritious |
| **Release notes** | https://github.com/JerryWon1/Nutritious/releases/tag/v1.0.0 |
| **Chrome Web Store** | *(your store URL after publish, or “Not published — see GitHub Release”)* |
| **Zip** | Attach `nutritious-extension-1.0.0.zip` (or `0.1.0-alpha.zip` per rubric) |
| **Tests** | Attach `docs/TEST_CASES_AND_RESULTS.md` (+ `test-results.txt` optional) |

---

## 7. What changed in the current build (for your write-up)

- **Sidebar UI** (toolbar icon toggles in-page panel; does not shrink the host site)
- **Menu scan** tied to the correct browser tab
- **Goals progress** for all tracked macros (remaining / over)
- **Compare** panel with close (×) control
- **Meal log** without “Compare meal” button
- **47** automated unit tests + manual integration checklist
