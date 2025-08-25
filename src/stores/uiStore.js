import { defineStore } from 'pinia';
import { GM } from '../utils/gmAdapter.js';

export const useUIStore = defineStore('ui', {
  state: () => ({
    visible: false,
    activeTab: 'settings',
    mid: null,
    isModalOpen: false
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

    openModal() {
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
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
    
  }
});