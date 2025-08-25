# 项目完成清单

## 功能: 自动获取可用模型

- [x] **后端集成**: 在 `src/api.js` 中添加了 `AIAPI.getModels` 函数，用于调用 `/v1/models` 端点获取模型列表。
- [x] **状态管理**: 更新了 `src/stores/settingsStore.js`，增加了用于存储可用模型和加载状态的 state，并创建了 `fetchModels` action 来处理数据获取逻辑。
- [x] **UI 实现**: 修改了 `src/components/SettingsView.vue`，实现了以下功能：
  - [x] 当用户点击“自定义模型名称”输入框时，触发模型列表的获取。
  - [x] 使用 `<datalist>` 元素向用户展示可用的模型作为输入建议。
  - [x] 在数据加载过程中显示“加载中...”提示，提升用户体验。
- [x] **代码重构**: 将 `SettingsView.vue` 的脚本部分重构为 Vue 3 的 `<script setup>` 语法，使其更现代化、更易于维护。
- [x] **兼容性**: 确保了对 `src/api.js` 的修改不会破坏应用中现有的代码依赖。