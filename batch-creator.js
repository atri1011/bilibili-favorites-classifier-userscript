import { BilibiliAPI } from './api.js';
import { RECOMMENDED_FOLDERS } from './constants.js';

export const BatchCreator = {
    async start() {
        const btn = document.getElementById('bfc-batch-create-btn');
        if (!btn) return;

        const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
        if (!csrfMatch) {
            alert('获取CSRF Token失败，请确保您已登录B站。');
            return;
        }
        const csrf = csrfMatch[1];

        if (!confirm(`即将创建 ${RECOMMENDED_FOLDERS.length} 个推荐收藏夹，确定吗？`)) {
            return;
        }

        btn.disabled = true;
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < RECOMMENDED_FOLDERS.length; i++) {
            const name = RECOMMENDED_FOLDERS[i];
            btn.textContent = `创建中 (${i + 1}/${RECOMMENDED_FOLDERS.length})...`;
            try {
                await BilibiliAPI.createFolder(name, csrf);
                successCount++;
            } catch (error) {
                failCount++;
                console.error(`创建收藏夹 "${name}" 失败: ${error.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        btn.textContent = '一键创建推荐收藏夹';
        btn.disabled = false;
        alert(`创建完成！\n成功: ${successCount}个\n失败: ${failCount}个\n\n页面即将刷新以展示新收藏夹。`);
        location.reload();
    }
};