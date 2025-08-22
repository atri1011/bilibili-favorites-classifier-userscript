import { retry } from './utils.js';
import { GM_xmlhttpRequest, CSRFUtils } from './utils/gmAdapter.js';

async function handleResponse(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    const text = await response.text();
    if (text.includes('login-box')) {
        throw new Error('B站登录已失效，请重新登录');
    }
    throw new Error('响应不是有效的JSON格式，可能触发了B站风控');
}

const BilibiliAPI = {
    getAllFavorites: function(mid) {
        var url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=' + mid;
        return retry(() =>
            fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
            .then(handleResponse)
        )
            .then(data => {
                if (data.code === 0 && data.data) {
                    return data.data.list || [];
                } else if (data.code === 0 && (data.data === null || data.data.list === null)) {
                    return [];
                } else {
                    throw new Error('获取收藏夹列表失败: ' + data.message);
                }
            });
    },
    getFavoriteVideos: function(media_id, ps, pageNum) {
        ps = ps || 20;
        pageNum = pageNum || 1;
        var url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${media_id}&pn=${pageNum}&ps=${ps}&order=mtime`;
        return retry(() =>
            fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
            .then(handleResponse)
        )
            .then(data => {
                if (data.code === 0 && data.data) {
                    return {
                        videos: data.data.medias || [],
                        hasMore: data.data.has_more,
                    };
                }
                throw new Error(`获取收藏夹视频失败 (Code: ${data.code || 'N/A'}): ${data.message}`);
            });
    },

    getAllVideosFromFavorites: async function(media_ids, onProgress) {
        let allVideos = [];
        for (const media_id of media_ids) {
            let pageNum = 1;
            let hasMore = true;
            while (hasMore) {
                try {
                    const result = await this.getFavoriteVideos(media_id, 20, pageNum);
                    if (result.videos.length > 0) {
                        const videosWithSource = result.videos.map(v => ({ ...v, sourceMediaId: media_id }));
                        allVideos.push(...videosWithSource);
                        if (onProgress) {
                            onProgress(allVideos.length);
                        }
                    }
                    hasMore = result.hasMore;
                    pageNum++;
                } catch (error) {
                    console.error(`获取收藏夹 ${media_id} 的视频失败:`, error);
                    hasMore = false; // Stop trying for this folder on error
                }
            }
        }
        return allVideos;
    },

    getAllVideosFromFavoritesParallel: async function(media_ids, onProgress) {
        const promises = media_ids.map(async (media_id) => {
            const videos = [];
            let pageNum = 1;
            let hasMore = true;
            while (hasMore) {
                try {
                    const result = await this.getFavoriteVideos(media_id, 20, pageNum);
                    if (result.videos.length > 0) {
                        const videosWithSource = result.videos.map(v => ({ ...v, sourceMediaId: media_id }));
                        videos.push(...videosWithSource);
                    }
                    hasMore = result.hasMore;
                    pageNum++;
                } catch (error) {
                    console.error(`获取收藏夹 ${media_id} 的视频失败:`, error);
                    hasMore = false; // Stop on error for this folder
                }
            }
            if (onProgress) {
                onProgress(videos.length);
            }
            return videos;
        });
        const results = await Promise.all(promises);
        const allVideos = results.flat();
        if (onProgress) {
            onProgress(allVideos.length, true); // Final progress update
        }
        return allVideos;
    },

    moveVideo: function(resourceId, targetMediaId, fromMediaId, csrf) {
         // 如果没有提供csrf参数，则自动获取
         const token = csrf || CSRFUtils.getCSRFToken();
         if (!token) {
             return Promise.reject(new Error('未找到CSRF token，请确保已登录B站'));
         }
         
         // 验证CSRF token格式
         if (!CSRFUtils.validateCSRFToken(token)) {
             return Promise.reject(new Error('CSRF token格式无效，请重新登录B站'));
         }
         
         var url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
         var params = new URLSearchParams();
         params.append('rid', resourceId);
         params.append('type', 2);
         params.append('add_media_ids', targetMediaId);
         params.append('del_media_ids', fromMediaId);
         params.append('csrf', token);
         return retry(() =>
             fetch(url, {
                 method: 'POST',
                 body: params,
                 credentials: 'include',
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
             })
             .then(handleResponse)
         )
         .then(data => {
             if (data.code !== 0) {
                 throw new Error('移动视频失败: ' + data.message);
             }
             return data;
         });
    },
   addVideoToFavorite: function(resourceId, targetMediaId, csrf) {
       // 如果没有提供csrf参数，则自动获取
       const token = csrf || CSRFUtils.getCSRFToken();
       if (!token) {
           return Promise.reject(new Error('未找到CSRF token，请确保已登录B站'));
       }
       
       // 验证CSRF token格式
       if (!CSRFUtils.validateCSRFToken(token)) {
           return Promise.reject(new Error('CSRF token格式无效，请重新登录B站'));
       }
       
       var url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
       var params = new URLSearchParams();
       params.append('rid', resourceId);
       params.append('type', 2);
       params.append('add_media_ids', targetMediaId);
       params.append('csrf', token);
       return retry(() =>
           fetch(url, {
               method: 'POST',
               body: params,
               credentials: 'include',
               headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
           })
           .then(handleResponse)
       )
       .then(data => {
           if (data.code !== 0) {
               throw new Error('添加视频到收藏夹失败: ' + data.message);
           }
           return data;
       });
   },
    getVideoInfo: function(bvid) {
       var url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
       return retry(() =>
           fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
           .then(handleResponse)
       )
           .then(data => {
               if (data.code === 0 && data.data) {
                   return data.data;
               } else {
                   throw new Error('获取视频信息失败: ' + data.message);
               }
           });
   },
    createFolder: function(name, csrf) {
        // 如果没有提供csrf参数，则自动获取
        const token = csrf || CSRFUtils.getCSRFToken();
        if (!token) {
            return Promise.reject(new Error('未找到CSRF token，请确保已登录B站'));
        }
        
        // 验证CSRF token格式
        if (!CSRFUtils.validateCSRFToken(token)) {
            return Promise.reject(new Error('CSRF token格式无效，请重新登录B站'));
        }
        
        return retry(() => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/x/v3/fav/folder/add',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                data: `title=${encodeURIComponent(name)}&public=0&csrf=${token}`,
                onload: response => {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result);
                        } else {
                            reject(new Error(result.message || '未知错误'));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                },
                onerror: () => reject(new Error('网络请求失败'))
            });
        }));
    },
    getUserInfo: function() {
        var url = 'https://api.bilibili.com/x/web-interface/nav';
        return retry(() =>
            fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' })
            .then(handleResponse)
        )
            .then(data => {
                if (data.code === 0 && data.data && data.data.isLogin) {
                    return data.data;
                } else if (data.data && !data.data.isLogin) {
                    throw new Error('B站未登录');
                }
                else {
                    throw new Error('获取用户信息失败: ' + data.message);
                }
            });
    }
};
export default BilibiliAPI;