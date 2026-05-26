# 项目环境配置指南

## ✅ 环境状态

当前环境已配置完成！所有依赖已成功安装。

## 系统要求

- **Node.js**: 版本 >= 18.17.0 (推荐使用 LTS 版本)
- **npm**: 版本 >= 9.0.0 (随 Node.js 一起安装)
- **包管理器**: npm 或 yarn 或 pnpm (本文档以 npm 为例)

## 环境安装步骤

### 1. 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新的 LTS 版本。

安装完成后，在终端中运行以下命令验证安装：

```bash
node --version
npm --version
```

### 2. 安装项目依赖

在项目根目录下运行：

```bash
npm install
```

或者使用 yarn：

```bash
yarn install
```

或者使用 pnpm：

```bash
pnpm install
```

### 3. 运行开发服务器

安装完依赖后，运行以下命令启动开发服务器：

```bash
npm run dev
```

或者：

```bash
yarn dev
```

或者：

```bash
pnpm dev
```

开发服务器将在 `http://localhost:3000` 启动。

## 项目依赖说明

### 核心依赖
- **Next.js**: ^15.0.0 - React 框架
- **React**: ^19.0.0 - UI 库
- **TypeScript**: ^5 - 类型系统

### UI 组件库
- **Radix UI**: 无障碍的 UI 组件库
  - @radix-ui/react-avatar
  - @radix-ui/react-checkbox
  - @radix-ui/react-dialog
  - @radix-ui/react-label
  - @radix-ui/react-select
  - @radix-ui/react-slider
  - @radix-ui/react-slot
  - @radix-ui/react-switch
  - @radix-ui/react-tabs

### 样式相关
- **Tailwind CSS**: ^4 - CSS 框架
- **class-variance-authority**: ^0.7.1 - 组件样式变体管理
- **clsx**: ^2.1.1 - 条件类名工具
- **tailwind-merge**: ^3.3.1 - Tailwind 类名合并
- **tailwindcss-animate**: ^1.0.7 - Tailwind 动画
- **tw-animate-css**: ^1.3.5 - 额外的 Tailwind 动画

### 功能库
- **gan-web-bluetooth**: ^3.0.2 - 魔方蓝牙连接
- **lucide-react**: ^0.525.0 - 图标库
- **zustand**: ^5.0.6 - 状态管理
- **z-ai-web-dev-sdk**: ^0.0.17 - 开发 SDK

### 开发依赖
- **@types/node**: ^20 - Node.js 类型定义
- **@types/react**: ^19 - React 类型定义
- **@types/react-dom**: ^19 - React DOM 类型定义
- **eslint**: ^9 - 代码检查工具
- **eslint-config-next**: ^15.0.0 - Next.js ESLint 配置

## 常见问题

### 依赖安装失败

如果遇到依赖安装问题，可以尝试：

1. 清除 npm 缓存：
```bash
npm cache clean --force
```

2. 删除 node_modules 和 package-lock.json：
```bash
rm -rf node_modules package-lock.json
```

3. 重新安装：
```bash
npm install
```

### 端口冲突

如果 3000 端口被占用，可以指定其他端口：

```bash
npm run dev -- -p 3001
```

### TypeScript 错误

如果遇到 TypeScript 相关错误，确保安装了所有类型定义：

```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行代码检查

## 千问 API 配置

项目使用阿里云千问 qwen-image-2.0-pro 模型进行 AI 图像生成，需要配置 API 密钥。

### 获取 API Key

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 登录后进入 API Key 管理页面
3. 创建或获取您的 API Key

### 配置步骤

#### 方法一：使用环境变量（推荐）

1. 在项目根目录创建 `.env.local` 文件
2. 添加以下内容：
```
DASHSCOPE_API_KEY=your_actual_api_key
```
3. 将 `your_actual_api_key` 替换为您的实际 API Key
4. 保存文件

#### 方法二：使用系统环境变量

在系统环境变量中添加 `DASHSCOPE_API_KEY`，值为您的 API Key。

### API 说明

- **模型**: qwen-image-2.0-pro
- **功能**: 图像生成与编辑
- **图像分辨率**: 1024*1024
- **输出格式**: PNG

详细文档请参考：[千问图像生成 API 文档](https://help.aliyun.com/zh/model-studio/qwen-image-api)

## 注意事项

1. 确保使用 Node.js 18.17.0 或更高版本
2. 首次运行可能需要较长时间安装依赖
3. 开发服务器支持热更新，修改代码后会自动刷新
4. 生产环境部署前请先运行 `npm run build` 构建项目
5. 使用 AI 图像生成功能前，请确保已正确配置千问 API 的 DASHSCOPE_API_KEY
