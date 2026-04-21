# 儿童数学思维练习 App

一个专为儿童设计的数学思维训练应用，支持 iPad 安装使用，采用游戏化学习方式，让孩
子在趣味互动中提升数学能力。

## 📱 技术架构

### 核心技术栈

| 技术           | 说明                       | 用途                 |
| -------------- | -------------------------- | -------------------- |
| **Vue 3**      | 渐进式 JavaScript 框架     | 组件化 UI 开发       |
| **TypeScript** | 类型安全的 JavaScript 超集 | 代码质量和可维护性   |
| **Vite**       | 下一代前端构建工具         | 快速开发热更新       |
| **Pinia**      | Vue 状态管理库             | 全局状态管理         |
| **Capacitor**  | 跨平台原生桥梁             | iOS/Android 原生打包 |
| **Three.js**   | 3D 图形库                  | 3D 交互场景渲染      |
| **Vue Router** | Vue 官方路由               | 页面导航             |

### 架构特点

```
┌─────────────────────────────────────────────────┐
│                   Web Layer                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │  Views  │ │Components│ │ Router  │ │ Stores  │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
│       └──────────┬┴──────────┬┴───────────┘      │
├─────────────────┼───────────┼────────────────────┤
│                 ▼           ▼                    │
│          ┌──────────┐ ┌──────────┐               │
│          │  Three.js │ │   SVG    │  渲染引擎    │
│          └──────────┘ └──────────┘               │
├─────────────────────────────────────────────────┤
│              Capacitor Bridge                     │
├─────────────────────────────────────────────────┤
│          ┌──────────┐ ┌──────────┐               │
│          │   iOS    │ │ Android  │  原生平台     │
│          └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────┘
```

## 🎮 功能模块

### 1. 首页 (Home)

- 模块入口展示
- 学习进度统计
- 每日打卡激励

### 2. 加减法练习 (Addition)

- **凑十法**：通过游戏帮助理解 10 的组成
- **破十法**：分解减法便于计算
- 难度分级：初级(5 以内) → 中级(10 以内) → 高级(20 以内)
- 动态生成题目
- 即时反馈动画效果

### 3. 比大小练习 (Compare)

- 数字对比训练
- 货币面值比较
- 可视化数量对比

### 4. 找规律练习 (Pattern)

- 图形规律识别
- 数字序列规律
- 思维拓展训练

### 5. 钱币练习 (MoneyGame) ⭐

**超市购物场景** - 3D 交互式学习体验：

```
入口 ──点击走动──→ 水果区/零食区 ──结算──→ 收银台
```

**核心功能**：

- Three.js 3D 超市场景渲染
- 点击交互式行走
- 货架商品展示
- 卡通人民币支付练习
- 凑十法/破十法应用

**3D 场景特性**：

- 真实超市通道设计
- 左右低矮货架布局
- 商品价格标签
- 超市灯光效果
- 角色行走动画

### 6. 趣味游戏 (Game)

- 更多游戏开发中
- 游戏化积分系统

## 🛠 技术实现细节

### Three.js 3D 场景 (ThreeScene.vue)

```typescript
// 核心组件
- Scene: 3D场景容器
- PerspectiveCamera: 透视相机模拟人眼视角
- WebGLRenderer: WebGL渲染器
- DirectionalLight: 主光源
- AmbientLight: 环境光
- PointLight: 点光源(超市灯光)

// 3D对象
- BoxGeometry: 货架、商品几何体
- PlaneGeometry: 地板、天花板
- CylinderGeometry: 角色身体
- SphereGeometry: 角色头部
```

### SVG 矢量图形

- 卡通人民币设计
- 超市背景场景
- 收银台显示屏
- 商品图标

### 状态管理 (Pinia)

```typescript
// 游戏状态
- questions: 题目数据
- currentIndex: 当前进度
- score: 得分统计
- gameMode: 游戏模式
- gamePhase: 场景阶段
```

## 📂 项目结构

```
math-kids/
├── public/
│   ├── favicon.ico
│   └── manifest.json          # PWA配置
├── src/
│   ├── assets/
│   │   └── main.css            # 全局样式
│   ├── components/
│   │   └── ThreeScene.vue      # 3D超市场景
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── stores/
│   │   └── game.ts             # Pinia状态
│   ├── views/
│   │   ├── Home/
│   │   │   └── HomeView.vue    # 首页
│   │   ├── Addition/
│   │   │   └── AdditionView.vue # 加法练习
│   │   ├── Compare/
│   │   │   └── CompareView.vue # 比大小
│   │   ├── Pattern/
│   │   │   └── PatternView.vue # 找规律
│   │   ├── MoneyGame/
│   │   │   └── MoneyGameView.vue # 钱币练习
│   │   └── Game/
│   │       └── GameView.vue    # 趣味游戏
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── capacitor.config.ts         # Capacitor配置
├── vite.config.ts              # Vite配置
├── tsconfig.json               # TypeScript配置
└── package.json                # 依赖管理
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/yezidegithub/math-game.git
cd math-game

# 安装依赖
npm install

# 开发预览
npm run dev

# 构建生产版本
npm run build
```

### 跨平台构建

```bash
# 添加iOS平台
npm run cap:add ios

# 同步到iOS
npm run cap:sync ios

# 打开Xcode
npx cap open ios
```

### Android 构建

```bash
# 添加Android平台
npm run cap:add android

# 同步到Android
npm run cap:sync android

# 打开Android Studio
npx cap open android
```

## 📋 版本生成说明

快速生成不同版本的应用：

1. 修改 `capacitor.config.ts` 中的 `appId` 和 `appName`
2. 修改 `public/manifest.json` 中的应用信息
3. 修改 `src/views/Home/HomeView.vue` 中的模块配置
4. 重新构建即可生成新版本

## 🔧 技术亮点

1. **3D 交互场景**：使用 Three.js 实现沉浸式购物体验
2. **响应式设计**：适配 iPad 及各种移动设备
3. **游戏化学习**：动画反馈、积分系统激励学习
4. **跨平台支持**：一次开发，多平台部署
5. **PWA 支持**：可添加到 iPad 主屏幕，类似原生应用

## 📄 许可证

MIT License

## 👨‍💻 作者

[yezidegithub](https://github.com/yezidegithub)
