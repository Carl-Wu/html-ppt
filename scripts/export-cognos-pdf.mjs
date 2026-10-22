import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'node:child_process';

const TOTAL = 27;
const OUT_DIR = '/Users/kris/Documents/CodexProject/html-ppt/exports/_slides/esen-cognos-wm';
const URL = 'http://127.0.0.1:5199/slides/esen-cognos.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WM_TEXT = '北京亿信华辰软件有限责任公司';
const PDF_NAME = '亿信华辰Cognos替代方案.pdf';

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
  const p = document.getElementById('prog'); if (p) p.style.display = 'none';
  const nd = document.querySelector('.nav-drop'); if (nd) nd.style.display = 'none';
});

// ---- 水印：平铺网格（水平周期 932px / 垂直周期 800px），单条文字旋转 29°，黑色 10% ----
await page.evaluate((text) => {
  const style = document.createElement('style');
  style.id = 'wm-style';
  style.textContent = `
    body{position:relative}
    #wmOverlay{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;
      z-index:2147483000;pointer-events:none}
    .wm-item{position:absolute;width:max-content;font-family:'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;
      font-size:64px;font-weight:700;color:rgba(0,0,0,.10);white-space:nowrap;
      transform:translate(-50%,-50%) rotate(29deg)}
  `;
  document.head.appendChild(style);
  const ov = document.createElement('div');
  ov.id = 'wmOverlay';
  document.body.appendChild(ov);
  window.__wmText = text;
  window.__layoutWatermark = function () {
    const o = document.getElementById('wmOverlay');
    if (!o) return;
    o.innerHTML = '';
    const H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, 1080);
    let html = '';
    for (let cy = 550; cy < H + 400; cy += 800) {
      for (let cx = 558; cx < 1920 + 500; cx += 932) {
        html += '<div class="wm-item" style="left:' + cx + 'px;top:' + cy + 'px">' + window.__wmText + '</div>';
      }
    }
    o.innerHTML = html;
  };
}, WM_TEXT);

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
  if (i === 0 || i === 26) {
    h = 1080; // cover & end: full-screen
  } else {
    await expandScreen(i);
    await new Promise(r => setTimeout(r, 400));
    h = await page.evaluate(() => Math.max(document.body.scrollHeight, 1080));
  }

  await page.evaluate(() => window.__layoutWatermark());
  await new Promise(r => setTimeout(r, 150));

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
out = os.path.join(d, ${JSON.stringify(PDF_NAME)})
with open(out, 'wb') as fh:
    fh.write(img2pdf.convert(pngs, layout_fun=layout))
print('merged pngs:', len(pngs))
`;
const res = execFileSync('python3', ['-c', py], {
  encoding: 'utf8',
  env: { ...process.env, PYTHONPATH: process.env.HOME + '/Library/Python/3.9/lib/python/site-packages' }
}).trim();
console.log('ALL DONE merged: ' + res);
console.log('PDF at: ' + OUT_DIR + '/' + PDF_NAME);
