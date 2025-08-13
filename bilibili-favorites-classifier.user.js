// ==UserScript==
// @name         Bilibili 收藏夹 AI 分类助手 (新版UI)
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  利用AI（GPT）智能、批量地整理Bilibili收藏夹，采用全新的悬浮按钮和侧滑面板UI，提供流畅的交互体验，支持多源收藏夹。
// @author       Roo
// @match        *://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @resource     css ./style.css
// @connect      *
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 注入CSS样式
    try {
        const css = GM_getResourceText('css');
        GM_addStyle(css);
    } catch (error) {
        console.warn('Failed to load external CSS, using fallback styles:', error);
        // 如果无法加载外部CSS，使用内联样式作为备用
        GM_addStyle(`
            // 如果无法加载外部CSS，使用内联样式作为备用
            GM_addStyle(`
                /* 悬浮操作按钮 (FAB) */
                #bfc-fab {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background-color: #fb7299; /* B站粉色 */
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    z-index: 10000;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    opacity: 0.8;
                }

                #bfc-fab:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                #bfc-fab span {
                    font-size: 24px;
                    color: white;
                    transition: transform 0.3s ease;
                }

                #bfc-fab.active {
                    transform: rotate(360deg);
                }

                #bfc-settings-view {
                    padding: 20px;
                    border-top: 1px solid #e3e5e7;
                    background-color: #fff;
                }

                .bfc-hidden {
                    display: none !important;
                }

                #bfc-panel {
                    position: fixed;
                    top: 0;
                    right: -360px;
                    width: 350px;
                    height: 100%;
                    background-color: #f4f5f7;
                    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                    z-index: 9999;
                    transition: right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid #e3e5e7;
                }

                #bfc-panel.active {
                    right: 0;
                }

                .bfc-panel-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid #e3e5e7;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .bfc-panel-header h2 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a1a1a;
                }
                .bfc-panel-header .icons span {
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: 15px;
                    color: #666;
                }

                .bfc-panel-body {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                }

                .bfc-panel-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #e3e5e7;
                    background-color: #fff;
                    font-size: 12px;
                    color: #999;
                }

                .bfc-form-group {
                    margin-bottom: 20px;
                }
                .bfc-form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                }
                .bfc-select, .bfc-input, .bfc-button {
                    width: 100%;
                    padding: 10px;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                    box-sizing: border-box;
                }

                .bfc-checkbox-group {
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 10px;
                    height: 120px;
                    overflow-y: auto;
                }

                .bfc-checkbox-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .bfc-checkbox-item input[type="checkbox"] {
                    margin-right: 8px;
                }

                .bfc-checkbox-item label {
                    font-weight: normal;
                    font-size: 14px;
                    cursor: pointer;
                    flex-grow: 1;
                }

                .bfc-button {
                    background-color: #fb7299;
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .bfc-button:hover {
                    background-color: #e56a8a;
                }

                .bfc-log-item {
                    padding: 8px;
                    border-bottom: 1px solid #eee;
                    font-size: 13px;
                }
                .bfc-log-item.success { color: #28a745; }
                .bfc-log-item.error { color: #dc3545; }
                .bfc-log-item.info { color: #17a2b8; }

                #bfc-batch-create-btn {
                    background-color: #00a1d6; /* B站蓝 */
                    color: white;
                    border: none;
                    cursor: pointer;
                    margin-top: 10px; /* 与上一个按钮的间距 */
                    transition: background-color 0.3s, opacity 0.3s;
                }
                #bfc-batch-create-btn:hover {
                    background-color: #00b5e5;
                }
                #bfc-batch-create-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `);
    }

    // 动态导入模块并初始化应用
    import('./main.js')
        .then(({ App }) => {
            App.init();
        })
        .catch(error => {
            console.error('Failed to load modules:', error);
            // 如果模块加载失败，可以在这里添加备用逻辑
        });

})();