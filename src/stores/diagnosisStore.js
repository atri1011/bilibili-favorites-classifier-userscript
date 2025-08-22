import { defineStore } from 'pinia';

export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    diagnosisState: {
      running: false,
      progress: 0,
      message: ''
    },
    diagnosisReport: null,
    diagnosisConfig: {
      maxConcurrentAnalysis: 3,
      dynamicBatchSize: true,
      minVideosPerCategory: 3,
      enableSemanticMerge: true,
      strictFormatMatching: true
    }
  }),
  
  getters: {
    isDiagnosisRunning: (state) => {
      return state.diagnosisState.running;
    },
    
    diagnosisProgress: (state) => {
      return state.diagnosisState.progress;
    },
    
    diagnosisMessage: (state) => {
      return state.diagnosisState.message;
    },
    
    hasDiagnosisReport: (state) => {
      return state.diagnosisReport !== null;
    }
  },
  
  actions: {
    setDiagnosisState(state) {
      this.diagnosisState = { ...this.diagnosisState, ...state };
    },
    
    setDiagnosisReport(report) {
      this.diagnosisReport = report;
    },
    
    updateDiagnosisConfig(config) {
      this.diagnosisConfig = { ...this.diagnosisConfig, ...config };
    },
    
    startDiagnosis() {
      this.diagnosisState = {
        running: true,
        progress: 0,
        message: '初始化...'
      };
      this.diagnosisReport = null;
    },
    
    updateProgress(progress, message) {
      this.diagnosisState.progress = progress;
      if (message) {
        this.diagnosisState.message = message;
      }
    },
    
    completeDiagnosis() {
      this.diagnosisState.running = false;
      this.diagnosisState.progress = 100;
      this.diagnosisState.message = '诊断完成';
    },
    
    resetDiagnosis() {
      this.diagnosisState = {
        running: false,
        progress: 0,
        message: ''
      };
      this.diagnosisReport = null;
    },
    
    updateGroupSelection(index, selected) {
      if (this.diagnosisReport && this.diagnosisReport.newGroups) {
        const newReport = JSON.parse(JSON.stringify(this.diagnosisReport));
        newReport.newGroups[index].selected = selected;
        this.diagnosisReport = newReport;
      }
    },
    
    getSelectedGroups() {
      if (!this.diagnosisReport || !this.diagnosisReport.newGroups) {
        return [];
      }
      return this.diagnosisReport.newGroups.filter(g => g.selected);
    }
  }
});