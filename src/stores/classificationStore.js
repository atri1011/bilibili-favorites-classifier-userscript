import { defineStore } from 'pinia';
import { GM } from '../utils/gmAdapter.js';

export const useClassificationStore = defineStore('classification', {
  state: () => ({
    allFolders: [],
    selectedSourceFolders: [],
    selectedTargetFolders: [],
    batchSize: 10,
    forceReclassify: false,
    taskRunning: false,
    isPaused: false,
    logs: [],
    resultsVisible: false,
    classificationResults: [],
    chartData: null,
    currentStep: 1,
    pendingVideos: [],
    targetFolders: [],
    
    // 悬浮推荐相关状态
    floatingRecommendationEnabled: true, // 是否启用悬浮推荐功能
    lastVideoUrl: '', // 上次处理的视频URL，用于避免重复处理
    recommendationHistory: [] // 推荐历史记录
  }),
  
  getters: {
    availableTargetFolders: (state) => {
      if (state.forceReclassify) {
        return state.allFolders;
      }
      return state.allFolders.filter(folder => !state.selectedSourceFolders.includes(folder.id));
    },
    
    hasSelectedSourceFolders: (state) => {
      return state.selectedSourceFolders.length > 0;
    },
    
    hasSelectedTargetFolders: (state) => {
      return state.selectedTargetFolders.length > 0;
    },
    
    taskSummary: (state) => {
      return state.classificationResults.reduce((acc, result) => {
        if (result.status === 'success') acc.success++;
        else if (result.status === 'skipped') acc.skipped++;
        else if (result.status === 'failed') acc.failed++;
        return acc;
      }, { success: 0, skipped: 0, failed: 0 });
    }
  },
  
  actions: {
    updateSelectedSourceFolders(selectedIds) {
      this.selectedSourceFolders = selectedIds;
    },
    
    updateSelectedTargetFolders(selectedIds) {
      this.selectedTargetFolders = selectedIds;
    },
    
    addLog(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString();
      this.logs.push({ message: `[${timestamp}] ${message}`, type });
    },
    
    clearLogs() {
      this.logs = [];
    },
    
    setTaskRunning(running) {
      this.taskRunning = running;
    },
    
    setPaused(paused) {
      this.isPaused = paused;
    },
    
    setResultsVisible(visible) {
      this.resultsVisible = visible;
    },
    
    setClassificationResults(results) {
      this.classificationResults = results;
    },
    
    setChartData(data) {
      this.chartData = data;
    },
    
    setCurrentStep(step) {
      this.currentStep = step;
    },
    
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    
    resetResults() {
      this.resultsVisible = false;
      this.classificationResults = [];
      this.chartData = null;
    },
    
    savePendingVideos(videos) {
      this.pendingVideos = videos;
      GM.setValue('bfc-pending-videos', JSON.stringify(videos));
    },
    
    saveTargetFolders(folders) {
      this.targetFolders = folders;
      GM.setValue('bfc-target-folders', JSON.stringify(folders));
    },
    
    loadPendingVideos() {
      const pendingVideosStr = GM.getValue('bfc-pending-videos', null);
      if (pendingVideosStr) {
        this.pendingVideos = JSON.parse(pendingVideosStr);
        return this.pendingVideos;
      }
      return [];
    },
    
    loadTargetFolders() {
      const targetFoldersStr = GM.getValue('bfc-target-folders', null);
      if (targetFoldersStr) {
        this.targetFolders = JSON.parse(targetFoldersStr);
        return this.targetFolders;
      }
      return [];
    },
    
    clearPendingData() {
      this.pendingVideos = [];
      this.targetFolders = [];
      GM.deleteValue('bfc-pending-videos');
      GM.deleteValue('bfc-target-folders');
    },
    
    hasPendingTask() {
      const pendingVideosStr = GM.getValue('bfc-pending-videos', null);
      return pendingVideosStr && JSON.parse(pendingVideosStr).length > 0;
    },
    
    shouldProcessVideo(currentUrl) {
      // 检查是否需要处理当前视频，避免重复处理
      const shouldProcess = this.lastVideoUrl !== currentUrl;
      console.log('[BFC Debug] 检查是否需要处理视频:', {
        currentUrl,
        lastVideoUrl: this.lastVideoUrl,
        shouldProcess,
      });
      return shouldProcess;
    },
    
    setLastVideoUrl(url) {
      // 更新最后处理的视频URL
      console.log('[BFC Debug] 更新最后处理的视频URL:', url);
      this.lastVideoUrl = url;
    },
    
  }
});