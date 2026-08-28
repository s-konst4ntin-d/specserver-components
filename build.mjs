import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const serverDir = join(dist, "server");
const assetsDir = join(dist, "assets");
const productImagesDir = join(root, "assets", "product-images");
const distProductImagesDir = join(assetsDir, "product-images");
const openaiDir = join(dist, ".openai");

const readText = (file) => readFileSync(join(root, file), "utf8");
const hero = readFileSync(join(root, "assets", "server-components-hero.png"));
const brand = readFileSync(join(root, "assets", "specserver-bg-01-dark-server-room.png"));
const productImages = readdirSync(productImagesDir)
  .filter((file) => file.toLowerCase().endsWith(".png"))
  .map((file) => ({
    file,
    route: `/assets/product-images/${file}`,
    data: readFileSync(join(productImagesDir, file)),
  }));

rmSync(dist, { recursive: true, force: true });
mkdirSync(serverDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });
mkdirSync(distProductImagesDir, { recursive: true });
mkdirSync(openaiDir, { recursive: true });

copyFileSync(join(root, "assets", "server-components-hero.png"), join(assetsDir, "server-components-hero.png"));
copyFileSync(join(root, "assets", "specserver-bg-01-dark-server-room.png"), join(assetsDir, "specserver-bg-01-dark-server-room.png"));
for (const image of productImages) {
  copyFileSync(join(productImagesDir, image.file), join(distProductImagesDir, image.file));
}
copyFileSync(join(root, ".openai", "hosting.json"), join(openaiDir, "hosting.json"));
copyFileSync(join(root, "robots.txt"), join(dist, "robots.txt"));
copyFileSync(join(root, "sitemap.xml"), join(dist, "sitemap.xml"));

const worker = `
const html = ${JSON.stringify(readText("index.html"))};
const css = ${JSON.stringify(readText("styles.css"))};
const js = ${JSON.stringify(readText("app.js"))};
const robots = ${JSON.stringify(readText("robots.txt"))};
const sitemapTemplate = ${JSON.stringify(readText("sitemap.xml"))};
const heroBase64 = ${JSON.stringify(hero.toString("base64"))};
const brandBase64 = ${JSON.stringify(brand.toString("base64"))};
const productImageAssets = new Map(${JSON.stringify(
  productImages.map((image) => [image.route, image.data.toString("base64")])
)});

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
    if (path === "/robots.txt") return textResponse(robots.replaceAll("https://specserver-components.example", url.origin), "text/plain");
    if (path === "/sitemap.xml") return textResponse(sitemapTemplate.replaceAll("https://specserver-components.example", url.origin), "application/xml");
    if (path === "/assets/server-components-hero.png") return binaryResponse(bytesFromBase64(heroBase64), "image/png");
    if (path === "/assets/specserver-bg-01-dark-server-room.png") return binaryResponse(bytesFromBase64(brandBase64), "image/png");
    if (productImageAssets.has(path)) return binaryResponse(bytesFromBase64(productImageAssets.get(path)), "image/png");

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

console.log("Built static SpecServer site to dist/");
