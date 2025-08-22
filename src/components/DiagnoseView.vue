<template>
  <div id="bfc-diagnose-view">
    <h3>收藏夹智能诊断</h3>
    <p>此功能会扫描您所有的收藏夹，并由AI分析视频内容，为您提供创建新分组、合并收藏夹等优化建议。</p>
    <div class="bfc-action-buttons">
      <button id="bfc-start-diagnose-btn" class="bfc-button" @click="$emit('start-diagnosis')" :disabled="diagnosisState.running">
        {{ diagnosisState.running ? '诊断中...' : '开始诊断' }}
      </button>
    </div>
    <div v-if="diagnosisState.running || diagnosisState.progress > 0">
      <p>{{ diagnosisState.message }}</p>
      <div class="bfc-progress-bar">
        <div class="bfc-progress" :style="{ width: diagnosisState.progress + '%' }"></div>
      </div>
    </div>
    <!-- Diagnosis Report -->
    <div id="bfc-diagnose-report" v-if="diagnosisReport">
      <h4>诊断报告</h4>
      <div class="bfc-report-section">
        <h5>建议创建的新分组</h5>
        <div v-for="(group, index) in diagnosisReport.newGroups" :key="index" class="bfc-report-item">
          <input type="checkbox" :checked="group.selected" @change="updateGroupSelection(index, $event.target.checked)">
          <strong>{{ group.category_name }}</strong> ({{ group.video_titles.length }}个视频)
          <ul>
            <li v-for="title in group.video_titles.slice(0, 3)" :key="title">{{ title }}</li>
            <li v-if="group.video_titles.length > 3">...等</li>
          </ul>
        </div>
      </div>
      <!-- TODO: Add sections for merging and duplicates -->
      <div class="bfc-action-buttons" style="margin-top: 20px;">
        <button id="bfc-apply-diagnosis-btn" class="bfc-button" @click="$emit('apply-diagnosis')">一键执行优化</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiagnoseView',
  props: {
    diagnosisState: {
      type: Object,
      required: true
    },
    diagnosisReport: {
      type: Object,
      default: null
    }
  },
  emits: ['start-diagnosis', 'apply-diagnosis', 'update:diagnosisReport'],
  setup(props, { emit }) {
    const updateGroupSelection = (index, selected) => {
      const newReport = JSON.parse(JSON.stringify(props.diagnosisReport));
      newReport.newGroups[index].selected = selected;
      emit('update:diagnosisReport', newReport);
    };

    return {
      updateGroupSelection
    };
  }
};
</script>