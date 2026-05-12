import { defineConfig } from "vite";
import { resolve } from "node:path";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(rootDir, "src/background.ts"),
        popup: resolve(rootDir, "src/popup/popup.ts")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name][extname]"
      }
    }
  },
  plugins: [
    {
      name: "copy-manifest",
      closeBundle() {
        mkdirSync(resolve(rootDir, "dist"), { recursive: true });
        copyFileSync(
          resolve(rootDir, "manifest.json"),
          resolve(rootDir, "dist/manifest.json")
        );
        copyFileSync(
          resolve(rootDir, "src/popup/popup.css"),
          resolve(rootDir, "dist/popup.css")
        );
        copyFileSync(
          resolve(rootDir, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
          resolve(rootDir, "dist/pdf.worker.min.mjs")
        );
        writeFileSync(
          resolve(rootDir, "dist/popup.html"),
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nutritious</title>
    <link rel="stylesheet" href="./popup.css" />
  </head>
  <body>
    <main class="popup">
      <h1>Nutritious</h1>
      <p class="subtitle">Track page meals and compare against your goals.</p>
      <div class="tabs">
        <button id="tab-goals" class="tab-btn" type="button">Goals</button>
        <button id="tab-items" class="tab-btn active" type="button">Menu Items</button>
      </div>
      <section id="items-view">
        <div id="items-list" class="items-list"></div>
        <button id="refresh-items" type="button" class="secondary-btn">Refresh current page</button>
        <label class="csv-row">Custom nutrition CSV (optional)
          <input id="csv-import" type="file" accept=".csv,text/csv" />
        </label>
        <p class="csv-hint">Columns: <code>name,calories,protein,carbs,fat</code> plus optional <code>restaurant</code>, <code>aliases</code> (pipe-separated).</p>
      </section>
      <section id="goals-view" class="hidden">
        <form id="goals-form">
          <label>Calories<input id="calories" name="calories" type="number" min="1" required /></label>
          <label>Protein (g)<input id="protein" name="protein" type="number" min="1" required /></label>
          <label>Carbs (g)<input id="carbs" name="carbs" type="number" min="1" required /></label>
          <label>Fat (g)<input id="fat" name="fat" type="number" min="1" required /></label>
          <button type="submit">Save goals</button>
        </form>
      </section>
      <p id="status" class="status"></p>
    </main>
    <script type="module" src="./popup.js"></script>
  </body>
</html>
`
        );
      }
    }
  ]
});
