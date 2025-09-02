import './style.css';
import { createPinia } from 'pinia';
import AppCoordinator from './services/AppCoordinator.js';

// 1. 初始化 Pinia
const pinia = createPinia();

// 创建一个临时的 Vue 应用来初始化 Pinia
const tempDiv = document.createElement('div');
tempDiv.style.display = 'none';
document.body.appendChild(tempDiv);

// 使用全局 Vue 对象（通过 vite-plugin-monkey 的 externalGlobals 配置）
const { createApp } = Vue;
const app = createApp({});
app.use(pinia);
app.mount(tempDiv);

// 保存 Pinia 实例供其他地方使用
window.__bfc_pinia = pinia;


// 2. 初始化应用协调器
// 使用立即执行异步函数来初始化应用
(async () => {
    AppCoordinator.init();
})();