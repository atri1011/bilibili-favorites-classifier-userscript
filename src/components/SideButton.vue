<template>
  <div 
    class="side-button"
    :class="buttonClasses"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- AI 图标 -->
    <div class="ai-icon">
      <svg v-if="buttonState === 'idle'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#fb7299"/>
        <circle cx="12" cy="12" r="3" fill="#fb7299"/>
      </svg>
      
      <!-- 加载动画 -->
      <div v-else-if="buttonState === 'loading'" class="loading-spinner"></div>
      
      <!-- 成功图标 -->
      <svg v-else-if="buttonState === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#4caf50"/>
      </svg>
      
      <!-- 错误图标 -->
      <svg v-else-if="buttonState === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#f44336"/>
      </svg>
    </div>
    
    <!-- 按钮文字 -->
    <span class="button-text">{{ buttonText }}</span>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useFloatingRecommendationStore } from '../stores/floatingRecommendationStore.js';

export default {
  name: 'SideButton',
  setup() {
    const store = useFloatingRecommendationStore();
    const isHovered = ref(false);
    const isClicked = ref(false);

    // 计算按钮状态类
    const buttonClasses = computed(() => ({
      'hovered': isHovered.value,
      'clicked': isClicked.value,
      'loading': store.buttonState === 'loading',
      'success': store.buttonState === 'success',
      'error': store.buttonState === 'error'
    }));

    // 计算按钮文字
    const buttonText = computed(() => {
      switch (store.buttonState) {
        case 'loading':
          return '分析中';
        case 'success':
          return '推荐完成';
        case 'error':
          return '分析失败';
        default:
          return 'AI收藏';
      }
    });

    // 处理点击事件
    const handleClick = async () => {
      if (store.buttonState === 'loading') return;
      
      isClicked.value = true;
      setTimeout(() => {
        isClicked.value = false;
      }, 200);

      // 触发AI分类流程
      await store.triggerClassification();
    };

    return {
      buttonState: computed(() => store.buttonState),
      buttonClasses,
      buttonText,
      isHovered,
      handleClick
    };
  }
};
</script>

<style scoped>
.side-button {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 120px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 20px rgba(251, 114, 153, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  user-select: none;
  overflow: hidden;
}

.side-button:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 8px 24px rgba(251, 114, 153, 0.25);
}

.side-button.clicked {
  transform: translateY(-50%) scale(0.95);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.2);
}

/* 添加波纹效果 */
.side-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(251, 114, 153, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.side-button.clicked::before {
  width: 100px;
  height: 100px;
}

.ai-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.button-text {
  font-size: 12px;
  font-weight: 500;
  color: #fb7299;
  text-align: center;
  line-height: 1.2;
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 加载动画 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(251, 114, 153, 0.2);
  border-top: 2px solid #fb7299;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 添加脉冲动画 */
.side-button.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(251, 114, 153, 0.15);
  }
  50% {
    box-shadow: 0 4px 20px rgba(251, 114, 153, 0.4);
  }
}

/* 状态样式 */
.side-button.loading {
  background: rgba(251, 114, 153, 0.1);
  border-color: rgba(251, 114, 153, 0.3);
}

.side-button.success {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
}

.side-button.success .button-text {
  color: #4caf50;
}

.side-button.error {
  background: rgba(244, 67, 54, 0.1);
  border-color: rgba(244, 67, 54, 0.3);
}

.side-button.error .button-text {
  color: #f44336;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .side-button {
    right: 16px;
    width: 46px;
    height: 115px;
  }
}

@media (max-width: 768px) {
  .side-button {
    right: 12px;
    width: 44px;
    height: 110px;
    border-radius: 22px;
  }
  
  .button-text {
    font-size: 11px;
    max-width: 38px;
  }
}

@media (max-width: 480px) {
  .side-button {
    right: 8px;
    width: 40px;
    height: 100px;
    border-radius: 20px;
  }
  
  .button-text {
    font-size: 10px;
    max-width: 34px;
  }
  
  .ai-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .loading-spinner {
    width: 16px;
    height: 16px;
  }
}

/* 横屏模式适配 */
@media (max-height: 600px) and (orientation: landscape) {
  .side-button {
    height: 90px;
    top: 45%;
  }
  
  .button-text {
    font-size: 10px;
    max-width: 34px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .side-button {
    background: rgba(30, 30, 30, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .side-button:hover {
    background: rgba(40, 40, 40, 0.95);
    box-shadow: 0 8px 24px rgba(251, 114, 153, 0.3);
  }
  
  .button-text {
    color: #ff8fab;
  }
  
  .side-button.loading {
    background: rgba(251, 114, 153, 0.2);
    border-color: rgba(251, 114, 153, 0.5);
  }
  
  .side-button.success {
    background: rgba(76, 175, 80, 0.2);
    border-color: rgba(76, 175, 80, 0.5);
  }
  
  .side-button.error {
    background: rgba(244, 67, 54, 0.2);
    border-color: rgba(244, 67, 54, 0.5);
  }
  
  .side-button.clicked {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

/* B站深色模式适配 */
html[data-theme="dark"] .side-button,
.bili-dark .side-button {
  background: rgba(30, 30, 30, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

html[data-theme="dark"] .side-button:hover,
.bili-dark .side-button:hover {
  background: rgba(40, 40, 40, 0.95);
  box-shadow: 0 8px 24px rgba(251, 114, 153, 0.3);
}

html[data-theme="dark"] .button-text,
.bili-dark .button-text {
  color: #ff8fab;
}
</style>