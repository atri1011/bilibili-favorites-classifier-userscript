import { useClassificationStore } from '../stores/index.js';
import { useSettingsStore } from '../stores/index.js';
import { useUIStore } from '../stores/index.js';
import BilibiliAPI from '../api.js';
import AIClassifier from '../ai.js';
import { settingsService } from '../services/index.js';

export class ClassificationService {
  constructor() {
    this.classificationStore = null;
    this.settingsStore = null;
    this.uiStore = null;
  }

  // 获取 store 实例（延迟初始化）
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

  getSettingsService() {
    return settingsService;
  }

  getUIStore() {
    if (!this.uiStore) {
      this.uiStore = useUIStore();
    }
    return this.uiStore;
  }

  // 初始化分类页面
  async initClassificationPage() {
    try {
      const midMatch = document.cookie.match(/DedeUserID=([^;]+)/);
      if (!midMatch) {
        await this.fetchUserInfo();
      } else {
        this.getUIStore().setMid(midMatch[1]);
      }
      
      await this.loadFavoritesData();
    } catch (error) {
      this.getClassificationStore().addLog(error.message, 'error');
    }
  }

  // 获取用户信息
  async fetchUserInfo() {
    try {
      const userInfo = await BilibiliAPI.getUserInfo();
      this.getUIStore().setMid(userInfo.mid);
      await this.loadFavoritesData();
    } catch (error) {
      this.getClassificationStore().addLog('获取用户信息失败，无法加载收藏夹', 'error');
      throw error;
    }
  }

  // 加载收藏夹数据
  async loadFavoritesData() {
    const uiStore = this.getUIStore();
    const classificationStore = this.getClassificationStore();
    
    if (!uiStore.hasUserMid) {
      throw new Error('用户MID不存在');
    }

    classificationStore.addLog(`成功获取到用户MID: ${uiStore.userMid}`, 'info');
    classificationStore.addLog('正在获取收藏夹列表...');
    
    try {
      const folders = await BilibiliAPI.getAllFavorites(uiStore.userMid);
      classificationStore.allFolders = folders;
      classificationStore.addLog('收藏夹列表加载成功', 'success');
    } catch (error) {
      classificationStore.addLog(error.message, 'error');
      throw error;
    }
  }

  // 开始分类任务
  async startClassification() {
    const classificationStore = this.getClassificationStore();
    const settingsService = this.getSettingsService();
    
    // 检查设置是否有效，并提供具体的错误信息
    if (!settingsService.isSettingsValid()) {
      const errorMessage = settingsService.getSettingsValidationError();
      classificationStore.addLog(errorMessage, 'error');
      return;
    }

    if (!classificationStore.hasSelectedSourceFolders || !classificationStore.hasSelectedTargetFolders) {
      classificationStore.addLog('请选择源收藏夹和目标收藏夹', 'error');
      return;
    }

    const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
    const csrf = csrfMatch ? csrfMatch[1] : null;
    
    if (!csrf) {
      classificationStore.addLog('无法获取CSRF Token', 'error');
      return;
    }

    // 重置任务状态
    classificationStore.setTaskRunning(true);
    classificationStore.setPaused(false);
    classificationStore.clearLogs();
    classificationStore.resetResults();
    
    classificationStore.addLog('开始分类任务...', 'info');

    const modelName = this.getSettingsStore().getModelName;
    const targetFolders = classificationStore.allFolders.filter(f =>
      classificationStore.selectedTargetFolders.includes(f.id)
    );
    const sourceFolders = classificationStore.allFolders.filter(f =>
      classificationStore.selectedSourceFolders.includes(f.id)
    );

    // 检查是否有未完成的任务
    if (classificationStore.hasPendingTask()) {
      const pendingVideos = classificationStore.loadPendingVideos();
      const targetFolders = classificationStore.loadTargetFolders();
      
      if (confirm(`检测到有 ${pendingVideos.length} 个视频上次未完成分类，是否继续？`)) {
        await this.handleMoves(pendingVideos, targetFolders, {
          apiKey: this.getSettingsStore().apiKey,
          apiHost: this.getSettingsStore().apiHost,
          modelName,
          csrf
        });
        return;
      } else {
        classificationStore.clearPendingData();
      }
    }

    // 获取所有视频
    const videosToProcess = await this.fetchAllVideos(sourceFolders);
    
    if (videosToProcess.length === 0) {
      classificationStore.addLog('在选定的源收藏夹中没有找到任何视频。', 'info');
      classificationStore.setTaskRunning(false);
      return;
    }

    // 保存待处理视频和目标收藏夹
    classificationStore.savePendingVideos(videosToProcess);
    classificationStore.saveTargetFolders(targetFolders);

    // 开始处理视频
    await this.handleMoves(videosToProcess, targetFolders, {
      apiKey: this.getSettingsStore().apiKey,
      apiHost: this.getSettingsStore().apiHost,
      modelName,
      csrf
    });
  }

  // 获取所有视频
  async fetchAllVideos(sourceFolders) {
    const classificationStore = this.getClassificationStore();
    const videosToProcess = [];
    
    for (let i = 0; i < sourceFolders.length; i++) {
      const sourceFolder = sourceFolders[i];
      classificationStore.addLog(`正在从源收藏夹 [${sourceFolder.title}] 获取视频...`);
      
      let pageNum = 1;
      let hasMore = true;
      
      while (hasMore) {
        try {
          const result = await BilibiliAPI.getFavoriteVideos(sourceFolder.id, 20, pageNum);
          hasMore = result.hasMore;
          
          if (result.videos.length > 0) {
            const videosWithSource = result.videos.map(v => ({
              ...v,
              sourceMediaId: sourceFolder.id
            }));
            videosToProcess.push(...videosWithSource);
          }
          
          pageNum++;
        } catch (error) {
          classificationStore.addLog(`获取视频失败: ${error.message}`, 'error');
          hasMore = false;
        }
      }
    }
    
    return videosToProcess;
  }

  // 处理视频移动
  async handleMoves(videos, targetFolders, config) {
    const classificationStore = this.getClassificationStore();
    classificationStore.setClassificationResults([]);
    const totalVideos = videos.length;
    let processedCount = 0;

    try {
      for (let i = 0; i < totalVideos; i += classificationStore.batchSize) {
        if (classificationStore.isPaused) {
          classificationStore.addLog('任务已暂停。', 'info');
          break;
        }

        // 等待暂停状态解除
        while (classificationStore.isPaused) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const batch = videos.slice(i, i + classificationStore.batchSize);
        classificationStore.addLog(`正在处理批次: ${i + 1} - ${i + batch.length} / ${totalVideos}`);

        // 过滤掉已在目标收藏夹中的视频（除非强制重新分类）
        const videosToClassify = batch.filter(video => {
          if (!classificationStore.forceReclassify &&
              targetFolders.some(tf => tf.id === video.sourceMediaId)) {
            classificationStore.addLog(`视频「${video.title}」已在目标收藏夹中，跳过。`, 'info');
            classificationStore.setClassificationResults([
              ...classificationStore.classificationResults,
              { video, status: 'skipped' }
            ]);
            return false;
          }
          return true;
        });

        if (videosToClassify.length === 0) {
          processedCount += batch.length;
          const remainingVideos = videos.slice(processedCount);
          classificationStore.savePendingVideos(remainingVideos);
          continue;
        }

        try {
          classificationStore.addLog(`正在为 ${videosToClassify.length} 个视频请求AI批量分类...`);
          const batchResults = await AIClassifier.classifyBatch(
            videosToClassify,
            targetFolders,
            config.apiKey,
            config.apiHost,
            config.modelName
          );
          classificationStore.addLog('AI批量分类响应已收到。');

          // 处理分类结果
          for (const video of videosToClassify) {
            const predictedFolderName = batchResults[video.title];
            let result = {
              video: video,
              originalTargetFolderId: null,
              correctedTargetFolderId: null,
              status: 'failed'
            };

            if (predictedFolderName) {
              if (predictedFolderName === '无合适收藏夹') {
                classificationStore.addLog(`视频「${video.title}」与所有目标收藏夹都不匹配，将保留在原收藏夹中。`, 'info');
                result.status = 'skipped';
              } else {
                const targetFolder = targetFolders.find(f => f.title === predictedFolderName);
                if (targetFolder) {
                  result.originalTargetFolderId = targetFolder.id;
                  result.correctedTargetFolderId = targetFolder.id;
                  classificationStore.addLog(`AI建议将「${video.title}」移动到「${targetFolder.title}」`, 'success');
                  result.status = 'success';
                } else {
                  classificationStore.addLog(`处理视频「${video.title}」时出错: 未找到匹配的目标收藏夹: 「${predictedFolderName}」`, 'error');
                }
              }
            } else {
              classificationStore.addLog(`处理视频「${video.title}」时出错: AI未对该视频返回分类结果。`, 'error');
            }
            
            classificationStore.setClassificationResults([
              ...classificationStore.classificationResults,
              result
            ]);
          }
        } catch (error) {
          classificationStore.addLog(`处理批次时出错: ${error.message}`, 'error');
          
          // 标记批次中所有视频为失败
          for (const video of videosToClassify) {
            classificationStore.setClassificationResults([
              ...classificationStore.classificationResults,
              { video, status: 'failed' }
            ]);
          }
        }
        
        processedCount += batch.length;
        const remainingVideos = videos.slice(processedCount);
        classificationStore.savePendingVideos(remainingVideos);
      }
    } finally {
      classificationStore.addLog('所有视频分析完毕！请在结果页确认或修正。', 'success');
      classificationStore.setTaskRunning(false);
      classificationStore.clearPendingData();
      this.showSummary();
    }
  }

  // 显示分类结果摘要
  showSummary() {
    const classificationStore = this.getClassificationStore();
    const results = classificationStore.classificationResults;
    const folderCounts = results.reduce((acc, result) => {
      if (result.status === 'success' && result.correctedTargetFolderId) {
        const folderName = this.getFolderName(result.correctedTargetFolderId);
        if (folderName) {
          acc[folderName] = (acc[folderName] || 0) + 1;
        }
      }
      return acc;
    }, {});

    const labels = Object.keys(folderCounts);
    const data = Object.values(folderCounts);

    const chartData = {
      labels: labels,
      datasets: [
        {
          backgroundColor: ['#fb7299', '#00a1d6', '#ffc107', '#28a745', '#6c757d', '#17a2b8', '#fd7e14', '#6610f2'],
          data: data
        }
      ]
    };

    classificationStore.setChartData(chartData);
    classificationStore.setResultsVisible(true);
  }

  // 获取收藏夹名称
  getFolderName(folderId) {
    const classificationStore = this.getClassificationStore();
    const folder = classificationStore.allFolders.find(f => f.id === folderId);
    return folder ? folder.title : '未知';
  }

  // 应用修正
  async applyCorrections() {
    const classificationStore = this.getClassificationStore();
    const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
    const csrf = csrfMatch ? csrfMatch[1] : null;
    
    if (!csrf) {
      classificationStore.addLog('无法应用修正：缺少CSRF Token。', 'error');
      return;
    }

    classificationStore.addLog('开始应用修正...', 'info');
    let successCount = 0;
    let failCount = 0;

    for (const result of classificationStore.classificationResults) {
      if (result.status === 'success' &&
          result.correctedTargetFolderId !== result.video.sourceMediaId) {
        try {
          await BilibiliAPI.moveVideo(
            result.video.id,
            result.correctedTargetFolderId,
            result.video.sourceMediaId,
            csrf
          );
          classificationStore.addLog(`成功将「${result.video.title}」移动到「${this.getFolderName(result.correctedTargetFolderId)}」`, 'success');
          this.recordAnalyticsData(result.video, result.correctedTargetFolderId);
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 500)); // 添加500ms延迟
        } catch (error) {
          classificationStore.addLog(`移动视频「${result.video.title}」失败: ${error.message}`, 'error');
          failCount++;
        }
      }
    }
    
    classificationStore.addLog(`修正应用完毕！成功: ${successCount}, 失败: ${failCount}`, 'success');
    classificationStore.resetResults();
  }

  // 记录分析数据
  recordAnalyticsData(video, targetFolderId) {
    const uiStore = this.getUIStore();
    const record = {
      timestamp: new Date().toISOString(),
      videoId: video.id,
      videoTitle: video.title,
      targetFolderId: targetFolderId,
      targetFolderName: this.getFolderName(targetFolderId)
    };
    
    uiStore.addAnalyticsRecord(record);
  }

  // 暂停/恢复任务
  togglePause() {
    const classificationStore = this.getClassificationStore();
    const isPaused = !classificationStore.isPaused;
    classificationStore.setPaused(isPaused);
    classificationStore.addLog(isPaused ? '任务已暂停。' : '任务已恢复。', 'info');
  }

  // 停止任务
  stopClassification() {
    const classificationStore = this.getClassificationStore();
    classificationStore.addLog('任务正在停止...', 'info');
    classificationStore.setTaskRunning(false);
  }

  // 关闭结果视图
  closeResultsView() {
    const classificationStore = this.getClassificationStore();
    classificationStore.resetResults();
  }

  // 更新选中的源收藏夹
  updateSelectedSourceFolders(selectedIds) {
    const classificationStore = this.getClassificationStore();
    classificationStore.updateSelectedSourceFolders(selectedIds);
  }

  // 更新选中的目标收藏夹
  updateSelectedTargetFolders(selectedIds) {
    const classificationStore = this.getClassificationStore();
    classificationStore.updateSelectedTargetFolders(selectedIds);
  }

  // 下一步
  nextStep() {
    const classificationStore = this.getClassificationStore();
    if (classificationStore.currentStep === 1 && !classificationStore.hasSelectedSourceFolders) {
      classificationStore.addLog('请至少选择一个源收藏夹。', 'error');
      return;
    }
    classificationStore.nextStep();
  }

  // 上一步
  prevStep() {
    const classificationStore = this.getClassificationStore();
    classificationStore.prevStep();
  }

  // 设置批量大小
  setBatchSize(size) {
    const classificationStore = this.getClassificationStore();
    classificationStore.batchSize = size;
  }

  // 设置强制重新分类
  setForceReclassify(force) {
    const classificationStore = this.getClassificationStore();
    classificationStore.forceReclassify = force;
  }

}