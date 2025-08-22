import { useSettingsStore } from '../stores/index.js';

export class SettingsService {
  constructor() {
    this.settingsStore = null;
  }

  // 获取 settingsStore 实例（延迟初始化）
  getSettingsStore() {
    if (!this.settingsStore) {
      this.settingsStore = useSettingsStore();
    }
    return this.settingsStore;
  }

  // 加载设置
  async loadSettings() {
    await this.getSettingsStore().loadSettings();
  }

  // 保存设置
  async saveSettings() {
    await this.getSettingsStore().saveSettings();
  }

  // 切换高级设置可见性
  toggleAdvancedSettings() {
    this.getSettingsStore().toggleAdvancedSettings();
  }

  // 恢复默认Prompt
  restoreDefaultPrompt() {
    this.getSettingsStore().restoreDefaultPrompt();
  }

  // 更新设置
  updateSettings(newSettings) {
    const store = this.getSettingsStore();
    
    // 只更新实际存在的状态属性，避免尝试设置 getter
    if (newSettings.apiKey !== undefined) store.apiKey = newSettings.apiKey;
    if (newSettings.apiHost !== undefined) store.apiHost = newSettings.apiHost;
    if (newSettings.aiProvider !== undefined) store.aiProvider = newSettings.aiProvider;
    if (newSettings.apiModel !== undefined) store.apiModel = newSettings.apiModel;
    if (newSettings.customApiModel !== undefined) store.customApiModel = newSettings.customApiModel;
    if (newSettings.customPrompt !== undefined) store.customPrompt = newSettings.customPrompt;
    if (newSettings.advancedSettingsVisible !== undefined) store.advancedSettingsVisible = newSettings.advancedSettingsVisible;
  }

  // 获取当前设置
  getSettings() {
    const store = this.getSettingsStore();
    return {
      apiKey: store.apiKey,
      apiHost: store.apiHost,
      aiProvider: store.aiProvider,
      apiModel: store.apiModel,
      customApiModel: store.customApiModel,
      customPrompt: store.customPrompt,
      advancedSettingsVisible: store.advancedSettingsVisible
    };
  }

  // 检查设置是否有效
  isSettingsValid() {
    return this.getSettingsStore().isValid;
  }

  // 获取设置验证错误信息
  getSettingsValidationError() {
    const store = this.getSettingsStore();
    const missingFields = [];
    
    if (!store.apiKey) {
      missingFields.push('API Key');
    }
    
    if (!store.apiHost) {
      missingFields.push('API Host');
    }
    
    const modelName = store.apiModel === 'custom' ? store.customApiModel : store.apiModel;
    if (!modelName) {
      missingFields.push('模型名称');
    }
    
    if (missingFields.length === 0) {
      return null;
    } else {
      return `请检查设置：${missingFields.join('/')} 不能为空`;
    }
  }

  // 获取模型名称
  getModelName() {
    return this.getSettingsStore().getModelName;
  }
}