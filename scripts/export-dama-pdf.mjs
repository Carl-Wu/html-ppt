import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const TOTAL = 11;
const OUT_DIR = '/Users/kris/Documents/CodexProject/html-ppt/exports/_slides/dama';
const URL = 'http://127.0.0.1:5173/slides/dama-finance-governance.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--enable-webgl', '--use-gl=swiftshader', '--ignore-gpu-blocklist']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
// 等待 boot 加载完成 + 首页渲染
await new Promise(r => setTimeout(r, 8000));

for (let i = 0; i < TOTAL; i++) {
  // 通过键盘或 API 切换到第 i 页
  await page.evaluate((idx) => {
    const swiper = document.querySelector('.swiper')?.swiper;
    if (swiper && swiper.slideTo) swiper.slideTo(idx, 0);
  }, i);
  // 等待页面动画渲染
  await new Promise(r => setTimeout(r, 4000));

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

// 合并所有 slide-*.pdf 为单个 PDF（使用系统 python3 + pypdf）
const { execFileSync } = await import('node:child_process');
const py = `
import glob, os
from pypdf import PdfWriter, PdfReader
d = ${JSON.stringify(OUT_DIR)}
files = sorted(glob.glob(os.path.join(d, 'slide-*.pdf')))
w = PdfWriter()
for f in files:
    for p in PdfReader(f).pages:
        w.add_page(p)
out = os.path.join(d, 'DAMA决赛汇报-金融租赁数据合规治理与决策赋能.pdf')
with open(out, 'wb') as fh:
    w.write(fh)
print('merged pages:', len(files))
`;
const res = execFileSync('python3', ['-c', py], { encoding: 'utf8' });
console.log(`\n全部页面导出完成并合并: ${res.trim()}`);
