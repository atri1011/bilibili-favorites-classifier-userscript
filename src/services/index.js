import { SettingsService } from './SettingsService.js';
import { ClassificationService } from './ClassificationService.js';
import { DiagnosisService } from './DiagnosisService.js';
import { AnalyticsService } from './AnalyticsService.js';
import { FolderService } from './FolderService.js';

// 创建单例实例
const settingsService = new SettingsService();
const classificationService = new ClassificationService();
const diagnosisService = new DiagnosisService();
const analyticsService = new AnalyticsService();
const folderService = new FolderService();

export {
  SettingsService,
  ClassificationService,
  DiagnosisService,
  AnalyticsService,
  FolderService,
  settingsService,
  classificationService,
  diagnosisService,
  analyticsService,
  folderService
};