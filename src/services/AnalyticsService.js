import { useUIStore } from '../stores/index.js';

export class AnalyticsService {
  constructor() {
    this.uiStore = null;
  }

  // 获取 uiStore 实例（延迟初始化）
  getUIStore() {
    if (!this.uiStore) {
      this.uiStore = useUIStore();
    }
    return this.uiStore;
  }

  // 加载分析数据
  loadAnalyticsData() {
    this.getUIStore().loadAnalyticsData();
  }

  // 处理数据并生成图表数据
  processAnalyticsData(period) {
    const uiStore = this.getUIStore();
    const filteredData = uiStore.getFilteredAnalyticsData(period);
    
    if (filteredData.length === 0) {
      return null;
    }

    const folderCounts = filteredData.reduce((acc, item) => {
      const folderName = item.targetFolderName || '未知';
      acc[folderName] = (acc[folderName] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(folderCounts);
    const data = Object.values(folderCounts);

    return {
      labels: labels,
      datasets: [
        {
          backgroundColor: [
            '#fb7299', '#00a1d6', '#ffc107', '#28a745',
            '#6c757d', '#17a2b8', '#fd7e14', '#6610f2'
          ],
          data: data
        }
      ]
    };
  }

  // 获取总收藏数
  getTotalCount(period) {
    const uiStore = this.getUIStore();
    const filteredData = uiStore.getFilteredAnalyticsData(period);
    return filteredData.length;
  }

  // 添加分析记录
  addAnalyticsRecord(record) {
    this.getUIStore().addAnalyticsRecord(record);
  }

  // 获取分析数据
  getAnalyticsData() {
    const uiStore = this.getUIStore();
    return uiStore.analyticsData;
  }

  // 获取按时间段过滤的数据
  getFilteredData(period) {
    const uiStore = this.getUIStore();
    return uiStore.getFilteredAnalyticsData(period);
  }
}