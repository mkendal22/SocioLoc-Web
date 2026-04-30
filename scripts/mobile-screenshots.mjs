import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("./mobile-shots");
mkdirSync(OUT, { recursive: true });

const URL = "http://localhost:3000";

const iPhone = {
  ...devices["iPhone 14 Pro"],
  viewport: { width: 393, height: 852 },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snap(page, name, opts = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false, ...opts });
  console.log("✓ ", name, "→", file);
  return file;
}

const browser = await chromium.launch();
const ctx = await browser.newContext(iPhone);
const page = await ctx.newPage();

console.log("Loading", URL);
await page.goto(URL, { waitUntil: "networkidle" });
await sleep(800);

// 1) Top hero
await snap(page, "01-hero-top");

// 2) Scroll down a bit to capture title + buttons
await page.evaluate(() => window.scrollTo(0, 220));
await sleep(400);
await snap(page, "02-hero-mid");

// 3) Phone screen
await page.evaluate(() => window.scrollTo(0, 520));
await sleep(400);
await snap(page, "03-hero-phone");

// 4) Marquee
await page.evaluate(() => {
  const el = document.querySelector(".marquee");
  el?.scrollIntoView({ behavior: "instant", block: "center" });
});
await sleep(400);
await snap(page, "04-marquee");

// 5) Features bento
await page.evaluate(() => {
  document.getElementById("features")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await sleep(400);
await snap(page, "05-features-top");

await page.evaluate(() => window.scrollBy(0, 480));
await sleep(400);
await snap(page, "06-features-cards");

// 6) Showcase first block
await page.evaluate(() => {
  document.getElementById("showcase")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await sleep(500);
await snap(page, "07-showcase-1");

await page.evaluate(() => window.scrollBy(0, 700));
await sleep(400);
await snap(page, "08-showcase-2");

// 7) HowItWorks timeline
await page.evaluate(() => {
  document.getElementById("how")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await sleep(500);
await snap(page, "09-how");

// 8) FAQ
await page.evaluate(() => {
  document.getElementById("faq")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await sleep(400);
await snap(page, "10-faq");

// 9) CTA + Footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 800));
await sleep(400);
await snap(page, "11-cta");

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await sleep(400);
await snap(page, "12-footer");

// 10) Mobile menu open
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(300);
await page.click('button[aria-label="Menüyü aç/kapat"]').catch(() => {});
await sleep(500);
await snap(page, "13-menu-open");

// 11) Privacy page
await page.goto(URL + "/gizlilik", { waitUntil: "networkidle" });
await sleep(500);
await snap(page, "14-gizlilik");

// 12) Detect horizontal overflow
const horiz = await page.evaluate(() => {
  return {
    docWidth: document.documentElement.scrollWidth,
    viewWidth: window.innerWidth,
    overflowing: document.documentElement.scrollWidth > window.innerWidth,
  };
});
console.log("Horizontal scroll check:", horiz);

await browser.close();
console.log("\nDONE — open the mobile-shots folder.");
