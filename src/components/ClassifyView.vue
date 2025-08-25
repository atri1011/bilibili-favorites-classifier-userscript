<template>
  <div id="bfc-main-view">
    <div class="bfc-steps-indicator">
      <div class="bfc-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">1. 选择源</div>
      <div class="bfc-step-line"></div>
      <div class="bfc-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">2. 选择目标</div>
      <div class="bfc-step-line"></div>
      <div class="bfc-step" :class="{ active: currentStep === 3 }">3. 开始任务</div>
    </div>

    <!-- Step 1: Select Source Folders -->
    <div v-show="currentStep === 1">
      <h3>步骤一：选择源收藏夹</h3>
      <p class="step-description">请直接点击左侧列表中的收藏夹，将其添加到右侧“已选”列表中。</p>
      <TransferList :items="allFolders" left-title="所有收藏夹" right-title="已选源收藏夹" @update:selected="$emit('update:selectedSourceFolders', $event)" />
      <button id="bfc-batch-create-btn" class="bfc-button" @click="$emit('batch-create')" style="margin-top: 15px;">一键创建推荐收藏夹</button>
    </div>

    <!-- Step 2: Select Target Folders -->
    <div v-show="currentStep === 2">
      <h3>步骤二：选择目标收藏夹</h3>
      <p class="step-description">请选择分类的目标收藏夹。AI将会把视频智能地移动到这些收藏夹中。</p>
      <div class="bfc-form-group">
        <div class="bfc-checkbox-item">
          <input type="checkbox" id="bfc-force-reclassify" :checked="forceReclassify" @change="$emit('update:forceReclassify', $event.target.checked)">
          <label for="bfc-force-reclassify">允许选择源收藏夹作为目标 (用于强制重新分类)</label>
        </div>
      </div>
      <TransferList :items="availableTargetFolders" left-title="可用目标收藏夹" right-title="已选目标收藏夹" @update:selected="$emit('update:selectedTargetFolders', $event)" />
    </div>

    <!-- Step 3: Settings & Start -->
    <div v-show="currentStep === 3">
      <h3>步骤三：设置并开始</h3>
      <div class="bfc-form-group">
        <label for="batch-size-input">每批处理视频数</label>
        <input type="number" id="batch-size-input" class="bfc-input" :value="batchSize" @input="$emit('update:batchSize', parseInt($event.target.value, 10))">
      </div>
      <div class="bfc-action-buttons">
        <button id="bfc-start-btn" class="bfc-button" @click="$emit('start-classification')" :class="{ 'bfc-hidden': taskRunning }">开始分类</button>
        <button id="bfc-pause-resume-btn" class="bfc-button" :class="{ 'bfc-hidden': !taskRunning }" @click="$emit('toggle-pause')">
          {{ isPaused ? '恢复' : '暂停' }}
        </button>
        <button id="bfc-stop-btn" class="bfc-button bfc-button-danger" :class="{ 'bfc-hidden': !taskRunning }" @click="$emit('stop-classification')">停止</button>
      </div>
    </div>

    <div class="bfc-step-navigation">
      <button v-if="currentStep > 1" @click="$emit('prev-step')" class="bfc-button">上一步</button>
      <button v-if="currentStep < 3" @click="$emit('next-step')" class="bfc-button">下一步</button>
    </div>

    <div id="bfc-log-controls"></div>
    <div id="bfc-log" ref="logContainer" style="margin-top: 10px; height: 200px; overflow-y: scroll; background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); padding: 10px; border-radius: 6px;">
      <div v-for="(log, index) in logs" :key="index" :class="['bfc-log-item', log.type]">{{ log.message }}</div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import TransferList from './TransferList.vue';

export default {
  name: 'ClassifyView',
  components: {
    TransferList
  },
  props: {
    currentStep: Number,
    allFolders: Array,
    availableTargetFolders: Array,
    forceReclassify: Boolean,
    batchSize: Number,
    taskRunning: Boolean,
    isPaused: Boolean,
    logs: Array
  },
  emits: [
    'update:selectedSourceFolders',
    'update:selectedTargetFolders',
    'update:forceReclassify',
    'update:batchSize',
    'batch-create',
    'start-classification',
    'toggle-pause',
    'stop-classification',
    'prev-step',
    'next-step'
  ],
  setup(props) {
    const logContainer = ref(null);

    watch(() => props.logs, () => {
      nextTick(() => {
        if (logContainer.value) {
          logContainer.value.scrollTop = logContainer.value.scrollHeight;
        }
      });
    }, { deep: true });

    return {
      logContainer
    };
  }
};
</script>