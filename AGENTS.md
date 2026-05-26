# AGENTS.md — 魔方纹韵项目指南

> 本文件面向 AI 编程助手。如果你正在阅读此文件，说明你需要了解、修改或扩展本项目。请在下笔前先通读全文。

---

## 项目概览

**魔方纹韵**（cube-pattern）是一个将 GAN 智能魔方与中国传统纹样创作相结合的创意平台。

核心功能：
- 在画布上添加 8 种经典中国传统纹样（回纹、云纹、雷纹、如意纹、方胜纹、盘长纹、万字纹、连续纹）
- 通过 Web Bluetooth 连接 GAN 356 i3 等智能魔方，转动魔方实时变换画布上的纹样元素
- 调用阿里云百炼平台的千问图像生成 API（qwen-image-2.0-pro），将画布图案生成到 6 种应用场景（帽子、杯子、头像、T恤、海报、手机壳）

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15（App Router） |
| UI 库 | React 19 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 + `tw-animate-css` |
| 组件库 | shadcn/ui（基于 Radix UI） |
| 状态管理 | Zustand 5 |
| 图标 | Lucide React |
| 魔方连接 | `gan-web-bluetooth` + Web Bluetooth API |
| AI 生成 | 阿里云 DashScope 千问图像 API（`qwen-image-2.0-pro`） |
| 字体 | Geist / Geist Mono（Google Fonts） |

---

## 目录结构

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # 首页（中式门环入口动画）
│   │   ├── create/page.tsx       # 核心创作页面（三栏布局）
│   │   ├── api/generate/route.ts # AI 图像生成 API 路由
│   │   ├── layout.tsx            # 根布局（含字体、Toaster）
│   │   ├── globals.css           # 全局样式 + Tailwind 主题变量
│   │   ├── chinese-architecture.css  # 中式建筑风格主题类
│   │   └── create/chinese-architecture.css
│   ├── components/
│   │   ├── patterns/             # 业务组件
│   │   │   ├── PatternCanvas.tsx      # HTML5 Canvas 画布（核心渲染）
│   │   │   ├── PatternSelector.tsx    # 左侧纹样选择面板
│   │   │   ├── ElementEditor.tsx      # 右侧元素属性编辑器
│   │   │   ├── SceneSelector.tsx      # 右侧 AI 生成场景选择
│   │   │   ├── TopBanner.tsx          # 顶部 Banner（含蓝牙连接按钮）
│   │   │   └── CubeConnectionPanel.tsx# 魔方连接面板（当前未挂载到主页面）
│   │   └── ui/                   # shadcn/ui 基础组件
│   │       ├── button.tsx, card.tsx, input.tsx, label.tsx
│   │       ├── slider.tsx, switch.tsx, tabs.tsx, badge.tsx
│   │       └── toast.tsx, toaster.tsx
│   ├── hooks/
│   │   └── use-cube-connection-hybrid-new.ts  # 蓝牙连接 Hook
│   ├── lib/
│   │   ├── pattern-drawers.ts    # 8 种纹样的 Canvas 绘制函数
│   │   └── utils.ts              # cn() 工具函数（clsx + tailwind-merge）
│   ├── store/
│   │   └── pattern-store.ts      # Zustand 全局状态
│   ├── types/
│   │   └── pattern.ts            # 核心类型定义 + 常量配置
│   └── images/
│       └── 1.jpg                 # 首页魔方图片
├── public/
│   └── images/                   # 静态图片资源
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts            # Tailwind v4 配置（内容扫描路径）
├── postcss.config.mjs
├── .env.local                    # 环境变量（DASHSCOPE_API_KEY）
├── setup.md                      # 环境安装指南（面向开发者）
├── bluetooth_fix.md              # 蓝牙连接问题修复记录
└── ali.md                        # 阿里云千问图像 API 文档（原始副本）
```

---

## 构建与运行命令

```bash
# 安装依赖
npm install

# 开发服务器（http://localhost:3000）
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查（ESLint）
npm run lint
```

**环境要求：**
- Node.js >= 18.17.0
- 浏览器要求：支持 Web Bluetooth API（Chrome、Edge 等），且必须在 `localhost` 或 `HTTPS` 环境下运行蓝牙功能。

---

## 代码风格与开发约定

### 语言与命名
- **项目内所有 UI 文本、注释、文档均使用中文。**新增代码的注释也应优先使用中文。
- 文件命名：组件使用 PascalCase（如 `PatternCanvas.tsx`），工具文件使用 kebab-case（如 `pattern-drawers.ts`）。
- 路径别名：统一使用 `@/` 指向 `src/` 目录。

### 组件规范
- 使用 React 函数组件 + Hooks。
- 需要客户端交互的组件必须在文件顶部添加 `'use client'`。
- shadcn/ui 组件放在 `src/components/ui/`，业务组件放在 `src/components/patterns/`。
- 样式优先使用 Tailwind CSS 工具类；中式主题的特殊样式（如红金配色、窗棂纹理）使用 `chinese-xxx` 自定义 CSS 类，定义在 `chinese-architecture.css` 或 `globals.css` 中。

### TypeScript
- `tsconfig.json` 启用 `strict: true`。
- 类型定义集中放在 `src/types/pattern.ts`。
- 优先使用 `interface` 定义对象类型。

### 状态管理
- 全局状态统一使用 `src/store/pattern-store.ts` 中的 Zustand store。
- 组件中通过 `usePatternStore(selector)` 或 `usePatternStore.getState()` / `usePatternStore.setState()` 访问状态。
- 避免在组件中创建局部状态来存储本应全局共享的数据（如元素列表、选中元素 ID、魔方连接状态）。

### Canvas 渲染
- 纹样绘制使用原生 Canvas 2D API，位于 `src/lib/pattern-drawers.ts`。
- 每种纹样是一个纯函数，接收 `DrawContext` 对象，自行管理 `ctx.save()` / `ctx.restore()`。
- 变换（旋转、缩放、镜像、倾斜）通过 `applyTransform()` 统一应用到 Canvas 上下文。

---

## 测试说明

**当前项目未配置任何测试框架。**

没有 Jest、Vitest、Playwright 或 Cypress 的配置。如需添加测试：
- 单元测试推荐 Vitest（与 Next.js + TypeScript 集成较好）
- E2E 测试推荐 Playwright（可测试 Canvas 交互和蓝牙流程的降级逻辑）

---

## 安全与敏感信息

### 环境变量
- `DASHSCOPE_API_KEY`：阿里云百炼平台 API Key，用于 AI 图像生成。**必须配置在 `.env.local` 中。**
- 该变量仅在服务端 API 路由（`src/app/api/generate/route.ts`）中读取，不会暴露到前端。

### 蓝牙连接
- 当前 `src/hooks/use-cube-connection-hybrid-new.ts` 中**硬编码了一个魔方 MAC 地址**（`AB:12:34:5F:B0:BE`）作为 `connectGanCube` 的回调返回值。
- Web Bluetooth API 受浏览器安全策略限制：必须在用户手势（如点击按钮）后调用，且仅在 `localhost` 或 `HTTPS` 环境下可用。

### API 调用
- AI 生成接口直接调用阿里云 DashScope 官方端点（`https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`）。
- 请求体中包含用户上传的画布截图（Base64 PNG），服务端会将其和提示词一同发送到千问模型。

---

## 关键模块详解

### 1. 纹样系统（`src/types/pattern.ts` + `src/lib/pattern-drawers.ts`）
- 定义了 8 种 `PatternType` 及其配置（名称、描述、默认颜色、复杂度）。
- `DEFAULT_MAPPING_RULES` 定义了魔方 6 个面（U/R/F/D/L/B）对应的默认变换规则。
- `pattern-drawers.ts` 中的 `drawElement()` 是统一入口，负责将 `PatternElement` 渲染到 Canvas。

### 2. 魔方连接（`src/hooks/use-cube-connection-hybrid-new.ts`）
- 动态导入 `gan-web-bluetooth` 以减小初始加载体积。
- 订阅魔方事件流（`events$`），处理 `MOVE` / `BATTERY` / `HARDWARE` / `DISCONNECT` 四种事件。
- 收到 `MOVE` 事件后，调用 store 的 `applyCubeMove()`，根据当前映射规则对**当前选中的元素**施加变换。
- **注意**：`applyCubeMove` 的实现逻辑是**创建一个新元素副本**并添加到画布，而非修改原元素。

### 3. 画布（`src/components/patterns/PatternCanvas.tsx`）
- 使用 `useRef<HTMLCanvasElement>` + `useEffect` 驱动渲染。
- 背景为宣纸色（`#faf8f5`）+ 网格线。
- 支持点击选中、拖拽移动元素。
- 选中元素显示蓝色虚线框。

### 4. AI 生成 API（`src/app/api/generate/route.ts`）
- 接收 `imageData`（Base64 PNG）、`scene`（场景类型）、`prompt`（用户补充描述）。
- 自动拼接中文提示词模板，调用 `qwen-image-2.0-pro`。
- 将返回的临时图片 URL 下载后转为 Base64，再返回给前端（避免 24 小时链接过期问题）。

---

## 样式体系

### Tailwind CSS v4
- 使用 `@import "tailwindcss"` 和 `@theme inline` 定义 CSS 变量主题。
- 颜色体系基于 `oklch`，支持 `.dark` 模式（虽然项目当前未显式使用 dark 切换）。

### 中式主题
- 主色调：深红（`#6b1a1a`）、金色（`#d4af37` / `#f5e6a3`）、米白（`#f5f5dc`）。
- 常用类名：
  - `.chinese-wall-bg` — 深红墙面背景
  - `.chinese-eaves` — 金色琉璃瓦屋檐
  - `.chinese-lattice` — 窗棂纹理
  - `.chinese-card-dark` — 深色半透明卡片
  - `.chinese-text-gold` — 金色文字
  - `.chinese-text-light` — 浅色文字
  - `.chinese-border` — 渐变边框
  - `.chinese-shadow` — 中式阴影
  - `.card-hover` — 卡片悬停上浮效果
  - `.btn-click` — 按钮点击缩放效果

---

## 已知注意事项

1. **MAC 地址硬编码**：蓝牙 Hook 中写死了 MAC 地址，若更换魔方设备需要修改该值。
2. **组件挂载情况**：`CubeConnectionPanel.tsx` 当前存在于代码库中，但主页面（`create/page.tsx`）实际使用的是 `TopBanner.tsx` 来处理蓝牙连接 UI。修改蓝牙相关 UI 时请注意两者可能不同步。
3. **废弃文件**：项目根目录和组件目录中存在一些备份/废弃文件，如 `page-new.tsx`、`elementeditor.tsx.new`、早期版本的 `use-cube-connection-*.ts`（已在迭代中被 `use-cube-connection-hybrid-new.ts` 取代）。修改时应以当前被 import 的文件为准。
4. **无测试覆盖**：修改核心绘制逻辑（`pattern-drawers.ts`）或状态逻辑（`pattern-store.ts`）时，建议手动在浏览器中验证画布渲染和魔方映射行为。
5. **`.z-ai-config`**：该文件似乎是一个通用的 AI SDK 配置模板，但项目实际并未读取它；AI 相关配置以 `.env.local` 中的 `DASHSCOPE_API_KEY` 为准。

---

## 扩展建议

- **新增纹样**：在 `src/types/pattern.ts` 的 `PATTERN_CONFIGS` 和 `PatternType` 中添加类型与配置，然后在 `src/lib/pattern-drawers.ts` 中实现对应的 `drawXxx()` 函数，并注册到 `patternDrawers` 映射表中。
- **新增场景**：在 `src/types/pattern.ts` 的 `SCENE_CONFIGS` 和 `SceneType` 中添加，同时在 `src/app/api/generate/route.ts` 的 `sceneDescriptions` 中添加对应的提示词描述。
- **修改魔方映射规则**：直接修改 `src/types/pattern.ts` 中的 `DEFAULT_MAPPING_RULES`，或在 UI 中提供规则编辑功能（需扩展 store 的 `updateMappingRule`）。
