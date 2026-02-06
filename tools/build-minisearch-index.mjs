// tools/build-minisearch-index.mjs
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import MiniSearch from "minisearch";
import * as cheerio from "cheerio";

const DIST_DIR = path.resolve("dist");
const ASSETS_DIR = path.join(DIST_DIR, "assets");
const CHUNKS_DIR = path.join(ASSETS_DIR, "chunks");

// Tune these to reduce garbage from nav/sidebars (add more as you see fit)
const STRIP_SELECTORS = [
  // VitePress chrome
  ".VPNav",
  ".VPSidebar",
  ".VPLocalNav",

  // Doxygen chrome (common)
  "#top",
  "#titlearea",
  "#side-nav",
  "#nav-tree",
  ".navpath",
  "#MSearchSelectWindow",
  "#MSearchResultsWindow",
];

function fileToUrl(relPath) {
  // Convert dist-relative file path -> clean URL
  // e.g. "autonomy/index.html" => "/autonomy/"
  let url = "/" + relPath.replaceAll(path.sep, "/");
  if (url.endsWith("/index.html")) url = url.slice(0, -"/index.html".length) + "/";
  return url;
}

function normalizeText(s) {
  return s.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

function sectionFromUrl(url) {
  if (url.startsWith("/autonomy/")) return "Autonomy (Doxygen)";
  if (url.startsWith("/RoveSoSimulator/_d/")) return "RoveSoSimulator (Doxygen)";
  if (url.startsWith("/RoveSoSimulator/_j/")) return "RoveSoSimulator (Jekyll)";
  return "Docs Hub";
}

async function dirExists(p) {
  try {
    const st = await fs.stat(p);
    return st.isDirectory();
  } catch {
    return false;
  }
}

async function findLocalSearchIndexChunkFiles() {
  // Your observed example: @localSearchIndexroot.MJNdQY7M.js
  // We search in preferred order:
  //   1) dist/assets/chunks (if it exists)
  //   2) dist/assets
  //   3) dist (last resort)
  const roots = [];
  if (await dirExists(CHUNKS_DIR)) roots.push(CHUNKS_DIR);
  if (await dirExists(ASSETS_DIR)) roots.push(ASSETS_DIR);
  roots.push(DIST_DIR);

  const patterns = [
    // exact-ish matches for what you showed
    "**/*@localSearchIndexroot*.js",
    "**/*@localSearchIndexroot*.mjs",
    "**/*_@localSearchIndexroot*.js",
    "**/*_@localSearchIndexroot*.mjs",

    // fallback if naming changes slightly
    "**/*@localSearchIndex*.js",
    "**/*@localSearchIndex*.mjs",
    "**/*_@localSearchIndex*.js",
    "**/*_@localSearchIndex*.mjs",
  ];

  for (const root of roots) {
    const matches = await fg(patterns, {
      cwd: root,
      onlyFiles: true,
      dot: true,
      absolute: true,
      caseSensitiveMatch: false,
      unique: true,
    });

    if (matches.length) {
      // Prefer the "...Indexroot..." file(s) if both sets matched
      const preferred = matches.filter((p) =>
        /localSearchIndexroot/i.test(path.basename(p))
      );
      return preferred.length ? preferred : matches;
    }
  }

  // Debug dump: show some JS we *do* have in dist/assets (if any)
  const jsInAssets = (await dirExists(ASSETS_DIR))
    ? await fg(["**/*.js", "**/*.mjs"], {
        cwd: ASSETS_DIR,
        onlyFiles: true,
        dot: true,
        caseSensitiveMatch: false,
      })
    : [];

  const preview = jsInAssets.slice(0, 60).map((f) => ` - ${f}`).join("\n");

  throw new Error(
    `No local search chunk found.\n` +
      `Searched roots:\n${roots.map((r) => ` - ${r}`).join("\n")}\n` +
      `Tried patterns:\n${patterns.map((p) => ` - ${p}`).join("\n")}\n\n` +
      `First ${Math.min(60, jsInAssets.length)} JS files under dist/assets:\n` +
      (preview || " (none)\n") +
      `\nIf dist/assets is empty too, your build step isn't producing assets into this dist folder (or hasn't run yet).`
  );
}

async function main() {
  // Index built HTML pages. Ignore dist/assets/** because that’s JS/CSS, not docs content.
  const htmlFiles = await fg(["**/*.html"], {
    cwd: DIST_DIR,
    dot: true,
    onlyFiles: true,
    ignore: [
      "assets/**", // don't index JS/CSS bundles

      // don't index search pages
      "**/search*.html",
      "**/search/**",

      // Doxygen helper pages (optional but helpful)
      "**/navtree*.html",
      "**/menudata*.html",
      "**/dynsections*.html",
    ],
  });

  const documents = [];
  for (const rel of htmlFiles) {
    const abs = path.join(DIST_DIR, rel);
    const html = await fs.readFile(abs, "utf8");
    const $ = cheerio.load(html);

    // Remove noise
    for (const sel of STRIP_SELECTORS) $(sel).remove();
    $("script, style, noscript").remove();

    const title =
      normalizeText($("title").first().text()) ||
      normalizeText($("h1").first().text()) ||
      rel;

    const bodyText = normalizeText($("body").text());
    if (!bodyText) continue;

    const url = fileToUrl(rel);
    const section = sectionFromUrl(url);

    // VitePress local search shape: title, titles, text
    documents.push({
      id: url, // IMPORTANT: VitePress local search uses doc IDs like "/path#hash"
      title,
      titles: [section],
      text: bodyText,
    });
  }

  const miniSearch = new MiniSearch({
    idField: "id",
    fields: ["title", "titles", "text"],
    storeFields: ["title", "titles"],
  });

  miniSearch.addAll(documents);

  // MiniSearch JSON string (what VitePress expects inside the chunk)
  const serialized = JSON.stringify(miniSearch);

  // Wrap like VitePress local-search chunk:
  // const e='...';export{e as default};
  // JSON.stringify(serialized) ensures safe JS string escaping.
  const jsModule = `const e=${JSON.stringify(serialized)};export{e as default};\n`;

  // Find & overwrite the generated local-search chunk(s)
  const chunkFiles = await findLocalSearchIndexChunkFiles();
  await Promise.all(chunkFiles.map((f) => fs.writeFile(f, jsModule, "utf8")));

  console.log(
    `Indexed ${documents.length} pages.\nOverwrote local-search chunk(s):\n` +
      chunkFiles.map((f) => " - " + path.relative(process.cwd(), f)).join("\n")
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
