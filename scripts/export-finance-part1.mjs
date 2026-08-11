import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const TOTAL = 30;
const WIDTH = 1920;
const BASE = 1080;
const URL = 'http://127.0.0.1:5173/slides/finance-governance-part1.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = '/Users/kris/Documents/CodexProject/html-ppt/exports/_slides';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080',
         '--enable-webgl', '--use-gl=swiftshader', '--ignore-gpu-blocklist']
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: BASE, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 2500));

// 打印样式覆盖：仅显示当前 active 页
await page.addStyleTag({ content: `
  @media print {
    .slide{display:none!important;page-break-after:auto!important;page-break-inside:avoid!important}
    .slide.active{display:flex!important}
    .topbar,.ftr,#prog,.nav-drop,#bg-canvas{display:none!important}
  }
` });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function measureNeed(idx){
  return await page.evaluate((idx, BASE) => {
    const s = document.getElementById('slide' + idx);
    if (!s) return BASE + 24;
    const containers = [...s.querySelectorAll('.content-wrapper, .case-content, .table-section, .notes-area, .steps, .rule-list')];
    const avali = containers.map(el => el.clientHeight);
    const saved = containers.map(el => el.style.cssText);
    containers.forEach(el => {
      el.style.maxHeight = 'none'; el.style.flex = 'none'; el.style.overflow = 'visible'; el.style.height = 'auto';
    });
    let maxDelta = 0;
    containers.forEach((el, k) => {
      const nat = Math.ceil(el.getBoundingClientRect().height);
      const d = nat - avali[k];
      if (d > maxDelta) maxDelta = d;
    });
    containers.forEach((el, k) => el.style.cssText = saved[k]);
    return BASE + maxDelta + 24;
  }, idx, BASE);
}

const jobs = [];
for (let i = 0; i < TOTAL; i++) {
  await page.evaluate((idx) => { goSlide(idx); }, i);
  await sleep(2400);

  const pageHeight = await measureNeed(i);
  const num = String(i + 1).padStart(2, '0');
  const pdfPath = path.join(OUT_DIR, `part1-slide-${num}.pdf`);
  await page.pdf({
    path: pdfPath,
    width: WIDTH + 'px',
    height: pageHeight + 'px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  jobs.push(pdfPath);
  console.log(`✓ ${i+1}/${TOTAL}  height=${pageHeight}px`);
}

await browser.close();
console.log('DONE');
