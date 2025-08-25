import { SettingsService } from './SettingsService.js';
import { ClassificationService } from './ClassificationService.js';
import { FolderService } from './FolderService.js';

// 创建单例实例
const settingsService = new SettingsService();
const classificationService = new ClassificationService();
const folderService = new FolderService();

export {
  SettingsService,
  ClassificationService,
  FolderService,
  settingsService,
  classificationService,
  folderService
};