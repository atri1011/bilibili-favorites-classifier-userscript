# Bilibili 收藏夹 AI 分类助手 - 模块化版本

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

### 方式一：使用完整模块化版本（推荐）
直接使用 `bilibili-favorites-classifier-modular.user.js`，这个文件包含了所有模块的代码，适合用户脚本环境。

### 方式二：使用 ES6 模块版本（实验性）
使用 `bilibili-favorites-classifier.user.js`，这个版本使用 ES6 模块导入，但可能在某些用户脚本环境中不兼容。

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

### v1.3.0 - 模块化重构
- ✅ 将单文件拆分为多个功能模块
- ✅ 创建了两个版本：ES6 模块版本和完整模块化版本
- ✅ 保持了所有原有功能
- ✅ 改进了代码结构和可维护性