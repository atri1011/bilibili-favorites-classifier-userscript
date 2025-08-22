<template>
  <div id="bfc-panel" v-if="visible">
    <div class="bfc-panel-header">
      <h2>AI分类助手</h2>
      <div class="icons">
        <span id="bfc-close-panel" title="关闭页面" @click="closePanel">❌</span>
      </div>
    </div>
    <div class="bfc-panel-body">
      <slot></slot>
    </div>
    <div class="bfc-panel-footer">
      Made with ❤️ by Roo
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useUIStore } from '../stores/index.js';

export default {
  name: 'MainLayout',
  setup() {
    const uiStore = useUIStore();
    
    const visible = computed(() => uiStore.isVisible);
    
    function closePanel() {
      window.close();
    }
    
    return {
      visible,
      closePanel
    };
  }
};
</script>