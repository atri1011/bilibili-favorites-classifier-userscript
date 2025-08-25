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
import { computed, inject } from 'vue';
import { useUIStore } from '../stores/index.js';

export default {
  name: 'MainLayout',
  setup() {
    const uiStore = useUIStore();
    const closeModal = inject('closeModal');
    
    const visible = computed(() => uiStore.isVisible);
    
    function closePanel() {
      if (closeModal) {
        closeModal();
      } else {
        console.error('closeModal function not provided');
      }
    }
    
    return {
      visible,
      closePanel
    };
  }
};
</script>