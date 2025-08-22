import { defineStore } from 'pinia';
import { GM } from '../utils/gmAdapter.js';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    apiKey: '',
    apiHost: 'https://api.openai.com',
    aiProvider: 'openai',
    apiModel: 'gpt-3.5-turbo',
    customApiModel: '',
    customPrompt: '',
    advancedSettingsVisible: false
  }),
  
  getters: {
    getModelName: (state) => {
      if (state.apiModel === 'custom') {
        return state.customApiModel || '';
      }
      return state.apiModel;
    },
    
    isValid: (state) => {
      const modelName = state.apiModel === 'custom' ? state.customApiModel : state.apiModel;
      return state.apiKey && state.apiHost && modelName;
    }
  },
  
  actions: {
    async loadSettings() {
      console.log('[BFC Debug] 开始加载设置');
      this.apiKey = await GM.getValue('apiKey', '');
      this.apiHost = await GM.getValue('apiHost', 'https://api.openai.com');
      this.aiProvider = await GM.getValue('aiProvider', 'openai');
      this.apiModel = await GM.getValue('apiModel', 'gpt-3.5-turbo');
      this.customApiModel = await GM.getValue('customApiModel', '');
      this.customPrompt = await GM.getValue('customPrompt', '');
    },
    
    async saveSettings() {
      console.log('[BFC Debug] 开始保存设置');
      await GM.setValue('apiKey', this.apiKey);
      await GM.setValue('apiHost', this.apiHost);
      await GM.setValue('aiProvider', this.aiProvider);
      await GM.setValue('apiModel', this.apiModel);
      if (this.apiModel === 'custom') {
        await GM.setValue('customApiModel', this.customApiModel);
      } else {
        // 如果不是自定义模型，清空自定义模型名称
        this.customApiModel = '';
        await GM.setValue('customApiModel', '');
      }
      await GM.setValue('customPrompt', this.customPrompt);
      console.log('[BFC Debug] 设置保存完成');
    },
    
    toggleAdvancedSettings() {
      this.advancedSettingsVisible = !this.advancedSettingsVisible;
    },
    
    restoreDefaultPrompt() {
      this.customPrompt = `我有一个B站收藏的视频，信息如下：
- 标题: "{videoTitle}"
- 简介: "{videoIntro}"
- UP主: "{videoUpperName}"

请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。
目标收藏夹列表:
{folderList}

请仅返回最合适的收藏夹的名称，不要添加任何多余的解释或标点符号。`;
    }
  }
});