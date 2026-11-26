# MyPortfolioD — 项目长期约定

## 项目定位
资深软件工程师个人作品集网站，展示 AI Agent、电商全栈、微服务/云原生（BlueMart）等项目与个人档案。
不再是「学生 / 找 co-op」定位。姓名保留 **Xiaoxing Dang**，所在地 Toronto, Canada。
`client/src/data/portfolio.js` 里的姓名、邮箱、电话、指标与履历均为**示例内容**，发布前需替换。

## 技术栈与约束
- MERN：React 18 + Vite 5 + Tailwind v4 (`@tailwindcss/vite`) + Express/Mongoose/JWT + MongoDB。
- 后端 API 响应统一 `{ success, data }`；路由 `/api/projects`、`/api/qualifications`、`/api/contacts`、`/api/auth/*`、`/api/users`。
- **不得破坏**现有 API 契约：联系表单字段 firstName/lastName/email/phone/message，admin CRUD 字段，JWT sessionStorage key `portfolio_access_token`。
- 前端主样式写在 `client/src/index.css` 的自定义语义类 + CSS 变量，不依赖 Tailwind 工具类；主题用 `data-theme` on `<html>`，localStorage key **`portfolio_theme_v2`**（Prism 改版时升级，让新默认主题对老访客生效）。
- 公网页面必须**无后端也能完整渲染**：curated 内容常驻，API 记录追加显示，请求失败静默降级（`usePortfolioData.js`）。

## 设计系统约定（用户 2026-11-12 最终确认，已推翻初版）
- 方向：**Prism / Spectral Systems** — 明亮、多彩、技术感。用户明确否掉了初版「深海军蓝 + 黑白」的 Refined corporate，要求 purple/blue 为主并可混搭其他颜色。
- **颜色是数据通道**：violet = Agent 系统、blue = 平台、cyan = 数据/事件、amber = 电商、magenta = 实时/可交互状态（原 signal-lime 已弃用）。`SpectrumKey.jsx` 把这个编码显式展示给访客。
- 两套主题都彩色：**light = Prism（亮色，默认）**；**dark = Nebula（深靛紫 + 发光光谱，不是近黑）**。文字用深靛紫墨色、背景用淡薰衣草白，避免纯黑白。
- 关键 token：`--c-*` vivid 原语、`--spectrum*`、`--ink-*` 可读变体、`--aurora-1..4`、`--hue-*`（项目域色）、`--signal*`。CSS 末尾 `SPECTRAL LAYER` 覆盖早期散落的 token，改配色优先改这里。
- 字体：Instrument Sans（展示+正文）+ JetBrains Mono（微标签、代码、数字）。
- 差异化元素：编号章节 `01 —`、蓝图网格底纹 + 全站极光、自绘 SVG 系统架构图（非库存图片）、实时拓扑、⌘K 命令面板、Decision Lab、渐变 CTA / 渐变标题、章节渐变分隔线。
- 明暗双主题；WCAG AA 对比（实测 light `--text-faint` 8.89:1、dark 8.23:1）、focus-visible、skip link、44px 触控目标、prefers-reduced-motion。
- **小字可读性（CLARITY LAYER，CSS 末尾）**：micro label 最低 **12.5px / 600 字重 / 0.055em 字距**，eyebrow 与章节号 13.4px；`--text-xs` 13px、`--text-sm` 14.4px；SVG 图内文字 ≥11px 用户单位且 tracking 归零。用户明确不喜欢 9–11px 全大写宽字距的「vague」小字，新增任何微标签都必须遵守这个下限。改字只动 CSS 末尾的 CLARITY LAYER，不要改 hue。

## 本地运行提示
根 `npm run dev` 同时起后端 5000 与前端 5173；但本机 5173/5000 常被其他项目占用，Vite 会自动顺延端口。跨域需在后端设置 `CLIENT_ORIGIN`。

## Assignment 4 基建（2026-11-14 落地）
- 测试：`npm test`（后端 node --test 6 项）、`npm run test:unit`（Vitest + Testing Library，`client/src/test/*.test.jsx` 18 项）、`npm run test:e2e`（Cypress 13，`cypress/e2e/fullstack-workflow.cy.js` 3 项，产出 MP4 + 截图到 `docs/assignment4/e2e/`）。Vitest 必须 `pool:'forks'` + `singleFork:true`，否则本沙箱 brokered FS 并发写扩展名缓存会 EPERM。
- **Cypress 必须用 `scripts/run-e2e.mjs` 启动**：会话注入了 `ELECTRON_RUN_AS_NODE=1`（报 `bad option: --smoke-test`），且 HTTP(S)_PROXY 会让 baseUrl 校验失败；脚本清掉这些变量。CI 无此问题。
- 性能：Lighthouse 12.8.2（根目录 devDep），`node scripts/perf-summary.mjs` 汇总 `docs/assignment4/performance/before-*.json` / `after-*.json` 生成 comparison.json/html。优化内容：字体自托管（消除 Google Fonts 阻塞）+ 非首页路由 `React.lazy` 分包。入口包 275.05→240.16 kB。
- 部署：`SERVE_CLIENT=true` 让 Express 同时托管 `client/dist` 与 `/api/*`；`VITE_API_URL=""` 表示同源 `/api/...`（`api.js` 用 `??` 判空，不要改回 `||`）。`GET /api/health` 返回真实 Mongoose 连接状态。配置在 `render.yaml`、`Dockerfile`、`deploy/env.example`、`docs/assignment4/DEPLOYMENT.md`。
- 验证：`node scripts/verify-deployed.mjs <URL>`（13 项），`node scripts/capture-evidence.mjs`（CDP 抓应用截图），`node scripts/shoot-html.mjs`（CDP 抓 HTML 报告；Chrome `--screenshot` 直接调用在本沙箱会被 SIGTERM）。`python scripts/build-report.py` 生成 Word 文档。
- 公网前端已用平台内置发布，链接：`https://wbapp-vu5vmde4tqpa0ecibhzt8z.app.workbuddy.host/?sharecode=AG4TQ4B5GU`（目录 `deploy-site/`，静态产物用 `VITE_API_URL="" npx vite build --outDir ../deploy-site` 生成）。该沙箱明确拒绝依赖 MongoDB 的项目，**只能托管静态前端**；公网页面靠 curated 内容兜底，没有可用 API。
- **数据库已切到 MongoDB Atlas（2026-11-25）**：`.env` 的 `MONGO_URI` 指向 `cluster0.xzv5qdp.mongodb.net/Portfolio`（SRV/TLS），本机 Express 连云端库；原始本地 URI 备份在 gitignored `.env.pre-atlas`。切换/回退统一用 `scripts/switch-db.mjs`（`status | atlas | local`，`--dry-run`，完整串优先从 `ATLAS_URI` 环境变量读，避免密码进 argv；会自动补 `/Portfolio?retryWrites=true&w=majority`）。**不要把 Atlas 密码写进任何受控文件**。
- **用户明确要求不动 git**（不建分支/不提交/不推送），CI 工作流 `.github/workflows/ci-cd.yml` 与 `docs/assignment4/feature-branch.sh`、`CI_CD_GUIDE.md` 仅交付配置与 runbook。Part III 只剩「Express 后端上云」，Part IV 仍为 CONFIGURED。
- 生成 Word 报告必须用 `/c/Python312/python.exe scripts/build-report.py`（该解释器装了 python-docx 1.2.0；WorkBuddy 自带的 `python`/`python3` 3.13 没有）。读本地 docx 走 office-routing → local-office-edit 的 editor_sdk `doc_convert_to_html`。
