import { provide, inject } from 'vue';
import { settingsService, classificationService, diagnosisService, analyticsService, folderService } from '../services/index.js';
import { useSettingsStore, useClassificationStore, useDiagnosisStore, useUIStore } from '../stores/index.js';
import eventBus from './eventBus.js';

// 定义注入键
export const SettingsServiceKey = Symbol('settingsService');
export const ClassificationServiceKey = Symbol('classificationService');
export const DiagnosisServiceKey = Symbol('diagnosisService');
export const AnalyticsServiceKey = Symbol('analyticsService');
export const FolderServiceKey = Symbol('folderService');
export const SettingsStoreKey = Symbol('settingsStore');
export const ClassificationStoreKey = Symbol('classificationStore');
export const DiagnosisStoreKey = Symbol('diagnosisStore');
export const UIStoreKey = Symbol('uiStore');
export const EventBusKey = Symbol('eventBus');

// 在根组件中提供服务和store
export function provideAppServices() {
  provide(SettingsServiceKey, settingsService);
  provide(ClassificationServiceKey, classificationService);
  provide(DiagnosisServiceKey, diagnosisService);
  provide(AnalyticsServiceKey, analyticsService);
  provide(FolderServiceKey, folderService);
  provide(SettingsStoreKey, useSettingsStore());
  provide(ClassificationStoreKey, useClassificationStore());
  provide(DiagnosisStoreKey, useDiagnosisStore());
  provide(UIStoreKey, useUIStore());
  provide(EventBusKey, eventBus);
}

// 在子组件中注入服务
export function useSettingsService() {
  return inject(SettingsServiceKey);
}

export function useClassificationService() {
  return inject(ClassificationServiceKey);
}

export function useDiagnosisService() {
  return inject(DiagnosisServiceKey);
}

export function useAnalyticsService() {
  return inject(AnalyticsServiceKey);
}

export function useFolderService() {
  return inject(FolderServiceKey);
}

// 在子组件中注入store
export function useSettingsStoreInject() {
  return inject(SettingsStoreKey);
}

export function useClassificationStoreInject() {
  return inject(ClassificationStoreKey);
}

export function useDiagnosisStoreInject() {
  return inject(DiagnosisStoreKey);
}

export function useUIStoreInject() {
  return inject(UIStoreKey);
}

// 在子组件中注入事件总线
export function useEventBusInject() {
  return inject(EventBusKey);
}