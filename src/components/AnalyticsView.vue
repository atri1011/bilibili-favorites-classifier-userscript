<template>
  <div id="bfc-analytics-view">
    <h3>数据分析</h3>
    <div class="bfc-analytics-controls">
      <button @click="setPeriod('daily')" :class="{ active: period === 'daily' }">每日</button>
      <button @click="setPeriod('weekly')" :class="{ active: period === 'weekly' }">每周</button>
      <button @click="setPeriod('monthly')" :class="{ active: period === 'monthly' }">每月</button>
      <button @click="setPeriod('yearly')" :class="{ active: period === 'yearly' }">每年</button>
    </div>
    <div class="bfc-analytics-chart-container">
      <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
      <p v-else>暂无数据</p>
    </div>
    <div class="bfc-analytics-summary">
      <p>总收藏数: {{ totalCount }}</p>
    </div>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import { GM } from '../utils/gmAdapter.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: 'AnalyticsView',
  components: {
    Doughnut
  },
  data() {
    return {
      period: 'daily', // daily, weekly, monthly, yearly
      analyticsData: [],
      totalCount: 0,
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    setPeriod(period) {
      this.period = period;
      this.processData();
    },
    loadAnalyticsData() {
      try {
        const rawData = GM.getValue('bfc-analytics-data', '[]');
        const data = JSON.parse(rawData);
        // 确保 data 是数组，如果不是则使用空数组
        const dataArray = Array.isArray(data) ? data : [];
        this.analyticsData = dataArray.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        this.processData();
      } catch (error) {
        console.error('加载分析数据失败:', error);
        this.analyticsData = [];
        this.processData();
      }
    },
    processData() {
      const now = new Date();
      let filteredData = [];

      switch (this.period) {
        case 'daily':
          filteredData = this.analyticsData.filter(item => {
            const itemDate = item.timestamp;
            return itemDate.getFullYear() === now.getFullYear() &&
                   itemDate.getMonth() === now.getMonth() &&
                   itemDate.getDate() === now.getDate();
          });
          break;
        case 'weekly':
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          filteredData = this.analyticsData.filter(item => item.timestamp >= startOfWeek);
          break;
        case 'monthly':
          filteredData = this.analyticsData.filter(item => {
            return item.timestamp.getFullYear() === now.getFullYear() &&
                   item.timestamp.getMonth() === now.getMonth();
          });
          break;
        case 'yearly':
          filteredData = this.analyticsData.filter(item => {
            return item.timestamp.getFullYear() === now.getFullYear();
          });
          break;
      }

      this.totalCount = filteredData.length;

      if (filteredData.length === 0) {
        this.chartData = null;
        return;
      }

      const folderCounts = filteredData.reduce((acc, item) => {
        const folderName = item.targetFolderName || '未知';
        acc[folderName] = (acc[folderName] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(folderCounts);
      const data = Object.values(folderCounts);

      this.chartData = {
        labels: labels,
        datasets: [
          {
            backgroundColor: ['#fb7299', '#00a1d6', '#ffc107', '#28a745', '#6c757d', '#17a2b8', '#fd7e14', '#6610f2'],
            data: data
          }
        ]
      };
    }
  },
  mounted() {
    this.loadAnalyticsData();
  }
};
</script>

<style>
#bfc-analytics-view {
  padding: 15px;
}
.bfc-analytics-controls {
  margin-bottom: 15px;
}
.bfc-analytics-controls button {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
}
.bfc-analytics-controls button.active {
  background-color: #00a1d6;
  color: white;
  border-color: #00a1d6;
}
.bfc-analytics-chart-container {
  min-height: 200px;
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;
  color: #999;
}
</style>