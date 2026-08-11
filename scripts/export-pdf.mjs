import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const TOTAL = 21;
const OUT_DIR = '/Users/kris/Documents/CodexProject/html-ppt/exports/_slides';
const URL = 'http://127.0.0.1:5173/slides/work-report.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

for (let i = 0; i < TOTAL; i++) {
  // 切换到第 i 页
  await page.evaluate((idx) => {
    cur = idx;
    render();
  }, i);
  // 等待渲染 + 图表
  await new Promise(r => setTimeout(r, 1500));

  const num = String(i + 1).padStart(2, '0');
  const pdfPath = path.join(OUT_DIR, `slide-${num}.pdf`);

  await page.pdf({
    path: pdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log(`✓ slide ${num}/${TOTAL} → ${pdfPath}`);
}

await browser.close();
console.log(`\n全部完成！PDF 保存在: ${OUT_DIR}`);
