<template>
  <div id="bfc-results-view">
    <h3>分类结果</h3>
    <div class="bfc-results-summary">
      <div class="bfc-chart-container">
        <Doughnut v-if="chartData" :data="chartData" />
      </div>
      <div class="bfc-results-stats">
        <p><strong>总计:</strong> {{ classificationResults.length }} 个视频</p>
        <p class="success"><strong>成功:</strong> {{ summary.success }}</p>
        <p class="info"><strong>跳过:</strong> {{ summary.skipped }}</p>
        <p class="error"><strong>失败:</strong> {{ summary.failed }}</p>
      </div>
    </div>
    <div class="bfc-results-table-container">
      <table class="bfc-results-table">
        <thead>
          <tr>
            <th>视频标题</th>
            <th>原始收藏夹</th>
            <th>AI推荐收藏夹 (可修改)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in mutableResults" :key="index">
            <td><a :href="'https://www.bilibili.com/video/' + result.video.bvid" target="_blank">{{ result.video.title }}</a></td>
            <td>{{ getFolderName(result.video.sourceMediaId) }}</td>
            <td>
              <select v-model="result.correctedTargetFolderId" class="bfc-select">
                <option v-for="folder in allFolders" :key="folder.id" :value="folder.id">
                  {{ folder.title }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bfc-action-buttons" style="margin-top: 20px;">
      <button id="bfc-apply-corrections-btn" class="bfc-button" @click="$emit('apply-corrections', mutableResults)">应用修正</button>
      <button id="bfc-back-to-main-btn" class="bfc-button" @click="$emit('close-results')" style="background-color: #6c757d;">返回主界面</button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: 'ResultsView',
  components: {
    Doughnut
  },
  props: {
    classificationResults: {
      type: Array,
      required: true
    },
    chartData: {
      type: Object,
      default: null
    },
    summary: {
      type: Object,
      required: true
    },
    allFolders: {
      type: Array,
      required: true
    }
  },
  emits: ['apply-corrections', 'close-results'],
  setup(props) {
    const mutableResults = ref([]);

    watch(() => props.classificationResults, (newVal) => {
      mutableResults.value = JSON.parse(JSON.stringify(newVal));
    }, { immediate: true, deep: true });

    const getFolderName = (folderId) => {
      const folder = props.allFolders.find(f => f.id === folderId);
      return folder ? folder.title : '未知';
    };

    return {
      mutableResults,
      getFolderName
    };
  }
};
</script>