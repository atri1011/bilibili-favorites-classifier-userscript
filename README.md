# Bilibili 收藏夹 AI 分类助手 - 模块化版本

[![Install](https://img.shields.io/badge/Install-Userscript-brightgreen?style=for-the-badge&logo=tampermonkey)](https://github.com/atri1011/bilibili-favorites-classifier-userscript/raw/main/bilibili-favorites-classifier-es5-compatible.user.js)

## 🚀 快速安装

### 一键安装（推荐）
点击上方的 **Install** 按钮，或者直接点击下面的链接：

**[📥 点击安装 - ES5兼容版本（推荐）](https://github.com/atri1011/bilibili-favorites-classifier-userscript/raw/main/bilibili-favorites-classifier-es5-compatible.user.js)**

**[📥 点击安装 - 完整模块化版本](https://github.com/atri1011/bilibili-favorites-classifier-userscript/raw/main/bilibili-favorites-classifier-modular.user.js)**

**[📥 点击安装 - ES6模块版本（实验性）](https://github.com/atri1011/bilibili-favorites-classifier-userscript/raw/main/bilibili-favorites-classifier.user.js)**

### 安装要求
- 需要安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他用户脚本管理器
- 支持 Chrome、Firefox、Edge 等主流浏览器

### 安装步骤
1. 确保已安装 Tampermonkey 扩展
2. 点击上方的安装链接
3. 在弹出的页面中点击"安装"按钮
4. 访问 [bilibili.com](https://www.bilibili.com) 开始使用

## 📁 项目结构

```
src/
├── constants.js                           # 常量定义
├── api.js                                # Bilibili API 接口
├── ai.js                                 # AI 分类服务
├── batch-creator.js                      # 批量创建收藏夹
├── ui.js                                 # UI 管理器
├── main.js                               # 主应用逻辑
├── style.css                             # 样式文件
├── bilibili-favorites-classifier.user.js # ES6 模块版本（实验性）
├── bilibili-favorites-classifier-modular.user.js # 完整模块化版本
├── bilibili-favorites-classifier-es5-compatible.user.js # ES5兼容版本
└── README.md                             # 本文档
```

## 🔧 模块说明

### 📊 constants.js
存放应用常量，包括：
- `RECOMMENDED_FOLDERS`: 推荐的收藏夹分类列表

### 🌐 api.js
封装 Bilibili API 接口，包括：
- `getAllFavorites()`: 获取用户所有收藏夹
- `getFavoriteVideos()`: 获取收藏夹中的视频
- `moveVideo()`: 移动视频到指定收藏夹
- `createFolder()`: 创建新收藏夹

### 🤖 ai.js
AI 分类服务模块，包括：
- `classify()`: 视频分类主方法
- `_callZhipuAI()`: 智谱AI API 调用
- 支持 OpenAI 和智谱AI 两种服务商

### 📦 batch-creator.js
批量创建收藏夹功能：
- `start()`: 一键创建推荐收藏夹列表

### 🎨 ui.js
UI 管理器，负责界面相关操作：
- DOM 元素注入和管理
- 事件监听器设置
- 用户输入处理
- 日志显示

### 🚀 main.js
主应用逻辑：
- 应用初始化
- 分类任务执行
- 视频移动处理

### 💄 style.css
所有 CSS 样式定义

## 📋 使用方式

### 方式一：使用ES5兼容版本（强烈推荐）
直接使用 `bilibili-favorites-classifier-es5-compatible.user.js`，这个文件是专门为解决ES6模块不兼容油猴的问题而创建的，使用ES5语法，完全兼容油猴环境。

### 方式二：使用完整模块化版本
使用 `bilibili-favorites-classifier-modular.user.js`，这个文件包含了所有模块的代码，适合用户脚本环境。

### 方式三：使用 ES6 模块版本（实验性）
使用 `bilibili-favorites-classifier.user.js`，这个版本使用 ES6 模块导入，但可能在某些用户脚本环境中不兼容。

## ⚠️ ES6模块兼容性问题说明

### 问题描述
ES6模块语法（import/export）在油猴（Tampermonkey）等用户脚本环境中存在兼容性问题，主要原因包括：
1. 油猴脚本运行在特殊的沙箱环境中，不完全支持ES6模块系统
2. 缺失的模块文件会导致脚本无法正常运行
3. 模块加载顺序和依赖管理在用户脚本环境中可能存在问题

### 解决方案
我们提供了三种解决方案：

#### 1. ES5兼容版本（推荐）
- **文件名**: `bilibili-favorites-classifier-es5-compatible.user.js`
- **特点**:
  - 使用ES5语法重写，完全兼容油猴环境
  - 所有模块代码合并到单个文件中
  - 移除了所有import/export语法
  - 使用传统的函数声明和变量定义
- **适用场景**: 所有油猴用户，特别是遇到ES6兼容性问题的用户

#### 2. 完整模块化版本
- **文件名**: `bilibili-favorites-classifier-modular.user.js`
- **特点**:
  - 包含所有模块代码的单文件版本
  - 使用ES6语法但在单个文件中
  - 适合大多数用户脚本环境
- **适用场景**: 大多数油猴用户，喜欢模块化代码结构的用户

#### 3. ES6模块版本（实验性）
- **文件名**: `bilibili-favorites-classifier.user.js`
- **特点**:
  - 使用ES6模块语法
  - 需要外部模块文件支持
  - 可能在某些环境中不兼容
- **适用场景**: 开发环境或支持ES6模块的高级用户脚本环境

### 版本选择建议
- **普通用户**: 选择ES5兼容版本，确保最佳兼容性
- **开发者**: 可以尝试ES6模块版本进行开发，但部署时建议使用ES5兼容版本
- **遇到问题的用户**: 如果其他版本无法正常工作，请切换到ES5兼容版本

## ✨ 模块化优势

1. **代码分离**: 每个模块职责单一，便于维护
2. **可复用性**: 模块可以独立测试和复用
3. **可扩展性**: 新功能可以作为独立模块添加
4. **可读性**: 代码结构清晰，易于理解

## 🔄 从原版本迁移

原版本的单文件 `bilibili-favorites-classifier.user.js` 已经被拆分为多个模块。如果你想继续使用单文件版本，可以使用 `bilibili-favorites-classifier-modular.user.js`，它包含了所有功能但采用了模块化的代码结构。

## 🛠️ 开发说明

- 每个模块都使用 ES6 的 `export` 语法导出
- 模块间通过 `import` 进行依赖管理
- UI 模块通过回调函数与其他模块解耦
- 所有模块都保持了原有的功能完整性

## 📝 更新日志

### v1.3.1 - ES6模块兼容性修复
- ✅ 修复了ES6模块不兼容油猴的问题
- ✅ 创建了ES5兼容版本，完全兼容油猴环境
- ✅ 添加了缺失的ui.js模块文件
- ✅ 更新了文档，详细说明了版本选择建议
- ✅ 提供了三种版本选择，满足不同用户需求

### v1.3.0 - 模块化重构
- ✅ 将单文件拆分为多个功能模块
- ✅ 创建了两个版本：ES6 模块版本和完整模块化版本
- ✅ 保持了所有原有功能
- ✅ 改进了代码结构和可维护性