// ==UserScript==
// @name         Bilibili 收藏夹 AI 分类助手 (Vue)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @author       Roo
// @description  利用AI（GPT）智能、批量地整理Bilibili收藏夹，采用全新的悬浮按钮和侧滑面板UI，提供流畅的交互体验，支持多源收藏夹。
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/atri1011/bilibili-favorites-classifier-userscript#readme
// @homepageURL  https://github.com/atri1011/bilibili-favorites-classifier-userscript#readme
// @source       https://github.com/atri1011/bilibili-favorites-classifier-userscript.git
// @supportURL   https://github.com/atri1011/bilibili-favorites-classifier-userscript/issues
// @match        *://space.bilibili.com/*
// @match        *://www.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.18/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/pinia@3.0.3/dist/pinia.iife.prod.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/named-register.min.js
// @require      data:application/javascript,%3B(typeof%20System!%3D'undefined')%26%26(System%3Dnew%20System.constructor())%3B
// @connect      api.bilibili.com
// @connect      open.bigmodel.cn
// @connect      *
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' #bfc-fab{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background-color:#fb7299;border-radius:50%;box-shadow:0 4px 12px #0003;display:flex;justify-content:center;align-items:center;cursor:pointer;z-index:10000;transition:all .3s cubic-bezier(.25,.8,.25,1);opacity:.8}#bfc-fab:hover{opacity:1;transform:scale(1.1)}#bfc-fab span{font-size:24px;color:#fff;transition:transform .3s ease}body.bfc-settings-mode{overflow:hidden}body.bfc-settings-mode .bili-header,body.bfc-settings-mode #app,body.bfc-settings-mode .bili-footer{display:none!important}#bfc-settings-view{padding:20px;border-top:1px solid #e3e5e7;background-color:transparent}#bfc-panel{display:none;flex-direction:column;background-color:transparent}body.bfc-settings-mode #bfc-panel{display:flex;position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;overflow-y:auto}.bfc-panel-header{padding:15px 20px;border-bottom:1px solid #e3e5e7;display:flex;justify-content:space-between;align-items:center}.bfc-panel-header h2{margin:0;font-size:16px;font-weight:600;color:#1a1a1a}.bfc-panel-header .icons span{font-size:20px;cursor:pointer;margin-left:15px;color:#666}.bfc-panel-body{flex-grow:1;padding:20px;overflow-y:auto}.bfc-tabs{display:flex;border-bottom:1px solid #e3e5e7;background-color:transparent}.bfc-tabs button{padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;color:#666;border-bottom:2px solid transparent}.bfc-tabs button.active{color:#fb7299;border-bottom-color:#fb7299}.bfc-panel-footer{padding:15px 20px;border-top:1px solid #e3e5e7;background-color:transparent;font-size:12px;color:#999}.bfc-form-group{margin-bottom:20px}.bfc-form-group label{display:block;margin-bottom:8px;font-size:14px;font-weight:500;color:#333}.bfc-select,.bfc-input,.bfc-button{width:100%;padding:10px;border-radius:6px;border:1px solid #ccc;font-size:14px;box-sizing:border-box}.bfc-checkbox-group{background-color:transparent;border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:10px;height:120px;overflow-y:auto}.bfc-checkbox-item{display:flex;align-items:center;margin-bottom:8px}.bfc-checkbox-item input[type=checkbox]{margin-right:8px}.bfc-checkbox-item label{font-weight:400;font-size:14px;cursor:pointer;flex-grow:1}.bfc-button{background-color:#fb7299;color:#fff;border:none;cursor:pointer;transition:background-color .3s}.bfc-button:hover{background-color:#e56a8a}.bfc-action-buttons{display:flex;gap:10px;margin-bottom:10px}.bfc-button-danger{background-color:#dc3545}.bfc-button-danger:hover{background-color:#c82333}.bfc-log-item{padding:8px;border-bottom:1px solid #eee;font-size:13px}.bfc-log-item.success{color:#28a745}.bfc-log-item.error{color:#dc3545}.bfc-log-item.info{color:#17a2b8}#bfc-batch-create-btn{background-color:#00a1d6;color:#fff;border:none;cursor:pointer;margin-top:10px;transition:background-color .3s,opacity .3s}#bfc-batch-create-btn:hover{background-color:#00b5e5}#bfc-batch-create-btn:disabled{opacity:.6;cursor:not-allowed}#bfc-popup{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;background-color:#fff;border-radius:8px;box-shadow:0 4px 12px #00000026;z-index:10001;padding:15px;font-size:14px;color:#333;display:none;flex-direction:column;gap:10px}#bfc-popup.show{display:flex}#bfc-popup-message{font-weight:500}#bfc-popup-buttons{display:flex;justify-content:flex-end;gap:8px}.bfc-popup-button{padding:5px 10px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background-color:#f4f5f7}.bfc-popup-button.primary{background-color:#fb7299;color:#fff;border-color:#fb7299}#bfc-popup-collect-only{background-color:#00a1d6;color:#fff;border-color:#00a1d6}#bfc-results-view{padding:20px;border-top:1px solid #e3e5e7;background-color:transparent}.bfc-results-summary{display:flex;align-items:center;gap:20px;margin-bottom:20px}.bfc-chart-container{width:200px;height:200px}.bfc-results-stats p{margin:5px 0;font-size:16px}.bfc-results-stats .success{color:#28a745}.bfc-results-stats .error{color:#dc3545}.bfc-results-stats .info{color:#17a2b8}.bfc-results-table-container{max-height:400px;overflow-y:auto;border:1px solid #e3e5e7;border-radius:6px}.bfc-results-table{width:100%;border-collapse:collapse}.bfc-results-table th,.bfc-results-table td{padding:12px 15px;text-align:left;border-bottom:1px solid #e3e5e7}.bfc-results-table th{background-color:#f4f5f7;font-weight:600}.bfc-results-table tbody tr:last-child td{border-bottom:none}.bfc-results-table a{color:#00a1d6;text-decoration:none}.bfc-results-table a:hover{text-decoration:underline}#bfc-diagnose-view p{font-size:14px;color:#666;line-height:1.6}.bfc-progress-bar{width:100%;height:10px;background-color:#e3e5e7;border-radius:5px;overflow:hidden;margin:10px 0}.bfc-progress{height:100%;background-color:#00a1d6;transition:width .3s ease}#bfc-diagnose-report{margin-top:20px}.bfc-report-section{margin-bottom:20px}.bfc-report-item{background:transparent;padding:15px;border:1px solid rgba(255,255,255,.2);border-radius:6px;margin-bottom:10px}.bfc-report-item ul{list-style-type:disc;padding-left:20px;margin-top:5px;font-size:13px;color:#999}#bfc-popup-favlist-container{margin-top:10px;display:flex;align-items:center;justify-content:center}#bfc-popup-favlist-container label{margin-right:8px;font-size:14px}#bfc-favlist-select{padding:5px;border-radius:4px;border:1px solid #ccc;min-width:150px}.bfc-steps-indicator{display:flex;align-items:center;justify-content:center;margin-bottom:25px}.bfc-step{padding:8px 16px;border-radius:20px;background-color:#e3e5e7;color:#999;font-weight:600;transition:all .3s ease}.bfc-step.active{background-color:#fb7299;color:#fff}.bfc-step.completed{background-color:#00a1d6;color:#fff}.bfc-step-line{flex-grow:1;height:2px;background-color:#e3e5e7;margin:0 10px}.step-description{font-size:14px;color:#666;margin-bottom:15px;text-align:center}.bfc-step-navigation{display:flex;justify-content:space-between;margin-top:20px}#bfc-modal-container #bfc-panel{display:flex;position:relative;width:100%;height:100%;z-index:auto}.bfc-log-container[data-v-523941be]{margin-top:10px}.bfc-log-panel[data-v-523941be]{height:200px;overflow-y:scroll;background:transparent;border:1px solid rgba(255,255,255,.2);padding:10px;border-radius:6px}.bfc-log-item[data-v-523941be]{margin-bottom:5px;word-break:break-word}.bfc-log-item.info[data-v-523941be]{color:#333}.bfc-log-item.success[data-v-523941be]{color:#28a745}.bfc-log-item.error[data-v-523941be]{color:#dc3545}.bfc-log-item.warning[data-v-523941be]{color:#ffc107}.bfc-model-dropdown[data-v-96ff3b49]{position:absolute;top:100%;left:0;right:0;z-index:1000;max-height:150px;overflow-y:auto;background-color:#ffffffbf;backdrop-filter:blur(var(--blur-intensity, 8px));-webkit-backdrop-filter:blur(var(--blur-intensity, 8px));border-radius:.75rem;border:1px solid rgba(209,213,219,.3);box-shadow:0 4px 6px -1px #0000001a,0 2px 4px -2px #0000001a}.bfc-model-dropdown-item[data-v-96ff3b49]{padding:8px 12px;cursor:pointer;text-align:left;color:#1f2937;transition:background-color .2s cubic-bezier(.4,0,.2,1)}.bfc-model-dropdown-item[data-v-96ff3b49]:hover{background-color:#ffffff80}.transfer-list[data-v-ec32a844]{display:flex;justify-content:space-between;align-items:center;width:100%}.transfer-list-panel[data-v-ec32a844]{width:45%;border:1px solid rgba(255,255,255,.2);background-color:transparent;border-radius:6px;height:300px;display:flex;flex-direction:column}.transfer-list-header[data-v-ec32a844]{padding:8px 12px;background-color:transparent;border-bottom:1px solid rgba(255,255,255,.2);display:flex;justify-content:space-between;align-items:center;font-weight:600}.transfer-list-select-all[data-v-ec32a844]{background:none;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:12px;padding:2px 6px}.transfer-list-filter[data-v-ec32a844]{width:calc(100% - 20px);margin:10px;padding:8px;border:1px solid #ccc;border-radius:4px}.transfer-list-items[data-v-ec32a844]{list-style:none;margin:0;padding:0 10px 10px;overflow-y:auto;flex-grow:1}.transfer-list-items li[data-v-ec32a844]{padding:8px;cursor:pointer;border-radius:4px}.transfer-list-items li[data-v-ec32a844]:hover{background-color:#ffffff1a}.transfer-list-items li.selected[data-v-ec32a844]{background-color:#bbdefb}.transfer-list-actions[data-v-ec32a844]{display:flex;flex-direction:column;gap:10px}.transfer-list-actions button[data-v-ec32a844]{padding:8px 12px;border:1px solid #ccc;border-radius:4px;background-color:#f4f5f7;cursor:pointer}.transfer-list-actions button[data-v-ec32a844]:disabled{opacity:.5;cursor:not-allowed}.beautify-view[data-v-e4a84f96]{padding:20px}h3[data-v-e4a84f96]{margin-top:0;margin-bottom:20px;font-size:18px;font-weight:600}.bfc-form-group[data-v-e4a84f96]{margin-bottom:20px}.bfc-form-group label[data-v-e4a84f96]{display:block;margin-bottom:10px;font-size:14px;font-weight:500;color:#333}.bfc-slider[data-v-e4a84f96]{width:100%;cursor:pointer}@media (prefers-color-scheme: dark){.bfc-form-group label[data-v-e4a84f96]{color:#f0f0f0}}.bfc-hidden{display:none!important}#bfc-popup[data-v-4f559ce1]{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:1px solid #ccc;padding:20px;z-index:9999;display:none;max-width:400px;width:90%;border-radius:8px;box-shadow:0 4px 12px #00000026}#bfc-popup.show[data-v-4f559ce1]{display:block}#bfc-popup-message[data-v-4f559ce1]{margin-bottom:15px;line-height:1.5}#bfc-popup-favlist-container[data-v-4f559ce1]{margin-bottom:15px}#bfc-popup-favlist-container label[data-v-4f559ce1]{display:block;margin-bottom:5px;font-weight:700}#bfc-favlist-select[data-v-4f559ce1]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px}#bfc-popup-buttons[data-v-4f559ce1]{display:flex;justify-content:flex-end;gap:10px}.bfc-popup-button[data-v-4f559ce1]{padding:8px 16px;border:1px solid #ddd;border-radius:4px;background-color:#f5f5f5;cursor:pointer;font-size:14px;transition:background-color .2s}.bfc-popup-button[data-v-4f559ce1]:hover{background-color:#e0e0e0}.bfc-popup-button.primary[data-v-4f559ce1]{background-color:#fb7299;color:#fff;border-color:#fb7299}.bfc-popup-button.primary[data-v-4f559ce1]:hover{background-color:#e06188}.bfc-hidden[data-v-4f559ce1]{display:none}.floating-recommendation[data-v-e66bf753]{position:fixed;top:120px;right:20px;width:320px;background:#fffffff2;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-radius:16px;box-shadow:0 8px 32px #0000001f;border:1px solid rgba(255,255,255,.2);z-index:10000;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);overflow:hidden}.floating-recommendation.slide-in[data-v-e66bf753]{transform:translate(0)}.floating-recommendation.collapsed[data-v-e66bf753]{transform:translate(100%);width:0;overflow:hidden}.loading-container[data-v-e66bf753]{padding:20px;display:flex;align-items:center;gap:12px}.loading-spinner[data-v-e66bf753]{width:24px;height:24px;border:2px solid rgba(251,114,153,.2);border-top:2px solid #fb7299;border-radius:50%;animation:spin-e66bf753 1s linear infinite}@keyframes spin-e66bf753{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.loading-text[data-v-e66bf753]{color:#666;font-size:14px}.recommendation-container[data-v-e66bf753]{padding:16px}.recommendation-header[data-v-e66bf753]{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}.ai-icon[data-v-e66bf753]{font-size:24px;flex-shrink:0}.header-text[data-v-e66bf753]{flex:1;min-width:0}.header-text h4[data-v-e66bf753]{margin:0 0 4px;font-size:16px;font-weight:600;color:#333}.video-title[data-v-e66bf753]{margin:0;font-size:12px;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.close-btn[data-v-e66bf753]{background:none;border:none;font-size:24px;color:#999;cursor:pointer;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color .2s}.close-btn[data-v-e66bf753]:hover{background-color:#0000000d}.recommendation-content[data-v-e66bf753]{margin-bottom:16px}.no-match p[data-v-e66bf753]{margin:0 0 8px;color:#666;font-size:14px}.suggestion[data-v-e66bf753]{font-size:12px;color:#999}.match-found .recommended-folder[data-v-e66bf753]{display:flex;align-items:center;gap:12px;padding:12px;background:#fb72990d;border:1px solid rgba(251,114,153,.2);border-radius:12px}.folder-icon[data-v-e66bf753]{font-size:20px}.folder-name[data-v-e66bf753]{flex:1;font-weight:500;color:#333;font-size:14px}.confidence[data-v-e66bf753]{font-size:12px;color:#666;background:#fb72991a;padding:2px 8px;border-radius:12px}.recommendation-actions[data-v-e66bf753]{display:flex;gap:8px}.folder-select-container[data-v-e66bf753]{margin-top:16px;display:flex;flex-direction:column;gap:8px}.select-label[data-v-e66bf753]{font-size:13px;color:#666;font-weight:500}.folder-select[data-v-e66bf753]{width:100%;padding:10px 12px;border:1px solid rgba(0,0,0,.1);border-radius:12px;background:#fffc;font-size:14px;color:#333;appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%20197.4L159.7%2069.7c-3.2-3.2-8.3-3.2-11.6%200L5.4%20197.4c-3.2%203.2-3.2%208.3%200%2011.6l11.6%2011.6c3.2%203.2%208.3%203.2%2011.6%200l120.2-120.2c3.2-3.2%208.3-3.2%2011.6%200l120.2%20120.2c3.2%203.2%208.3%203.2%2011.6%200l11.6-11.6c3.2-3.2%203.2-8.4%200-11.6z%22%2F%3E%3C%2Fsvg%3E);background-repeat:no-repeat;background-position:right 12px top 50%;background-size:12px auto;cursor:pointer;outline:none;transition:border-color .2s,box-shadow .2s}.folder-select[data-v-e66bf753]:focus{border-color:#fb7299;box-shadow:0 0 0 2px #fb729933}.btn[data-v-e66bf753]{flex:1;padding:10px 16px;border:none;border-radius:12px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}.btn[data-v-e66bf753]:disabled{opacity:.6;cursor:not-allowed}.btn-primary[data-v-e66bf753]{background:#fb7299;color:#fff;box-shadow:0 2px 8px #fb72994d}.btn-primary[data-v-e66bf753]:hover:not(:disabled){background:#e85a85;transform:translateY(-1px);box-shadow:0 4px 12px #fb729966}.btn-secondary[data-v-e66bf753]{background:#0000000d;color:#666;border:1px solid rgba(0,0,0,.1)}.btn-secondary[data-v-e66bf753]:hover{background:#0000001a;transform:translateY(-1px)}.error-container[data-v-e66bf753]{padding:20px;text-align:center}.error-icon[data-v-e66bf753]{font-size:32px;margin-bottom:12px}.error-message[data-v-e66bf753]{color:#666;font-size:14px;margin-bottom:16px;line-height:1.4}@media (max-width: 768px){.floating-recommendation[data-v-e66bf753]{right:10px;width:300px;top:80px}}@media (max-width: 480px){.floating-recommendation[data-v-e66bf753]{right:10px;left:10px;width:auto;max-width:none}}@media (prefers-color-scheme: dark){.floating-recommendation[data-v-e66bf753]{background:#1e1e1ef2;border:1px solid rgba(255,255,255,.1)}.header-text h4[data-v-e66bf753]{color:#fff}.video-title[data-v-e66bf753],.loading-text[data-v-e66bf753],.no-match p[data-v-e66bf753],.select-label[data-v-e66bf753]{color:#ccc}.suggestion[data-v-e66bf753]{color:#999}.folder-name[data-v-e66bf753]{color:#fff}.confidence[data-v-e66bf753]{color:#ccc}.folder-select[data-v-e66bf753]{background:#ffffff1a;border:1px solid rgba(255,255,255,.1);color:#fff;background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23ccc%22%20d%3D%22M287%20197.4L159.7%2069.7c-3.2-3.2-8.3-3.2-11.6%200L5.4%20197.4c-3.2%203.2-3.2%208.3%200%2011.6l11.6%2011.6c3.2%203.2%208.3%203.2%2011.6%200l120.2-120.2c3.2-3.2%208.3-3.2%2011.6%200l120.2%20120.2c3.2%203.2%208.3%203.2%2011.6%200l11.6-11.6c3.2-3.2%203.2-8.4%200-11.6z%22%2F%3E%3C%2Fsvg%3E)}.folder-select[data-v-e66bf753]:focus{border-color:#fb7299;box-shadow:0 0 0 2px #fb729933}.btn-secondary[data-v-e66bf753]{background:#ffffff0d;color:#ccc;border:1px solid rgba(255,255,255,.1)}.btn-secondary[data-v-e66bf753]:hover{background:#ffffff1a}.error-message[data-v-e66bf753]{color:#ccc}}.side-button[data-v-73e8ef95]{position:fixed;right:20px;top:50%;transform:translateY(-50%);width:48px;height:120px;background:#ffffffd9;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;z-index:10000;transition:all .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 4px 20px #fb729926;border:1px solid rgba(255,255,255,.3);-webkit-user-select:none;user-select:none;overflow:hidden}.side-button[data-v-73e8ef95]:hover{background:#fffffff2;transform:translateY(-50%) scale(1.05);box-shadow:0 8px 24px #fb729940}.side-button.clicked[data-v-73e8ef95]{transform:translateY(-50%) scale(.95);box-shadow:0 2px 8px #fb729933}.side-button[data-v-73e8ef95]:before{content:"";position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:#fb72994d;transform:translate(-50%,-50%);transition:width .6s,height .6s}.side-button.clicked[data-v-73e8ef95]:before{width:100px;height:100px}.ai-icon[data-v-73e8ef95]{display:flex;align-items:center;justify-content:center;width:24px;height:24px}.button-text[data-v-73e8ef95]{font-size:12px;font-weight:500;color:#fb7299;text-align:center;line-height:1.2;max-width:40px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.loading-spinner[data-v-73e8ef95]{width:20px;height:20px;border:2px solid rgba(251,114,153,.2);border-top:2px solid #fb7299;border-radius:50%;animation:spin-73e8ef95 1s cubic-bezier(.68,-.55,.265,1.55) infinite}@keyframes spin-73e8ef95{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.side-button.loading[data-v-73e8ef95]{animation:pulse-73e8ef95 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes pulse-73e8ef95{0%,to{box-shadow:0 4px 20px #fb729926}50%{box-shadow:0 4px 20px #fb729966}}.side-button.loading[data-v-73e8ef95]{background:#fb72991a;border-color:#fb72994d}.side-button.success[data-v-73e8ef95]{background:#4caf501a;border-color:#4caf504d}.side-button.success .button-text[data-v-73e8ef95]{color:#4caf50}.side-button.error[data-v-73e8ef95]{background:#f443361a;border-color:#f443364d}.side-button.error .button-text[data-v-73e8ef95]{color:#f44336}@media (max-width: 1200px){.side-button[data-v-73e8ef95]{right:16px;width:46px;height:115px}}@media (max-width: 768px){.side-button[data-v-73e8ef95]{right:12px;width:44px;height:110px;border-radius:22px}.button-text[data-v-73e8ef95]{font-size:11px;max-width:38px}}@media (max-width: 480px){.side-button[data-v-73e8ef95]{right:8px;width:40px;height:100px;border-radius:20px}.button-text[data-v-73e8ef95]{font-size:10px;max-width:34px}.ai-icon svg[data-v-73e8ef95]{width:20px;height:20px}.loading-spinner[data-v-73e8ef95]{width:16px;height:16px}}@media (max-height: 600px) and (orientation: landscape){.side-button[data-v-73e8ef95]{height:90px;top:45%}.button-text[data-v-73e8ef95]{font-size:10px;max-width:34px}}@media (prefers-color-scheme: dark){.side-button[data-v-73e8ef95]{background:#1e1e1ed9;border:1px solid rgba(255,255,255,.15);box-shadow:0 4px 20px #0000004d}.side-button[data-v-73e8ef95]:hover{background:#282828f2;box-shadow:0 8px 24px #fb72994d}.button-text[data-v-73e8ef95]{color:#ff8fab}.side-button.loading[data-v-73e8ef95]{background:#fb729933;border-color:#fb729980}.side-button.success[data-v-73e8ef95]{background:#4caf5033;border-color:#4caf5080}.side-button.error[data-v-73e8ef95]{background:#f4433633;border-color:#f4433680}.side-button.clicked[data-v-73e8ef95]{box-shadow:0 2px 8px #0006}}html[data-theme=dark] .side-button[data-v-73e8ef95],.bili-dark .side-button[data-v-73e8ef95]{background:#1e1e1ed9;border:1px solid rgba(255,255,255,.15);box-shadow:0 4px 20px #0000004d}html[data-theme=dark] .side-button[data-v-73e8ef95]:hover,.bili-dark .side-button[data-v-73e8ef95]:hover{background:#282828f2;box-shadow:0 8px 24px #fb72994d}html[data-theme=dark] .button-text[data-v-73e8ef95],.bili-dark .button-text[data-v-73e8ef95]{color:#ff8fab}.modal-overlay[data-v-b427cc1c]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#0009;display:flex;justify-content:center;align-items:center;z-index:10000}.modal-content[data-v-b427cc1c]{background-color:#ffffff4d;-webkit-backdrop-filter:blur(var(--blur-intensity));backdrop-filter:blur(var(--blur-intensity));padding:20px;border-radius:12px;box-shadow:0 5px 15px #0000004d;width:90vw;height:80vh;max-width:1200px;position:relative;display:flex;flex-direction:column}.modal-close-button[data-v-b427cc1c]{position:absolute;top:10px;right:10px;background:none;border:none;font-size:24px;cursor:pointer;color:#888}.modal-close-button[data-v-b427cc1c]:hover{color:#000}@media (prefers-color-scheme: dark){.modal-content[data-v-b427cc1c]{background-color:#1e1e1e80;color:#f0f0f0}.modal-close-button[data-v-b427cc1c]{color:#aaa}.modal-close-button[data-v-b427cc1c]:hover{color:#fff}} ');

System.addImportMap({ imports: {"pinia":"user:pinia","vue":"user:vue"} });
System.set("user:pinia", (()=>{const _=Pinia;('default' in _)||(_.default=_);return _})());
System.set("user:vue", (()=>{const _=Vue;('default' in _)||(_.default=_);return _})());

System.register("./__entry.js", ['pinia', 'vue'], (function (exports, module) {
  'use strict';
  var defineStore, createPinia, createApp$1, createElementBlock, createCommentVNode, openBlock, normalizeClass, createElementVNode, toDisplayString, withDirectives, Fragment, renderList, vModelSelect, ref, computed, watch, withModifiers, renderSlot, provide, resolveComponent, createBlock, withCtx, createVNode, vShow, onMounted, vModelText, createTextVNode, nextTick, unref, inject;
  return {
    setters: [module => {
      defineStore = module.defineStore;
      createPinia = module.createPinia;
    }, module => {
      createApp$1 = module.createApp;
      createElementBlock = module.createElementBlock;
      createCommentVNode = module.createCommentVNode;
      openBlock = module.openBlock;
      normalizeClass = module.normalizeClass;
      createElementVNode = module.createElementVNode;
      toDisplayString = module.toDisplayString;
      withDirectives = module.withDirectives;
      Fragment = module.Fragment;
      renderList = module.renderList;
      vModelSelect = module.vModelSelect;
      ref = module.ref;
      computed = module.computed;
      watch = module.watch;
      withModifiers = module.withModifiers;
      renderSlot = module.renderSlot;
      provide = module.provide;
      resolveComponent = module.resolveComponent;
      createBlock = module.createBlock;
      withCtx = module.withCtx;
      createVNode = module.createVNode;
      vShow = module.vShow;
      onMounted = module.onMounted;
      vModelText = module.vModelText;
      createTextVNode = module.createTextVNode;
      nextTick = module.nextTick;
      unref = module.unref;
      inject = module.inject;
    }],
    execute: (function () {

      const scriptRel = function detectScriptRel() {
        const relList = typeof document !== "undefined" && document.createElement("link").relList;
        return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
      }();
      const assetsURL = function(dep) {
        return "/" + dep;
      };
      const seen = {};
      const __vitePreload = function preload(baseModule, deps, importerUrl) {
        let promise = Promise.resolve();
        if (deps && deps.length > 0) {
          document.getElementsByTagName("link");
          const cspNonceMeta = document.querySelector(
            "meta[property=csp-nonce]"
          );
          const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
          promise = Promise.allSettled(
            deps.map((dep) => {
              dep = assetsURL(dep);
              if (dep in seen) return;
              seen[dep] = true;
              const isCss = dep.endsWith(".css");
              const cssSelector = isCss ? '[rel="stylesheet"]' : "";
              if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
                return;
              }
              const link = document.createElement("link");
              link.rel = isCss ? "stylesheet" : scriptRel;
              if (!isCss) {
                link.as = "script";
              }
              link.crossOrigin = "";
              link.href = dep;
              if (cspNonce) {
                link.setAttribute("nonce", cspNonce);
              }
              document.head.appendChild(link);
              if (isCss) {
                return new Promise((res, rej) => {
                  link.addEventListener("load", res);
                  link.addEventListener(
                    "error",
                    () => rej(new Error(`Unable to preload CSS for ${dep}`))
                  );
                });
              }
            })
          );
        }
        function handlePreloadError(err) {
          const e = new Event("vite:preloadError", {
            cancelable: true
          });
          e.payload = err;
          window.dispatchEvent(e);
          if (!e.defaultPrevented) {
            throw err;
          }
        }
        return promise.then((res) => {
          for (const item of res || []) {
            if (item.status !== "rejected") continue;
            handlePreloadError(item.reason);
          }
          return baseModule().catch(handlePreloadError);
        });
      };
      const STORAGE_PREFIX = "bfc_";
      let _isUserscriptEnv = null;
      const isUserscriptEnv = () => {
        if (_isUserscriptEnv !== null) {
          return _isUserscriptEnv;
        }
        _isUserscriptEnv = typeof GM_getValue !== "undefined" && typeof GM_setValue !== "undefined";
        return _isUserscriptEnv;
      };
      const localStorageImpl = {
        getValue: function(key, defaultValue) {
          try {
            const storedValue = localStorage.getItem(STORAGE_PREFIX + key);
            return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
          } catch (e) {
            console.error(`Error reading from localStorage:`, e);
            return defaultValue;
          }
        },
        setValue: function(key, value) {
          try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
          } catch (e) {
            console.error(`Error writing to localStorage:`, e);
          }
        },
        deleteValue: function(key) {
          try {
            localStorage.removeItem(STORAGE_PREFIX + key);
          } catch (e) {
            console.error(`Error deleting from localStorage:`, e);
          }
        },
        listValues: function() {
          const values = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
              const actualKey = key.substring(STORAGE_PREFIX.length);
              try {
                values[actualKey] = JSON.parse(localStorage.getItem(key));
              } catch (e) {
                console.error(`Error parsing localStorage value for key ${key}:`, e);
              }
            }
          }
          return values;
        }
      };
      const GM = {
        // 获取值
        getValue: function(key, defaultValue) {
          if (isUserscriptEnv()) {
            return GM_getValue(key, defaultValue);
          } else {
            return localStorageImpl.getValue(key, defaultValue);
          }
        },
        // 设置值
        setValue: function(key, value) {
          if (isUserscriptEnv()) {
            GM_setValue(key, value);
          } else {
            localStorageImpl.setValue(key, value);
          }
        },
        // 删除值
        deleteValue: function(key) {
          if (isUserscriptEnv()) {
            GM_deleteValue(key);
          } else {
            localStorageImpl.deleteValue(key);
          }
        },
        // 列出所有值
        listValues: function() {
          if (isUserscriptEnv() && typeof GM_listValues !== "undefined") {
            return GM_listValues();
          } else {
            return localStorageImpl.listValues();
          }
        },
        // 添加样式
        addStyle: function(css) {
          if (isUserscriptEnv() && typeof GM_addStyle !== "undefined") {
            GM_addStyle(css);
          } else {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
          }
        },
        // XML HTTP 请求
        xmlhttpRequest: function(details) {
          if (isUserscriptEnv() && typeof GM_xmlhttpRequest !== "undefined") {
            return GM_xmlhttpRequest(details);
          } else {
            const controller = new AbortController();
            const signal = controller.signal;
            const fetchOptions = {
              method: details.method || "GET",
              headers: details.headers || {},
              signal
            };
            if (details.data) {
              if (details.headers && details.headers["Content-Type"] === "application/json") {
                fetchOptions.body = JSON.stringify(details.data);
              } else {
                fetchOptions.body = details.data;
              }
            }
            fetch(details.url, fetchOptions).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text().then((text) => {
                const responseDetails = {
                  responseText: text,
                  status: response.status,
                  statusText: response.statusText,
                  responseHeaders: Object.fromEntries(response.headers.entries()),
                  finalUrl: response.url
                };
                if (details.onload) {
                  details.onload(responseDetails);
                }
              });
            }).catch((error) => {
              if (details.onerror) {
                details.onerror(error);
              }
            });
            return {
              abort: () => controller.abort()
            };
          }
        },
        // 检查是否在用户脚本环境中
        isUserscriptEnv: () => isUserscriptEnv()
      };
      const GM_getValue = (key, defaultValue) => {
        if (isUserscriptEnv()) {
          if (typeof window.GM_getValue !== "undefined") {
            return window.GM_getValue(key, defaultValue);
          }
          return localStorageImpl.getValue(key, defaultValue);
        } else {
          return localStorageImpl.getValue(key, defaultValue);
        }
      };
      const GM_setValue = (key, value) => {
        if (isUserscriptEnv()) {
          if (typeof window.GM_setValue !== "undefined") {
            window.GM_setValue(key, value);
          } else {
            localStorageImpl.setValue(key, value);
          }
        } else {
          localStorageImpl.setValue(key, value);
        }
      };
      const GM_deleteValue = (key) => {
        if (isUserscriptEnv()) {
          if (typeof window.GM_deleteValue !== "undefined") {
            window.GM_deleteValue(key);
          } else {
            localStorageImpl.deleteValue(key);
          }
        } else {
          localStorageImpl.deleteValue(key);
        }
      };
      const GM_listValues = () => {
        if (isUserscriptEnv() && typeof window.GM_listValues !== "undefined") {
          return window.GM_listValues();
        } else {
          return localStorageImpl.listValues();
        }
      };
      const GM_addStyle = (css) => {
        if (isUserscriptEnv() && typeof window.GM_addStyle !== "undefined") {
          window.GM_addStyle(css);
        } else {
          const style = document.createElement("style");
          style.textContent = css;
          document.head.appendChild(style);
        }
      };
      const GM_xmlhttpRequest = (details) => {
        if (isUserscriptEnv() && typeof window.GM_xmlhttpRequest !== "undefined") {
          return window.GM_xmlhttpRequest(details);
        } else {
          const controller = new AbortController();
          const signal = controller.signal;
          const fetchOptions = {
            method: details.method || "GET",
            headers: details.headers || {},
            signal
          };
          if (details.data) {
            if (details.headers && details.headers["Content-Type"] === "application/json") {
              fetchOptions.body = JSON.stringify(details.data);
            } else {
              fetchOptions.body = details.data;
            }
          }
          fetch(details.url, fetchOptions).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text().then((text) => {
              const responseDetails = {
                responseText: text,
                status: response.status,
                statusText: response.statusText,
                responseHeaders: Object.fromEntries(response.headers.entries()),
                finalUrl: response.url
              };
              if (details.onload) {
                details.onload(responseDetails);
              }
            });
          }).catch((error) => {
            if (details.onerror) {
              details.onerror(error);
            }
          });
          return {
            abort: () => controller.abort()
          };
        }
      };
      const CSRFUtils = {
        /**
         * 安全获取B站CSRF Token
         * 在用户脚本环境中，这是最可靠的方式，因为B站API需要此token进行验证
         * @returns {string|null} CSRF Token或null
         */
        getCSRFToken: function() {
          try {
            const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
            const csrf = csrfMatch ? csrfMatch[1] : null;
            if (!csrf) {
              console.warn("[BFC] 未找到CSRF token，请确保已登录B站");
              return null;
            }
            return csrf;
          } catch (error) {
            console.error("[BFC] 获取CSRF token时出错:", error);
            return null;
          }
        },
        /**
         * 验证CSRF Token是否有效
         * @param {string} token - 要验证的token
         * @returns {boolean} 是否有效
         */
        validateCSRFToken: function(token) {
          return token && typeof token === "string" && token.length === 32;
        }
      };
      function retry(fn, { maxRetries = 3, initialDelay = 1e3, onRetry = () => {
      } } = {}) {
        return new Promise((resolve, reject) => {
          let attempt = 0;
          const tryRequest = () => {
            fn().then(resolve).catch((err) => {
              attempt++;
              if (attempt <= maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt - 1);
                onRetry(attempt, delay);
                setTimeout(tryRequest, delay);
              } else {
                reject(new Error(`Failed after ${maxRetries} retries: ${err.message}`));
              }
            });
          };
          tryRequest();
        });
      }
      async function handleResponse(response) {
        var _a;
        if (!response.ok) {
          try {
            const errorData = await response.json();
            const errorMessage = ((_a = errorData.error) == null ? void 0 : _a.message) || JSON.stringify(errorData);
            throw new Error(`请求失败 (状态 ${response.status}): ${errorMessage}`);
          } catch (e) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
          }
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        }
        const text = await response.text();
        if (text.includes("login-box")) {
          throw new Error("B站登录已失效，请重新登录");
        }
        throw new Error("响应不是有效的JSON格式，可能触发了B站风控");
      }
      const BilibiliAPI = {
        getAllFavorites: function(mid) {
          var url = "https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=" + mid;
          return retry(
            () => fetch(url, { headers: { "Accept": "application/json" }, credentials: "include" }).then(handleResponse)
          ).then((data) => {
            if (data.code === 0 && data.data) {
              return data.data.list || [];
            } else if (data.code === 0 && (data.data === null || data.data.list === null)) {
              return [];
            } else {
              throw new Error("获取收藏夹列表失败: " + data.message);
            }
          });
        },
        getFavoriteVideos: function(media_id, ps, pageNum) {
          ps = ps || 20;
          pageNum = pageNum || 1;
          var url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${media_id}&pn=${pageNum}&ps=${ps}&order=mtime`;
          return retry(
            () => fetch(url, { headers: { "Accept": "application/json" }, credentials: "include" }).then(handleResponse)
          ).then((data) => {
            if (data.code === 0 && data.data) {
              return {
                videos: data.data.medias || [],
                hasMore: data.data.has_more
              };
            }
            throw new Error(`获取收藏夹视频失败 (Code: ${data.code || "N/A"}): ${data.message}`);
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
                  const videosWithSource = result.videos.map((v) => ({ ...v, sourceMediaId: media_id }));
                  allVideos.push(...videosWithSource);
                  if (onProgress) {
                    onProgress(allVideos.length);
                  }
                }
                hasMore = result.hasMore;
                pageNum++;
              } catch (error) {
                console.error(`获取收藏夹 ${media_id} 的视频失败:`, error);
                hasMore = false;
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
                  const videosWithSource = result.videos.map((v) => ({ ...v, sourceMediaId: media_id }));
                  videos.push(...videosWithSource);
                }
                hasMore = result.hasMore;
                pageNum++;
              } catch (error) {
                console.error(`获取收藏夹 ${media_id} 的视频失败:`, error);
                hasMore = false;
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
            onProgress(allVideos.length, true);
          }
          return allVideos;
        },
        moveVideo: function(resourceId, targetMediaId, fromMediaId, csrf) {
          const token = csrf || CSRFUtils.getCSRFToken();
          if (!token) {
            return Promise.reject(new Error("未找到CSRF token，请确保已登录B站"));
          }
          if (!CSRFUtils.validateCSRFToken(token)) {
            return Promise.reject(new Error("CSRF token格式无效，请重新登录B站"));
          }
          var url = "https://api.bilibili.com/x/v3/fav/resource/deal";
          var params = new URLSearchParams();
          params.append("rid", resourceId);
          params.append("type", 2);
          params.append("add_media_ids", targetMediaId);
          params.append("del_media_ids", fromMediaId);
          params.append("csrf", token);
          return retry(
            () => fetch(url, {
              method: "POST",
              body: params,
              credentials: "include",
              headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
            }).then(handleResponse)
          ).then((data) => {
            if (data.code !== 0) {
              throw new Error("移动视频失败: " + data.message);
            }
            return data;
          });
        },
        addVideoToFavorite: function(resourceId, targetMediaId, csrf) {
          const token = csrf || CSRFUtils.getCSRFToken();
          if (!token) {
            return Promise.reject(new Error("未找到CSRF token，请确保已登录B站"));
          }
          if (!CSRFUtils.validateCSRFToken(token)) {
            return Promise.reject(new Error("CSRF token格式无效，请重新登录B站"));
          }
          var url = "https://api.bilibili.com/x/v3/fav/resource/deal";
          var params = new URLSearchParams();
          params.append("rid", resourceId);
          params.append("type", 2);
          params.append("add_media_ids", targetMediaId);
          params.append("csrf", token);
          return retry(
            () => fetch(url, {
              method: "POST",
              body: params,
              credentials: "include",
              headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
            }).then(handleResponse)
          ).then((data) => {
            if (data.code !== 0) {
              throw new Error("添加视频到收藏夹失败: " + data.message);
            }
            return data;
          });
        },
        getVideoInfo: function(bvid) {
          var url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
          return retry(
            () => fetch(url, { headers: { "Accept": "application/json" }, credentials: "include" }).then(handleResponse)
          ).then((data) => {
            if (data.code === 0 && data.data) {
              return data.data;
            } else {
              throw new Error("获取视频信息失败: " + data.message);
            }
          });
        },
        createFolder: function(name, csrf) {
          const token = csrf || CSRFUtils.getCSRFToken();
          if (!token) {
            return Promise.reject(new Error("未找到CSRF token，请确保已登录B站"));
          }
          if (!CSRFUtils.validateCSRFToken(token)) {
            return Promise.reject(new Error("CSRF token格式无效，请重新登录B站"));
          }
          return retry(() => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "POST",
              url: "https://api.bilibili.com/x/v3/fav/folder/add",
              headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
              data: `title=${encodeURIComponent(name)}&public=0&csrf=${token}`,
              onload: (response) => {
                try {
                  const result = JSON.parse(response.responseText);
                  if (result.code === 0) {
                    resolve(result);
                  } else {
                    reject(new Error(result.message || "未知错误"));
                  }
                } catch (e) {
                  reject(new Error("解析响应失败"));
                }
              },
              onerror: () => reject(new Error("网络请求失败"))
            });
          }));
        },
        getUserInfo: function() {
          var url = "https://api.bilibili.com/x/web-interface/nav";
          return retry(
            () => fetch(url, { headers: { "Accept": "application/json" }, credentials: "include" }).then(handleResponse)
          ).then((data) => {
            if (data.code === 0 && data.data && data.data.isLogin) {
              return data.data;
            } else if (data.data && !data.data.isLogin) {
              throw new Error("B站未登录");
            } else {
              throw new Error("获取用户信息失败: " + data.message);
            }
          });
        }
      };
      const AIAPI = {
        getModels: function(apiHost, apiKey) {
          const url = new URL("/v1/models", apiHost).toString();
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "GET",
              url,
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              onload: (response) => {
                try {
                  if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    if (data && Array.isArray(data.data)) {
                      resolve(data.data);
                    } else if (Array.isArray(data)) {
                      resolve(data);
                    } else {
                      reject(new Error("获取模型列表失败: 响应数据格式不正确"));
                    }
                  } else {
                    reject(new Error(`请求失败: ${response.status} ${response.statusText}`));
                  }
                } catch (e) {
                  reject(new Error("解析响应失败: " + e.message));
                }
              },
              onerror: () => reject(new Error("网络请求失败"))
            });
          });
        }
      };
      const useSettingsStore = defineStore("settings", {
        state: () => ({
          apiKey: "",
          apiHost: "https://api.openai.com",
          aiProvider: "openai",
          apiModel: "gpt-3.5-turbo",
          customApiModel: "",
          customPrompt: "",
          advancedSettingsVisible: false,
          blurIntensity: 10,
          availableModels: [],
          modelsLoading: false
        }),
        getters: {
          getModelName: (state) => {
            if (state.apiModel === "custom") {
              return state.customApiModel || "";
            }
            return state.apiModel;
          },
          isValid: (state) => {
            const modelName = state.apiModel === "custom" ? state.customApiModel : state.apiModel;
            return state.apiKey && state.apiHost && modelName;
          }
        },
        actions: {
          async loadSettings() {
            console.log("[BFC Debug] 开始加载设置");
            this.apiKey = await GM.getValue("apiKey", "");
            this.apiHost = await GM.getValue("apiHost", "https://api.openai.com");
            this.aiProvider = await GM.getValue("aiProvider", "openai");
            this.apiModel = await GM.getValue("apiModel", "gpt-3.5-turbo");
            this.customApiModel = await GM.getValue("customApiModel", "");
            this.customPrompt = await GM.getValue("customPrompt", "");
            this.blurIntensity = await GM.getValue("blurIntensity", 10);
          },
          async saveSettings() {
            console.log("[BFC Debug] 开始保存设置");
            await GM.setValue("apiKey", this.apiKey);
            await GM.setValue("apiHost", this.apiHost);
            await GM.setValue("aiProvider", this.aiProvider);
            await GM.setValue("apiModel", this.apiModel);
            if (this.apiModel === "custom") {
              await GM.setValue("customApiModel", this.customApiModel);
            } else {
              this.customApiModel = "";
              await GM.setValue("customApiModel", "");
            }
            await GM.setValue("customPrompt", this.customPrompt);
            await GM.setValue("blurIntensity", this.blurIntensity);
            console.log("[BFC Debug] 设置保存完成");
          },
          toggleAdvancedSettings() {
            this.advancedSettingsVisible = !this.advancedSettingsVisible;
          },
          restoreDefaultPrompt() {
            this.customPrompt = `我有一个B站收藏的视频，信息如下：
- 标题: "{videoTitle}"
- 简介: "{videoIntro}"
- UP主: "{videoUpperName}"

请从以下目标收藏夹列表中，选择一个最合适的收藏夹来存放这个视频。
目标收藏夹列表:
{folderList}

请仅返回最合适的收藏夹的名称，不要添加任何多余的解释或标点符号。`;
          },
          async fetchModels() {
            if (!this.apiKey || !this.apiHost) {
              alert("请先设置 API Key 和 API Host");
              return;
            }
            this.modelsLoading = true;
            this.availableModels = [];
            try {
              const models = await AIAPI.getModels(this.apiHost, this.apiKey);
              const modelIds = models.map((model) => model.id).sort();
              this.availableModels.length = 0;
              modelIds.forEach((id) => this.availableModels.push(id));
            } catch (error) {
              console.error("获取AI模型列表失败:", error);
              alert(`获取模型列表失败: ${error.message}`);
            } finally {
              this.modelsLoading = false;
            }
          }
        }
      });
      const useClassificationStore = defineStore("classification", {
        state: () => ({
          allFolders: [],
          selectedSourceFolders: [],
          selectedTargetFolders: [],
          batchSize: 10,
          forceReclassify: false,
          taskRunning: false,
          isPaused: false,
          isStopped: false,
          status: "idle",
          // idle, running, paused, stopped
          summary: {
            success: 0,
            skipped: 0,
            failed: 0,
            failedItems: []
          },
          logs: [],
          resultsVisible: false,
          classificationResults: [],
          chartData: null,
          currentStep: 1,
          pendingVideos: [],
          targetFolders: [],
          // 悬浮推荐相关状态
          floatingRecommendationEnabled: true,
          // 是否启用悬浮推荐功能
          lastVideoUrl: "",
          // 上次处理的视频URL，用于避免重复处理
          recommendationHistory: []
          // 推荐历史记录
        }),
        getters: {
          availableTargetFolders: (state) => {
            if (state.forceReclassify) {
              return state.allFolders;
            }
            return state.allFolders.filter((folder) => !state.selectedSourceFolders.includes(folder.id));
          },
          hasSelectedSourceFolders: (state) => {
            return state.selectedSourceFolders.length > 0;
          },
          hasSelectedTargetFolders: (state) => {
            return state.selectedTargetFolders.length > 0;
          },
          taskSummary: (state) => {
            return state.classificationResults.reduce((acc, result) => {
              if (result.status === "success") acc.success++;
              else if (result.status === "skipped") acc.skipped++;
              else if (result.status === "failed") acc.failed++;
              return acc;
            }, { success: 0, skipped: 0, failed: 0 });
          }
        },
        actions: {
          updateSelectedSourceFolders(selectedIds) {
            this.selectedSourceFolders = selectedIds;
          },
          updateSelectedTargetFolders(selectedIds) {
            this.selectedTargetFolders = selectedIds;
          },
          addLog(message, type = "info") {
            const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
            this.logs.push({ message: `[${timestamp}] ${message}`, type });
          },
          clearLogs() {
            this.logs = [];
          },
          setTaskRunning(running) {
            this.taskRunning = running;
          },
          setPaused(paused) {
            this.isPaused = paused;
          },
          setResultsVisible(visible) {
            this.resultsVisible = visible;
          },
          setClassificationResults(results) {
            this.classificationResults = results;
          },
          setChartData(data) {
            this.chartData = data;
          },
          setCurrentStep(step) {
            this.currentStep = step;
          },
          nextStep() {
            if (this.currentStep < 3) {
              this.currentStep++;
            }
          },
          prevStep() {
            if (this.currentStep > 1) {
              this.currentStep--;
            }
          },
          resetResults() {
            this.resultsVisible = false;
            this.classificationResults = [];
            this.chartData = null;
          },
          savePendingVideos(videos) {
            this.pendingVideos = videos;
            GM.setValue("bfc-pending-videos", JSON.stringify(videos));
          },
          saveTargetFolders(folders) {
            this.targetFolders = folders;
            GM.setValue("bfc-target-folders", JSON.stringify(folders));
          },
          loadPendingVideos() {
            const pendingVideosStr = GM.getValue("bfc-pending-videos", null);
            if (pendingVideosStr) {
              this.pendingVideos = JSON.parse(pendingVideosStr);
              return this.pendingVideos;
            }
            return [];
          },
          loadTargetFolders() {
            const targetFoldersStr = GM.getValue("bfc-target-folders", null);
            if (targetFoldersStr) {
              this.targetFolders = JSON.parse(targetFoldersStr);
              return this.targetFolders;
            }
            return [];
          },
          clearPendingData() {
            this.pendingVideos = [];
            this.targetFolders = [];
            GM.deleteValue("bfc-pending-videos");
            GM.deleteValue("bfc-target-folders");
          },
          hasPendingTask() {
            const pendingVideosStr = GM.getValue("bfc-pending-videos", null);
            return pendingVideosStr && JSON.parse(pendingVideosStr).length > 0;
          },
          shouldProcessVideo(currentUrl) {
            const shouldProcess = this.lastVideoUrl !== currentUrl;
            console.log("[BFC Debug] 检查是否需要处理视频:", {
              currentUrl,
              lastVideoUrl: this.lastVideoUrl,
              shouldProcess
            });
            return shouldProcess;
          },
          setLastVideoUrl(url) {
            console.log("[BFC Debug] 更新最后处理的视频URL:", url);
            this.lastVideoUrl = url;
          }
        }
      });
      const useUIStore = defineStore("ui", {
        state: () => ({
          visible: false,
          activeTab: "settings",
          mid: null,
          isModalOpen: false
        }),
        getters: {
          isVisible: (state) => {
            return state.visible;
          },
          currentTab: (state) => {
            return state.activeTab;
          },
          userMid: (state) => {
            return state.mid;
          },
          hasUserMid: (state) => {
            return state.mid !== null;
          }
        },
        actions: {
          setVisible(visible) {
            this.visible = visible;
          },
          setActiveTab(tab) {
            this.activeTab = tab;
          },
          setMid(mid) {
            this.mid = mid;
          },
          openModal() {
            this.isModalOpen = true;
          },
          closeModal() {
            this.isModalOpen = false;
          },
          showPanel() {
            this.visible = true;
          },
          hidePanel() {
            this.visible = false;
          },
          switchToSettingsTab() {
            this.activeTab = "settings";
          },
          switchToClassifyTab() {
            this.activeTab = "classify";
          },
          switchToBeautifyTab() {
            this.activeTab = "beautify";
          }
        }
      });
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
          return text;
        },
        _generatePrompt: function(video, targetFolders) {
          const userPrompt = GM.getValue("customPrompt", "");
          const template = userPrompt && userPrompt.trim() !== "" ? userPrompt : this._defaultPromptTemplate;
          const folderList = targetFolders.map((f) => `- ${f.title}`).join("\n");
          return template.replace("{videoTitle}", video.title).replace("{videoIntro}", video.intro).replace("{videoUpperName}", video.upper.name).replace("{folderList}", folderList);
        },
        _generateBatchClassifyPrompt: function(videos, targetFolders) {
          const videoList = videos.map((v) => `- 标题: "${v.title}", 简介: "${v.intro}", UP主: "${v.upper.name}"`).join("\n");
          const folderList = targetFolders.map((f) => `- ${f.title}`).join("\n");
          return this._batchClassifyPromptTemplate.replace("{videoList}", videoList).replace("{folderList}", folderList);
        },
        _generateClusteringPrompt: function(videos, formatInfo, minVideosPerCategory) {
          const videoList = videos.map((v) => `- 标题: "${v.title}", 简介: "${v.intro}", UP主: "${v.upper.name}"`).join("\n");
          return this._clusteringPromptTemplate.replace("{videoList}", videoList).replace("{dominantFormat}", formatInfo.dominantFormat).replace("{formatExamples}", formatInfo.patterns.slice(0, 3).map((p) => `- ${p.example}`).join("\n")).replace("{minVideosPerCategory}", minVideosPerCategory);
        },
        _generateMergePrompt: function(categoryNames) {
          const categoryList = categoryNames.map((name) => `- ${name}`).join("\n");
          return this._mergePromptTemplate.replace("{categoryList}", categoryList);
        },
        analyzeVideosForClustering: function(videos, apiKey, apiHost, modelName, formatInfo, minVideosPerCategory) {
          return retry(() => new Promise((resolve, reject) => {
            const prompt = this._generateClusteringPrompt(videos, formatInfo, minVideosPerCategory);
            const aiProvider = GM.getValue("aiProvider", "openai");
            const url = aiProvider === "zhipu" ? "https://open.bigmodel.cn/api/paas/v4/chat/completions" : `${apiHost}/v1/chat/completions`;
            const model = aiProvider === "zhipu" ? "glm-4" : modelName;
            GM.xmlhttpRequest({
              method: "POST",
              url,
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              data: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
                // For OpenAI, you can specify response_format for JSON mode
                ...aiProvider === "openai" && { response_format: { type: "json_object" } }
              }),
              onload: (response) => {
                if (response.status === 200) {
                  try {
                    const result = JSON.parse(response.responseText);
                    const content = result.choices[0].message.content;
                    const jsonContent = this._extractJson(content);
                    if (!jsonContent) {
                      throw new Error("AI响应中未找到有效的JSON内容。");
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
              onerror: (response) => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
          }));
        },
        getMergeSuggestions: function(categoryNames, apiKey, apiHost, modelName) {
          return retry(() => new Promise((resolve, reject) => {
            const prompt = this._generateMergePrompt(categoryNames);
            const aiProvider = GM.getValue("aiProvider", "openai");
            const url = aiProvider === "zhipu" ? "https://open.bigmodel.cn/api/paas/v4/chat/completions" : `${apiHost}/v1/chat/completions`;
            const model = aiProvider === "zhipu" ? "glm-4" : modelName;
            GM.xmlhttpRequest({
              method: "POST",
              url,
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              data: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                ...aiProvider === "openai" && { response_format: { type: "json_object" } }
              }),
              onload: (response) => {
                if (response.status === 200) {
                  try {
                    const result = JSON.parse(response.responseText);
                    const content = result.choices[0].message.content;
                    const jsonContent = this._extractJson(content);
                    if (!jsonContent) {
                      throw new Error("AI响应中未找到有效的JSON内容。");
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
              onerror: (response) => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
          }));
        },
        classify: function(video, targetFolders, apiKey, apiHost, modelName) {
          const aiProvider = GM.getValue("aiProvider", "openai");
          if (aiProvider === "zhipu") {
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
                  temperature: 0.5
                }),
                onload: (response) => {
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
                onerror: (response) => reject(new Error(`网络请求错误: ${response.statusText}`))
              });
            }));
          }
        },
        _callZhipuAI: function(apiKey, { video, targetFolders }) {
          return retry(() => new Promise((resolve, reject) => {
            const prompt = this._generatePrompt(video, targetFolders);
            GM.xmlhttpRequest({
              method: "POST",
              url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              data: JSON.stringify({
                model: "glm-4",
                messages: [{ role: "user", content: prompt }]
              }),
              onload: (response) => {
                if (response.status === 200) {
                  try {
                    const result = JSON.parse(response.responseText);
                    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
                      const folderName = result.choices[0].message.content.trim();
                      resolve(folderName);
                    } else {
                      reject(new Error("API响应格式不正确，缺少有效的回复内容。"));
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
              onerror: (response) => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
          }));
        },
        classifyBatch: function(videos, targetFolders, apiKey, apiHost, modelName) {
          return retry(() => new Promise((resolve, reject) => {
            const prompt = this._generateBatchClassifyPrompt(videos, targetFolders);
            const aiProvider = GM.getValue("aiProvider", "openai");
            const url = aiProvider === "zhipu" ? "https://open.bigmodel.cn/api/paas/v4/chat/completions" : `${apiHost}/v1/chat/completions`;
            const model = aiProvider === "zhipu" ? "glm-4" : modelName;
            GM.xmlhttpRequest({
              method: "POST",
              url,
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              data: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
                ...aiProvider === "openai" && { response_format: { type: "json_object" } }
              }),
              onload: (response) => {
                if (response.status === 200) {
                  try {
                    const result = JSON.parse(response.responseText);
                    const content = result.choices[0].message.content;
                    const jsonContent = this._extractJson(content);
                    if (!jsonContent) {
                      throw new Error("AI响应中未找到有效的JSON内容。");
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
              onerror: (response) => reject(new Error(`网络请求错误: ${response.statusText}`))
            });
          }));
        }
      };
      const useFloatingRecommendationStore = defineStore("floatingRecommendation", {
        state: () => ({
          visible: false,
          loading: false,
          processing: false,
          error: null,
          videoTitle: "",
          videoData: null,
          recommendation: null,
          targetFolders: [],
          selectedFolderId: null,
          // 新增：用户选择的收藏夹ID
          onAcceptCallback: null,
          onRejectCallback: null,
          buttonState: "idle",
          // 'idle' | 'loading' | 'success' | 'error'
          isPanelExpanded: false
        }),
        getters: {
          hasRecommendation: (state) => {
            return state.recommendation && state.recommendation.folderName;
          },
          isValidRecommendation: (state) => {
            return state.recommendation && state.recommendation.folderName && state.recommendation.folderName !== "无合适收藏夹";
          }
        },
        actions: {
          show(data = {}) {
            this.visible = true;
            this.loading = data.loading || false;
            this.error = data.error || null;
            this.videoTitle = data.videoTitle || "";
            this.videoData = data.videoData || null;
            this.recommendation = data.recommendation || null;
            this.selectedFolderId = data.selectedFolderId || null;
            this.onAcceptCallback = data.onAccept || null;
            this.onRejectCallback = data.onReject || null;
          },
          hide() {
            this.visible = false;
            this.loading = false;
            this.error = null;
            if (!this.processing) {
              setTimeout(() => {
                this.videoTitle = "";
                this.videoData = null;
                this.recommendation = null;
                this.targetFolders = [];
                this.selectedFolderId = null;
                this.onAcceptCallback = null;
                this.onRejectCallback = null;
              }, 300);
            } else {
              this.processing = false;
            }
          },
          setLoading(loading) {
            this.loading = loading;
            if (loading) {
              this.error = null;
              this.recommendation = null;
            }
          },
          setError(error) {
            this.error = error;
            this.loading = false;
            this.processing = false;
          },
          setRecommendation(recommendation) {
            this.recommendation = recommendation;
            this.loading = false;
            this.error = null;
          },
          setVideoData(videoData) {
            this.videoData = videoData;
            this.videoTitle = videoData ? videoData.title : "";
          },
          setTargetFolders(folders) {
            this.targetFolders = folders;
          },
          setSelectedFolderId(folderId) {
            this.selectedFolderId = folderId;
          },
          async acceptRecommendation() {
            if (this.processing) {
              return;
            }
            this.processing = true;
            try {
              if (!this.videoData || !this.videoData.id) {
                throw new Error("视频数据不完整，请重新开始视频分析");
              }
              if (this.targetFolders.length === 0) {
                throw new Error("收藏夹列表未加载，请重新开始视频分析");
              }
              let targetFolder = null;
              if (this.selectedFolderId) {
                targetFolder = this.targetFolders.find((f) => f.id === this.selectedFolderId);
              } else if (this.isValidRecommendation) {
                targetFolder = this.targetFolders.find(
                  (f) => f.title === this.recommendation.folderName
                );
                if (!targetFolder) {
                  const normalizedRecommendation = this.recommendation.folderName.trim().toLowerCase();
                  targetFolder = this.targetFolders.find(
                    (f) => f.title.trim().toLowerCase() === normalizedRecommendation
                  );
                }
                if (targetFolder) {
                  this.selectedFolderId = targetFolder.id;
                }
              }
              if (!targetFolder) {
                throw new Error("未选择收藏夹或推荐的收藏夹无效");
              }
              if (!targetFolder || !targetFolder.id) {
                throw new Error("收藏夹数据不完整，请刷新页面重试");
              }
              const csrf = CSRFUtils.getCSRFToken();
              if (!csrf) {
                throw new Error("未找到CSRF token，请确保已登录B站");
              }
              if (!CSRFUtils.validateCSRFToken(csrf)) {
                throw new Error("CSRF token格式无效，请重新登录B站");
              }
              try {
                await BilibiliAPI.addVideoToFavorite(
                  this.videoData.id,
                  targetFolder.id,
                  csrf
                );
              } catch (apiError) {
                throw apiError;
              }
              if (this.onAcceptCallback) {
                this.onAcceptCallback(targetFolder);
              }
              this.setSuccess(`成功收藏到「${targetFolder.title}」！`);
              setTimeout(() => {
                this.hide();
              }, 2e3);
            } catch (error) {
              this.setError(`收藏失败：${error.message}`);
            } finally {
              this.processing = false;
            }
          },
          rejectRecommendation() {
            if (this.onRejectCallback) {
              this.onRejectCallback();
            }
            this.hide();
          },
          setSuccess(message) {
            this.error = null;
            this.recommendation = {
              ...this.recommendation,
              successMessage: message
            };
          },
          // 辅助方法：开始新的视频推荐流程
          async startVideoRecommendation(videoData, targetFolders) {
            this.setVideoData(videoData);
            this.setTargetFolders(targetFolders);
            this.show({
              loading: true,
              videoTitle: videoData.title
            });
            try {
              this.setLoading(true);
            } catch (error) {
              this.setError(`获取推荐失败：${error.message}`);
            }
          },
          // 更新推荐结果
          updateRecommendation(recommendation) {
            this.setRecommendation({
              folderName: recommendation,
              confidence: null
              // 可以扩展置信度支持
            });
          },
          // 新增：设置按钮状态
          setButtonState(state) {
            this.buttonState = state;
          },
          // 新增：设置面板展开状态
          setPanelExpanded(expanded) {
            this.isPanelExpanded = expanded;
          },
          // 新增：触发分类流程
          async triggerClassification() {
            if (this.buttonState === "loading") return;
            this.setButtonState("loading");
            this.setPanelExpanded(true);
            this.show({
              loading: true,
              videoTitle: "AI正在分析视频..."
            });
            try {
              const bvidMatch = window.location.href.match(/video\/(BV[a-zA-Z0-9]+)/);
              if (!bvidMatch) {
                throw new Error("当前页面不是视频页面");
              }
              const bvid = bvidMatch[1];
              const userInfo = await BilibiliAPI.getUserInfo();
              if (!userInfo || !userInfo.mid) {
                throw new Error("无法获取用户信息，请检查登录状态");
              }
              const [videoInfo, allFolders] = await Promise.all([
                BilibiliAPI.getVideoInfo(bvid),
                BilibiliAPI.getAllFavorites(userInfo.mid)
              ]);
              if (!videoInfo || !videoInfo.aid) {
                throw new Error("获取视频信息失败");
              }
              if (!allFolders || !Array.isArray(allFolders)) {
                throw new Error("获取收藏夹列表失败");
              }
              const videoData = {
                id: videoInfo.aid,
                title: videoInfo.title,
                intro: videoInfo.desc,
                upper: { name: videoInfo.owner.name }
              };
              this.setVideoData(videoData);
              this.setTargetFolders(allFolders);
              const apiKey = GM.getValue("apiKey");
              const apiHost = GM.getValue("apiHost");
              const apiModel = GM.getValue("apiModel");
              const customApiModel = GM.getValue("customApiModel");
              const modelName = apiModel === "custom" ? customApiModel : apiModel;
              if (!apiKey) {
                throw new Error("请先在设置中配置API Key");
              }
              const predictedFolderName = await AIClassifier.classify(
                videoData,
                allFolders,
                apiKey,
                apiHost,
                modelName
              );
              this.updateRecommendation(predictedFolderName);
              this.setButtonState("success");
              setTimeout(() => {
                this.setButtonState("idle");
              }, 3e3);
            } catch (error) {
              console.error("分类失败:", error);
              this.setError(`分析失败：${error.message}`);
              this.setButtonState("error");
              setTimeout(() => {
                this.setButtonState("idle");
              }, 3e3);
            }
          }
        }
      });
      class SettingsService {
        constructor() {
          this.settingsStore = null;
        }
        // 获取 settingsStore 实例（延迟初始化）
        getSettingsStore() {
          if (!this.settingsStore) {
            this.settingsStore = useSettingsStore();
          }
          return this.settingsStore;
        }
        // 加载设置
        async loadSettings() {
          await this.getSettingsStore().loadSettings();
        }
        // 保存设置
        async saveSettings() {
          await this.getSettingsStore().saveSettings();
        }
        // 切换高级设置可见性
        toggleAdvancedSettings() {
          this.getSettingsStore().toggleAdvancedSettings();
        }
        // 恢复默认Prompt
        restoreDefaultPrompt() {
          this.getSettingsStore().restoreDefaultPrompt();
        }
        // 更新设置
        updateSettings(newSettings) {
          const store = this.getSettingsStore();
          if (newSettings.apiKey !== void 0) store.apiKey = newSettings.apiKey;
          if (newSettings.apiHost !== void 0) store.apiHost = newSettings.apiHost;
          if (newSettings.aiProvider !== void 0) store.aiProvider = newSettings.aiProvider;
          if (newSettings.apiModel !== void 0) store.apiModel = newSettings.apiModel;
          if (newSettings.customApiModel !== void 0) store.customApiModel = newSettings.customApiModel;
          if (newSettings.customPrompt !== void 0) store.customPrompt = newSettings.customPrompt;
          if (newSettings.advancedSettingsVisible !== void 0) store.advancedSettingsVisible = newSettings.advancedSettingsVisible;
        }
        // 获取当前设置
        getSettings() {
          const store = this.getSettingsStore();
          return {
            apiKey: store.apiKey,
            apiHost: store.apiHost,
            aiProvider: store.aiProvider,
            apiModel: store.apiModel,
            customApiModel: store.customApiModel,
            customPrompt: store.customPrompt,
            advancedSettingsVisible: store.advancedSettingsVisible
          };
        }
        // 检查设置是否有效
        isSettingsValid() {
          return this.getSettingsStore().isValid;
        }
        // 获取设置验证错误信息
        getSettingsValidationError() {
          const store = this.getSettingsStore();
          const missingFields = [];
          if (!store.apiKey) {
            missingFields.push("API Key");
          }
          if (!store.apiHost) {
            missingFields.push("API Host");
          }
          const modelName = store.apiModel === "custom" ? store.customApiModel : store.apiModel;
          if (!modelName) {
            missingFields.push("模型名称");
          }
          if (missingFields.length === 0) {
            return null;
          } else {
            return `请检查设置：${missingFields.join("/")} 不能为空`;
          }
        }
        // 获取模型名称
        getModelName() {
          return this.getSettingsStore().getModelName;
        }
      }
      class ClassificationService {
        constructor() {
          this.classificationStore = null;
          this.settingsStore = null;
          this.uiStore = null;
        }
        // 获取 store 实例（延迟初始化）
        getClassificationStore() {
          if (!this.classificationStore) {
            this.classificationStore = useClassificationStore();
          }
          return this.classificationStore;
        }
        getSettingsStore() {
          if (!this.settingsStore) {
            this.settingsStore = useSettingsStore();
          }
          return this.settingsStore;
        }
        getSettingsService() {
          return settingsService;
        }
        getUIStore() {
          if (!this.uiStore) {
            this.uiStore = useUIStore();
          }
          return this.uiStore;
        }
        // 初始化分类页面
        async initClassificationPage() {
          try {
            const midMatch = document.cookie.match(/DedeUserID=([^;]+)/);
            if (!midMatch) {
              await this.fetchUserInfo();
            } else {
              this.getUIStore().setMid(midMatch[1]);
            }
            await this.loadFavoritesData();
          } catch (error) {
            this.getClassificationStore().addLog(error.message, "error");
          }
        }
        // 获取用户信息
        async fetchUserInfo() {
          try {
            const userInfo = await BilibiliAPI.getUserInfo();
            this.getUIStore().setMid(userInfo.mid);
            await this.loadFavoritesData();
          } catch (error) {
            this.getClassificationStore().addLog("获取用户信息失败，无法加载收藏夹", "error");
            throw error;
          }
        }
        // 加载收藏夹数据
        async loadFavoritesData() {
          const uiStore = this.getUIStore();
          const classificationStore = this.getClassificationStore();
          if (!uiStore.hasUserMid) {
            throw new Error("用户MID不存在");
          }
          classificationStore.addLog(`成功获取到用户MID: ${uiStore.userMid}`, "info");
          classificationStore.addLog("正在获取收藏夹列表...");
          try {
            const folders = await BilibiliAPI.getAllFavorites(uiStore.userMid);
            classificationStore.allFolders = folders;
            classificationStore.addLog("收藏夹列表加载成功", "success");
          } catch (error) {
            classificationStore.addLog(error.message, "error");
            throw error;
          }
        }
        // 开始分类任务
        async startClassification() {
          const classificationStore = this.getClassificationStore();
          const settingsService2 = this.getSettingsService();
          if (!settingsService2.isSettingsValid()) {
            const errorMessage = settingsService2.getSettingsValidationError();
            classificationStore.addLog(errorMessage, "error");
            return;
          }
          if (!classificationStore.hasSelectedSourceFolders || !classificationStore.hasSelectedTargetFolders) {
            classificationStore.addLog("请选择源收藏夹和目标收藏夹", "error");
            return;
          }
          const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
          const csrf = csrfMatch ? csrfMatch[1] : null;
          if (!csrf) {
            classificationStore.addLog("无法获取CSRF Token", "error");
            return;
          }
          classificationStore.setTaskRunning(true);
          classificationStore.setPaused(false);
          classificationStore.clearLogs();
          classificationStore.resetResults();
          classificationStore.addLog("开始分类任务...", "info");
          const modelName = this.getSettingsStore().getModelName;
          const targetFolders = classificationStore.allFolders.filter(
            (f) => classificationStore.selectedTargetFolders.includes(f.id)
          );
          const sourceFolders = classificationStore.allFolders.filter(
            (f) => classificationStore.selectedSourceFolders.includes(f.id)
          );
          if (classificationStore.hasPendingTask()) {
            const pendingVideos = classificationStore.loadPendingVideos();
            const targetFolders2 = classificationStore.loadTargetFolders();
            if (confirm(`检测到有 ${pendingVideos.length} 个视频上次未完成分类，是否继续？`)) {
              await this.handleMoves(pendingVideos, targetFolders2, {
                apiKey: this.getSettingsStore().apiKey,
                apiHost: this.getSettingsStore().apiHost,
                modelName,
                csrf
              });
              return;
            } else {
              classificationStore.clearPendingData();
            }
          }
          const videosToProcess = await this.fetchAllVideos(sourceFolders);
          if (videosToProcess.length === 0) {
            classificationStore.addLog("在选定的源收藏夹中没有找到任何视频。", "info");
            classificationStore.setTaskRunning(false);
            return;
          }
          classificationStore.savePendingVideos(videosToProcess);
          classificationStore.saveTargetFolders(targetFolders);
          await this.handleMoves(videosToProcess, targetFolders, {
            apiKey: this.getSettingsStore().apiKey,
            apiHost: this.getSettingsStore().apiHost,
            modelName,
            csrf
          });
        }
        // 获取所有视频
        async fetchAllVideos(sourceFolders) {
          const classificationStore = this.getClassificationStore();
          const videosToProcess = [];
          for (let i = 0; i < sourceFolders.length; i++) {
            const sourceFolder = sourceFolders[i];
            classificationStore.addLog(`正在从源收藏夹 [${sourceFolder.title}] 获取视频...`);
            let pageNum = 1;
            let hasMore = true;
            while (hasMore) {
              try {
                const result = await BilibiliAPI.getFavoriteVideos(sourceFolder.id, 20, pageNum);
                hasMore = result.hasMore;
                if (result.videos.length > 0) {
                  const videosWithSource = result.videos.map((v) => ({
                    ...v,
                    sourceMediaId: sourceFolder.id
                  }));
                  videosToProcess.push(...videosWithSource);
                }
                pageNum++;
              } catch (error) {
                classificationStore.addLog(`获取视频失败: ${error.message}`, "error");
                hasMore = false;
              }
            }
          }
          return videosToProcess;
        }
        // 处理视频移动
        async handleMoves(videos, targetFolders, config) {
          const classificationStore = this.getClassificationStore();
          classificationStore.setClassificationResults([]);
          const totalVideos = videos.length;
          let processedCount = 0;
          try {
            for (let i = 0; i < totalVideos; i += classificationStore.batchSize) {
              if (classificationStore.isPaused) {
                classificationStore.addLog("任务已暂停。", "info");
                break;
              }
              while (classificationStore.isPaused) {
                await new Promise((resolve) => setTimeout(resolve, 1e3));
              }
              const batch = videos.slice(i, i + classificationStore.batchSize);
              classificationStore.addLog(`正在处理批次: ${i + 1} - ${i + batch.length} / ${totalVideos}`);
              const videosToClassify = batch.filter((video) => {
                if (!classificationStore.forceReclassify && targetFolders.some((tf) => tf.id === video.sourceMediaId)) {
                  classificationStore.addLog(`视频「${video.title}」已在目标收藏夹中，跳过。`, "info");
                  classificationStore.setClassificationResults([
                    ...classificationStore.classificationResults,
                    { video, status: "skipped" }
                  ]);
                  return false;
                }
                return true;
              });
              if (videosToClassify.length === 0) {
                processedCount += batch.length;
                const remainingVideos2 = videos.slice(processedCount);
                classificationStore.savePendingVideos(remainingVideos2);
                continue;
              }
              try {
                classificationStore.addLog(`正在为 ${videosToClassify.length} 个视频请求AI批量分类...`);
                const batchResults = await AIClassifier.classifyBatch(
                  videosToClassify,
                  targetFolders,
                  config.apiKey,
                  config.apiHost,
                  config.modelName
                );
                classificationStore.addLog("AI批量分类响应已收到。");
                for (const video of videosToClassify) {
                  const predictedFolderName = batchResults[video.title];
                  let result = {
                    video,
                    originalTargetFolderId: null,
                    correctedTargetFolderId: null,
                    status: "failed"
                  };
                  if (predictedFolderName) {
                    if (predictedFolderName === "无合适收藏夹") {
                      classificationStore.addLog(`视频「${video.title}」与所有目标收藏夹都不匹配，将保留在原收藏夹中。`, "info");
                      result.status = "skipped";
                    } else {
                      const targetFolder = targetFolders.find((f) => f.title === predictedFolderName);
                      if (targetFolder) {
                        result.originalTargetFolderId = targetFolder.id;
                        result.correctedTargetFolderId = targetFolder.id;
                        classificationStore.addLog(`AI建议将「${video.title}」移动到「${targetFolder.title}」`, "success");
                        result.status = "success";
                      } else {
                        classificationStore.addLog(`处理视频「${video.title}」时出错: 未找到匹配的目标收藏夹: 「${predictedFolderName}」`, "error");
                      }
                    }
                  } else {
                    classificationStore.addLog(`处理视频「${video.title}」时出错: AI未对该视频返回分类结果。`, "error");
                  }
                  classificationStore.setClassificationResults([
                    ...classificationStore.classificationResults,
                    result
                  ]);
                }
              } catch (error) {
                classificationStore.addLog(`处理批次时出错: ${error.message}`, "error");
                for (const video of videosToClassify) {
                  classificationStore.setClassificationResults([
                    ...classificationStore.classificationResults,
                    { video, status: "failed" }
                  ]);
                }
              }
              processedCount += batch.length;
              const remainingVideos = videos.slice(processedCount);
              classificationStore.savePendingVideos(remainingVideos);
            }
          } finally {
            classificationStore.addLog("所有视频分析完毕！请在结果页确认或修正。", "success");
            classificationStore.setTaskRunning(false);
            classificationStore.clearPendingData();
            this.showSummary();
          }
        }
        // 显示分类结果摘要
        showSummary() {
          const classificationStore = this.getClassificationStore();
          const results = classificationStore.classificationResults;
          const folderCounts = results.reduce((acc, result) => {
            if (result.status === "success" && result.correctedTargetFolderId) {
              const folderName = this.getFolderName(result.correctedTargetFolderId);
              if (folderName) {
                acc[folderName] = (acc[folderName] || 0) + 1;
              }
            }
            return acc;
          }, {});
          const labels = Object.keys(folderCounts);
          const data = Object.values(folderCounts);
          const chartData = {
            labels,
            datasets: [
              {
                backgroundColor: ["#fb7299", "#00a1d6", "#ffc107", "#28a745", "#6c757d", "#17a2b8", "#fd7e14", "#6610f2"],
                data
              }
            ]
          };
          classificationStore.setChartData(chartData);
          classificationStore.setResultsVisible(true);
        }
        // 获取收藏夹名称
        getFolderName(folderId) {
          const classificationStore = this.getClassificationStore();
          const folder = classificationStore.allFolders.find((f) => f.id === folderId);
          return folder ? folder.title : "未知";
        }
        // 应用修正
        async applyCorrections() {
          const classificationStore = this.getClassificationStore();
          const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
          const csrf = csrfMatch ? csrfMatch[1] : null;
          if (!csrf) {
            classificationStore.addLog("无法应用修正：缺少CSRF Token。", "error");
            return;
          }
          classificationStore.addLog("开始应用修正...", "info");
          let successCount = 0;
          let failCount = 0;
          for (const result of classificationStore.classificationResults) {
            if (result.status === "success" && result.correctedTargetFolderId !== result.video.sourceMediaId) {
              try {
                await BilibiliAPI.moveVideo(
                  result.video.id,
                  result.correctedTargetFolderId,
                  result.video.sourceMediaId,
                  csrf
                );
                classificationStore.addLog(`成功将「${result.video.title}」移动到「${this.getFolderName(result.correctedTargetFolderId)}」`, "success");
                this.recordAnalyticsData(result.video, result.correctedTargetFolderId);
                successCount++;
                await new Promise((resolve) => setTimeout(resolve, 500));
              } catch (error) {
                classificationStore.addLog(`移动视频「${result.video.title}」失败: ${error.message}`, "error");
                failCount++;
              }
            }
          }
          classificationStore.addLog(`修正应用完毕！成功: ${successCount}, 失败: ${failCount}`, "success");
          classificationStore.resetResults();
        }
        // 记录分析数据
        recordAnalyticsData(video, targetFolderId) {
          const uiStore = this.getUIStore();
          const record = {
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            videoId: video.id,
            videoTitle: video.title,
            targetFolderId,
            targetFolderName: this.getFolderName(targetFolderId)
          };
          uiStore.addAnalyticsRecord(record);
        }
        // 暂停/恢复任务
        togglePause() {
          const classificationStore = this.getClassificationStore();
          const isPaused = !classificationStore.isPaused;
          classificationStore.setPaused(isPaused);
          classificationStore.addLog(isPaused ? "任务已暂停。" : "任务已恢复。", "info");
        }
        // 停止任务
        stopClassification() {
          const classificationStore = this.getClassificationStore();
          classificationStore.addLog("任务正在停止...", "info");
          classificationStore.setTaskRunning(false);
        }
        // 关闭结果视图
        closeResultsView() {
          const classificationStore = this.getClassificationStore();
          classificationStore.resetResults();
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
        // 下一步
        nextStep() {
          const classificationStore = this.getClassificationStore();
          if (classificationStore.currentStep === 1 && !classificationStore.hasSelectedSourceFolders) {
            classificationStore.addLog("请至少选择一个源收藏夹。", "error");
            return;
          }
          classificationStore.nextStep();
        }
        // 上一步
        prevStep() {
          const classificationStore = this.getClassificationStore();
          classificationStore.prevStep();
        }
        // 设置批量大小
        setBatchSize(size) {
          const classificationStore = this.getClassificationStore();
          classificationStore.batchSize = size;
        }
        // 设置强制重新分类
        setForceReclassify(force) {
          const classificationStore = this.getClassificationStore();
          classificationStore.forceReclassify = force;
        }
      }
      class FolderService {
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
          const folder = classificationStore.allFolders.find((f) => f.id === folderId);
          return folder ? folder.title : "未知";
        }
        // 获取所有收藏夹
        getAllFolders() {
          const classificationStore = this.getClassificationStore();
          return classificationStore.allFolders;
        }
        // 获取选中的源收藏夹
        getSelectedSourceFolders() {
          const classificationStore = this.getClassificationStore();
          return classificationStore.selectedSourceFolders.map(
            (id) => classificationStore.allFolders.find((f) => f.id === id)
          ).filter(Boolean);
        }
        // 获取选中的目标收藏夹
        getSelectedTargetFolders() {
          const classificationStore = this.getClassificationStore();
          return classificationStore.selectedTargetFolders.map(
            (id) => classificationStore.allFolders.find((f) => f.id === id)
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
              await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (error) {
              results.push({ name, success: false, error: error.message });
            }
          }
          return results;
        }
        // 移动视频到收藏夹
        async moveVideo(videoId, targetFolderId, sourceFolderId, csrf) {
          try {
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
          return classificationStore.allFolders.some((f) => f.title === folderName);
        }
        // 获取收藏夹ID
        getFolderId(folderName) {
          const classificationStore = this.getClassificationStore();
          const folder = classificationStore.allFolders.find((f) => f.title === folderName);
          return folder ? folder.id : null;
        }
        // 获取收藏夹中的视频数量
        getFolderVideoCount(folderId) {
          const classificationStore = this.getClassificationStore();
          const folder = classificationStore.allFolders.find((f) => f.id === folderId);
          return folder ? folder.media_count : 0;
        }
        // 获取收藏夹的创建时间
        getFolderCreatedTime(folderId) {
          const classificationStore = this.getClassificationStore();
          const folder = classificationStore.allFolders.find((f) => f.id === folderId);
          return folder ? folder.fav_time : null;
        }
        // 获取收藏夹的更新时间
        getFolderUpdatedTime(folderId) {
          const classificationStore = this.getClassificationStore();
          const folder = classificationStore.allFolders.find((f) => f.id === folderId);
          return folder ? folder.update_time : null;
        }
      }
      const settingsService = new SettingsService();
      const classificationService = new ClassificationService();
      const folderService = new FolderService();
      class EventBus {
        constructor() {
          this.events = {};
        }
        // 注册事件监听器
        on(event, callback) {
          if (!this.events[event]) {
            this.events[event] = [];
          }
          this.events[event].push(callback);
        }
        // 移除事件监听器
        off(event, callback) {
          if (!this.events[event]) return;
          if (!callback) {
            this.events[event] = [];
          } else {
            this.events[event] = this.events[event].filter((cb) => cb !== callback);
          }
        }
        // 触发事件
        emit(event, data) {
          if (!this.events[event]) return;
          this.events[event].forEach((callback) => {
            callback(data);
          });
        }
        // 只触发一次的事件
        once(event, callback) {
          const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
          };
          this.on(event, onceCallback);
        }
      }
      const eventBus = new EventBus();
      const SettingsServiceKey = Symbol("settingsService");
      const ClassificationServiceKey = Symbol("classificationService");
      const FolderServiceKey = Symbol("folderService");
      const SettingsStoreKey = Symbol("settingsStore");
      const ClassificationStoreKey = Symbol("classificationStore");
      const UIStoreKey = Symbol("uiStore");
      const EventBusKey = Symbol("eventBus");
      function provideAppServices() {
        provide(SettingsServiceKey, settingsService);
        provide(ClassificationServiceKey, classificationService);
        provide(FolderServiceKey, folderService);
        provide(SettingsStoreKey, useSettingsStore());
        provide(ClassificationStoreKey, useClassificationStore());
        provide(UIStoreKey, useUIStore());
        provide(EventBusKey, eventBus);
      }
      const RECOMMENDED_FOLDERS = [
        "学习 - 方法论与效率",
        "学习 - 学科知识",
        "学习 - 语言",
        "科普 - 前沿科技",
        "科普 - 硬核原理",
        "科普 - 人文社科",
        "科普 - 趣味百科",
        "技能 - 编程开发",
        "技能 - 设计创作",
        "技能 - 办公软件",
        "技能 - 生活实用",
        "游戏 - 实况集锦",
        "游戏 - 攻略教学",
        "游戏 - 文化杂谈",
        "生活 - 美食探店",
        "生活 - 萌宠动物",
        "生活 - 旅行Vlog",
        "娱乐 - 搞笑整活",
        "娱乐 - 影视动漫",
        "娱乐 - 音乐"
      ];
      const BatchCreator = {
        start: function() {
          const btn = document.getElementById("bfc-batch-create-btn");
          if (!btn) return;
          const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
          if (!csrfMatch) {
            alert("获取CSRF Token失败，请确保您已登录B站。");
            return;
          }
          const csrf = csrfMatch[1];
          BilibiliAPI.getUserInfo().then((userInfo) => {
            return BilibiliAPI.getAllFavorites(userInfo.mid);
          }).then((existingFolders) => {
            const existingFolderNames = existingFolders.map((folder) => folder.title);
            const foldersToCreate = RECOMMENDED_FOLDERS.filter(
              (name) => !existingFolderNames.includes(name)
            );
            const existingCount = RECOMMENDED_FOLDERS.length - foldersToCreate.length;
            if (foldersToCreate.length === 0) {
              alert(`所有推荐收藏夹已存在！
已存在: ${existingCount}个
无需创建: ${foldersToCreate.length}个`);
              return;
            }
            if (!confirm(`即将创建 ${foldersToCreate.length} 个推荐收藏夹（已跳过 ${existingCount} 个已存在的收藏夹），确定吗？`)) {
              return;
            }
            btn.disabled = true;
            let successCount = 0;
            let failCount = 0;
            const processNext = (i) => {
              if (i >= foldersToCreate.length) {
                btn.textContent = "一键创建推荐收藏夹";
                btn.disabled = false;
                alert(`创建完成！
成功: ${successCount}个
失败: ${failCount}个
已跳过: ${existingCount}个

页面即将刷新以展示新收藏夹。`);
                location.reload();
                return;
              }
              const name = foldersToCreate[i];
              btn.textContent = `创建中 (${i + 1}/${foldersToCreate.length})...`;
              BilibiliAPI.createFolder(name, csrf).then(() => {
                successCount++;
                setTimeout(() => processNext(i + 1), 500);
              }).catch((error) => {
                failCount++;
                console.error(`创建收藏夹 "${name}" 失败: ${error.message}`);
                setTimeout(() => processNext(i + 1), 500);
              });
            };
            processNext(0);
          }).catch((error) => {
            console.error("获取收藏夹列表失败:", error);
            alert("获取收藏夹列表失败，请确保您已登录B站并重试。");
          });
        }
      };
      const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const _sfc_main$c = {
        name: "MainLayout",
        setup() {
          const uiStore = useUIStore();
          const closeModal = inject("closeModal");
          const visible = computed(() => uiStore.isVisible);
          function closePanel() {
            if (closeModal) {
              closeModal();
            } else {
              console.error("closeModal function not provided");
            }
          }
          return {
            visible,
            closePanel
          };
        }
      };
      const _hoisted_1$b = {
        key: 0,
        id: "bfc-panel"
      };
      const _hoisted_2$9 = { class: "bfc-panel-header" };
      const _hoisted_3$8 = { class: "icons" };
      const _hoisted_4$7 = { class: "bfc-panel-body" };
      function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
        return $setup.visible ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
          createElementVNode("div", _hoisted_2$9, [
            _cache[1] || (_cache[1] = createElementVNode("h2", null, "AI分类助手", -1)),
            createElementVNode("div", _hoisted_3$8, [
              createElementVNode("span", {
                id: "bfc-close-panel",
                title: "关闭页面",
                onClick: _cache[0] || (_cache[0] = (...args) => $setup.closePanel && $setup.closePanel(...args))
              }, "❌")
            ])
          ]),
          createElementVNode("div", _hoisted_4$7, [
            renderSlot(_ctx.$slots, "default")
          ]),
          _cache[2] || (_cache[2] = createElementVNode("div", { class: "bfc-panel-footer" }, " Made with ❤️ by Roo ", -1))
        ])) : createCommentVNode("", true);
      }
      const MainLayout = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$a]]);
      const _sfc_main$b = {
        name: "TabNavigation",
        setup() {
          const uiStore = useUIStore();
          const activeTab = computed(() => uiStore.currentTab);
          function switchToSettingsTab() {
            uiStore.switchToSettingsTab();
          }
          function switchToClassifyTab() {
            uiStore.switchToClassifyTab();
          }
          function switchToBeautifyTab() {
            uiStore.switchToBeautifyTab();
          }
          return {
            activeTab,
            switchToSettingsTab,
            switchToClassifyTab,
            switchToBeautifyTab
          };
        }
      };
      const _hoisted_1$a = { class: "bfc-tabs" };
      function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$a, [
          createElementVNode("button", {
            class: normalizeClass({ active: $setup.activeTab === "settings" }),
            onClick: _cache[0] || (_cache[0] = (...args) => $setup.switchToSettingsTab && $setup.switchToSettingsTab(...args))
          }, " AI 设置 ", 2),
          createElementVNode("button", {
            class: normalizeClass({ active: $setup.activeTab === "classify" }),
            onClick: _cache[1] || (_cache[1] = (...args) => $setup.switchToClassifyTab && $setup.switchToClassifyTab(...args))
          }, " 批量分类 ", 2),
          createElementVNode("button", {
            class: normalizeClass({ active: $setup.activeTab === "beautify" }),
            onClick: _cache[2] || (_cache[2] = (...args) => $setup.switchToBeautifyTab && $setup.switchToBeautifyTab(...args))
          }, " 美化 ", 2)
        ]);
      }
      const TabNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$9]]);
      const _sfc_main$a = {
        name: "LogPanel",
        setup() {
          const classificationStore = useClassificationStore();
          const logContainer = ref(null);
          const logs = computed(() => classificationStore.logs);
          watch(logs, () => {
            nextTick(() => {
              if (logContainer.value) {
                logContainer.value.scrollTop = logContainer.value.scrollHeight;
              }
            });
          }, { deep: true });
          return {
            logs,
            logContainer
          };
        }
      };
      const _hoisted_1$9 = { class: "bfc-log-container" };
      const _hoisted_2$8 = {
        id: "bfc-log",
        ref: "logContainer",
        class: "bfc-log-panel"
      };
      function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$9, [
          createElementVNode("div", _hoisted_2$8, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.logs, (log, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["bfc-log-item", log.type])
              }, toDisplayString(log.message), 3);
            }), 128))
          ], 512)
        ]);
      }
      const LogPanel = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$8], ["__scopeId", "data-v-523941be"]]);
      const _hoisted_1$8 = { id: "bfc-settings-view" };
      const _hoisted_2$7 = { class: "bfc-form-group" };
      const _hoisted_3$7 = ["value"];
      const _hoisted_4$6 = { class: "bfc-form-group" };
      const _hoisted_5$6 = ["value"];
      const _hoisted_6$6 = { class: "bfc-form-group" };
      const _hoisted_7$4 = ["value"];
      const _hoisted_8$4 = { class: "bfc-form-group" };
      const _hoisted_9$4 = ["value"];
      const _hoisted_10$3 = { for: "bfc-custom-model" };
      const _hoisted_11$2 = { key: 0 };
      const _hoisted_12$2 = ["value", "disabled"];
      const _hoisted_13$1 = {
        key: 0,
        class: "bfc-model-dropdown"
      };
      const _hoisted_14$1 = ["onMousedown"];
      const _hoisted_15$1 = {
        class: "bfc-advanced-settings-toggle",
        style: { "margin-top": "15px", "text-align": "center" }
      };
      const _hoisted_16$1 = { class: "bfc-form-group" };
      const _hoisted_17$1 = ["value"];
      const _sfc_main$9 = {
        __name: "SettingsView",
        props: {
          settings: {
            type: Object,
            required: true
          },
          advancedSettingsVisible: {
            type: Boolean,
            required: true
          }
        },
        emits: ["update:settings", "save-settings", "toggle-advanced", "restore-prompt"],
        setup(__props, { emit: __emit }) {
          const props = __props;
          const emit = __emit;
          const settingsStore = useSettingsStore();
          const isDropdownVisible = ref(false);
          const displayedModels = ref([]);
          const handleFocus = () => {
            isDropdownVisible.value = true;
            displayedModels.value = settingsStore.availableModels;
            if (settingsStore.availableModels.length === 0 && !settingsStore.modelsLoading) {
              settingsStore.fetchModels().then(() => {
                displayedModels.value = settingsStore.availableModels;
              });
            }
          };
          const handleBlur = () => {
            setTimeout(() => {
              isDropdownVisible.value = false;
            }, 200);
          };
          const handleInput = (event) => {
            const searchTerm = event.target.value;
            emit("update:settings", { ...props.settings, customApiModel: searchTerm });
            const trimmedSearch = searchTerm.trim().toLowerCase();
            if (!trimmedSearch) {
              displayedModels.value = settingsStore.availableModels;
            } else {
              displayedModels.value = settingsStore.availableModels.filter(
                (model) => model.toLowerCase().includes(trimmedSearch)
              );
            }
            isDropdownVisible.value = true;
          };
          const selectModel = (model) => {
            emit("update:settings", { ...props.settings, customApiModel: model });
            isDropdownVisible.value = false;
          };
          return (_ctx, _cache) => {
            return openBlock(), createElementBlock("div", _hoisted_1$8, [
              _cache[17] || (_cache[17] = createElementVNode("h3", null, "AI 设置", -1)),
              createElementVNode("div", _hoisted_2$7, [
                _cache[8] || (_cache[8] = createElementVNode("label", { for: "bfc-api-key" }, "API Key", -1)),
                createElementVNode("input", {
                  type: "password",
                  id: "bfc-api-key",
                  class: "bfc-input",
                  placeholder: "请输入你的API Key",
                  value: __props.settings.apiKey,
                  onInput: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:settings", { ...__props.settings, apiKey: $event.target.value }))
                }, null, 40, _hoisted_3$7)
              ]),
              createElementVNode("div", _hoisted_4$6, [
                _cache[9] || (_cache[9] = createElementVNode("label", { for: "bfc-api-host" }, "API Host", -1)),
                createElementVNode("input", {
                  type: "text",
                  id: "bfc-api-host",
                  class: "bfc-input",
                  placeholder: "例如: https://api.openai.com",
                  value: __props.settings.apiHost,
                  onInput: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:settings", { ...__props.settings, apiHost: $event.target.value }))
                }, null, 40, _hoisted_5$6)
              ]),
              createElementVNode("div", _hoisted_6$6, [
                _cache[11] || (_cache[11] = createElementVNode("label", { for: "bfc-ai-provider" }, "AI 提供商", -1)),
                createElementVNode("select", {
                  id: "bfc-ai-provider",
                  class: "bfc-select",
                  value: __props.settings.aiProvider,
                  onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:settings", { ...__props.settings, aiProvider: $event.target.value }))
                }, _cache[10] || (_cache[10] = [
                  createElementVNode("option", { value: "openai" }, "OpenAI", -1),
                  createElementVNode("option", { value: "zhipu" }, "智谱AI", -1)
                ]), 40, _hoisted_7$4)
              ]),
              createElementVNode("div", _hoisted_8$4, [
                _cache[13] || (_cache[13] = createElementVNode("label", { for: "bfc-model-select" }, "AI 模型", -1)),
                createElementVNode("select", {
                  id: "bfc-model-select",
                  class: "bfc-select",
                  value: __props.settings.apiModel,
                  onChange: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:settings", { ...__props.settings, apiModel: $event.target.value }))
                }, _cache[12] || (_cache[12] = [
                  createElementVNode("option", { value: "gpt-3.5-turbo" }, "gpt-3.5-turbo", -1),
                  createElementVNode("option", { value: "gpt-4" }, "gpt-4", -1),
                  createElementVNode("option", { value: "gpt-4o" }, "gpt-4o", -1),
                  createElementVNode("option", { value: "custom" }, "自定义", -1)
                ]), 40, _hoisted_9$4)
              ]),
              createElementVNode("div", {
                id: "bfc-custom-model-group",
                class: normalizeClass(["bfc-form-group", { "bfc-hidden": __props.settings.apiModel !== "custom" }]),
                style: { "position": "relative" }
              }, [
                createElementVNode("label", _hoisted_10$3, [
                  _cache[14] || (_cache[14] = createTextVNode("自定义模型名称 ", -1)),
                  unref(settingsStore).modelsLoading ? (openBlock(), createElementBlock("span", _hoisted_11$2, "(加载中...)")) : createCommentVNode("", true)
                ]),
                createElementVNode("input", {
                  type: "text",
                  id: "bfc-custom-model",
                  class: "bfc-input",
                  placeholder: "点击获取或输入模型名称",
                  value: __props.settings.customApiModel,
                  onInput: handleInput,
                  onFocus: handleFocus,
                  onBlur: handleBlur,
                  disabled: unref(settingsStore).modelsLoading,
                  autocomplete: "off"
                }, null, 40, _hoisted_12$2),
                isDropdownVisible.value && displayedModels.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_13$1, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(displayedModels.value, (model) => {
                    return openBlock(), createElementBlock("div", {
                      key: model,
                      class: "bfc-model-dropdown-item",
                      onMousedown: ($event) => selectModel(model)
                    }, toDisplayString(model), 41, _hoisted_14$1);
                  }), 128))
                ])) : createCommentVNode("", true)
              ], 2),
              createElementVNode("div", _hoisted_15$1, [
                createElementVNode("a", {
                  href: "#",
                  id: "bfc-advanced-toggle-link",
                  onClick: _cache[4] || (_cache[4] = withModifiers(($event) => _ctx.$emit("toggle-advanced"), ["prevent"])),
                  style: { "color": "#00a1d6", "text-decoration": "none", "font-size": "14px" }
                }, toDisplayString(__props.advancedSettingsVisible ? "高级设置 ▲" : "高级设置 ▼"), 1)
              ]),
              createElementVNode("div", {
                id: "bfc-advanced-settings",
                class: normalizeClass({ "bfc-hidden": !__props.advancedSettingsVisible }),
                style: { "margin-top": "15px" }
              }, [
                createElementVNode("div", _hoisted_16$1, [
                  _cache[15] || (_cache[15] = createElementVNode("label", { for: "bfc-custom-prompt" }, "自定义Prompt模板", -1)),
                  createElementVNode("textarea", {
                    id: "bfc-custom-prompt",
                    class: "bfc-input",
                    rows: "8",
                    style: { "height": "auto", "resize": "vertical" },
                    placeholder: "使用占位符: {videoTitle}, {videoIntro}, {videoUpperName}, {folderList}",
                    value: __props.settings.customPrompt,
                    onInput: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("update:settings", { ...__props.settings, customPrompt: $event.target.value }))
                  }, null, 40, _hoisted_17$1),
                  _cache[16] || (_cache[16] = createElementVNode("small", { style: { "display": "block", "margin-top": "5px", "color": "#999" } }, "占位符: {videoTitle}, {videoIntro}, {videoUpperName}, {folderList}", -1))
                ]),
                createElementVNode("button", {
                  id: "bfc-restore-prompt-btn",
                  class: "bfc-button",
                  onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("restore-prompt")),
                  style: { "background-color": "#6c757d" }
                }, "恢复默认Prompt")
              ], 2),
              createElementVNode("button", {
                id: "bfc-save-settings-btn",
                class: "bfc-button",
                onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("save-settings")),
                style: { "margin-top": "15px" }
              }, "保存设置")
            ]);
          };
        }
      };
      const SettingsView = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-96ff3b49"]]);
      const _sfc_main$8 = {
        name: "TransferList",
        props: {
          items: {
            type: Array,
            required: true
          },
          leftTitle: {
            type: String,
            default: "可用列表"
          },
          rightTitle: {
            type: String,
            default: "已选列表"
          }
        },
        emits: ["update:selected"],
        setup(props, { emit }) {
          const leftItems = ref([]);
          const rightItems = ref([]);
          const leftFilter = ref("");
          const rightFilter = ref("");
          watch(() => props.items, (newItems) => {
            leftItems.value = [...newItems];
            rightItems.value = [];
          }, { immediate: true });
          const filteredLeftItems = computed(
            () => leftItems.value.filter(
              (item) => item.title.toLowerCase().includes(leftFilter.value.toLowerCase())
            )
          );
          const filteredRightItems = computed(
            () => rightItems.value.filter(
              (item) => item.title.toLowerCase().includes(rightFilter.value.toLowerCase())
            )
          );
          function moveToRight(item) {
            rightItems.value.push(item);
            leftItems.value = leftItems.value.filter((i) => i.id !== item.id);
            emit("update:selected", rightItems.value.map((i) => i.id));
          }
          function moveToLeft(item) {
            leftItems.value.push(item);
            rightItems.value = rightItems.value.filter((i) => i.id !== item.id);
            emit("update:selected", rightItems.value.map((i) => i.id));
          }
          function selectAll() {
            rightItems.value.push(...leftItems.value);
            leftItems.value = [];
            emit("update:selected", rightItems.value.map((item) => item.id));
          }
          function deselectAll() {
            leftItems.value.push(...rightItems.value);
            rightItems.value = [];
            emit("update:selected", rightItems.value.map((item) => item.id));
          }
          return {
            leftFilter,
            rightFilter,
            filteredLeftItems,
            filteredRightItems,
            moveToRight,
            moveToLeft,
            selectAll,
            deselectAll
          };
        }
      };
      const _hoisted_1$7 = { class: "transfer-list" };
      const _hoisted_2$6 = { class: "transfer-list-panel" };
      const _hoisted_3$6 = { class: "transfer-list-header" };
      const _hoisted_4$5 = { class: "transfer-list-items" };
      const _hoisted_5$5 = ["onClick"];
      const _hoisted_6$5 = { class: "transfer-list-panel" };
      const _hoisted_7$3 = { class: "transfer-list-header" };
      const _hoisted_8$3 = { class: "transfer-list-items" };
      const _hoisted_9$3 = ["onClick"];
      function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$7, [
          createElementVNode("div", _hoisted_2$6, [
            createElementVNode("div", _hoisted_3$6, [
              createElementVNode("span", null, toDisplayString($props.leftTitle), 1),
              createElementVNode("button", {
                onClick: _cache[0] || (_cache[0] = (...args) => $setup.selectAll && $setup.selectAll(...args)),
                class: "transfer-list-select-all"
              }, "全选")
            ]),
            withDirectives(createElementVNode("input", {
              type: "text",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.leftFilter = $event),
              class: "transfer-list-filter",
              placeholder: "搜索..."
            }, null, 512), [
              [vModelText, $setup.leftFilter]
            ]),
            createElementVNode("ul", _hoisted_4$5, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.filteredLeftItems, (item) => {
                return openBlock(), createElementBlock("li", {
                  key: item.id,
                  onClick: ($event) => $setup.moveToRight(item)
                }, toDisplayString(item.title) + " (" + toDisplayString(item.media_count) + ") ", 9, _hoisted_5$5);
              }), 128))
            ])
          ]),
          _cache[4] || (_cache[4] = createElementVNode("div", { class: "transfer-list-actions" }, [
            createElementVNode("span", null, "↔️")
          ], -1)),
          createElementVNode("div", _hoisted_6$5, [
            createElementVNode("div", _hoisted_7$3, [
              createElementVNode("span", null, toDisplayString($props.rightTitle), 1),
              createElementVNode("button", {
                onClick: _cache[2] || (_cache[2] = (...args) => $setup.deselectAll && $setup.deselectAll(...args)),
                class: "transfer-list-select-all"
              }, "全不选")
            ]),
            withDirectives(createElementVNode("input", {
              type: "text",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.rightFilter = $event),
              class: "transfer-list-filter",
              placeholder: "搜索..."
            }, null, 512), [
              [vModelText, $setup.rightFilter]
            ]),
            createElementVNode("ul", _hoisted_8$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.filteredRightItems, (item) => {
                return openBlock(), createElementBlock("li", {
                  key: item.id,
                  onClick: ($event) => $setup.moveToLeft(item)
                }, toDisplayString(item.title) + " (" + toDisplayString(item.media_count) + ") ", 9, _hoisted_9$3);
              }), 128))
            ])
          ])
        ]);
      }
      const TransferList = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-ec32a844"]]);
      const _sfc_main$7 = {
        name: "ClassifyView",
        components: {
          TransferList
        },
        props: {
          currentStep: Number,
          allFolders: Array,
          availableTargetFolders: Array,
          forceReclassify: Boolean,
          batchSize: Number,
          taskRunning: Boolean,
          isPaused: Boolean,
          logs: Array
        },
        emits: [
          "update:selectedSourceFolders",
          "update:selectedTargetFolders",
          "update:forceReclassify",
          "update:batchSize",
          "batch-create",
          "start-classification",
          "toggle-pause",
          "stop-classification",
          "prev-step",
          "next-step"
        ],
        setup(props) {
          const logContainer = ref(null);
          watch(() => props.logs, () => {
            nextTick(() => {
              if (logContainer.value) {
                logContainer.value.scrollTop = logContainer.value.scrollHeight;
              }
            });
          }, { deep: true });
          return {
            logContainer
          };
        }
      };
      const _hoisted_1$6 = { id: "bfc-main-view" };
      const _hoisted_2$5 = { class: "bfc-steps-indicator" };
      const _hoisted_3$5 = { class: "bfc-form-group" };
      const _hoisted_4$4 = { class: "bfc-checkbox-item" };
      const _hoisted_5$4 = ["checked"];
      const _hoisted_6$4 = { class: "bfc-form-group" };
      const _hoisted_7$2 = ["value"];
      const _hoisted_8$2 = { class: "bfc-action-buttons" };
      const _hoisted_9$2 = { class: "bfc-step-navigation" };
      const _hoisted_10$2 = {
        id: "bfc-log",
        ref: "logContainer",
        style: { "margin-top": "10px", "height": "200px", "overflow-y": "scroll", "background": "transparent", "border": "1px solid rgba(255, 255, 255, 0.2)", "padding": "10px", "border-radius": "6px" }
      };
      function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_TransferList = resolveComponent("TransferList");
        return openBlock(), createElementBlock("div", _hoisted_1$6, [
          createElementVNode("div", _hoisted_2$5, [
            createElementVNode("div", {
              class: normalizeClass(["bfc-step", { active: $props.currentStep >= 1, completed: $props.currentStep > 1 }])
            }, "1. 选择源", 2),
            _cache[10] || (_cache[10] = createElementVNode("div", { class: "bfc-step-line" }, null, -1)),
            createElementVNode("div", {
              class: normalizeClass(["bfc-step", { active: $props.currentStep >= 2, completed: $props.currentStep > 2 }])
            }, "2. 选择目标", 2),
            _cache[11] || (_cache[11] = createElementVNode("div", { class: "bfc-step-line" }, null, -1)),
            createElementVNode("div", {
              class: normalizeClass(["bfc-step", { active: $props.currentStep === 3 }])
            }, "3. 开始任务", 2)
          ]),
          withDirectives(createElementVNode("div", null, [
            _cache[12] || (_cache[12] = createElementVNode("h3", null, "步骤一：选择源收藏夹", -1)),
            _cache[13] || (_cache[13] = createElementVNode("p", { class: "step-description" }, "请直接点击左侧列表中的收藏夹，将其添加到右侧“已选”列表中。", -1)),
            createVNode(_component_TransferList, {
              items: $props.allFolders,
              "left-title": "所有收藏夹",
              "right-title": "已选源收藏夹",
              "onUpdate:selected": _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:selectedSourceFolders", $event))
            }, null, 8, ["items"]),
            createElementVNode("button", {
              id: "bfc-batch-create-btn",
              class: "bfc-button",
              onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("batch-create")),
              style: { "margin-top": "15px" }
            }, "一键创建推荐收藏夹")
          ], 512), [
            [vShow, $props.currentStep === 1]
          ]),
          withDirectives(createElementVNode("div", null, [
            _cache[15] || (_cache[15] = createElementVNode("h3", null, "步骤二：选择目标收藏夹", -1)),
            _cache[16] || (_cache[16] = createElementVNode("p", { class: "step-description" }, "请选择分类的目标收藏夹。AI将会把视频智能地移动到这些收藏夹中。", -1)),
            createElementVNode("div", _hoisted_3$5, [
              createElementVNode("div", _hoisted_4$4, [
                createElementVNode("input", {
                  type: "checkbox",
                  id: "bfc-force-reclassify",
                  checked: $props.forceReclassify,
                  onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:forceReclassify", $event.target.checked))
                }, null, 40, _hoisted_5$4),
                _cache[14] || (_cache[14] = createElementVNode("label", { for: "bfc-force-reclassify" }, "允许选择源收藏夹作为目标 (用于强制重新分类)", -1))
              ])
            ]),
            createVNode(_component_TransferList, {
              items: $props.availableTargetFolders,
              "left-title": "可用目标收藏夹",
              "right-title": "已选目标收藏夹",
              "onUpdate:selected": _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:selectedTargetFolders", $event))
            }, null, 8, ["items"])
          ], 512), [
            [vShow, $props.currentStep === 2]
          ]),
          withDirectives(createElementVNode("div", null, [
            _cache[18] || (_cache[18] = createElementVNode("h3", null, "步骤三：设置并开始", -1)),
            createElementVNode("div", _hoisted_6$4, [
              _cache[17] || (_cache[17] = createElementVNode("label", { for: "batch-size-input" }, "每批处理视频数", -1)),
              createElementVNode("input", {
                type: "number",
                id: "batch-size-input",
                class: "bfc-input",
                value: $props.batchSize,
                onInput: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("update:batchSize", parseInt($event.target.value, 10)))
              }, null, 40, _hoisted_7$2)
            ]),
            createElementVNode("div", _hoisted_8$2, [
              createElementVNode("button", {
                id: "bfc-start-btn",
                class: normalizeClass(["bfc-button", { "bfc-hidden": $props.taskRunning }]),
                onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("start-classification"))
              }, "开始分类", 2),
              createElementVNode("button", {
                id: "bfc-pause-resume-btn",
                class: normalizeClass(["bfc-button", { "bfc-hidden": !$props.taskRunning }]),
                onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("toggle-pause"))
              }, toDisplayString($props.isPaused ? "恢复" : "暂停"), 3),
              createElementVNode("button", {
                id: "bfc-stop-btn",
                class: normalizeClass(["bfc-button bfc-button-danger", { "bfc-hidden": !$props.taskRunning }]),
                onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("stop-classification"))
              }, "停止", 2)
            ])
          ], 512), [
            [vShow, $props.currentStep === 3]
          ]),
          createElementVNode("div", _hoisted_9$2, [
            $props.currentStep > 1 ? (openBlock(), createElementBlock("button", {
              key: 0,
              onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("prev-step")),
              class: "bfc-button"
            }, "上一步")) : createCommentVNode("", true),
            $props.currentStep < 3 ? (openBlock(), createElementBlock("button", {
              key: 1,
              onClick: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("next-step")),
              class: "bfc-button"
            }, "下一步")) : createCommentVNode("", true)
          ]),
          _cache[19] || (_cache[19] = createElementVNode("div", { id: "bfc-log-controls" }, null, -1)),
          createElementVNode("div", _hoisted_10$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($props.logs, (log, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["bfc-log-item", log.type])
              }, toDisplayString(log.message), 3);
            }), 128))
          ], 512)
        ]);
      }
      const ClassifyView = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6]]);
      const _sfc_main$6 = {
        name: "ResultsView",
        props: {
          classificationResults: {
            type: Array,
            required: true
          },
          chartData: {
            type: Object,
            default: null
          },
          summary: {
            type: Object,
            required: true
          },
          allFolders: {
            type: Array,
            required: true
          }
        },
        emits: ["apply-corrections", "close-results"],
        setup(props) {
          const mutableResults = ref([]);
          watch(() => props.classificationResults, (newVal) => {
            mutableResults.value = JSON.parse(JSON.stringify(newVal));
          }, { immediate: true, deep: true });
          const getFolderName = (folderId) => {
            const folder = props.allFolders.find((f) => f.id === folderId);
            return folder ? folder.title : "未知";
          };
          return {
            mutableResults,
            getFolderName
          };
        }
      };
      const _hoisted_1$5 = { id: "bfc-results-view" };
      const _hoisted_2$4 = { class: "bfc-results-summary" };
      const _hoisted_3$4 = { class: "bfc-results-stats" };
      const _hoisted_4$3 = { class: "success" };
      const _hoisted_5$3 = { class: "info" };
      const _hoisted_6$3 = { class: "error" };
      const _hoisted_7$1 = { class: "bfc-results-table-container" };
      const _hoisted_8$1 = { class: "bfc-results-table" };
      const _hoisted_9$1 = ["href"];
      const _hoisted_10$1 = ["onUpdate:modelValue"];
      const _hoisted_11$1 = ["value"];
      const _hoisted_12$1 = {
        class: "bfc-action-buttons",
        style: { "margin-top": "20px" }
      };
      function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$5, [
          _cache[7] || (_cache[7] = createElementVNode("h3", null, "分类结果", -1)),
          createElementVNode("div", _hoisted_2$4, [
            createElementVNode("div", _hoisted_3$4, [
              createElementVNode("p", null, [
                _cache[2] || (_cache[2] = createElementVNode("strong", null, "总计:", -1)),
                createTextVNode(" " + toDisplayString($props.classificationResults.length) + " 个视频", 1)
              ]),
              createElementVNode("p", _hoisted_4$3, [
                _cache[3] || (_cache[3] = createElementVNode("strong", null, "成功:", -1)),
                createTextVNode(" " + toDisplayString($props.summary.success), 1)
              ]),
              createElementVNode("p", _hoisted_5$3, [
                _cache[4] || (_cache[4] = createElementVNode("strong", null, "跳过:", -1)),
                createTextVNode(" " + toDisplayString($props.summary.skipped), 1)
              ]),
              createElementVNode("p", _hoisted_6$3, [
                _cache[5] || (_cache[5] = createElementVNode("strong", null, "失败:", -1)),
                createTextVNode(" " + toDisplayString($props.summary.failed), 1)
              ])
            ])
          ]),
          createElementVNode("div", _hoisted_7$1, [
            createElementVNode("table", _hoisted_8$1, [
              _cache[6] || (_cache[6] = createElementVNode("thead", null, [
                createElementVNode("tr", null, [
                  createElementVNode("th", null, "视频标题"),
                  createElementVNode("th", null, "原始收藏夹"),
                  createElementVNode("th", null, "AI推荐收藏夹 (可修改)")
                ])
              ], -1)),
              createElementVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($setup.mutableResults, (result, index) => {
                  return openBlock(), createElementBlock("tr", { key: index }, [
                    createElementVNode("td", null, [
                      createElementVNode("a", {
                        href: "https://www.bilibili.com/video/" + result.video.bvid,
                        target: "_blank"
                      }, toDisplayString(result.video.title), 9, _hoisted_9$1)
                    ]),
                    createElementVNode("td", null, toDisplayString($setup.getFolderName(result.video.sourceMediaId)), 1),
                    createElementVNode("td", null, [
                      withDirectives(createElementVNode("select", {
                        "onUpdate:modelValue": ($event) => result.correctedTargetFolderId = $event,
                        class: "bfc-select"
                      }, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList($props.allFolders, (folder) => {
                          return openBlock(), createElementBlock("option", {
                            key: folder.id,
                            value: folder.id
                          }, toDisplayString(folder.title), 9, _hoisted_11$1);
                        }), 128))
                      ], 8, _hoisted_10$1), [
                        [vModelSelect, result.correctedTargetFolderId]
                      ])
                    ])
                  ]);
                }), 128))
              ])
            ])
          ]),
          createElementVNode("div", _hoisted_12$1, [
            createElementVNode("button", {
              id: "bfc-apply-corrections-btn",
              class: "bfc-button",
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("apply-corrections", $setup.mutableResults))
            }, "应用修正"),
            createElementVNode("button", {
              id: "bfc-back-to-main-btn",
              class: "bfc-button",
              onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close-results")),
              style: { "background-color": "#6c757d" }
            }, "返回主界面")
          ])
        ]);
      }
      const ResultsView = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5]]);
      const _hoisted_1$4 = { class: "beautify-view" };
      const _hoisted_2$3 = { class: "bfc-form-group" };
      const _hoisted_3$3 = { for: "blur-intensity" };
      const _sfc_main$5 = {
        __name: "BeautifyView",
        setup(__props) {
          const settingsStore = useSettingsStore();
          const blurIntensity = computed({
            get: () => settingsStore.blurIntensity,
            set: (value) => {
              settingsStore.blurIntensity = value;
            }
          });
          return (_ctx, _cache) => {
            return openBlock(), createElementBlock("div", _hoisted_1$4, [
              _cache[1] || (_cache[1] = createElementVNode("h3", null, "美化设置", -1)),
              createElementVNode("div", _hoisted_2$3, [
                createElementVNode("label", _hoisted_3$3, "毛玻璃模糊度: " + toDisplayString(blurIntensity.value) + "px", 1),
                withDirectives(createElementVNode("input", {
                  id: "blur-intensity",
                  type: "range",
                  min: "0",
                  max: "50",
                  step: "1",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => blurIntensity.value = $event),
                  class: "bfc-slider"
                }, null, 512), [
                  [
                    vModelText,
                    blurIntensity.value,
                    void 0,
                    { number: true }
                  ]
                ])
              ])
            ]);
          };
        }
      };
      const BeautifyView = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-e4a84f96"]]);
      const _sfc_main$4 = {
        name: "App",
        components: {
          MainLayout,
          TabNavigation,
          LogPanel,
          SettingsView,
          ClassifyView,
          ResultsView,
          BeautifyView
        },
        setup() {
          provideAppServices();
          const settingsStore = useSettingsStore();
          const classificationStore = useClassificationStore();
          const uiStore = useUIStore();
          const visible = computed(() => uiStore.isVisible);
          const activeTab = computed(() => uiStore.currentTab);
          const settings = computed(() => settingsStore);
          const advancedSettingsVisible = computed(() => settingsStore.advancedSettingsVisible);
          const blurIntensity = computed(() => settingsStore.blurIntensity);
          const allFolders = computed(() => classificationStore.allFolders);
          const selectedSourceFolders = computed(() => classificationStore.selectedSourceFolders);
          const selectedTargetFolders = computed(() => classificationStore.selectedTargetFolders);
          const batchSize = computed(() => classificationStore.batchSize);
          const forceReclassify = computed(() => classificationStore.forceReclassify);
          const taskRunning = computed(() => classificationStore.taskRunning);
          const isPaused = computed(() => classificationStore.isPaused);
          const logs = computed(() => classificationStore.logs);
          const resultsVisible = computed(() => classificationStore.resultsVisible);
          const classificationResults = computed(() => classificationStore.classificationResults);
          const chartData = computed(() => classificationStore.chartData);
          const currentStep = computed(() => classificationStore.currentStep);
          const taskSummary = computed(() => classificationStore.taskSummary);
          const availableTargetFolders = computed(() => classificationStore.availableTargetFolders);
          onMounted(async () => {
            uiStore.setVisible(true);
            await settingsService.loadSettings();
            await initSettingsPage();
            checkForUnfinishedTask();
            updateBlurEffect(blurIntensity.value);
          });
          watch(blurIntensity, (newValue) => {
            updateBlurEffect(newValue);
          });
          function updateBlurEffect(value) {
            document.documentElement.style.setProperty("--blur-intensity", `${value}px`);
          }
          async function initSettingsPage() {
            try {
              await classificationService.initClassificationPage();
            } catch (error) {
              classificationStore.addLog(error.message, "error");
            }
          }
          function checkForUnfinishedTask() {
            if (classificationStore.hasPendingTask()) {
              const pendingCount = classificationStore.loadPendingVideos().length;
              if (pendingCount > 0 && confirm(`检测到有 ${pendingCount} 个视频上次未完成分类，是否继续？`)) {
                startClassification();
              } else {
                classificationStore.clearPendingData();
              }
            }
          }
          async function updateSettings(newSettings) {
            settingsService.updateSettings(newSettings);
          }
          async function saveSettings() {
            await settingsService.saveSettings();
            classificationStore.addLog("设置已保存", "success");
          }
          function toggleAdvancedSettings() {
            settingsService.toggleAdvancedSettings();
          }
          function restoreDefaultPrompt() {
            settingsService.restoreDefaultPrompt();
            classificationStore.addLog("已恢复默认Prompt模板。", "info");
          }
          function startClassification() {
            classificationService.startClassification();
          }
          function togglePause() {
            classificationService.togglePause();
          }
          function stopClassification() {
            classificationService.stopClassification();
          }
          function updateSelectedSourceFolders(selectedIds) {
            classificationService.updateSelectedSourceFolders(selectedIds);
          }
          function updateSelectedTargetFolders(selectedIds) {
            classificationService.updateSelectedTargetFolders(selectedIds);
          }
          function setBatchSize(size) {
            classificationService.setBatchSize(size);
          }
          function setForceReclassify(force) {
            classificationService.setForceReclassify(force);
          }
          function prevStep() {
            classificationService.prevStep();
          }
          function nextStep() {
            classificationService.nextStep();
          }
          function applyCorrections() {
            classificationService.applyCorrections();
          }
          function closeResultsView() {
            classificationService.closeResultsView();
          }
          function batchCreate() {
            BatchCreator.start();
          }
          return {
            visible,
            activeTab,
            settings,
            advancedSettingsVisible,
            allFolders,
            selectedSourceFolders,
            selectedTargetFolders,
            batchSize,
            forceReclassify,
            taskRunning,
            isPaused,
            logs,
            resultsVisible,
            classificationResults,
            chartData,
            currentStep,
            taskSummary,
            availableTargetFolders,
            updateSettings,
            saveSettings,
            toggleAdvancedSettings,
            restoreDefaultPrompt,
            startClassification,
            togglePause,
            stopClassification,
            updateSelectedSourceFolders,
            updateSelectedTargetFolders,
            setBatchSize,
            setForceReclassify,
            prevStep,
            nextStep,
            applyCorrections,
            closeResultsView,
            batchCreate
          };
        }
      };
      function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_TabNavigation = resolveComponent("TabNavigation");
        const _component_SettingsView = resolveComponent("SettingsView");
        const _component_LogPanel = resolveComponent("LogPanel");
        const _component_ClassifyView = resolveComponent("ClassifyView");
        const _component_ResultsView = resolveComponent("ResultsView");
        const _component_BeautifyView = resolveComponent("BeautifyView");
        const _component_MainLayout = resolveComponent("MainLayout");
        return openBlock(), createBlock(_component_MainLayout, null, {
          default: withCtx(() => [
            createVNode(_component_TabNavigation),
            withDirectives(createVNode(_component_SettingsView, {
              settings: $setup.settings,
              "advanced-settings-visible": $setup.advancedSettingsVisible,
              "onUpdate:settings": $setup.updateSettings,
              onSaveSettings: $setup.saveSettings,
              onToggleAdvanced: $setup.toggleAdvancedSettings,
              onRestorePrompt: $setup.restoreDefaultPrompt
            }, null, 8, ["settings", "advanced-settings-visible", "onUpdate:settings", "onSaveSettings", "onToggleAdvanced", "onRestorePrompt"]), [
              [vShow, $setup.activeTab === "settings"]
            ]),
            withDirectives(createVNode(_component_ClassifyView, {
              "current-step": $setup.currentStep,
              "all-folders": $setup.allFolders,
              "available-target-folders": $setup.availableTargetFolders,
              "force-reclassify": $setup.forceReclassify,
              "onUpdate:forceReclassify": $setup.setForceReclassify,
              "batch-size": $setup.batchSize,
              "onUpdate:batchSize": $setup.setBatchSize,
              "task-running": $setup.taskRunning,
              "is-paused": $setup.isPaused,
              logs: $setup.logs,
              "onUpdate:selectedSourceFolders": $setup.updateSelectedSourceFolders,
              "onUpdate:selectedTargetFolders": $setup.updateSelectedTargetFolders,
              onBatchCreate: $setup.batchCreate,
              onStartClassification: $setup.startClassification,
              onTogglePause: $setup.togglePause,
              onStopClassification: $setup.stopClassification,
              onPrevStep: $setup.prevStep,
              onNextStep: $setup.nextStep
            }, {
              default: withCtx(() => [
                createVNode(_component_LogPanel)
              ]),
              _: 1
            }, 8, ["current-step", "all-folders", "available-target-folders", "force-reclassify", "onUpdate:forceReclassify", "batch-size", "onUpdate:batchSize", "task-running", "is-paused", "logs", "onUpdate:selectedSourceFolders", "onUpdate:selectedTargetFolders", "onBatchCreate", "onStartClassification", "onTogglePause", "onStopClassification", "onPrevStep", "onNextStep"]), [
              [vShow, $setup.activeTab === "classify" && !$setup.resultsVisible]
            ]),
            $setup.resultsVisible ? (openBlock(), createBlock(_component_ResultsView, {
              key: 0,
              "classification-results": $setup.classificationResults,
              "chart-data": $setup.chartData,
              summary: $setup.taskSummary,
              "all-folders": $setup.allFolders,
              onApplyCorrections: $setup.applyCorrections,
              onCloseResults: $setup.closeResultsView
            }, null, 8, ["classification-results", "chart-data", "summary", "all-folders", "onApplyCorrections", "onCloseResults"])) : createCommentVNode("", true),
            withDirectives(createVNode(_component_BeautifyView, null, null, 512), [
              [vShow, $setup.activeTab === "beautify"]
            ])
          ]),
          _: 1
        });
      }
      const App = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
      const _sfc_main$3 = {
        name: "VideoPagePopup",
        data() {
          return {
            isVisible: false,
            message: "",
            folders: [],
            selectedFolder: null,
            showFavlist: false,
            showButtons: false,
            step: 1,
            // 1: AI推荐确认阶段, 2: 收藏夹选择和确认阶段
            predictedFolder: null,
            // AI预测的收藏夹
            onConfirmCallback: () => {
            },
            onCancelCallback: () => {
            },
            onAcceptRecommendationCallback: () => {
            },
            onRejectRecommendationCallback: () => {
            }
          };
        },
        methods: {
          show(data) {
            this.message = data.message || "";
            this.folders = data.folders || [];
            this.selectedFolder = data.initialSelectedFolderId || null;
            this.showFavlist = data.showFavlist || false;
            this.showButtons = data.showButtons || false;
            this.step = data.step || 1;
            this.predictedFolder = data.predictedFolder || null;
            this.onConfirmCallback = data.onConfirm || (() => {
            });
            this.onCancelCallback = data.onCancel || (() => {
            });
            this.onAcceptRecommendationCallback = data.onAcceptRecommendation || (() => {
            });
            this.onRejectRecommendationCallback = data.onRejectRecommendation || (() => {
            });
            this.isVisible = true;
          },
          hide() {
            this.isVisible = false;
            this.step = 1;
            this.predictedFolder = null;
          },
          handleConfirm() {
            this.onConfirmCallback(this.selectedFolder);
          },
          handleCancel() {
            this.onCancelCallback();
          },
          handleAcceptRecommendation() {
            if (this.predictedFolder) {
              this.selectedFolder = this.predictedFolder.id;
            }
            this.onAcceptRecommendationCallback(this.selectedFolder);
          },
          handleRejectRecommendation() {
            this.onRejectRecommendationCallback();
          }
        }
      };
      const _hoisted_1$3 = {
        key: 0,
        id: "bfc-popup",
        class: "show"
      };
      const _hoisted_2$2 = ["innerHTML"];
      const _hoisted_3$2 = {
        key: 0,
        id: "bfc-popup-buttons"
      };
      const _hoisted_4$2 = {
        key: 1,
        id: "bfc-popup-favlist-container"
      };
      const _hoisted_5$2 = ["value"];
      const _hoisted_6$2 = {
        key: 2,
        id: "bfc-popup-buttons"
      };
      function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
        return $data.isVisible ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
          createElementVNode("div", {
            id: "bfc-popup-message",
            innerHTML: $data.message
          }, null, 8, _hoisted_2$2),
          $data.showButtons && $data.step === 1 ? (openBlock(), createElementBlock("div", _hoisted_3$2, [
            createElementVNode("button", {
              id: "bfc-popup-reject",
              class: "bfc-popup-button",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.handleRejectRecommendation && $options.handleRejectRecommendation(...args))
            }, "手动选择"),
            createElementVNode("button", {
              id: "bfc-popup-accept",
              class: "bfc-popup-button primary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.handleAcceptRecommendation && $options.handleAcceptRecommendation(...args))
            }, "接受推荐")
          ])) : createCommentVNode("", true),
          $data.showFavlist && $data.step === 2 ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
            _cache[5] || (_cache[5] = createElementVNode("label", { for: "bfc-favlist-select" }, "收藏到:", -1)),
            withDirectives(createElementVNode("select", {
              id: "bfc-favlist-select",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.selectedFolder = $event)
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($data.folders, (folder) => {
                return openBlock(), createElementBlock("option", {
                  key: folder.id,
                  value: folder.id
                }, toDisplayString(folder.title), 9, _hoisted_5$2);
              }), 128))
            ], 512), [
              [vModelSelect, $data.selectedFolder]
            ])
          ])) : createCommentVNode("", true),
          $data.showButtons && $data.step === 2 ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
            createElementVNode("button", {
              id: "bfc-popup-cancel",
              class: "bfc-popup-button",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleCancel && $options.handleCancel(...args))
            }, "取消"),
            createElementVNode("button", {
              id: "bfc-popup-confirm",
              class: "bfc-popup-button primary",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.handleConfirm && $options.handleConfirm(...args))
            }, "确认收藏")
          ])) : createCommentVNode("", true)
        ])) : createCommentVNode("", true);
      }
      const VideoPagePopup = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-4f559ce1"]]);
      const _sfc_main$2 = {
        name: "FloatingRecommendation",
        setup() {
          const store = useFloatingRecommendationStore();
          const animateIn = ref(false);
          const visible = computed(() => store.visible);
          const isPanelExpanded = computed(() => store.isPanelExpanded);
          const loading = computed(() => store.loading);
          const recommendation = computed(() => store.recommendation);
          const error = computed(() => store.error);
          const processing = computed(() => store.processing);
          const videoTitle = computed(() => store.videoTitle);
          const targetFolders = computed(() => store.targetFolders);
          const selectedFolderId = computed({
            // 获取和设置用户选择的收藏夹ID
            get: () => store.selectedFolderId,
            set: (value) => store.setSelectedFolderId(value)
          });
          const isValidRecommendation = computed(() => {
            return store.recommendation && store.recommendation.folderName && store.recommendation.folderName !== "无合适收藏夹";
          });
          watch(visible, (newVal) => {
            if (newVal) {
              setTimeout(() => {
                animateIn.value = true;
              }, 50);
            } else {
              animateIn.value = false;
            }
          });
          const handleAccept = () => {
            store.acceptRecommendation();
          };
          const handleReject = () => {
            store.rejectRecommendation();
          };
          const handleClose = () => {
            store.hide();
          };
          return {
            visible,
            loading,
            recommendation,
            error,
            processing,
            videoTitle,
            targetFolders,
            selectedFolderId,
            isValidRecommendation,
            animateIn,
            isPanelExpanded,
            handleAccept,
            handleReject,
            handleClose
          };
        }
      };
      const _hoisted_1$2 = {
        key: 0,
        class: "loading-container"
      };
      const _hoisted_2$1 = {
        key: 1,
        class: "recommendation-container"
      };
      const _hoisted_3$1 = { class: "recommendation-header" };
      const _hoisted_4$1 = { class: "header-text" };
      const _hoisted_5$1 = { class: "video-title" };
      const _hoisted_6$1 = { class: "recommendation-content" };
      const _hoisted_7 = {
        key: 0,
        class: "no-match"
      };
      const _hoisted_8 = {
        key: 1,
        class: "match-found"
      };
      const _hoisted_9 = { class: "recommended-folder" };
      const _hoisted_10 = { class: "folder-name" };
      const _hoisted_11 = {
        key: 0,
        class: "confidence"
      };
      const _hoisted_12 = { class: "folder-select-container" };
      const _hoisted_13 = ["value"];
      const _hoisted_14 = { class: "recommendation-actions" };
      const _hoisted_15 = ["disabled"];
      const _hoisted_16 = {
        key: 2,
        class: "error-container"
      };
      const _hoisted_17 = { class: "error-message" };
      function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
        return $setup.visible ? (openBlock(), createElementBlock("div", {
          key: 0,
          id: "bfc-floating-recommendation",
          class: normalizeClass(["floating-recommendation", {
            "slide-in": $setup.animateIn && $setup.isPanelExpanded,
            "collapsed": !$setup.isPanelExpanded
          }])
        }, [
          $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_1$2, _cache[5] || (_cache[5] = [
            createElementVNode("div", { class: "loading-spinner" }, null, -1),
            createElementVNode("span", { class: "loading-text" }, "AI正在分析视频...", -1)
          ]))) : $setup.recommendation && !$setup.error ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
            createElementVNode("div", _hoisted_3$1, [
              _cache[7] || (_cache[7] = createElementVNode("div", { class: "ai-icon" }, "🤖", -1)),
              createElementVNode("div", _hoisted_4$1, [
                _cache[6] || (_cache[6] = createElementVNode("h4", null, "AI推荐收藏夹", -1)),
                createElementVNode("p", _hoisted_5$1, toDisplayString($setup.videoTitle), 1)
              ]),
              createElementVNode("button", {
                class: "close-btn",
                onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleClose && $setup.handleClose(...args))
              }, "×")
            ]),
            createElementVNode("div", _hoisted_6$1, [
              $setup.recommendation.folderName === "无合适收藏夹" ? (openBlock(), createElementBlock("div", _hoisted_7, _cache[8] || (_cache[8] = [
                createElementVNode("p", null, "AI认为该视频与现有收藏夹都不匹配", -1),
                createElementVNode("p", { class: "suggestion" }, "建议手动选择或创建新收藏夹", -1)
              ]))) : (openBlock(), createElementBlock("div", _hoisted_8, [
                createElementVNode("div", _hoisted_9, [
                  _cache[9] || (_cache[9] = createElementVNode("div", { class: "folder-icon" }, "📁", -1)),
                  createElementVNode("span", _hoisted_10, toDisplayString($setup.recommendation.folderName), 1),
                  $setup.recommendation.confidence ? (openBlock(), createElementBlock("div", _hoisted_11, " 置信度: " + toDisplayString(Math.round($setup.recommendation.confidence * 100)) + "% ", 1)) : createCommentVNode("", true)
                ])
              ])),
              createElementVNode("div", _hoisted_12, [
                _cache[11] || (_cache[11] = createElementVNode("label", {
                  for: "folder-select",
                  class: "select-label"
                }, "或手动选择收藏夹:", -1)),
                withDirectives(createElementVNode("select", {
                  id: "folder-select",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.selectedFolderId = $event),
                  class: "folder-select"
                }, [
                  _cache[10] || (_cache[10] = createElementVNode("option", {
                    value: null,
                    disabled: ""
                  }, "请选择一个收藏夹", -1)),
                  (openBlock(true), createElementBlock(Fragment, null, renderList($setup.targetFolders, (folder) => {
                    return openBlock(), createElementBlock("option", {
                      key: folder.id,
                      value: folder.id
                    }, toDisplayString(folder.title), 9, _hoisted_13);
                  }), 128))
                ], 512), [
                  [vModelSelect, $setup.selectedFolderId]
                ])
              ])
            ]),
            createElementVNode("div", _hoisted_14, [
              createElementVNode("button", {
                class: "btn btn-primary",
                onClick: _cache[2] || (_cache[2] = (...args) => $setup.handleAccept && $setup.handleAccept(...args)),
                disabled: $setup.processing || !$setup.selectedFolderId && !$setup.isValidRecommendation
              }, toDisplayString($setup.processing ? "收藏中..." : $setup.selectedFolderId ? "收藏到选中收藏夹" : "接受推荐"), 9, _hoisted_15),
              createElementVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[3] || (_cache[3] = (...args) => $setup.handleReject && $setup.handleReject(...args))
              }, toDisplayString($setup.recommendation.folderName === "无合适收藏夹" ? "取消" : "拒绝推荐"), 1)
            ])
          ])) : $setup.error ? (openBlock(), createElementBlock("div", _hoisted_16, [
            _cache[12] || (_cache[12] = createElementVNode("div", { class: "error-icon" }, "⚠️", -1)),
            createElementVNode("div", _hoisted_17, toDisplayString($setup.error), 1),
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[4] || (_cache[4] = (...args) => $setup.handleClose && $setup.handleClose(...args))
            }, "关闭")
          ])) : createCommentVNode("", true)
        ], 2)) : createCommentVNode("", true);
      }
      const FloatingRecommendation = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-e66bf753"]]);
      const _sfc_main$1 = {
        name: "SideButton",
        setup() {
          const store = useFloatingRecommendationStore();
          const isHovered = ref(false);
          const isClicked = ref(false);
          const buttonClasses = computed(() => ({
            "hovered": isHovered.value,
            "clicked": isClicked.value,
            "loading": store.buttonState === "loading",
            "success": store.buttonState === "success",
            "error": store.buttonState === "error"
          }));
          const buttonText = computed(() => {
            switch (store.buttonState) {
              case "loading":
                return "分析中";
              case "success":
                return "推荐完成";
              case "error":
                return "分析失败";
              default:
                return "AI收藏";
            }
          });
          const handleClick = async () => {
            if (store.buttonState === "loading") return;
            isClicked.value = true;
            setTimeout(() => {
              isClicked.value = false;
            }, 200);
            await store.triggerClassification();
          };
          return {
            buttonState: computed(() => store.buttonState),
            buttonClasses,
            buttonText,
            isHovered,
            handleClick
          };
        }
      };
      const _hoisted_1$1 = { class: "ai-icon" };
      const _hoisted_2 = {
        key: 0,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      };
      const _hoisted_3 = {
        key: 1,
        class: "loading-spinner"
      };
      const _hoisted_4 = {
        key: 2,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      };
      const _hoisted_5 = {
        key: 3,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      };
      const _hoisted_6 = { class: "button-text" };
      function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["side-button", $setup.buttonClasses]),
          onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleClick && $setup.handleClick(...args)),
          onMouseenter: _cache[1] || (_cache[1] = ($event) => $setup.isHovered = true),
          onMouseleave: _cache[2] || (_cache[2] = ($event) => $setup.isHovered = false)
        }, [
          createElementVNode("div", _hoisted_1$1, [
            $setup.buttonState === "idle" ? (openBlock(), createElementBlock("svg", _hoisted_2, _cache[3] || (_cache[3] = [
              createElementVNode("path", {
                d: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z",
                fill: "#fb7299"
              }, null, -1),
              createElementVNode("circle", {
                cx: "12",
                cy: "12",
                r: "3",
                fill: "#fb7299"
              }, null, -1)
            ]))) : $setup.buttonState === "loading" ? (openBlock(), createElementBlock("div", _hoisted_3)) : $setup.buttonState === "success" ? (openBlock(), createElementBlock("svg", _hoisted_4, _cache[4] || (_cache[4] = [
              createElementVNode("path", {
                d: "M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z",
                fill: "#4caf50"
              }, null, -1)
            ]))) : $setup.buttonState === "error" ? (openBlock(), createElementBlock("svg", _hoisted_5, _cache[5] || (_cache[5] = [
              createElementVNode("path", {
                d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z",
                fill: "#f44336"
              }, null, -1)
            ]))) : createCommentVNode("", true)
          ]),
          createElementVNode("span", _hoisted_6, toDisplayString($setup.buttonText), 1)
        ], 34);
      }
      const SideButton = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-73e8ef95"]]);
      const _sfc_main = {
        name: "ModalContainer",
        emits: ["close"],
        setup(props, { emit }) {
          const close = () => {
            emit("close");
          };
          provide("closeModal", close);
          return {
            close
          };
        }
      };
      const _hoisted_1 = { class: "modal-content" };
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", {
          class: "modal-overlay",
          onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $setup.close && $setup.close(...args), ["self"]))
        }, [
          createElementVNode("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ]);
      }
      const ModalContainer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b427cc1c"]]);
      const UIManager = {
        popupVM: null,
        appInstance: null,
        // 保存 Vue 应用实例
        floatingRecommendationVM: null,
        // 悬浮推荐组件实例
        sideButtonVM: null,
        // 侧边按钮组件实例
        modalInstance: null,
        // 模态窗口实例
        modalAppInstance: null,
        // 保存模态框的 Vue 应用实例
        init: function(isSettingsPage = false) {
          if (!isSettingsPage) {
            this.injectFAB();
          }
        },
        openAppInModal: function() {
          if (this.modalInstance) {
            return;
          }
          const modalContainer = document.createElement("div");
          modalContainer.id = "bfc-modal-container";
          document.body.appendChild(modalContainer);
          const pinia2 = window.__bfc_pinia || createPinia();
          const uiStore = useUIStore(pinia2);
          const uiManagerInstance = this;
          const modalApp = createApp$1({
            render() {
              const { h } = Vue;
              return h(ModalContainer, {
                onClose: () => uiManagerInstance.closeAppModal()
              }, {
                default: () => h(App)
              });
            }
          });
          modalApp.use(pinia2);
          this.modalAppInstance = modalApp;
          this.modalInstance = modalApp.mount(modalContainer);
          uiStore.openModal();
        },
        closeAppModal: function() {
          if (this.modalAppInstance) {
            this.modalAppInstance.unmount();
            this.modalAppInstance = null;
            this.modalInstance = null;
            const modalContainer = document.getElementById("bfc-modal-container");
            if (modalContainer) {
              document.body.removeChild(modalContainer);
            }
            const pinia2 = window.__bfc_pinia;
            if (pinia2) {
              const uiStore = useUIStore(pinia2);
              uiStore.closeModal();
            }
          }
        },
        injectFAB: function() {
          const fab = document.createElement("div");
          fab.id = "bfc-fab";
          fab.innerHTML = "<span>AI</span>";
          fab.addEventListener("click", () => {
            this.openAppInModal();
          });
          document.body.appendChild(fab);
        },
        initPopupUI: function() {
          let popupContainer = document.getElementById("bfc-popup-container");
          if (this.popupVM) {
            if (this.popupVM.$ && this.popupVM.$.appContext && this.popupVM.$.appContext.app) {
              this.popupVM.$.appContext.app.unmount();
            }
            this.popupVM = null;
          }
          if (popupContainer) {
            popupContainer.remove();
          }
          popupContainer = document.createElement("div");
          popupContainer.id = "bfc-popup-container";
          document.body.appendChild(popupContainer);
          const app2 = createApp$1(VideoPagePopup, {});
          const pinia2 = window.__bfc_pinia || createPinia();
          app2.use(pinia2);
          this.popupVM = app2.mount(popupContainer);
        },
        initFloatingRecommendationUI: function() {
          let floatingContainer = document.getElementById("bfc-floating-recommendation-container");
          if (this.floatingRecommendationVM) {
            this.floatingRecommendationVM.unmount();
            this.floatingRecommendationVM = null;
          }
          if (floatingContainer) {
            floatingContainer.remove();
          }
          floatingContainer = document.createElement("div");
          floatingContainer.id = "bfc-floating-recommendation-container";
          document.body.appendChild(floatingContainer);
          const app2 = createApp$1(FloatingRecommendation);
          const pinia2 = window.__bfc_pinia || createPinia();
          app2.use(pinia2);
          this.floatingRecommendationVM = app2.mount(floatingContainer);
        },
        initSideButtonUI: function() {
          let sideButtonContainer = document.getElementById("bfc-side-button-container");
          if (this.sideButtonVM) {
            this.sideButtonVM.unmount();
            this.sideButtonVM = null;
          }
          if (sideButtonContainer) {
            sideButtonContainer.remove();
          }
          sideButtonContainer = document.createElement("div");
          sideButtonContainer.id = "bfc-side-button-container";
          document.body.appendChild(sideButtonContainer);
          const app2 = createApp$1(SideButton);
          const pinia2 = window.__bfc_pinia || createPinia();
          app2.use(pinia2);
          this.sideButtonVM = app2.mount(sideButtonContainer);
        },
        showPopup: function(data) {
          if (!this.popupVM) return;
          this.popupVM.show(data);
        },
        hidePopup: function() {
          if (this.popupVM) {
            this.popupVM.hide();
          }
        }
      };
      const getStores = () => {
        return __vitePreload(() => Promise.resolve().then(() => indexC7O3m6C4), void 0 ).then((stores) => ({
          useClassificationStore: stores.useClassificationStore,
          useFloatingRecommendationStore: stores.useFloatingRecommendationStore,
          useSettingsStore: stores.useSettingsStore
        }));
      };
      const AppCoordinator = {
        isProcessing: false,
        init() {
          if (window.location.href.includes("space.bilibili.com")) {
            this.initSpacePage();
          } else if (window.location.href.includes("www.bilibili.com/video/")) {
            this.initVideoPageListeners();
          }
        },
        initSpacePage() {
          UIManager.init();
        },
        async initVideoPageListeners() {
          UIManager.initFloatingRecommendationUI();
          UIManager.initSideButtonUI();
          this.initRealtimeVideoDetection();
        },
        async initRealtimeVideoDetection() {
          console.log("[BFC Debug] 初始化实时视频检测");
          const apiKey = GM.getValue("apiKey");
          if (!apiKey) {
            console.log("[BFC Debug] 未设置API Key，跳过实时视频检测");
            return;
          }
          console.log("[BFC Debug] API Key已设置，开始实时视频检测");
          this.detectAndProcessVideo();
          let lastUrl = window.location.href;
          const checkUrlChange = () => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
              console.log("[BFC Debug] 检测到URL变化:", currentUrl);
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
          setInterval(checkUrlChange, 2e3);
          console.log("[BFC Debug] 实时视频检测已启动");
        },
        async detectAndProcessVideo() {
          console.log("[BFC Debug] 开始检测和处理视频");
          if (this.isProcessing) {
            console.log("[BFC Debug] 正在处理中，跳过检测");
            return;
          }
          const bvidMatch = window.location.href.match(/video\/(BV[a-zA-Z0-9]+)/);
          if (!bvidMatch) {
            console.log("[BFC Debug] 当前不是视频页面，跳过处理");
            return;
          }
          const bvid = bvidMatch[1];
          const currentUrl = window.location.href;
          console.log("[BFC Debug] 检测到视频页面，BV号:", bvid);
          const stores = await getStores();
          const classificationStore = stores.useClassificationStore();
          if (!classificationStore.shouldProcessVideo(currentUrl)) {
            console.log("[BFC Debug] 视频已处理过，跳过重复处理");
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
              throw new Error("无法获取用户信息，请检查登录状态");
            }
            floatingStore.show({
              loading: true,
              videoTitle: "正在获取视频信息..."
            });
            const [videoInfo, allFolders] = await Promise.all([
              BilibiliAPI.getVideoInfo(bvid),
              BilibiliAPI.getAllFavorites(userInfo.mid)
            ]);
            if (!videoInfo || !videoInfo.aid) {
              throw new Error("获取视频信息失败");
            }
            if (!allFolders || !Array.isArray(allFolders)) {
              throw new Error("获取收藏夹列表失败");
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
            const apiKey = GM.getValue("apiKey");
            const apiHost = GM.getValue("apiHost");
            const apiModel = GM.getValue("apiModel");
            const customApiModel = GM.getValue("customApiModel");
            const modelName = apiModel === "custom" ? customApiModel : apiModel;
            if (!apiKey) {
              throw new Error("请先在设置中配置API Key");
            }
            const predictedFolderName = await AIClassifier.classify(
              videoData,
              allFolders,
              apiKey,
              apiHost,
              modelName
            );
            floatingStore.updateRecommendation(predictedFolderName);
            floatingStore.onAcceptCallback = (targetFolder) => {
              console.log("用户接受推荐:", targetFolder.title);
            };
            floatingStore.onRejectCallback = () => {
              console.log("用户拒绝推荐");
            };
          } catch (error) {
            console.error("处理视频推荐失败:", error);
            floatingStore.setError(`获取推荐失败：${error.message}`);
          } finally {
            this.isProcessing = false;
            console.log("[BFC Debug] 视频处理完成，重置处理状态");
          }
        }
      };
      const pinia = createPinia();
      const tempDiv = document.createElement("div");
      tempDiv.style.display = "none";
      document.body.appendChild(tempDiv);
      const { createApp } = Vue;
      const app = createApp({});
      app.use(pinia);
      app.mount(tempDiv);
      window.__bfc_pinia = pinia;
      (async () => {
        AppCoordinator.init();
      })();

      const indexC7O3m6C4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        useClassificationStore,
        useFloatingRecommendationStore,
        useSettingsStore,
        useUIStore
      }, Symbol.toStringTag, { value: 'Module' }));

    })
  };
}));

System.import("./__entry.js", "./");