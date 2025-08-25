<template>
  <MainLayout>
    <TabNavigation />
    
    <SettingsView
      v-show="activeTab === 'settings'"
      :settings="settings"
      :advanced-settings-visible="advancedSettingsVisible"
      @update:settings="updateSettings"
      @save-settings="saveSettings"
      @toggle-advanced="toggleAdvancedSettings"
      @restore-prompt="restoreDefaultPrompt"
    />
    
    <ClassifyView
      v-show="activeTab === 'classify' && !resultsVisible"
      :current-step="currentStep"
      :all-folders="allFolders"
      :available-target-folders="availableTargetFolders"
      :force-reclassify="forceReclassify"
      @update:forceReclassify="setForceReclassify"
      :batch-size="batchSize"
      @update:batchSize="setBatchSize"
      :task-running="taskRunning"
      :is-paused="isPaused"
      :logs="logs"
      @update:selectedSourceFolders="updateSelectedSourceFolders"
      @update:selectedTargetFolders="updateSelectedTargetFolders"
      @batch-create="batchCreate"
      @start-classification="startClassification"
      @toggle-pause="togglePause"
      @stop-classification="stopClassification"
      @prev-step="prevStep"
      @next-step="nextStep"
    >
      <LogPanel />
    </ClassifyView>


    <ResultsView
      v-if="resultsVisible"
      :classification-results="classificationResults"
      :chart-data="chartData"
      :summary="taskSummary"
      :all-folders="allFolders"
      @apply-corrections="applyCorrections"
      @close-results="closeResultsView"
    />

    <BeautifyView v-show="activeTab === 'beautify'" />

  </MainLayout>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { provideAppServices } from './utils/provideInject.js';
import { useSettingsStore } from './stores/index.js';
import { useClassificationStore } from './stores/index.js';
import { useUIStore } from './stores/index.js';
import { useFloatingRecommendationStore } from './stores/index.js';
import { settingsService, classificationService, folderService } from './services/index.js';
import BatchCreator from './batch-creator.js';
import MainLayout from './components/MainLayout.vue';
import TabNavigation from './components/TabNavigation.vue';
import LogPanel from './components/LogPanel.vue';
import SettingsView from './components/SettingsView.vue';
import ClassifyView from './components/ClassifyView.vue';
import ResultsView from './components/ResultsView.vue';
import BeautifyView from './components/BeautifyView.vue';


export default {
  name: 'App',
  components: {
    MainLayout,
    TabNavigation,
    LogPanel,
    SettingsView,
    ClassifyView,
    ResultsView,
    BeautifyView,
  },
  setup() {
    // 提供服务和store给子组件
    provideAppServices();

    // 使用stores
    const settingsStore = useSettingsStore();
    const classificationStore = useClassificationStore();
    const uiStore = useUIStore();

    // 计算属性
    const visible = computed(() => uiStore.isVisible);
    const activeTab = computed(() => uiStore.currentTab);
    const settings = computed(() => settingsStore);
    const advancedSettingsVisible = computed(() => settingsStore.advancedSettingsVisible);
    const blurIntensity = computed(() => settingsStore.blurIntensity);
    const allFolders = computed(() => classificationStore.allFolders);
    const selectedSourceFolders = computed(() => classificationStore.selectedSourceFolders);
    const selectedTargetFolders = computed(() => classificationStore.selectedTargetFolders);
    const batchSize = computed(() => classificationStore.batchSize);
    const forceReclassify = computed(() => classificationStore.forceReclassify);
    const taskRunning = computed(() => classificationStore.taskRunning);
    const isPaused = computed(() => classificationStore.isPaused);
    const logs = computed(() => classificationStore.logs);
    const resultsVisible = computed(() => classificationStore.resultsVisible);
    const classificationResults = computed(() => classificationStore.classificationResults);
    const chartData = computed(() => classificationStore.chartData);
    const currentStep = computed(() => classificationStore.currentStep);
    const taskSummary = computed(() => classificationStore.taskSummary);
    const availableTargetFolders = computed(() => classificationStore.availableTargetFolders);

    // 生命周期钩子
    onMounted(async () => {
      // 在收藏夹页面，我们希望模态窗口一打开就加载数据
      // 因此移除 window.location.hash 的检查
      uiStore.setVisible(true);
      await settingsService.loadSettings();
      await initSettingsPage();
      checkForUnfinishedTask();
      updateBlurEffect(blurIntensity.value);
    });

    // 监听模糊度变化并更新CSS变量
    watch(blurIntensity, (newValue) => {
      updateBlurEffect(newValue);
    });

    function updateBlurEffect(value) {
      document.documentElement.style.setProperty('--blur-intensity', `${value}px`);
    }

    // 初始化设置页面
    async function initSettingsPage() {
      try {
        await classificationService.initClassificationPage();
      } catch (error) {
        classificationStore.addLog(error.message, 'error');
      }
    }

    // 检查未完成的任务
    function checkForUnfinishedTask() {
      if (classificationStore.hasPendingTask()) {
        const pendingCount = classificationStore.loadPendingVideos().length;
        if (pendingCount > 0 && confirm(`检测到有 ${pendingCount} 个视频上次未完成分类，是否继续？`)) {
          startClassification();
        } else {
          classificationStore.clearPendingData();
        }
      }
    }

    // 设置相关方法
    async function updateSettings(newSettings) {
      settingsService.updateSettings(newSettings);
      
    }

    async function saveSettings() {
      await settingsService.saveSettings();
      classificationStore.addLog('设置已保存', 'success');
    }

    function toggleAdvancedSettings() {
      settingsService.toggleAdvancedSettings();
    }

    function restoreDefaultPrompt() {
      settingsService.restoreDefaultPrompt();
      classificationStore.addLog('已恢复默认Prompt模板。', 'info');
    }

    // 分类相关方法
    function startClassification() {
      classificationService.startClassification();
    }

    function togglePause() {
      classificationService.togglePause();
    }

    function stopClassification() {
      classificationService.stopClassification();
    }

    function updateSelectedSourceFolders(selectedIds) {
      classificationService.updateSelectedSourceFolders(selectedIds);
    }

    function updateSelectedTargetFolders(selectedIds) {
      classificationService.updateSelectedTargetFolders(selectedIds);
    }

    function setBatchSize(size) {
      classificationService.setBatchSize(size);
    }

    function setForceReclassify(force) {
      classificationService.setForceReclassify(force);
    }

    function prevStep() {
      classificationService.prevStep();
    }

    function nextStep() {
      classificationService.nextStep();
    }

    function applyCorrections() {
      classificationService.applyCorrections();
    }

    function closeResultsView() {
      classificationService.closeResultsView();
    }


    // 批量创建
    function batchCreate() {
      BatchCreator.start();
    }

    return {
      visible,
      activeTab,
      settings,
      advancedSettingsVisible,
      allFolders,
      selectedSourceFolders,
      selectedTargetFolders,
      batchSize,
      forceReclassify,
      taskRunning,
      isPaused,
      logs,
      resultsVisible,
      classificationResults,
      chartData,
      currentStep,
      taskSummary,
      availableTargetFolders,
      updateSettings,
      saveSettings,
      toggleAdvancedSettings,
      restoreDefaultPrompt,
      startClassification,
      togglePause,
      stopClassification,
      updateSelectedSourceFolders,
      updateSelectedTargetFolders,
      setBatchSize,
      setForceReclassify,
      prevStep,
      nextStep,
      applyCorrections,
      closeResultsView,
      batchCreate
    };
  }
};
</script>

<style>
/* All styles from style.css will be moved here or handled by the build process */
.bfc-hidden {
    display: none !important;
}
</style>