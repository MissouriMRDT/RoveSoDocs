import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import MiniSearch from "minisearch";
import * as cheerio from "cheerio";

const DIST_DIR = path.resolve("dist");
const OUT_DIR = path.join(DIST_DIR, "minisearch");
const OUT_FILE = path.join(OUT_DIR, "index.json");

// Tune these to reduce garbage from nav/sidebars (add more as you see fit)
const STRIP_SELECTORS = [
  // VitePress chrome
  ".VPNav", ".VPSidebar", ".VPLocalNav",

  // Doxygen chrome (common)
  "#top", "#titlearea", "#side-nav", "#nav-tree", ".navpath",
  "#MSearchSelectWindow", "#MSearchResultsWindow"
];

function fileToUrl(relPath) {
  // Convert dist-relative file path -> clean URL
  // e.g. "autonomy/index.html" => "/autonomy/"
  //      "RoveSoSimulator/_d/classFoo.html" => "/RoveSoSimulator/_d/classFoo.html"
  let url = "/" + relPath.replaceAll(path.sep, "/");
  if (url.endsWith("/index.html")) url = url.slice(0, -"/index.html".length) + "/";
  return url;
}

function normalizeText(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

function sectionFromUrl(url) {
  if (url.startsWith("/autonomy/")) return "Autonomy (Doxygen)";
  if (url.startsWith("/RoveSoSimulator/_d/")) return "RoveSoSimulator (Doxygen)";
  if (url.startsWith("/RoveSoSimulator/_j/")) return "RoveSoSimulator (Jekyll)";
  return "Docs Hub";
}

async function main() {
  const htmlFiles = await fg(["**/*.html"], {
    cwd: DIST_DIR,
    dot: true,
    onlyFiles: true,
    ignore: [
      // don’t index your index bundle or random generated search pages
      "minisearch/**",
      "**/search*.html",
      "**/search/**",

      // Doxygen can have a bunch of noisy helper pages; optional but helpful:
      "**/navtree*.html",
      "**/menudata*.html",
      "**/dynsections*.html"
    ]
  });

  const documents = [];
  for (const rel of htmlFiles) {
    const abs = path.join(DIST_DIR, rel);
    const html = await fs.readFile(abs, "utf8");
    const $ = cheerio.load(html);

    // Remove noise
    for (const sel of STRIP_SELECTORS) $(sel).remove();
    $("script, style, noscript").remove();

    const title = normalizeText($("title").first().text()) || normalizeText($("h1").first().text()) || rel;
    const bodyText = normalizeText($("body").text());
    if (!bodyText) continue;

    const url = fileToUrl(rel);
    const section = sectionFromUrl(url);

    // Keep snippets short-ish to keep the serialized index smaller
    const snippet = bodyText.slice(0, 220);

    documents.push({
      id: url,          // unique
      title,
      content: bodyText,
      url,
      section,
      snippet
    });
  }

  // Build MiniSearch index
  const miniSearch = new MiniSearch({
    idField: "id",
    fields: ["title", "content", "section"],
    storeFields: ["title", "url", "section", "snippet"],
  });

  miniSearch.addAll(documents);

  await fs.mkdir(OUT_DIR, { recursive: true });

  // IMPORTANT: docs say serialize with JSON.stringify(miniSearch),
  // and later load with MiniSearch.loadJSON(jsonString, sameOptions). :contentReference[oaicite:3]{index=3}
  await fs.writeFile(OUT_FILE, JSON.stringify(miniSearch), "utf8");

  console.log(`Indexed ${documents.length} pages -> ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
