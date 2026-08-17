import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'node:child_process';

const TOTAL = 14;
const OUT_DIR = '/Users/kris/Documents/CodexProject/html-ppt/exports/_slides/huaxia-financial';
const URL = 'http://127.0.0.1:5199/slides/huaxia-financial.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PVENV = '/tmp/pdfvenv/bin/python';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080',
         '--enable-webgl', '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'load', timeout: 40000 });
await new Promise(r => setTimeout(r, 3000));

await page.evaluate(() => {
  const t = document.querySelector('.topbar'), f = document.querySelector('.ftr');
  if (t) t.style.display = 'none';
  if (f) f.style.display = 'none';
});

async function reset() {
  await page.evaluate(() => {
    const q = (s) => Array.from(document.querySelectorAll(s));
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    const deck = document.getElementById('deck'); if (deck) deck.removeAttribute('style');
    q('.slide').forEach(el => el.removeAttribute('style'));
    q('.slide-wrapper').forEach(el => el.removeAttribute('style'));
    q('.slide-inner').forEach(el => el.removeAttribute('style'));
    q('.content-wrapper').forEach(el => el.removeAttribute('style'));
  });
}

// expand ONLY the given slide to its full content height (screen layout)
async function expandScreen(idx) {
  await page.evaluate((idx) => {
    const s = document.getElementById('slide' + idx);
    const deck = document.getElementById('deck');
    deck.style.position = 'relative'; deck.style.inset = 'auto'; deck.style.height = 'auto'; deck.style.overflow = 'visible';
    document.body.style.overflow = 'visible'; document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    const sw = s.querySelector('.slide-wrapper'); if (sw) { sw.style.position = 'relative'; sw.style.inset = 'auto'; sw.style.height = 'auto'; }
    const si = s.querySelector('.slide-inner'); if (si) { si.style.position = 'relative'; si.style.inset = 'auto'; si.style.height = 'auto'; si.style.overflow = 'visible'; }
    s.style.position = 'relative'; s.style.inset = 'auto'; s.style.height = 'auto'; s.style.overflow = 'visible';
    const cw = s.querySelector('.content-wrapper'); if (cw) { cw.style.height = 'auto'; cw.style.overflow = 'visible'; cw.style.flex = 'none'; }
  }, idx);
}

const pngs = [];
for (let i = 0; i < TOTAL; i++) {
  await reset();
  await page.evaluate(i => goSlide(i), i);
  await new Promise(r => setTimeout(r, 2400));

  let h;
  if (i === 0 || i === 13) {
    h = 1080; // cover & end: full-screen
  } else {
    await expandScreen(i);
    await new Promise(r => setTimeout(r, 400));
    h = await page.evaluate(() => Math.max(document.body.scrollHeight, 1080));
  }

  const num = String(i + 1).padStart(2, '0');
  const png = path.join(OUT_DIR, `slide-${num}.png`);
  await page.screenshot({ path: png, fullPage: true });
  pngs.push({ png, h });
  console.log(`OK slide ${num}/${TOTAL} height=${h}px`);
}

await browser.close();

// merge PNGs into a single full-bleed PDF (1920 CSS px width -> 1440pt at 192dpi)
const py = `
import img2pdf, glob, os
d = ${JSON.stringify(OUT_DIR)}
pngs = sorted(glob.glob(os.path.join(d, 'slide-*.png')))
layout = img2pdf.get_fixed_dpi_layout_fun((192,192))
out = os.path.join(d, '亿信华辰公司介绍与金融科技创新.pdf')
with open(out, 'wb') as fh:
    fh.write(img2pdf.convert(pngs, layout_fun=layout))
print('merged pngs:', len(pngs))
`;
const res = execFileSync(PVENV, ['-c', py], { encoding: 'utf8' }).trim();
console.log('ALL DONE merged: ' + res);
console.log('PDF at: ' + OUT_DIR + '/亿信华辰公司介绍与金融科技创新.pdf');
