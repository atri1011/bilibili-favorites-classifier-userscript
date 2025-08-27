import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'Bilibili 收藏夹 AI 分类助手 (Vue)',
        namespace: 'http://tampermonkey.net/',
        version: '2.0.0',
        description: '利用AI（GPT）智能、批量地整理Bilibili收藏夹，采用全新的悬浮按钮和侧滑面板UI，提供流畅的交互体验，支持多源收藏夹。',
        author: 'Roo',
        match: [
            '*://space.bilibili.com/*',
            '*://www.bilibili.com/video/*'
        ],
        icon: 'https://www.bilibili.com/favicon.ico',
        connect: ['api.bilibili.com', 'open.bigmodel.cn', '*'],
        grant: [
            'GM_addStyle',
            'GM_xmlhttpRequest',
            'GM_setValue',
            'GM_getValue'
        ],
        license: 'MIT',
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
          pinia: cdn.jsdelivr('Pinia', 'dist/pinia.iife.prod.js'),
        },
      },
    }),
  ],
});