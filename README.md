# 儿童数学思维练习 App

一个专为儿童设计的数学思维训练应用，支持 iPad 安装使用。

## 📱 技术栈

- **前端框架**: Vue 3 + TypeScript
- **状态管理**: Pinia
- **跨平台**: Capacitor
- **构建工具**: Vite
- **目标平台**: iOS (iPad), Android, Web

## 🚀 快速开始

### 1. 安装依赖

```bash
cd math-kids
npm install
```

### 2. 开发预览

```bash
npm run dev
```

访问 http://localhost:3000 预览

### 3. 构建生产版本

```bash
npm run build
```

### 4. 添加 iOS 平台

```bash
npm run cap:add
```

### 5. 同步到 iOS

```bash
npm run cap:sync
```

### 6. 在 Xcode 中打开

```bash
npx cap open ios
```

## 📂 项目结构

```
math-kids/
├── public/                 # 静态资源
├── src/
│   ├── assets/           # CSS、图标等资源
│   ├── components/      # 可复用组件
│   ├── router/          # 路由配置
│   ├── stores/           # Pinia 状态管理
│   └── views/           # 页面视图
│       ├── Home/        # 首页
│       ├── Addition/    # 加减法练习
│       ├── Compare/     # 比大小练习
│       ├── Pattern/    # 找规律练习
│       └── Game/       # 趣味游戏
├── capacitor.config.ts   # Capacitor 配置
└── vite.config.ts       # Vite 配置
```

## 🎮 功能模块

1. **加减法练习** - 三个难度级别
2. **比大小** - 比较数字大小
3. **找规律** - 发现数列规律
4. **趣味游戏** - 更多游戏开发中

## 📋 版本生成说明

如需快速生成不同版本，修改以下配置：

1. `capacitor.config.ts` 中的 `appId` 和 `appName`
2. `public/manifest.json` 中的应用信息
3. `src/views/Home/HomeView.vue` 中的模块配置

## 🔧 多平台构建

### iOS (需要 macOS 和 Xcode)

```bash
npm run build
npm run cap:add ios
npm run cap:sync ios
npx cap open ios
```

### Android

```bash
npm run build
npm run cap:add android
npm run cap:sync android
npx cap open android
```

## 📝 许可证

MIT
