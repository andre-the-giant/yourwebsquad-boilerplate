import fs from "node:fs";
import path from "node:path";

const srcRoot = path.resolve("public/cms-content");
const targetLocales = ["en", "fr"];

function copyFileToLocale(filePath) {
  const relative = path.relative(srcRoot, filePath);
  // Skip files already inside a locale folder
  if (relative.startsWith("en/") || relative.startsWith("fr/")) {
    return;
  }

  const sourceContent = fs.readFileSync(filePath, "utf-8");
  for (const locale of targetLocales) {
    const destPath = path.join(srcRoot, locale, relative);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, sourceContent, "utf-8");
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      copyFileToLocale(fullPath);
    }
  }
}

walk(srcRoot);

console.log("Copied CMS JSON into en/ and fr/ locale folders.");
