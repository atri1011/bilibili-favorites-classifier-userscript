import './style.css';
import UIManager from './ui.js';
import BilibiliAPI from './api.js';
import AIClassifier from './ai.js';
import BatchCreator from './batch-creator.js';
import store from './store.js';
import { GM } from './utils/gmAdapter.js';
import { createPinia } from 'pinia';

// 创建 Pinia 实例
const pinia = createPinia();

// 延迟导入 store，确保 Pinia 已初始化
const getStores = () => {
    // 使用动态导入来避免循环依赖
    return import('./stores/index.js').then(stores => ({
        useClassificationStore: stores.useClassificationStore,
        useFloatingRecommendationStore: stores.useFloatingRecommendationStore,
        useSettingsStore: stores.useSettingsStore
    }));
};

const App = {
    isProcessing: false,
    
    init: async function() {
        // 初始化 Pinia
        this.initPinia();
        
        
        if (window.location.href.includes('space.bilibili.com')) {
            this.initSpacePage();
        } else if (window.location.href.includes('www.bilibili.com/video/')) {
            this.initVideoPageListeners();
        }
    },
    
    // 新增：初始化 Pinia
    initPinia: function() {
        // 创建一个临时的 Vue 应用来初始化 Pinia
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        // 使用全局 Vue 对象（通过 vite-plugin-monkey 的 externalGlobals 配置）
        const { createApp } = Vue;
        const app = createApp({});
        app.use(pinia);
        app.mount(tempDiv);
        
        // 保存 Pinia 实例供其他地方使用
        window.__bfc_pinia = pinia;
    },
    
    initSpacePage: function() {
        UIManager.init();
    },
    initVideoPageListeners: async function() {
        // 初始化悬浮推荐UI
        UIManager.initFloatingRecommendationUI();
        
        // 初始化侧边按钮
        UIManager.initSideButtonUI();
        
        // 初始化实时视频检测
        this.initRealtimeVideoDetection();
    },

    initRealtimeVideoDetection: async function() {
        console.log('[BFC Debug] 初始化实时视频检测');
        // 检查API设置
        const apiKey = GM.getValue('apiKey');
        if (!apiKey) {
            console.log('[BFC Debug] 未设置API Key，跳过实时视频检测');
            return;
        }
        console.log('[BFC Debug] API Key已设置，开始实时视频检测');

        // 立即检测当前视频
        this.detectAndProcessVideo();

        // 监听URL变化（用于检测视频切换）
        let lastUrl = window.location.href;
        const checkUrlChange = () => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                console.log('[BFC Debug] 检测到URL变化:', currentUrl);
                lastUrl = currentUrl;
                // URL变化时延迟检测，等待页面内容更新
                setTimeout(async () => {
                    await this.detectAndProcessVideo();
                }, 1500);
            }
        };

        // 使用 MutationObserver 监听页面变化
        const observer = new MutationObserver(() => {
            checkUrlChange();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 备用方案：定期检查URL变化
        setInterval(checkUrlChange, 2000);
        console.log('[BFC Debug] 实时视频检测已启动');
    },

    detectAndProcessVideo: async function() {
        console.log('[BFC Debug] 开始检测和处理视频');
        
        // 检查是否正在处理
        if (this.isProcessing) {
            console.log('[BFC Debug] 正在处理中，跳过检测');
            return;
        }
        
        // 确保在视频页面
        const bvidMatch = window.location.href.match(/video\/(BV[a-zA-Z0-9]+)/);
        if (!bvidMatch) {
            console.log('[BFC Debug] 当前不是视频页面，跳过处理');
            return;
        }

        const bvid = bvidMatch[1];
        const currentUrl = window.location.href;
        console.log('[BFC Debug] 检测到视频页面，BV号:', bvid);

        // 检查是否需要处理这个视频（避免重复处理）
        const stores = await getStores();
        const classificationStore = stores.useClassificationStore();
        
        if (!classificationStore.shouldProcessVideo(currentUrl)) {
            console.log('[BFC Debug] 视频已处理过，跳过重复处理');
            return;
        }

        // 更新最后处理的视频URL
        classificationStore.setLastVideoUrl(currentUrl);

    },

    async processVideoForRecommendation(bvid) {
        const stores = await getStores();
        const floatingStore = stores.useFloatingRecommendationStore();

        try {
            // 获取用户信息和视频信息
            const userInfo = await BilibiliAPI.getUserInfo();
            if (!userInfo || !userInfo.mid) {
                throw new Error('无法获取用户信息，请检查登录状态');
            }

            // 显示加载状态
            floatingStore.show({
                loading: true,
                videoTitle: '正在获取视频信息...'
            });

            // 并行获取视频信息和收藏夹列表，优化性能
            const [videoInfo, allFolders] = await Promise.all([
                BilibiliAPI.getVideoInfo(bvid),
                BilibiliAPI.getAllFavorites(userInfo.mid)
            ]);

            // 验证获取的数据完整性
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
            floatingStore.setVideoData(videoData);
            floatingStore.setTargetFolders(allFolders);

            // 显示加载AI推荐状态
            floatingStore.show({
                loading: true,
                videoTitle: videoData.title
            });

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
            floatingStore.updateRecommendation(predictedFolderName);

            // 设置回调函数
            floatingStore.onAcceptCallback = (targetFolder) => {
                console.log('用户接受推荐:', targetFolder.title);
            };

            floatingStore.onRejectCallback = () => {
                console.log('用户拒绝推荐');
                // 可以在这里打开传统的收藏夹选择界面
            };

        } catch (error) {
            console.error('处理视频推荐失败:', error);
            floatingStore.setError(`获取推荐失败：${error.message}`);
        } finally {
            // 重置处理状态
            this.isProcessing = false;
            console.log('[BFC Debug] 视频处理完成，重置处理状态');
        }
    },
};

// 使用立即执行异步函数来初始化应用
(async () => {
    await App.init();
})();