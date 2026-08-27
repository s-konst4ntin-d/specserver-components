import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const serverDir = join(dist, "server");
const assetsDir = join(dist, "assets");

const readText = (file) => readFileSync(join(root, file), "utf8");
const hero = readFileSync(join(root, "assets", "server-components-hero.png"));

rmSync(dist, { recursive: true, force: true });
mkdirSync(serverDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

copyFileSync(join(root, "assets", "server-components-hero.png"), join(assetsDir, "server-components-hero.png"));
copyFileSync(join(root, "robots.txt"), join(dist, "robots.txt"));
copyFileSync(join(root, "sitemap.xml"), join(dist, "sitemap.xml"));

const worker = `
const html = ${JSON.stringify(readText("index.html"))};
const css = ${JSON.stringify(readText("styles.css"))};
const js = ${JSON.stringify(readText("app.js"))};
const robots = ${JSON.stringify(readText("robots.txt"))};
const sitemapTemplate = ${JSON.stringify(readText("sitemap.xml"))};
const heroBase64 = ${JSON.stringify(hero.toString("base64"))};

function bytesFromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function textResponse(body, type) {
  return new Response(body, {
    headers: {
      "content-type": type + "; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function binaryResponse(body, type) {
  return new Response(body, {
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    if (path === "/" || path === "/index.html") return textResponse(html, "text/html");
    if (path === "/styles.css") return textResponse(css, "text/css");
    if (path === "/app.js") return textResponse(js, "application/javascript");
    if (path === "/robots.txt") return textResponse(robots.replaceAll("https://vmz-server-components.example", url.origin), "text/plain");
    if (path === "/sitemap.xml") return textResponse(sitemapTemplate.replaceAll("https://vmz-server-components.example", url.origin), "application/xml");
    if (path === "/assets/server-components-hero.png") return binaryResponse(bytesFromBase64(heroBase64), "image/png");

    return new Response("Страница не найдена", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
`;

writeFileSync(join(serverDir, "index.js"), worker.trimStart(), "utf8");
writeFileSync(join(dist, "index.html"), readText("index.html"), "utf8");
writeFileSync(join(dist, "styles.css"), readText("styles.css"), "utf8");
writeFileSync(join(dist, "app.js"), readText("app.js"), "utf8");

console.log("Built static VMZ site to dist/");
