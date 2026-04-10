# ZihanWang314.github.io 主页改版记录

整理自 2026-04-10 的 Claude Code 会话：基于 `~/Downloads/个人主页.docx` 中的散落想法，完成主页的整体设计与实现。

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

| # | 问题 | 决策 |
|---|------|------|
| 1 | 主题色 | 保留紫色 `#5b4dd6`（Northwestern 色），背景黑白极简 |
| 2 | 背景渐变 | About 区顶部极淡紫→白渐变（`#f3f0ff` → `#ffffff`），其余纯白 |
| 3 | Dark mode | 系统自动 + navbar 手动切换按钮（C 方案） |
| 4 | Blog | 独立子页面 `blog.html`，navbar 加入口 |
| 5 | 名字解释 | 不做（原计划的"何意味"放弃） |
| 6 | 身份定位 | "Researcher at Northwestern"，保留导师信息 |
| 7 | 论文缩略图 | 暂不改，之后作者自己换 input→output 图 |
| 8 | Talks 格式 | 结构化列表：日期 · 机构 · 话题 · [Slides] |
| 9 | Navbar | About / News / Publications / Talks / Awards / Blog（移除 Service） |
| 10 | Bio 图标 | 加 LinkedIn (`https://www.linkedin.com/in/zenus`) |
| 11 | 招募信息 | 保留红色高亮 |
| 12 | 字体 | Lato → Inter |

---

## 3. 英雄区二次讨论（grill-me 轮次 2）

用户追加需求：**重要信息都在第一屏可见**，参考 muennighoff.com 的做法。最终方案：

- **布局**：About section 改为两栏（左 bio + 右 highlights）
- **左栏**：120px 头像 · 名字 · bio · 招募 banner · research tags · 图标行
- **右栏**：3 个 highlight cards，带 border
  - Latest Paper · RAGEN-2
  - Latest News · David Ondrej Podcast
  - Latest Award · Outstanding Paper @ NeurIPS 2025 LAW
- **Research Interest section 删除**，内容压缩为左栏 bio 下方的 tag pills
- **头像尺寸**：200px → 120px

---

## 4. Research Tags 交互（追加需求）

用户要求 tags 可以点击，显示相关论文。实现：

- 点击 tag → popover 弹出论文列表（标题 + venue + 链接）
- 再次点击 / 点击外部 → 关闭
- 选中 tag 显示为紫底白字

**论文分配：**

| Tag | 论文 |
|-----|------|
| Agentic RL | RAGEN-2, VAGEN, UFO, RAGEN, MINT |
| MoE | Chain-of-Experts, ESFT, DeepSeek-V2 |
| Long-Context | T*, MindCube |
| Multimodal | MindCube, VAGEN, T* |

---

## 5. 实现总结

### 修改的文件

**`stylesheet.css`**（完全重写）
- Inter 字体替换 Lato
- CSS 变量双主题：`:root` + `html[data-theme="dark"]`
- Hero 两栏 grid 布局，响应式（860px 折叠）
- Research tag pills + popover 样式
- Highlight cards、结构化 talks list、navbar backdrop-filter
- 深色模式：`--bg: #0f0f0f`, `--text: #ececec`, `--purple: #8b7df0`

**`index.html`**（结构性重构）
- `<head>` 加 theme init script（避免首屏闪烁）
- Navbar：加 dark toggle + Blog 链接，移除 Service
- Hero 两栏：bio-left（头像行 + bio + 招募 + tags + icons） + hero-right（3 个 highlight cards）
- Bio 加 LinkedIn 图标
- Research Interest section 删除
- Talks 改为 `.talk-list` 结构化格式
- 底部 JS 新增：theme toggle + research tag popover 逻辑

**`blog.html`**（新建）
- 共享 navbar + stylesheet
- 占位文章："RAGEN Roadmap — Where Agentic RL is Headed"

**`tests/site.spec.js`**（3 → 8 个测试）

新增测试：
1. Dark mode toggle 切换 + localStorage 持久化
2. Hero 3 个 highlight cards 在第一屏可见（viewport 1280×800）
3. Bio 图标包含 LinkedIn 链接
4. Research tag 点击 → popover 显示 → 再次点击关闭
5. Blog 页面加载 + 共享 navbar

---

## 6. 测试结果

```
8 passed (4.2s)
  ✓ hamburger opens and closes the nav
  ✓ news shows 8 items by default, show more reveals rest
  ✓ publication filter shows only matching cards
  ✓ dark mode toggle switches theme and persists
  ✓ hero has 3 highlight cards visible without scrolling
  ✓ bio icons include LinkedIn link
  ✓ research tag click opens popover with papers
  ✓ blog page loads and has shared navbar
```

运行：`npx playwright test`
本地预览：`python3 -m http.server 8502` → `http://localhost:8502`

---

## 7. 待办 / Out of Scope

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

## 8. 设计一致性提示

如果后续要扩展，以下设计语言需保持一致：

- **色彩**：紫色 `#5b4dd6` 只作 accent，不做色块；灰阶层级 `--text` / `--text-muted` / `--text-faint`
- **边框**：`1px solid var(--border)`，圆角 pill 用 `border-radius: 999px`
- **字号层级**：h2 14px uppercase · body 13.5–15px · meta 11.5–12.5px
- **交互 hover**：文字变紫 + 背景 `--purple-glow`，border 变紫
- **标签/按钮**：都是 pill 形（`border-radius: 999px`），无实心填充（active 状态除外）

---

*Last updated: 2026-04-10*
