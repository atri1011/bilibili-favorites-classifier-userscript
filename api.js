export const BilibiliAPI = {
    async getAllFavorites(mid) {
        const url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}`;
        const response = await fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
        const data = await response.json();
        if (data.code === 0 && data.data) {
            return data.data.list || [];
        } else if (data.code === 0 && (data.data === null || data.data.list === null)) {
            return [];
        } else {
            throw new Error(`获取收藏夹列表失败: ${data.message}`);
        }
    },

    async getFavoriteVideos(media_id, ps = 20, pageNum = 1) {
        const url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${media_id}&pn=${pageNum}&ps=${ps}&order=mtime`;
        const response = await fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
        const data = await response.json();
        if (data.code === 0 && data.data) {
            return {
                videos: data.data.medias || [],
                hasMore: data.data.has_more,
            };
        }
        throw new Error(`获取收藏夹视频失败 (Code: ${data.code || 'N/A'}): ${data.message}`);
    },

    async moveVideo(resourceId, targetMediaId, fromMediaId, csrf) {
         const url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
         const params = new URLSearchParams();
         params.append('rid', resourceId);
         params.append('type', 2);
         params.append('add_media_ids', targetMediaId);
         params.append('del_media_ids', fromMediaId);
         params.append('csrf', csrf);
         const response = await fetch(url, {
             method: 'POST',
             body: params,
             credentials: 'include',
             headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
         });
         const data = await response.json();
         if (data.code !== 0) {
             throw new Error(`移动视频失败: ${data.message}`);
         }
         return data;
    },

    createFolder(name, csrf) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/x/v3/fav/folder/add',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                data: `title=${encodeURIComponent(name)}&public=0&csrf=${csrf}`,
                onload: function(response) {
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
                onerror: function() {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }
};
