import { retry } from './utils.js';
import { GM } from './utils/gmAdapter.js';

const AIClassifier = {
    _defaultPromptTemplate: `你是一个B站视频分类专家，请根据视频的标题、简介和UP主信息，将其分类到最合适的收藏夹中。
分类原则：
1. 优先考虑视频的主要内容和目的
2. 如果内容涉及多个领域，选择最主要的一个
3. 注意区分"学习"、"科普"、"技能"等相似类别
4. 学习类侧重系统知识获取，科普类侧重知识普及，技能类侧重实用技能
5. 如果视频内容不明确或难以分类，或者与所有目标收藏夹都不匹配，请返回"无合适收藏夹"
我有一个待收藏B站的视频，信息如下：
- 标题: "{videoTitle}"
- 简介: "{videoIntro}"
- UP主: "{videoUpperName}"

请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。
目标收藏夹列表:
{folderList}

如果该视频与所有目标收藏夹的主题都不匹配，请返回"无合适收藏夹"。
请仅返回最合适的收藏夹名称或"无合适收藏夹"，不要添加任何多余的解释或标点符号。`,

    _clusteringPromptTemplate: `请你扮演一个信息整理专家，为以下B站视频进行主题聚类，并为每个类别起一个简洁的名称。

聚类要求：
1. 仔细分析视频内容，确保同一类别的视频主题高度相关。
2. 避免创建过于宽泛或过于狭窄的类别。
3. 类别名称应简洁明了，格式应参考："{dominantFormat}"。
4. 相似主题的类别应合并，避免创建多个功能重叠的类别。
5. 每个类别至少包含 {minVideosPerCategory} 个以上视频，少于此数量的视频应合并到其他相关类别中。

现有收藏夹格式示例：
{formatExamples}

视频信息列表:
{videoList}

请以JSON格式返回结果，格式为：\`[{ "category_name": "类别名称", "video_titles": ["视频1标题", "视频2标题"] }]\`。不要返回任何多余的解释。`,

    _mergePromptTemplate: `请分析以下收藏夹类别名称，识别出语义相似或功能重叠的类别，并告诉我哪些应该合并。

类别列表：
{categoryList}

请以JSON格式返回合并建议，格式为：
\`{
    "merge_groups": [
        {
            "target_name": "合并后的类别名称",
            "source_names": ["待合并的类别1", "待合并的类别2"]
        }
    ],
    "keep_separate": ["保持独立的类别1", "保持独立的类别2"]
}\`
不要返回任何多余的解释。`,

     _batchClassifyPromptTemplate: `你是一个B站视频分类专家，请根据视频的标题、简介和UP主信息，将其分类到最合适的收藏夹中。
 分类原则：
1. 优先考虑视频的主要内容和目的
2. 如果内容涉及多个领域，选择最主要的一个
3. 注意区分"学习"、"科普"、"技能"等相似类别
4. 学习类侧重系统知识获取，科普类侧重知识普及，技能类侧重实用技能
5. 如果视频内容不明确或难以分类，或者与所有目标收藏夹都不匹配，请返回"无合适收藏夹"
我有一批B站收藏的视频，信息如下：
{videoList}

请从以下目标收藏夹列表中，为每一个视频选择一个最合适的收藏夹。
目标收藏夹列表:
{folderList}

请严格以JSON格式返回结果，格式为：\`{ "视频1的标题": "收藏夹名称", "视频2的标题": "收藏夹名称", ... }\`。如果视频与所有目标收藏夹都不匹配，请返回"无合适收藏夹"。不要返回任何多余的解释或非JSON内容。`,
    _extractJson: function(text) {
        if (!text) return null;
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            return match[1];
        }
        return text; // Fallback for plain JSON
    },
 
     _generatePrompt: function(video, targetFolders) {
         const userPrompt = GM.getValue('customPrompt', '');
         const template = (userPrompt && userPrompt.trim() !== '') ? userPrompt : this._defaultPromptTemplate;
         const folderList = targetFolders.map(f => `- ${f.title}`).join('\n');
         return template
             .replace('{videoTitle}', video.title)
             .replace('{videoIntro}', video.intro)
             .replace('{videoUpperName}', video.upper.name)
             .replace('{folderList}', folderList);
     },

    _generateBatchClassifyPrompt: function(videos, targetFolders) {
        const videoList = videos.map(v => `- 标题: "${v.title}", 简介: "${v.intro}", UP主: "${v.upper.name}"`).join('\n');
        const folderList = targetFolders.map(f => `- ${f.title}`).join('\n');
        return this._batchClassifyPromptTemplate
            .replace('{videoList}', videoList)
            .replace('{folderList}', folderList);
    },

    _generateClusteringPrompt: function(videos, formatInfo, minVideosPerCategory) {
        const videoList = videos.map(v => `- 标题: "${v.title}", 简介: "${v.intro}", UP主: "${v.upper.name}"`).join('\n');
        return this._clusteringPromptTemplate
            .replace('{videoList}', videoList)
            .replace('{dominantFormat}', formatInfo.dominantFormat)
            .replace('{formatExamples}', formatInfo.patterns.slice(0, 3).map(p => `- ${p.example}`).join('\n'))
            .replace('{minVideosPerCategory}', minVideosPerCategory);
    },

    _generateMergePrompt: function(categoryNames) {
        const categoryList = categoryNames.map(name => `- ${name}`).join('\n');
        return this._mergePromptTemplate.replace('{categoryList}', categoryList);
    },
 
     analyzeVideosForClustering: function(videos, apiKey, apiHost, modelName, formatInfo, minVideosPerCategory) {
         return retry(() => new Promise((resolve, reject) => {
             const prompt = this._generateClusteringPrompt(videos, formatInfo, minVideosPerCategory);
             const aiProvider = GM.getValue('aiProvider', 'openai');
             const url = aiProvider === 'zhipu' ? 'https://open.bigmodel.cn/api/paas/v4/chat/completions' : `${apiHost}/v1/chat/completions`;
            const model = aiProvider === 'zhipu' ? 'glm-4' : modelName;

            GM.xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5,
                    // For OpenAI, you can specify response_format for JSON mode
                    ...(aiProvider === 'openai' && { response_format: { type: "json_object" } })
                }),
                onload: response => {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            const content = result.choices[0].message.content;
                            const jsonContent = this._extractJson(content);
                            if (!jsonContent) {
                                throw new Error('AI响应中未找到有效的JSON内容。');
                            }
                            resolve(JSON.parse(jsonContent));
                        } catch (e) {
                            reject(new Error(`解析AI聚类响应失败: ${e.message}. 原始响应: ${response.responseText}`));
                        }
                    } else {
                         try {
                            const errorInfo = JSON.parse(response.responseText);
                            reject(new Error(`AI聚类请求失败 (状态: ${response.status}): ${errorInfo.error.message}`));
                        } catch (e) {
                            reject(new Error(`AI聚类请求失败 (状态: ${response.status})，且无法解析错误响应。`));
                        }
                    }
                },
                onerror: response => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
        }));
    },

   getMergeSuggestions: function(categoryNames, apiKey, apiHost, modelName) {
       return retry(() => new Promise((resolve, reject) => {
           const prompt = this._generateMergePrompt(categoryNames);
           const aiProvider = GM.getValue('aiProvider', 'openai');
           const url = aiProvider === 'zhipu' ? 'https://open.bigmodel.cn/api/paas/v4/chat/completions' : `${apiHost}/v1/chat/completions`;
           const model = aiProvider === 'zhipu' ? 'glm-4' : modelName;

           GM.xmlhttpRequest({
               method: "POST",
               url: url,
               headers: {
                   "Content-Type": "application/json",
                   "Authorization": `Bearer ${apiKey}`
               },
               data: JSON.stringify({
                   model: model,
                   messages: [{ role: "user", content: prompt }],
                   temperature: 0.3,
                   ...(aiProvider === 'openai' && { response_format: { type: "json_object" } })
               }),
               onload: response => {
                   if (response.status === 200) {
                       try {
                           const result = JSON.parse(response.responseText);
                           const content = result.choices[0].message.content;
                           const jsonContent = this._extractJson(content);
                           if (!jsonContent) {
                               throw new Error('AI响应中未找到有效的JSON内容。');
                           }
                           resolve(JSON.parse(jsonContent));
                       } catch (e) {
                           reject(new Error(`解析AI合并建议响应失败: ${e.message}. 原始响应: ${response.responseText}`));
                       }
                   } else {
                       try {
                           const errorInfo = JSON.parse(response.responseText);
                           reject(new Error(`AI合并建议请求失败 (状态: ${response.status}): ${errorInfo.error.message}`));
                       } catch (e) {
                           reject(new Error(`AI合并建议请求失败 (状态: ${response.status})，且无法解析错误响应。`));
                       }
                   }
               },
               onerror: response => reject(new Error(`网络请求错误: ${response.statusText}`))
           });
       }));
   },

    classify: function(video, targetFolders, apiKey, apiHost, modelName) {
        const aiProvider = GM.getValue('aiProvider', 'openai');
        if (aiProvider === 'zhipu') {
            return this._callZhipuAI(apiKey, { video, targetFolders });
        } else {
            return retry(() => new Promise((resolve, reject) => {
                const prompt = this._generatePrompt(video, targetFolders);
                
                
                GM.xmlhttpRequest({
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
                    onload: response => {
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
                    onerror: response => reject(new Error(`网络请求错误: ${response.statusText}`))
                });
            }));
        }
    },
    _callZhipuAI: function(apiKey, { video, targetFolders }) {
        return retry(() => new Promise((resolve, reject) => {
            const prompt = this._generatePrompt(video, targetFolders);
            
            
            GM.xmlhttpRequest({
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
                onload: response => {
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
                onerror: response => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
        }));
    },

    classifyBatch: function(videos, targetFolders, apiKey, apiHost, modelName) {
        return retry(() => new Promise((resolve, reject) => {
            const prompt = this._generateBatchClassifyPrompt(videos, targetFolders);
            const aiProvider = GM.getValue('aiProvider', 'openai');
            const url = aiProvider === 'zhipu' ? 'https://open.bigmodel.cn/api/paas/v4/chat/completions' : `${apiHost}/v1/chat/completions`;
            const model = aiProvider === 'zhipu' ? 'glm-4' : modelName;

            GM.xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5,
                    ...(aiProvider === 'openai' && { response_format: { type: "json_object" } })
                }),
                onload: response => {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            const content = result.choices[0].message.content;
                            const jsonContent = this._extractJson(content);
                            if (!jsonContent) {
                                throw new Error('AI响应中未找到有效的JSON内容。');
                            }
                            resolve(JSON.parse(jsonContent));
                        } catch (e) {
                            reject(new Error(`解析AI批量分类响应失败: ${e.message}. 原始响应: ${response.responseText}`));
                        }
                    } else {
                         try {
                            const errorInfo = JSON.parse(response.responseText);
                            reject(new Error(`AI批量分类请求失败 (状态: ${response.status}): ${errorInfo.error.message}`));
                        } catch (e) {
                            reject(new Error(`AI批量分类请求失败 (状态: ${response.status})，且无法解析错误响应。`));
                        }
                    }
                },
                onerror: response => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
        }));
    }
};
export default AIClassifier;