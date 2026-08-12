# AI 数据治理与汇报 PPT 项目

基于 Vite 的 HTML 演示/汇报页项目，包含一套 Web3D 发布会主应用和多套可访问的 HTML 汇报页面，支持一键导出 PDF。

## 快速启动

```bash
cd /Users/kris/Documents/CodexProject/html-ppt && npx vite --host
```

启动后访问 `http://localhost:5173/`。

## 可访问页面（统一放在 `public/slides/`）

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| Web3D 主应用（DAMA 决赛汇报） | [`/slides/dama-finance-governance.html`](http://localhost:5173/slides/dama-finance-governance.html) | 金融租赁数据治理 Web3D 发布会系统（`dama-finance-governance.html` + `src/`） |
| 金融治理方案 · 第一部分 | [`/slides/finance-governance-part1.html`](http://localhost:5173/slides/finance-governance-part1.html) | 行业现状与标杆实践，30 页 |
| 金融治理方案 · 第二部分 | [`/slides/finance-governance-part2.html`](http://localhost:5173/slides/finance-governance-part2.html) | 整体解决方案，44 页 |
| 2026 上半年工作汇报 | [`/slides/work-report.html`](http://localhost:5173/slides/work-report.html) | 金融业务创新中心上半年工作汇报（内嵌 Agent+Skill 架构页） |
| Agent+Skill 技术体系 | [`/slides/agent-skill-arch.html`](http://localhost:5173/slides/agent-skill-arch.html) | 独立架构展示页（被 work-report 内嵌引用） |

> 注：200 态由 Vite dev server 提供。页面脚本与图表库（ECharts / Chart.js / Tailwind）从 `cdn.jsdelivr.net` 加载，需联网。


## 目录结构

```text
html-ppt/
├── src/                  # 各 HTML 页面引用的 JS 源码
│   ├── main.js           # 页面入口脚本（被 public/slides/dama-finance-governance.html 引用）
│   ├── pages/            # 页面 JS（按 HTML 页面分子目录存放，见“开发规范”）
│   │   └── dama/         # dama-finance-governance.html 的页面 JS
│   ├── components/       # 共享组件（图表、粒子、Agent 卡片等）
│   ├── core/             # 共享核心（Three.js 引擎、页面路由等）
│   ├── asset/            # 页面用到的视频等资源
│   └── styles/           # 共享样式
├── public/
│   ├── slides/           # ★ 所有可访问的 HTML 界面（含 Web3D 主应用 dama-finance-governance.html）
│   └── assets/           # 页面共用图片资源（logo / 资质证书 / 架构图等）
├── exports/              # 导出 PDF 成品（合并版）
│   └── _slides/          # 逐页 PDF 中间产物（可重新生成，已 gitignore）
├── legacy/               # 历史归档（本地保留，不入库）：旧版页面、草稿、资料文档
├── scripts/              # PDF 导出脚本（Puppeteer 调本机 Chrome）
├── dist/                 # vite build 产物
└── package.json / readme.md / vite.config.js
```

## 开发规范

### HTML 页面与 JS 的组织方式

1. **页面 HTML 统一放在 `public/slides/`**，一个页面一个文件。
2. **每个 HTML 页面引用到的 JS，统一存放在 `src/pages/<页面名>/` 子目录下**，目录名与 HTML 文件名对应：
   - `dama-finance-governance.html` → `src/pages/dama/`
   - 例如未来的 `finance-governance-part1.html` 页面脚本 → `src/pages/finance-governance-part1/`
3. **共享代码不放进 `pages/<页面名>/`**，而是留在公共目录中复用：
   - 共享通用能力（引擎、路由、动画封装等）→ `src/core/`
   - 共享 UI 组件（图表、粒子、卡片等）→ `src/components/`
   - 共享样式 → `src/styles/`；视频等资源 → `src/asset/`
4. **目录内相对引用**：页面 JS 在 `src/pages/<页面名>/` 内同级互相引用用 `./`；引用共享代码用 `../../core/...`、`../../components/...`、`../../asset/...`。

> 目标：每个 HTML 页面对应的页面 JS 自成一体、互不干扰，便于维护和扩展。

## 导出 PDF

导出脚本会自动翻页 + 检测内容溢出并按需加高页面，保证长页内容不截断。

```bash
# 金融治理方案 part1（30 页）
node scripts/export-finance-part1.mjs
# 金融治理方案 part2（44 页）
node scripts/export-finance-part2.mjs
# 2026 上半年工作汇报
node scripts/export-pdf.mjs
# Web3D 主应用（DAMA 决赛汇报）
node scripts/export-dama-pdf.mjs
```

逐页 PDF 输出到 `exports/_slides/`，合并成品输出到 `exports/`。脚本依赖：
- 本机 `/Applications/Google Chrome.app`
- `python3` + `pypdf`（用于最终合并 PDF）

## 归档说明（legacy/）

以下文件属于历史版本或备份，不再由当前页面引用：
- `finance-governance-1.html`：早期单页草稿（已被 part1 + part2 取代）
- `finance-governance-part1.html.bak`：part1 的历史备份
- `presentation.html` / `temple.html`：旧版汇报页
- `*.pptx` / `*.pdf` / `*.xlsx`：历史汇报与会议资料
