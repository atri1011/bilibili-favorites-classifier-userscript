<template>
  <div
    id="bfc-floating-recommendation"
    v-if="visible"
    class="floating-recommendation"
    :class="{
      'slide-in': animateIn && isPanelExpanded,
      'collapsed': !isPanelExpanded
    }"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">AI正在分析视频...</span>
    </div>

    <!-- 推荐结果 -->
    <div v-else-if="recommendation && !error" class="recommendation-container">
      <div class="recommendation-header">
        <div class="ai-icon">🤖</div>
        <div class="header-text">
          <h4>AI推荐收藏夹</h4>
          <p class="video-title">{{ videoTitle }}</p>
        </div>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <div class="recommendation-content">
        <div v-if="recommendation.folderName === '无合适收藏夹'" class="no-match">
          <p>AI认为该视频与现有收藏夹都不匹配</p>
          <p class="suggestion">建议手动选择或创建新收藏夹</p>
        </div>
        <div v-else class="match-found">
          <div class="recommended-folder">
            <div class="folder-icon">📁</div>
            <span class="folder-name">{{ recommendation.folderName }}</span>
            <div class="confidence" v-if="recommendation.confidence">
              置信度: {{ Math.round(recommendation.confidence * 100) }}%
            </div>
          </div>
        </div>
        
        <!-- 用户可选收藏夹列表 -->
        <div class="folder-select-container">
          <label for="folder-select" class="select-label">或手动选择收藏夹:</label>
          <select
            id="folder-select"
            v-model="selectedFolderId"
            class="folder-select"
          >
            <option :value="null" disabled>请选择一个收藏夹</option>
            <option
              v-for="folder in targetFolders"
              :key="folder.id"
              :value="folder.id"
            >
              {{ folder.title }}
            </option>
          </select>
        </div>
      </div>

      <div class="recommendation-actions">
        <button
          class="btn btn-primary"
          @click="handleAccept"
          :disabled="processing || (!selectedFolderId && !isValidRecommendation)"
        >
          {{ processing ? '收藏中...' : (selectedFolderId ? '收藏到选中收藏夹' : '接受推荐') }}
        </button>
        <button class="btn btn-secondary" @click="handleReject">
          {{ recommendation.folderName === '无合适收藏夹' ? '取消' : '拒绝推荐' }}
        </button>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <div class="error-message">{{ error }}</div>
      <button class="btn btn-secondary" @click="handleClose">关闭</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useFloatingRecommendationStore } from '../stores/floatingRecommendationStore.js';

export default {
  name: 'FloatingRecommendation',
  setup() {
    const store = useFloatingRecommendationStore();
    const animateIn = ref(false);

    // 计算属性
    const visible = computed(() => store.visible);
    const isPanelExpanded = computed(() => store.isPanelExpanded);
    const loading = computed(() => store.loading);
    const recommendation = computed(() => store.recommendation);
    const error = computed(() => store.error);
    const processing = computed(() => store.processing);
    const videoTitle = computed(() => store.videoTitle);
    const targetFolders = computed(() => store.targetFolders); // 获取所有收藏夹
    const selectedFolderId = computed({ // 获取和设置用户选择的收藏夹ID
      get: () => store.selectedFolderId,
      set: (value) => store.setSelectedFolderId(value)
    });
    
    // 判断是否有有效的AI推荐
    const isValidRecommendation = computed(() => {
      return store.recommendation &&
             store.recommendation.folderName &&
             store.recommendation.folderName !== '无合适收藏夹';
    });

    // 监听显示状态变化，触发动画
    watch(visible, (newVal) => {
      if (newVal) {
        setTimeout(() => {
          animateIn.value = true;
        }, 50);
      } else {
        animateIn.value = false;
      }
    });

    // 事件处理
    const handleAccept = () => {
      store.acceptRecommendation();
    };

    const handleReject = () => {
      store.rejectRecommendation();
    };

    const handleClose = () => {
      store.hide();
    };

    return {
      visible,
      loading,
      recommendation,
      error,
      processing,
      videoTitle,
      targetFolders,
      selectedFolderId,
      isValidRecommendation,
      animateIn,
      isPanelExpanded,
      handleAccept,
      handleReject,
      handleClose
    };
  }
};
</script>

<style scoped>
.floating-recommendation {
  position: fixed;
  top: 120px;
  right: 20px;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.floating-recommendation.slide-in {
  transform: translateX(0);
}

.floating-recommendation.collapsed {
  transform: translateX(100%);
  width: 0;
  overflow: hidden;
}

/* 加载状态 */
.loading-container {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(251, 114, 153, 0.2);
  border-top: 2px solid #fb7299;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 14px;
}

/* 推荐结果 */
.recommendation-container {
  padding: 16px;
}

.recommendation-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.ai-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.video-title {
  margin: 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.recommendation-content {
  margin-bottom: 16px;
}

.no-match p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.suggestion {
  font-size: 12px;
  color: #999;
}

.match-found .recommended-folder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(251, 114, 153, 0.05);
  border: 1px solid rgba(251, 114, 153, 0.2);
  border-radius: 12px;
}

.folder-icon {
  font-size: 20px;
}

.folder-name {
  flex: 1;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.confidence {
  font-size: 12px;
  color: #666;
  background: rgba(251, 114, 153, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

/* 按钮样式 */
.recommendation-actions {
  display: flex;
  gap: 8px;
}

.folder-select-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.folder-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  color: #333;
  appearance: none; /* 移除默认样式 */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%20197.4L159.7%2069.7c-3.2-3.2-8.3-3.2-11.6%200L5.4%20197.4c-3.2%203.2-3.2%208.3%200%2011.6l11.6%2011.6c3.2%203.2%208.3%203.2%2011.6%200l120.2-120.2c3.2-3.2%208.3-3.2%2011.6%200l120.2%20120.2c3.2%203.2%208.3%203.2%2011.6%200l11.6-11.6c3.2-3.2%203.2-8.4%200-11.6z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 12px auto;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.folder-select:focus {
  border-color: #fb7299;
  box-shadow: 0 0 0 2px rgba(251, 114, 153, 0.2);
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #fb7299;
  color: white;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #e85a85;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.4);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* 错误状态 */
.error-container {
  padding: 20px;
  text-align: center;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.error-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-recommendation {
    right: 10px;
    width: 300px;
    top: 80px;
  }
}

@media (max-width: 480px) {
  .floating-recommendation {
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .floating-recommendation {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .header-text h4 {
    color: #fff;
  }
  
  .video-title, .loading-text, .no-match p, .select-label {
    color: #ccc;
  }
  
  .suggestion {
    color: #999;
  }
  
  .folder-name {
    color: #fff;
  }
  
  .confidence {
    color: #ccc;
  }

  .folder-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23ccc%22%20d%3D%22M287%20197.4L159.7%2069.7c-3.2-3.2-8.3-3.2-11.6%200L5.4%20197.4c-3.2%203.2-3.2%208.3%200%2011.6l11.6%2011.6c3.2%203.2%208.3%203.2%2011.6%200l120.2-120.2c3.2-3.2%208.3-3.2%2011.6%200l120.2%20120.2c3.2%203.2%208.3%203.2%2011.6%200l11.6-11.6c3.2-3.2%203.2-8.4%200-11.6z%22%2F%3E%3C%2Fsvg%3E');
  }

  .folder-select:focus {
    border-color: #fb7299;
    box-shadow: 0 0 0 2px rgba(251, 114, 153, 0.2);
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #ccc;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .error-message {
    color: #ccc;
  }
}
</style>