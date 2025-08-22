import { defineStore } from 'pinia';
import { GM, CSRFUtils } from '../utils/gmAdapter.js';
import BilibiliAPI from '../api.js';
import AIClassifier from '../ai.js';

export const useFloatingRecommendationStore = defineStore('floatingRecommendation', {
  state: () => ({
    visible: false,
    loading: false,
    processing: false,
    error: null,
    videoTitle: '',
    videoData: null,
    recommendation: null,
    targetFolders: [],
    selectedFolderId: null, // 新增：用户选择的收藏夹ID
    onAcceptCallback: null,
    onRejectCallback: null,
    buttonState: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    isPanelExpanded: false
  }),

  getters: {
    hasRecommendation: (state) => {
      return state.recommendation && state.recommendation.folderName;
    },

    isValidRecommendation: (state) => {
      return state.recommendation && 
             state.recommendation.folderName && 
             state.recommendation.folderName !== '无合适收藏夹';
    }
  },

  actions: {
    show(data = {}) {
      this.visible = true;
      this.loading = data.loading || false;
      this.error = data.error || null;
      this.videoTitle = data.videoTitle || '';
      this.videoData = data.videoData || null;
      this.recommendation = data.recommendation || null;
      // this.targetFolders = data.targetFolders || []; // 移除此行，由 setTargetFolders 独立管理
      this.selectedFolderId = data.selectedFolderId || null; // 初始化用户选择
      this.onAcceptCallback = data.onAccept || null;
      this.onRejectCallback = data.onReject || null;
    },

    hide() {
      this.visible = false;
      this.loading = false;
      this.error = null;
      
      // 只有在非处理状态下才延迟重置数据
      if (!this.processing) {
        // 延迟重置数据，等待动画完成
        setTimeout(() => {
          this.videoTitle = '';
          this.videoData = null;
          this.recommendation = null;
          this.targetFolders = [];
          this.selectedFolderId = null; // 重置用户选择
          this.onAcceptCallback = null;
          this.onRejectCallback = null;
        }, 300);
      } else {
        // 如果正在处理，只重置可见性和加载状态
        this.processing = false;
      }
    },

    setLoading(loading) {
      this.loading = loading;
      if (loading) {
        this.error = null;
        this.recommendation = null;
      }
    },

    setError(error) {
      this.error = error;
      this.loading = false;
      this.processing = false;
    },

    setRecommendation(recommendation) {
      this.recommendation = recommendation;
      this.loading = false;
      this.error = null;
      
      // 不再自动选择AI推荐的收藏夹，让用户手动选择或点击"接受推荐"
      // 这样初始状态下按钮会显示"接受推荐"而不是"收藏到选中收藏夹"
    },

    setVideoData(videoData) {
      this.videoData = videoData;
      this.videoTitle = videoData ? videoData.title : '';
    },

    setTargetFolders(folders) {
      this.targetFolders = folders;
    },

    setSelectedFolderId(folderId) {
      this.selectedFolderId = folderId;
    },

    async acceptRecommendation() {
      if (this.processing) {
        return;
      }

      this.processing = true;
      
      try {
        // 验证必要数据是否存在
        if (!this.videoData || !this.videoData.id) {
          throw new Error('视频数据不完整，请重新开始视频分析');
        }

        // 确保 targetFolders 已加载
        if (this.targetFolders.length === 0) {
          throw new Error('收藏夹列表未加载，请重新开始视频分析');
        }
        
        let targetFolder = null;
        if (this.selectedFolderId) {
          // 优先使用用户选择的收藏夹
          targetFolder = this.targetFolders.find(f => f.id === this.selectedFolderId);
        } else if (this.isValidRecommendation) {
          // 如果没有用户选择，且AI推荐有效，则使用AI推荐
          targetFolder = this.targetFolders.find(
            f => f.title === this.recommendation.folderName
          );
          // 尝试模糊匹配
          if (!targetFolder) {
            const normalizedRecommendation = this.recommendation.folderName.trim().toLowerCase();
            targetFolder = this.targetFolders.find(f =>
              f.title.trim().toLowerCase() === normalizedRecommendation
            );
          }
          
          // 如果找到了AI推荐的收藏夹，临时设置selectedFolderId以便UI显示
          if (targetFolder) {
            this.selectedFolderId = targetFolder.id;
          }
        }

        if (!targetFolder) {
          throw new Error('未选择收藏夹或推荐的收藏夹无效');
        }

        // 添加空值检查
        if (!targetFolder || !targetFolder.id) {
          throw new Error('收藏夹数据不完整，请刷新页面重试');
        }

        // 安全获取CSRF token
        const csrf = CSRFUtils.getCSRFToken();
        
        if (!csrf) {
          throw new Error('未找到CSRF token，请确保已登录B站');
        }
        
        // 验证CSRF token格式
        if (!CSRFUtils.validateCSRFToken(csrf)) {
          throw new Error('CSRF token格式无效，请重新登录B站');
        }

        // 调用API收藏视频
        
        try {
          await BilibiliAPI.addVideoToFavorite(
            this.videoData.id,
            targetFolder.id,
            csrf
          );
        } catch (apiError) {
          throw apiError;
        }

        // 执行成功回调
        if (this.onAcceptCallback) {
          this.onAcceptCallback(targetFolder);
        }

        // 显示成功消息
        this.setSuccess(`成功收藏到「${targetFolder.title}」！`);
        
        // 2秒后自动隐藏
        setTimeout(() => {
          this.hide();
        }, 2000);

      } catch (error) {
        this.setError(`收藏失败：${error.message}`);
      } finally {
        this.processing = false;
      }
    },

    rejectRecommendation() {
      if (this.onRejectCallback) {
        this.onRejectCallback();
      }
      this.hide();
    },

    setSuccess(message) {
      // 临时显示成功消息，可以通过error字段复用
      this.error = null;
      this.recommendation = {
        ...this.recommendation,
        successMessage: message
      };
    },

    // 辅助方法：开始新的视频推荐流程
    async startVideoRecommendation(videoData, targetFolders) {
      this.setVideoData(videoData);
      this.setTargetFolders(targetFolders);
      this.show({
        loading: true,
        videoTitle: videoData.title
      });

      try {
        // 这里会在main.js中调用AI分类器
        // 现在先显示加载状态
        this.setLoading(true);
      } catch (error) {
        this.setError(`获取推荐失败：${error.message}`);
      }
    },

    // 更新推荐结果
    updateRecommendation(recommendation) {
      this.setRecommendation({
        folderName: recommendation,
        confidence: null // 可以扩展置信度支持
      });
    },

    // 新增：设置按钮状态
    setButtonState(state) {
      this.buttonState = state;
    },

    // 新增：设置面板展开状态
    setPanelExpanded(expanded) {
      this.isPanelExpanded = expanded;
    },

    // 新增：触发分类流程
    async triggerClassification() {
      if (this.buttonState === 'loading') return;
      
      this.setButtonState('loading');
      this.setPanelExpanded(true);
      this.show({
        loading: true,
        videoTitle: 'AI正在分析视频...'
      });

      try {
        // 获取当前视频信息
        const bvidMatch = window.location.href.match(/video\/(BV[a-zA-Z0-9]+)/);
        if (!bvidMatch) {
          throw new Error('当前页面不是视频页面');
        }

        const bvid = bvidMatch[1];
        
        // 获取用户信息
        const userInfo = await BilibiliAPI.getUserInfo();
        if (!userInfo || !userInfo.mid) {
          throw new Error('无法获取用户信息，请检查登录状态');
        }

        // 并行获取视频信息和收藏夹列表，优化性能
        const [videoInfo, allFolders] = await Promise.all([
          BilibiliAPI.getVideoInfo(bvid),
          BilibiliAPI.getAllFavorites(userInfo.mid)
        ]);

        // 验证数据完整性
        if (!videoInfo || !videoInfo.aid) {
          throw new Error('获取视频信息失败');
        }

        if (!allFolders || !Array.isArray(allFolders)) {
          throw new Error('获取收藏夹列表失败');
        }

        const videoData = {
          id: videoInfo.aid,
          title: videoInfo.title,
          intro: videoInfo.desc,
          upper: { name: videoInfo.owner.name }
        };

        // 更新store状态，确保在显示推荐之前所有数据都已准备好
        this.setVideoData(videoData);
        this.setTargetFolders(allFolders);

        // 调用AI分类
        const apiKey = GM.getValue('apiKey');
        const apiHost = GM.getValue('apiHost');
        const apiModel = GM.getValue('apiModel');
        const customApiModel = GM.getValue('customApiModel');
        const modelName = apiModel === 'custom' ? customApiModel : apiModel;

        if (!apiKey) {
          throw new Error('请先在设置中配置API Key');
        }

        const predictedFolderName = await AIClassifier.classify(
          videoData, allFolders, apiKey, apiHost, modelName
        );

        // 更新推荐结果
        this.updateRecommendation(predictedFolderName);
        
        this.setButtonState('success');
        
        // 3秒后恢复按钮状态
        setTimeout(() => {
          this.setButtonState('idle');
        }, 3000);
        
      } catch (error) {
        console.error('分类失败:', error);
        this.setError(`分析失败：${error.message}`);
        this.setButtonState('error');
        
        // 3秒后恢复按钮状态
        setTimeout(() => {
          this.setButtonState('idle');
        }, 3000);
      }
    },

  }
});