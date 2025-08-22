import { useDiagnosisStore } from '../stores/index.js';
import { useClassificationStore } from '../stores/index.js';
import { useSettingsStore } from '../stores/index.js';
import BilibiliAPI from '../api.js';
import AIClassifier from '../ai.js';

export class DiagnosisService {
  constructor() {
    this.diagnosisStore = null;
    this.classificationStore = null;
    this.settingsStore = null;
  }

  // 获取 store 实例（延迟初始化）
  getDiagnosisStore() {
    if (!this.diagnosisStore) {
      this.diagnosisStore = useDiagnosisStore();
    }
    return this.diagnosisStore;
  }

  getClassificationStore() {
    if (!this.classificationStore) {
      this.classificationStore = useClassificationStore();
    }
    return this.classificationStore;
  }

  getSettingsStore() {
    if (!this.settingsStore) {
      this.settingsStore = useSettingsStore();
    }
    return this.settingsStore;
  }

  // 开始诊断
  async startDiagnosis() {
    const classificationStore = this.getClassificationStore();
    const diagnosisStore = this.getDiagnosisStore();
    
    classificationStore.addLog('开始收藏夹智能诊断...', 'info');
    diagnosisStore.startDiagnosis();

    try {
      const allFolderIds = classificationStore.allFolders.map(f => f.id);
      if (allFolderIds.length === 0) {
        throw new Error("未能获取到任何收藏夹。");
      }

      diagnosisStore.updateProgress(0, `正在从 ${allFolderIds.length} 个收藏夹中获取所有视频...`);
      
      const allVideos = await BilibiliAPI.getAllVideosFromFavoritesParallel(
        allFolderIds,
        (fetchedCount, isDone) => {
          if (!isDone) {
            diagnosisStore.updateProgress(
              Math.min(50, (fetchedCount / 100) * 50), // 限制进度到50%
              `已获取 ${fetchedCount} 个视频...`
            );
          }
        }
      );
      
      classificationStore.addLog(`共获取到 ${allVideos.length} 个视频，准备进行AI分析。`, 'info');
      
      if (allVideos.length === 0) {
        classificationStore.addLog('未找到任何视频，诊断结束。', 'info');
        diagnosisStore.completeDiagnosis();
        return;
      }

      const formatInfo = this.analyzeExistingFolderFormats(classificationStore.allFolders);
      classificationStore.addLog(`检测到主导格式: ${formatInfo.dominantFormat}`, 'info');

      // 分析视频
      diagnosisStore.updateProgress(50, '正在分析视频内容...');
      let allClusters = await this.analyzeVideosInParallel(allVideos, formatInfo);
      
      // 合并相似集群
      diagnosisStore.updateProgress(80, '正在进行语义合并...');
      let mergedClusters = await this.mergeSimilarClusters(allClusters);
      
      // 过滤掉视频数量过少的集群
      mergedClusters = mergedClusters.filter(cluster =>
        cluster.video_titles.length >= diagnosisStore.diagnosisConfig.minVideosPerCategory
      );

      diagnosisStore.setDiagnosisReport({ newGroups: mergedClusters });
      classificationStore.addLog(`诊断报告已生成！共建议创建 ${mergedClusters.length} 个新收藏夹。`, 'success');
      diagnosisStore.completeDiagnosis();

    } catch (error) {
      classificationStore.addLog(`诊断过程中发生错误: ${error.message}`, 'error');
      diagnosisStore.completeDiagnosis();
    }
  }

  // 分析现有收藏夹格式
  analyzeExistingFolderFormats(folders) {
    const patterns = [];
    const formatCounts = {};

    for (const folder of folders) {
      const name = folder.title;
      let format = '单一类别';
      
      if (name.includes(' - ')) format = '主类别 - 子类别';
      else if (name.includes('：')) format = '主类别：子类别';
      else if (name.includes('|')) format = '主类别|子类别';
      
      patterns.push({ pattern: format, example: name });
      formatCounts[format] = (formatCounts[format] || 0) + 1;
    }

    const dominantFormat = Object.keys(formatCounts).length > 0 
      ? Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0][0] 
      : '主类别 - 子类别';
      
    return { dominantFormat, patterns, formatCounts };
  }

  // 并行分析视频
  async analyzeVideosInParallel(allVideos, formatInfo) {
    const settingsStore = this.getSettingsStore();
    const diagnosisStore = this.getDiagnosisStore();
    const classificationStore = this.getClassificationStore();
    
    const modelName = settingsStore.getModelName;
    const avgContentLength = allVideos.reduce((sum, video) =>
      sum + video.title.length + (video.intro || '').length, 0) / (allVideos.length || 1);
    
    const dynamicBatchSize = diagnosisStore.diagnosisConfig.dynamicBatchSize && avgContentLength > 200
      ? 30
      : 50;
    
    const chunks = [];
    for (let i = 0; i < allVideos.length; i += dynamicBatchSize) {
      chunks.push(allVideos.slice(i, i + dynamicBatchSize));
    }

    const results = [];
    const maxConcurrent = diagnosisStore.diagnosisConfig.maxConcurrentAnalysis;
    let running = 0;
    let completed = 0;

    return new Promise((resolve) => {
      function run() {
        while (running < maxConcurrent && chunks.length > 0) {
          running++;
          const chunk = chunks.shift();
          
          AIClassifier.analyzeVideosForClustering(
            chunk,
            settingsStore.apiKey,
            settingsStore.apiHost,
            modelName,
            formatInfo,
            diagnosisStore.diagnosisConfig.minVideosPerCategory
          )
            .then(clusters => {
              results.push(...clusters);
              completed++;
              const progress = 50 + ((completed / (chunks.length + completed)) * 30); // 50-80%
              diagnosisStore.updateProgress(progress, `正在分析视频... ${Math.round(progress)}%`);
            })
            .catch(error => {
              classificationStore.addLog(`一个分析批次失败: ${error.message}`, 'error');
            })
            .finally(() => {
              running--;
              if (chunks.length === 0 && running === 0) {
                resolve(results);
              } else {
                run.call(this);
              }
            });
        }
      }
      run.call(this);
    });
  }

  // 合并相似集群
  async mergeSimilarClusters(clusters) {
    const diagnosisStore = this.getDiagnosisStore();
    const settingsStore = this.getSettingsStore();
    const classificationStore = this.getClassificationStore();
    
    if (clusters.length <= 1 || !diagnosisStore.diagnosisConfig.enableSemanticMerge) {
      return clusters;
    }
    
    diagnosisStore.updateProgress(80, '正在进行语义合并...');
    const clusterNames = clusters.map(c => c.category_name);
    const modelName = settingsStore.getModelName;
    
    try {
      const mergeSuggestions = await AIClassifier.getMergeSuggestions(
        clusterNames,
        settingsStore.apiKey,
        settingsStore.apiHost,
        modelName
      );
      
      const mergedClusters = [];
      const processedNames = new Set();

      if (mergeSuggestions.merge_groups) {
        for (const group of mergeSuggestions.merge_groups) {
          const sourceClusters = clusters.filter(c =>
            group.source_names.includes(c.category_name)
          );
          
          if (sourceClusters.length > 0) {
            mergedClusters.push({
              category_name: group.target_name,
              video_titles: sourceClusters.flatMap(c => c.video_titles),
              selected: true
            });
            group.source_names.forEach(name => processedNames.add(name));
          }
        }
      }

      clusters.forEach(cluster => {
        if (!processedNames.has(cluster.category_name)) {
          mergedClusters.push({ ...cluster, selected: true });
        }
      });
      
      return mergedClusters;
    } catch (error) {
      classificationStore.addLog(`语义合并失败: ${error.message}`, 'error');
      return clusters.map(c => ({ ...c, selected: true })); // 降级处理
    }
  }

  // 应用诊断建议
  async applyDiagnosis() {
    const diagnosisStore = this.getDiagnosisStore();
    const classificationStore = this.getClassificationStore();
    
    if (!diagnosisStore.hasDiagnosisReport || !diagnosisStore.diagnosisReport.newGroups) {
      classificationStore.addLog('没有可应用的诊断建议。', 'error');
      return;
    }

    const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
    const csrf = csrfMatch ? csrfMatch[1] : null;
    
    if (!csrf) {
      classificationStore.addLog('无法执行优化：缺少CSRF Token。', 'error');
      return;
    }

    const selectedGroups = diagnosisStore.getSelectedGroups();
    if (selectedGroups.length === 0) {
      classificationStore.addLog('请至少选择一个要创建的分组。', 'info');
      return;
    }

    classificationStore.addLog(`准备执行优化，将创建 ${selectedGroups.length} 个新收藏夹...`, 'info');

    for (const group of selectedGroups) {
      try {
        classificationStore.addLog(`正在创建收藏夹: 「${group.category_name}」...`, 'info');
        await BilibiliAPI.createFolder(group.category_name, csrf);
        classificationStore.addLog(`收藏夹 「${group.category_name}」 创建成功！`, 'success');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        classificationStore.addLog(`创建收藏夹 「${group.category_name}」 失败: ${error.message}`, 'error');
      }
    }
    
    classificationStore.addLog('选定的优化操作已执行完毕！请刷新页面查看新的收藏夹。', 'success');
    diagnosisStore.setDiagnosisReport(null);
  }

  // 更新诊断配置
  updateDiagnosisConfig(config) {
    const diagnosisStore = this.getDiagnosisStore();
    diagnosisStore.updateDiagnosisConfig(config);
  }

  // 更新分组选择
  updateGroupSelection(index, selected) {
    const diagnosisStore = this.getDiagnosisStore();
    diagnosisStore.updateGroupSelection(index, selected);
  }

  // 重置诊断
  resetDiagnosis() {
    const diagnosisStore = this.getDiagnosisStore();
    diagnosisStore.resetDiagnosis();
  }
}