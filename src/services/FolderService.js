import { useClassificationStore } from '../stores/index.js';
import BilibiliAPI from '../api.js';
import { CSRFUtils } from '../utils/gmAdapter.js';

export class FolderService {
  constructor() {
    this.classificationStore = null;
  }

  // 获取 classificationStore 实例（延迟初始化）
  getClassificationStore() {
    if (!this.classificationStore) {
      this.classificationStore = useClassificationStore();
    }
    return this.classificationStore;
  }

  // 获取收藏夹名称
  getFolderName(folderId) {
    const classificationStore = this.getClassificationStore();
    const folder = classificationStore.allFolders.find(f => f.id === folderId);
    return folder ? folder.title : '未知';
  }

  // 获取所有收藏夹
  getAllFolders() {
    const classificationStore = this.getClassificationStore();
    return classificationStore.allFolders;
  }

  // 获取选中的源收藏夹
  getSelectedSourceFolders() {
    const classificationStore = this.getClassificationStore();
    return classificationStore.selectedSourceFolders.map(id =>
      classificationStore.allFolders.find(f => f.id === id)
    ).filter(Boolean);
  }

  // 获取选中的目标收藏夹
  getSelectedTargetFolders() {
    const classificationStore = this.getClassificationStore();
    return classificationStore.selectedTargetFolders.map(id =>
      classificationStore.allFolders.find(f => f.id === id)
    ).filter(Boolean);
  }

  // 获取可用的目标收藏夹
  getAvailableTargetFolders() {
    const classificationStore = this.getClassificationStore();
    return classificationStore.availableTargetFolders;
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

  // 创建收藏夹
  async createFolder(name, csrf) {
    try {
      // 如果没有提供 CSRF token，则自动获取
      const token = csrf || await CSRFUtils.getCSRFToken();
      const result = await BilibiliAPI.createFolder(name, token);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 批量创建收藏夹
  async batchCreateFolders(names, csrf) {
    const results = [];
    
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      try {
        const result = await this.createFolder(name, csrf);
        results.push({ name, success: true, result });
        // 添加延迟以避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.push({ name, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // 移动视频到收藏夹
  async moveVideo(videoId, targetFolderId, sourceFolderId, csrf) {
    try {
      // 如果没有提供 CSRF token，则自动获取
      const token = csrf || await CSRFUtils.getCSRFToken();
      const result = await BilibiliAPI.moveVideo(videoId, targetFolderId, sourceFolderId, token);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 添加视频到收藏夹
  async addVideoToFavorite(videoId, targetFolderId, csrf) {
    try {
      // 如果没有提供 CSRF token，则自动获取
      const token = csrf || await CSRFUtils.getCSRFToken();
      const result = await BilibiliAPI.addVideoToFavorite(videoId, targetFolderId, token);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 获取收藏夹中的视频
  async getFavoriteVideos(folderId, ps = 20, pageNum = 1) {
    try {
      const result = await BilibiliAPI.getFavoriteVideos(folderId, ps, pageNum);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 获取所有收藏夹中的所有视频
  async getAllVideosFromFavorites(mediaIds, onProgress) {
    try {
      const result = await BilibiliAPI.getAllVideosFromFavorites(mediaIds, onProgress);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 并行获取所有收藏夹中的所有视频
  async getAllVideosFromFavoritesParallel(mediaIds, onProgress) {
    try {
      const result = await BilibiliAPI.getAllVideosFromFavoritesParallel(mediaIds, onProgress);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 刷新收藏夹列表
  async refreshFolderList(mid) {
    try {
      const classificationStore = this.getClassificationStore();
      const folders = await BilibiliAPI.getAllFavorites(mid);
      classificationStore.allFolders = folders;
      return folders;
    } catch (error) {
      throw error;
    }
  }

  // 检查收藏夹是否存在
  folderExists(folderName) {
    const classificationStore = this.getClassificationStore();
    return classificationStore.allFolders.some(f => f.title === folderName);
  }

  // 获取收藏夹ID
  getFolderId(folderName) {
    const classificationStore = this.getClassificationStore();
    const folder = classificationStore.allFolders.find(f => f.title === folderName);
    return folder ? folder.id : null;
  }

  // 获取收藏夹中的视频数量
  getFolderVideoCount(folderId) {
    const classificationStore = this.getClassificationStore();
    const folder = classificationStore.allFolders.find(f => f.id === folderId);
    return folder ? folder.media_count : 0;
  }

  // 获取收藏夹的创建时间
  getFolderCreatedTime(folderId) {
    const classificationStore = this.getClassificationStore();
    const folder = classificationStore.allFolders.find(f => f.id === folderId);
    return folder ? folder.fav_time : null;
  }

  // 获取收藏夹的更新时间
  getFolderUpdatedTime(folderId) {
    const classificationStore = this.getClassificationStore();
    const folder = classificationStore.allFolders.find(f => f.id === folderId);
    return folder ? folder.update_time : null;
  }
}