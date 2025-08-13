import { UIManager } from './ui.js';
import { BilibiliAPI } from './api.js';
import { AIClassifier } from './ai.js';
import { BatchCreator } from './batch-creator.js';

export const App = {
    allFolders: [],
    mid: null,

    async init() {
        UIManager.init(this, BatchCreator);
        try {
            const midMatch = window.location.href.match(/space.bilibili.com\/(\d+)/);
            if (!midMatch) {
                UIManager.log('无法从URL中获取用户MID，请确保在正确的空间页面', 'error');
                return;
            }
            this.mid = midMatch[1];
            UIManager.log(`成功获取到用户MID: ${this.mid}`, 'info');

            UIManager.log('正在获取收藏夹列表...');
            const folders = await BilibiliAPI.getAllFavorites(this.mid);
            this.allFolders = folders;
            UIManager.renderFavorites(UIManager.sourceFoldersContainer, folders, 'source');
            UIManager.renderFavorites(UIManager.targetFoldersContainer, folders, 'target');
            UIManager.log('收藏夹列表加载成功', 'success');
        } catch (error) {
            UIManager.log(error.message, 'error');
        }
    },

    async start() {
        UIManager.log('开始分类任务...', 'info');
        const { apiKey, apiHost, modelName, sourceFavoriteIds, targetFavoriteIds, csrf, batchSize } = UIManager.getUserInput();
        if (!apiKey || !apiHost || !modelName || sourceFavoriteIds.length === 0 || targetFavoriteIds.length === 0 || !csrf) {
            UIManager.log('请检查设置：API Key/Host/模型, 源/目标收藏夹 和 CSRF Token 不能为空', 'error');
            return;
        }

        const targetFolders = this.allFolders.filter(f => targetFavoriteIds.includes(f.id.toString()));
        const sourceFolders = this.allFolders.filter(f => sourceFavoriteIds.includes(f.id.toString()));
        let videosToProcess = [];

        try {
            for (const sourceFolder of sourceFolders) {
                if (videosToProcess.length >= batchSize) break;

                UIManager.log(`正在从源收藏夹 [${sourceFolder.title}] 获取视频...`);
                let pageNum = 1;
                let hasMore = true;

                while (hasMore && videosToProcess.length < batchSize) {
                    const remainingNeeded = batchSize - videosToProcess.length;
                    const pageSize = Math.min(20, remainingNeeded); // B站API单页最大20

                    const { videos, hasMore: newHasMore } = await BilibiliAPI.getFavoriteVideos(sourceFolder.id, pageSize, pageNum);

                    if (videos.length > 0) {
                         // 为每个视频对象添加其原始收藏夹ID
                        const videosWithSource = videos.map(v => ({...v, sourceMediaId: sourceFolder.id }));
                        videosToProcess.push(...videosWithSource);
                    }
                    hasMore = newHasMore;
                    pageNum++;
                }
            }

            if (videosToProcess.length === 0) {
                UIManager.log('在选定的源收藏夹中没有找到任何视频。', 'info');
                return;
            }
             UIManager.log(`总共获取到 ${videosToProcess.length} 个视频, 开始处理...`, 'info');
            await this.handleMoves(videosToProcess, targetFolders, { apiKey, apiHost, modelName, csrf });

            UIManager.log('所有视频处理完毕！', 'success');
        } catch (error) {
            UIManager.log(`任务执行失败: ${error.message}`, 'error');
        }
    },

    async handleMoves(videos, targetFolders, config) {
        for (const video of videos) {
            try {
                 // 检查视频是否已在目标收藏夹之一
                if (targetFolders.some(tf => tf.id === video.sourceMediaId)) {
                    UIManager.log(`视频「${video.title}」已在目标收藏夹中，跳过。`, 'info');
                    continue;
                }
                UIManager.log(`正在为视频「${video.title}」请求AI分类...`);
                const predictedFolderName = await AIClassifier.classify(video, targetFolders, config.apiKey, config.apiHost, config.modelName);
                UIManager.log(`AI建议分类到: 「${predictedFolderName}」`);

                const targetFolder = targetFolders.find(f => f.title === predictedFolderName);
                if (targetFolder) {
                     if (targetFolder.id === video.sourceMediaId) {
                        UIManager.log(`视频「${video.title}」已在「${targetFolder.title}」中，无需移动。`, 'info');
                        continue;
                    }
                    await BilibiliAPI.moveVideo(video.id, targetFolder.id, video.sourceMediaId, config.csrf);
                    UIManager.log(`成功将「${video.title}」移动到「${targetFolder.title}」`, 'success');
                } else {
                    UIManager.log(`未找到匹配的目标收藏夹: 「${predictedFolderName}」, 跳过移动`, 'error');
                }
            } catch (error) {
                UIManager.log(`处理视频「${video.title}」时出错: ${error.message}`, 'error');
            }
        }
    }
};