<template>
  <div class="bfc-tabs">
    <button 
      :class="{ active: activeTab === 'settings' }" 
      @click="switchToSettingsTab"
    >
      AI 设置
    </button>
    <button 
      :class="{ active: activeTab === 'classify' }" 
      @click="switchToClassifyTab"
    >
      批量分类
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useUIStore } from '../stores/index.js';

export default {
  name: 'TabNavigation',
  setup() {
    const uiStore = useUIStore();
    
    const activeTab = computed(() => uiStore.currentTab);
    
    function switchToSettingsTab() {
      uiStore.switchToSettingsTab();
    }
    
    function switchToClassifyTab() {
      uiStore.switchToClassifyTab();
    }
    
    
    return {
      activeTab,
      switchToSettingsTab,
      switchToClassifyTab,
    };
  }
};
</script>