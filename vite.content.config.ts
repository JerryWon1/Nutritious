import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Separate bundle for the MV3 content script: one IIFE file with no `import` statements
 * so Chrome injects it as a classic script (manifest + `scripting.executeScript({ files })`).
 */
const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(rootDir, "src/content/contentScript.ts"),
      output: {
        entryFileNames: "contentScript.js",
        format: "iife",
        name: "NutritiousContent",
        inlineDynamicImports: true
      }
    }
  }
});
