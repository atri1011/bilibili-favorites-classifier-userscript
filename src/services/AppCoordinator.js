import UIManager from '../ui.js';
import BilibiliAPI from '../api.js';
import AIClassifier from '../ai.js';
import { GM } from '../utils/gmAdapter.js';

// 延迟导入 store，确保 Pinia 已初始化
const getStores = () => {
    // 使用动态导入来避免循环依赖
    return import('../stores/index.js').then(stores => ({
        useClassificationStore: stores.useClassificationStore,
        useFloatingRecommendationStore: stores.useFloatingRecommendationStore,
        useSettingsStore: stores.useSettingsStore
    }));
};

const AppCoordinator = {
    isProcessing: false,

    init() {
        if (window.location.href.includes('space.bilibili.com')) {
            this.initSpacePage();
        } else if (window.location.href.includes('www.bilibili.com/video/')) {
            this.initVideoPageListeners();
        }
    },

    initSpacePage() {
        UIManager.init();
    },

    async initVideoPageListeners() {
        // 初始化悬浮推荐UI
        UIManager.initFloatingRecommendationUI();
        
        // 初始化侧边按钮
        UIManager.initSideButtonUI();
        
        // 初始化实时视频检测
        this.initRealtimeVideoDetection();
    },

    async initRealtimeVideoDetection() {
        console.log('[BFC Debug] 初始化实时视频检测');
        const apiKey = GM.getValue('apiKey');
        if (!apiKey) {
            console.log('[BFC Debug] 未设置API Key，跳过实时视频检测');
            return;
        }
        console.log('[BFC Debug] API Key已设置，开始实时视频检测');

        // 立即检测当前视频
        this.detectAndProcessVideo();

        // 监听URL变化
        let lastUrl = window.location.href;
        const checkUrlChange = () => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                console.log('[BFC Debug] 检测到URL变化:', currentUrl);
                lastUrl = currentUrl;
                setTimeout(async () => {
                    await this.detectAndProcessVideo();
                }, 1500);
            }
        };

        const observer = new MutationObserver(() => {
            checkUrlChange();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(checkUrlChange, 2000);
        console.log('[BFC Debug] 实时视频检测已启动');
    },

    async detectAndProcessVideo() {
        console.log('[BFC Debug] 开始检测和处理视频');
        
        if (this.isProcessing) {
            console.log('[BFC Debug] 正在处理中，跳过检测');
            return;
        }
        
        const bvidMatch = window.location.href.match(/video\/(BV[a-zA-Z0-9]+)/);
        if (!bvidMatch) {
            console.log('[BFC Debug] 当前不是视频页面，跳过处理');
            return;
        }

        const bvid = bvidMatch[1];
        const currentUrl = window.location.href;
        console.log('[BFC Debug] 检测到视频页面，BV号:', bvid);

        const stores = await getStores();
        const classificationStore = stores.useClassificationStore();
        
        if (!classificationStore.shouldProcessVideo(currentUrl)) {
            console.log('[BFC Debug] 视频已处理过，跳过重复处理');
            return;
        }

        classificationStore.setLastVideoUrl(currentUrl);
        
        this.isProcessing = true;
        await this.processVideoForRecommendation(bvid);
    },

    async processVideoForRecommendation(bvid) {
        const stores = await getStores();
        const floatingStore = stores.useFloatingRecommendationStore();

        try {
            const userInfo = await BilibiliAPI.getUserInfo();
            if (!userInfo || !userInfo.mid) {
                throw new Error('无法获取用户信息，请检查登录状态');
            }

            floatingStore.show({
                loading: true,
                videoTitle: '正在获取视频信息...'
            });

            const [videoInfo, allFolders] = await Promise.all([
                BilibiliAPI.getVideoInfo(bvid),
                BilibiliAPI.getAllFavorites(userInfo.mid)
            ]);

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

            floatingStore.setVideoData(videoData);
            floatingStore.setTargetFolders(allFolders);

            floatingStore.show({
                loading: true,
                videoTitle: videoData.title
            });

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

            floatingStore.updateRecommendation(predictedFolderName);

            floatingStore.onAcceptCallback = (targetFolder) => {
                console.log('用户接受推荐:', targetFolder.title);
            };

            floatingStore.onRejectCallback = () => {
                console.log('用户拒绝推荐');
            };

        } catch (error) {
            console.error('处理视频推荐失败:', error);
            floatingStore.setError(`获取推荐失败：${error.message}`);
        } finally {
            this.isProcessing = false;
            console.log('[BFC Debug] 视频处理完成，重置处理状态');
        }
    },
};

export default AppCoordinator;