export const UIManager = {
    init(app, batchCreator) {
        this.injectFAB();
        this.injectPanel();
        this.cacheDOMElements();
        this.setupEventListeners(app, batchCreator);
        this.loadSettings();
    },

    cacheDOMElements() {
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

    injectFAB() {
        const fabHTML = `<div id="bfc-fab"><span>AI</span></div>`;
        document.body.insertAdjacentHTML('beforeend', fabHTML);
    },

    injectPanel() {
        const panelHTML = `
            <div id="bfc-panel">
                <div class="bfc-panel-header">
                    <h2>AI分类助手</h2>
                    <div class="icons">
                        <span id="bfc-settings-toggle" title="设置">⚙️</span>
                        <span id="bfc-close-panel" title="关闭">❌</span>
                    </div>
                </div>
                <div id="bfc-settings-view" class="bfc-hidden">
                    <div class="bfc-form-group">
                        <label for="bfc-api-key">API Key</label>
                        <input type="password" id="bfc-api-key" class="bfc-input" placeholder="请输入你的API Key">
                    </div>
                    <div class="bfc-form-group">
                        <label for="bfc-api-host">API Host</label>
                        <input type="text" id="bfc-api-host" class="bfc-input" placeholder="例如: https://api.openai.com">
                    </div>
                    <!-- AI 提供商选择 -->
                    <div class="bfc-form-group">
                        <label for="bfc-ai-provider">AI 提供商</label>
                        <select id="bfc-ai-provider" class="bfc-select">
                            <option value="openai">OpenAI</option>
                            <option value="zhipu">智谱AI</option>
                        </select>
                    </div>
                     <div class="bfc-form-group">
                        <label for="bfc-model-select">AI 模型</label>
                        <select id="bfc-model-select" class="bfc-select">
                            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                            <option value="gpt-4">gpt-4</option>
                            <option value="gpt-4o">gpt-4o</option>
                            <option value="custom">自定义</option>
                        </select>
                    </div>
                    <div id="bfc-custom-model-group" class="bfc-form-group bfc-hidden">
                        <label for="bfc-custom-model">自定义模型名称</label>
                        <input type="text" id="bfc-custom-model" class="bfc-input" placeholder="请输入模型名称">
                    </div>
                    <button id="bfc-save-settings-btn" class="bfc-button">保存设置</button>
                </div>
                <div class="bfc-panel-body" id="bfc-main-view">
                    <div class="bfc-form-group">
                        <label for="bfc-source-folders">选择源收藏夹 (可多选)</label>
                        <div id="bfc-source-folders" class="bfc-checkbox-group"></div>
                    </div>
                    <div class="bfc-form-group">
                        <label for="bfc-target-folders">选择目标收藏夹 (可多选)</label>
                        <div id="bfc-target-folders" class="bfc-checkbox-group"></div>
                    </div>
                    <div class="bfc-form-group">
                        <label for="batch-size-input">单次处理视频数</label>
                        <input type="number" id="batch-size-input" class="bfc-input" value="10">
                    </div>
                    <button id="bfc-start-btn" class="bfc-button">开始分类</button>
                    <button id="bfc-batch-create-btn" class="bfc-button">一键创建推荐收藏夹</button>
                    <div id="bfc-log" style="margin-top: 20px; height: 200px; overflow-y: scroll; background: #fff; border: 1px solid #e3e5e7; padding: 10px; border-radius: 6px;"></div>
                </div>
                <div class="bfc-panel-footer">
                    Made with ❤️ by Roo
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);
    },

    setupEventListeners(app, batchCreator) {
        this.fab.addEventListener('click', () => this.togglePanel());
        this.closePanelBtn.addEventListener('click', () => this.togglePanel(false));
        this.settingsToggle.addEventListener('click', () => this.toggleSettings());
        this.saveSettingsBtn.addEventListener('click', () => {
            this.saveSettings();
            this.log('设置已保存', 'success');
        });
        this.modelSelect.addEventListener('change', (e) => {
            this.customModelGroup.classList.toggle('bfc-hidden', e.target.value !== 'custom');
        });
        this.startBtn.addEventListener('click', () => app.start());
        this.batchCreateBtn.addEventListener('click', () => batchCreator.start());
    },

    loadSettings() {
        this.apiKeyInput.value = GM_getValue('apiKey', '');
        this.apiHostInput.value = GM_getValue('apiHost', 'https://api.openai.com');
        this.aiProviderSelect.value = GM_getValue('aiProvider', 'openai');
        const apiModel = GM_getValue('apiModel', 'gpt-3.5-turbo');
        const customApiModel = GM_getValue('customApiModel', '');
        this.modelSelect.value = apiModel;
        if (apiModel === 'custom') {
            this.customModelInput.value = customApiModel;
            this.customModelGroup.classList.remove('bfc-hidden');
        }
    },

    saveSettings() {
        GM_setValue('apiKey', this.apiKeyInput.value);
        GM_setValue('apiHost', this.apiHostInput.value);
        GM_setValue('aiProvider', this.aiProviderSelect.value);
        const selectedModel = this.modelSelect.value;
        GM_setValue('apiModel', selectedModel);
        if (selectedModel === 'custom') {
            GM_setValue('customApiModel', this.customModelInput.value);
        }
    },

    togglePanel(forceState) {
        const isActive = this.panel.classList.contains('active');
        const nextState = typeof forceState === 'boolean' ? forceState : !isActive;
        this.panel.classList.toggle('active', nextState);
        this.fab.classList.toggle('active', nextState);
    },

    toggleSettings() {
        this.settingsView.classList.toggle('bfc-hidden');
    },

    renderFavorites(container, folders, idPrefix) {
        container.innerHTML = '';
        if (!folders || folders.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">没有找到收藏夹哦</p>';
            return;
        }
        folders.forEach(folder => {
            const itemHTML = `
                <div class="bfc-checkbox-item">
                  <input type="checkbox" id="${idPrefix}-${folder.id}" value="${folder.id}">
                  <label for="${idPrefix}-${folder.id}">${folder.title} (${folder.media_count})</label>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });
    },

    getUserInput() {
        const apiKey = GM_getValue('apiKey');
        const apiHost = GM_getValue('apiHost');
        const apiModel = GM_getValue('apiModel');
        const customApiModel = GM_getValue('customApiModel');
        const modelName = apiModel === 'custom' ? customApiModel : apiModel;
        const sourceFavoriteIds = Array.from(this.sourceFoldersContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        const targetFavoriteIds = Array.from(this.targetFoldersContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        const batchSize = parseInt(this.batchSizeInput.value, 10) || 10;
        const csrf = document.cookie.match(/bili_jct=([^;]+)/) ? document.cookie.match(/bili_jct=([^;]+)/)[1] : null;
        return { apiKey, apiHost, modelName, sourceFavoriteIds, targetFavoriteIds, csrf, batchSize };
    },

    log(message, type = 'info') {
        const logItem = document.createElement('div');
        logItem.className = `bfc-log-item ${type}`;
        logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logContainer.appendChild(logItem);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
};