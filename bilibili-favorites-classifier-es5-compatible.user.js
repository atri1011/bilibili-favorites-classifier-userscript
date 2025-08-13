// ==UserScript==
// @name         Bilibili 收藏夹 AI 分类助手 (ES5兼容版本)
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  利用AI（GPT）智能、批量地整理Bilibili收藏夹，采用全新的悬浮按钮和侧滑面板UI，提供流畅的交互体验，支持多源收藏夹。ES5兼容版本，解决ES6模块不兼容油猴的问题。
// @author       Roo
// @match        *://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 1. --- 注入CSS样式 ---
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

    // 2. --- 常量模块 ---
    var RECOMMENDED_FOLDERS = [
        '学习 - 方法论与效率', '学习 - 学科知识', '学习 - 语言',
        '科普 - 前沿科技', '科普 - 硬核原理', '科普 - 人文社科', '科普 - 趣味百科',
        '技能 - 编程开发', '技能 - 设计创作', '技能 - 办公软件', '技能 - 生活实用',
        '游戏 - 实况集锦', '游戏 - 攻略教学', '游戏 - 文化杂谈',
        '生活 - 美食探店', '生活 - 萌宠动物', '生活 - 旅行Vlog',
        '娱乐 - 搞笑整活', '娱乐 - 影视动漫', '娱乐 - 音乐'
    ];

    // 3. --- API模块 ---
    var BilibiliAPI = {
        getAllFavorites: function(mid) {
            var url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=' + mid;
            return fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.code === 0 && data.data) {
                        return data.data.list || [];
                    } else if (data.code === 0 && (data.data === null || data.data.list === null)) {
                        return [];
                    } else {
                        throw new Error('获取收藏夹列表失败: ' + data.message);
                    }
                });
        },

        getFavoriteVideos: function(media_id, ps, pageNum) {
            ps = ps || 20;
            pageNum = pageNum || 1;
            var url = 'https://api.bilibili.com/x/v3/fav/resource/list?media_id=' + media_id + '&pn=' + pageNum + '&ps=' + ps + '&order=mtime';
            return fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.code === 0 && data.data) {
                        return {
                            videos: data.data.medias || [],
                            hasMore: data.data.has_more,
                        };
                    }
                    throw new Error('获取收藏夹视频失败 (Code: ' + (data.code || 'N/A') + '): ' + data.message);
                });
        },

        moveVideo: function(resourceId, targetMediaId, fromMediaId, csrf) {
             var url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
             var params = new URLSearchParams();
             params.append('rid', resourceId);
             params.append('type', 2);
             params.append('add_media_ids', targetMediaId);
             params.append('del_media_ids', fromMediaId);
             params.append('csrf', csrf);
             return fetch(url, {
                 method: 'POST',
                 body: params,
                 credentials: 'include',
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
             })
             .then(function(response) {
                 return response.json();
             })
             .then(function(data) {
                 if (data.code !== 0) {
                     throw new Error('移动视频失败: ' + data.message);
                 }
                 return data;
             });
        },

        createFolder: function(name, csrf) {
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.bilibili.com/x/v3/fav/folder/add',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    data: 'title=' + encodeURIComponent(name) + '&public=0&csrf=' + csrf,
                    onload: function(response) {
                        try {
                            var result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result);
                            } else {
                                reject(new Error(result.message || '未知错误'));
                            }
                        } catch (e) {
                            reject(new Error('解析响应失败'));
                        }
                    },
                    onerror: function() {
                        reject(new Error('网络请求失败'));
                    }
                });
            });
        }
    };

    // 4. --- AI分类模块 ---
    var AIClassifier = {
        classify: function(video, targetFolders, apiKey, apiHost, modelName) {
            var aiProvider = GM_getValue('aiProvider', 'openai');
            // 根据AI提供商选择不同的API调用逻辑
            if (aiProvider === 'zhipu') {
                // 调用智谱AI
                return this._callZhipuAI(apiKey, { video: video, targetFolders: targetFolders });
            } else {
                // 调用OpenAI或兼容的API
                return new Promise(function(resolve, reject) {
                    var prompt = [
                        '我有一个B站收藏的视频，信息如下：',
                        '- 标题: "' + video.title + '"',
                        '- 简介: "' + video.intro + '"',
                        '- UP主: "' + video.upper.name + '"',
                        '',
                        '请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。',
                        '目标收藏夹列表:',
                        targetFolders.map(function(f) { return '- ' + f.title; }).join('\n'),
                        '',
                        '请仅返回最合适的收藏夹的名称，不要添加任何多余的解释或标点符号。'
                    ].join('\n');
                    
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: apiHost + '/v1/chat/completions',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + apiKey
                        },
                        data: JSON.stringify({
                            model: modelName,
                            messages: [{ role: "user", content: prompt }],
                            temperature: 0.5,
                        }),
                        onload: function(response) {
                            if (response.status === 200) {
                                try {
                                    var result = JSON.parse(response.responseText);
                                    var folderName = result.choices[0].message.content.trim();
                                    resolve(folderName);
                                } catch (e) {
                                    reject(new Error('解析API响应失败: ' + e.message));
                                }
                            } else {
                                 try {
                                    var errorInfo = JSON.parse(response.responseText);
                                    reject(new Error('API请求失败 (状态: ' + response.status + '): ' + errorInfo.error.message));
                                } catch (e) {
                                    reject(new Error('API请求失败 (状态: ' + response.status + ')，且无法解析错误响应。'));
                                }
                            }
                        },
                        onerror: function(response) {
                            reject(new Error('网络请求错误: ' + response.statusText));
                        }
                    });
                });
            }
        },

        _callZhipuAI: function(apiKey, videoInfo) {
            var _this = this;
            return new Promise(function(resolve, reject) {
                var video = videoInfo.video;
                var targetFolders = videoInfo.targetFolders;
                var prompt = [
                    '我有一个B站收藏的视频，信息如下：',
                    '- 标题: "' + video.title + '"',
                    '- 简介: "' + video.intro + '"',
                    '- UP主: "' + video.upper.name + '"',
                    '',
                    '请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。',
                    '目标收藏夹列表:',
                    targetFolders.map(function(f) { return '- ' + f.title; }).join('\n'),
                    '',
                    '请仅返回最合适的收藏夹的名称，不要添加任何多余的解释或标点符号。'
                ].join('\n');

                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apiKey
                    },
                    data: JSON.stringify({
                        model: "glm-4",
                        messages: [{ role: "user", content: prompt }],
                    }),
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                var result = JSON.parse(response.responseText);
                                if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
                                    var folderName = result.choices[0].message.content.trim();
                                    resolve(folderName);
                                } else {
                                    reject(new Error('API响应格式不正确，缺少有效的回复内容。'));
                                }
                            } catch (e) {
                                reject(new Error('解析API响应失败: ' + e.message));
                            }
                        } else {
                             try {
                                var errorInfo = JSON.parse(response.responseText);
                                reject(new Error('API请求失败 (状态: ' + response.status + '): ' + errorInfo.error.message));
                            } catch (e) {
                                reject(new Error('API请求失败 (状态: ' + response.status + ')，且无法解析错误响应。'));
                            }
                        }
                    },
                    onerror: function(response) {
                        reject(new Error('网络请求错误: ' + response.statusText));
                    }
                });
            });
        }
    };

    // 5. --- 批量创建模块 ---
    var BatchCreator = {
        start: function() {
            var _this = this;
            var btn = document.getElementById('bfc-batch-create-btn');
            if (!btn) return;

            var csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
            if (!csrfMatch) {
                alert('获取CSRF Token失败，请确保您已登录B站。');
                return;
            }
            var csrf = csrfMatch[1];

            if (!confirm('即将创建 ' + RECOMMENDED_FOLDERS.length + ' 个推荐收藏夹，确定吗？')) {
                return;
            }

            btn.disabled = true;
            var successCount = 0;
            var failCount = 0;

            var processNext = function(i) {
                if (i >= RECOMMENDED_FOLDERS.length) {
                    btn.textContent = '一键创建推荐收藏夹';
                    btn.disabled = false;
                    alert('创建完成！\n成功: ' + successCount + '个\n失败: ' + failCount + '个\n\n页面即将刷新以展示新收藏夹。');
                    location.reload();
                    return;
                }

                var name = RECOMMENDED_FOLDERS[i];
                btn.textContent = '创建中 (' + (i + 1) + '/' + RECOMMENDED_FOLDERS.length + ')...';
                BilibiliAPI.createFolder(name, csrf)
                    .then(function() {
                        successCount++;
                        setTimeout(function() { processNext(i + 1); }, 500);
                    })
                    .catch(function(error) {
                        failCount++;
                        console.error('创建收藏夹 "' + name + '" 失败: ' + error.message);
                        setTimeout(function() { processNext(i + 1); }, 500);
                    });
            };

            processNext(0);
        }
    };

    // 6. --- UI管理模块 ---
    var UIManager = {
        init: function(app, batchCreator) {
            this.injectFAB();
            this.injectPanel();
            this.cacheDOMElements();
            this.setupEventListeners(app, batchCreator);
            this.loadSettings();
        },

        cacheDOMElements: function() {
            this.fab = document.getElementById('bfc-fab');
            this.panel = document.getElementById('bfc-panel');
            this.settingsView = document.getElementById('bfc-settings-view');
            this.settingsToggle = document.getElementById('bfc-settings-toggle');
            this.closePanelBtn = document.getElementById('bfc-close-panel');
            this.startBtn = document.getElementById('bfc-start-btn');
            this.saveSettingsBtn = document.getElementById('bfc-save-settings-btn');
            this.apiKeyInput = document.getElementById('bfc-api-key');
            this.apiHostInput = document.getElementById('bfc-api-host');
            this.aiProviderSelect = document.getElementById('bfc-ai-provider');
            this.sourceFoldersContainer = document.getElementById('bfc-source-folders');
            this.targetFoldersContainer = document.getElementById('bfc-target-folders');
            this.logContainer = document.getElementById('bfc-log');
            this.modelSelect = document.getElementById('bfc-model-select');
            this.customModelInput = document.getElementById('bfc-custom-model');
            this.customModelGroup = document.getElementById('bfc-custom-model-group');
            this.batchCreateBtn = document.getElementById('bfc-batch-create-btn');
            this.batchSizeInput = document.getElementById('batch-size-input');
        },

        injectFAB: function() {
            var fabHTML = '<div id="bfc-fab"><span>AI</span></div>';
            document.body.insertAdjacentHTML('beforeend', fabHTML);
        },

        injectPanel: function() {
            var panelHTML = [
                '<div id="bfc-panel">',
                '    <div class="bfc-panel-header">',
                '        <h2>AI分类助手</h2>',
                '        <div class="icons">',
                '            <span id="bfc-settings-toggle" title="设置">⚙️</span>',
                '            <span id="bfc-close-panel" title="关闭">❌</span>',
                '        </div>',
                '    </div>',
                '    <div id="bfc-settings-view" class="bfc-hidden">',
                '        <div class="bfc-form-group">',
                '            <label for="bfc-api-key">API Key</label>',
                '            <input type="password" id="bfc-api-key" class="bfc-input" placeholder="请输入你的API Key">',
                '        </div>',
                '        <div class="bfc-form-group">',
                '            <label for="bfc-api-host">API Host</label>',
                '            <input type="text" id="bfc-api-host" class="bfc-input" placeholder="例如: https://api.openai.com">',
                '        </div>',
                '        <!-- AI 提供商选择 -->',
                '        <div class="bfc-form-group">',
                '            <label for="bfc-ai-provider">AI 提供商</label>',
                '            <select id="bfc-ai-provider" class="bfc-select">',
                '                <option value="openai">OpenAI</option>',
                '                <option value="zhipu">智谱AI</option>',
                '            </select>',
                '        </div>',
                '         <div class="bfc-form-group">',
                '            <label for="bfc-model-select">AI 模型</label>',
                '            <select id="bfc-model-select" class="bfc-select">',
                '                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>',
                '                <option value="gpt-4">gpt-4</option>',
                '                <option value="gpt-4o">gpt-4o</option>',
                '                <option value="custom">自定义</option>',
                '            </select>',
                '        </div>',
                '        <div id="bfc-custom-model-group" class="bfc-form-group bfc-hidden">',
                '            <label for="bfc-custom-model">自定义模型名称</label>',
                '            <input type="text" id="bfc-custom-model" class="bfc-input" placeholder="请输入模型名称">',
                '        </div>',
                '        <button id="bfc-save-settings-btn" class="bfc-button">保存设置</button>',
                '    </div>',
                '    <div class="bfc-panel-body" id="bfc-main-view">',
                '        <div class="bfc-form-group">',
                '            <label for="bfc-source-folders">选择源收藏夹 (可多选)</label>',
                '            <div id="bfc-source-folders" class="bfc-checkbox-group"></div>',
                '        </div>',
                '        <div class="bfc-form-group">',
                '            <label for="bfc-target-folders">选择目标收藏夹 (可多选)</label>',
                '            <div id="bfc-target-folders" class="bfc-checkbox-group"></div>',
                '        </div>',
                '        <div class="bfc-form-group">',
                '            <label for="batch-size-input">单次处理视频数</label>',
                '            <input type="number" id="batch-size-input" class="bfc-input" value="10">',
                '        </div>',
                '        <button id="bfc-start-btn" class="bfc-button">开始分类</button>',
                '        <button id="bfc-batch-create-btn" class="bfc-button">一键创建推荐收藏夹</button>',
                '        <div id="bfc-log" style="margin-top: 20px; height: 200px; overflow-y: scroll; background: #fff; border: 1px solid #e3e5e7; padding: 10px; border-radius: 6px;"></div>',
                '    </div>',
                '    <div class="bfc-panel-footer">',
                '        Made with ❤️ by Roo',
                '    </div>',
                '</div>'
            ].join('\n');
            document.body.insertAdjacentHTML('beforeend', panelHTML);
        },

        setupEventListeners: function(app, batchCreator) {
            var _this = this;
            this.fab.addEventListener('click', function() { _this.togglePanel(); });
            this.closePanelBtn.addEventListener('click', function() { _this.togglePanel(false); });
            this.settingsToggle.addEventListener('click', function() { _this.toggleSettings(); });
            this.saveSettingsBtn.addEventListener('click', function() {
                _this.saveSettings();
                _this.log('设置已保存', 'success');
            });
            this.modelSelect.addEventListener('change', function(e) {
                _this.customModelGroup.classList.toggle('bfc-hidden', e.target.value !== 'custom');
            });
            this.startBtn.addEventListener('click', function() { app.start(); });
            this.batchCreateBtn.addEventListener('click', function() { batchCreator.start(); });
        },

        loadSettings: function() {
            this.apiKeyInput.value = GM_getValue('apiKey', '');
            this.apiHostInput.value = GM_getValue('apiHost', 'https://api.openai.com');
            this.aiProviderSelect.value = GM_getValue('aiProvider', 'openai');
            var apiModel = GM_getValue('apiModel', 'gpt-3.5-turbo');
            var customApiModel = GM_getValue('customApiModel', '');
            this.modelSelect.value = apiModel;
            if (apiModel === 'custom') {
                this.customModelInput.value = customApiModel;
                this.customModelGroup.classList.remove('bfc-hidden');
            }
        },

        saveSettings: function() {
            GM_setValue('apiKey', this.apiKeyInput.value);
            GM_setValue('apiHost', this.apiHostInput.value);
            GM_setValue('aiProvider', this.aiProviderSelect.value);
            var selectedModel = this.modelSelect.value;
            GM_setValue('apiModel', selectedModel);
            if (selectedModel === 'custom') {
                GM_setValue('customApiModel', this.customModelInput.value);
            }
        },

        togglePanel: function(forceState) {
            var isActive = this.panel.classList.contains('active');
            var nextState = typeof forceState === 'boolean' ? forceState : !isActive;
            this.panel.classList.toggle('active', nextState);
            this.fab.classList.toggle('active', nextState);
        },

        toggleSettings: function() {
            this.settingsView.classList.toggle('bfc-hidden');
        },

        renderFavorites: function(container, folders, idPrefix) {
            var _this = this;
            container.innerHTML = '';
            if (!folders || folders.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999;">没有找到收藏夹哦</p>';
                return;
            }
            folders.forEach(function(folder) {
                var itemHTML = [
                    '<div class="bfc-checkbox-item">',
                    '  <input type="checkbox" id="' + idPrefix + '-' + folder.id + '" value="' + folder.id + '">',
                    '  <label for="' + idPrefix + '-' + folder.id + '">' + folder.title + ' (' + folder.media_count + ')</label>',
                    '</div>'
                ].join('\n');
                container.insertAdjacentHTML('beforeend', itemHTML);
            });
        },

        getUserInput: function() {
            var apiKey = GM_getValue('apiKey');
            var apiHost = GM_getValue('apiHost');
            var apiModel = GM_getValue('apiModel');
            var customApiModel = GM_getValue('customApiModel');
            var modelName = apiModel === 'custom' ? customApiModel : apiModel;
            var sourceFavoriteIds = Array.from(this.sourceFoldersContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(function(cb) { return cb.value; });
            var targetFavoriteIds = Array.from(this.targetFoldersContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(function(cb) { return cb.value; });
            var batchSize = parseInt(this.batchSizeInput.value, 10) || 10;
            var csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
            var csrf = csrfMatch ? csrfMatch[1] : null;
            return { apiKey: apiKey, apiHost: apiHost, modelName: modelName, sourceFavoriteIds: sourceFavoriteIds, targetFavoriteIds: targetFavoriteIds, csrf: csrf, batchSize: batchSize };
        },

        log: function(message, type) {
            type = type || 'info';
            var logItem = document.createElement('div');
            logItem.className = 'bfc-log-item ' + type;
            logItem.textContent = '[' + new Date().toLocaleTimeString() + '] ' + message;
            this.logContainer.appendChild(logItem);
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        }
    };

    // 7. --- 主应用模块 ---
    var App = {
        allFolders: [],
        mid: null,

        init: function() {
            var _this = this;
            UIManager.init(this, BatchCreator);
            try {
                var midMatch = window.location.href.match(/space.bilibili.com\/(\d+)/);
                if (!midMatch) {
                    UIManager.log('无法从URL中获取用户MID，请确保在正确的空间页面', 'error');
                    return;
                }
                this.mid = midMatch[1];
                UIManager.log('成功获取到用户MID: ' + this.mid, 'info');

                UIManager.log('正在获取收藏夹列表...');
                BilibiliAPI.getAllFavorites(this.mid)
                    .then(function(folders) {
                        _this.allFolders = folders;
                        UIManager.renderFavorites(UIManager.sourceFoldersContainer, folders, 'source');
                        UIManager.renderFavorites(UIManager.targetFoldersContainer, folders, 'target');
                        UIManager.log('收藏夹列表加载成功', 'success');
                    })
                    .catch(function(error) {
                        UIManager.log(error.message, 'error');
                    });
            } catch (error) {
                UIManager.log(error.message, 'error');
            }
        },

        start: function() {
            var _this = this;
            UIManager.log('开始分类任务...', 'info');
            var userInput = UIManager.getUserInput();
            var apiKey = userInput.apiKey;
            var apiHost = userInput.apiHost;
            var modelName = userInput.modelName;
            var sourceFavoriteIds = userInput.sourceFavoriteIds;
            var targetFavoriteIds = userInput.targetFavoriteIds;
            var csrf = userInput.csrf;
            var batchSize = userInput.batchSize;
            
            if (!apiKey || !apiHost || !modelName || sourceFavoriteIds.length === 0 || targetFavoriteIds.length === 0 || !csrf) {
                UIManager.log('请检查设置：API Key/Host/模型, 源/目标收藏夹 和 CSRF Token 不能为空', 'error');
                return;
            }

            var targetFolders = this.allFolders.filter(function(f) { return targetFavoriteIds.includes(f.id.toString()); });
            var sourceFolders = this.allFolders.filter(function(f) { return sourceFavoriteIds.includes(f.id.toString()); });
            var videosToProcess = [];

            var processSourceFolders = function(index) {
                if (index >= sourceFolders.length || videosToProcess.length >= batchSize) {
                    if (videosToProcess.length === 0) {
                        UIManager.log('在选定的源收藏夹中没有找到任何视频。', 'info');
                        return;
                    }
                    UIManager.log('总共获取到 ' + videosToProcess.length + ' 个视频, 开始处理...', 'info');
                    _this.handleMoves(videosToProcess, targetFolders, { apiKey: apiKey, apiHost: apiHost, modelName: modelName, csrf: csrf })
                        .then(function() {
                            UIManager.log('所有视频处理完毕！', 'success');
                        })
                        .catch(function(error) {
                            UIManager.log('任务执行失败: ' + error.message, 'error');
                        });
                    return;
                }

                var sourceFolder = sourceFolders[index];
                UIManager.log('正在从源收藏夹 [' + sourceFolder.title + '] 获取视频...');
                
                var processVideos = function(pageNum) {
                    var remainingNeeded = batchSize - videosToProcess.length;
                    var pageSize = Math.min(20, remainingNeeded); // B站API单页最大20

                    BilibiliAPI.getFavoriteVideos(sourceFolder.id, pageSize, pageNum)
                        .then(function(result) {
                            var videos = result.videos;
                            var hasMore = result.hasMore;
                            
                            if (videos.length > 0) {
                                // 为每个视频对象添加其原始收藏夹ID
                                var videosWithSource = videos.map(function(v) {
                                    var newObj = {};
                                    for (var key in v) {
                                        if (v.hasOwnProperty(key)) {
                                            newObj[key] = v[key];
                                        }
                                    }
                                    newObj.sourceMediaId = sourceFolder.id;
                                    return newObj;
                                });
                                videosToProcess.push.apply(videosToProcess, videosWithSource);
                            }
                            
                            if (hasMore && videosToProcess.length < batchSize) {
                                processVideos(pageNum + 1);
                            } else {
                                processSourceFolders(index + 1);
                            }
                        })
                        .catch(function(error) {
                            UIManager.log('获取视频失败: ' + error.message, 'error');
                            processSourceFolders(index + 1);
                        });
                };

                processVideos(1);
            };

            processSourceFolders(0);
        },

        handleMoves: function(videos, targetFolders, config) {
            var _this = this;
            return new Promise(function(resolve, reject) {
                var processNextVideo = function(index) {
                    if (index >= videos.length) {
                        resolve();
                        return;
                    }

                    var video = videos[index];
                    
                    // 检查视频是否已在目标收藏夹之一
                    if (targetFolders.some(function(tf) { return tf.id === video.sourceMediaId; })) {
                        UIManager.log('视频「' + video.title + '」已在目标收藏夹中，跳过。', 'info');
                        processNextVideo(index + 1);
                        return;
                    }
                    
                    UIManager.log('正在为视频「' + video.title + '」请求AI分类...');
                    AIClassifier.classify(video, targetFolders, config.apiKey, config.apiHost, config.modelName)
                        .then(function(predictedFolderName) {
                            UIManager.log('AI建议分类到: 「' + predictedFolderName + '」');

                            var targetFolder = targetFolders.find(function(f) { return f.title === predictedFolderName; });
                            if (targetFolder) {
                                if (targetFolder.id === video.sourceMediaId) {
                                    UIManager.log('视频「' + video.title + '」已在「' + targetFolder.title + '」中，无需移动。', 'info');
                                    processNextVideo(index + 1);
                                    return;
                                }
                                return BilibiliAPI.moveVideo(video.id, targetFolder.id, video.sourceMediaId, config.csrf);
                            } else {
                                throw new Error('未找到匹配的目标收藏夹: 「' + predictedFolderName + '」');
                            }
                        })
                        .then(function() {
                            if (targetFolder) {
                                UIManager.log('成功将「' + video.title + '」移动到「' + targetFolder.title + '」', 'success');
                            }
                            processNextVideo(index + 1);
                        })
                        .catch(function(error) {
                            UIManager.log('处理视频「' + video.title + '」时出错: ' + error.message, 'error');
                            processNextVideo(index + 1);
                        });
                };

                processNextVideo(0);
            });
        }
    };

    // 8. --- 初始化应用 ---
    App.init();

})();
