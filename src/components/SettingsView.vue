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
    <div id="bfc-custom-model-group" class="bfc-form-group" :class="{ 'bfc-hidden': settings.apiModel !== 'custom' }" style="position: relative;">
      <label for="bfc-custom-model">自定义模型名称 <span v-if="settingsStore.modelsLoading">(加载中...)</span></label>
      <input
        type="text"
        id="bfc-custom-model"
        class="bfc-input"
        placeholder="点击获取或输入模型名称"
        :value="settings.customApiModel"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="settingsStore.modelsLoading"
        autocomplete="off"
      >
      <div v-if="isDropdownVisible && displayedModels.length > 0" class="bfc-model-dropdown">
        <div
          v-for="model in displayedModels"
          :key="model"
          class="bfc-model-dropdown-item"
          @mousedown="selectModel(model)"
        >
          {{ model }}
        </div>
      </div>
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

<script setup>
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settingsStore.js';

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  advancedSettingsVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:settings', 'save-settings', 'toggle-advanced', 'restore-prompt']);

const settingsStore = useSettingsStore();
const isDropdownVisible = ref(false);
const displayedModels = ref([]);

const handleFocus = () => {
  isDropdownVisible.value = true;
  // On focus, always show the full list.
  displayedModels.value = settingsStore.availableModels;

  // Fetch if the list is empty.
  if (settingsStore.availableModels.length === 0 && !settingsStore.modelsLoading) {
    settingsStore.fetchModels().then(() => {
      // After fetching, update the displayed list again.
      displayedModels.value = settingsStore.availableModels;
    });
  }
};

const handleBlur = () => {
  // Delay hiding to allow click event on dropdown items
  setTimeout(() => {
    isDropdownVisible.value = false;
  }, 200);
};

const handleInput = (event) => {
  const searchTerm = event.target.value;
  emit('update:settings', { ...props.settings, customApiModel: searchTerm });

  const trimmedSearch = searchTerm.trim().toLowerCase();
  if (!trimmedSearch) {
    displayedModels.value = settingsStore.availableModels;
  } else {
    displayedModels.value = settingsStore.availableModels.filter(model =>
      model.toLowerCase().includes(trimmedSearch)
    );
  }
  isDropdownVisible.value = true; // Keep dropdown open while typing
};

const selectModel = (model) => {
  emit('update:settings', { ...props.settings, customApiModel: model });
  isDropdownVisible.value = false;
};
</script>

<style scoped>
.bfc-model-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 150px;
  overflow-y: auto;
  
  /* Aether Design Philosophy: Frosted Glass Effect */
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(var(--blur-intensity, 8px));
  -webkit-backdrop-filter: blur(var(--blur-intensity, 8px)); /* Safari support */
  
  /* Aether Design Philosophy: Universal Softness */
  border-radius: 0.75rem; /* equivalent to rounded-2xl */
  
  /* Aether Design Philosophy: Depth & Hierarchy */
  border: 1px solid rgba(209, 213, 219, 0.3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.bfc-model-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  text-align: left;
  color: #1f2937; /* Darker text for better readability on blurred background */
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bfc-model-dropdown-item:hover {
  /* Aether Design Philosophy: Light Interaction */
  background-color: rgba(255, 255, 255, 0.5);
}
</style>