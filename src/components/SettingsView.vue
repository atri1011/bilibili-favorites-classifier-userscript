<template>
  <div id="bfc-settings-view">
    <h3>AI 设置</h3>
    <div class="bfc-form-group">
      <label for="bfc-api-key">API Key</label>
      <input type="password" id="bfc-api-key" class="bfc-input" placeholder="请输入你的API Key" :value="settings.apiKey" @input="$emit('update:settings', { ...settings, apiKey: $event.target.value })">
    </div>
    <div class="bfc-form-group">
      <label for="bfc-api-host">API Host</label>
      <input type="text" id="bfc-api-host" class="bfc-input" placeholder="例如: https://api.openai.com" :value="settings.apiHost" @input="$emit('update:settings', { ...settings, apiHost: $event.target.value })">
    </div>
    <div class="bfc-form-group">
      <label for="bfc-ai-provider">AI 提供商</label>
      <select id="bfc-ai-provider" class="bfc-select" :value="settings.aiProvider" @change="$emit('update:settings', { ...settings, aiProvider: $event.target.value })">
        <option value="openai">OpenAI</option>
        <option value="zhipu">智谱AI</option>
      </select>
    </div>
    <div class="bfc-form-group">
      <label for="bfc-model-select">AI 模型</label>
      <select id="bfc-model-select" class="bfc-select" :value="settings.apiModel" @change="$emit('update:settings', { ...settings, apiModel: $event.target.value })">
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option value="gpt-4">gpt-4</option>
        <option value="gpt-4o">gpt-4o</option>
        <option value="custom">自定义</option>
      </select>
    </div>
    <div id="bfc-custom-model-group" class="bfc-form-group" :class="{ 'bfc-hidden': settings.apiModel !== 'custom' }">
      <label for="bfc-custom-model">自定义模型名称</label>
      <input type="text" id="bfc-custom-model" class="bfc-input" placeholder="请输入模型名称" :value="settings.customApiModel" @input="$emit('update:settings', { ...settings, customApiModel: $event.target.value })">
    </div>
    <div class="bfc-advanced-settings-toggle" style="margin-top: 15px; text-align: center;">
      <a href="#" id="bfc-advanced-toggle-link" @click.prevent="$emit('toggle-advanced')" style="color: #00a1d6; text-decoration: none; font-size: 14px;">
        {{ advancedSettingsVisible ? '高级设置 ▲' : '高级设置 ▼' }}
      </a>
    </div>
    <div id="bfc-advanced-settings" :class="{ 'bfc-hidden': !advancedSettingsVisible }" style="margin-top: 15px;">
      <div class="bfc-form-group">
        <label for="bfc-custom-prompt">自定义Prompt模板</label>
        <textarea id="bfc-custom-prompt" class="bfc-input" rows="8" style="height: auto; resize: vertical;" placeholder="使用占位符: {videoTitle}, {videoIntro}, {videoUpperName}, {folderList}" :value="settings.customPrompt" @input="$emit('update:settings', { ...settings, customPrompt: $event.target.value })"></textarea>
        <small style="display: block; margin-top: 5px; color: #999;">占位符: {videoTitle}, {videoIntro}, {videoUpperName}, {folderList}</small>
      </div>
      <button id="bfc-restore-prompt-btn" class="bfc-button" @click="$emit('restore-prompt')" style="background-color: #6c757d;">恢复默认Prompt</button>
    </div>
    <button id="bfc-save-settings-btn" class="bfc-button" @click="$emit('save-settings')" style="margin-top: 15px;">保存设置</button>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  props: {
    settings: {
      type: Object,
      required: true
    },
    advancedSettingsVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:settings', 'save-settings', 'toggle-advanced', 'restore-prompt']
};
</script>