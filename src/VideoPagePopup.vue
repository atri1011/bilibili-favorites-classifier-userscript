<template>
  <div id="bfc-popup" v-if="isVisible" class="show">
    <div id="bfc-popup-message" v-html="message"></div>
    
    <!-- 第一步：AI推荐确认 -->
    <div id="bfc-popup-buttons" v-if="showButtons && step === 1">
      <button id="bfc-popup-reject" class="bfc-popup-button" @click="handleRejectRecommendation">手动选择</button>
      <button id="bfc-popup-accept" class="bfc-popup-button primary" @click="handleAcceptRecommendation">接受推荐</button>
    </div>
    
    <!-- 第二步：收藏夹选择和确认 -->
    <div id="bfc-popup-favlist-container" v-if="showFavlist && step === 2">
      <label for="bfc-favlist-select">收藏到:</label>
      <select id="bfc-favlist-select" v-model="selectedFolder">
        <option v-for="folder in folders" :key="folder.id" :value="folder.id">
          {{ folder.title }}
        </option>
      </select>
    </div>
    <div id="bfc-popup-buttons" v-if="showButtons && step === 2">
      <button id="bfc-popup-cancel" class="bfc-popup-button" @click="handleCancel">取消</button>
      <button id="bfc-popup-confirm" class="bfc-popup-button primary" @click="handleConfirm">确认收藏</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPagePopup',
  data() {
    return {
      isVisible: false,
      message: '',
      folders: [],
      selectedFolder: null,
      showFavlist: false,
      showButtons: false,
      step: 1, // 1: AI推荐确认阶段, 2: 收藏夹选择和确认阶段
      predictedFolder: null, // AI预测的收藏夹
      onConfirmCallback: () => {},
      onCancelCallback: () => {},
      onAcceptRecommendationCallback: () => {},
      onRejectRecommendationCallback: () => {}
    };
  },
  methods: {
    show(data) {
      this.message = data.message || '';
      this.folders = data.folders || [];
      this.selectedFolder = data.initialSelectedFolderId || null;
      this.showFavlist = data.showFavlist || false;
      this.showButtons = data.showButtons || false;
      this.step = data.step || 1;
      this.predictedFolder = data.predictedFolder || null;
      this.onConfirmCallback = data.onConfirm || (() => {});
      this.onCancelCallback = data.onCancel || (() => {});
      this.onAcceptRecommendationCallback = data.onAcceptRecommendation || (() => {});
      this.onRejectRecommendationCallback = data.onRejectRecommendation || (() => {});
      this.isVisible = true;
    },
    hide() {
      this.isVisible = false;
      // 重置状态
      this.step = 1;
      this.predictedFolder = null;
    },
    handleConfirm() {
      this.onConfirmCallback(this.selectedFolder);
    },
    handleCancel() {
      this.onCancelCallback();
    },
    handleAcceptRecommendation() {
      // 接受AI推荐，自动选择预测的收藏夹
      if (this.predictedFolder) {
        this.selectedFolder = this.predictedFolder.id;
      }
      this.onAcceptRecommendationCallback(this.selectedFolder);
    },
    handleRejectRecommendation() {
      // 拒绝AI推荐，让用户手动选择
      this.onRejectRecommendationCallback();
    }
  }
};
</script>

<style scoped>
/* Styles from the original CSS can be moved here if needed */
#bfc-popup {
  /* Basic styling to make it visible */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 9999;
  display: none;
  max-width: 400px;
  width: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
#bfc-popup.show {
  display: block;
}
#bfc-popup-message {
  margin-bottom: 15px;
  line-height: 1.5;
}
#bfc-popup-favlist-container {
  margin-bottom: 15px;
}
#bfc-popup-favlist-container label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
#bfc-favlist-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
#bfc-popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.bfc-popup-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.bfc-popup-button:hover {
  background-color: #e0e0e0;
}
.bfc-popup-button.primary {
  background-color: #fb7299;
  color: white;
  border-color: #fb7299;
}
.bfc-popup-button.primary:hover {
  background-color: #e06188;
}
.bfc-hidden {
    display: none;
}
</style>