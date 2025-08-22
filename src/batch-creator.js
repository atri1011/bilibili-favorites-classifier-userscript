import { RECOMMENDED_FOLDERS } from './constants.js';
import BilibiliAPI from './api.js';

const BatchCreator = {
    start: function() {
        const btn = document.getElementById('bfc-batch-create-btn');
        if (!btn) return;

        const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
        if (!csrfMatch) {
            alert('获取CSRF Token失败，请确保您已登录B站。');
            return;
        }
        const csrf = csrfMatch[1];

        // 先获取用户已有的收藏夹列表
        BilibiliAPI.getUserInfo()
            .then(userInfo => {
                return BilibiliAPI.getAllFavorites(userInfo.mid);
            })
            .then(existingFolders => {
                // 获取已存在的收藏夹名称
                const existingFolderNames = existingFolders.map(folder => folder.title);
                
                // 过滤出需要创建的收藏夹（不存在的）
                const foldersToCreate = RECOMMENDED_FOLDERS.filter(name => 
                    !existingFolderNames.includes(name)
                );
                
                const existingCount = RECOMMENDED_FOLDERS.length - foldersToCreate.length;
                
                if (foldersToCreate.length === 0) {
                    alert(`所有推荐收藏夹已存在！\n已存在: ${existingCount}个\n无需创建: ${foldersToCreate.length}个`);
                    return;
                }
                
                if (!confirm(`即将创建 ${foldersToCreate.length} 个推荐收藏夹（已跳过 ${existingCount} 个已存在的收藏夹），确定吗？`)) {
                    return;
                }

                btn.disabled = true;
                let successCount = 0;
                let failCount = 0;

                const processNext = i => {
                    if (i >= foldersToCreate.length) {
                        btn.textContent = '一键创建推荐收藏夹';
                        btn.disabled = false;
                        alert(`创建完成！\n成功: ${successCount}个\n失败: ${failCount}个\n已跳过: ${existingCount}个\n\n页面即将刷新以展示新收藏夹。`);
                        location.reload();
                        return;
                    }

                    const name = foldersToCreate[i];
                    btn.textContent = `创建中 (${i + 1}/${foldersToCreate.length})...`;
                    BilibiliAPI.createFolder(name, csrf)
                        .then(() => {
                            successCount++;
                            setTimeout(() => processNext(i + 1), 500);
                        })
                        .catch(error => {
                            failCount++;
                            console.error(`创建收藏夹 "${name}" 失败: ${error.message}`);
                            setTimeout(() => processNext(i + 1), 500);
                        });
                };
                processNext(0);
            })
            .catch(error => {
                console.error('获取收藏夹列表失败:', error);
                alert('获取收藏夹列表失败，请确保您已登录B站并重试。');
            });
    }
};

export default BatchCreator;