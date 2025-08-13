export const AIClassifier = {
    classify(video, targetFolders, apiKey, apiHost, modelName) {
        const aiProvider = GM_getValue('aiProvider', 'openai');
        // 根据AI提供商选择不同的API调用逻辑
        if (aiProvider === 'zhipu') {
            // 调用智谱AI
            return this._callZhipuAI(apiKey, { video, targetFolders });
        } else {
            // 调用OpenAI或兼容的API
            return new Promise((resolve, reject) => {
                const prompt = `
                    我有一个B站收藏的视频，信息如下：
                    - 标题: "${video.title}"
                    - 简介: "${video.intro}"
                    - UP主: "${video.upper.name}"

                    请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。
                    目标收藏夹列表:
                    ${targetFolders.map(f => `- ${f.title}`).join('\n')}

                    请仅返回最合适的收藏夹的名称，不要添加任何多余的解释或标点符号。
                `;
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${apiHost}/v1/chat/completions`,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    data: JSON.stringify({
                        model: modelName,
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.5,
                    }),
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                const result = JSON.parse(response.responseText);
                                const folderName = result.choices[0].message.content.trim();
                                resolve(folderName);
                            } catch (e) {
                                reject(new Error(`解析API响应失败: ${e.message}`));
                            }
                        } else {
                             try {
                                const errorInfo = JSON.parse(response.responseText);
                                reject(new Error(`API请求失败 (状态: ${response.status}): ${errorInfo.error.message}`));
                            } catch (e) {
                                reject(new Error(`API请求失败 (状态: ${response.status})，且无法解析错误响应。`));
                            }
                        }
                    },
                    onerror: function(response) {
                        reject(new Error(`网络请求错误: ${response.statusText}`));
                    }
                });
            });
        }
    },
    /**
     * 调用智谱AI的API进行视频分类
     * @param {string} apiKey - 智谱AI的API Key
     * @param {object} videoInfo - 包含视频信息和目标收藏夹列表的对象
     * @param {object} videoInfo.video - 视频对象
     * @param {Array<object>} videoInfo.targetFolders - 目标收藏夹列表
     * @returns {Promise<string>} - 返回AI推荐的收藏夹名称
     */
    _callZhipuAI(apiKey, videoInfo) {
        return new Promise((resolve, reject) => {
            const { video, targetFolders } = videoInfo;
            const prompt = `
                我有一个B站收藏的视频，信息如下：
                - 标题: "${video.title}"
                - 简介: "${video.intro}"
                - UP主: "${video.upper.name}"

                请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。
                目标收藏夹列表:
                ${targetFolders.map(f => `- ${f.title}`).join('\n')}

                请仅返回最合适的收藏夹的名称，不要添加任何多余的解释或标点符号。
            `;

            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: "glm-4",
                    messages: [{ role: "user", content: prompt }],
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
                                const folderName = result.choices[0].message.content.trim();
                                resolve(folderName);
                            } else {
                                reject(new Error('API响应格式不正确，缺少有效的回复内容。'));
                            }
                        } catch (e) {
                            reject(new Error(`解析API响应失败: ${e.message}`));
                        }
                    } else {
                         try {
                            const errorInfo = JSON.parse(response.responseText);
                            reject(new Error(`API请求失败 (状态: ${response.status}): ${errorInfo.error.message}`));
                        } catch (e) {
                            reject(new Error(`API请求失败 (状态: ${response.status})，且无法解析错误响应。`));
                        }
                    }
                },
                onerror: function(response) {
                    reject(new Error(`网络请求错误: ${response.statusText}`));
                }
            });
        });
    }
};