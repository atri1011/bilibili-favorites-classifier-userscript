<template>
  <div class="bfc-log-container">
    <div 
      id="bfc-log" 
      ref="logContainer" 
      class="bfc-log-panel"
    >
      <div 
        v-for="(log, index) in logs" 
        :key="index" 
        :class="['bfc-log-item', log.type]"
      >
        {{ log.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue';
import { useClassificationStore } from '../stores/index.js';

export default {
  name: 'LogPanel',
  setup() {
    const classificationStore = useClassificationStore();
    const logContainer = ref(null);
    
    const logs = computed(() => classificationStore.logs);
    
    // 监听日志变化，自动滚动到底部
    watch(logs, () => {
      nextTick(() => {
        if (logContainer.value) {
          logContainer.value.scrollTop = logContainer.value.scrollHeight;
        }
      });
    }, { deep: true });
    
    return {
      logs,
      logContainer
    };
  }
};
</script>

<style scoped>
.bfc-log-container {
  margin-top: 10px;
}

.bfc-log-panel {
  height: 200px;
  overflow-y: scroll;
  background: #fff;
  border: 1px solid #e3e5e7;
  padding: 10px;
  border-radius: 6px;
}

.bfc-log-item {
  margin-bottom: 5px;
  word-break: break-word;
}

.bfc-log-item.info {
  color: #333;
}

.bfc-log-item.success {
  color: #28a745;
}

.bfc-log-item.error {
  color: #dc3545;
}

.bfc-log-item.warning {
  color: #ffc107;
}
</style>