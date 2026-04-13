# ZihanWang314.github.io 主页改版记录

整理自 2026-04-10 ~ 04-12 的 Claude Code 会话：基于 `~/Downloads/个人主页.docx` 中的散落想法，完成主页的整体设计与实现。

---

## 1. 起点：笔记整理

从 `个人主页.docx` 提炼出的改版诉求：

- **身份**：改为 "Researcher"，不用 "PhD student"
- **统一**：所有平台改为 `Zihan "Zenus" Wang`
- **视觉风格**：禁欲风（极简克制）+ 略带渐变白色（Andrew 的建议）
- **Dark mode + 手机端适配**
- **Blog 栏目**：长文应该导回自站，要写 roadmap
- **论文图**：放 input→output，不要 model architecture（曼玲的建议）
- **参考站**：Shuran Song, Sewon Min, Cheng Chi, muennighoff.com, Hannaneh
- **补充内容**：Invited Talks (Northwestern, MIT)、Podcast (David Ondrej, Zijing Wu, Steve Hsu)、Semantic Scholar 补全论文

---

## 2. 12 个设计决策（grill-me 轮次 1）

| #  | 问题       | 决策                                                                       |
| -- | ---------- | -------------------------------------------------------------------------- |
| 1  | 主题色     | 保留紫色 `#5b4dd6`（Northwestern 色），背景黑白极简                        |
| 2  | 背景渐变   | About 区顶部极淡紫→白渐变（`#f3f0ff` → `#ffffff`），其余纯白              |
| 3  | Dark mode  | 系统自动 + navbar 手动切换按钮（C 方案）                                   |
| 4  | Blog       | 独立子页面 `blog.html`，navbar 加入口                                      |
| 5  | 名字解释   | 不做（原计划的"何意味"放弃）                                               |
| 6  | 身份定位   | "Researcher at Northwestern"，保留导师信息                                 |
| 7  | 论文缩略图 | 暂不改，之后作者自己换 input→output 图                                     |
| 8  | Talks 格式 | 结构化列表：日期 · 机构 · 话题 · [Slides]                                  |
| 9  | Navbar     | About / News / Publications / Talks / Awards / Blog（移除 Service）        |
| 10 | Bio 图标   | 加 LinkedIn (`https://www.linkedin.com/in/zenus`)                          |
| 11 | 招募信息   | 保留红色高亮                                                               |
| 12 | 字体       | Lato → Inter                                                               |

---

## 3. 英雄区设计（grill-me 轮次 2）

用户追加需求：**重要信息都在第一屏可见**，参考 muennighoff.com 的做法。

### 最终方案（经两轮迭代）

- **布局**：About section 改为两栏（左 bio + 右 Updates 卡片）
- **左栏**：120px 头像 · 名字 · bio · 招募 banner · research tags（可交互） · 图标行
- **右栏**：统一 "Updates" 容器，内含 3 条 news cards
  - RAGEN-2 preprint 发布
  - David Ondrej Podcast
  - Outstanding Paper @ NeurIPS 2025 LAW
- **Research Interest section 删除**，内容压缩为左栏 bio 下方的 tag pills
- **头像尺寸**：200px → 120px

> **迭代记录**：最初设计为 3 个独立 "Latest Paper / Latest News / Latest Award" 卡片。后改为统一 "Updates" 容器 + 3 条 news cards，更整合更简洁。

---

## 4. Research Tags 交互

用户要求 tags 可以点击，显示相关论文。实现：

- 点击 tag → popover 弹出论文列表（标题 + venue + 链接）
- 再次点击 / 点击外部 → 关闭
- 选中 tag 显示为紫底白字

**论文分配：**

| Tag          | 论文                                  |
| ------------ | ------------------------------------- |
| Agentic RL   | RAGEN-2, VAGEN, UFO, RAGEN, MINT     |
| MoE          | Chain-of-Experts, ESFT, DeepSeek-V2   |
| Long-Context | T*, MindCube                          |
| Multimodal   | MindCube, VAGEN, T*                   |

---

## 5. News 滚动容器（替代 Show More）

参考 qinengwang-aiden.github.io 的做法，News section 改为固定高度滚动容器。

**决策：**

- 容器高度：`max-height: 300px`，约显示 5-6 条
- 滚动条：默认隐藏，hover 时显示 2px 超细半透明紫色（`rgba(139,125,240,0.4)`）
- 底部渐变遮罩：白→透明（dark mode 下深灰→透明），滚到底部自动消失
- 删除 "Show More/Less" 按钮，所有 news items 去掉 `.hidden` class
- 对应 Playwright 测试改写为验证 `.news-scroll` 容器的 `overflow-y: auto`

---

## 6. GitHub Stars 徽章

每篇论文的 `.pub-links` 行末尾展示 GitHub star 数。

### 迭代记录

1. **v1 — shields.io 图片**：使用 `img.shields.io/github/stars/...?style=social`。视觉上和其他 pill 按钮完全割裂，被否决。
2. **v2 — 纯星号 pill**：用 `☆ 2.6k` 的 pill 按钮。看不出是 GitHub stars，缺少标识。
3. **v3 — GitHub logo + 金星 + 数字（最终方案）**：`[  ★ 2.6k ]` 样式，GitHub 图标标识来源，金色小星号，数字通过 GitHub API 实时拉取。和 Code/Paper 等 pill 风格一致。

**技术细节**：

- 页面加载时 JS 向 `api.github.com/repos/{owner}/{repo}` 发请求
- 数字 ≥1000 自动显示为 `2.6k` 格式
- API 失败时静默降级，不影响页面

---

## 7. 内容更新（网站更新.docx）

基于 `~/Downloads/网站更新.docx` 的 4 个 TODO：

1. **Bio 措辞**："Researcher" → "PhD researcher"，更新 NVIDIA 表述
2. **VAGEN**：加 "Featured by Stanford AI Blog"（紫色 + 超链接）
3. **RAGEN-2**：加 "Huggingface #2 Paper of the Day"（紫色 + 超链接）
4. **MindCube**：加 "Adopted by Gemini 3 Pro"（Jeff Dean 推文超链接）
5. **颜色统一**：所有 pub-venue 红色标注改为紫色（`var(--purple)`），招募信息红色除外

---

## 8. Dark Mode 色值迭代

经过多轮调整，最终 dark mode 色板：

| Token            | 色值       | 说明                                |
| ---------------- | ---------- | ----------------------------------- |
| `--bg`           | `#121212`  | Material Design 标准深色基底        |
| `--bg-alt`       | `#1a1a1a`  | 卡片/次级背景                       |
| `--text`         | `#e0e0e0`  | 主文字                              |
| `--text-muted`   | `#b0b0b0`  | 次要文字                            |
| `--border-strong`| `#444444`  | 分割线/按钮边框                     |
| `--purple`       | `#8b7df0`  | 紫色 accent，在深灰底上对比度充足   |
| `--bg-hero`      | `#1e1830→#121212` | Hero 区渐变，带紫调          |

> 迭代记录：`#0f0f0f`（太黑）→ `#1c1c1e`（差别不明显）→ `#2c2c2e`（太灰）→ `#171717`（接近参考图）→ `#121212`（GPT 建议的 Material Design 标准色，最终采用）

---

## 9. 实现总结

### 修改的文件

**`stylesheet.css`**（完全重写）

- Inter 字体替换 Lato
- CSS 变量双主题：`:root` + `html[data-theme="dark"]`
- Hero 两栏 grid 布局，响应式（860px 折叠）
- Research tag pills + popover 样式
- Updates 容器 + news cards 样式
- GitHub stars pill 样式（`.pub-star`）
- 结构化 talks list、navbar backdrop-filter
- 深色模式：`--bg: #121212`, `--text: #e0e0e0`, `--purple: #8b7df0`（Material Design 标准）
- News 滚动容器 + 隐藏式滚动条 + 底部渐变遮罩

**`index.html`**（结构性重构）

- `<head>` 加 theme init script（避免首屏闪烁）
- Navbar：加 dark toggle + Blog 链接，移除 Service
- Hero 两栏：bio-left（头像行 + bio + 招募 + tags + icons）+ hero-right（Updates 容器 + 3 条 news cards）
- Bio 加 LinkedIn 图标
- Research Interest section 删除，改为交互式 tag pills + popover
- 每篇论文加 GitHub stars pill（`.pub-star` + API 拉取）
- Talks 改为 `.talk-list` 结构化格式
- 底部 JS 新增：theme toggle、research tag popover、GitHub stars 拉取（12h 缓存）、news scroll fade
- pub-venue 红色全部改为紫色，Bio 改为 "PhD researcher"
- 论文加 Stanford AI Blog / Huggingface / Gemini 3 Pro 标注

**`blog.html`**（新建）

- 共享 navbar + stylesheet
- 占位文章："RAGEN Roadmap — Where Agentic RL is Headed"

**`tests/site.spec.js`**（3 → 8 个测试）

新增测试：

1. Dark mode toggle 切换 + localStorage 持久化
2. Hero Updates 容器 + 3 条 cards 在第一屏可见（viewport 1280×800）
3. Bio 图标包含 LinkedIn 链接
4. Research tag 点击 → popover 显示 → 再次点击关闭
5. Blog 页面加载 + 共享 navbar

---

## 10. 测试结果

```text
8 passed (4.1s)
  ✓ hamburger opens and closes the nav
  ✓ news section is a scrollable container with all items visible
  ✓ publication filter shows only matching cards
  ✓ dark mode toggle switches theme and persists
  ✓ hero news block has header and 3 cards above the fold
  ✓ bio icons include LinkedIn link
  ✓ research tag click opens popover with papers
  ✓ blog page loads and has shared navbar
```

运行：`npx playwright test`
本地预览：`python3 -m http.server 8502` → `http://localhost:8502`

---

## 11. 待办 / Out of Scope

这些事情在 docx 里提到但本次不实现，留给用户自己：

- **论文缩略图**：全部换成 input→output 风格的图（作者决定）
- **平台同步**：LinkedIn / Google Scholar / Semantic Scholar / 小红书 / 知乎 / B 站 改名为 "Zihan 'Zenus' Wang"
- **Semantic Scholar 补论文**、Google Scholar 核对 arXiv → 已发表
- **Blog 实际内容**：`blog.html` 目前只是占位
- **Podcast iframe 嵌入**（Steve Hsu 访谈）
- **zenus.me 域名配置**
- **换头像**（docx 提到现在的"越看越诡异"）
- **访谈内容**里的经历补进主页

---

## 12. 设计一致性提示

如果后续要扩展，以下设计语言需保持一致：

- **色彩**：紫色 `#5b4dd6` 只作 accent，不做色块；灰阶层级 `--text` / `--text-muted` / `--text-faint`
- **边框**：`1px solid var(--border)`，圆角 pill 用 `border-radius: 999px`
- **字号层级**：h2 14px uppercase · body 13.5–15px · meta 11.5–12.5px
- **交互 hover**：文字变紫 + 背景 `--purple-glow`，border 变紫
- **标签/按钮**：都是 pill 形（`border-radius: 999px`），无实心填充（active 状态除外）
- **GitHub stars**：使用 `.pub-star` pill 而非 shields.io 图片，保持视觉一致性

---

*Last updated: 2026-04-12*
