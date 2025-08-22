import { defineStore } from 'pinia';
import { GM } from '../utils/gmAdapter.js';

export const useUIStore = defineStore('ui', {
  state: () => ({
    visible: false,
    activeTab: 'settings',
    mid: null,
    analyticsData: []
  }),
  
  getters: {
    isVisible: (state) => {
      return state.visible;
    },
    
    currentTab: (state) => {
      return state.activeTab;
    },
    
    userMid: (state) => {
      return state.mid;
    },
    
    hasUserMid: (state) => {
      return state.mid !== null;
    }
  },
  
  actions: {
    setVisible(visible) {
      this.visible = visible;
    },
    
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    
    setMid(mid) {
      this.mid = mid;
    },
    
    showPanel() {
      this.visible = true;
    },
    
    hidePanel() {
      this.visible = false;
    },
    
    switchToSettingsTab() {
      this.activeTab = 'settings';
    },
    
    switchToClassifyTab() {
      this.activeTab = 'classify';
    },
    
    switchToDiagnoseTab() {
      this.activeTab = 'diagnose';
    },
    
    switchToAnalyticsTab() {
      this.activeTab = 'analytics';
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
      } catch (error) {
        console.error('加载分析数据失败:', error);
        this.analyticsData = [];
      }
    },
    
    addAnalyticsRecord(record) {
      const data = JSON.parse(GM.getValue('bfc-analytics-data', '[]'));
      data.push(record);
      GM.setValue('bfc-analytics-data', JSON.stringify(data));
      this.loadAnalyticsData();
    },
    
    getFilteredAnalyticsData(period) {
      const now = new Date();
      let filteredData = [];

      switch (period) {
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

      return filteredData;
    }
  }
});