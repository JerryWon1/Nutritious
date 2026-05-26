import { defineConfig } from "vite";
import { resolve } from "node:path";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
        const panelHtml = readFileSync(resolve(rootDir, "src/popup/popup.html"), "utf8")
          .replace("./popup.ts", "./popup.js")
          .replace("<title>Nutritious</title>", "<title>Nutritious</title>");
        writeFileSync(resolve(rootDir, "dist/popup.html"), panelHtml);
        writeFileSync(resolve(rootDir, "dist/sidebar.html"), panelHtml);
      }
    }
  ]
});
