const store = {
    // 用户收藏夹列表
    allFolders: [],

    // 用户信息
    mid: null,

    // 用户设置
    userSettings: {
        apiKey: '',
        apiHost: 'https://api.openai.com',
        aiProvider: 'openai',
        apiModel: 'gpt-3.5-turbo',
        customApiModel: '',
        batchSize: 10,
        customPrompt: ''
    },

    // 任务状态
    taskState: {
        isPaused: false,
        isStopped: false,
        status: 'idle', // idle, running, paused, stopped
        summary: {
            success: 0,
            skipped: 0,
            failed: 0,
            failedItems: []
        }
    },

    // UI 状态
    uiState: {
        // isPanelOpen and isSettingsOpen are no longer needed
    }
};

export default store;