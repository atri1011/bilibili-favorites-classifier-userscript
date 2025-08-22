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
// @grant        window.close
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(' #bfc-fab{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background-color:#fb7299;border-radius:50%;box-shadow:0 4px 12px #0003;display:flex;justify-content:center;align-items:center;cursor:pointer;z-index:10000;transition:all .3s cubic-bezier(.25,.8,.25,1);opacity:.8}#bfc-fab:hover{opacity:1;transform:scale(1.1)}#bfc-fab span{font-size:24px;color:#fff;transition:transform .3s ease}body.bfc-settings-mode{overflow:hidden}body.bfc-settings-mode .bili-header,body.bfc-settings-mode #app,body.bfc-settings-mode .bili-footer{display:none!important}#bfc-settings-view{padding:20px;border-top:1px solid #e3e5e7;background-color:#fff}#bfc-panel{display:none;flex-direction:column;background-color:#f4f5f7}body.bfc-settings-mode #bfc-panel{display:flex;position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;overflow-y:auto}.bfc-panel-header{padding:15px 20px;border-bottom:1px solid #e3e5e7;display:flex;justify-content:space-between;align-items:center}.bfc-panel-header h2{margin:0;font-size:16px;font-weight:600;color:#1a1a1a}.bfc-panel-header .icons span{font-size:20px;cursor:pointer;margin-left:15px;color:#666}.bfc-panel-body{flex-grow:1;padding:20px;overflow-y:auto}.bfc-tabs{display:flex;border-bottom:1px solid #e3e5e7;background-color:#fff}.bfc-tabs button{padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;color:#666;border-bottom:2px solid transparent}.bfc-tabs button.active{color:#fb7299;border-bottom-color:#fb7299}.bfc-panel-footer{padding:15px 20px;border-top:1px solid #e3e5e7;background-color:#fff;font-size:12px;color:#999}.bfc-form-group{margin-bottom:20px}.bfc-form-group label{display:block;margin-bottom:8px;font-size:14px;font-weight:500;color:#333}.bfc-select,.bfc-input,.bfc-button{width:100%;padding:10px;border-radius:6px;border:1px solid #ccc;font-size:14px;box-sizing:border-box}.bfc-checkbox-group{background-color:#fff;border:1px solid #ccc;border-radius:6px;padding:10px;height:120px;overflow-y:auto}.bfc-checkbox-item{display:flex;align-items:center;margin-bottom:8px}.bfc-checkbox-item input[type=checkbox]{margin-right:8px}.bfc-checkbox-item label{font-weight:400;font-size:14px;cursor:pointer;flex-grow:1}.bfc-button{background-color:#fb7299;color:#fff;border:none;cursor:pointer;transition:background-color .3s}.bfc-button:hover{background-color:#e56a8a}.bfc-action-buttons{display:flex;gap:10px;margin-bottom:10px}.bfc-button-danger{background-color:#dc3545}.bfc-button-danger:hover{background-color:#c82333}.bfc-log-item{padding:8px;border-bottom:1px solid #eee;font-size:13px}.bfc-log-item.success{color:#28a745}.bfc-log-item.error{color:#dc3545}.bfc-log-item.info{color:#17a2b8}#bfc-batch-create-btn{background-color:#00a1d6;color:#fff;border:none;cursor:pointer;margin-top:10px;transition:background-color .3s,opacity .3s}#bfc-batch-create-btn:hover{background-color:#00b5e5}#bfc-batch-create-btn:disabled{opacity:.6;cursor:not-allowed}#bfc-popup{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;background-color:#fff;border-radius:8px;box-shadow:0 4px 12px #00000026;z-index:10001;padding:15px;font-size:14px;color:#333;display:none;flex-direction:column;gap:10px}#bfc-popup.show{display:flex}#bfc-popup-message{font-weight:500}#bfc-popup-buttons{display:flex;justify-content:flex-end;gap:8px}.bfc-popup-button{padding:5px 10px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background-color:#f4f5f7}.bfc-popup-button.primary{background-color:#fb7299;color:#fff;border-color:#fb7299}#bfc-popup-collect-only{background-color:#00a1d6;color:#fff;border-color:#00a1d6}#bfc-results-view{padding:20px;border-top:1px solid #e3e5e7;background-color:#fff}.bfc-results-summary{display:flex;align-items:center;gap:20px;margin-bottom:20px}.bfc-chart-container{width:200px;height:200px}.bfc-results-stats p{margin:5px 0;font-size:16px}.bfc-results-stats .success{color:#28a745}.bfc-results-stats .error{color:#dc3545}.bfc-results-stats .info{color:#17a2b8}.bfc-results-table-container{max-height:400px;overflow-y:auto;border:1px solid #e3e5e7;border-radius:6px}.bfc-results-table{width:100%;border-collapse:collapse}.bfc-results-table th,.bfc-results-table td{padding:12px 15px;text-align:left;border-bottom:1px solid #e3e5e7}.bfc-results-table th{background-color:#f4f5f7;font-weight:600}.bfc-results-table tbody tr:last-child td{border-bottom:none}.bfc-results-table a{color:#00a1d6;text-decoration:none}.bfc-results-table a:hover{text-decoration:underline}#bfc-diagnose-view p{font-size:14px;color:#666;line-height:1.6}.bfc-progress-bar{width:100%;height:10px;background-color:#e3e5e7;border-radius:5px;overflow:hidden;margin:10px 0}.bfc-progress{height:100%;background-color:#00a1d6;transition:width .3s ease}#bfc-diagnose-report{margin-top:20px}.bfc-report-section{margin-bottom:20px}.bfc-report-item{background:#fff;padding:15px;border:1px solid #e3e5e7;border-radius:6px;margin-bottom:10px}.bfc-report-item ul{list-style-type:disc;padding-left:20px;margin-top:5px;font-size:13px;color:#999}#bfc-popup-favlist-container{margin-top:10px;display:flex;align-items:center;justify-content:center}#bfc-popup-favlist-container label{margin-right:8px;font-size:14px}#bfc-favlist-select{padding:5px;border-radius:4px;border:1px solid #ccc;min-width:150px}.bfc-steps-indicator{display:flex;align-items:center;justify-content:center;margin-bottom:25px}.bfc-step{padding:8px 16px;border-radius:20px;background-color:#e3e5e7;color:#999;font-weight:600;transition:all .3s ease}.bfc-step.active{background-color:#fb7299;color:#fff}.bfc-step.completed{background-color:#00a1d6;color:#fff}.bfc-step-line{flex-grow:1;height:2px;background-color:#e3e5e7;margin:0 10px}.step-description{font-size:14px;color:#666;margin-bottom:15px;text-align:center}.bfc-step-navigation{display:flex;justify-content:space-between;margin-top:20px}.bfc-log-container[data-v-5e6e74b4]{margin-top:10px}.bfc-log-panel[data-v-5e6e74b4]{height:200px;overflow-y:scroll;background:#fff;border:1px solid #e3e5e7;padding:10px;border-radius:6px}.bfc-log-item[data-v-5e6e74b4]{margin-bottom:5px;word-break:break-word}.bfc-log-item.info[data-v-5e6e74b4]{color:#333}.bfc-log-item.success[data-v-5e6e74b4]{color:#28a745}.bfc-log-item.error[data-v-5e6e74b4]{color:#dc3545}.bfc-log-item.warning[data-v-5e6e74b4]{color:#ffc107}.transfer-list[data-v-6b0f69a3]{display:flex;justify-content:space-between;align-items:center;width:100%}.transfer-list-panel[data-v-6b0f69a3]{width:45%;border:1px solid #e3e5e7;border-radius:6px;height:300px;display:flex;flex-direction:column}.transfer-list-header[data-v-6b0f69a3]{padding:8px 12px;background-color:#f4f5f7;border-bottom:1px solid #e3e5e7;display:flex;justify-content:space-between;align-items:center;font-weight:600}.transfer-list-select-all[data-v-6b0f69a3]{background:none;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:12px;padding:2px 6px}.transfer-list-filter[data-v-6b0f69a3]{width:calc(100% - 20px);margin:10px;padding:8px;border:1px solid #ccc;border-radius:4px}.transfer-list-items[data-v-6b0f69a3]{list-style:none;margin:0;padding:0 10px 10px;overflow-y:auto;flex-grow:1}.transfer-list-items li[data-v-6b0f69a3]{padding:8px;cursor:pointer;border-radius:4px}.transfer-list-items li[data-v-6b0f69a3]:hover{background-color:#e3f2fd}.transfer-list-items li.selected[data-v-6b0f69a3]{background-color:#bbdefb}.transfer-list-actions[data-v-6b0f69a3]{display:flex;flex-direction:column;gap:10px}.transfer-list-actions button[data-v-6b0f69a3]{padding:8px 12px;border:1px solid #ccc;border-radius:4px;background-color:#f4f5f7;cursor:pointer}.transfer-list-actions button[data-v-6b0f69a3]:disabled{opacity:.5;cursor:not-allowed}#bfc-analytics-view{padding:15px}.bfc-analytics-controls{margin-bottom:15px}.bfc-analytics-controls button{margin-right:10px;padding:5px 10px;border:1px solid #ccc;background-color:#f0f0f0;cursor:pointer}.bfc-analytics-controls button.active{background-color:#00a1d6;color:#fff;border-color:#00a1d6}.bfc-analytics-chart-container{min-height:200px;border:1px solid #eee;padding:10px;text-align:center;color:#999}.bfc-hidden{display:none!important}#bfc-popup[data-v-4f559ce1]{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:1px solid #ccc;padding:20px;z-index:9999;display:none;max-width:400px;width:90%;border-radius:8px;box-shadow:0 4px 12px #00000026}#bfc-popup.show[data-v-4f559ce1]{display:block}#bfc-popup-message[data-v-4f559ce1]{margin-bottom:15px;line-height:1.5}#bfc-popup-favlist-container[data-v-4f559ce1]{margin-bottom:15px}#bfc-popup-favlist-container label[data-v-4f559ce1]{display:block;margin-bottom:5px;font-weight:700}#bfc-favlist-select[data-v-4f559ce1]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px}#bfc-popup-buttons[data-v-4f559ce1]{display:flex;justify-content:flex-end;gap:10px}.bfc-popup-button[data-v-4f559ce1]{padding:8px 16px;border:1px solid #ddd;border-radius:4px;background-color:#f5f5f5;cursor:pointer;font-size:14px;transition:background-color .2s}.bfc-popup-button[data-v-4f559ce1]:hover{background-color:#e0e0e0}.bfc-popup-button.primary[data-v-4f559ce1]{background-color:#fb7299;color:#fff;border-color:#fb7299}.bfc-popup-button.primary[data-v-4f559ce1]:hover{background-color:#e06188}.bfc-hidden[data-v-4f559ce1]{display:none}.floating-recommendation[data-v-e66bf753]{position:fixed;top:120px;right:20px;width:320px;background:#fffffff2;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-radius:16px;box-shadow:0 8px 32px #0000001f;border:1px solid rgba(255,255,255,.2);z-index:10000;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);overflow:hidden}.floating-recommendation.slide-in[data-v-e66bf753]{transform:translate(0)}.floating-recommendation.collapsed[data-v-e66bf753]{transform:translate(100%);width:0;overflow:hidden}.loading-container[data-v-e66bf753]{padding:20px;display:flex;align-items:center;gap:12px}.loading-spinner[data-v-e66bf753]{width:24px;height:24px;border:2px solid rgba(251,114,153,.2);border-top:2px solid #fb7299;border-radius:50%;animation:spin-e66bf753 1s linear infinite}@keyframes spin-e66bf753{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.loading-text[data-v-e66bf753]{color:#666;font-size:14px}.recommendation-container[data-v-e66bf753]{padding:16px}.recommendation-header[data-v-e66bf753]{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}.ai-icon[data-v-e66bf753]{font-size:24px;flex-shrink:0}.header-text[data-v-e66bf753]{flex:1;min-width:0}.header-text h4[data-v-e66bf753]{margin:0 0 4px;font-size:16px;font-weight:600;color:#333}.video-title[data-v-e66bf753]{margin:0;font-size:12px;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.close-btn[data-v-e66bf753]{background:none;border:none;font-size:24px;color:#999;cursor:pointer;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color .2s}.close-btn[data-v-e66bf753]:hover{background-color:#0000000d}.recommendation-content[data-v-e66bf753]{margin-bottom:16px}.no-match p[data-v-e66bf753]{margin:0 0 8px;color:#666;font-size:14px}.suggestion[data-v-e66bf753]{font-size:12px;color:#999}.match-found .recommended-folder[data-v-e66bf753]{display:flex;align-items:center;gap:12px;padding:12px;background:#fb72990d;border:1px solid rgba(251,114,153,.2);border-radius:12px}.folder-icon[data-v-e66bf753]{font-size:20px}.folder-name[data-v-e66bf753]{flex:1;font-weight:500;color:#333;font-size:14px}.confidence[data-v-e66bf753]{font-size:12px;color:#666;background:#fb72991a;padding:2px 8px;border-radius:12px}.recommendation-actions[data-v-e66bf753]{display:flex;gap:8px}.folder-select-container[data-v-e66bf753]{margin-top:16px;display:flex;flex-direction:column;gap:8px}.select-label[data-v-e66bf753]{font-size:13px;color:#666;font-weight:500}.folder-select[data-v-e66bf753]{width:100%;padding:10px 12px;border:1px solid rgba(0,0,0,.1);border-radius:12px;background:#fffc;font-size:14px;color:#333;appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%20197.4L159.7%2069.7c-3.2-3.2-8.3-3.2-11.6%200L5.4%20197.4c-3.2%203.2-3.2%208.3%200%2011.6l11.6%2011.6c3.2%203.2%208.3%203.2%2011.6%200l120.2-120.2c3.2-3.2%208.3-3.2%2011.6%200l120.2%20120.2c3.2%203.2%208.3%203.2%2011.6%200l11.6-11.6c3.2-3.2%203.2-8.4%200-11.6z%22%2F%3E%3C%2Fsvg%3E);background-repeat:no-repeat;background-position:right 12px top 50%;background-size:12px auto;cursor:pointer;outline:none;transition:border-color .2s,box-shadow .2s}.folder-select[data-v-e66bf753]:focus{border-color:#fb7299;box-shadow:0 0 0 2px #fb729933}.btn[data-v-e66bf753]{flex:1;padding:10px 16px;border:none;border-radius:12px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}.btn[data-v-e66bf753]:disabled{opacity:.6;cursor:not-allowed}.btn-primary[data-v-e66bf753]{background:#fb7299;color:#fff;box-shadow:0 2px 8px #fb72994d}.btn-primary[data-v-e66bf753]:hover:not(:disabled){background:#e85a85;transform:translateY(-1px);box-shadow:0 4px 12px #fb729966}.btn-secondary[data-v-e66bf753]{background:#0000000d;color:#666;border:1px solid rgba(0,0,0,.1)}.btn-secondary[data-v-e66bf753]:hover{background:#0000001a;transform:translateY(-1px)}.error-container[data-v-e66bf753]{padding:20px;text-align:center}.error-icon[data-v-e66bf753]{font-size:32px;margin-bottom:12px}.error-message[data-v-e66bf753]{color:#666;font-size:14px;margin-bottom:16px;line-height:1.4}@media (max-width: 768px){.floating-recommendation[data-v-e66bf753]{right:10px;width:300px;top:80px}}@media (max-width: 480px){.floating-recommendation[data-v-e66bf753]{right:10px;left:10px;width:auto;max-width:none}}@media (prefers-color-scheme: dark){.floating-recommendation[data-v-e66bf753]{background:#1e1e1ef2;border:1px solid rgba(255,255,255,.1)}.header-text h4[data-v-e66bf753]{color:#fff}.video-title[data-v-e66bf753],.loading-text[data-v-e66bf753],.no-match p[data-v-e66bf753],.select-label[data-v-e66bf753]{color:#ccc}.suggestion[data-v-e66bf753]{color:#999}.folder-name[data-v-e66bf753]{color:#fff}.confidence[data-v-e66bf753]{color:#ccc}.folder-select[data-v-e66bf753]{background:#ffffff1a;border:1px solid rgba(255,255,255,.1);color:#fff;background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23ccc%22%20d%3D%22M287%20197.4L159.7%2069.7c-3.2-3.2-8.3-3.2-11.6%200L5.4%20197.4c-3.2%203.2-3.2%208.3%200%2011.6l11.6%2011.6c3.2%203.2%208.3%203.2%2011.6%200l120.2-120.2c3.2-3.2%208.3-3.2%2011.6%200l120.2%20120.2c3.2%203.2%208.3%203.2%2011.6%200l11.6-11.6c3.2-3.2%203.2-8.4%200-11.6z%22%2F%3E%3C%2Fsvg%3E)}.folder-select[data-v-e66bf753]:focus{border-color:#fb7299;box-shadow:0 0 0 2px #fb729933}.btn-secondary[data-v-e66bf753]{background:#ffffff0d;color:#ccc;border:1px solid rgba(255,255,255,.1)}.btn-secondary[data-v-e66bf753]:hover{background:#ffffff1a}.error-message[data-v-e66bf753]{color:#ccc}}.side-button[data-v-cb0d2287]{position:fixed;right:20px;top:50%;transform:translateY(-50%);width:48px;height:120px;background:#ffffffd9;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;z-index:10000;transition:all .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 4px 20px #fb729926;border:1px solid rgba(255,255,255,.3);-webkit-user-select:none;user-select:none;overflow:hidden}.side-button[data-v-cb0d2287]:hover{background:#fffffff2;transform:translateY(-50%) scale(1.05);box-shadow:0 8px 24px #fb729940}.side-button.clicked[data-v-cb0d2287]{transform:translateY(-50%) scale(.95);box-shadow:0 2px 8px #fb729933}.side-button[data-v-cb0d2287]:before{content:"";position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:#fb72994d;transform:translate(-50%,-50%);transition:width .6s,height .6s}.side-button.clicked[data-v-cb0d2287]:before{width:100px;height:100px}.ai-icon[data-v-cb0d2287]{display:flex;align-items:center;justify-content:center;width:24px;height:24px}.button-text[data-v-cb0d2287]{font-size:12px;font-weight:500;color:#fb7299;text-align:center;line-height:1.2;max-width:40px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.loading-spinner[data-v-cb0d2287]{width:20px;height:20px;border:2px solid rgba(251,114,153,.2);border-top:2px solid #fb7299;border-radius:50%;animation:spin-cb0d2287 1s cubic-bezier(.68,-.55,.265,1.55) infinite}@keyframes spin-cb0d2287{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.side-button.loading[data-v-cb0d2287]{animation:pulse-cb0d2287 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes pulse-cb0d2287{0%,to{box-shadow:0 4px 20px #fb729926}50%{box-shadow:0 4px 20px #fb729966}}.side-button.loading[data-v-cb0d2287]{background:#fb72991a;border-color:#fb72994d}.side-button.success[data-v-cb0d2287]{background:#4caf501a;border-color:#4caf504d}.side-button.success .button-text[data-v-cb0d2287]{color:#4caf50}.side-button.error[data-v-cb0d2287]{background:#f443361a;border-color:#f443364d}.side-button.error .button-text[data-v-cb0d2287]{color:#f44336}@media (max-width: 1200px){.side-button[data-v-cb0d2287]{right:16px;width:46px;height:115px}}@media (max-width: 768px){.side-button[data-v-cb0d2287]{right:12px;width:44px;height:110px;border-radius:22px}.button-text[data-v-cb0d2287]{font-size:11px;max-width:38px}}@media (max-width: 480px){.side-button[data-v-cb0d2287]{right:8px;width:40px;height:100px;border-radius:20px}.button-text[data-v-cb0d2287]{font-size:10px;max-width:34px}.ai-icon svg[data-v-cb0d2287]{width:20px;height:20px}.loading-spinner[data-v-cb0d2287]{width:16px;height:16px}}@media (max-height: 600px) and (orientation: landscape){.side-button[data-v-cb0d2287]{height:90px;top:45%}.button-text[data-v-cb0d2287]{font-size:10px;max-width:34px}}@media (prefers-color-scheme: dark){.side-button[data-v-cb0d2287]{background:#1e1e1ed9;border:1px solid rgba(255,255,255,.15);box-shadow:0 4px 20px #0000004d}.side-button[data-v-cb0d2287]:hover{background:#282828f2;box-shadow:0 8px 24px #fb72994d}.button-text[data-v-cb0d2287]{color:#ff8fab}.side-button.loading[data-v-cb0d2287]{background:#fb729933;border-color:#fb729980}.side-button.success[data-v-cb0d2287]{background:#4caf5033;border-color:#4caf5080}.side-button.error[data-v-cb0d2287]{background:#f4433633;border-color:#f4433680}.side-button.clicked[data-v-cb0d2287]{box-shadow:0 2px 8px #0006}}html[data-theme=dark] .side-button[data-v-cb0d2287],.bili-dark .side-button[data-v-cb0d2287]{background:#1e1e1ed9;border:1px solid rgba(255,255,255,.15);box-shadow:0 4px 20px #0000004d}html[data-theme=dark] .side-button[data-v-cb0d2287]:hover,.bili-dark .side-button[data-v-cb0d2287]:hover{background:#282828f2;box-shadow:0 8px 24px #fb72994d}html[data-theme=dark] .button-text[data-v-cb0d2287],.bili-dark .button-text[data-v-cb0d2287]{color:#ff8fab} ');

System.addImportMap({ imports: {"pinia":"user:pinia","vue":"user:vue"} });
System.set("user:pinia", (()=>{const _=Pinia;('default' in _)||(_.default=_);return _})());
System.set("user:vue", (()=>{const _=Vue;('default' in _)||(_.default=_);return _})());

System.register("./__entry.js", ['vue', 'pinia'], (function (exports, module) {
  'use strict';
  var version$1, defineComponent, ref, shallowRef, onMounted, onUnmounted, watch, toRaw, nextTick, h, isProxy, createApp, createElementBlock, createCommentVNode, openBlock, normalizeClass, createElementVNode, toDisplayString, withDirectives, Fragment, renderList, vModelSelect, computed, resolveComponent, createBlock, withCtx, createVNode, vShow, provide, createTextVNode, normalizeStyle, withModifiers, renderSlot, vModelText, defineStore, createPinia;
  return {
    setters: [module => {
      version$1 = module.version;
      defineComponent = module.defineComponent;
      ref = module.ref;
      shallowRef = module.shallowRef;
      onMounted = module.onMounted;
      onUnmounted = module.onUnmounted;
      watch = module.watch;
      toRaw = module.toRaw;
      nextTick = module.nextTick;
      h = module.h;
      isProxy = module.isProxy;
      createApp = module.createApp;
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
      computed = module.computed;
      resolveComponent = module.resolveComponent;
      createBlock = module.createBlock;
      withCtx = module.withCtx;
      createVNode = module.createVNode;
      vShow = module.vShow;
      provide = module.provide;
      createTextVNode = module.createTextVNode;
      normalizeStyle = module.normalizeStyle;
      withModifiers = module.withModifiers;
      renderSlot = module.renderSlot;
      vModelText = module.vModelText;
    }, module => {
      defineStore = module.defineStore;
      createPinia = module.createPinia;
    }],
    execute: (function () {

      var __defProp = Object.defineProperty;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      var _a;
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
      /*!
       * @kurkle/color v0.3.4
       * https://github.com/kurkle/color#readme
       * (c) 2024 Jukka Kurkela
       * Released under the MIT License
       */
      function round(v) {
        return v + 0.5 | 0;
      }
      const lim = (v, l, h3) => Math.max(Math.min(v, h3), l);
      function p2b(v) {
        return lim(round(v * 2.55), 0, 255);
      }
      function n2b(v) {
        return lim(round(v * 255), 0, 255);
      }
      function b2n(v) {
        return lim(round(v / 2.55) / 100, 0, 1);
      }
      function n2p(v) {
        return lim(round(v * 100), 0, 100);
      }
      const map$1 = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
      const hex = [..."0123456789ABCDEF"];
      const h1 = (b) => hex[b & 15];
      const h2 = (b) => hex[(b & 240) >> 4] + hex[b & 15];
      const eq = (b) => (b & 240) >> 4 === (b & 15);
      const isShort = (v) => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
      function hexParse(str) {
        var len = str.length;
        var ret;
        if (str[0] === "#") {
          if (len === 4 || len === 5) {
            ret = {
              r: 255 & map$1[str[1]] * 17,
              g: 255 & map$1[str[2]] * 17,
              b: 255 & map$1[str[3]] * 17,
              a: len === 5 ? map$1[str[4]] * 17 : 255
            };
          } else if (len === 7 || len === 9) {
            ret = {
              r: map$1[str[1]] << 4 | map$1[str[2]],
              g: map$1[str[3]] << 4 | map$1[str[4]],
              b: map$1[str[5]] << 4 | map$1[str[6]],
              a: len === 9 ? map$1[str[7]] << 4 | map$1[str[8]] : 255
            };
          }
        }
        return ret;
      }
      const alpha = (a, f) => a < 255 ? f(a) : "";
      function hexString(v) {
        var f = isShort(v) ? h1 : h2;
        return v ? "#" + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : void 0;
      }
      const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
      function hsl2rgbn(h3, s, l) {
        const a = s * Math.min(l, 1 - l);
        const f = (n, k = (n + h3 / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return [f(0), f(8), f(4)];
      }
      function hsv2rgbn(h3, s, v) {
        const f = (n, k = (n + h3 / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return [f(5), f(3), f(1)];
      }
      function hwb2rgbn(h3, w, b) {
        const rgb = hsl2rgbn(h3, 1, 0.5);
        let i;
        if (w + b > 1) {
          i = 1 / (w + b);
          w *= i;
          b *= i;
        }
        for (i = 0; i < 3; i++) {
          rgb[i] *= 1 - w - b;
          rgb[i] += w;
        }
        return rgb;
      }
      function hueValue(r, g, b, d, max) {
        if (r === max) {
          return (g - b) / d + (g < b ? 6 : 0);
        }
        if (g === max) {
          return (b - r) / d + 2;
        }
        return (r - g) / d + 4;
      }
      function rgb2hsl(v) {
        const range = 255;
        const r = v.r / range;
        const g = v.g / range;
        const b = v.b / range;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        let h3, s, d;
        if (max !== min) {
          d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          h3 = hueValue(r, g, b, d, max);
          h3 = h3 * 60 + 0.5;
        }
        return [h3 | 0, s || 0, l];
      }
      function calln(f, a, b, c) {
        return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
      }
      function hsl2rgb(h3, s, l) {
        return calln(hsl2rgbn, h3, s, l);
      }
      function hwb2rgb(h3, w, b) {
        return calln(hwb2rgbn, h3, w, b);
      }
      function hsv2rgb(h3, s, v) {
        return calln(hsv2rgbn, h3, s, v);
      }
      function hue(h3) {
        return (h3 % 360 + 360) % 360;
      }
      function hueParse(str) {
        const m = HUE_RE.exec(str);
        let a = 255;
        let v;
        if (!m) {
          return;
        }
        if (m[5] !== v) {
          a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
        }
        const h3 = hue(+m[2]);
        const p1 = +m[3] / 100;
        const p2 = +m[4] / 100;
        if (m[1] === "hwb") {
          v = hwb2rgb(h3, p1, p2);
        } else if (m[1] === "hsv") {
          v = hsv2rgb(h3, p1, p2);
        } else {
          v = hsl2rgb(h3, p1, p2);
        }
        return {
          r: v[0],
          g: v[1],
          b: v[2],
          a
        };
      }
      function rotate(v, deg) {
        var h3 = rgb2hsl(v);
        h3[0] = hue(h3[0] + deg);
        h3 = hsl2rgb(h3);
        v.r = h3[0];
        v.g = h3[1];
        v.b = h3[2];
      }
      function hslString(v) {
        if (!v) {
          return;
        }
        const a = rgb2hsl(v);
        const h3 = a[0];
        const s = n2p(a[1]);
        const l = n2p(a[2]);
        return v.a < 255 ? `hsla(${h3}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h3}, ${s}%, ${l}%)`;
      }
      const map = {
        x: "dark",
        Z: "light",
        Y: "re",
        X: "blu",
        W: "gr",
        V: "medium",
        U: "slate",
        A: "ee",
        T: "ol",
        S: "or",
        B: "ra",
        C: "lateg",
        D: "ights",
        R: "in",
        Q: "turquois",
        E: "hi",
        P: "ro",
        O: "al",
        N: "le",
        M: "de",
        L: "yello",
        F: "en",
        K: "ch",
        G: "arks",
        H: "ea",
        I: "ightg",
        J: "wh"
      };
      const names$1 = {
        OiceXe: "f0f8ff",
        antiquewEte: "faebd7",
        aqua: "ffff",
        aquamarRe: "7fffd4",
        azuY: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "0",
        blanKedOmond: "ffebcd",
        Xe: "ff",
        XeviTet: "8a2be2",
        bPwn: "a52a2a",
        burlywood: "deb887",
        caMtXe: "5f9ea0",
        KartYuse: "7fff00",
        KocTate: "d2691e",
        cSO: "ff7f50",
        cSnflowerXe: "6495ed",
        cSnsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "ffff",
        xXe: "8b",
        xcyan: "8b8b",
        xgTMnPd: "b8860b",
        xWay: "a9a9a9",
        xgYF: "6400",
        xgYy: "a9a9a9",
        xkhaki: "bdb76b",
        xmagFta: "8b008b",
        xTivegYF: "556b2f",
        xSange: "ff8c00",
        xScEd: "9932cc",
        xYd: "8b0000",
        xsOmon: "e9967a",
        xsHgYF: "8fbc8f",
        xUXe: "483d8b",
        xUWay: "2f4f4f",
        xUgYy: "2f4f4f",
        xQe: "ced1",
        xviTet: "9400d3",
        dAppRk: "ff1493",
        dApskyXe: "bfff",
        dimWay: "696969",
        dimgYy: "696969",
        dodgerXe: "1e90ff",
        fiYbrick: "b22222",
        flSOwEte: "fffaf0",
        foYstWAn: "228b22",
        fuKsia: "ff00ff",
        gaRsbSo: "dcdcdc",
        ghostwEte: "f8f8ff",
        gTd: "ffd700",
        gTMnPd: "daa520",
        Way: "808080",
        gYF: "8000",
        gYFLw: "adff2f",
        gYy: "808080",
        honeyMw: "f0fff0",
        hotpRk: "ff69b4",
        RdianYd: "cd5c5c",
        Rdigo: "4b0082",
        ivSy: "fffff0",
        khaki: "f0e68c",
        lavFMr: "e6e6fa",
        lavFMrXsh: "fff0f5",
        lawngYF: "7cfc00",
        NmoncEffon: "fffacd",
        ZXe: "add8e6",
        ZcSO: "f08080",
        Zcyan: "e0ffff",
        ZgTMnPdLw: "fafad2",
        ZWay: "d3d3d3",
        ZgYF: "90ee90",
        ZgYy: "d3d3d3",
        ZpRk: "ffb6c1",
        ZsOmon: "ffa07a",
        ZsHgYF: "20b2aa",
        ZskyXe: "87cefa",
        ZUWay: "778899",
        ZUgYy: "778899",
        ZstAlXe: "b0c4de",
        ZLw: "ffffe0",
        lime: "ff00",
        limegYF: "32cd32",
        lRF: "faf0e6",
        magFta: "ff00ff",
        maPon: "800000",
        VaquamarRe: "66cdaa",
        VXe: "cd",
        VScEd: "ba55d3",
        VpurpN: "9370db",
        VsHgYF: "3cb371",
        VUXe: "7b68ee",
        VsprRggYF: "fa9a",
        VQe: "48d1cc",
        VviTetYd: "c71585",
        midnightXe: "191970",
        mRtcYam: "f5fffa",
        mistyPse: "ffe4e1",
        moccasR: "ffe4b5",
        navajowEte: "ffdead",
        navy: "80",
        Tdlace: "fdf5e6",
        Tive: "808000",
        TivedBb: "6b8e23",
        Sange: "ffa500",
        SangeYd: "ff4500",
        ScEd: "da70d6",
        pOegTMnPd: "eee8aa",
        pOegYF: "98fb98",
        pOeQe: "afeeee",
        pOeviTetYd: "db7093",
        papayawEp: "ffefd5",
        pHKpuff: "ffdab9",
        peru: "cd853f",
        pRk: "ffc0cb",
        plum: "dda0dd",
        powMrXe: "b0e0e6",
        purpN: "800080",
        YbeccapurpN: "663399",
        Yd: "ff0000",
        Psybrown: "bc8f8f",
        PyOXe: "4169e1",
        saddNbPwn: "8b4513",
        sOmon: "fa8072",
        sandybPwn: "f4a460",
        sHgYF: "2e8b57",
        sHshell: "fff5ee",
        siFna: "a0522d",
        silver: "c0c0c0",
        skyXe: "87ceeb",
        UXe: "6a5acd",
        UWay: "708090",
        UgYy: "708090",
        snow: "fffafa",
        sprRggYF: "ff7f",
        stAlXe: "4682b4",
        tan: "d2b48c",
        teO: "8080",
        tEstN: "d8bfd8",
        tomato: "ff6347",
        Qe: "40e0d0",
        viTet: "ee82ee",
        JHt: "f5deb3",
        wEte: "ffffff",
        wEtesmoke: "f5f5f5",
        Lw: "ffff00",
        LwgYF: "9acd32"
      };
      function unpack() {
        const unpacked = {};
        const keys = Object.keys(names$1);
        const tkeys = Object.keys(map);
        let i, j, k, ok, nk;
        for (i = 0; i < keys.length; i++) {
          ok = nk = keys[i];
          for (j = 0; j < tkeys.length; j++) {
            k = tkeys[j];
            nk = nk.replace(k, map[k]);
          }
          k = parseInt(names$1[ok], 16);
          unpacked[nk] = [k >> 16 & 255, k >> 8 & 255, k & 255];
        }
        return unpacked;
      }
      let names;
      function nameParse(str) {
        if (!names) {
          names = unpack();
          names.transparent = [0, 0, 0, 0];
        }
        const a = names[str.toLowerCase()];
        return a && {
          r: a[0],
          g: a[1],
          b: a[2],
          a: a.length === 4 ? a[3] : 255
        };
      }
      const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
      function rgbParse(str) {
        const m = RGB_RE.exec(str);
        let a = 255;
        let r, g, b;
        if (!m) {
          return;
        }
        if (m[7] !== r) {
          const v = +m[7];
          a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
        }
        r = +m[1];
        g = +m[3];
        b = +m[5];
        r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
        g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
        b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
        return {
          r,
          g,
          b,
          a
        };
      }
      function rgbString(v) {
        return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
      }
      const to = (v) => v <= 31308e-7 ? v * 12.92 : Math.pow(v, 1 / 2.4) * 1.055 - 0.055;
      const from = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      function interpolate$1(rgb1, rgb2, t) {
        const r = from(b2n(rgb1.r));
        const g = from(b2n(rgb1.g));
        const b = from(b2n(rgb1.b));
        return {
          r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
          g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
          b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
          a: rgb1.a + t * (rgb2.a - rgb1.a)
        };
      }
      function modHSL(v, i, ratio) {
        if (v) {
          let tmp = rgb2hsl(v);
          tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
          tmp = hsl2rgb(tmp);
          v.r = tmp[0];
          v.g = tmp[1];
          v.b = tmp[2];
        }
      }
      function clone$1(v, proto) {
        return v ? Object.assign(proto || {}, v) : v;
      }
      function fromObject(input) {
        var v = { r: 0, g: 0, b: 0, a: 255 };
        if (Array.isArray(input)) {
          if (input.length >= 3) {
            v = { r: input[0], g: input[1], b: input[2], a: 255 };
            if (input.length > 3) {
              v.a = n2b(input[3]);
            }
          }
        } else {
          v = clone$1(input, { r: 0, g: 0, b: 0, a: 1 });
          v.a = n2b(v.a);
        }
        return v;
      }
      function functionParse(str) {
        if (str.charAt(0) === "r") {
          return rgbParse(str);
        }
        return hueParse(str);
      }
      class Color {
        constructor(input) {
          if (input instanceof Color) {
            return input;
          }
          const type = typeof input;
          let v;
          if (type === "object") {
            v = fromObject(input);
          } else if (type === "string") {
            v = hexParse(input) || nameParse(input) || functionParse(input);
          }
          this._rgb = v;
          this._valid = !!v;
        }
        get valid() {
          return this._valid;
        }
        get rgb() {
          var v = clone$1(this._rgb);
          if (v) {
            v.a = b2n(v.a);
          }
          return v;
        }
        set rgb(obj) {
          this._rgb = fromObject(obj);
        }
        rgbString() {
          return this._valid ? rgbString(this._rgb) : void 0;
        }
        hexString() {
          return this._valid ? hexString(this._rgb) : void 0;
        }
        hslString() {
          return this._valid ? hslString(this._rgb) : void 0;
        }
        mix(color2, weight) {
          if (color2) {
            const c1 = this.rgb;
            const c2 = color2.rgb;
            let w2;
            const p = weight === w2 ? 0.5 : weight;
            const w = 2 * p - 1;
            const a = c1.a - c2.a;
            const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
            w2 = 1 - w1;
            c1.r = 255 & w1 * c1.r + w2 * c2.r + 0.5;
            c1.g = 255 & w1 * c1.g + w2 * c2.g + 0.5;
            c1.b = 255 & w1 * c1.b + w2 * c2.b + 0.5;
            c1.a = p * c1.a + (1 - p) * c2.a;
            this.rgb = c1;
          }
          return this;
        }
        interpolate(color2, t) {
          if (color2) {
            this._rgb = interpolate$1(this._rgb, color2._rgb, t);
          }
          return this;
        }
        clone() {
          return new Color(this.rgb);
        }
        alpha(a) {
          this._rgb.a = n2b(a);
          return this;
        }
        clearer(ratio) {
          const rgb = this._rgb;
          rgb.a *= 1 - ratio;
          return this;
        }
        greyscale() {
          const rgb = this._rgb;
          const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
          rgb.r = rgb.g = rgb.b = val;
          return this;
        }
        opaquer(ratio) {
          const rgb = this._rgb;
          rgb.a *= 1 + ratio;
          return this;
        }
        negate() {
          const v = this._rgb;
          v.r = 255 - v.r;
          v.g = 255 - v.g;
          v.b = 255 - v.b;
          return this;
        }
        lighten(ratio) {
          modHSL(this._rgb, 2, ratio);
          return this;
        }
        darken(ratio) {
          modHSL(this._rgb, 2, -ratio);
          return this;
        }
        saturate(ratio) {
          modHSL(this._rgb, 1, ratio);
          return this;
        }
        desaturate(ratio) {
          modHSL(this._rgb, 1, -ratio);
          return this;
        }
        rotate(deg) {
          rotate(this._rgb, deg);
          return this;
        }
      }
      /*!
       * Chart.js v4.5.0
       * https://www.chartjs.org
       * (c) 2025 Chart.js Contributors
       * Released under the MIT License
       */
      function noop() {
      }
      const uid = /* @__PURE__ */ (() => {
        let id = 0;
        return () => id++;
      })();
      function isNullOrUndef(value) {
        return value === null || value === void 0;
      }
      function isArray(value) {
        if (Array.isArray && Array.isArray(value)) {
          return true;
        }
        const type = Object.prototype.toString.call(value);
        if (type.slice(0, 7) === "[object" && type.slice(-6) === "Array]") {
          return true;
        }
        return false;
      }
      function isObject(value) {
        return value !== null && Object.prototype.toString.call(value) === "[object Object]";
      }
      function isNumberFinite(value) {
        return (typeof value === "number" || value instanceof Number) && isFinite(+value);
      }
      function finiteOrDefault(value, defaultValue) {
        return isNumberFinite(value) ? value : defaultValue;
      }
      function valueOrDefault(value, defaultValue) {
        return typeof value === "undefined" ? defaultValue : value;
      }
      const toPercentage = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 : +value / dimension;
      const toDimension = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 * dimension : +value;
      function callback(fn, args, thisArg) {
        if (fn && typeof fn.call === "function") {
          return fn.apply(thisArg, args);
        }
      }
      function each(loopable, fn, thisArg, reverse) {
        let i, len, keys;
        if (isArray(loopable)) {
          len = loopable.length;
          {
            for (i = 0; i < len; i++) {
              fn.call(thisArg, loopable[i], i);
            }
          }
        } else if (isObject(loopable)) {
          keys = Object.keys(loopable);
          len = keys.length;
          for (i = 0; i < len; i++) {
            fn.call(thisArg, loopable[keys[i]], keys[i]);
          }
        }
      }
      function _elementsEqual(a0, a1) {
        let i, ilen, v0, v1;
        if (!a0 || !a1 || a0.length !== a1.length) {
          return false;
        }
        for (i = 0, ilen = a0.length; i < ilen; ++i) {
          v0 = a0[i];
          v1 = a1[i];
          if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
            return false;
          }
        }
        return true;
      }
      function clone(source) {
        if (isArray(source)) {
          return source.map(clone);
        }
        if (isObject(source)) {
          const target = /* @__PURE__ */ Object.create(null);
          const keys = Object.keys(source);
          const klen = keys.length;
          let k = 0;
          for (; k < klen; ++k) {
            target[keys[k]] = clone(source[keys[k]]);
          }
          return target;
        }
        return source;
      }
      function isValidKey(key) {
        return [
          "__proto__",
          "prototype",
          "constructor"
        ].indexOf(key) === -1;
      }
      function _merger(key, target, source, options) {
        if (!isValidKey(key)) {
          return;
        }
        const tval = target[key];
        const sval = source[key];
        if (isObject(tval) && isObject(sval)) {
          merge(tval, sval, options);
        } else {
          target[key] = clone(sval);
        }
      }
      function merge(target, source, options) {
        const sources = isArray(source) ? source : [
          source
        ];
        const ilen = sources.length;
        if (!isObject(target)) {
          return target;
        }
        options = options || {};
        const merger = options.merger || _merger;
        let current;
        for (let i = 0; i < ilen; ++i) {
          current = sources[i];
          if (!isObject(current)) {
            continue;
          }
          const keys = Object.keys(current);
          for (let k = 0, klen = keys.length; k < klen; ++k) {
            merger(keys[k], target, current, options);
          }
        }
        return target;
      }
      function mergeIf(target, source) {
        return merge(target, source, {
          merger: _mergerIf
        });
      }
      function _mergerIf(key, target, source) {
        if (!isValidKey(key)) {
          return;
        }
        const tval = target[key];
        const sval = source[key];
        if (isObject(tval) && isObject(sval)) {
          mergeIf(tval, sval);
        } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
          target[key] = clone(sval);
        }
      }
      const keyResolvers = {
        // Chart.helpers.core resolveObjectKey should resolve empty key to root object
        "": (v) => v,
        // default resolvers
        x: (o) => o.x,
        y: (o) => o.y
      };
      function _splitKey(key) {
        const parts = key.split(".");
        const keys = [];
        let tmp = "";
        for (const part of parts) {
          tmp += part;
          if (tmp.endsWith("\\")) {
            tmp = tmp.slice(0, -1) + ".";
          } else {
            keys.push(tmp);
            tmp = "";
          }
        }
        return keys;
      }
      function _getKeyResolver(key) {
        const keys = _splitKey(key);
        return (obj) => {
          for (const k of keys) {
            if (k === "") {
              break;
            }
            obj = obj && obj[k];
          }
          return obj;
        };
      }
      function resolveObjectKey(obj, key) {
        const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
        return resolver(obj);
      }
      function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      const defined = (value) => typeof value !== "undefined";
      const isFunction = (value) => typeof value === "function";
      const setsEqual = (a, b) => {
        if (a.size !== b.size) {
          return false;
        }
        for (const item of a) {
          if (!b.has(item)) {
            return false;
          }
        }
        return true;
      };
      function _isClickEvent(e) {
        return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
      }
      const PI = Math.PI;
      const TAU = 2 * PI;
      const INFINITY = Number.POSITIVE_INFINITY;
      const RAD_PER_DEG = PI / 180;
      const HALF_PI = PI / 2;
      const QUARTER_PI = PI / 4;
      const TWO_THIRDS_PI = PI * 2 / 3;
      const sign = Math.sign;
      function _factorize(value) {
        const result = [];
        const sqrt = Math.sqrt(value);
        let i;
        for (i = 1; i < sqrt; i++) {
          if (value % i === 0) {
            result.push(i);
            result.push(value / i);
          }
        }
        if (sqrt === (sqrt | 0)) {
          result.push(sqrt);
        }
        result.sort((a, b) => a - b).pop();
        return result;
      }
      function isNonPrimitive(n) {
        return typeof n === "symbol" || typeof n === "object" && n !== null && !(Symbol.toPrimitive in n || "toString" in n || "valueOf" in n);
      }
      function isNumber(n) {
        return !isNonPrimitive(n) && !isNaN(parseFloat(n)) && isFinite(n);
      }
      function toRadians(degrees) {
        return degrees * (PI / 180);
      }
      function toDegrees(radians) {
        return radians * (180 / PI);
      }
      function getAngleFromPoint(centrePoint, anglePoint) {
        const distanceFromXCenter = anglePoint.x - centrePoint.x;
        const distanceFromYCenter = anglePoint.y - centrePoint.y;
        const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
        let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
        if (angle < -0.5 * PI) {
          angle += TAU;
        }
        return {
          angle,
          distance: radialDistanceFromCenter
        };
      }
      function distanceBetweenPoints(pt1, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
      }
      function _normalizeAngle(a) {
        return (a % TAU + TAU) % TAU;
      }
      function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
        const a = _normalizeAngle(angle);
        const s = _normalizeAngle(start);
        const e = _normalizeAngle(end);
        const angleToStart = _normalizeAngle(s - a);
        const angleToEnd = _normalizeAngle(e - a);
        const startToAngle = _normalizeAngle(a - s);
        const endToAngle = _normalizeAngle(a - e);
        return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
      }
      function _limitValue(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }
      function _int16Range(value) {
        return _limitValue(value, -32768, 32767);
      }
      function _isBetween(value, start, end, epsilon = 1e-6) {
        return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
      }
      function _lookup(table, value, cmp) {
        cmp = cmp || ((index) => table[index] < value);
        let hi = table.length - 1;
        let lo = 0;
        let mid;
        while (hi - lo > 1) {
          mid = lo + hi >> 1;
          if (cmp(mid)) {
            lo = mid;
          } else {
            hi = mid;
          }
        }
        return {
          lo,
          hi
        };
      }
      const _lookupByKey = (table, key, value, last) => _lookup(table, value, last ? (index) => {
        const ti = table[index][key];
        return ti < value || ti === value && table[index + 1][key] === value;
      } : (index) => table[index][key] < value);
      const _rlookupByKey = (table, key, value) => _lookup(table, value, (index) => table[index][key] >= value);
      function _filterBetween(values, min, max) {
        let start = 0;
        let end = values.length;
        while (start < end && values[start] < min) {
          start++;
        }
        while (end > start && values[end - 1] > max) {
          end--;
        }
        return start > 0 || end < values.length ? values.slice(start, end) : values;
      }
      const arrayEvents = [
        "push",
        "pop",
        "shift",
        "splice",
        "unshift"
      ];
      function listenArrayEvents(array, listener) {
        if (array._chartjs) {
          array._chartjs.listeners.push(listener);
          return;
        }
        Object.defineProperty(array, "_chartjs", {
          configurable: true,
          enumerable: false,
          value: {
            listeners: [
              listener
            ]
          }
        });
        arrayEvents.forEach((key) => {
          const method = "_onData" + _capitalize(key);
          const base = array[key];
          Object.defineProperty(array, key, {
            configurable: true,
            enumerable: false,
            value(...args) {
              const res = base.apply(this, args);
              array._chartjs.listeners.forEach((object) => {
                if (typeof object[method] === "function") {
                  object[method](...args);
                }
              });
              return res;
            }
          });
        });
      }
      function unlistenArrayEvents(array, listener) {
        const stub = array._chartjs;
        if (!stub) {
          return;
        }
        const listeners = stub.listeners;
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
        if (listeners.length > 0) {
          return;
        }
        arrayEvents.forEach((key) => {
          delete array[key];
        });
        delete array._chartjs;
      }
      function _arrayUnique(items) {
        const set2 = new Set(items);
        if (set2.size === items.length) {
          return items;
        }
        return Array.from(set2);
      }
      const requestAnimFrame = function() {
        if (typeof window === "undefined") {
          return function(callback2) {
            return callback2();
          };
        }
        return window.requestAnimationFrame;
      }();
      function throttled(fn, thisArg) {
        let argsToUse = [];
        let ticking = false;
        return function(...args) {
          argsToUse = args;
          if (!ticking) {
            ticking = true;
            requestAnimFrame.call(window, () => {
              ticking = false;
              fn.apply(thisArg, argsToUse);
            });
          }
        };
      }
      function debounce(fn, delay) {
        let timeout;
        return function(...args) {
          if (delay) {
            clearTimeout(timeout);
            timeout = setTimeout(fn, delay, args);
          } else {
            fn.apply(this, args);
          }
          return delay;
        };
      }
      const _toLeftRightCenter = (align) => align === "start" ? "left" : align === "end" ? "right" : "center";
      const _alignStartEnd = (align, start, end) => align === "start" ? start : align === "end" ? end : (start + end) / 2;
      const _textX = (align, left, right, rtl) => {
        const check = rtl ? "left" : "right";
        return align === check ? right : align === "center" ? (left + right) / 2 : left;
      };
      const atEdge = (t) => t === 0 || t === 1;
      const elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
      const elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
      const effects = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => -t * (t - 2),
        easeInOutQuad: (t) => (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (t -= 1) * t * t + 1,
        easeInOutCubic: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => -((t -= 1) * t * t * t - 1),
        easeInOutQuart: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
        easeInQuint: (t) => t * t * t * t * t,
        easeOutQuint: (t) => (t -= 1) * t * t * t * t + 1,
        easeInOutQuint: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
        easeInSine: (t) => -Math.cos(t * HALF_PI) + 1,
        easeOutSine: (t) => Math.sin(t * HALF_PI),
        easeInOutSine: (t) => -0.5 * (Math.cos(PI * t) - 1),
        easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
        easeOutExpo: (t) => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
        easeInOutExpo: (t) => atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
        easeInCirc: (t) => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
        easeOutCirc: (t) => Math.sqrt(1 - (t -= 1) * t),
        easeInOutCirc: (t) => (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
        easeInElastic: (t) => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
        easeOutElastic: (t) => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
        easeInOutElastic(t) {
          const s = 0.1125;
          const p = 0.45;
          return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
        },
        easeInBack(t) {
          const s = 1.70158;
          return t * t * ((s + 1) * t - s);
        },
        easeOutBack(t) {
          const s = 1.70158;
          return (t -= 1) * t * ((s + 1) * t + s) + 1;
        },
        easeInOutBack(t) {
          let s = 1.70158;
          if ((t /= 0.5) < 1) {
            return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
          }
          return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
        },
        easeInBounce: (t) => 1 - effects.easeOutBounce(1 - t),
        easeOutBounce(t) {
          const m = 7.5625;
          const d = 2.75;
          if (t < 1 / d) {
            return m * t * t;
          }
          if (t < 2 / d) {
            return m * (t -= 1.5 / d) * t + 0.75;
          }
          if (t < 2.5 / d) {
            return m * (t -= 2.25 / d) * t + 0.9375;
          }
          return m * (t -= 2.625 / d) * t + 0.984375;
        },
        easeInOutBounce: (t) => t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
      };
      function isPatternOrGradient(value) {
        if (value && typeof value === "object") {
          const type = value.toString();
          return type === "[object CanvasPattern]" || type === "[object CanvasGradient]";
        }
        return false;
      }
      function color(value) {
        return isPatternOrGradient(value) ? value : new Color(value);
      }
      function getHoverColor(value) {
        return isPatternOrGradient(value) ? value : new Color(value).saturate(0.5).darken(0.1).hexString();
      }
      const numbers = [
        "x",
        "y",
        "borderWidth",
        "radius",
        "tension"
      ];
      const colors = [
        "color",
        "borderColor",
        "backgroundColor"
      ];
      function applyAnimationsDefaults(defaults2) {
        defaults2.set("animation", {
          delay: void 0,
          duration: 1e3,
          easing: "easeOutQuart",
          fn: void 0,
          from: void 0,
          loop: void 0,
          to: void 0,
          type: void 0
        });
        defaults2.describe("animation", {
          _fallback: false,
          _indexable: false,
          _scriptable: (name) => name !== "onProgress" && name !== "onComplete" && name !== "fn"
        });
        defaults2.set("animations", {
          colors: {
            type: "color",
            properties: colors
          },
          numbers: {
            type: "number",
            properties: numbers
          }
        });
        defaults2.describe("animations", {
          _fallback: "animation"
        });
        defaults2.set("transitions", {
          active: {
            animation: {
              duration: 400
            }
          },
          resize: {
            animation: {
              duration: 0
            }
          },
          show: {
            animations: {
              colors: {
                from: "transparent"
              },
              visible: {
                type: "boolean",
                duration: 0
              }
            }
          },
          hide: {
            animations: {
              colors: {
                to: "transparent"
              },
              visible: {
                type: "boolean",
                easing: "linear",
                fn: (v) => v | 0
              }
            }
          }
        });
      }
      function applyLayoutsDefaults(defaults2) {
        defaults2.set("layout", {
          autoPadding: true,
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        });
      }
      const intlCache = /* @__PURE__ */ new Map();
      function getNumberFormat(locale, options) {
        options = options || {};
        const cacheKey = locale + JSON.stringify(options);
        let formatter = intlCache.get(cacheKey);
        if (!formatter) {
          formatter = new Intl.NumberFormat(locale, options);
          intlCache.set(cacheKey, formatter);
        }
        return formatter;
      }
      function formatNumber(num, locale, options) {
        return getNumberFormat(locale, options).format(num);
      }
      const formatters = {
        values(value) {
          return isArray(value) ? value : "" + value;
        }
      };
      var Ticks = {
        formatters
      };
      function applyScaleDefaults(defaults2) {
        defaults2.set("scale", {
          display: true,
          offset: false,
          reverse: false,
          beginAtZero: false,
          bounds: "ticks",
          clip: true,
          grace: 0,
          grid: {
            display: true,
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            tickLength: 8,
            tickWidth: (_ctx, options) => options.lineWidth,
            tickColor: (_ctx, options) => options.color,
            offset: false
          },
          border: {
            display: true,
            dash: [],
            dashOffset: 0,
            width: 1
          },
          title: {
            display: false,
            text: "",
            padding: {
              top: 4,
              bottom: 4
            }
          },
          ticks: {
            minRotation: 0,
            maxRotation: 50,
            mirror: false,
            textStrokeWidth: 0,
            textStrokeColor: "",
            padding: 3,
            display: true,
            autoSkip: true,
            autoSkipPadding: 3,
            labelOffset: 0,
            callback: Ticks.formatters.values,
            minor: {},
            major: {},
            align: "center",
            crossAlign: "near",
            showLabelBackdrop: false,
            backdropColor: "rgba(255, 255, 255, 0.75)",
            backdropPadding: 2
          }
        });
        defaults2.route("scale.ticks", "color", "", "color");
        defaults2.route("scale.grid", "color", "", "borderColor");
        defaults2.route("scale.border", "color", "", "borderColor");
        defaults2.route("scale.title", "color", "", "color");
        defaults2.describe("scale", {
          _fallback: false,
          _scriptable: (name) => !name.startsWith("before") && !name.startsWith("after") && name !== "callback" && name !== "parser",
          _indexable: (name) => name !== "borderDash" && name !== "tickBorderDash" && name !== "dash"
        });
        defaults2.describe("scales", {
          _fallback: "scale"
        });
        defaults2.describe("scale.ticks", {
          _scriptable: (name) => name !== "backdropPadding" && name !== "callback",
          _indexable: (name) => name !== "backdropPadding"
        });
      }
      const overrides = /* @__PURE__ */ Object.create(null);
      const descriptors = /* @__PURE__ */ Object.create(null);
      function getScope$1(node, key) {
        if (!key) {
          return node;
        }
        const keys = key.split(".");
        for (let i = 0, n = keys.length; i < n; ++i) {
          const k = keys[i];
          node = node[k] || (node[k] = /* @__PURE__ */ Object.create(null));
        }
        return node;
      }
      function set(root, scope, values) {
        if (typeof scope === "string") {
          return merge(getScope$1(root, scope), values);
        }
        return merge(getScope$1(root, ""), scope);
      }
      class Defaults {
        constructor(_descriptors2, _appliers) {
          this.animation = void 0;
          this.backgroundColor = "rgba(0,0,0,0.1)";
          this.borderColor = "rgba(0,0,0,0.1)";
          this.color = "#666";
          this.datasets = {};
          this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
          this.elements = {};
          this.events = [
            "mousemove",
            "mouseout",
            "click",
            "touchstart",
            "touchmove"
          ];
          this.font = {
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            size: 12,
            style: "normal",
            lineHeight: 1.2,
            weight: null
          };
          this.hover = {};
          this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
          this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
          this.hoverColor = (ctx, options) => getHoverColor(options.color);
          this.indexAxis = "x";
          this.interaction = {
            mode: "nearest",
            intersect: true,
            includeInvisible: false
          };
          this.maintainAspectRatio = true;
          this.onHover = null;
          this.onClick = null;
          this.parsing = true;
          this.plugins = {};
          this.responsive = true;
          this.scale = void 0;
          this.scales = {};
          this.showLine = true;
          this.drawActiveElementsOnTop = true;
          this.describe(_descriptors2);
          this.apply(_appliers);
        }
        set(scope, values) {
          return set(this, scope, values);
        }
        get(scope) {
          return getScope$1(this, scope);
        }
        describe(scope, values) {
          return set(descriptors, scope, values);
        }
        override(scope, values) {
          return set(overrides, scope, values);
        }
        route(scope, name, targetScope, targetName) {
          const scopeObject = getScope$1(this, scope);
          const targetScopeObject = getScope$1(this, targetScope);
          const privateName = "_" + name;
          Object.defineProperties(scopeObject, {
            [privateName]: {
              value: scopeObject[name],
              writable: true
            },
            [name]: {
              enumerable: true,
              get() {
                const local = this[privateName];
                const target = targetScopeObject[targetName];
                if (isObject(local)) {
                  return Object.assign({}, target, local);
                }
                return valueOrDefault(local, target);
              },
              set(value) {
                this[privateName] = value;
              }
            }
          });
        }
        apply(appliers) {
          appliers.forEach((apply) => apply(this));
        }
      }
      var defaults = /* @__PURE__ */ new Defaults({
        _scriptable: (name) => !name.startsWith("on"),
        _indexable: (name) => name !== "events",
        hover: {
          _fallback: "interaction"
        },
        interaction: {
          _scriptable: false,
          _indexable: false
        }
      }, [
        applyAnimationsDefaults,
        applyLayoutsDefaults,
        applyScaleDefaults
      ]);
      function toFontString(font) {
        if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
          return null;
        }
        return (font.style ? font.style + " " : "") + (font.weight ? font.weight + " " : "") + font.size + "px " + font.family;
      }
      function _measureText(ctx, data, gc, longest, string) {
        let textWidth = data[string];
        if (!textWidth) {
          textWidth = data[string] = ctx.measureText(string).width;
          gc.push(string);
        }
        if (textWidth > longest) {
          longest = textWidth;
        }
        return longest;
      }
      function _alignPixel(chart, pixel, width) {
        const devicePixelRatio = chart.currentDevicePixelRatio;
        const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
        return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
      }
      function clearCanvas(canvas, ctx) {
        if (!ctx && !canvas) {
          return;
        }
        ctx = ctx || canvas.getContext("2d");
        ctx.save();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
      function drawPoint(ctx, options, x, y) {
        drawPointLegend(ctx, options, x, y, null);
      }
      function drawPointLegend(ctx, options, x, y, w) {
        let type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
        const style = options.pointStyle;
        const rotation = options.rotation;
        const radius = options.radius;
        let rad = (rotation || 0) * RAD_PER_DEG;
        if (style && typeof style === "object") {
          type = style.toString();
          if (type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]") {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rad);
            ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
            ctx.restore();
            return;
          }
        }
        if (isNaN(radius) || radius <= 0) {
          return;
        }
        ctx.beginPath();
        switch (style) {
          default:
            if (w) {
              ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
            } else {
              ctx.arc(x, y, radius, 0, TAU);
            }
            ctx.closePath();
            break;
          case "triangle":
            width = w ? w / 2 : radius;
            ctx.moveTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            rad += TWO_THIRDS_PI;
            ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            rad += TWO_THIRDS_PI;
            ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            ctx.closePath();
            break;
          case "rectRounded":
            cornerRadius = radius * 0.516;
            size = radius - cornerRadius;
            xOffset = Math.cos(rad + QUARTER_PI) * size;
            xOffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
            yOffset = Math.sin(rad + QUARTER_PI) * size;
            yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
            ctx.arc(x - xOffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
            ctx.arc(x + yOffsetW, y - xOffset, cornerRadius, rad - HALF_PI, rad);
            ctx.arc(x + xOffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
            ctx.arc(x - yOffsetW, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
            ctx.closePath();
            break;
          case "rect":
            if (!rotation) {
              size = Math.SQRT1_2 * radius;
              width = w ? w / 2 : size;
              ctx.rect(x - width, y - size, 2 * width, 2 * size);
              break;
            }
            rad += QUARTER_PI;
          case "rectRot":
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            ctx.closePath();
            break;
          case "crossRot":
            rad += QUARTER_PI;
          case "cross":
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.moveTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            break;
          case "star":
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.moveTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            rad += QUARTER_PI;
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.moveTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            break;
          case "line":
            xOffset = w ? w / 2 : Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            ctx.moveTo(x - xOffset, y - yOffset);
            ctx.lineTo(x + xOffset, y + yOffset);
            break;
          case "dash":
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
            break;
          case false:
            ctx.closePath();
            break;
        }
        ctx.fill();
        if (options.borderWidth > 0) {
          ctx.stroke();
        }
      }
      function _isPointInArea(point, area, margin) {
        margin = margin || 0.5;
        return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
      }
      function clipArea(ctx, area) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
        ctx.clip();
      }
      function unclipArea(ctx) {
        ctx.restore();
      }
      function setRenderOpts(ctx, opts) {
        if (opts.translation) {
          ctx.translate(opts.translation[0], opts.translation[1]);
        }
        if (!isNullOrUndef(opts.rotation)) {
          ctx.rotate(opts.rotation);
        }
        if (opts.color) {
          ctx.fillStyle = opts.color;
        }
        if (opts.textAlign) {
          ctx.textAlign = opts.textAlign;
        }
        if (opts.textBaseline) {
          ctx.textBaseline = opts.textBaseline;
        }
      }
      function decorateText(ctx, x, y, line, opts) {
        if (opts.strikethrough || opts.underline) {
          const metrics = ctx.measureText(line);
          const left = x - metrics.actualBoundingBoxLeft;
          const right = x + metrics.actualBoundingBoxRight;
          const top = y - metrics.actualBoundingBoxAscent;
          const bottom = y + metrics.actualBoundingBoxDescent;
          const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();
          ctx.lineWidth = opts.decorationWidth || 2;
          ctx.moveTo(left, yDecoration);
          ctx.lineTo(right, yDecoration);
          ctx.stroke();
        }
      }
      function drawBackdrop(ctx, opts) {
        const oldColor = ctx.fillStyle;
        ctx.fillStyle = opts.color;
        ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
        ctx.fillStyle = oldColor;
      }
      function renderText(ctx, text, x, y, font, opts = {}) {
        const lines = isArray(text) ? text : [
          text
        ];
        const stroke = opts.strokeWidth > 0 && opts.strokeColor !== "";
        let i, line;
        ctx.save();
        ctx.font = font.string;
        setRenderOpts(ctx, opts);
        for (i = 0; i < lines.length; ++i) {
          line = lines[i];
          if (opts.backdrop) {
            drawBackdrop(ctx, opts.backdrop);
          }
          if (stroke) {
            if (opts.strokeColor) {
              ctx.strokeStyle = opts.strokeColor;
            }
            if (!isNullOrUndef(opts.strokeWidth)) {
              ctx.lineWidth = opts.strokeWidth;
            }
            ctx.strokeText(line, x, y, opts.maxWidth);
          }
          ctx.fillText(line, x, y, opts.maxWidth);
          decorateText(ctx, x, y, line, opts);
          y += Number(font.lineHeight);
        }
        ctx.restore();
      }
      function addRoundedRectPath(ctx, rect) {
        const { x, y, w, h: h3, radius } = rect;
        ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
        ctx.lineTo(x, y + h3 - radius.bottomLeft);
        ctx.arc(x + radius.bottomLeft, y + h3 - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
        ctx.lineTo(x + w - radius.bottomRight, y + h3);
        ctx.arc(x + w - radius.bottomRight, y + h3 - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
        ctx.lineTo(x + w, y + radius.topRight);
        ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
        ctx.lineTo(x + radius.topLeft, y);
      }
      const LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
      const FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
      function toLineHeight(value, size) {
        const matches = ("" + value).match(LINE_HEIGHT);
        if (!matches || matches[1] === "normal") {
          return size * 1.2;
        }
        value = +matches[2];
        switch (matches[3]) {
          case "px":
            return value;
          case "%":
            value /= 100;
            break;
        }
        return size * value;
      }
      const numberOrZero = (v) => +v || 0;
      function _readValueToProps(value, props) {
        const ret = {};
        const objProps = isObject(props);
        const keys = objProps ? Object.keys(props) : props;
        const read = isObject(value) ? objProps ? (prop) => valueOrDefault(value[prop], value[props[prop]]) : (prop) => value[prop] : () => value;
        for (const prop of keys) {
          ret[prop] = numberOrZero(read(prop));
        }
        return ret;
      }
      function toTRBL(value) {
        return _readValueToProps(value, {
          top: "y",
          right: "x",
          bottom: "y",
          left: "x"
        });
      }
      function toTRBLCorners(value) {
        return _readValueToProps(value, [
          "topLeft",
          "topRight",
          "bottomLeft",
          "bottomRight"
        ]);
      }
      function toPadding(value) {
        const obj = toTRBL(value);
        obj.width = obj.left + obj.right;
        obj.height = obj.top + obj.bottom;
        return obj;
      }
      function toFont(options, fallback) {
        options = options || {};
        fallback = fallback || defaults.font;
        let size = valueOrDefault(options.size, fallback.size);
        if (typeof size === "string") {
          size = parseInt(size, 10);
        }
        let style = valueOrDefault(options.style, fallback.style);
        if (style && !("" + style).match(FONT_STYLE)) {
          console.warn('Invalid font style specified: "' + style + '"');
          style = void 0;
        }
        const font = {
          family: valueOrDefault(options.family, fallback.family),
          lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
          size,
          style,
          weight: valueOrDefault(options.weight, fallback.weight),
          string: ""
        };
        font.string = toFontString(font);
        return font;
      }
      function resolve(inputs, context, index, info) {
        let i, ilen, value;
        for (i = 0, ilen = inputs.length; i < ilen; ++i) {
          value = inputs[i];
          if (value === void 0) {
            continue;
          }
          if (value !== void 0) {
            return value;
          }
        }
      }
      function _addGrace(minmax, grace, beginAtZero) {
        const { min, max } = minmax;
        const change = toDimension(grace, (max - min) / 2);
        const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
        return {
          min: keepZero(min, -Math.abs(change)),
          max: keepZero(max, change)
        };
      }
      function createContext(parentContext, context) {
        return Object.assign(Object.create(parentContext), context);
      }
      function _createResolver(scopes, prefixes = [
        ""
      ], rootScopes, fallback, getTarget = () => scopes[0]) {
        const finalRootScopes = rootScopes || scopes;
        if (typeof fallback === "undefined") {
          fallback = _resolve("_fallback", scopes);
        }
        const cache = {
          [Symbol.toStringTag]: "Object",
          _cacheable: true,
          _scopes: scopes,
          _rootScopes: finalRootScopes,
          _fallback: fallback,
          _getTarget: getTarget,
          override: (scope) => _createResolver([
            scope,
            ...scopes
          ], prefixes, finalRootScopes, fallback)
        };
        return new Proxy(cache, {
          /**
          * A trap for the delete operator.
          */
          deleteProperty(target, prop) {
            delete target[prop];
            delete target._keys;
            delete scopes[0][prop];
            return true;
          },
          /**
          * A trap for getting property values.
          */
          get(target, prop) {
            return _cached(target, prop, () => _resolveWithPrefixes(prop, prefixes, scopes, target));
          },
          /**
          * A trap for Object.getOwnPropertyDescriptor.
          * Also used by Object.hasOwnProperty.
          */
          getOwnPropertyDescriptor(target, prop) {
            return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
          },
          /**
          * A trap for Object.getPrototypeOf.
          */
          getPrototypeOf() {
            return Reflect.getPrototypeOf(scopes[0]);
          },
          /**
          * A trap for the in operator.
          */
          has(target, prop) {
            return getKeysFromAllScopes(target).includes(prop);
          },
          /**
          * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
          */
          ownKeys(target) {
            return getKeysFromAllScopes(target);
          },
          /**
          * A trap for setting property values.
          */
          set(target, prop, value) {
            const storage = target._storage || (target._storage = getTarget());
            target[prop] = storage[prop] = value;
            delete target._keys;
            return true;
          }
        });
      }
      function _attachContext(proxy, context, subProxy, descriptorDefaults) {
        const cache = {
          _cacheable: false,
          _proxy: proxy,
          _context: context,
          _subProxy: subProxy,
          _stack: /* @__PURE__ */ new Set(),
          _descriptors: _descriptors(proxy, descriptorDefaults),
          setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
          override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
        };
        return new Proxy(cache, {
          /**
          * A trap for the delete operator.
          */
          deleteProperty(target, prop) {
            delete target[prop];
            delete proxy[prop];
            return true;
          },
          /**
          * A trap for getting property values.
          */
          get(target, prop, receiver) {
            return _cached(target, prop, () => _resolveWithContext(target, prop, receiver));
          },
          /**
          * A trap for Object.getOwnPropertyDescriptor.
          * Also used by Object.hasOwnProperty.
          */
          getOwnPropertyDescriptor(target, prop) {
            return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
              enumerable: true,
              configurable: true
            } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
          },
          /**
          * A trap for Object.getPrototypeOf.
          */
          getPrototypeOf() {
            return Reflect.getPrototypeOf(proxy);
          },
          /**
          * A trap for the in operator.
          */
          has(target, prop) {
            return Reflect.has(proxy, prop);
          },
          /**
          * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
          */
          ownKeys() {
            return Reflect.ownKeys(proxy);
          },
          /**
          * A trap for setting property values.
          */
          set(target, prop, value) {
            proxy[prop] = value;
            delete target[prop];
            return true;
          }
        });
      }
      function _descriptors(proxy, defaults2 = {
        scriptable: true,
        indexable: true
      }) {
        const { _scriptable = defaults2.scriptable, _indexable = defaults2.indexable, _allKeys = defaults2.allKeys } = proxy;
        return {
          allKeys: _allKeys,
          scriptable: _scriptable,
          indexable: _indexable,
          isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
          isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
        };
      }
      const readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
      const needsSubResolver = (prop, value) => isObject(value) && prop !== "adapters" && (Object.getPrototypeOf(value) === null || value.constructor === Object);
      function _cached(target, prop, resolve2) {
        if (Object.prototype.hasOwnProperty.call(target, prop) || prop === "constructor") {
          return target[prop];
        }
        const value = resolve2();
        target[prop] = value;
        return value;
      }
      function _resolveWithContext(target, prop, receiver) {
        const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
        let value = _proxy[prop];
        if (isFunction(value) && descriptors2.isScriptable(prop)) {
          value = _resolveScriptable(prop, value, target, receiver);
        }
        if (isArray(value) && value.length) {
          value = _resolveArray(prop, value, target, descriptors2.isIndexable);
        }
        if (needsSubResolver(prop, value)) {
          value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors2);
        }
        return value;
      }
      function _resolveScriptable(prop, getValue, target, receiver) {
        const { _proxy, _context, _subProxy, _stack } = target;
        if (_stack.has(prop)) {
          throw new Error("Recursion detected: " + Array.from(_stack).join("->") + "->" + prop);
        }
        _stack.add(prop);
        let value = getValue(_context, _subProxy || receiver);
        _stack.delete(prop);
        if (needsSubResolver(prop, value)) {
          value = createSubResolver(_proxy._scopes, _proxy, prop, value);
        }
        return value;
      }
      function _resolveArray(prop, value, target, isIndexable) {
        const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
        if (typeof _context.index !== "undefined" && isIndexable(prop)) {
          return value[_context.index % value.length];
        } else if (isObject(value[0])) {
          const arr = value;
          const scopes = _proxy._scopes.filter((s) => s !== arr);
          value = [];
          for (const item of arr) {
            const resolver = createSubResolver(scopes, _proxy, prop, item);
            value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors2));
          }
        }
        return value;
      }
      function resolveFallback(fallback, prop, value) {
        return isFunction(fallback) ? fallback(prop, value) : fallback;
      }
      const getScope = (key, parent) => key === true ? parent : typeof key === "string" ? resolveObjectKey(parent, key) : void 0;
      function addScopes(set2, parentScopes, key, parentFallback, value) {
        for (const parent of parentScopes) {
          const scope = getScope(key, parent);
          if (scope) {
            set2.add(scope);
            const fallback = resolveFallback(scope._fallback, key, value);
            if (typeof fallback !== "undefined" && fallback !== key && fallback !== parentFallback) {
              return fallback;
            }
          } else if (scope === false && typeof parentFallback !== "undefined" && key !== parentFallback) {
            return null;
          }
        }
        return false;
      }
      function createSubResolver(parentScopes, resolver, prop, value) {
        const rootScopes = resolver._rootScopes;
        const fallback = resolveFallback(resolver._fallback, prop, value);
        const allScopes = [
          ...parentScopes,
          ...rootScopes
        ];
        const set2 = /* @__PURE__ */ new Set();
        set2.add(value);
        let key = addScopesFromKey(set2, allScopes, prop, fallback || prop, value);
        if (key === null) {
          return false;
        }
        if (typeof fallback !== "undefined" && fallback !== prop) {
          key = addScopesFromKey(set2, allScopes, fallback, key, value);
          if (key === null) {
            return false;
          }
        }
        return _createResolver(Array.from(set2), [
          ""
        ], rootScopes, fallback, () => subGetTarget(resolver, prop, value));
      }
      function addScopesFromKey(set2, allScopes, key, fallback, item) {
        while (key) {
          key = addScopes(set2, allScopes, key, fallback, item);
        }
        return key;
      }
      function subGetTarget(resolver, prop, value) {
        const parent = resolver._getTarget();
        if (!(prop in parent)) {
          parent[prop] = {};
        }
        const target = parent[prop];
        if (isArray(target) && isObject(value)) {
          return value;
        }
        return target || {};
      }
      function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
        let value;
        for (const prefix of prefixes) {
          value = _resolve(readKey(prefix, prop), scopes);
          if (typeof value !== "undefined") {
            return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
          }
        }
      }
      function _resolve(key, scopes) {
        for (const scope of scopes) {
          if (!scope) {
            continue;
          }
          const value = scope[key];
          if (typeof value !== "undefined") {
            return value;
          }
        }
      }
      function getKeysFromAllScopes(target) {
        let keys = target._keys;
        if (!keys) {
          keys = target._keys = resolveKeysFromAllScopes(target._scopes);
        }
        return keys;
      }
      function resolveKeysFromAllScopes(scopes) {
        const set2 = /* @__PURE__ */ new Set();
        for (const scope of scopes) {
          for (const key of Object.keys(scope).filter((k) => !k.startsWith("_"))) {
            set2.add(key);
          }
        }
        return Array.from(set2);
      }
      function _isDomSupported() {
        return typeof window !== "undefined" && typeof document !== "undefined";
      }
      function _getParentNode(domNode) {
        let parent = domNode.parentNode;
        if (parent && parent.toString() === "[object ShadowRoot]") {
          parent = parent.host;
        }
        return parent;
      }
      function parseMaxStyle(styleValue, node, parentProperty) {
        let valueInPixels;
        if (typeof styleValue === "string") {
          valueInPixels = parseInt(styleValue, 10);
          if (styleValue.indexOf("%") !== -1) {
            valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
          }
        } else {
          valueInPixels = styleValue;
        }
        return valueInPixels;
      }
      const getComputedStyle = (element) => element.ownerDocument.defaultView.getComputedStyle(element, null);
      function getStyle(el, property) {
        return getComputedStyle(el).getPropertyValue(property);
      }
      const positions = [
        "top",
        "right",
        "bottom",
        "left"
      ];
      function getPositionedStyle(styles, style, suffix) {
        const result = {};
        suffix = suffix ? "-" + suffix : "";
        for (let i = 0; i < 4; i++) {
          const pos = positions[i];
          result[pos] = parseFloat(styles[style + "-" + pos + suffix]) || 0;
        }
        result.width = result.left + result.right;
        result.height = result.top + result.bottom;
        return result;
      }
      const useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
      function getCanvasPosition(e, canvas) {
        const touches = e.touches;
        const source = touches && touches.length ? touches[0] : e;
        const { offsetX, offsetY } = source;
        let box = false;
        let x, y;
        if (useOffsetPos(offsetX, offsetY, e.target)) {
          x = offsetX;
          y = offsetY;
        } else {
          const rect = canvas.getBoundingClientRect();
          x = source.clientX - rect.left;
          y = source.clientY - rect.top;
          box = true;
        }
        return {
          x,
          y,
          box
        };
      }
      function getRelativePosition(event, chart) {
        if ("native" in event) {
          return event;
        }
        const { canvas, currentDevicePixelRatio } = chart;
        const style = getComputedStyle(canvas);
        const borderBox = style.boxSizing === "border-box";
        const paddings = getPositionedStyle(style, "padding");
        const borders = getPositionedStyle(style, "border", "width");
        const { x, y, box } = getCanvasPosition(event, canvas);
        const xOffset = paddings.left + (box && borders.left);
        const yOffset = paddings.top + (box && borders.top);
        let { width, height } = chart;
        if (borderBox) {
          width -= paddings.width + borders.width;
          height -= paddings.height + borders.height;
        }
        return {
          x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
          y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
        };
      }
      function getContainerSize(canvas, width, height) {
        let maxWidth, maxHeight;
        if (width === void 0 || height === void 0) {
          const container = canvas && _getParentNode(canvas);
          if (!container) {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
          } else {
            const rect = container.getBoundingClientRect();
            const containerStyle = getComputedStyle(container);
            const containerBorder = getPositionedStyle(containerStyle, "border", "width");
            const containerPadding = getPositionedStyle(containerStyle, "padding");
            width = rect.width - containerPadding.width - containerBorder.width;
            height = rect.height - containerPadding.height - containerBorder.height;
            maxWidth = parseMaxStyle(containerStyle.maxWidth, container, "clientWidth");
            maxHeight = parseMaxStyle(containerStyle.maxHeight, container, "clientHeight");
          }
        }
        return {
          width,
          height,
          maxWidth: maxWidth || INFINITY,
          maxHeight: maxHeight || INFINITY
        };
      }
      const round1 = (v) => Math.round(v * 10) / 10;
      function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
        const style = getComputedStyle(canvas);
        const margins = getPositionedStyle(style, "margin");
        const maxWidth = parseMaxStyle(style.maxWidth, canvas, "clientWidth") || INFINITY;
        const maxHeight = parseMaxStyle(style.maxHeight, canvas, "clientHeight") || INFINITY;
        const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
        let { width, height } = containerSize;
        if (style.boxSizing === "content-box") {
          const borders = getPositionedStyle(style, "border", "width");
          const paddings = getPositionedStyle(style, "padding");
          width -= paddings.width + borders.width;
          height -= paddings.height + borders.height;
        }
        width = Math.max(0, width - margins.width);
        height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
        width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
        height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
        if (width && !height) {
          height = round1(width / 2);
        }
        const maintainHeight = bbWidth !== void 0 || bbHeight !== void 0;
        if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
          height = containerSize.height;
          width = round1(Math.floor(height * aspectRatio));
        }
        return {
          width,
          height
        };
      }
      function retinaScale(chart, forceRatio, forceStyle) {
        const pixelRatio = forceRatio || 1;
        const deviceHeight = Math.floor(chart.height * pixelRatio);
        const deviceWidth = Math.floor(chart.width * pixelRatio);
        chart.height = Math.floor(chart.height);
        chart.width = Math.floor(chart.width);
        const canvas = chart.canvas;
        if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
          canvas.style.height = `${chart.height}px`;
          canvas.style.width = `${chart.width}px`;
        }
        if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
          chart.currentDevicePixelRatio = pixelRatio;
          canvas.height = deviceHeight;
          canvas.width = deviceWidth;
          chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          return true;
        }
        return false;
      }
      const supportsEventListenerOptions = function() {
        let passiveSupported = false;
        try {
          const options = {
            get passive() {
              passiveSupported = true;
              return false;
            }
          };
          if (_isDomSupported()) {
            window.addEventListener("test", null, options);
            window.removeEventListener("test", null, options);
          }
        } catch (e) {
        }
        return passiveSupported;
      }();
      function readUsedSize(element, property) {
        const value = getStyle(element, property);
        const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
        return matches ? +matches[1] : void 0;
      }
      const getRightToLeftAdapter = function(rectX, width) {
        return {
          x(x) {
            return rectX + rectX + width - x;
          },
          setWidth(w) {
            width = w;
          },
          textAlign(align) {
            if (align === "center") {
              return align;
            }
            return align === "right" ? "left" : "right";
          },
          xPlus(x, value) {
            return x - value;
          },
          leftForLtr(x, itemWidth) {
            return x - itemWidth;
          }
        };
      };
      const getLeftToRightAdapter = function() {
        return {
          x(x) {
            return x;
          },
          setWidth(w) {
          },
          textAlign(align) {
            return align;
          },
          xPlus(x, value) {
            return x + value;
          },
          leftForLtr(x, _itemWidth) {
            return x;
          }
        };
      };
      function getRtlAdapter(rtl, rectX, width) {
        return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
      }
      function overrideTextDirection(ctx, direction) {
        let style, original;
        if (direction === "ltr" || direction === "rtl") {
          style = ctx.canvas.style;
          original = [
            style.getPropertyValue("direction"),
            style.getPropertyPriority("direction")
          ];
          style.setProperty("direction", direction, "important");
          ctx.prevTextDirection = original;
        }
      }
      function restoreTextDirection(ctx, original) {
        if (original !== void 0) {
          delete ctx.prevTextDirection;
          ctx.canvas.style.setProperty("direction", original[0], original[1]);
        }
      }
      function getSizeForArea(scale, chartArea, field) {
        return scale.options.clip ? scale[field] : chartArea[field];
      }
      function getDatasetArea(meta, chartArea) {
        const { xScale, yScale } = meta;
        if (xScale && yScale) {
          return {
            left: getSizeForArea(xScale, chartArea, "left"),
            right: getSizeForArea(xScale, chartArea, "right"),
            top: getSizeForArea(yScale, chartArea, "top"),
            bottom: getSizeForArea(yScale, chartArea, "bottom")
          };
        }
        return chartArea;
      }
      function getDatasetClipArea(chart, meta) {
        const clip = meta._clip;
        if (clip.disabled) {
          return false;
        }
        const area = getDatasetArea(meta, chart.chartArea);
        return {
          left: clip.left === false ? 0 : area.left - (clip.left === true ? 0 : clip.left),
          right: clip.right === false ? chart.width : area.right + (clip.right === true ? 0 : clip.right),
          top: clip.top === false ? 0 : area.top - (clip.top === true ? 0 : clip.top),
          bottom: clip.bottom === false ? chart.height : area.bottom + (clip.bottom === true ? 0 : clip.bottom)
        };
      }
      /*!
       * Chart.js v4.5.0
       * https://www.chartjs.org
       * (c) 2025 Chart.js Contributors
       * Released under the MIT License
       */
      class Animator {
        constructor() {
          this._request = null;
          this._charts = /* @__PURE__ */ new Map();
          this._running = false;
          this._lastDate = void 0;
        }
        _notify(chart, anims, date, type) {
          const callbacks = anims.listeners[type];
          const numSteps = anims.duration;
          callbacks.forEach((fn) => fn({
            chart,
            initial: anims.initial,
            numSteps,
            currentStep: Math.min(date - anims.start, numSteps)
          }));
        }
        _refresh() {
          if (this._request) {
            return;
          }
          this._running = true;
          this._request = requestAnimFrame.call(window, () => {
            this._update();
            this._request = null;
            if (this._running) {
              this._refresh();
            }
          });
        }
        _update(date = Date.now()) {
          let remaining = 0;
          this._charts.forEach((anims, chart) => {
            if (!anims.running || !anims.items.length) {
              return;
            }
            const items = anims.items;
            let i = items.length - 1;
            let draw = false;
            let item;
            for (; i >= 0; --i) {
              item = items[i];
              if (item._active) {
                if (item._total > anims.duration) {
                  anims.duration = item._total;
                }
                item.tick(date);
                draw = true;
              } else {
                items[i] = items[items.length - 1];
                items.pop();
              }
            }
            if (draw) {
              chart.draw();
              this._notify(chart, anims, date, "progress");
            }
            if (!items.length) {
              anims.running = false;
              this._notify(chart, anims, date, "complete");
              anims.initial = false;
            }
            remaining += items.length;
          });
          this._lastDate = date;
          if (remaining === 0) {
            this._running = false;
          }
        }
        _getAnims(chart) {
          const charts = this._charts;
          let anims = charts.get(chart);
          if (!anims) {
            anims = {
              running: false,
              initial: true,
              items: [],
              listeners: {
                complete: [],
                progress: []
              }
            };
            charts.set(chart, anims);
          }
          return anims;
        }
        listen(chart, event, cb) {
          this._getAnims(chart).listeners[event].push(cb);
        }
        add(chart, items) {
          if (!items || !items.length) {
            return;
          }
          this._getAnims(chart).items.push(...items);
        }
        has(chart) {
          return this._getAnims(chart).items.length > 0;
        }
        start(chart) {
          const anims = this._charts.get(chart);
          if (!anims) {
            return;
          }
          anims.running = true;
          anims.start = Date.now();
          anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
          this._refresh();
        }
        running(chart) {
          if (!this._running) {
            return false;
          }
          const anims = this._charts.get(chart);
          if (!anims || !anims.running || !anims.items.length) {
            return false;
          }
          return true;
        }
        stop(chart) {
          const anims = this._charts.get(chart);
          if (!anims || !anims.items.length) {
            return;
          }
          const items = anims.items;
          let i = items.length - 1;
          for (; i >= 0; --i) {
            items[i].cancel();
          }
          anims.items = [];
          this._notify(chart, anims, Date.now(), "complete");
        }
        remove(chart) {
          return this._charts.delete(chart);
        }
      }
      var animator = /* @__PURE__ */ new Animator();
      const transparent = "transparent";
      const interpolators = {
        boolean(from2, to2, factor) {
          return factor > 0.5 ? to2 : from2;
        },
        color(from2, to2, factor) {
          const c0 = color(from2 || transparent);
          const c1 = c0.valid && color(to2 || transparent);
          return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to2;
        },
        number(from2, to2, factor) {
          return from2 + (to2 - from2) * factor;
        }
      };
      class Animation {
        constructor(cfg, target, prop, to2) {
          const currentValue = target[prop];
          to2 = resolve([
            cfg.to,
            to2,
            currentValue,
            cfg.from
          ]);
          const from2 = resolve([
            cfg.from,
            currentValue,
            to2
          ]);
          this._active = true;
          this._fn = cfg.fn || interpolators[cfg.type || typeof from2];
          this._easing = effects[cfg.easing] || effects.linear;
          this._start = Math.floor(Date.now() + (cfg.delay || 0));
          this._duration = this._total = Math.floor(cfg.duration);
          this._loop = !!cfg.loop;
          this._target = target;
          this._prop = prop;
          this._from = from2;
          this._to = to2;
          this._promises = void 0;
        }
        active() {
          return this._active;
        }
        update(cfg, to2, date) {
          if (this._active) {
            this._notify(false);
            const currentValue = this._target[this._prop];
            const elapsed = date - this._start;
            const remain = this._duration - elapsed;
            this._start = date;
            this._duration = Math.floor(Math.max(remain, cfg.duration));
            this._total += elapsed;
            this._loop = !!cfg.loop;
            this._to = resolve([
              cfg.to,
              to2,
              currentValue,
              cfg.from
            ]);
            this._from = resolve([
              cfg.from,
              currentValue,
              to2
            ]);
          }
        }
        cancel() {
          if (this._active) {
            this.tick(Date.now());
            this._active = false;
            this._notify(false);
          }
        }
        tick(date) {
          const elapsed = date - this._start;
          const duration = this._duration;
          const prop = this._prop;
          const from2 = this._from;
          const loop = this._loop;
          const to2 = this._to;
          let factor;
          this._active = from2 !== to2 && (loop || elapsed < duration);
          if (!this._active) {
            this._target[prop] = to2;
            this._notify(true);
            return;
          }
          if (elapsed < 0) {
            this._target[prop] = from2;
            return;
          }
          factor = elapsed / duration % 2;
          factor = loop && factor > 1 ? 2 - factor : factor;
          factor = this._easing(Math.min(1, Math.max(0, factor)));
          this._target[prop] = this._fn(from2, to2, factor);
        }
        wait() {
          const promises = this._promises || (this._promises = []);
          return new Promise((res, rej) => {
            promises.push({
              res,
              rej
            });
          });
        }
        _notify(resolved) {
          const method = resolved ? "res" : "rej";
          const promises = this._promises || [];
          for (let i = 0; i < promises.length; i++) {
            promises[i][method]();
          }
        }
      }
      class Animations {
        constructor(chart, config) {
          this._chart = chart;
          this._properties = /* @__PURE__ */ new Map();
          this.configure(config);
        }
        configure(config) {
          if (!isObject(config)) {
            return;
          }
          const animationOptions = Object.keys(defaults.animation);
          const animatedProps = this._properties;
          Object.getOwnPropertyNames(config).forEach((key) => {
            const cfg = config[key];
            if (!isObject(cfg)) {
              return;
            }
            const resolved = {};
            for (const option of animationOptions) {
              resolved[option] = cfg[option];
            }
            (isArray(cfg.properties) && cfg.properties || [
              key
            ]).forEach((prop) => {
              if (prop === key || !animatedProps.has(prop)) {
                animatedProps.set(prop, resolved);
              }
            });
          });
        }
        _animateOptions(target, values) {
          const newOptions = values.options;
          const options = resolveTargetOptions(target, newOptions);
          if (!options) {
            return [];
          }
          const animations = this._createAnimations(options, newOptions);
          if (newOptions.$shared) {
            awaitAll(target.options.$animations, newOptions).then(() => {
              target.options = newOptions;
            }, () => {
            });
          }
          return animations;
        }
        _createAnimations(target, values) {
          const animatedProps = this._properties;
          const animations = [];
          const running = target.$animations || (target.$animations = {});
          const props = Object.keys(values);
          const date = Date.now();
          let i;
          for (i = props.length - 1; i >= 0; --i) {
            const prop = props[i];
            if (prop.charAt(0) === "$") {
              continue;
            }
            if (prop === "options") {
              animations.push(...this._animateOptions(target, values));
              continue;
            }
            const value = values[prop];
            let animation = running[prop];
            const cfg = animatedProps.get(prop);
            if (animation) {
              if (cfg && animation.active()) {
                animation.update(cfg, value, date);
                continue;
              } else {
                animation.cancel();
              }
            }
            if (!cfg || !cfg.duration) {
              target[prop] = value;
              continue;
            }
            running[prop] = animation = new Animation(cfg, target, prop, value);
            animations.push(animation);
          }
          return animations;
        }
        update(target, values) {
          if (this._properties.size === 0) {
            Object.assign(target, values);
            return;
          }
          const animations = this._createAnimations(target, values);
          if (animations.length) {
            animator.add(this._chart, animations);
            return true;
          }
        }
      }
      function awaitAll(animations, properties) {
        const running = [];
        const keys = Object.keys(properties);
        for (let i = 0; i < keys.length; i++) {
          const anim = animations[keys[i]];
          if (anim && anim.active()) {
            running.push(anim.wait());
          }
        }
        return Promise.all(running);
      }
      function resolveTargetOptions(target, newOptions) {
        if (!newOptions) {
          return;
        }
        let options = target.options;
        if (!options) {
          target.options = newOptions;
          return;
        }
        if (options.$shared) {
          target.options = options = Object.assign({}, options, {
            $shared: false,
            $animations: {}
          });
        }
        return options;
      }
      function scaleClip(scale, allowedOverflow) {
        const opts = scale && scale.options || {};
        const reverse = opts.reverse;
        const min = opts.min === void 0 ? allowedOverflow : 0;
        const max = opts.max === void 0 ? allowedOverflow : 0;
        return {
          start: reverse ? max : min,
          end: reverse ? min : max
        };
      }
      function defaultClip(xScale, yScale, allowedOverflow) {
        if (allowedOverflow === false) {
          return false;
        }
        const x = scaleClip(xScale, allowedOverflow);
        const y = scaleClip(yScale, allowedOverflow);
        return {
          top: y.end,
          right: x.end,
          bottom: y.start,
          left: x.start
        };
      }
      function toClip(value) {
        let t, r, b, l;
        if (isObject(value)) {
          t = value.top;
          r = value.right;
          b = value.bottom;
          l = value.left;
        } else {
          t = r = b = l = value;
        }
        return {
          top: t,
          right: r,
          bottom: b,
          left: l,
          disabled: value === false
        };
      }
      function getSortedDatasetIndices(chart, filterVisible) {
        const keys = [];
        const metasets = chart._getSortedDatasetMetas(filterVisible);
        let i, ilen;
        for (i = 0, ilen = metasets.length; i < ilen; ++i) {
          keys.push(metasets[i].index);
        }
        return keys;
      }
      function applyStack(stack, value, dsIndex, options = {}) {
        const keys = stack.keys;
        const singleMode = options.mode === "single";
        let i, ilen, datasetIndex, otherValue;
        if (value === null) {
          return;
        }
        let found = false;
        for (i = 0, ilen = keys.length; i < ilen; ++i) {
          datasetIndex = +keys[i];
          if (datasetIndex === dsIndex) {
            found = true;
            if (options.all) {
              continue;
            }
            break;
          }
          otherValue = stack.values[datasetIndex];
          if (isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
            value += otherValue;
          }
        }
        if (!found && !options.all) {
          return 0;
        }
        return value;
      }
      function convertObjectDataToArray(data, meta) {
        const { iScale, vScale } = meta;
        const iAxisKey = iScale.axis === "x" ? "x" : "y";
        const vAxisKey = vScale.axis === "x" ? "x" : "y";
        const keys = Object.keys(data);
        const adata = new Array(keys.length);
        let i, ilen, key;
        for (i = 0, ilen = keys.length; i < ilen; ++i) {
          key = keys[i];
          adata[i] = {
            [iAxisKey]: key,
            [vAxisKey]: data[key]
          };
        }
        return adata;
      }
      function isStacked(scale, meta) {
        const stacked = scale && scale.options.stacked;
        return stacked || stacked === void 0 && meta.stack !== void 0;
      }
      function getStackKey(indexScale, valueScale, meta) {
        return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
      }
      function getUserBounds(scale) {
        const { min, max, minDefined, maxDefined } = scale.getUserBounds();
        return {
          min: minDefined ? min : Number.NEGATIVE_INFINITY,
          max: maxDefined ? max : Number.POSITIVE_INFINITY
        };
      }
      function getOrCreateStack(stacks, stackKey, indexValue) {
        const subStack = stacks[stackKey] || (stacks[stackKey] = {});
        return subStack[indexValue] || (subStack[indexValue] = {});
      }
      function getLastIndexInStack(stack, vScale, positive, type) {
        for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
          const value = stack[meta.index];
          if (positive && value > 0 || !positive && value < 0) {
            return meta.index;
          }
        }
        return null;
      }
      function updateStacks(controller, parsed) {
        const { chart, _cachedMeta: meta } = controller;
        const stacks = chart._stacks || (chart._stacks = {});
        const { iScale, vScale, index: datasetIndex } = meta;
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const key = getStackKey(iScale, vScale, meta);
        const ilen = parsed.length;
        let stack;
        for (let i = 0; i < ilen; ++i) {
          const item = parsed[i];
          const { [iAxis]: index, [vAxis]: value } = item;
          const itemStacks = item._stacks || (item._stacks = {});
          stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
          stack[datasetIndex] = value;
          stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
          stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
          const visualValues = stack._visualValues || (stack._visualValues = {});
          visualValues[datasetIndex] = value;
        }
      }
      function getFirstScaleId(chart, axis) {
        const scales = chart.scales;
        return Object.keys(scales).filter((key) => scales[key].axis === axis).shift();
      }
      function createDatasetContext(parent, index) {
        return createContext(parent, {
          active: false,
          dataset: void 0,
          datasetIndex: index,
          index,
          mode: "default",
          type: "dataset"
        });
      }
      function createDataContext(parent, index, element) {
        return createContext(parent, {
          active: false,
          dataIndex: index,
          parsed: void 0,
          raw: void 0,
          element,
          index,
          mode: "default",
          type: "data"
        });
      }
      function clearStacks(meta, items) {
        const datasetIndex = meta.controller.index;
        const axis = meta.vScale && meta.vScale.axis;
        if (!axis) {
          return;
        }
        items = items || meta._parsed;
        for (const parsed of items) {
          const stacks = parsed._stacks;
          if (!stacks || stacks[axis] === void 0 || stacks[axis][datasetIndex] === void 0) {
            return;
          }
          delete stacks[axis][datasetIndex];
          if (stacks[axis]._visualValues !== void 0 && stacks[axis]._visualValues[datasetIndex] !== void 0) {
            delete stacks[axis]._visualValues[datasetIndex];
          }
        }
      }
      const isDirectUpdateMode = (mode) => mode === "reset" || mode === "none";
      const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
      const createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && {
        keys: getSortedDatasetIndices(chart, true),
        values: null
      };
      class DatasetController {
        constructor(chart, datasetIndex) {
          this.chart = chart;
          this._ctx = chart.ctx;
          this.index = datasetIndex;
          this._cachedDataOpts = {};
          this._cachedMeta = this.getMeta();
          this._type = this._cachedMeta.type;
          this.options = void 0;
          this._parsing = false;
          this._data = void 0;
          this._objectData = void 0;
          this._sharedOptions = void 0;
          this._drawStart = void 0;
          this._drawCount = void 0;
          this.enableOptionSharing = false;
          this.supportsDecimation = false;
          this.$context = void 0;
          this._syncList = [];
          this.datasetElementType = new.target.datasetElementType;
          this.dataElementType = new.target.dataElementType;
          this.initialize();
        }
        initialize() {
          const meta = this._cachedMeta;
          this.configure();
          this.linkScales();
          meta._stacked = isStacked(meta.vScale, meta);
          this.addElements();
          if (this.options.fill && !this.chart.isPluginEnabled("filler")) {
            console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
          }
        }
        updateIndex(datasetIndex) {
          if (this.index !== datasetIndex) {
            clearStacks(this._cachedMeta);
          }
          this.index = datasetIndex;
        }
        linkScales() {
          const chart = this.chart;
          const meta = this._cachedMeta;
          const dataset = this.getDataset();
          const chooseId = (axis, x, y, r) => axis === "x" ? x : axis === "r" ? r : y;
          const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, "x"));
          const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, "y"));
          const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, "r"));
          const indexAxis = meta.indexAxis;
          const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
          const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
          meta.xScale = this.getScaleForId(xid);
          meta.yScale = this.getScaleForId(yid);
          meta.rScale = this.getScaleForId(rid);
          meta.iScale = this.getScaleForId(iid);
          meta.vScale = this.getScaleForId(vid);
        }
        getDataset() {
          return this.chart.data.datasets[this.index];
        }
        getMeta() {
          return this.chart.getDatasetMeta(this.index);
        }
        getScaleForId(scaleID) {
          return this.chart.scales[scaleID];
        }
        _getOtherScale(scale) {
          const meta = this._cachedMeta;
          return scale === meta.iScale ? meta.vScale : meta.iScale;
        }
        reset() {
          this._update("reset");
        }
        _destroy() {
          const meta = this._cachedMeta;
          if (this._data) {
            unlistenArrayEvents(this._data, this);
          }
          if (meta._stacked) {
            clearStacks(meta);
          }
        }
        _dataCheck() {
          const dataset = this.getDataset();
          const data = dataset.data || (dataset.data = []);
          const _data = this._data;
          if (isObject(data)) {
            const meta = this._cachedMeta;
            this._data = convertObjectDataToArray(data, meta);
          } else if (_data !== data) {
            if (_data) {
              unlistenArrayEvents(_data, this);
              const meta = this._cachedMeta;
              clearStacks(meta);
              meta._parsed = [];
            }
            if (data && Object.isExtensible(data)) {
              listenArrayEvents(data, this);
            }
            this._syncList = [];
            this._data = data;
          }
        }
        addElements() {
          const meta = this._cachedMeta;
          this._dataCheck();
          if (this.datasetElementType) {
            meta.dataset = new this.datasetElementType();
          }
        }
        buildOrUpdateElements(resetNewElements) {
          const meta = this._cachedMeta;
          const dataset = this.getDataset();
          let stackChanged = false;
          this._dataCheck();
          const oldStacked = meta._stacked;
          meta._stacked = isStacked(meta.vScale, meta);
          if (meta.stack !== dataset.stack) {
            stackChanged = true;
            clearStacks(meta);
            meta.stack = dataset.stack;
          }
          this._resyncElements(resetNewElements);
          if (stackChanged || oldStacked !== meta._stacked) {
            updateStacks(this, meta._parsed);
            meta._stacked = isStacked(meta.vScale, meta);
          }
        }
        configure() {
          const config = this.chart.config;
          const scopeKeys = config.datasetScopeKeys(this._type);
          const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
          this.options = config.createResolver(scopes, this.getContext());
          this._parsing = this.options.parsing;
          this._cachedDataOpts = {};
        }
        parse(start, count) {
          const { _cachedMeta: meta, _data: data } = this;
          const { iScale, _stacked } = meta;
          const iAxis = iScale.axis;
          let sorted = start === 0 && count === data.length ? true : meta._sorted;
          let prev = start > 0 && meta._parsed[start - 1];
          let i, cur, parsed;
          if (this._parsing === false) {
            meta._parsed = data;
            meta._sorted = true;
            parsed = data;
          } else {
            if (isArray(data[start])) {
              parsed = this.parseArrayData(meta, data, start, count);
            } else if (isObject(data[start])) {
              parsed = this.parseObjectData(meta, data, start, count);
            } else {
              parsed = this.parsePrimitiveData(meta, data, start, count);
            }
            const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
            for (i = 0; i < count; ++i) {
              meta._parsed[i + start] = cur = parsed[i];
              if (sorted) {
                if (isNotInOrderComparedToPrev()) {
                  sorted = false;
                }
                prev = cur;
              }
            }
            meta._sorted = sorted;
          }
          if (_stacked) {
            updateStacks(this, parsed);
          }
        }
        parsePrimitiveData(meta, data, start, count) {
          const { iScale, vScale } = meta;
          const iAxis = iScale.axis;
          const vAxis = vScale.axis;
          const labels = iScale.getLabels();
          const singleScale = iScale === vScale;
          const parsed = new Array(count);
          let i, ilen, index;
          for (i = 0, ilen = count; i < ilen; ++i) {
            index = i + start;
            parsed[i] = {
              [iAxis]: singleScale || iScale.parse(labels[index], index),
              [vAxis]: vScale.parse(data[index], index)
            };
          }
          return parsed;
        }
        parseArrayData(meta, data, start, count) {
          const { xScale, yScale } = meta;
          const parsed = new Array(count);
          let i, ilen, index, item;
          for (i = 0, ilen = count; i < ilen; ++i) {
            index = i + start;
            item = data[index];
            parsed[i] = {
              x: xScale.parse(item[0], index),
              y: yScale.parse(item[1], index)
            };
          }
          return parsed;
        }
        parseObjectData(meta, data, start, count) {
          const { xScale, yScale } = meta;
          const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
          const parsed = new Array(count);
          let i, ilen, index, item;
          for (i = 0, ilen = count; i < ilen; ++i) {
            index = i + start;
            item = data[index];
            parsed[i] = {
              x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
              y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
            };
          }
          return parsed;
        }
        getParsed(index) {
          return this._cachedMeta._parsed[index];
        }
        getDataElement(index) {
          return this._cachedMeta.data[index];
        }
        applyStack(scale, parsed, mode) {
          const chart = this.chart;
          const meta = this._cachedMeta;
          const value = parsed[scale.axis];
          const stack = {
            keys: getSortedDatasetIndices(chart, true),
            values: parsed._stacks[scale.axis]._visualValues
          };
          return applyStack(stack, value, meta.index, {
            mode
          });
        }
        updateRangeFromParsed(range, scale, parsed, stack) {
          const parsedValue = parsed[scale.axis];
          let value = parsedValue === null ? NaN : parsedValue;
          const values = stack && parsed._stacks[scale.axis];
          if (stack && values) {
            stack.values = values;
            value = applyStack(stack, parsedValue, this._cachedMeta.index);
          }
          range.min = Math.min(range.min, value);
          range.max = Math.max(range.max, value);
        }
        getMinMax(scale, canStack) {
          const meta = this._cachedMeta;
          const _parsed = meta._parsed;
          const sorted = meta._sorted && scale === meta.iScale;
          const ilen = _parsed.length;
          const otherScale = this._getOtherScale(scale);
          const stack = createStack(canStack, meta, this.chart);
          const range = {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY
          };
          const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
          let i, parsed;
          function _skip() {
            parsed = _parsed[i];
            const otherValue = parsed[otherScale.axis];
            return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
          }
          for (i = 0; i < ilen; ++i) {
            if (_skip()) {
              continue;
            }
            this.updateRangeFromParsed(range, scale, parsed, stack);
            if (sorted) {
              break;
            }
          }
          if (sorted) {
            for (i = ilen - 1; i >= 0; --i) {
              if (_skip()) {
                continue;
              }
              this.updateRangeFromParsed(range, scale, parsed, stack);
              break;
            }
          }
          return range;
        }
        getAllParsedValues(scale) {
          const parsed = this._cachedMeta._parsed;
          const values = [];
          let i, ilen, value;
          for (i = 0, ilen = parsed.length; i < ilen; ++i) {
            value = parsed[i][scale.axis];
            if (isNumberFinite(value)) {
              values.push(value);
            }
          }
          return values;
        }
        getMaxOverflow() {
          return false;
        }
        getLabelAndValue(index) {
          const meta = this._cachedMeta;
          const iScale = meta.iScale;
          const vScale = meta.vScale;
          const parsed = this.getParsed(index);
          return {
            label: iScale ? "" + iScale.getLabelForValue(parsed[iScale.axis]) : "",
            value: vScale ? "" + vScale.getLabelForValue(parsed[vScale.axis]) : ""
          };
        }
        _update(mode) {
          const meta = this._cachedMeta;
          this.update(mode || "default");
          meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
        }
        update(mode) {
        }
        draw() {
          const ctx = this._ctx;
          const chart = this.chart;
          const meta = this._cachedMeta;
          const elements = meta.data || [];
          const area = chart.chartArea;
          const active = [];
          const start = this._drawStart || 0;
          const count = this._drawCount || elements.length - start;
          const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
          let i;
          if (meta.dataset) {
            meta.dataset.draw(ctx, area, start, count);
          }
          for (i = start; i < start + count; ++i) {
            const element = elements[i];
            if (element.hidden) {
              continue;
            }
            if (element.active && drawActiveElementsOnTop) {
              active.push(element);
            } else {
              element.draw(ctx, area);
            }
          }
          for (i = 0; i < active.length; ++i) {
            active[i].draw(ctx, area);
          }
        }
        getStyle(index, active) {
          const mode = active ? "active" : "default";
          return index === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
        }
        getContext(index, active, mode) {
          const dataset = this.getDataset();
          let context;
          if (index >= 0 && index < this._cachedMeta.data.length) {
            const element = this._cachedMeta.data[index];
            context = element.$context || (element.$context = createDataContext(this.getContext(), index, element));
            context.parsed = this.getParsed(index);
            context.raw = dataset.data[index];
            context.index = context.dataIndex = index;
          } else {
            context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
            context.dataset = dataset;
            context.index = context.datasetIndex = this.index;
          }
          context.active = !!active;
          context.mode = mode;
          return context;
        }
        resolveDatasetElementOptions(mode) {
          return this._resolveElementOptions(this.datasetElementType.id, mode);
        }
        resolveDataElementOptions(index, mode) {
          return this._resolveElementOptions(this.dataElementType.id, mode, index);
        }
        _resolveElementOptions(elementType, mode = "default", index) {
          const active = mode === "active";
          const cache = this._cachedDataOpts;
          const cacheKey = elementType + "-" + mode;
          const cached = cache[cacheKey];
          const sharing = this.enableOptionSharing && defined(index);
          if (cached) {
            return cloneIfNotShared(cached, sharing);
          }
          const config = this.chart.config;
          const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
          const prefixes = active ? [
            `${elementType}Hover`,
            "hover",
            elementType,
            ""
          ] : [
            elementType,
            ""
          ];
          const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
          const names2 = Object.keys(defaults.elements[elementType]);
          const context = () => this.getContext(index, active, mode);
          const values = config.resolveNamedOptions(scopes, names2, context, prefixes);
          if (values.$shared) {
            values.$shared = sharing;
            cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
          }
          return values;
        }
        _resolveAnimations(index, transition, active) {
          const chart = this.chart;
          const cache = this._cachedDataOpts;
          const cacheKey = `animation-${transition}`;
          const cached = cache[cacheKey];
          if (cached) {
            return cached;
          }
          let options;
          if (chart.options.animation !== false) {
            const config = this.chart.config;
            const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
            options = config.createResolver(scopes, this.getContext(index, active, transition));
          }
          const animations = new Animations(chart, options && options.animations);
          if (options && options._cacheable) {
            cache[cacheKey] = Object.freeze(animations);
          }
          return animations;
        }
        getSharedOptions(options) {
          if (!options.$shared) {
            return;
          }
          return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
        }
        includeOptions(mode, sharedOptions) {
          return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
        }
        _getSharedOptions(start, mode) {
          const firstOpts = this.resolveDataElementOptions(start, mode);
          const previouslySharedOptions = this._sharedOptions;
          const sharedOptions = this.getSharedOptions(firstOpts);
          const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
          this.updateSharedOptions(sharedOptions, mode, firstOpts);
          return {
            sharedOptions,
            includeOptions
          };
        }
        updateElement(element, index, properties, mode) {
          if (isDirectUpdateMode(mode)) {
            Object.assign(element, properties);
          } else {
            this._resolveAnimations(index, mode).update(element, properties);
          }
        }
        updateSharedOptions(sharedOptions, mode, newOptions) {
          if (sharedOptions && !isDirectUpdateMode(mode)) {
            this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
          }
        }
        _setStyle(element, index, mode, active) {
          element.active = active;
          const options = this.getStyle(index, active);
          this._resolveAnimations(index, mode, active).update(element, {
            options: !active && this.getSharedOptions(options) || options
          });
        }
        removeHoverStyle(element, datasetIndex, index) {
          this._setStyle(element, index, "active", false);
        }
        setHoverStyle(element, datasetIndex, index) {
          this._setStyle(element, index, "active", true);
        }
        _removeDatasetHoverStyle() {
          const element = this._cachedMeta.dataset;
          if (element) {
            this._setStyle(element, void 0, "active", false);
          }
        }
        _setDatasetHoverStyle() {
          const element = this._cachedMeta.dataset;
          if (element) {
            this._setStyle(element, void 0, "active", true);
          }
        }
        _resyncElements(resetNewElements) {
          const data = this._data;
          const elements = this._cachedMeta.data;
          for (const [method, arg1, arg2] of this._syncList) {
            this[method](arg1, arg2);
          }
          this._syncList = [];
          const numMeta = elements.length;
          const numData = data.length;
          const count = Math.min(numData, numMeta);
          if (count) {
            this.parse(0, count);
          }
          if (numData > numMeta) {
            this._insertElements(numMeta, numData - numMeta, resetNewElements);
          } else if (numData < numMeta) {
            this._removeElements(numData, numMeta - numData);
          }
        }
        _insertElements(start, count, resetNewElements = true) {
          const meta = this._cachedMeta;
          const data = meta.data;
          const end = start + count;
          let i;
          const move = (arr) => {
            arr.length += count;
            for (i = arr.length - 1; i >= end; i--) {
              arr[i] = arr[i - count];
            }
          };
          move(data);
          for (i = start; i < end; ++i) {
            data[i] = new this.dataElementType();
          }
          if (this._parsing) {
            move(meta._parsed);
          }
          this.parse(start, count);
          if (resetNewElements) {
            this.updateElements(data, start, count, "reset");
          }
        }
        updateElements(element, start, count, mode) {
        }
        _removeElements(start, count) {
          const meta = this._cachedMeta;
          if (this._parsing) {
            const removed = meta._parsed.splice(start, count);
            if (meta._stacked) {
              clearStacks(meta, removed);
            }
          }
          meta.data.splice(start, count);
        }
        _sync(args) {
          if (this._parsing) {
            this._syncList.push(args);
          } else {
            const [method, arg1, arg2] = args;
            this[method](arg1, arg2);
          }
          this.chart._dataChanges.push([
            this.index,
            ...args
          ]);
        }
        _onDataPush() {
          const count = arguments.length;
          this._sync([
            "_insertElements",
            this.getDataset().data.length - count,
            count
          ]);
        }
        _onDataPop() {
          this._sync([
            "_removeElements",
            this._cachedMeta.data.length - 1,
            1
          ]);
        }
        _onDataShift() {
          this._sync([
            "_removeElements",
            0,
            1
          ]);
        }
        _onDataSplice(start, count) {
          if (count) {
            this._sync([
              "_removeElements",
              start,
              count
            ]);
          }
          const newCount = arguments.length - 2;
          if (newCount) {
            this._sync([
              "_insertElements",
              start,
              newCount
            ]);
          }
        }
        _onDataUnshift() {
          this._sync([
            "_insertElements",
            0,
            arguments.length
          ]);
        }
      }
      __publicField(DatasetController, "defaults", {});
      __publicField(DatasetController, "datasetElementType", null);
      __publicField(DatasetController, "dataElementType", null);
      function getRatioAndOffset(rotation, circumference, cutout) {
        let ratioX = 1;
        let ratioY = 1;
        let offsetX = 0;
        let offsetY = 0;
        if (circumference < TAU) {
          const startAngle = rotation;
          const endAngle = startAngle + circumference;
          const startX = Math.cos(startAngle);
          const startY = Math.sin(startAngle);
          const endX = Math.cos(endAngle);
          const endY = Math.sin(endAngle);
          const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
          const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
          const maxX = calcMax(0, startX, endX);
          const maxY = calcMax(HALF_PI, startY, endY);
          const minX = calcMin(PI, startX, endX);
          const minY = calcMin(PI + HALF_PI, startY, endY);
          ratioX = (maxX - minX) / 2;
          ratioY = (maxY - minY) / 2;
          offsetX = -(maxX + minX) / 2;
          offsetY = -(maxY + minY) / 2;
        }
        return {
          ratioX,
          ratioY,
          offsetX,
          offsetY
        };
      }
      class DoughnutController extends DatasetController {
        constructor(chart, datasetIndex) {
          super(chart, datasetIndex);
          this.enableOptionSharing = true;
          this.innerRadius = void 0;
          this.outerRadius = void 0;
          this.offsetX = void 0;
          this.offsetY = void 0;
        }
        linkScales() {
        }
        parse(start, count) {
          const data = this.getDataset().data;
          const meta = this._cachedMeta;
          if (this._parsing === false) {
            meta._parsed = data;
          } else {
            let getter = (i2) => +data[i2];
            if (isObject(data[start])) {
              const { key = "value" } = this._parsing;
              getter = (i2) => +resolveObjectKey(data[i2], key);
            }
            let i, ilen;
            for (i = start, ilen = start + count; i < ilen; ++i) {
              meta._parsed[i] = getter(i);
            }
          }
        }
        _getRotation() {
          return toRadians(this.options.rotation - 90);
        }
        _getCircumference() {
          return toRadians(this.options.circumference);
        }
        _getRotationExtents() {
          let min = TAU;
          let max = -TAU;
          for (let i = 0; i < this.chart.data.datasets.length; ++i) {
            if (this.chart.isDatasetVisible(i) && this.chart.getDatasetMeta(i).type === this._type) {
              const controller = this.chart.getDatasetMeta(i).controller;
              const rotation = controller._getRotation();
              const circumference = controller._getCircumference();
              min = Math.min(min, rotation);
              max = Math.max(max, rotation + circumference);
            }
          }
          return {
            rotation: min,
            circumference: max - min
          };
        }
        update(mode) {
          const chart = this.chart;
          const { chartArea } = chart;
          const meta = this._cachedMeta;
          const arcs = meta.data;
          const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
          const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
          const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
          const chartWeight = this._getRingWeight(this.index);
          const { circumference, rotation } = this._getRotationExtents();
          const { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(rotation, circumference, cutout);
          const maxWidth = (chartArea.width - spacing) / ratioX;
          const maxHeight = (chartArea.height - spacing) / ratioY;
          const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
          const outerRadius = toDimension(this.options.radius, maxRadius);
          const innerRadius = Math.max(outerRadius * cutout, 0);
          const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
          this.offsetX = offsetX * outerRadius;
          this.offsetY = offsetY * outerRadius;
          meta.total = this.calculateTotal();
          this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
          this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
          this.updateElements(arcs, 0, arcs.length, mode);
        }
        _circumference(i, reset) {
          const opts = this.options;
          const meta = this._cachedMeta;
          const circumference = this._getCircumference();
          if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
            return 0;
          }
          return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
        }
        updateElements(arcs, start, count, mode) {
          const reset = mode === "reset";
          const chart = this.chart;
          const chartArea = chart.chartArea;
          const opts = chart.options;
          const animationOpts = opts.animation;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;
          const animateScale = reset && animationOpts.animateScale;
          const innerRadius = animateScale ? 0 : this.innerRadius;
          const outerRadius = animateScale ? 0 : this.outerRadius;
          const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
          let startAngle = this._getRotation();
          let i;
          for (i = 0; i < start; ++i) {
            startAngle += this._circumference(i, reset);
          }
          for (i = start; i < start + count; ++i) {
            const circumference = this._circumference(i, reset);
            const arc = arcs[i];
            const properties = {
              x: centerX + this.offsetX,
              y: centerY + this.offsetY,
              startAngle,
              endAngle: startAngle + circumference,
              circumference,
              outerRadius,
              innerRadius
            };
            if (includeOptions) {
              properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? "active" : mode);
            }
            startAngle += circumference;
            this.updateElement(arc, i, properties, mode);
          }
        }
        calculateTotal() {
          const meta = this._cachedMeta;
          const metaData = meta.data;
          let total = 0;
          let i;
          for (i = 0; i < metaData.length; i++) {
            const value = meta._parsed[i];
            if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
              total += Math.abs(value);
            }
          }
          return total;
        }
        calculateCircumference(value) {
          const total = this._cachedMeta.total;
          if (total > 0 && !isNaN(value)) {
            return TAU * (Math.abs(value) / total);
          }
          return 0;
        }
        getLabelAndValue(index) {
          const meta = this._cachedMeta;
          const chart = this.chart;
          const labels = chart.data.labels || [];
          const value = formatNumber(meta._parsed[index], chart.options.locale);
          return {
            label: labels[index] || "",
            value
          };
        }
        getMaxBorderWidth(arcs) {
          let max = 0;
          const chart = this.chart;
          let i, ilen, meta, controller, options;
          if (!arcs) {
            for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
              if (chart.isDatasetVisible(i)) {
                meta = chart.getDatasetMeta(i);
                arcs = meta.data;
                controller = meta.controller;
                break;
              }
            }
          }
          if (!arcs) {
            return 0;
          }
          for (i = 0, ilen = arcs.length; i < ilen; ++i) {
            options = controller.resolveDataElementOptions(i);
            if (options.borderAlign !== "inner") {
              max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
            }
          }
          return max;
        }
        getMaxOffset(arcs) {
          let max = 0;
          for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
            const options = this.resolveDataElementOptions(i);
            max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
          }
          return max;
        }
        _getRingWeightOffset(datasetIndex) {
          let ringWeightOffset = 0;
          for (let i = 0; i < datasetIndex; ++i) {
            if (this.chart.isDatasetVisible(i)) {
              ringWeightOffset += this._getRingWeight(i);
            }
          }
          return ringWeightOffset;
        }
        _getRingWeight(datasetIndex) {
          return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
        }
        _getVisibleDatasetWeightTotal() {
          return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
        }
      }
      __publicField(DoughnutController, "id", "doughnut");
      __publicField(DoughnutController, "defaults", {
        datasetElementType: false,
        dataElementType: "arc",
        animation: {
          animateRotate: true,
          animateScale: false
        },
        animations: {
          numbers: {
            type: "number",
            properties: [
              "circumference",
              "endAngle",
              "innerRadius",
              "outerRadius",
              "startAngle",
              "x",
              "y",
              "offset",
              "borderWidth",
              "spacing"
            ]
          }
        },
        cutout: "50%",
        rotation: 0,
        circumference: 360,
        radius: "100%",
        spacing: 0,
        indexAxis: "r"
      });
      __publicField(DoughnutController, "descriptors", {
        _scriptable: (name) => name !== "spacing",
        _indexable: (name) => name !== "spacing" && !name.startsWith("borderDash") && !name.startsWith("hoverBorderDash")
      });
      __publicField(DoughnutController, "overrides", {
        aspectRatio: 1,
        plugins: {
          legend: {
            labels: {
              generateLabels(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  const { labels: { pointStyle, color: color2 } } = chart.legend.options;
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i);
                    return {
                      text: label,
                      fillStyle: style.backgroundColor,
                      strokeStyle: style.borderColor,
                      fontColor: color2,
                      lineWidth: style.borderWidth,
                      pointStyle,
                      hidden: !chart.getDataVisibility(i),
                      index: i
                    };
                  });
                }
                return [];
              }
            },
            onClick(e, legendItem, legend) {
              legend.chart.toggleDataVisibility(legendItem.index);
              legend.chart.update();
            }
          }
        }
      });
      function abstract() {
        throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
      }
      class DateAdapterBase {
        constructor(options) {
          __publicField(this, "options");
          this.options = options || {};
        }
        /**
        * Override default date adapter methods.
        * Accepts type parameter to define options type.
        * @example
        * Chart._adapters._date.override<{myAdapterOption: string}>({
        *   init() {
        *     console.log(this.options.myAdapterOption);
        *   }
        * })
        */
        static override(members) {
          Object.assign(DateAdapterBase.prototype, members);
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        init() {
        }
        formats() {
          return abstract();
        }
        parse() {
          return abstract();
        }
        format() {
          return abstract();
        }
        add() {
          return abstract();
        }
        diff() {
          return abstract();
        }
        startOf() {
          return abstract();
        }
        endOf() {
          return abstract();
        }
      }
      var adapters = {
        _date: DateAdapterBase
      };
      function binarySearch(metaset, axis, value, intersect) {
        const { controller, data, _sorted } = metaset;
        const iScale = controller._cachedMeta.iScale;
        const spanGaps = metaset.dataset ? metaset.dataset.options ? metaset.dataset.options.spanGaps : null : null;
        if (iScale && axis === iScale.axis && axis !== "r" && _sorted && data.length) {
          const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
          if (!intersect) {
            const result = lookupMethod(data, axis, value);
            if (spanGaps) {
              const { vScale } = controller._cachedMeta;
              const { _parsed } = metaset;
              const distanceToDefinedLo = _parsed.slice(0, result.lo + 1).reverse().findIndex((point) => !isNullOrUndef(point[vScale.axis]));
              result.lo -= Math.max(0, distanceToDefinedLo);
              const distanceToDefinedHi = _parsed.slice(result.hi).findIndex((point) => !isNullOrUndef(point[vScale.axis]));
              result.hi += Math.max(0, distanceToDefinedHi);
            }
            return result;
          } else if (controller._sharedOptions) {
            const el = data[0];
            const range = typeof el.getRange === "function" && el.getRange(axis);
            if (range) {
              const start = lookupMethod(data, axis, value - range);
              const end = lookupMethod(data, axis, value + range);
              return {
                lo: start.lo,
                hi: end.hi
              };
            }
          }
        }
        return {
          lo: 0,
          hi: data.length - 1
        };
      }
      function evaluateInteractionItems(chart, axis, position, handler, intersect) {
        const metasets = chart.getSortedVisibleDatasetMetas();
        const value = position[axis];
        for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
          const { index, data } = metasets[i];
          const { lo, hi } = binarySearch(metasets[i], axis, value, intersect);
          for (let j = lo; j <= hi; ++j) {
            const element = data[j];
            if (!element.skip) {
              handler(element, index, j);
            }
          }
        }
      }
      function getDistanceMetricForAxis(axis) {
        const useX = axis.indexOf("x") !== -1;
        const useY = axis.indexOf("y") !== -1;
        return function(pt1, pt2) {
          const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
          const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
          return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        };
      }
      function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
        const items = [];
        if (!includeInvisible && !chart.isPointInArea(position)) {
          return items;
        }
        const evaluationFunc = function(element, datasetIndex, index) {
          if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
            return;
          }
          if (element.inRange(position.x, position.y, useFinalPosition)) {
            items.push({
              element,
              datasetIndex,
              index
            });
          }
        };
        evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
        return items;
      }
      function getNearestRadialItems(chart, position, axis, useFinalPosition) {
        let items = [];
        function evaluationFunc(element, datasetIndex, index) {
          const { startAngle, endAngle } = element.getProps([
            "startAngle",
            "endAngle"
          ], useFinalPosition);
          const { angle } = getAngleFromPoint(element, {
            x: position.x,
            y: position.y
          });
          if (_angleBetween(angle, startAngle, endAngle)) {
            items.push({
              element,
              datasetIndex,
              index
            });
          }
        }
        evaluateInteractionItems(chart, axis, position, evaluationFunc);
        return items;
      }
      function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
        let items = [];
        const distanceMetric = getDistanceMetricForAxis(axis);
        let minDistance = Number.POSITIVE_INFINITY;
        function evaluationFunc(element, datasetIndex, index) {
          const inRange = element.inRange(position.x, position.y, useFinalPosition);
          if (intersect && !inRange) {
            return;
          }
          const center = element.getCenterPoint(useFinalPosition);
          const pointInArea = !!includeInvisible || chart.isPointInArea(center);
          if (!pointInArea && !inRange) {
            return;
          }
          const distance = distanceMetric(position, center);
          if (distance < minDistance) {
            items = [
              {
                element,
                datasetIndex,
                index
              }
            ];
            minDistance = distance;
          } else if (distance === minDistance) {
            items.push({
              element,
              datasetIndex,
              index
            });
          }
        }
        evaluateInteractionItems(chart, axis, position, evaluationFunc);
        return items;
      }
      function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
        if (!includeInvisible && !chart.isPointInArea(position)) {
          return [];
        }
        return axis === "r" && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
      }
      function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
        const items = [];
        const rangeMethod = axis === "x" ? "inXRange" : "inYRange";
        let intersectsItem = false;
        evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index) => {
          if (element[rangeMethod] && element[rangeMethod](position[axis], useFinalPosition)) {
            items.push({
              element,
              datasetIndex,
              index
            });
            intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
          }
        });
        if (intersect && !intersectsItem) {
          return [];
        }
        return items;
      }
      var Interaction = {
        modes: {
          index(chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || "x";
            const includeInvisible = options.includeInvisible || false;
            const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
            const elements = [];
            if (!items.length) {
              return [];
            }
            chart.getSortedVisibleDatasetMetas().forEach((meta) => {
              const index = items[0].index;
              const element = meta.data[index];
              if (element && !element.skip) {
                elements.push({
                  element,
                  datasetIndex: meta.index,
                  index
                });
              }
            });
            return elements;
          },
          dataset(chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || "xy";
            const includeInvisible = options.includeInvisible || false;
            let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
            if (items.length > 0) {
              const datasetIndex = items[0].datasetIndex;
              const data = chart.getDatasetMeta(datasetIndex).data;
              items = [];
              for (let i = 0; i < data.length; ++i) {
                items.push({
                  element: data[i],
                  datasetIndex,
                  index: i
                });
              }
            }
            return items;
          },
          point(chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || "xy";
            const includeInvisible = options.includeInvisible || false;
            return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
          },
          nearest(chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || "xy";
            const includeInvisible = options.includeInvisible || false;
            return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
          },
          x(chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            return getAxisItems(chart, position, "x", options.intersect, useFinalPosition);
          },
          y(chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            return getAxisItems(chart, position, "y", options.intersect, useFinalPosition);
          }
        }
      };
      const STATIC_POSITIONS = [
        "left",
        "top",
        "right",
        "bottom"
      ];
      function filterByPosition(array, position) {
        return array.filter((v) => v.pos === position);
      }
      function filterDynamicPositionByAxis(array, axis) {
        return array.filter((v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
      }
      function sortByWeight(array, reverse) {
        return array.sort((a, b) => {
          const v0 = reverse ? b : a;
          const v1 = reverse ? a : b;
          return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
        });
      }
      function wrapBoxes(boxes) {
        const layoutBoxes = [];
        let i, ilen, box, pos, stack, stackWeight;
        for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
          box = boxes[i];
          ({ position: pos, options: { stack, stackWeight = 1 } } = box);
          layoutBoxes.push({
            index: i,
            box,
            pos,
            horizontal: box.isHorizontal(),
            weight: box.weight,
            stack: stack && pos + stack,
            stackWeight
          });
        }
        return layoutBoxes;
      }
      function buildStacks(layouts2) {
        const stacks = {};
        for (const wrap of layouts2) {
          const { stack, pos, stackWeight } = wrap;
          if (!stack || !STATIC_POSITIONS.includes(pos)) {
            continue;
          }
          const _stack = stacks[stack] || (stacks[stack] = {
            count: 0,
            placed: 0,
            weight: 0,
            size: 0
          });
          _stack.count++;
          _stack.weight += stackWeight;
        }
        return stacks;
      }
      function setLayoutDims(layouts2, params) {
        const stacks = buildStacks(layouts2);
        const { vBoxMaxWidth, hBoxMaxHeight } = params;
        let i, ilen, layout;
        for (i = 0, ilen = layouts2.length; i < ilen; ++i) {
          layout = layouts2[i];
          const { fullSize } = layout.box;
          const stack = stacks[layout.stack];
          const factor = stack && layout.stackWeight / stack.weight;
          if (layout.horizontal) {
            layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
            layout.height = hBoxMaxHeight;
          } else {
            layout.width = vBoxMaxWidth;
            layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
          }
        }
        return stacks;
      }
      function buildLayoutBoxes(boxes) {
        const layoutBoxes = wrapBoxes(boxes);
        const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
        const left = sortByWeight(filterByPosition(layoutBoxes, "left"), true);
        const right = sortByWeight(filterByPosition(layoutBoxes, "right"));
        const top = sortByWeight(filterByPosition(layoutBoxes, "top"), true);
        const bottom = sortByWeight(filterByPosition(layoutBoxes, "bottom"));
        const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, "x");
        const centerVertical = filterDynamicPositionByAxis(layoutBoxes, "y");
        return {
          fullSize,
          leftAndTop: left.concat(top),
          rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
          chartArea: filterByPosition(layoutBoxes, "chartArea"),
          vertical: left.concat(right).concat(centerVertical),
          horizontal: top.concat(bottom).concat(centerHorizontal)
        };
      }
      function getCombinedMax(maxPadding, chartArea, a, b) {
        return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
      }
      function updateMaxPadding(maxPadding, boxPadding) {
        maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
        maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
        maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
        maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
      }
      function updateDims(chartArea, params, layout, stacks) {
        const { pos, box } = layout;
        const maxPadding = chartArea.maxPadding;
        if (!isObject(pos)) {
          if (layout.size) {
            chartArea[pos] -= layout.size;
          }
          const stack = stacks[layout.stack] || {
            size: 0,
            count: 1
          };
          stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
          layout.size = stack.size / stack.count;
          chartArea[pos] += layout.size;
        }
        if (box.getPadding) {
          updateMaxPadding(maxPadding, box.getPadding());
        }
        const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, "left", "right"));
        const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, "top", "bottom"));
        const widthChanged = newWidth !== chartArea.w;
        const heightChanged = newHeight !== chartArea.h;
        chartArea.w = newWidth;
        chartArea.h = newHeight;
        return layout.horizontal ? {
          same: widthChanged,
          other: heightChanged
        } : {
          same: heightChanged,
          other: widthChanged
        };
      }
      function handleMaxPadding(chartArea) {
        const maxPadding = chartArea.maxPadding;
        function updatePos(pos) {
          const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
          chartArea[pos] += change;
          return change;
        }
        chartArea.y += updatePos("top");
        chartArea.x += updatePos("left");
        updatePos("right");
        updatePos("bottom");
      }
      function getMargins(horizontal, chartArea) {
        const maxPadding = chartArea.maxPadding;
        function marginForPositions(positions2) {
          const margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          };
          positions2.forEach((pos) => {
            margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
          });
          return margin;
        }
        return horizontal ? marginForPositions([
          "left",
          "right"
        ]) : marginForPositions([
          "top",
          "bottom"
        ]);
      }
      function fitBoxes(boxes, chartArea, params, stacks) {
        const refitBoxes = [];
        let i, ilen, layout, box, refit, changed;
        for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
          layout = boxes[i];
          box = layout.box;
          box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
          const { same, other } = updateDims(chartArea, params, layout, stacks);
          refit |= same && refitBoxes.length;
          changed = changed || other;
          if (!box.fullSize) {
            refitBoxes.push(layout);
          }
        }
        return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
      }
      function setBoxDims(box, left, top, width, height) {
        box.top = top;
        box.left = left;
        box.right = left + width;
        box.bottom = top + height;
        box.width = width;
        box.height = height;
      }
      function placeBoxes(boxes, chartArea, params, stacks) {
        const userPadding = params.padding;
        let { x, y } = chartArea;
        for (const layout of boxes) {
          const box = layout.box;
          const stack = stacks[layout.stack] || {
            placed: 0,
            weight: 1
          };
          const weight = layout.stackWeight / stack.weight || 1;
          if (layout.horizontal) {
            const width = chartArea.w * weight;
            const height = stack.size || box.height;
            if (defined(stack.start)) {
              y = stack.start;
            }
            if (box.fullSize) {
              setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
            } else {
              setBoxDims(box, chartArea.left + stack.placed, y, width, height);
            }
            stack.start = y;
            stack.placed += width;
            y = box.bottom;
          } else {
            const height = chartArea.h * weight;
            const width = stack.size || box.width;
            if (defined(stack.start)) {
              x = stack.start;
            }
            if (box.fullSize) {
              setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
            } else {
              setBoxDims(box, x, chartArea.top + stack.placed, width, height);
            }
            stack.start = x;
            stack.placed += height;
            x = box.right;
          }
        }
        chartArea.x = x;
        chartArea.y = y;
      }
      var layouts = {
        addBox(chart, item) {
          if (!chart.boxes) {
            chart.boxes = [];
          }
          item.fullSize = item.fullSize || false;
          item.position = item.position || "top";
          item.weight = item.weight || 0;
          item._layers = item._layers || function() {
            return [
              {
                z: 0,
                draw(chartArea) {
                  item.draw(chartArea);
                }
              }
            ];
          };
          chart.boxes.push(item);
        },
        removeBox(chart, layoutItem) {
          const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
          if (index !== -1) {
            chart.boxes.splice(index, 1);
          }
        },
        configure(chart, item, options) {
          item.fullSize = options.fullSize;
          item.position = options.position;
          item.weight = options.weight;
        },
        update(chart, width, height, minPadding) {
          if (!chart) {
            return;
          }
          const padding = toPadding(chart.options.layout.padding);
          const availableWidth = Math.max(width - padding.width, 0);
          const availableHeight = Math.max(height - padding.height, 0);
          const boxes = buildLayoutBoxes(chart.boxes);
          const verticalBoxes = boxes.vertical;
          const horizontalBoxes = boxes.horizontal;
          each(chart.boxes, (box) => {
            if (typeof box.beforeLayout === "function") {
              box.beforeLayout();
            }
          });
          const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
          const params = Object.freeze({
            outerWidth: width,
            outerHeight: height,
            padding,
            availableWidth,
            availableHeight,
            vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
            hBoxMaxHeight: availableHeight / 2
          });
          const maxPadding = Object.assign({}, padding);
          updateMaxPadding(maxPadding, toPadding(minPadding));
          const chartArea = Object.assign({
            maxPadding,
            w: availableWidth,
            h: availableHeight,
            x: padding.left,
            y: padding.top
          }, padding);
          const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
          fitBoxes(boxes.fullSize, chartArea, params, stacks);
          fitBoxes(verticalBoxes, chartArea, params, stacks);
          if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
            fitBoxes(verticalBoxes, chartArea, params, stacks);
          }
          handleMaxPadding(chartArea);
          placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
          chartArea.x += chartArea.w;
          chartArea.y += chartArea.h;
          placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
          chart.chartArea = {
            left: chartArea.left,
            top: chartArea.top,
            right: chartArea.left + chartArea.w,
            bottom: chartArea.top + chartArea.h,
            height: chartArea.h,
            width: chartArea.w
          };
          each(boxes.chartArea, (layout) => {
            const box = layout.box;
            Object.assign(box, chart.chartArea);
            box.update(chartArea.w, chartArea.h, {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            });
          });
        }
      };
      class BasePlatform {
        acquireContext(canvas, aspectRatio) {
        }
        releaseContext(context) {
          return false;
        }
        addEventListener(chart, type, listener) {
        }
        removeEventListener(chart, type, listener) {
        }
        getDevicePixelRatio() {
          return 1;
        }
        getMaximumSize(element, width, height, aspectRatio) {
          width = Math.max(0, width || element.width);
          height = height || element.height;
          return {
            width,
            height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
          };
        }
        isAttached(canvas) {
          return true;
        }
        updateConfig(config) {
        }
      }
      class BasicPlatform extends BasePlatform {
        acquireContext(item) {
          return item && item.getContext && item.getContext("2d") || null;
        }
        updateConfig(config) {
          config.options.animation = false;
        }
      }
      const EXPANDO_KEY = "$chartjs";
      const EVENT_TYPES = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup",
        pointerenter: "mouseenter",
        pointerdown: "mousedown",
        pointermove: "mousemove",
        pointerup: "mouseup",
        pointerleave: "mouseout",
        pointerout: "mouseout"
      };
      const isNullOrEmpty = (value) => value === null || value === "";
      function initCanvas(canvas, aspectRatio) {
        const style = canvas.style;
        const renderHeight = canvas.getAttribute("height");
        const renderWidth = canvas.getAttribute("width");
        canvas[EXPANDO_KEY] = {
          initial: {
            height: renderHeight,
            width: renderWidth,
            style: {
              display: style.display,
              height: style.height,
              width: style.width
            }
          }
        };
        style.display = style.display || "block";
        style.boxSizing = style.boxSizing || "border-box";
        if (isNullOrEmpty(renderWidth)) {
          const displayWidth = readUsedSize(canvas, "width");
          if (displayWidth !== void 0) {
            canvas.width = displayWidth;
          }
        }
        if (isNullOrEmpty(renderHeight)) {
          if (canvas.style.height === "") {
            canvas.height = canvas.width / (aspectRatio || 2);
          } else {
            const displayHeight = readUsedSize(canvas, "height");
            if (displayHeight !== void 0) {
              canvas.height = displayHeight;
            }
          }
        }
        return canvas;
      }
      const eventListenerOptions = supportsEventListenerOptions ? {
        passive: true
      } : false;
      function addListener(node, type, listener) {
        if (node) {
          node.addEventListener(type, listener, eventListenerOptions);
        }
      }
      function removeListener(chart, type, listener) {
        if (chart && chart.canvas) {
          chart.canvas.removeEventListener(type, listener, eventListenerOptions);
        }
      }
      function fromNativeEvent(event, chart) {
        const type = EVENT_TYPES[event.type] || event.type;
        const { x, y } = getRelativePosition(event, chart);
        return {
          type,
          chart,
          native: event,
          x: x !== void 0 ? x : null,
          y: y !== void 0 ? y : null
        };
      }
      function nodeListContains(nodeList, canvas) {
        for (const node of nodeList) {
          if (node === canvas || node.contains(canvas)) {
            return true;
          }
        }
      }
      function createAttachObserver(chart, type, listener) {
        const canvas = chart.canvas;
        const observer = new MutationObserver((entries) => {
          let trigger = false;
          for (const entry of entries) {
            trigger = trigger || nodeListContains(entry.addedNodes, canvas);
            trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
          }
          if (trigger) {
            listener();
          }
        });
        observer.observe(document, {
          childList: true,
          subtree: true
        });
        return observer;
      }
      function createDetachObserver(chart, type, listener) {
        const canvas = chart.canvas;
        const observer = new MutationObserver((entries) => {
          let trigger = false;
          for (const entry of entries) {
            trigger = trigger || nodeListContains(entry.removedNodes, canvas);
            trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
          }
          if (trigger) {
            listener();
          }
        });
        observer.observe(document, {
          childList: true,
          subtree: true
        });
        return observer;
      }
      const drpListeningCharts = /* @__PURE__ */ new Map();
      let oldDevicePixelRatio = 0;
      function onWindowResize() {
        const dpr = window.devicePixelRatio;
        if (dpr === oldDevicePixelRatio) {
          return;
        }
        oldDevicePixelRatio = dpr;
        drpListeningCharts.forEach((resize, chart) => {
          if (chart.currentDevicePixelRatio !== dpr) {
            resize();
          }
        });
      }
      function listenDevicePixelRatioChanges(chart, resize) {
        if (!drpListeningCharts.size) {
          window.addEventListener("resize", onWindowResize);
        }
        drpListeningCharts.set(chart, resize);
      }
      function unlistenDevicePixelRatioChanges(chart) {
        drpListeningCharts.delete(chart);
        if (!drpListeningCharts.size) {
          window.removeEventListener("resize", onWindowResize);
        }
      }
      function createResizeObserver(chart, type, listener) {
        const canvas = chart.canvas;
        const container = canvas && _getParentNode(canvas);
        if (!container) {
          return;
        }
        const resize = throttled((width, height) => {
          const w = container.clientWidth;
          listener(width, height);
          if (w < container.clientWidth) {
            listener();
          }
        }, window);
        const observer = new ResizeObserver((entries) => {
          const entry = entries[0];
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          if (width === 0 && height === 0) {
            return;
          }
          resize(width, height);
        });
        observer.observe(container);
        listenDevicePixelRatioChanges(chart, resize);
        return observer;
      }
      function releaseObserver(chart, type, observer) {
        if (observer) {
          observer.disconnect();
        }
        if (type === "resize") {
          unlistenDevicePixelRatioChanges(chart);
        }
      }
      function createProxyAndListen(chart, type, listener) {
        const canvas = chart.canvas;
        const proxy = throttled((event) => {
          if (chart.ctx !== null) {
            listener(fromNativeEvent(event, chart));
          }
        }, chart);
        addListener(canvas, type, proxy);
        return proxy;
      }
      class DomPlatform extends BasePlatform {
        acquireContext(canvas, aspectRatio) {
          const context = canvas && canvas.getContext && canvas.getContext("2d");
          if (context && context.canvas === canvas) {
            initCanvas(canvas, aspectRatio);
            return context;
          }
          return null;
        }
        releaseContext(context) {
          const canvas = context.canvas;
          if (!canvas[EXPANDO_KEY]) {
            return false;
          }
          const initial = canvas[EXPANDO_KEY].initial;
          [
            "height",
            "width"
          ].forEach((prop) => {
            const value = initial[prop];
            if (isNullOrUndef(value)) {
              canvas.removeAttribute(prop);
            } else {
              canvas.setAttribute(prop, value);
            }
          });
          const style = initial.style || {};
          Object.keys(style).forEach((key) => {
            canvas.style[key] = style[key];
          });
          canvas.width = canvas.width;
          delete canvas[EXPANDO_KEY];
          return true;
        }
        addEventListener(chart, type, listener) {
          this.removeEventListener(chart, type);
          const proxies = chart.$proxies || (chart.$proxies = {});
          const handlers = {
            attach: createAttachObserver,
            detach: createDetachObserver,
            resize: createResizeObserver
          };
          const handler = handlers[type] || createProxyAndListen;
          proxies[type] = handler(chart, type, listener);
        }
        removeEventListener(chart, type) {
          const proxies = chart.$proxies || (chart.$proxies = {});
          const proxy = proxies[type];
          if (!proxy) {
            return;
          }
          const handlers = {
            attach: releaseObserver,
            detach: releaseObserver,
            resize: releaseObserver
          };
          const handler = handlers[type] || removeListener;
          handler(chart, type, proxy);
          proxies[type] = void 0;
        }
        getDevicePixelRatio() {
          return window.devicePixelRatio;
        }
        getMaximumSize(canvas, width, height, aspectRatio) {
          return getMaximumSize(canvas, width, height, aspectRatio);
        }
        isAttached(canvas) {
          const container = canvas && _getParentNode(canvas);
          return !!(container && container.isConnected);
        }
      }
      function _detectPlatform(canvas) {
        if (!_isDomSupported() || typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
          return BasicPlatform;
        }
        return DomPlatform;
      }
      class Element {
        constructor() {
          __publicField(this, "x");
          __publicField(this, "y");
          __publicField(this, "active", false);
          __publicField(this, "options");
          __publicField(this, "$animations");
        }
        tooltipPosition(useFinalPosition) {
          const { x, y } = this.getProps([
            "x",
            "y"
          ], useFinalPosition);
          return {
            x,
            y
          };
        }
        hasValue() {
          return isNumber(this.x) && isNumber(this.y);
        }
        getProps(props, final) {
          const anims = this.$animations;
          if (!final || !anims) {
            return this;
          }
          const ret = {};
          props.forEach((prop) => {
            ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
          });
          return ret;
        }
      }
      __publicField(Element, "defaults", {});
      __publicField(Element, "defaultRoutes");
      function autoSkip(scale, ticks) {
        const tickOpts = scale.options.ticks;
        const determinedMaxTicks = determineMaxTicks(scale);
        const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
        const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
        const numMajorIndices = majorIndices.length;
        const first = majorIndices[0];
        const last = majorIndices[numMajorIndices - 1];
        const newTicks = [];
        if (numMajorIndices > ticksLimit) {
          skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
          return newTicks;
        }
        const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
        if (numMajorIndices > 0) {
          let i, ilen;
          const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
          skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
          for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
            skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
          }
          skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
          return newTicks;
        }
        skip(ticks, newTicks, spacing);
        return newTicks;
      }
      function determineMaxTicks(scale) {
        const offset = scale.options.offset;
        const tickLength = scale._tickSize();
        const maxScale = scale._length / tickLength + (offset ? 0 : 1);
        const maxChart = scale._maxLength / tickLength;
        return Math.floor(Math.min(maxScale, maxChart));
      }
      function calculateSpacing(majorIndices, ticks, ticksLimit) {
        const evenMajorSpacing = getEvenSpacing(majorIndices);
        const spacing = ticks.length / ticksLimit;
        if (!evenMajorSpacing) {
          return Math.max(spacing, 1);
        }
        const factors = _factorize(evenMajorSpacing);
        for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
          const factor = factors[i];
          if (factor > spacing) {
            return factor;
          }
        }
        return Math.max(spacing, 1);
      }
      function getMajorIndices(ticks) {
        const result = [];
        let i, ilen;
        for (i = 0, ilen = ticks.length; i < ilen; i++) {
          if (ticks[i].major) {
            result.push(i);
          }
        }
        return result;
      }
      function skipMajors(ticks, newTicks, majorIndices, spacing) {
        let count = 0;
        let next = majorIndices[0];
        let i;
        spacing = Math.ceil(spacing);
        for (i = 0; i < ticks.length; i++) {
          if (i === next) {
            newTicks.push(ticks[i]);
            count++;
            next = majorIndices[count * spacing];
          }
        }
      }
      function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
        const start = valueOrDefault(majorStart, 0);
        const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
        let count = 0;
        let length, i, next;
        spacing = Math.ceil(spacing);
        if (majorEnd) {
          length = majorEnd - majorStart;
          spacing = length / Math.floor(length / spacing);
        }
        next = start;
        while (next < 0) {
          count++;
          next = Math.round(start + count * spacing);
        }
        for (i = Math.max(start, 0); i < end; i++) {
          if (i === next) {
            newTicks.push(ticks[i]);
            count++;
            next = Math.round(start + count * spacing);
          }
        }
      }
      function getEvenSpacing(arr) {
        const len = arr.length;
        let i, diff;
        if (len < 2) {
          return false;
        }
        for (diff = arr[0], i = 1; i < len; ++i) {
          if (arr[i] - arr[i - 1] !== diff) {
            return false;
          }
        }
        return diff;
      }
      const reverseAlign = (align) => align === "left" ? "right" : align === "right" ? "left" : align;
      const offsetFromEdge = (scale, edge, offset) => edge === "top" || edge === "left" ? scale[edge] + offset : scale[edge] - offset;
      const getTicksLimit = (ticksLength, maxTicksLimit) => Math.min(maxTicksLimit || ticksLength, ticksLength);
      function sample(arr, numItems) {
        const result = [];
        const increment = arr.length / numItems;
        const len = arr.length;
        let i = 0;
        for (; i < len; i += increment) {
          result.push(arr[Math.floor(i)]);
        }
        return result;
      }
      function getPixelForGridLine(scale, index, offsetGridLines) {
        const length = scale.ticks.length;
        const validIndex2 = Math.min(index, length - 1);
        const start = scale._startPixel;
        const end = scale._endPixel;
        const epsilon = 1e-6;
        let lineValue = scale.getPixelForTick(validIndex2);
        let offset;
        if (offsetGridLines) {
          if (length === 1) {
            offset = Math.max(lineValue - start, end - lineValue);
          } else if (index === 0) {
            offset = (scale.getPixelForTick(1) - lineValue) / 2;
          } else {
            offset = (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2;
          }
          lineValue += validIndex2 < index ? offset : -offset;
          if (lineValue < start - epsilon || lineValue > end + epsilon) {
            return;
          }
        }
        return lineValue;
      }
      function garbageCollect(caches, length) {
        each(caches, (cache) => {
          const gc = cache.gc;
          const gcLen = gc.length / 2;
          let i;
          if (gcLen > length) {
            for (i = 0; i < gcLen; ++i) {
              delete cache.data[gc[i]];
            }
            gc.splice(0, gcLen);
          }
        });
      }
      function getTickMarkLength(options) {
        return options.drawTicks ? options.tickLength : 0;
      }
      function getTitleHeight(options, fallback) {
        if (!options.display) {
          return 0;
        }
        const font = toFont(options.font, fallback);
        const padding = toPadding(options.padding);
        const lines = isArray(options.text) ? options.text.length : 1;
        return lines * font.lineHeight + padding.height;
      }
      function createScaleContext(parent, scale) {
        return createContext(parent, {
          scale,
          type: "scale"
        });
      }
      function createTickContext(parent, index, tick) {
        return createContext(parent, {
          tick,
          index,
          type: "tick"
        });
      }
      function titleAlign(align, position, reverse) {
        let ret = _toLeftRightCenter(align);
        if (reverse && position !== "right" || !reverse && position === "right") {
          ret = reverseAlign(ret);
        }
        return ret;
      }
      function titleArgs(scale, offset, position, align) {
        const { top, left, bottom, right, chart } = scale;
        const { chartArea, scales } = chart;
        let rotation = 0;
        let maxWidth, titleX, titleY;
        const height = bottom - top;
        const width = right - left;
        if (scale.isHorizontal()) {
          titleX = _alignStartEnd(align, left, right);
          if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
          } else if (position === "center") {
            titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
          } else {
            titleY = offsetFromEdge(scale, position, offset);
          }
          maxWidth = right - left;
        } else {
          if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            titleX = scales[positionAxisID].getPixelForValue(value) - width + offset;
          } else if (position === "center") {
            titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
          } else {
            titleX = offsetFromEdge(scale, position, offset);
          }
          titleY = _alignStartEnd(align, bottom, top);
          rotation = position === "left" ? -HALF_PI : HALF_PI;
        }
        return {
          titleX,
          titleY,
          maxWidth,
          rotation
        };
      }
      class Scale extends Element {
        constructor(cfg) {
          super();
          this.id = cfg.id;
          this.type = cfg.type;
          this.options = void 0;
          this.ctx = cfg.ctx;
          this.chart = cfg.chart;
          this.top = void 0;
          this.bottom = void 0;
          this.left = void 0;
          this.right = void 0;
          this.width = void 0;
          this.height = void 0;
          this._margins = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          };
          this.maxWidth = void 0;
          this.maxHeight = void 0;
          this.paddingTop = void 0;
          this.paddingBottom = void 0;
          this.paddingLeft = void 0;
          this.paddingRight = void 0;
          this.axis = void 0;
          this.labelRotation = void 0;
          this.min = void 0;
          this.max = void 0;
          this._range = void 0;
          this.ticks = [];
          this._gridLineItems = null;
          this._labelItems = null;
          this._labelSizes = null;
          this._length = 0;
          this._maxLength = 0;
          this._longestTextCache = {};
          this._startPixel = void 0;
          this._endPixel = void 0;
          this._reversePixels = false;
          this._userMax = void 0;
          this._userMin = void 0;
          this._suggestedMax = void 0;
          this._suggestedMin = void 0;
          this._ticksLength = 0;
          this._borderValue = 0;
          this._cache = {};
          this._dataLimitsCached = false;
          this.$context = void 0;
        }
        init(options) {
          this.options = options.setContext(this.getContext());
          this.axis = options.axis;
          this._userMin = this.parse(options.min);
          this._userMax = this.parse(options.max);
          this._suggestedMin = this.parse(options.suggestedMin);
          this._suggestedMax = this.parse(options.suggestedMax);
        }
        parse(raw, index) {
          return raw;
        }
        getUserBounds() {
          let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this;
          _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
          _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
          _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
          _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
          return {
            min: finiteOrDefault(_userMin, _suggestedMin),
            max: finiteOrDefault(_userMax, _suggestedMax),
            minDefined: isNumberFinite(_userMin),
            maxDefined: isNumberFinite(_userMax)
          };
        }
        getMinMax(canStack) {
          let { min, max, minDefined, maxDefined } = this.getUserBounds();
          let range;
          if (minDefined && maxDefined) {
            return {
              min,
              max
            };
          }
          const metas = this.getMatchingVisibleMetas();
          for (let i = 0, ilen = metas.length; i < ilen; ++i) {
            range = metas[i].controller.getMinMax(this, canStack);
            if (!minDefined) {
              min = Math.min(min, range.min);
            }
            if (!maxDefined) {
              max = Math.max(max, range.max);
            }
          }
          min = maxDefined && min > max ? max : min;
          max = minDefined && min > max ? min : max;
          return {
            min: finiteOrDefault(min, finiteOrDefault(max, min)),
            max: finiteOrDefault(max, finiteOrDefault(min, max))
          };
        }
        getPadding() {
          return {
            left: this.paddingLeft || 0,
            top: this.paddingTop || 0,
            right: this.paddingRight || 0,
            bottom: this.paddingBottom || 0
          };
        }
        getTicks() {
          return this.ticks;
        }
        getLabels() {
          const data = this.chart.data;
          return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
        }
        getLabelItems(chartArea = this.chart.chartArea) {
          const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
          return items;
        }
        beforeLayout() {
          this._cache = {};
          this._dataLimitsCached = false;
        }
        beforeUpdate() {
          callback(this.options.beforeUpdate, [
            this
          ]);
        }
        update(maxWidth, maxHeight, margins) {
          const { beginAtZero, grace, ticks: tickOpts } = this.options;
          const sampleSize = tickOpts.sampleSize;
          this.beforeUpdate();
          this.maxWidth = maxWidth;
          this.maxHeight = maxHeight;
          this._margins = margins = Object.assign({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }, margins);
          this.ticks = null;
          this._labelSizes = null;
          this._gridLineItems = null;
          this._labelItems = null;
          this.beforeSetDimensions();
          this.setDimensions();
          this.afterSetDimensions();
          this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
          if (!this._dataLimitsCached) {
            this.beforeDataLimits();
            this.determineDataLimits();
            this.afterDataLimits();
            this._range = _addGrace(this, grace, beginAtZero);
            this._dataLimitsCached = true;
          }
          this.beforeBuildTicks();
          this.ticks = this.buildTicks() || [];
          this.afterBuildTicks();
          const samplingEnabled = sampleSize < this.ticks.length;
          this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
          this.configure();
          this.beforeCalculateLabelRotation();
          this.calculateLabelRotation();
          this.afterCalculateLabelRotation();
          if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === "auto")) {
            this.ticks = autoSkip(this, this.ticks);
            this._labelSizes = null;
            this.afterAutoSkip();
          }
          if (samplingEnabled) {
            this._convertTicksToLabels(this.ticks);
          }
          this.beforeFit();
          this.fit();
          this.afterFit();
          this.afterUpdate();
        }
        configure() {
          let reversePixels = this.options.reverse;
          let startPixel, endPixel;
          if (this.isHorizontal()) {
            startPixel = this.left;
            endPixel = this.right;
          } else {
            startPixel = this.top;
            endPixel = this.bottom;
            reversePixels = !reversePixels;
          }
          this._startPixel = startPixel;
          this._endPixel = endPixel;
          this._reversePixels = reversePixels;
          this._length = endPixel - startPixel;
          this._alignToPixels = this.options.alignToPixels;
        }
        afterUpdate() {
          callback(this.options.afterUpdate, [
            this
          ]);
        }
        beforeSetDimensions() {
          callback(this.options.beforeSetDimensions, [
            this
          ]);
        }
        setDimensions() {
          if (this.isHorizontal()) {
            this.width = this.maxWidth;
            this.left = 0;
            this.right = this.width;
          } else {
            this.height = this.maxHeight;
            this.top = 0;
            this.bottom = this.height;
          }
          this.paddingLeft = 0;
          this.paddingTop = 0;
          this.paddingRight = 0;
          this.paddingBottom = 0;
        }
        afterSetDimensions() {
          callback(this.options.afterSetDimensions, [
            this
          ]);
        }
        _callHooks(name) {
          this.chart.notifyPlugins(name, this.getContext());
          callback(this.options[name], [
            this
          ]);
        }
        beforeDataLimits() {
          this._callHooks("beforeDataLimits");
        }
        determineDataLimits() {
        }
        afterDataLimits() {
          this._callHooks("afterDataLimits");
        }
        beforeBuildTicks() {
          this._callHooks("beforeBuildTicks");
        }
        buildTicks() {
          return [];
        }
        afterBuildTicks() {
          this._callHooks("afterBuildTicks");
        }
        beforeTickToLabelConversion() {
          callback(this.options.beforeTickToLabelConversion, [
            this
          ]);
        }
        generateTickLabels(ticks) {
          const tickOpts = this.options.ticks;
          let i, ilen, tick;
          for (i = 0, ilen = ticks.length; i < ilen; i++) {
            tick = ticks[i];
            tick.label = callback(tickOpts.callback, [
              tick.value,
              i,
              ticks
            ], this);
          }
        }
        afterTickToLabelConversion() {
          callback(this.options.afterTickToLabelConversion, [
            this
          ]);
        }
        beforeCalculateLabelRotation() {
          callback(this.options.beforeCalculateLabelRotation, [
            this
          ]);
        }
        calculateLabelRotation() {
          const options = this.options;
          const tickOpts = options.ticks;
          const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
          const minRotation = tickOpts.minRotation || 0;
          const maxRotation = tickOpts.maxRotation;
          let labelRotation = minRotation;
          let tickWidth, maxHeight, maxLabelDiagonal;
          if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
            this.labelRotation = minRotation;
            return;
          }
          const labelSizes = this._getLabelSizes();
          const maxLabelWidth = labelSizes.widest.width;
          const maxLabelHeight = labelSizes.highest.height;
          const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
          tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
          if (maxLabelWidth + 6 > tickWidth) {
            tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
            maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
            maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
            labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
            labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
          }
          this.labelRotation = labelRotation;
        }
        afterCalculateLabelRotation() {
          callback(this.options.afterCalculateLabelRotation, [
            this
          ]);
        }
        afterAutoSkip() {
        }
        beforeFit() {
          callback(this.options.beforeFit, [
            this
          ]);
        }
        fit() {
          const minSize = {
            width: 0,
            height: 0
          };
          const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
          const display = this._isVisible();
          const isHorizontal = this.isHorizontal();
          if (display) {
            const titleHeight = getTitleHeight(titleOpts, chart.options.font);
            if (isHorizontal) {
              minSize.width = this.maxWidth;
              minSize.height = getTickMarkLength(gridOpts) + titleHeight;
            } else {
              minSize.height = this.maxHeight;
              minSize.width = getTickMarkLength(gridOpts) + titleHeight;
            }
            if (tickOpts.display && this.ticks.length) {
              const { first, last, widest, highest } = this._getLabelSizes();
              const tickPadding = tickOpts.padding * 2;
              const angleRadians = toRadians(this.labelRotation);
              const cos = Math.cos(angleRadians);
              const sin = Math.sin(angleRadians);
              if (isHorizontal) {
                const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
              } else {
                const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
              }
              this._calculatePadding(first, last, sin, cos);
            }
          }
          this._handleMargins();
          if (isHorizontal) {
            this.width = this._length = chart.width - this._margins.left - this._margins.right;
            this.height = minSize.height;
          } else {
            this.width = minSize.width;
            this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
          }
        }
        _calculatePadding(first, last, sin, cos) {
          const { ticks: { align, padding }, position } = this.options;
          const isRotated = this.labelRotation !== 0;
          const labelsBelowTicks = position !== "top" && this.axis === "x";
          if (this.isHorizontal()) {
            const offsetLeft = this.getPixelForTick(0) - this.left;
            const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
            let paddingLeft = 0;
            let paddingRight = 0;
            if (isRotated) {
              if (labelsBelowTicks) {
                paddingLeft = cos * first.width;
                paddingRight = sin * last.height;
              } else {
                paddingLeft = sin * first.height;
                paddingRight = cos * last.width;
              }
            } else if (align === "start") {
              paddingRight = last.width;
            } else if (align === "end") {
              paddingLeft = first.width;
            } else if (align !== "inner") {
              paddingLeft = first.width / 2;
              paddingRight = last.width / 2;
            }
            this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
            this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
          } else {
            let paddingTop = last.height / 2;
            let paddingBottom = first.height / 2;
            if (align === "start") {
              paddingTop = 0;
              paddingBottom = first.height;
            } else if (align === "end") {
              paddingTop = last.height;
              paddingBottom = 0;
            }
            this.paddingTop = paddingTop + padding;
            this.paddingBottom = paddingBottom + padding;
          }
        }
        _handleMargins() {
          if (this._margins) {
            this._margins.left = Math.max(this.paddingLeft, this._margins.left);
            this._margins.top = Math.max(this.paddingTop, this._margins.top);
            this._margins.right = Math.max(this.paddingRight, this._margins.right);
            this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
          }
        }
        afterFit() {
          callback(this.options.afterFit, [
            this
          ]);
        }
        isHorizontal() {
          const { axis, position } = this.options;
          return position === "top" || position === "bottom" || axis === "x";
        }
        isFullSize() {
          return this.options.fullSize;
        }
        _convertTicksToLabels(ticks) {
          this.beforeTickToLabelConversion();
          this.generateTickLabels(ticks);
          let i, ilen;
          for (i = 0, ilen = ticks.length; i < ilen; i++) {
            if (isNullOrUndef(ticks[i].label)) {
              ticks.splice(i, 1);
              ilen--;
              i--;
            }
          }
          this.afterTickToLabelConversion();
        }
        _getLabelSizes() {
          let labelSizes = this._labelSizes;
          if (!labelSizes) {
            const sampleSize = this.options.ticks.sampleSize;
            let ticks = this.ticks;
            if (sampleSize < ticks.length) {
              ticks = sample(ticks, sampleSize);
            }
            this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
          }
          return labelSizes;
        }
        _computeLabelSizes(ticks, length, maxTicksLimit) {
          const { ctx, _longestTextCache: caches } = this;
          const widths = [];
          const heights = [];
          const increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
          let widestLabelSize = 0;
          let highestLabelSize = 0;
          let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
          for (i = 0; i < length; i += increment) {
            label = ticks[i].label;
            tickFont = this._resolveTickFontOptions(i);
            ctx.font = fontString = tickFont.string;
            cache = caches[fontString] = caches[fontString] || {
              data: {},
              gc: []
            };
            lineHeight = tickFont.lineHeight;
            width = height = 0;
            if (!isNullOrUndef(label) && !isArray(label)) {
              width = _measureText(ctx, cache.data, cache.gc, width, label);
              height = lineHeight;
            } else if (isArray(label)) {
              for (j = 0, jlen = label.length; j < jlen; ++j) {
                nestedLabel = label[j];
                if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                  width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
                  height += lineHeight;
                }
              }
            }
            widths.push(width);
            heights.push(height);
            widestLabelSize = Math.max(width, widestLabelSize);
            highestLabelSize = Math.max(height, highestLabelSize);
          }
          garbageCollect(caches, length);
          const widest = widths.indexOf(widestLabelSize);
          const highest = heights.indexOf(highestLabelSize);
          const valueAt = (idx) => ({
            width: widths[idx] || 0,
            height: heights[idx] || 0
          });
          return {
            first: valueAt(0),
            last: valueAt(length - 1),
            widest: valueAt(widest),
            highest: valueAt(highest),
            widths,
            heights
          };
        }
        getLabelForValue(value) {
          return value;
        }
        getPixelForValue(value, index) {
          return NaN;
        }
        getValueForPixel(pixel) {
        }
        getPixelForTick(index) {
          const ticks = this.ticks;
          if (index < 0 || index > ticks.length - 1) {
            return null;
          }
          return this.getPixelForValue(ticks[index].value);
        }
        getPixelForDecimal(decimal) {
          if (this._reversePixels) {
            decimal = 1 - decimal;
          }
          const pixel = this._startPixel + decimal * this._length;
          return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
        }
        getDecimalForPixel(pixel) {
          const decimal = (pixel - this._startPixel) / this._length;
          return this._reversePixels ? 1 - decimal : decimal;
        }
        getBasePixel() {
          return this.getPixelForValue(this.getBaseValue());
        }
        getBaseValue() {
          const { min, max } = this;
          return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
        }
        getContext(index) {
          const ticks = this.ticks || [];
          if (index >= 0 && index < ticks.length) {
            const tick = ticks[index];
            return tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
          }
          return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
        }
        _tickSize() {
          const optionTicks = this.options.ticks;
          const rot = toRadians(this.labelRotation);
          const cos = Math.abs(Math.cos(rot));
          const sin = Math.abs(Math.sin(rot));
          const labelSizes = this._getLabelSizes();
          const padding = optionTicks.autoSkipPadding || 0;
          const w = labelSizes ? labelSizes.widest.width + padding : 0;
          const h3 = labelSizes ? labelSizes.highest.height + padding : 0;
          return this.isHorizontal() ? h3 * cos > w * sin ? w / cos : h3 / sin : h3 * sin < w * cos ? h3 / cos : w / sin;
        }
        _isVisible() {
          const display = this.options.display;
          if (display !== "auto") {
            return !!display;
          }
          return this.getMatchingVisibleMetas().length > 0;
        }
        _computeGridLineItems(chartArea) {
          const axis = this.axis;
          const chart = this.chart;
          const options = this.options;
          const { grid, position, border } = options;
          const offset = grid.offset;
          const isHorizontal = this.isHorizontal();
          const ticks = this.ticks;
          const ticksLength = ticks.length + (offset ? 1 : 0);
          const tl = getTickMarkLength(grid);
          const items = [];
          const borderOpts = border.setContext(this.getContext());
          const axisWidth = borderOpts.display ? borderOpts.width : 0;
          const axisHalfWidth = axisWidth / 2;
          const alignBorderValue = function(pixel) {
            return _alignPixel(chart, pixel, axisWidth);
          };
          let borderValue, i, lineValue, alignedLineValue;
          let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
          if (position === "top") {
            borderValue = alignBorderValue(this.bottom);
            ty1 = this.bottom - tl;
            ty2 = borderValue - axisHalfWidth;
            y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
            y2 = chartArea.bottom;
          } else if (position === "bottom") {
            borderValue = alignBorderValue(this.top);
            y1 = chartArea.top;
            y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
            ty1 = borderValue + axisHalfWidth;
            ty2 = this.top + tl;
          } else if (position === "left") {
            borderValue = alignBorderValue(this.right);
            tx1 = this.right - tl;
            tx2 = borderValue - axisHalfWidth;
            x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
            x2 = chartArea.right;
          } else if (position === "right") {
            borderValue = alignBorderValue(this.left);
            x1 = chartArea.left;
            x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
            tx1 = borderValue + axisHalfWidth;
            tx2 = this.left + tl;
          } else if (axis === "x") {
            if (position === "center") {
              borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
            } else if (isObject(position)) {
              const positionAxisID = Object.keys(position)[0];
              const value = position[positionAxisID];
              borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
            }
            y1 = chartArea.top;
            y2 = chartArea.bottom;
            ty1 = borderValue + axisHalfWidth;
            ty2 = ty1 + tl;
          } else if (axis === "y") {
            if (position === "center") {
              borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
            } else if (isObject(position)) {
              const positionAxisID = Object.keys(position)[0];
              const value = position[positionAxisID];
              borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
            }
            tx1 = borderValue - axisHalfWidth;
            tx2 = tx1 - tl;
            x1 = chartArea.left;
            x2 = chartArea.right;
          }
          const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
          const step = Math.max(1, Math.ceil(ticksLength / limit));
          for (i = 0; i < ticksLength; i += step) {
            const context = this.getContext(i);
            const optsAtIndex = grid.setContext(context);
            const optsAtIndexBorder = border.setContext(context);
            const lineWidth = optsAtIndex.lineWidth;
            const lineColor = optsAtIndex.color;
            const borderDash = optsAtIndexBorder.dash || [];
            const borderDashOffset = optsAtIndexBorder.dashOffset;
            const tickWidth = optsAtIndex.tickWidth;
            const tickColor = optsAtIndex.tickColor;
            const tickBorderDash = optsAtIndex.tickBorderDash || [];
            const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
            lineValue = getPixelForGridLine(this, i, offset);
            if (lineValue === void 0) {
              continue;
            }
            alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
            if (isHorizontal) {
              tx1 = tx2 = x1 = x2 = alignedLineValue;
            } else {
              ty1 = ty2 = y1 = y2 = alignedLineValue;
            }
            items.push({
              tx1,
              ty1,
              tx2,
              ty2,
              x1,
              y1,
              x2,
              y2,
              width: lineWidth,
              color: lineColor,
              borderDash,
              borderDashOffset,
              tickWidth,
              tickColor,
              tickBorderDash,
              tickBorderDashOffset
            });
          }
          this._ticksLength = ticksLength;
          this._borderValue = borderValue;
          return items;
        }
        _computeLabelItems(chartArea) {
          const axis = this.axis;
          const options = this.options;
          const { position, ticks: optionTicks } = options;
          const isHorizontal = this.isHorizontal();
          const ticks = this.ticks;
          const { align, crossAlign, padding, mirror } = optionTicks;
          const tl = getTickMarkLength(options.grid);
          const tickAndPadding = tl + padding;
          const hTickAndPadding = mirror ? -padding : tickAndPadding;
          const rotation = -toRadians(this.labelRotation);
          const items = [];
          let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
          let textBaseline = "middle";
          if (position === "top") {
            y = this.bottom - hTickAndPadding;
            textAlign = this._getXAxisLabelAlignment();
          } else if (position === "bottom") {
            y = this.top + hTickAndPadding;
            textAlign = this._getXAxisLabelAlignment();
          } else if (position === "left") {
            const ret = this._getYAxisLabelAlignment(tl);
            textAlign = ret.textAlign;
            x = ret.x;
          } else if (position === "right") {
            const ret = this._getYAxisLabelAlignment(tl);
            textAlign = ret.textAlign;
            x = ret.x;
          } else if (axis === "x") {
            if (position === "center") {
              y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
            } else if (isObject(position)) {
              const positionAxisID = Object.keys(position)[0];
              const value = position[positionAxisID];
              y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
            }
            textAlign = this._getXAxisLabelAlignment();
          } else if (axis === "y") {
            if (position === "center") {
              x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
            } else if (isObject(position)) {
              const positionAxisID = Object.keys(position)[0];
              const value = position[positionAxisID];
              x = this.chart.scales[positionAxisID].getPixelForValue(value);
            }
            textAlign = this._getYAxisLabelAlignment(tl).textAlign;
          }
          if (axis === "y") {
            if (align === "start") {
              textBaseline = "top";
            } else if (align === "end") {
              textBaseline = "bottom";
            }
          }
          const labelSizes = this._getLabelSizes();
          for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            tick = ticks[i];
            label = tick.label;
            const optsAtIndex = optionTicks.setContext(this.getContext(i));
            pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
            font = this._resolveTickFontOptions(i);
            lineHeight = font.lineHeight;
            lineCount = isArray(label) ? label.length : 1;
            const halfCount = lineCount / 2;
            const color2 = optsAtIndex.color;
            const strokeColor = optsAtIndex.textStrokeColor;
            const strokeWidth = optsAtIndex.textStrokeWidth;
            let tickTextAlign = textAlign;
            if (isHorizontal) {
              x = pixel;
              if (textAlign === "inner") {
                if (i === ilen - 1) {
                  tickTextAlign = !this.options.reverse ? "right" : "left";
                } else if (i === 0) {
                  tickTextAlign = !this.options.reverse ? "left" : "right";
                } else {
                  tickTextAlign = "center";
                }
              }
              if (position === "top") {
                if (crossAlign === "near" || rotation !== 0) {
                  textOffset = -lineCount * lineHeight + lineHeight / 2;
                } else if (crossAlign === "center") {
                  textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
                } else {
                  textOffset = -labelSizes.highest.height + lineHeight / 2;
                }
              } else {
                if (crossAlign === "near" || rotation !== 0) {
                  textOffset = lineHeight / 2;
                } else if (crossAlign === "center") {
                  textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
                } else {
                  textOffset = labelSizes.highest.height - lineCount * lineHeight;
                }
              }
              if (mirror) {
                textOffset *= -1;
              }
              if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
                x += lineHeight / 2 * Math.sin(rotation);
              }
            } else {
              y = pixel;
              textOffset = (1 - lineCount) * lineHeight / 2;
            }
            let backdrop;
            if (optsAtIndex.showLabelBackdrop) {
              const labelPadding = toPadding(optsAtIndex.backdropPadding);
              const height = labelSizes.heights[i];
              const width = labelSizes.widths[i];
              let top = textOffset - labelPadding.top;
              let left = 0 - labelPadding.left;
              switch (textBaseline) {
                case "middle":
                  top -= height / 2;
                  break;
                case "bottom":
                  top -= height;
                  break;
              }
              switch (textAlign) {
                case "center":
                  left -= width / 2;
                  break;
                case "right":
                  left -= width;
                  break;
                case "inner":
                  if (i === ilen - 1) {
                    left -= width;
                  } else if (i > 0) {
                    left -= width / 2;
                  }
                  break;
              }
              backdrop = {
                left,
                top,
                width: width + labelPadding.width,
                height: height + labelPadding.height,
                color: optsAtIndex.backdropColor
              };
            }
            items.push({
              label,
              font,
              textOffset,
              options: {
                rotation,
                color: color2,
                strokeColor,
                strokeWidth,
                textAlign: tickTextAlign,
                textBaseline,
                translation: [
                  x,
                  y
                ],
                backdrop
              }
            });
          }
          return items;
        }
        _getXAxisLabelAlignment() {
          const { position, ticks } = this.options;
          const rotation = -toRadians(this.labelRotation);
          if (rotation) {
            return position === "top" ? "left" : "right";
          }
          let align = "center";
          if (ticks.align === "start") {
            align = "left";
          } else if (ticks.align === "end") {
            align = "right";
          } else if (ticks.align === "inner") {
            align = "inner";
          }
          return align;
        }
        _getYAxisLabelAlignment(tl) {
          const { position, ticks: { crossAlign, mirror, padding } } = this.options;
          const labelSizes = this._getLabelSizes();
          const tickAndPadding = tl + padding;
          const widest = labelSizes.widest.width;
          let textAlign;
          let x;
          if (position === "left") {
            if (mirror) {
              x = this.right + padding;
              if (crossAlign === "near") {
                textAlign = "left";
              } else if (crossAlign === "center") {
                textAlign = "center";
                x += widest / 2;
              } else {
                textAlign = "right";
                x += widest;
              }
            } else {
              x = this.right - tickAndPadding;
              if (crossAlign === "near") {
                textAlign = "right";
              } else if (crossAlign === "center") {
                textAlign = "center";
                x -= widest / 2;
              } else {
                textAlign = "left";
                x = this.left;
              }
            }
          } else if (position === "right") {
            if (mirror) {
              x = this.left + padding;
              if (crossAlign === "near") {
                textAlign = "right";
              } else if (crossAlign === "center") {
                textAlign = "center";
                x -= widest / 2;
              } else {
                textAlign = "left";
                x -= widest;
              }
            } else {
              x = this.left + tickAndPadding;
              if (crossAlign === "near") {
                textAlign = "left";
              } else if (crossAlign === "center") {
                textAlign = "center";
                x += widest / 2;
              } else {
                textAlign = "right";
                x = this.right;
              }
            }
          } else {
            textAlign = "right";
          }
          return {
            textAlign,
            x
          };
        }
        _computeLabelArea() {
          if (this.options.ticks.mirror) {
            return;
          }
          const chart = this.chart;
          const position = this.options.position;
          if (position === "left" || position === "right") {
            return {
              top: 0,
              left: this.left,
              bottom: chart.height,
              right: this.right
            };
          }
          if (position === "top" || position === "bottom") {
            return {
              top: this.top,
              left: 0,
              bottom: this.bottom,
              right: chart.width
            };
          }
        }
        drawBackground() {
          const { ctx, options: { backgroundColor }, left, top, width, height } = this;
          if (backgroundColor) {
            ctx.save();
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(left, top, width, height);
            ctx.restore();
          }
        }
        getLineWidthForValue(value) {
          const grid = this.options.grid;
          if (!this._isVisible() || !grid.display) {
            return 0;
          }
          const ticks = this.ticks;
          const index = ticks.findIndex((t) => t.value === value);
          if (index >= 0) {
            const opts = grid.setContext(this.getContext(index));
            return opts.lineWidth;
          }
          return 0;
        }
        drawGrid(chartArea) {
          const grid = this.options.grid;
          const ctx = this.ctx;
          const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
          let i, ilen;
          const drawLine = (p1, p2, style) => {
            if (!style.width || !style.color) {
              return;
            }
            ctx.save();
            ctx.lineWidth = style.width;
            ctx.strokeStyle = style.color;
            ctx.setLineDash(style.borderDash || []);
            ctx.lineDashOffset = style.borderDashOffset;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          };
          if (grid.display) {
            for (i = 0, ilen = items.length; i < ilen; ++i) {
              const item = items[i];
              if (grid.drawOnChartArea) {
                drawLine({
                  x: item.x1,
                  y: item.y1
                }, {
                  x: item.x2,
                  y: item.y2
                }, item);
              }
              if (grid.drawTicks) {
                drawLine({
                  x: item.tx1,
                  y: item.ty1
                }, {
                  x: item.tx2,
                  y: item.ty2
                }, {
                  color: item.tickColor,
                  width: item.tickWidth,
                  borderDash: item.tickBorderDash,
                  borderDashOffset: item.tickBorderDashOffset
                });
              }
            }
          }
        }
        drawBorder() {
          const { chart, ctx, options: { border, grid } } = this;
          const borderOpts = border.setContext(this.getContext());
          const axisWidth = border.display ? borderOpts.width : 0;
          if (!axisWidth) {
            return;
          }
          const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
          const borderValue = this._borderValue;
          let x1, x2, y1, y2;
          if (this.isHorizontal()) {
            x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
            x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
            y1 = y2 = borderValue;
          } else {
            y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
            y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
            x1 = x2 = borderValue;
          }
          ctx.save();
          ctx.lineWidth = borderOpts.width;
          ctx.strokeStyle = borderOpts.color;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();
        }
        drawLabels(chartArea) {
          const optionTicks = this.options.ticks;
          if (!optionTicks.display) {
            return;
          }
          const ctx = this.ctx;
          const area = this._computeLabelArea();
          if (area) {
            clipArea(ctx, area);
          }
          const items = this.getLabelItems(chartArea);
          for (const item of items) {
            const renderTextOptions = item.options;
            const tickFont = item.font;
            const label = item.label;
            const y = item.textOffset;
            renderText(ctx, label, 0, y, tickFont, renderTextOptions);
          }
          if (area) {
            unclipArea(ctx);
          }
        }
        drawTitle() {
          const { ctx, options: { position, title, reverse } } = this;
          if (!title.display) {
            return;
          }
          const font = toFont(title.font);
          const padding = toPadding(title.padding);
          const align = title.align;
          let offset = font.lineHeight / 2;
          if (position === "bottom" || position === "center" || isObject(position)) {
            offset += padding.bottom;
            if (isArray(title.text)) {
              offset += font.lineHeight * (title.text.length - 1);
            }
          } else {
            offset += padding.top;
          }
          const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
          renderText(ctx, title.text, 0, 0, font, {
            color: title.color,
            maxWidth,
            rotation,
            textAlign: titleAlign(align, position, reverse),
            textBaseline: "middle",
            translation: [
              titleX,
              titleY
            ]
          });
        }
        draw(chartArea) {
          if (!this._isVisible()) {
            return;
          }
          this.drawBackground();
          this.drawGrid(chartArea);
          this.drawBorder();
          this.drawTitle();
          this.drawLabels(chartArea);
        }
        _layers() {
          const opts = this.options;
          const tz = opts.ticks && opts.ticks.z || 0;
          const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
          const bz = valueOrDefault(opts.border && opts.border.z, 0);
          if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
            return [
              {
                z: tz,
                draw: (chartArea) => {
                  this.draw(chartArea);
                }
              }
            ];
          }
          return [
            {
              z: gz,
              draw: (chartArea) => {
                this.drawBackground();
                this.drawGrid(chartArea);
                this.drawTitle();
              }
            },
            {
              z: bz,
              draw: () => {
                this.drawBorder();
              }
            },
            {
              z: tz,
              draw: (chartArea) => {
                this.drawLabels(chartArea);
              }
            }
          ];
        }
        getMatchingVisibleMetas(type) {
          const metas = this.chart.getSortedVisibleDatasetMetas();
          const axisID = this.axis + "AxisID";
          const result = [];
          let i, ilen;
          for (i = 0, ilen = metas.length; i < ilen; ++i) {
            const meta = metas[i];
            if (meta[axisID] === this.id && (!type || meta.type === type)) {
              result.push(meta);
            }
          }
          return result;
        }
        _resolveTickFontOptions(index) {
          const opts = this.options.ticks.setContext(this.getContext(index));
          return toFont(opts.font);
        }
        _maxDigits() {
          const fontSize = this._resolveTickFontOptions(0).lineHeight;
          return (this.isHorizontal() ? this.width : this.height) / fontSize;
        }
      }
      class TypedRegistry {
        constructor(type, scope, override) {
          this.type = type;
          this.scope = scope;
          this.override = override;
          this.items = /* @__PURE__ */ Object.create(null);
        }
        isForType(type) {
          return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
        }
        register(item) {
          const proto = Object.getPrototypeOf(item);
          let parentScope;
          if (isIChartComponent(proto)) {
            parentScope = this.register(proto);
          }
          const items = this.items;
          const id = item.id;
          const scope = this.scope + "." + id;
          if (!id) {
            throw new Error("class does not have id: " + item);
          }
          if (id in items) {
            return scope;
          }
          items[id] = item;
          registerDefaults(item, scope, parentScope);
          if (this.override) {
            defaults.override(item.id, item.overrides);
          }
          return scope;
        }
        get(id) {
          return this.items[id];
        }
        unregister(item) {
          const items = this.items;
          const id = item.id;
          const scope = this.scope;
          if (id in items) {
            delete items[id];
          }
          if (scope && id in defaults[scope]) {
            delete defaults[scope][id];
            if (this.override) {
              delete overrides[id];
            }
          }
        }
      }
      function registerDefaults(item, scope, parentScope) {
        const itemDefaults = merge(/* @__PURE__ */ Object.create(null), [
          parentScope ? defaults.get(parentScope) : {},
          defaults.get(scope),
          item.defaults
        ]);
        defaults.set(scope, itemDefaults);
        if (item.defaultRoutes) {
          routeDefaults(scope, item.defaultRoutes);
        }
        if (item.descriptors) {
          defaults.describe(scope, item.descriptors);
        }
      }
      function routeDefaults(scope, routes) {
        Object.keys(routes).forEach((property) => {
          const propertyParts = property.split(".");
          const sourceName = propertyParts.pop();
          const sourceScope = [
            scope
          ].concat(propertyParts).join(".");
          const parts = routes[property].split(".");
          const targetName = parts.pop();
          const targetScope = parts.join(".");
          defaults.route(sourceScope, sourceName, targetScope, targetName);
        });
      }
      function isIChartComponent(proto) {
        return "id" in proto && "defaults" in proto;
      }
      class Registry {
        constructor() {
          this.controllers = new TypedRegistry(DatasetController, "datasets", true);
          this.elements = new TypedRegistry(Element, "elements");
          this.plugins = new TypedRegistry(Object, "plugins");
          this.scales = new TypedRegistry(Scale, "scales");
          this._typedRegistries = [
            this.controllers,
            this.scales,
            this.elements
          ];
        }
        add(...args) {
          this._each("register", args);
        }
        remove(...args) {
          this._each("unregister", args);
        }
        addControllers(...args) {
          this._each("register", args, this.controllers);
        }
        addElements(...args) {
          this._each("register", args, this.elements);
        }
        addPlugins(...args) {
          this._each("register", args, this.plugins);
        }
        addScales(...args) {
          this._each("register", args, this.scales);
        }
        getController(id) {
          return this._get(id, this.controllers, "controller");
        }
        getElement(id) {
          return this._get(id, this.elements, "element");
        }
        getPlugin(id) {
          return this._get(id, this.plugins, "plugin");
        }
        getScale(id) {
          return this._get(id, this.scales, "scale");
        }
        removeControllers(...args) {
          this._each("unregister", args, this.controllers);
        }
        removeElements(...args) {
          this._each("unregister", args, this.elements);
        }
        removePlugins(...args) {
          this._each("unregister", args, this.plugins);
        }
        removeScales(...args) {
          this._each("unregister", args, this.scales);
        }
        _each(method, args, typedRegistry) {
          [
            ...args
          ].forEach((arg) => {
            const reg = typedRegistry || this._getRegistryForType(arg);
            if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
              this._exec(method, reg, arg);
            } else {
              each(arg, (item) => {
                const itemReg = typedRegistry || this._getRegistryForType(item);
                this._exec(method, itemReg, item);
              });
            }
          });
        }
        _exec(method, registry2, component) {
          const camelMethod = _capitalize(method);
          callback(component["before" + camelMethod], [], component);
          registry2[method](component);
          callback(component["after" + camelMethod], [], component);
        }
        _getRegistryForType(type) {
          for (let i = 0; i < this._typedRegistries.length; i++) {
            const reg = this._typedRegistries[i];
            if (reg.isForType(type)) {
              return reg;
            }
          }
          return this.plugins;
        }
        _get(id, typedRegistry, type) {
          const item = typedRegistry.get(id);
          if (item === void 0) {
            throw new Error('"' + id + '" is not a registered ' + type + ".");
          }
          return item;
        }
      }
      var registry = /* @__PURE__ */ new Registry();
      class PluginService {
        constructor() {
          this._init = [];
        }
        notify(chart, hook, args, filter) {
          if (hook === "beforeInit") {
            this._init = this._createDescriptors(chart, true);
            this._notify(this._init, chart, "install");
          }
          const descriptors2 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
          const result = this._notify(descriptors2, chart, hook, args);
          if (hook === "afterDestroy") {
            this._notify(descriptors2, chart, "stop");
            this._notify(this._init, chart, "uninstall");
          }
          return result;
        }
        _notify(descriptors2, chart, hook, args) {
          args = args || {};
          for (const descriptor of descriptors2) {
            const plugin = descriptor.plugin;
            const method = plugin[hook];
            const params = [
              chart,
              args,
              descriptor.options
            ];
            if (callback(method, params, plugin) === false && args.cancelable) {
              return false;
            }
          }
          return true;
        }
        invalidate() {
          if (!isNullOrUndef(this._cache)) {
            this._oldCache = this._cache;
            this._cache = void 0;
          }
        }
        _descriptors(chart) {
          if (this._cache) {
            return this._cache;
          }
          const descriptors2 = this._cache = this._createDescriptors(chart);
          this._notifyStateChanges(chart);
          return descriptors2;
        }
        _createDescriptors(chart, all) {
          const config = chart && chart.config;
          const options = valueOrDefault(config.options && config.options.plugins, {});
          const plugins = allPlugins(config);
          return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
        }
        _notifyStateChanges(chart) {
          const previousDescriptors = this._oldCache || [];
          const descriptors2 = this._cache;
          const diff = (a, b) => a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id));
          this._notify(diff(previousDescriptors, descriptors2), chart, "stop");
          this._notify(diff(descriptors2, previousDescriptors), chart, "start");
        }
      }
      function allPlugins(config) {
        const localIds = {};
        const plugins = [];
        const keys = Object.keys(registry.plugins.items);
        for (let i = 0; i < keys.length; i++) {
          plugins.push(registry.getPlugin(keys[i]));
        }
        const local = config.plugins || [];
        for (let i = 0; i < local.length; i++) {
          const plugin = local[i];
          if (plugins.indexOf(plugin) === -1) {
            plugins.push(plugin);
            localIds[plugin.id] = true;
          }
        }
        return {
          plugins,
          localIds
        };
      }
      function getOpts(options, all) {
        if (!all && options === false) {
          return null;
        }
        if (options === true) {
          return {};
        }
        return options;
      }
      function createDescriptors(chart, { plugins, localIds }, options, all) {
        const result = [];
        const context = chart.getContext();
        for (const plugin of plugins) {
          const id = plugin.id;
          const opts = getOpts(options[id], all);
          if (opts === null) {
            continue;
          }
          result.push({
            plugin,
            options: pluginOpts(chart.config, {
              plugin,
              local: localIds[id]
            }, opts, context)
          });
        }
        return result;
      }
      function pluginOpts(config, { plugin, local }, opts, context) {
        const keys = config.pluginScopeKeys(plugin);
        const scopes = config.getOptionScopes(opts, keys);
        if (local && plugin.defaults) {
          scopes.push(plugin.defaults);
        }
        return config.createResolver(scopes, context, [
          ""
        ], {
          scriptable: false,
          indexable: false,
          allKeys: true
        });
      }
      function getIndexAxis(type, options) {
        const datasetDefaults = defaults.datasets[type] || {};
        const datasetOptions = (options.datasets || {})[type] || {};
        return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || "x";
      }
      function getAxisFromDefaultScaleID(id, indexAxis) {
        let axis = id;
        if (id === "_index_") {
          axis = indexAxis;
        } else if (id === "_value_") {
          axis = indexAxis === "x" ? "y" : "x";
        }
        return axis;
      }
      function getDefaultScaleIDFromAxis(axis, indexAxis) {
        return axis === indexAxis ? "_index_" : "_value_";
      }
      function idMatchesAxis(id) {
        if (id === "x" || id === "y" || id === "r") {
          return id;
        }
      }
      function axisFromPosition(position) {
        if (position === "top" || position === "bottom") {
          return "x";
        }
        if (position === "left" || position === "right") {
          return "y";
        }
      }
      function determineAxis(id, ...scaleOptions) {
        if (idMatchesAxis(id)) {
          return id;
        }
        for (const opts of scaleOptions) {
          const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
          if (axis) {
            return axis;
          }
        }
        throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
      }
      function getAxisFromDataset(id, axis, dataset) {
        if (dataset[axis + "AxisID"] === id) {
          return {
            axis
          };
        }
      }
      function retrieveAxisFromDatasets(id, config) {
        if (config.data && config.data.datasets) {
          const boundDs = config.data.datasets.filter((d) => d.xAxisID === id || d.yAxisID === id);
          if (boundDs.length) {
            return getAxisFromDataset(id, "x", boundDs[0]) || getAxisFromDataset(id, "y", boundDs[0]);
          }
        }
        return {};
      }
      function mergeScaleConfig(config, options) {
        const chartDefaults = overrides[config.type] || {
          scales: {}
        };
        const configScales = options.scales || {};
        const chartIndexAxis = getIndexAxis(config.type, options);
        const scales = /* @__PURE__ */ Object.create(null);
        Object.keys(configScales).forEach((id) => {
          const scaleConf = configScales[id];
          if (!isObject(scaleConf)) {
            return console.error(`Invalid scale configuration for scale: ${id}`);
          }
          if (scaleConf._proxy) {
            return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
          }
          const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
          const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
          const defaultScaleOptions = chartDefaults.scales || {};
          scales[id] = mergeIf(/* @__PURE__ */ Object.create(null), [
            {
              axis
            },
            scaleConf,
            defaultScaleOptions[axis],
            defaultScaleOptions[defaultId]
          ]);
        });
        config.data.datasets.forEach((dataset) => {
          const type = dataset.type || config.type;
          const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
          const datasetDefaults = overrides[type] || {};
          const defaultScaleOptions = datasetDefaults.scales || {};
          Object.keys(defaultScaleOptions).forEach((defaultID) => {
            const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
            const id = dataset[axis + "AxisID"] || axis;
            scales[id] = scales[id] || /* @__PURE__ */ Object.create(null);
            mergeIf(scales[id], [
              {
                axis
              },
              configScales[id],
              defaultScaleOptions[defaultID]
            ]);
          });
        });
        Object.keys(scales).forEach((key) => {
          const scale = scales[key];
          mergeIf(scale, [
            defaults.scales[scale.type],
            defaults.scale
          ]);
        });
        return scales;
      }
      function initOptions(config) {
        const options = config.options || (config.options = {});
        options.plugins = valueOrDefault(options.plugins, {});
        options.scales = mergeScaleConfig(config, options);
      }
      function initData(data) {
        data = data || {};
        data.datasets = data.datasets || [];
        data.labels = data.labels || [];
        return data;
      }
      function initConfig(config) {
        config = config || {};
        config.data = initData(config.data);
        initOptions(config);
        return config;
      }
      const keyCache = /* @__PURE__ */ new Map();
      const keysCached = /* @__PURE__ */ new Set();
      function cachedKeys(cacheKey, generate) {
        let keys = keyCache.get(cacheKey);
        if (!keys) {
          keys = generate();
          keyCache.set(cacheKey, keys);
          keysCached.add(keys);
        }
        return keys;
      }
      const addIfFound = (set2, obj, key) => {
        const opts = resolveObjectKey(obj, key);
        if (opts !== void 0) {
          set2.add(opts);
        }
      };
      class Config {
        constructor(config) {
          this._config = initConfig(config);
          this._scopeCache = /* @__PURE__ */ new Map();
          this._resolverCache = /* @__PURE__ */ new Map();
        }
        get platform() {
          return this._config.platform;
        }
        get type() {
          return this._config.type;
        }
        set type(type) {
          this._config.type = type;
        }
        get data() {
          return this._config.data;
        }
        set data(data) {
          this._config.data = initData(data);
        }
        get options() {
          return this._config.options;
        }
        set options(options) {
          this._config.options = options;
        }
        get plugins() {
          return this._config.plugins;
        }
        update() {
          const config = this._config;
          this.clearCache();
          initOptions(config);
        }
        clearCache() {
          this._scopeCache.clear();
          this._resolverCache.clear();
        }
        datasetScopeKeys(datasetType) {
          return cachedKeys(datasetType, () => [
            [
              `datasets.${datasetType}`,
              ""
            ]
          ]);
        }
        datasetAnimationScopeKeys(datasetType, transition) {
          return cachedKeys(`${datasetType}.transition.${transition}`, () => [
            [
              `datasets.${datasetType}.transitions.${transition}`,
              `transitions.${transition}`
            ],
            [
              `datasets.${datasetType}`,
              ""
            ]
          ]);
        }
        datasetElementScopeKeys(datasetType, elementType) {
          return cachedKeys(`${datasetType}-${elementType}`, () => [
            [
              `datasets.${datasetType}.elements.${elementType}`,
              `datasets.${datasetType}`,
              `elements.${elementType}`,
              ""
            ]
          ]);
        }
        pluginScopeKeys(plugin) {
          const id = plugin.id;
          const type = this.type;
          return cachedKeys(`${type}-plugin-${id}`, () => [
            [
              `plugins.${id}`,
              ...plugin.additionalOptionScopes || []
            ]
          ]);
        }
        _cachedScopes(mainScope, resetCache) {
          const _scopeCache = this._scopeCache;
          let cache = _scopeCache.get(mainScope);
          if (!cache || resetCache) {
            cache = /* @__PURE__ */ new Map();
            _scopeCache.set(mainScope, cache);
          }
          return cache;
        }
        getOptionScopes(mainScope, keyLists, resetCache) {
          const { options, type } = this;
          const cache = this._cachedScopes(mainScope, resetCache);
          const cached = cache.get(keyLists);
          if (cached) {
            return cached;
          }
          const scopes = /* @__PURE__ */ new Set();
          keyLists.forEach((keys) => {
            if (mainScope) {
              scopes.add(mainScope);
              keys.forEach((key) => addIfFound(scopes, mainScope, key));
            }
            keys.forEach((key) => addIfFound(scopes, options, key));
            keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
            keys.forEach((key) => addIfFound(scopes, defaults, key));
            keys.forEach((key) => addIfFound(scopes, descriptors, key));
          });
          const array = Array.from(scopes);
          if (array.length === 0) {
            array.push(/* @__PURE__ */ Object.create(null));
          }
          if (keysCached.has(keyLists)) {
            cache.set(keyLists, array);
          }
          return array;
        }
        chartOptionScopes() {
          const { options, type } = this;
          return [
            options,
            overrides[type] || {},
            defaults.datasets[type] || {},
            {
              type
            },
            defaults,
            descriptors
          ];
        }
        resolveNamedOptions(scopes, names2, context, prefixes = [
          ""
        ]) {
          const result = {
            $shared: true
          };
          const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
          let options = resolver;
          if (needContext(resolver, names2)) {
            result.$shared = false;
            context = isFunction(context) ? context() : context;
            const subResolver = this.createResolver(scopes, context, subPrefixes);
            options = _attachContext(resolver, context, subResolver);
          }
          for (const prop of names2) {
            result[prop] = options[prop];
          }
          return result;
        }
        createResolver(scopes, context, prefixes = [
          ""
        ], descriptorDefaults) {
          const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
          return isObject(context) ? _attachContext(resolver, context, void 0, descriptorDefaults) : resolver;
        }
      }
      function getResolver(resolverCache, scopes, prefixes) {
        let cache = resolverCache.get(scopes);
        if (!cache) {
          cache = /* @__PURE__ */ new Map();
          resolverCache.set(scopes, cache);
        }
        const cacheKey = prefixes.join();
        let cached = cache.get(cacheKey);
        if (!cached) {
          const resolver = _createResolver(scopes, prefixes);
          cached = {
            resolver,
            subPrefixes: prefixes.filter((p) => !p.toLowerCase().includes("hover"))
          };
          cache.set(cacheKey, cached);
        }
        return cached;
      }
      const hasFunction = (value) => isObject(value) && Object.getOwnPropertyNames(value).some((key) => isFunction(value[key]));
      function needContext(proxy, names2) {
        const { isScriptable, isIndexable } = _descriptors(proxy);
        for (const prop of names2) {
          const scriptable = isScriptable(prop);
          const indexable = isIndexable(prop);
          const value = (indexable || scriptable) && proxy[prop];
          if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
            return true;
          }
        }
        return false;
      }
      var version = "4.5.0";
      const KNOWN_POSITIONS = [
        "top",
        "bottom",
        "left",
        "right",
        "chartArea"
      ];
      function positionIsHorizontal(position, axis) {
        return position === "top" || position === "bottom" || KNOWN_POSITIONS.indexOf(position) === -1 && axis === "x";
      }
      function compare2Level(l1, l2) {
        return function(a, b) {
          return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
        };
      }
      function onAnimationsComplete(context) {
        const chart = context.chart;
        const animationOptions = chart.options.animation;
        chart.notifyPlugins("afterRender");
        callback(animationOptions && animationOptions.onComplete, [
          context
        ], chart);
      }
      function onAnimationProgress(context) {
        const chart = context.chart;
        const animationOptions = chart.options.animation;
        callback(animationOptions && animationOptions.onProgress, [
          context
        ], chart);
      }
      function getCanvas(item) {
        if (_isDomSupported() && typeof item === "string") {
          item = document.getElementById(item);
        } else if (item && item.length) {
          item = item[0];
        }
        if (item && item.canvas) {
          item = item.canvas;
        }
        return item;
      }
      const instances = {};
      const getChart = (key) => {
        const canvas = getCanvas(key);
        return Object.values(instances).filter((c) => c.canvas === canvas).pop();
      };
      function moveNumericKeys(obj, start, move) {
        const keys = Object.keys(obj);
        for (const key of keys) {
          const intKey = +key;
          if (intKey >= start) {
            const value = obj[key];
            delete obj[key];
            if (move > 0 || intKey > start) {
              obj[intKey + move] = value;
            }
          }
        }
      }
      function determineLastEvent(e, lastEvent, inChartArea, isClick) {
        if (!inChartArea || e.type === "mouseout") {
          return null;
        }
        if (isClick) {
          return lastEvent;
        }
        return e;
      }
      let Chart$1 = (_a = class {
        static register(...items) {
          registry.add(...items);
          invalidatePlugins();
        }
        static unregister(...items) {
          registry.remove(...items);
          invalidatePlugins();
        }
        constructor(item, userConfig) {
          const config = this.config = new Config(userConfig);
          const initialCanvas = getCanvas(item);
          const existingChart = getChart(initialCanvas);
          if (existingChart) {
            throw new Error("Canvas is already in use. Chart with ID '" + existingChart.id + "' must be destroyed before the canvas with ID '" + existingChart.canvas.id + "' can be reused.");
          }
          const options = config.createResolver(config.chartOptionScopes(), this.getContext());
          this.platform = new (config.platform || _detectPlatform(initialCanvas))();
          this.platform.updateConfig(config);
          const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
          const canvas = context && context.canvas;
          const height = canvas && canvas.height;
          const width = canvas && canvas.width;
          this.id = uid();
          this.ctx = context;
          this.canvas = canvas;
          this.width = width;
          this.height = height;
          this._options = options;
          this._aspectRatio = this.aspectRatio;
          this._layers = [];
          this._metasets = [];
          this._stacks = void 0;
          this.boxes = [];
          this.currentDevicePixelRatio = void 0;
          this.chartArea = void 0;
          this._active = [];
          this._lastEvent = void 0;
          this._listeners = {};
          this._responsiveListeners = void 0;
          this._sortedMetasets = [];
          this.scales = {};
          this._plugins = new PluginService();
          this.$proxies = {};
          this._hiddenIndices = {};
          this.attached = false;
          this._animationsDisabled = void 0;
          this.$context = void 0;
          this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
          this._dataChanges = [];
          instances[this.id] = this;
          if (!context || !canvas) {
            console.error("Failed to create chart: can't acquire context from the given item");
            return;
          }
          animator.listen(this, "complete", onAnimationsComplete);
          animator.listen(this, "progress", onAnimationProgress);
          this._initialize();
          if (this.attached) {
            this.update();
          }
        }
        get aspectRatio() {
          const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
          if (!isNullOrUndef(aspectRatio)) {
            return aspectRatio;
          }
          if (maintainAspectRatio && _aspectRatio) {
            return _aspectRatio;
          }
          return height ? width / height : null;
        }
        get data() {
          return this.config.data;
        }
        set data(data) {
          this.config.data = data;
        }
        get options() {
          return this._options;
        }
        set options(options) {
          this.config.options = options;
        }
        get registry() {
          return registry;
        }
        _initialize() {
          this.notifyPlugins("beforeInit");
          if (this.options.responsive) {
            this.resize();
          } else {
            retinaScale(this, this.options.devicePixelRatio);
          }
          this.bindEvents();
          this.notifyPlugins("afterInit");
          return this;
        }
        clear() {
          clearCanvas(this.canvas, this.ctx);
          return this;
        }
        stop() {
          animator.stop(this);
          return this;
        }
        resize(width, height) {
          if (!animator.running(this)) {
            this._resize(width, height);
          } else {
            this._resizeBeforeDraw = {
              width,
              height
            };
          }
        }
        _resize(width, height) {
          const options = this.options;
          const canvas = this.canvas;
          const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
          const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
          const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
          const mode = this.width ? "resize" : "attach";
          this.width = newSize.width;
          this.height = newSize.height;
          this._aspectRatio = this.aspectRatio;
          if (!retinaScale(this, newRatio, true)) {
            return;
          }
          this.notifyPlugins("resize", {
            size: newSize
          });
          callback(options.onResize, [
            this,
            newSize
          ], this);
          if (this.attached) {
            if (this._doResize(mode)) {
              this.render();
            }
          }
        }
        ensureScalesHaveIDs() {
          const options = this.options;
          const scalesOptions = options.scales || {};
          each(scalesOptions, (axisOptions, axisID) => {
            axisOptions.id = axisID;
          });
        }
        buildOrUpdateScales() {
          const options = this.options;
          const scaleOpts = options.scales;
          const scales = this.scales;
          const updated = Object.keys(scales).reduce((obj, id) => {
            obj[id] = false;
            return obj;
          }, {});
          let items = [];
          if (scaleOpts) {
            items = items.concat(Object.keys(scaleOpts).map((id) => {
              const scaleOptions = scaleOpts[id];
              const axis = determineAxis(id, scaleOptions);
              const isRadial = axis === "r";
              const isHorizontal = axis === "x";
              return {
                options: scaleOptions,
                dposition: isRadial ? "chartArea" : isHorizontal ? "bottom" : "left",
                dtype: isRadial ? "radialLinear" : isHorizontal ? "category" : "linear"
              };
            }));
          }
          each(items, (item) => {
            const scaleOptions = item.options;
            const id = scaleOptions.id;
            const axis = determineAxis(id, scaleOptions);
            const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
            if (scaleOptions.position === void 0 || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
              scaleOptions.position = item.dposition;
            }
            updated[id] = true;
            let scale = null;
            if (id in scales && scales[id].type === scaleType) {
              scale = scales[id];
            } else {
              const scaleClass = registry.getScale(scaleType);
              scale = new scaleClass({
                id,
                type: scaleType,
                ctx: this.ctx,
                chart: this
              });
              scales[scale.id] = scale;
            }
            scale.init(scaleOptions, options);
          });
          each(updated, (hasUpdated, id) => {
            if (!hasUpdated) {
              delete scales[id];
            }
          });
          each(scales, (scale) => {
            layouts.configure(this, scale, scale.options);
            layouts.addBox(this, scale);
          });
        }
        _updateMetasets() {
          const metasets = this._metasets;
          const numData = this.data.datasets.length;
          const numMeta = metasets.length;
          metasets.sort((a, b) => a.index - b.index);
          if (numMeta > numData) {
            for (let i = numData; i < numMeta; ++i) {
              this._destroyDatasetMeta(i);
            }
            metasets.splice(numData, numMeta - numData);
          }
          this._sortedMetasets = metasets.slice(0).sort(compare2Level("order", "index"));
        }
        _removeUnreferencedMetasets() {
          const { _metasets: metasets, data: { datasets } } = this;
          if (metasets.length > datasets.length) {
            delete this._stacks;
          }
          metasets.forEach((meta, index) => {
            if (datasets.filter((x) => x === meta._dataset).length === 0) {
              this._destroyDatasetMeta(index);
            }
          });
        }
        buildOrUpdateControllers() {
          const newControllers = [];
          const datasets = this.data.datasets;
          let i, ilen;
          this._removeUnreferencedMetasets();
          for (i = 0, ilen = datasets.length; i < ilen; i++) {
            const dataset = datasets[i];
            let meta = this.getDatasetMeta(i);
            const type = dataset.type || this.config.type;
            if (meta.type && meta.type !== type) {
              this._destroyDatasetMeta(i);
              meta = this.getDatasetMeta(i);
            }
            meta.type = type;
            meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
            meta.order = dataset.order || 0;
            meta.index = i;
            meta.label = "" + dataset.label;
            meta.visible = this.isDatasetVisible(i);
            if (meta.controller) {
              meta.controller.updateIndex(i);
              meta.controller.linkScales();
            } else {
              const ControllerClass = registry.getController(type);
              const { datasetElementType, dataElementType } = defaults.datasets[type];
              Object.assign(ControllerClass, {
                dataElementType: registry.getElement(dataElementType),
                datasetElementType: datasetElementType && registry.getElement(datasetElementType)
              });
              meta.controller = new ControllerClass(this, i);
              newControllers.push(meta.controller);
            }
          }
          this._updateMetasets();
          return newControllers;
        }
        _resetElements() {
          each(this.data.datasets, (dataset, datasetIndex) => {
            this.getDatasetMeta(datasetIndex).controller.reset();
          }, this);
        }
        reset() {
          this._resetElements();
          this.notifyPlugins("reset");
        }
        update(mode) {
          const config = this.config;
          config.update();
          const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
          const animsDisabled = this._animationsDisabled = !options.animation;
          this._updateScales();
          this._checkEventBindings();
          this._updateHiddenIndices();
          this._plugins.invalidate();
          if (this.notifyPlugins("beforeUpdate", {
            mode,
            cancelable: true
          }) === false) {
            return;
          }
          const newControllers = this.buildOrUpdateControllers();
          this.notifyPlugins("beforeElementsUpdate");
          let minPadding = 0;
          for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
            const { controller } = this.getDatasetMeta(i);
            const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
            controller.buildOrUpdateElements(reset);
            minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
          }
          minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
          this._updateLayout(minPadding);
          if (!animsDisabled) {
            each(newControllers, (controller) => {
              controller.reset();
            });
          }
          this._updateDatasets(mode);
          this.notifyPlugins("afterUpdate", {
            mode
          });
          this._layers.sort(compare2Level("z", "_idx"));
          const { _active, _lastEvent } = this;
          if (_lastEvent) {
            this._eventHandler(_lastEvent, true);
          } else if (_active.length) {
            this._updateHoverStyles(_active, _active, true);
          }
          this.render();
        }
        _updateScales() {
          each(this.scales, (scale) => {
            layouts.removeBox(this, scale);
          });
          this.ensureScalesHaveIDs();
          this.buildOrUpdateScales();
        }
        _checkEventBindings() {
          const options = this.options;
          const existingEvents = new Set(Object.keys(this._listeners));
          const newEvents = new Set(options.events);
          if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
            this.unbindEvents();
            this.bindEvents();
          }
        }
        _updateHiddenIndices() {
          const { _hiddenIndices } = this;
          const changes = this._getUniformDataChanges() || [];
          for (const { method, start, count } of changes) {
            const move = method === "_removeElements" ? -count : count;
            moveNumericKeys(_hiddenIndices, start, move);
          }
        }
        _getUniformDataChanges() {
          const _dataChanges = this._dataChanges;
          if (!_dataChanges || !_dataChanges.length) {
            return;
          }
          this._dataChanges = [];
          const datasetCount = this.data.datasets.length;
          const makeSet = (idx) => new Set(_dataChanges.filter((c) => c[0] === idx).map((c, i) => i + "," + c.splice(1).join(",")));
          const changeSet = makeSet(0);
          for (let i = 1; i < datasetCount; i++) {
            if (!setsEqual(changeSet, makeSet(i))) {
              return;
            }
          }
          return Array.from(changeSet).map((c) => c.split(",")).map((a) => ({
            method: a[1],
            start: +a[2],
            count: +a[3]
          }));
        }
        _updateLayout(minPadding) {
          if (this.notifyPlugins("beforeLayout", {
            cancelable: true
          }) === false) {
            return;
          }
          layouts.update(this, this.width, this.height, minPadding);
          const area = this.chartArea;
          const noArea = area.width <= 0 || area.height <= 0;
          this._layers = [];
          each(this.boxes, (box) => {
            if (noArea && box.position === "chartArea") {
              return;
            }
            if (box.configure) {
              box.configure();
            }
            this._layers.push(...box._layers());
          }, this);
          this._layers.forEach((item, index) => {
            item._idx = index;
          });
          this.notifyPlugins("afterLayout");
        }
        _updateDatasets(mode) {
          if (this.notifyPlugins("beforeDatasetsUpdate", {
            mode,
            cancelable: true
          }) === false) {
            return;
          }
          for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
            this.getDatasetMeta(i).controller.configure();
          }
          for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
            this._updateDataset(i, isFunction(mode) ? mode({
              datasetIndex: i
            }) : mode);
          }
          this.notifyPlugins("afterDatasetsUpdate", {
            mode
          });
        }
        _updateDataset(index, mode) {
          const meta = this.getDatasetMeta(index);
          const args = {
            meta,
            index,
            mode,
            cancelable: true
          };
          if (this.notifyPlugins("beforeDatasetUpdate", args) === false) {
            return;
          }
          meta.controller._update(mode);
          args.cancelable = false;
          this.notifyPlugins("afterDatasetUpdate", args);
        }
        render() {
          if (this.notifyPlugins("beforeRender", {
            cancelable: true
          }) === false) {
            return;
          }
          if (animator.has(this)) {
            if (this.attached && !animator.running(this)) {
              animator.start(this);
            }
          } else {
            this.draw();
            onAnimationsComplete({
              chart: this
            });
          }
        }
        draw() {
          let i;
          if (this._resizeBeforeDraw) {
            const { width, height } = this._resizeBeforeDraw;
            this._resizeBeforeDraw = null;
            this._resize(width, height);
          }
          this.clear();
          if (this.width <= 0 || this.height <= 0) {
            return;
          }
          if (this.notifyPlugins("beforeDraw", {
            cancelable: true
          }) === false) {
            return;
          }
          const layers = this._layers;
          for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
            layers[i].draw(this.chartArea);
          }
          this._drawDatasets();
          for (; i < layers.length; ++i) {
            layers[i].draw(this.chartArea);
          }
          this.notifyPlugins("afterDraw");
        }
        _getSortedDatasetMetas(filterVisible) {
          const metasets = this._sortedMetasets;
          const result = [];
          let i, ilen;
          for (i = 0, ilen = metasets.length; i < ilen; ++i) {
            const meta = metasets[i];
            if (!filterVisible || meta.visible) {
              result.push(meta);
            }
          }
          return result;
        }
        getSortedVisibleDatasetMetas() {
          return this._getSortedDatasetMetas(true);
        }
        _drawDatasets() {
          if (this.notifyPlugins("beforeDatasetsDraw", {
            cancelable: true
          }) === false) {
            return;
          }
          const metasets = this.getSortedVisibleDatasetMetas();
          for (let i = metasets.length - 1; i >= 0; --i) {
            this._drawDataset(metasets[i]);
          }
          this.notifyPlugins("afterDatasetsDraw");
        }
        _drawDataset(meta) {
          const ctx = this.ctx;
          const args = {
            meta,
            index: meta.index,
            cancelable: true
          };
          const clip = getDatasetClipArea(this, meta);
          if (this.notifyPlugins("beforeDatasetDraw", args) === false) {
            return;
          }
          if (clip) {
            clipArea(ctx, clip);
          }
          meta.controller.draw();
          if (clip) {
            unclipArea(ctx);
          }
          args.cancelable = false;
          this.notifyPlugins("afterDatasetDraw", args);
        }
        isPointInArea(point) {
          return _isPointInArea(point, this.chartArea, this._minPadding);
        }
        getElementsAtEventForMode(e, mode, options, useFinalPosition) {
          const method = Interaction.modes[mode];
          if (typeof method === "function") {
            return method(this, e, options, useFinalPosition);
          }
          return [];
        }
        getDatasetMeta(datasetIndex) {
          const dataset = this.data.datasets[datasetIndex];
          const metasets = this._metasets;
          let meta = metasets.filter((x) => x && x._dataset === dataset).pop();
          if (!meta) {
            meta = {
              type: null,
              data: [],
              dataset: null,
              controller: null,
              hidden: null,
              xAxisID: null,
              yAxisID: null,
              order: dataset && dataset.order || 0,
              index: datasetIndex,
              _dataset: dataset,
              _parsed: [],
              _sorted: false
            };
            metasets.push(meta);
          }
          return meta;
        }
        getContext() {
          return this.$context || (this.$context = createContext(null, {
            chart: this,
            type: "chart"
          }));
        }
        getVisibleDatasetCount() {
          return this.getSortedVisibleDatasetMetas().length;
        }
        isDatasetVisible(datasetIndex) {
          const dataset = this.data.datasets[datasetIndex];
          if (!dataset) {
            return false;
          }
          const meta = this.getDatasetMeta(datasetIndex);
          return typeof meta.hidden === "boolean" ? !meta.hidden : !dataset.hidden;
        }
        setDatasetVisibility(datasetIndex, visible) {
          const meta = this.getDatasetMeta(datasetIndex);
          meta.hidden = !visible;
        }
        toggleDataVisibility(index) {
          this._hiddenIndices[index] = !this._hiddenIndices[index];
        }
        getDataVisibility(index) {
          return !this._hiddenIndices[index];
        }
        _updateVisibility(datasetIndex, dataIndex, visible) {
          const mode = visible ? "show" : "hide";
          const meta = this.getDatasetMeta(datasetIndex);
          const anims = meta.controller._resolveAnimations(void 0, mode);
          if (defined(dataIndex)) {
            meta.data[dataIndex].hidden = !visible;
            this.update();
          } else {
            this.setDatasetVisibility(datasetIndex, visible);
            anims.update(meta, {
              visible
            });
            this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : void 0);
          }
        }
        hide(datasetIndex, dataIndex) {
          this._updateVisibility(datasetIndex, dataIndex, false);
        }
        show(datasetIndex, dataIndex) {
          this._updateVisibility(datasetIndex, dataIndex, true);
        }
        _destroyDatasetMeta(datasetIndex) {
          const meta = this._metasets[datasetIndex];
          if (meta && meta.controller) {
            meta.controller._destroy();
          }
          delete this._metasets[datasetIndex];
        }
        _stop() {
          let i, ilen;
          this.stop();
          animator.remove(this);
          for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
            this._destroyDatasetMeta(i);
          }
        }
        destroy() {
          this.notifyPlugins("beforeDestroy");
          const { canvas, ctx } = this;
          this._stop();
          this.config.clearCache();
          if (canvas) {
            this.unbindEvents();
            clearCanvas(canvas, ctx);
            this.platform.releaseContext(ctx);
            this.canvas = null;
            this.ctx = null;
          }
          delete instances[this.id];
          this.notifyPlugins("afterDestroy");
        }
        toBase64Image(...args) {
          return this.canvas.toDataURL(...args);
        }
        bindEvents() {
          this.bindUserEvents();
          if (this.options.responsive) {
            this.bindResponsiveEvents();
          } else {
            this.attached = true;
          }
        }
        bindUserEvents() {
          const listeners = this._listeners;
          const platform = this.platform;
          const _add = (type, listener2) => {
            platform.addEventListener(this, type, listener2);
            listeners[type] = listener2;
          };
          const listener = (e, x, y) => {
            e.offsetX = x;
            e.offsetY = y;
            this._eventHandler(e);
          };
          each(this.options.events, (type) => _add(type, listener));
        }
        bindResponsiveEvents() {
          if (!this._responsiveListeners) {
            this._responsiveListeners = {};
          }
          const listeners = this._responsiveListeners;
          const platform = this.platform;
          const _add = (type, listener2) => {
            platform.addEventListener(this, type, listener2);
            listeners[type] = listener2;
          };
          const _remove = (type, listener2) => {
            if (listeners[type]) {
              platform.removeEventListener(this, type, listener2);
              delete listeners[type];
            }
          };
          const listener = (width, height) => {
            if (this.canvas) {
              this.resize(width, height);
            }
          };
          let detached;
          const attached = () => {
            _remove("attach", attached);
            this.attached = true;
            this.resize();
            _add("resize", listener);
            _add("detach", detached);
          };
          detached = () => {
            this.attached = false;
            _remove("resize", listener);
            this._stop();
            this._resize(0, 0);
            _add("attach", attached);
          };
          if (platform.isAttached(this.canvas)) {
            attached();
          } else {
            detached();
          }
        }
        unbindEvents() {
          each(this._listeners, (listener, type) => {
            this.platform.removeEventListener(this, type, listener);
          });
          this._listeners = {};
          each(this._responsiveListeners, (listener, type) => {
            this.platform.removeEventListener(this, type, listener);
          });
          this._responsiveListeners = void 0;
        }
        updateHoverStyle(items, mode, enabled) {
          const prefix = enabled ? "set" : "remove";
          let meta, item, i, ilen;
          if (mode === "dataset") {
            meta = this.getDatasetMeta(items[0].datasetIndex);
            meta.controller["_" + prefix + "DatasetHoverStyle"]();
          }
          for (i = 0, ilen = items.length; i < ilen; ++i) {
            item = items[i];
            const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
            if (controller) {
              controller[prefix + "HoverStyle"](item.element, item.datasetIndex, item.index);
            }
          }
        }
        getActiveElements() {
          return this._active || [];
        }
        setActiveElements(activeElements) {
          const lastActive = this._active || [];
          const active = activeElements.map(({ datasetIndex, index }) => {
            const meta = this.getDatasetMeta(datasetIndex);
            if (!meta) {
              throw new Error("No dataset found at index " + datasetIndex);
            }
            return {
              datasetIndex,
              element: meta.data[index],
              index
            };
          });
          const changed = !_elementsEqual(active, lastActive);
          if (changed) {
            this._active = active;
            this._lastEvent = null;
            this._updateHoverStyles(active, lastActive);
          }
        }
        notifyPlugins(hook, args, filter) {
          return this._plugins.notify(this, hook, args, filter);
        }
        isPluginEnabled(pluginId) {
          return this._plugins._cache.filter((p) => p.plugin.id === pluginId).length === 1;
        }
        _updateHoverStyles(active, lastActive, replay) {
          const hoverOptions = this.options.hover;
          const diff = (a, b) => a.filter((x) => !b.some((y) => x.datasetIndex === y.datasetIndex && x.index === y.index));
          const deactivated = diff(lastActive, active);
          const activated = replay ? active : diff(active, lastActive);
          if (deactivated.length) {
            this.updateHoverStyle(deactivated, hoverOptions.mode, false);
          }
          if (activated.length && hoverOptions.mode) {
            this.updateHoverStyle(activated, hoverOptions.mode, true);
          }
        }
        _eventHandler(e, replay) {
          const args = {
            event: e,
            replay,
            cancelable: true,
            inChartArea: this.isPointInArea(e)
          };
          const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
          if (this.notifyPlugins("beforeEvent", args, eventFilter) === false) {
            return;
          }
          const changed = this._handleEvent(e, replay, args.inChartArea);
          args.cancelable = false;
          this.notifyPlugins("afterEvent", args, eventFilter);
          if (changed || args.changed) {
            this.render();
          }
          return this;
        }
        _handleEvent(e, replay, inChartArea) {
          const { _active: lastActive = [], options } = this;
          const useFinalPosition = replay;
          const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
          const isClick = _isClickEvent(e);
          const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
          if (inChartArea) {
            this._lastEvent = null;
            callback(options.onHover, [
              e,
              active,
              this
            ], this);
            if (isClick) {
              callback(options.onClick, [
                e,
                active,
                this
              ], this);
            }
          }
          const changed = !_elementsEqual(active, lastActive);
          if (changed || replay) {
            this._active = active;
            this._updateHoverStyles(active, lastActive, replay);
          }
          this._lastEvent = lastEvent;
          return changed;
        }
        _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
          if (e.type === "mouseout") {
            return [];
          }
          if (!inChartArea) {
            return lastActive;
          }
          const hoverOptions = this.options.hover;
          return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
        }
      }, __publicField(_a, "defaults", defaults), __publicField(_a, "instances", instances), __publicField(_a, "overrides", overrides), __publicField(_a, "registry", registry), __publicField(_a, "version", version), __publicField(_a, "getChart", getChart), _a);
      function invalidatePlugins() {
        return each(Chart$1.instances, (chart) => chart._plugins.invalidate());
      }
      function clipSelf(ctx, element, endAngle) {
        const { startAngle, x, y, outerRadius, innerRadius, options } = element;
        const { borderWidth, borderJoinStyle } = options;
        const outerAngleClip = Math.min(borderWidth / outerRadius, _normalizeAngle(startAngle - endAngle));
        ctx.beginPath();
        ctx.arc(x, y, outerRadius - borderWidth / 2, startAngle + outerAngleClip / 2, endAngle - outerAngleClip / 2);
        if (innerRadius > 0) {
          const innerAngleClip = Math.min(borderWidth / innerRadius, _normalizeAngle(startAngle - endAngle));
          ctx.arc(x, y, innerRadius + borderWidth / 2, endAngle - innerAngleClip / 2, startAngle + innerAngleClip / 2, true);
        } else {
          const clipWidth = Math.min(borderWidth / 2, outerRadius * _normalizeAngle(startAngle - endAngle));
          if (borderJoinStyle === "round") {
            ctx.arc(x, y, clipWidth, endAngle - PI / 2, startAngle + PI / 2, true);
          } else if (borderJoinStyle === "bevel") {
            const r = 2 * clipWidth * clipWidth;
            const endX = -r * Math.cos(endAngle + PI / 2) + x;
            const endY = -r * Math.sin(endAngle + PI / 2) + y;
            const startX = r * Math.cos(startAngle + PI / 2) + x;
            const startY = r * Math.sin(startAngle + PI / 2) + y;
            ctx.lineTo(endX, endY);
            ctx.lineTo(startX, startY);
          }
        }
        ctx.closePath();
        ctx.moveTo(0, 0);
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clip("evenodd");
      }
      function clipArc(ctx, element, endAngle) {
        const { startAngle, pixelMargin, x, y, outerRadius, innerRadius } = element;
        let angleMargin = pixelMargin / outerRadius;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
        if (innerRadius > pixelMargin) {
          angleMargin = pixelMargin / innerRadius;
          ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
        } else {
          ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
        }
        ctx.closePath();
        ctx.clip();
      }
      function toRadiusCorners(value) {
        return _readValueToProps(value, [
          "outerStart",
          "outerEnd",
          "innerStart",
          "innerEnd"
        ]);
      }
      function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
        const o = toRadiusCorners(arc.options.borderRadius);
        const halfThickness = (outerRadius - innerRadius) / 2;
        const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
        const computeOuterLimit = (val) => {
          const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
          return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
        };
        return {
          outerStart: computeOuterLimit(o.outerStart),
          outerEnd: computeOuterLimit(o.outerEnd),
          innerStart: _limitValue(o.innerStart, 0, innerLimit),
          innerEnd: _limitValue(o.innerEnd, 0, innerLimit)
        };
      }
      function rThetaToXY(r, theta, x, y) {
        return {
          x: x + r * Math.cos(theta),
          y: y + r * Math.sin(theta)
        };
      }
      function pathArc(ctx, element, offset, spacing, end, circular) {
        const { x, y, startAngle: start, pixelMargin, innerRadius: innerR } = element;
        const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
        const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
        let spacingOffset = 0;
        const alpha2 = end - start;
        if (spacing) {
          const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
          const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
          const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
          const adjustedAngle = avNogSpacingRadius !== 0 ? alpha2 * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha2;
          spacingOffset = (alpha2 - adjustedAngle) / 2;
        }
        const beta = Math.max(1e-3, alpha2 * outerRadius - offset / PI) / outerRadius;
        const angleOffset = (alpha2 - beta) / 2;
        const startAngle = start + angleOffset + spacingOffset;
        const endAngle = end - angleOffset - spacingOffset;
        const { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
        const outerStartAdjustedRadius = outerRadius - outerStart;
        const outerEndAdjustedRadius = outerRadius - outerEnd;
        const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
        const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
        const innerStartAdjustedRadius = innerRadius + innerStart;
        const innerEndAdjustedRadius = innerRadius + innerEnd;
        const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
        const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
        ctx.beginPath();
        if (circular) {
          const outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
          ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
          ctx.arc(x, y, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
          if (outerEnd > 0) {
            const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
          }
          const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
          ctx.lineTo(p4.x, p4.y);
          if (innerEnd > 0) {
            const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
          }
          const innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
          ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
          ctx.arc(x, y, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
          if (innerStart > 0) {
            const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
          }
          const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
          ctx.lineTo(p8.x, p8.y);
          if (outerStart > 0) {
            const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
          }
        } else {
          ctx.moveTo(x, y);
          const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x;
          const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y;
          ctx.lineTo(outerStartX, outerStartY);
          const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x;
          const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y;
          ctx.lineTo(outerEndX, outerEndY);
        }
        ctx.closePath();
      }
      function drawArc(ctx, element, offset, spacing, circular) {
        const { fullCircles, startAngle, circumference } = element;
        let endAngle = element.endAngle;
        if (fullCircles) {
          pathArc(ctx, element, offset, spacing, endAngle, circular);
          for (let i = 0; i < fullCircles; ++i) {
            ctx.fill();
          }
          if (!isNaN(circumference)) {
            endAngle = startAngle + (circumference % TAU || TAU);
          }
        }
        pathArc(ctx, element, offset, spacing, endAngle, circular);
        ctx.fill();
        return endAngle;
      }
      function drawBorder(ctx, element, offset, spacing, circular) {
        const { fullCircles, startAngle, circumference, options } = element;
        const { borderWidth, borderJoinStyle, borderDash, borderDashOffset, borderRadius } = options;
        const inner = options.borderAlign === "inner";
        if (!borderWidth) {
          return;
        }
        ctx.setLineDash(borderDash || []);
        ctx.lineDashOffset = borderDashOffset;
        if (inner) {
          ctx.lineWidth = borderWidth * 2;
          ctx.lineJoin = borderJoinStyle || "round";
        } else {
          ctx.lineWidth = borderWidth;
          ctx.lineJoin = borderJoinStyle || "bevel";
        }
        let endAngle = element.endAngle;
        if (fullCircles) {
          pathArc(ctx, element, offset, spacing, endAngle, circular);
          for (let i = 0; i < fullCircles; ++i) {
            ctx.stroke();
          }
          if (!isNaN(circumference)) {
            endAngle = startAngle + (circumference % TAU || TAU);
          }
        }
        if (inner) {
          clipArc(ctx, element, endAngle);
        }
        if (options.selfJoin && endAngle - startAngle >= PI && borderRadius === 0 && borderJoinStyle !== "miter") {
          clipSelf(ctx, element, endAngle);
        }
        if (!fullCircles) {
          pathArc(ctx, element, offset, spacing, endAngle, circular);
          ctx.stroke();
        }
      }
      class ArcElement extends Element {
        constructor(cfg) {
          super();
          __publicField(this, "circumference");
          __publicField(this, "endAngle");
          __publicField(this, "fullCircles");
          __publicField(this, "innerRadius");
          __publicField(this, "outerRadius");
          __publicField(this, "pixelMargin");
          __publicField(this, "startAngle");
          this.options = void 0;
          this.circumference = void 0;
          this.startAngle = void 0;
          this.endAngle = void 0;
          this.innerRadius = void 0;
          this.outerRadius = void 0;
          this.pixelMargin = 0;
          this.fullCircles = 0;
          if (cfg) {
            Object.assign(this, cfg);
          }
        }
        inRange(chartX, chartY, useFinalPosition) {
          const point = this.getProps([
            "x",
            "y"
          ], useFinalPosition);
          const { angle, distance } = getAngleFromPoint(point, {
            x: chartX,
            y: chartY
          });
          const { startAngle, endAngle, innerRadius, outerRadius, circumference } = this.getProps([
            "startAngle",
            "endAngle",
            "innerRadius",
            "outerRadius",
            "circumference"
          ], useFinalPosition);
          const rAdjust = (this.options.spacing + this.options.borderWidth) / 2;
          const _circumference = valueOrDefault(circumference, endAngle - startAngle);
          const nonZeroBetween = _angleBetween(angle, startAngle, endAngle) && startAngle !== endAngle;
          const betweenAngles = _circumference >= TAU || nonZeroBetween;
          const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
          return betweenAngles && withinRadius;
        }
        getCenterPoint(useFinalPosition) {
          const { x, y, startAngle, endAngle, innerRadius, outerRadius } = this.getProps([
            "x",
            "y",
            "startAngle",
            "endAngle",
            "innerRadius",
            "outerRadius"
          ], useFinalPosition);
          const { offset, spacing } = this.options;
          const halfAngle = (startAngle + endAngle) / 2;
          const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
          return {
            x: x + Math.cos(halfAngle) * halfRadius,
            y: y + Math.sin(halfAngle) * halfRadius
          };
        }
        tooltipPosition(useFinalPosition) {
          return this.getCenterPoint(useFinalPosition);
        }
        draw(ctx) {
          const { options, circumference } = this;
          const offset = (options.offset || 0) / 4;
          const spacing = (options.spacing || 0) / 2;
          const circular = options.circular;
          this.pixelMargin = options.borderAlign === "inner" ? 0.33 : 0;
          this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
          if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
            return;
          }
          ctx.save();
          const halfAngle = (this.startAngle + this.endAngle) / 2;
          ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
          const fix = 1 - Math.sin(Math.min(PI, circumference || 0));
          const radiusOffset = offset * fix;
          ctx.fillStyle = options.backgroundColor;
          ctx.strokeStyle = options.borderColor;
          drawArc(ctx, this, radiusOffset, spacing, circular);
          drawBorder(ctx, this, radiusOffset, spacing, circular);
          ctx.restore();
        }
      }
      __publicField(ArcElement, "id", "arc");
      __publicField(ArcElement, "defaults", {
        borderAlign: "center",
        borderColor: "#fff",
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: void 0,
        borderRadius: 0,
        borderWidth: 2,
        offset: 0,
        spacing: 0,
        angle: void 0,
        circular: true,
        selfJoin: false
      });
      __publicField(ArcElement, "defaultRoutes", {
        backgroundColor: "backgroundColor"
      });
      __publicField(ArcElement, "descriptors", {
        _scriptable: true,
        _indexable: (name) => name !== "borderDash"
      });
      const getBoxSize = (labelOpts, fontSize) => {
        let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
        if (labelOpts.usePointStyle) {
          boxHeight = Math.min(boxHeight, fontSize);
          boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
        }
        return {
          boxWidth,
          boxHeight,
          itemHeight: Math.max(fontSize, boxHeight)
        };
      };
      const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
      class Legend extends Element {
        constructor(config) {
          super();
          this._added = false;
          this.legendHitBoxes = [];
          this._hoveredItem = null;
          this.doughnutMode = false;
          this.chart = config.chart;
          this.options = config.options;
          this.ctx = config.ctx;
          this.legendItems = void 0;
          this.columnSizes = void 0;
          this.lineWidths = void 0;
          this.maxHeight = void 0;
          this.maxWidth = void 0;
          this.top = void 0;
          this.bottom = void 0;
          this.left = void 0;
          this.right = void 0;
          this.height = void 0;
          this.width = void 0;
          this._margins = void 0;
          this.position = void 0;
          this.weight = void 0;
          this.fullSize = void 0;
        }
        update(maxWidth, maxHeight, margins) {
          this.maxWidth = maxWidth;
          this.maxHeight = maxHeight;
          this._margins = margins;
          this.setDimensions();
          this.buildLabels();
          this.fit();
        }
        setDimensions() {
          if (this.isHorizontal()) {
            this.width = this.maxWidth;
            this.left = this._margins.left;
            this.right = this.width;
          } else {
            this.height = this.maxHeight;
            this.top = this._margins.top;
            this.bottom = this.height;
          }
        }
        buildLabels() {
          const labelOpts = this.options.labels || {};
          let legendItems = callback(labelOpts.generateLabels, [
            this.chart
          ], this) || [];
          if (labelOpts.filter) {
            legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
          }
          if (labelOpts.sort) {
            legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
          }
          if (this.options.reverse) {
            legendItems.reverse();
          }
          this.legendItems = legendItems;
        }
        fit() {
          const { options, ctx } = this;
          if (!options.display) {
            this.width = this.height = 0;
            return;
          }
          const labelOpts = options.labels;
          const labelFont = toFont(labelOpts.font);
          const fontSize = labelFont.size;
          const titleHeight = this._computeTitleHeight();
          const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
          let width, height;
          ctx.font = labelFont.string;
          if (this.isHorizontal()) {
            width = this.maxWidth;
            height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
          } else {
            height = this.maxHeight;
            width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
          }
          this.width = Math.min(width, options.maxWidth || this.maxWidth);
          this.height = Math.min(height, options.maxHeight || this.maxHeight);
        }
        _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
          const { ctx, maxWidth, options: { labels: { padding } } } = this;
          const hitboxes = this.legendHitBoxes = [];
          const lineWidths = this.lineWidths = [
            0
          ];
          const lineHeight = itemHeight + padding;
          let totalHeight = titleHeight;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          let row = -1;
          let top = -lineHeight;
          this.legendItems.forEach((legendItem, i) => {
            const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
            if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
              totalHeight += lineHeight;
              lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
              top += lineHeight;
              row++;
            }
            hitboxes[i] = {
              left: 0,
              top,
              row,
              width: itemWidth,
              height: itemHeight
            };
            lineWidths[lineWidths.length - 1] += itemWidth + padding;
          });
          return totalHeight;
        }
        _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
          const { ctx, maxHeight, options: { labels: { padding } } } = this;
          const hitboxes = this.legendHitBoxes = [];
          const columnSizes = this.columnSizes = [];
          const heightLimit = maxHeight - titleHeight;
          let totalWidth = padding;
          let currentColWidth = 0;
          let currentColHeight = 0;
          let left = 0;
          let col = 0;
          this.legendItems.forEach((legendItem, i) => {
            const { itemWidth, itemHeight } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
            if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
              totalWidth += currentColWidth + padding;
              columnSizes.push({
                width: currentColWidth,
                height: currentColHeight
              });
              left += currentColWidth + padding;
              col++;
              currentColWidth = currentColHeight = 0;
            }
            hitboxes[i] = {
              left,
              top: currentColHeight,
              col,
              width: itemWidth,
              height: itemHeight
            };
            currentColWidth = Math.max(currentColWidth, itemWidth);
            currentColHeight += itemHeight + padding;
          });
          totalWidth += currentColWidth;
          columnSizes.push({
            width: currentColWidth,
            height: currentColHeight
          });
          return totalWidth;
        }
        adjustHitBoxes() {
          if (!this.options.display) {
            return;
          }
          const titleHeight = this._computeTitleHeight();
          const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
          const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
          if (this.isHorizontal()) {
            let row = 0;
            let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
            for (const hitbox of hitboxes) {
              if (row !== hitbox.row) {
                row = hitbox.row;
                left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
              }
              hitbox.top += this.top + titleHeight + padding;
              hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
              left += hitbox.width + padding;
            }
          } else {
            let col = 0;
            let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
            for (const hitbox of hitboxes) {
              if (hitbox.col !== col) {
                col = hitbox.col;
                top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
              }
              hitbox.top = top;
              hitbox.left += this.left + padding;
              hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
              top += hitbox.height + padding;
            }
          }
        }
        isHorizontal() {
          return this.options.position === "top" || this.options.position === "bottom";
        }
        draw() {
          if (this.options.display) {
            const ctx = this.ctx;
            clipArea(ctx, this);
            this._draw();
            unclipArea(ctx);
          }
        }
        _draw() {
          const { options: opts, columnSizes, lineWidths, ctx } = this;
          const { align, labels: labelOpts } = opts;
          const defaultColor = defaults.color;
          const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
          const labelFont = toFont(labelOpts.font);
          const { padding } = labelOpts;
          const fontSize = labelFont.size;
          const halfFontSize = fontSize / 2;
          let cursor;
          this.drawTitle();
          ctx.textAlign = rtlHelper.textAlign("left");
          ctx.textBaseline = "middle";
          ctx.lineWidth = 0.5;
          ctx.font = labelFont.string;
          const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
          const drawLegendBox = function(x, y, legendItem) {
            if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
              return;
            }
            ctx.save();
            const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
            ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
            ctx.lineCap = valueOrDefault(legendItem.lineCap, "butt");
            ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
            ctx.lineJoin = valueOrDefault(legendItem.lineJoin, "miter");
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
            ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
            if (labelOpts.usePointStyle) {
              const drawOptions = {
                radius: boxHeight * Math.SQRT2 / 2,
                pointStyle: legendItem.pointStyle,
                rotation: legendItem.rotation,
                borderWidth: lineWidth
              };
              const centerX = rtlHelper.xPlus(x, boxWidth / 2);
              const centerY = y + halfFontSize;
              drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
            } else {
              const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
              const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
              const borderRadius = toTRBLCorners(legendItem.borderRadius);
              ctx.beginPath();
              if (Object.values(borderRadius).some((v) => v !== 0)) {
                addRoundedRectPath(ctx, {
                  x: xBoxLeft,
                  y: yBoxTop,
                  w: boxWidth,
                  h: boxHeight,
                  radius: borderRadius
                });
              } else {
                ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
              }
              ctx.fill();
              if (lineWidth !== 0) {
                ctx.stroke();
              }
            }
            ctx.restore();
          };
          const fillText = function(x, y, legendItem) {
            renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
              strikethrough: legendItem.hidden,
              textAlign: rtlHelper.textAlign(legendItem.textAlign)
            });
          };
          const isHorizontal = this.isHorizontal();
          const titleHeight = this._computeTitleHeight();
          if (isHorizontal) {
            cursor = {
              x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
              y: this.top + padding + titleHeight,
              line: 0
            };
          } else {
            cursor = {
              x: this.left + padding,
              y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
              line: 0
            };
          }
          overrideTextDirection(this.ctx, opts.textDirection);
          const lineHeight = itemHeight + padding;
          this.legendItems.forEach((legendItem, i) => {
            ctx.strokeStyle = legendItem.fontColor;
            ctx.fillStyle = legendItem.fontColor;
            const textWidth = ctx.measureText(legendItem.text).width;
            const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
            const width = boxWidth + halfFontSize + textWidth;
            let x = cursor.x;
            let y = cursor.y;
            rtlHelper.setWidth(this.width);
            if (isHorizontal) {
              if (i > 0 && x + width + padding > this.right) {
                y = cursor.y += lineHeight;
                cursor.line++;
                x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
              }
            } else if (i > 0 && y + lineHeight > this.bottom) {
              x = cursor.x = x + columnSizes[cursor.line].width + padding;
              cursor.line++;
              y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
            }
            const realX = rtlHelper.x(x);
            drawLegendBox(realX, y, legendItem);
            x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
            fillText(rtlHelper.x(x), y, legendItem);
            if (isHorizontal) {
              cursor.x += width + padding;
            } else if (typeof legendItem.text !== "string") {
              const fontLineHeight = labelFont.lineHeight;
              cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
            } else {
              cursor.y += lineHeight;
            }
          });
          restoreTextDirection(this.ctx, opts.textDirection);
        }
        drawTitle() {
          const opts = this.options;
          const titleOpts = opts.title;
          const titleFont = toFont(titleOpts.font);
          const titlePadding = toPadding(titleOpts.padding);
          if (!titleOpts.display) {
            return;
          }
          const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
          const ctx = this.ctx;
          const position = titleOpts.position;
          const halfFontSize = titleFont.size / 2;
          const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
          let y;
          let left = this.left;
          let maxWidth = this.width;
          if (this.isHorizontal()) {
            maxWidth = Math.max(...this.lineWidths);
            y = this.top + topPaddingPlusHalfFontSize;
            left = _alignStartEnd(opts.align, left, this.right - maxWidth);
          } else {
            const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
            y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
          }
          const x = _alignStartEnd(position, left, left + maxWidth);
          ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
          ctx.textBaseline = "middle";
          ctx.strokeStyle = titleOpts.color;
          ctx.fillStyle = titleOpts.color;
          ctx.font = titleFont.string;
          renderText(ctx, titleOpts.text, x, y, titleFont);
        }
        _computeTitleHeight() {
          const titleOpts = this.options.title;
          const titleFont = toFont(titleOpts.font);
          const titlePadding = toPadding(titleOpts.padding);
          return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
        }
        _getLegendItemAt(x, y) {
          let i, hitBox, lh;
          if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
            lh = this.legendHitBoxes;
            for (i = 0; i < lh.length; ++i) {
              hitBox = lh[i];
              if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
                return this.legendItems[i];
              }
            }
          }
          return null;
        }
        handleEvent(e) {
          const opts = this.options;
          if (!isListened(e.type, opts)) {
            return;
          }
          const hoveredItem = this._getLegendItemAt(e.x, e.y);
          if (e.type === "mousemove" || e.type === "mouseout") {
            const previous = this._hoveredItem;
            const sameItem = itemsEqual(previous, hoveredItem);
            if (previous && !sameItem) {
              callback(opts.onLeave, [
                e,
                previous,
                this
              ], this);
            }
            this._hoveredItem = hoveredItem;
            if (hoveredItem && !sameItem) {
              callback(opts.onHover, [
                e,
                hoveredItem,
                this
              ], this);
            }
          } else if (hoveredItem) {
            callback(opts.onClick, [
              e,
              hoveredItem,
              this
            ], this);
          }
        }
      }
      function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
        const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
        const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
        return {
          itemWidth,
          itemHeight
        };
      }
      function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
        let legendItemText = legendItem.text;
        if (legendItemText && typeof legendItemText !== "string") {
          legendItemText = legendItemText.reduce((a, b) => a.length > b.length ? a : b);
        }
        return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
      }
      function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
        let itemHeight = _itemHeight;
        if (typeof legendItem.text !== "string") {
          itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
        }
        return itemHeight;
      }
      function calculateLegendItemHeight(legendItem, fontLineHeight) {
        const labelHeight = legendItem.text ? legendItem.text.length : 0;
        return fontLineHeight * labelHeight;
      }
      function isListened(type, opts) {
        if ((type === "mousemove" || type === "mouseout") && (opts.onHover || opts.onLeave)) {
          return true;
        }
        if (opts.onClick && (type === "click" || type === "mouseup")) {
          return true;
        }
        return false;
      }
      var plugin_legend = {
        id: "legend",
        _element: Legend,
        start(chart, _args, options) {
          const legend = chart.legend = new Legend({
            ctx: chart.ctx,
            options,
            chart
          });
          layouts.configure(chart, legend, options);
          layouts.addBox(chart, legend);
        },
        stop(chart) {
          layouts.removeBox(chart, chart.legend);
          delete chart.legend;
        },
        beforeUpdate(chart, _args, options) {
          const legend = chart.legend;
          layouts.configure(chart, legend, options);
          legend.options = options;
        },
        afterUpdate(chart) {
          const legend = chart.legend;
          legend.buildLabels();
          legend.adjustHitBoxes();
        },
        afterEvent(chart, args) {
          if (!args.replay) {
            chart.legend.handleEvent(args.event);
          }
        },
        defaults: {
          display: true,
          position: "top",
          align: "center",
          fullSize: true,
          reverse: false,
          weight: 1e3,
          onClick(e, legendItem, legend) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            if (ci.isDatasetVisible(index)) {
              ci.hide(index);
              legendItem.hidden = true;
            } else {
              ci.show(index);
              legendItem.hidden = false;
            }
          },
          onHover: null,
          onLeave: null,
          labels: {
            color: (ctx) => ctx.chart.options.color,
            boxWidth: 40,
            padding: 10,
            generateLabels(chart) {
              const datasets = chart.data.datasets;
              const { labels: { usePointStyle, pointStyle, textAlign, color: color2, useBorderRadius, borderRadius } } = chart.legend.options;
              return chart._getSortedDatasetMetas().map((meta) => {
                const style = meta.controller.getStyle(usePointStyle ? 0 : void 0);
                const borderWidth = toPadding(style.borderWidth);
                return {
                  text: datasets[meta.index].label,
                  fillStyle: style.backgroundColor,
                  fontColor: color2,
                  hidden: !meta.visible,
                  lineCap: style.borderCapStyle,
                  lineDash: style.borderDash,
                  lineDashOffset: style.borderDashOffset,
                  lineJoin: style.borderJoinStyle,
                  lineWidth: (borderWidth.width + borderWidth.height) / 4,
                  strokeStyle: style.borderColor,
                  pointStyle: pointStyle || style.pointStyle,
                  rotation: style.rotation,
                  textAlign: textAlign || style.textAlign,
                  borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                  datasetIndex: meta.index
                };
              }, this);
            }
          },
          title: {
            color: (ctx) => ctx.chart.options.color,
            display: false,
            position: "center",
            text: ""
          }
        },
        descriptors: {
          _scriptable: (name) => !name.startsWith("on"),
          labels: {
            _scriptable: (name) => ![
              "generateLabels",
              "filter",
              "sort"
            ].includes(name)
          }
        }
      };
      class Title extends Element {
        constructor(config) {
          super();
          this.chart = config.chart;
          this.options = config.options;
          this.ctx = config.ctx;
          this._padding = void 0;
          this.top = void 0;
          this.bottom = void 0;
          this.left = void 0;
          this.right = void 0;
          this.width = void 0;
          this.height = void 0;
          this.position = void 0;
          this.weight = void 0;
          this.fullSize = void 0;
        }
        update(maxWidth, maxHeight) {
          const opts = this.options;
          this.left = 0;
          this.top = 0;
          if (!opts.display) {
            this.width = this.height = this.right = this.bottom = 0;
            return;
          }
          this.width = this.right = maxWidth;
          this.height = this.bottom = maxHeight;
          const lineCount = isArray(opts.text) ? opts.text.length : 1;
          this._padding = toPadding(opts.padding);
          const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
          if (this.isHorizontal()) {
            this.height = textSize;
          } else {
            this.width = textSize;
          }
        }
        isHorizontal() {
          const pos = this.options.position;
          return pos === "top" || pos === "bottom";
        }
        _drawArgs(offset) {
          const { top, left, bottom, right, options } = this;
          const align = options.align;
          let rotation = 0;
          let maxWidth, titleX, titleY;
          if (this.isHorizontal()) {
            titleX = _alignStartEnd(align, left, right);
            titleY = top + offset;
            maxWidth = right - left;
          } else {
            if (options.position === "left") {
              titleX = left + offset;
              titleY = _alignStartEnd(align, bottom, top);
              rotation = PI * -0.5;
            } else {
              titleX = right - offset;
              titleY = _alignStartEnd(align, top, bottom);
              rotation = PI * 0.5;
            }
            maxWidth = bottom - top;
          }
          return {
            titleX,
            titleY,
            maxWidth,
            rotation
          };
        }
        draw() {
          const ctx = this.ctx;
          const opts = this.options;
          if (!opts.display) {
            return;
          }
          const fontOpts = toFont(opts.font);
          const lineHeight = fontOpts.lineHeight;
          const offset = lineHeight / 2 + this._padding.top;
          const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
          renderText(ctx, opts.text, 0, 0, fontOpts, {
            color: opts.color,
            maxWidth,
            rotation,
            textAlign: _toLeftRightCenter(opts.align),
            textBaseline: "middle",
            translation: [
              titleX,
              titleY
            ]
          });
        }
      }
      function createTitle(chart, titleOpts) {
        const title = new Title({
          ctx: chart.ctx,
          options: titleOpts,
          chart
        });
        layouts.configure(chart, title, titleOpts);
        layouts.addBox(chart, title);
        chart.titleBlock = title;
      }
      var plugin_title = {
        id: "title",
        _element: Title,
        start(chart, _args, options) {
          createTitle(chart, options);
        },
        stop(chart) {
          const titleBlock = chart.titleBlock;
          layouts.removeBox(chart, titleBlock);
          delete chart.titleBlock;
        },
        beforeUpdate(chart, _args, options) {
          const title = chart.titleBlock;
          layouts.configure(chart, title, options);
          title.options = options;
        },
        defaults: {
          align: "center",
          display: false,
          font: {
            weight: "bold"
          },
          fullSize: true,
          padding: 10,
          position: "top",
          text: "",
          weight: 2e3
        },
        defaultRoutes: {
          color: "color"
        },
        descriptors: {
          _scriptable: true,
          _indexable: false
        }
      };
      const positioners = {
        average(items) {
          if (!items.length) {
            return false;
          }
          let i, len;
          let xSet = /* @__PURE__ */ new Set();
          let y = 0;
          let count = 0;
          for (i = 0, len = items.length; i < len; ++i) {
            const el = items[i].element;
            if (el && el.hasValue()) {
              const pos = el.tooltipPosition();
              xSet.add(pos.x);
              y += pos.y;
              ++count;
            }
          }
          if (count === 0 || xSet.size === 0) {
            return false;
          }
          const xAverage = [
            ...xSet
          ].reduce((a, b) => a + b) / xSet.size;
          return {
            x: xAverage,
            y: y / count
          };
        },
        nearest(items, eventPosition) {
          if (!items.length) {
            return false;
          }
          let x = eventPosition.x;
          let y = eventPosition.y;
          let minDistance = Number.POSITIVE_INFINITY;
          let i, len, nearestElement;
          for (i = 0, len = items.length; i < len; ++i) {
            const el = items[i].element;
            if (el && el.hasValue()) {
              const center = el.getCenterPoint();
              const d = distanceBetweenPoints(eventPosition, center);
              if (d < minDistance) {
                minDistance = d;
                nearestElement = el;
              }
            }
          }
          if (nearestElement) {
            const tp = nearestElement.tooltipPosition();
            x = tp.x;
            y = tp.y;
          }
          return {
            x,
            y
          };
        }
      };
      function pushOrConcat(base, toPush) {
        if (toPush) {
          if (isArray(toPush)) {
            Array.prototype.push.apply(base, toPush);
          } else {
            base.push(toPush);
          }
        }
        return base;
      }
      function splitNewlines(str) {
        if ((typeof str === "string" || str instanceof String) && str.indexOf("\n") > -1) {
          return str.split("\n");
        }
        return str;
      }
      function createTooltipItem(chart, item) {
        const { element, datasetIndex, index } = item;
        const controller = chart.getDatasetMeta(datasetIndex).controller;
        const { label, value } = controller.getLabelAndValue(index);
        return {
          chart,
          label,
          parsed: controller.getParsed(index),
          raw: chart.data.datasets[datasetIndex].data[index],
          formattedValue: value,
          dataset: controller.getDataset(),
          dataIndex: index,
          datasetIndex,
          element
        };
      }
      function getTooltipSize(tooltip, options) {
        const ctx = tooltip.chart.ctx;
        const { body, footer, title } = tooltip;
        const { boxWidth, boxHeight } = options;
        const bodyFont = toFont(options.bodyFont);
        const titleFont = toFont(options.titleFont);
        const footerFont = toFont(options.footerFont);
        const titleLineCount = title.length;
        const footerLineCount = footer.length;
        const bodyLineItemCount = body.length;
        const padding = toPadding(options.padding);
        let height = padding.height;
        let width = 0;
        let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
        combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
        if (titleLineCount) {
          height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
        }
        if (combinedBodyLength) {
          const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
          height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
        }
        if (footerLineCount) {
          height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
        }
        let widthPadding = 0;
        const maxLineWidth = function(line) {
          width = Math.max(width, ctx.measureText(line).width + widthPadding);
        };
        ctx.save();
        ctx.font = titleFont.string;
        each(tooltip.title, maxLineWidth);
        ctx.font = bodyFont.string;
        each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
        widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
        each(body, (bodyItem) => {
          each(bodyItem.before, maxLineWidth);
          each(bodyItem.lines, maxLineWidth);
          each(bodyItem.after, maxLineWidth);
        });
        widthPadding = 0;
        ctx.font = footerFont.string;
        each(tooltip.footer, maxLineWidth);
        ctx.restore();
        width += padding.width;
        return {
          width,
          height
        };
      }
      function determineYAlign(chart, size) {
        const { y, height } = size;
        if (y < height / 2) {
          return "top";
        } else if (y > chart.height - height / 2) {
          return "bottom";
        }
        return "center";
      }
      function doesNotFitWithAlign(xAlign, chart, options, size) {
        const { x, width } = size;
        const caret = options.caretSize + options.caretPadding;
        if (xAlign === "left" && x + width + caret > chart.width) {
          return true;
        }
        if (xAlign === "right" && x - width - caret < 0) {
          return true;
        }
      }
      function determineXAlign(chart, options, size, yAlign) {
        const { x, width } = size;
        const { width: chartWidth, chartArea: { left, right } } = chart;
        let xAlign = "center";
        if (yAlign === "center") {
          xAlign = x <= (left + right) / 2 ? "left" : "right";
        } else if (x <= width / 2) {
          xAlign = "left";
        } else if (x >= chartWidth - width / 2) {
          xAlign = "right";
        }
        if (doesNotFitWithAlign(xAlign, chart, options, size)) {
          xAlign = "center";
        }
        return xAlign;
      }
      function determineAlignment(chart, options, size) {
        const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
        return {
          xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
          yAlign
        };
      }
      function alignX(size, xAlign) {
        let { x, width } = size;
        if (xAlign === "right") {
          x -= width;
        } else if (xAlign === "center") {
          x -= width / 2;
        }
        return x;
      }
      function alignY(size, yAlign, paddingAndSize) {
        let { y, height } = size;
        if (yAlign === "top") {
          y += paddingAndSize;
        } else if (yAlign === "bottom") {
          y -= height + paddingAndSize;
        } else {
          y -= height / 2;
        }
        return y;
      }
      function getBackgroundPoint(options, size, alignment, chart) {
        const { caretSize, caretPadding, cornerRadius } = options;
        const { xAlign, yAlign } = alignment;
        const paddingAndSize = caretSize + caretPadding;
        const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
        let x = alignX(size, xAlign);
        const y = alignY(size, yAlign, paddingAndSize);
        if (yAlign === "center") {
          if (xAlign === "left") {
            x += paddingAndSize;
          } else if (xAlign === "right") {
            x -= paddingAndSize;
          }
        } else if (xAlign === "left") {
          x -= Math.max(topLeft, bottomLeft) + caretSize;
        } else if (xAlign === "right") {
          x += Math.max(topRight, bottomRight) + caretSize;
        }
        return {
          x: _limitValue(x, 0, chart.width - size.width),
          y: _limitValue(y, 0, chart.height - size.height)
        };
      }
      function getAlignedX(tooltip, align, options) {
        const padding = toPadding(options.padding);
        return align === "center" ? tooltip.x + tooltip.width / 2 : align === "right" ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
      }
      function getBeforeAfterBodyLines(callback2) {
        return pushOrConcat([], splitNewlines(callback2));
      }
      function createTooltipContext(parent, tooltip, tooltipItems) {
        return createContext(parent, {
          tooltip,
          tooltipItems,
          type: "tooltip"
        });
      }
      function overrideCallbacks(callbacks, context) {
        const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
        return override ? callbacks.override(override) : callbacks;
      }
      const defaultCallbacks = {
        beforeTitle: noop,
        title(tooltipItems) {
          if (tooltipItems.length > 0) {
            const item = tooltipItems[0];
            const labels = item.chart.data.labels;
            const labelCount = labels ? labels.length : 0;
            if (this && this.options && this.options.mode === "dataset") {
              return item.dataset.label || "";
            } else if (item.label) {
              return item.label;
            } else if (labelCount > 0 && item.dataIndex < labelCount) {
              return labels[item.dataIndex];
            }
          }
          return "";
        },
        afterTitle: noop,
        beforeBody: noop,
        beforeLabel: noop,
        label(tooltipItem) {
          if (this && this.options && this.options.mode === "dataset") {
            return tooltipItem.label + ": " + tooltipItem.formattedValue || tooltipItem.formattedValue;
          }
          let label = tooltipItem.dataset.label || "";
          if (label) {
            label += ": ";
          }
          const value = tooltipItem.formattedValue;
          if (!isNullOrUndef(value)) {
            label += value;
          }
          return label;
        },
        labelColor(tooltipItem) {
          const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
          const options = meta.controller.getStyle(tooltipItem.dataIndex);
          return {
            borderColor: options.borderColor,
            backgroundColor: options.backgroundColor,
            borderWidth: options.borderWidth,
            borderDash: options.borderDash,
            borderDashOffset: options.borderDashOffset,
            borderRadius: 0
          };
        },
        labelTextColor() {
          return this.options.bodyColor;
        },
        labelPointStyle(tooltipItem) {
          const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
          const options = meta.controller.getStyle(tooltipItem.dataIndex);
          return {
            pointStyle: options.pointStyle,
            rotation: options.rotation
          };
        },
        afterLabel: noop,
        afterBody: noop,
        beforeFooter: noop,
        footer: noop,
        afterFooter: noop
      };
      function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
        const result = callbacks[name].call(ctx, arg);
        if (typeof result === "undefined") {
          return defaultCallbacks[name].call(ctx, arg);
        }
        return result;
      }
      class Tooltip extends Element {
        constructor(config) {
          super();
          this.opacity = 0;
          this._active = [];
          this._eventPosition = void 0;
          this._size = void 0;
          this._cachedAnimations = void 0;
          this._tooltipItems = [];
          this.$animations = void 0;
          this.$context = void 0;
          this.chart = config.chart;
          this.options = config.options;
          this.dataPoints = void 0;
          this.title = void 0;
          this.beforeBody = void 0;
          this.body = void 0;
          this.afterBody = void 0;
          this.footer = void 0;
          this.xAlign = void 0;
          this.yAlign = void 0;
          this.x = void 0;
          this.y = void 0;
          this.height = void 0;
          this.width = void 0;
          this.caretX = void 0;
          this.caretY = void 0;
          this.labelColors = void 0;
          this.labelPointStyles = void 0;
          this.labelTextColors = void 0;
        }
        initialize(options) {
          this.options = options;
          this._cachedAnimations = void 0;
          this.$context = void 0;
        }
        _resolveAnimations() {
          const cached = this._cachedAnimations;
          if (cached) {
            return cached;
          }
          const chart = this.chart;
          const options = this.options.setContext(this.getContext());
          const opts = options.enabled && chart.options.animation && options.animations;
          const animations = new Animations(this.chart, opts);
          if (opts._cacheable) {
            this._cachedAnimations = Object.freeze(animations);
          }
          return animations;
        }
        getContext() {
          return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
        }
        getTitle(context, options) {
          const { callbacks } = options;
          const beforeTitle = invokeCallbackWithFallback(callbacks, "beforeTitle", this, context);
          const title = invokeCallbackWithFallback(callbacks, "title", this, context);
          const afterTitle = invokeCallbackWithFallback(callbacks, "afterTitle", this, context);
          let lines = [];
          lines = pushOrConcat(lines, splitNewlines(beforeTitle));
          lines = pushOrConcat(lines, splitNewlines(title));
          lines = pushOrConcat(lines, splitNewlines(afterTitle));
          return lines;
        }
        getBeforeBody(tooltipItems, options) {
          return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "beforeBody", this, tooltipItems));
        }
        getBody(tooltipItems, options) {
          const { callbacks } = options;
          const bodyItems = [];
          each(tooltipItems, (context) => {
            const bodyItem = {
              before: [],
              lines: [],
              after: []
            };
            const scoped = overrideCallbacks(callbacks, context);
            pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, "beforeLabel", this, context)));
            pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, "label", this, context));
            pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, "afterLabel", this, context)));
            bodyItems.push(bodyItem);
          });
          return bodyItems;
        }
        getAfterBody(tooltipItems, options) {
          return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "afterBody", this, tooltipItems));
        }
        getFooter(tooltipItems, options) {
          const { callbacks } = options;
          const beforeFooter = invokeCallbackWithFallback(callbacks, "beforeFooter", this, tooltipItems);
          const footer = invokeCallbackWithFallback(callbacks, "footer", this, tooltipItems);
          const afterFooter = invokeCallbackWithFallback(callbacks, "afterFooter", this, tooltipItems);
          let lines = [];
          lines = pushOrConcat(lines, splitNewlines(beforeFooter));
          lines = pushOrConcat(lines, splitNewlines(footer));
          lines = pushOrConcat(lines, splitNewlines(afterFooter));
          return lines;
        }
        _createItems(options) {
          const active = this._active;
          const data = this.chart.data;
          const labelColors = [];
          const labelPointStyles = [];
          const labelTextColors = [];
          let tooltipItems = [];
          let i, len;
          for (i = 0, len = active.length; i < len; ++i) {
            tooltipItems.push(createTooltipItem(this.chart, active[i]));
          }
          if (options.filter) {
            tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
          }
          if (options.itemSort) {
            tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
          }
          each(tooltipItems, (context) => {
            const scoped = overrideCallbacks(options.callbacks, context);
            labelColors.push(invokeCallbackWithFallback(scoped, "labelColor", this, context));
            labelPointStyles.push(invokeCallbackWithFallback(scoped, "labelPointStyle", this, context));
            labelTextColors.push(invokeCallbackWithFallback(scoped, "labelTextColor", this, context));
          });
          this.labelColors = labelColors;
          this.labelPointStyles = labelPointStyles;
          this.labelTextColors = labelTextColors;
          this.dataPoints = tooltipItems;
          return tooltipItems;
        }
        update(changed, replay) {
          const options = this.options.setContext(this.getContext());
          const active = this._active;
          let properties;
          let tooltipItems = [];
          if (!active.length) {
            if (this.opacity !== 0) {
              properties = {
                opacity: 0
              };
            }
          } else {
            const position = positioners[options.position].call(this, active, this._eventPosition);
            tooltipItems = this._createItems(options);
            this.title = this.getTitle(tooltipItems, options);
            this.beforeBody = this.getBeforeBody(tooltipItems, options);
            this.body = this.getBody(tooltipItems, options);
            this.afterBody = this.getAfterBody(tooltipItems, options);
            this.footer = this.getFooter(tooltipItems, options);
            const size = this._size = getTooltipSize(this, options);
            const positionAndSize = Object.assign({}, position, size);
            const alignment = determineAlignment(this.chart, options, positionAndSize);
            const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
            this.xAlign = alignment.xAlign;
            this.yAlign = alignment.yAlign;
            properties = {
              opacity: 1,
              x: backgroundPoint.x,
              y: backgroundPoint.y,
              width: size.width,
              height: size.height,
              caretX: position.x,
              caretY: position.y
            };
          }
          this._tooltipItems = tooltipItems;
          this.$context = void 0;
          if (properties) {
            this._resolveAnimations().update(this, properties);
          }
          if (changed && options.external) {
            options.external.call(this, {
              chart: this.chart,
              tooltip: this,
              replay
            });
          }
        }
        drawCaret(tooltipPoint, ctx, size, options) {
          const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
          ctx.lineTo(caretPosition.x1, caretPosition.y1);
          ctx.lineTo(caretPosition.x2, caretPosition.y2);
          ctx.lineTo(caretPosition.x3, caretPosition.y3);
        }
        getCaretPosition(tooltipPoint, size, options) {
          const { xAlign, yAlign } = this;
          const { caretSize, cornerRadius } = options;
          const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
          const { x: ptX, y: ptY } = tooltipPoint;
          const { width, height } = size;
          let x1, x2, x3, y1, y2, y3;
          if (yAlign === "center") {
            y2 = ptY + height / 2;
            if (xAlign === "left") {
              x1 = ptX;
              x2 = x1 - caretSize;
              y1 = y2 + caretSize;
              y3 = y2 - caretSize;
            } else {
              x1 = ptX + width;
              x2 = x1 + caretSize;
              y1 = y2 - caretSize;
              y3 = y2 + caretSize;
            }
            x3 = x1;
          } else {
            if (xAlign === "left") {
              x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
            } else if (xAlign === "right") {
              x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
            } else {
              x2 = this.caretX;
            }
            if (yAlign === "top") {
              y1 = ptY;
              y2 = y1 - caretSize;
              x1 = x2 - caretSize;
              x3 = x2 + caretSize;
            } else {
              y1 = ptY + height;
              y2 = y1 + caretSize;
              x1 = x2 + caretSize;
              x3 = x2 - caretSize;
            }
            y3 = y1;
          }
          return {
            x1,
            x2,
            x3,
            y1,
            y2,
            y3
          };
        }
        drawTitle(pt, ctx, options) {
          const title = this.title;
          const length = title.length;
          let titleFont, titleSpacing, i;
          if (length) {
            const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
            pt.x = getAlignedX(this, options.titleAlign, options);
            ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
            ctx.textBaseline = "middle";
            titleFont = toFont(options.titleFont);
            titleSpacing = options.titleSpacing;
            ctx.fillStyle = options.titleColor;
            ctx.font = titleFont.string;
            for (i = 0; i < length; ++i) {
              ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
              pt.y += titleFont.lineHeight + titleSpacing;
              if (i + 1 === length) {
                pt.y += options.titleMarginBottom - titleSpacing;
              }
            }
          }
        }
        _drawColorBox(ctx, pt, i, rtlHelper, options) {
          const labelColor = this.labelColors[i];
          const labelPointStyle = this.labelPointStyles[i];
          const { boxHeight, boxWidth } = options;
          const bodyFont = toFont(options.bodyFont);
          const colorX = getAlignedX(this, "left", options);
          const rtlColorX = rtlHelper.x(colorX);
          const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
          const colorY = pt.y + yOffSet;
          if (options.usePointStyle) {
            const drawOptions = {
              radius: Math.min(boxWidth, boxHeight) / 2,
              pointStyle: labelPointStyle.pointStyle,
              rotation: labelPointStyle.rotation,
              borderWidth: 1
            };
            const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
            const centerY = colorY + boxHeight / 2;
            ctx.strokeStyle = options.multiKeyBackground;
            ctx.fillStyle = options.multiKeyBackground;
            drawPoint(ctx, drawOptions, centerX, centerY);
            ctx.strokeStyle = labelColor.borderColor;
            ctx.fillStyle = labelColor.backgroundColor;
            drawPoint(ctx, drawOptions, centerX, centerY);
          } else {
            ctx.lineWidth = isObject(labelColor.borderWidth) ? Math.max(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
            ctx.strokeStyle = labelColor.borderColor;
            ctx.setLineDash(labelColor.borderDash || []);
            ctx.lineDashOffset = labelColor.borderDashOffset || 0;
            const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
            const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
            const borderRadius = toTRBLCorners(labelColor.borderRadius);
            if (Object.values(borderRadius).some((v) => v !== 0)) {
              ctx.beginPath();
              ctx.fillStyle = options.multiKeyBackground;
              addRoundedRectPath(ctx, {
                x: outerX,
                y: colorY,
                w: boxWidth,
                h: boxHeight,
                radius: borderRadius
              });
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle = labelColor.backgroundColor;
              ctx.beginPath();
              addRoundedRectPath(ctx, {
                x: innerX,
                y: colorY + 1,
                w: boxWidth - 2,
                h: boxHeight - 2,
                radius: borderRadius
              });
              ctx.fill();
            } else {
              ctx.fillStyle = options.multiKeyBackground;
              ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
              ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
              ctx.fillStyle = labelColor.backgroundColor;
              ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
            }
          }
          ctx.fillStyle = this.labelTextColors[i];
        }
        drawBody(pt, ctx, options) {
          const { body } = this;
          const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
          const bodyFont = toFont(options.bodyFont);
          let bodyLineHeight = bodyFont.lineHeight;
          let xLinePadding = 0;
          const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
          const fillLineOfText = function(line) {
            ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
            pt.y += bodyLineHeight + bodySpacing;
          };
          const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
          let bodyItem, textColor, lines, i, j, ilen, jlen;
          ctx.textAlign = bodyAlign;
          ctx.textBaseline = "middle";
          ctx.font = bodyFont.string;
          pt.x = getAlignedX(this, bodyAlignForCalculation, options);
          ctx.fillStyle = options.bodyColor;
          each(this.beforeBody, fillLineOfText);
          xLinePadding = displayColors && bodyAlignForCalculation !== "right" ? bodyAlign === "center" ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
          for (i = 0, ilen = body.length; i < ilen; ++i) {
            bodyItem = body[i];
            textColor = this.labelTextColors[i];
            ctx.fillStyle = textColor;
            each(bodyItem.before, fillLineOfText);
            lines = bodyItem.lines;
            if (displayColors && lines.length) {
              this._drawColorBox(ctx, pt, i, rtlHelper, options);
              bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
            }
            for (j = 0, jlen = lines.length; j < jlen; ++j) {
              fillLineOfText(lines[j]);
              bodyLineHeight = bodyFont.lineHeight;
            }
            each(bodyItem.after, fillLineOfText);
          }
          xLinePadding = 0;
          bodyLineHeight = bodyFont.lineHeight;
          each(this.afterBody, fillLineOfText);
          pt.y -= bodySpacing;
        }
        drawFooter(pt, ctx, options) {
          const footer = this.footer;
          const length = footer.length;
          let footerFont, i;
          if (length) {
            const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
            pt.x = getAlignedX(this, options.footerAlign, options);
            pt.y += options.footerMarginTop;
            ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
            ctx.textBaseline = "middle";
            footerFont = toFont(options.footerFont);
            ctx.fillStyle = options.footerColor;
            ctx.font = footerFont.string;
            for (i = 0; i < length; ++i) {
              ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
              pt.y += footerFont.lineHeight + options.footerSpacing;
            }
          }
        }
        drawBackground(pt, ctx, tooltipSize, options) {
          const { xAlign, yAlign } = this;
          const { x, y } = pt;
          const { width, height } = tooltipSize;
          const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
          ctx.fillStyle = options.backgroundColor;
          ctx.strokeStyle = options.borderColor;
          ctx.lineWidth = options.borderWidth;
          ctx.beginPath();
          ctx.moveTo(x + topLeft, y);
          if (yAlign === "top") {
            this.drawCaret(pt, ctx, tooltipSize, options);
          }
          ctx.lineTo(x + width - topRight, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
          if (yAlign === "center" && xAlign === "right") {
            this.drawCaret(pt, ctx, tooltipSize, options);
          }
          ctx.lineTo(x + width, y + height - bottomRight);
          ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
          if (yAlign === "bottom") {
            this.drawCaret(pt, ctx, tooltipSize, options);
          }
          ctx.lineTo(x + bottomLeft, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
          if (yAlign === "center" && xAlign === "left") {
            this.drawCaret(pt, ctx, tooltipSize, options);
          }
          ctx.lineTo(x, y + topLeft);
          ctx.quadraticCurveTo(x, y, x + topLeft, y);
          ctx.closePath();
          ctx.fill();
          if (options.borderWidth > 0) {
            ctx.stroke();
          }
        }
        _updateAnimationTarget(options) {
          const chart = this.chart;
          const anims = this.$animations;
          const animX = anims && anims.x;
          const animY = anims && anims.y;
          if (animX || animY) {
            const position = positioners[options.position].call(this, this._active, this._eventPosition);
            if (!position) {
              return;
            }
            const size = this._size = getTooltipSize(this, options);
            const positionAndSize = Object.assign({}, position, this._size);
            const alignment = determineAlignment(chart, options, positionAndSize);
            const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
            if (animX._to !== point.x || animY._to !== point.y) {
              this.xAlign = alignment.xAlign;
              this.yAlign = alignment.yAlign;
              this.width = size.width;
              this.height = size.height;
              this.caretX = position.x;
              this.caretY = position.y;
              this._resolveAnimations().update(this, point);
            }
          }
        }
        _willRender() {
          return !!this.opacity;
        }
        draw(ctx) {
          const options = this.options.setContext(this.getContext());
          let opacity = this.opacity;
          if (!opacity) {
            return;
          }
          this._updateAnimationTarget(options);
          const tooltipSize = {
            width: this.width,
            height: this.height
          };
          const pt = {
            x: this.x,
            y: this.y
          };
          opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
          const padding = toPadding(options.padding);
          const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
          if (options.enabled && hasTooltipContent) {
            ctx.save();
            ctx.globalAlpha = opacity;
            this.drawBackground(pt, ctx, tooltipSize, options);
            overrideTextDirection(ctx, options.textDirection);
            pt.y += padding.top;
            this.drawTitle(pt, ctx, options);
            this.drawBody(pt, ctx, options);
            this.drawFooter(pt, ctx, options);
            restoreTextDirection(ctx, options.textDirection);
            ctx.restore();
          }
        }
        getActiveElements() {
          return this._active || [];
        }
        setActiveElements(activeElements, eventPosition) {
          const lastActive = this._active;
          const active = activeElements.map(({ datasetIndex, index }) => {
            const meta = this.chart.getDatasetMeta(datasetIndex);
            if (!meta) {
              throw new Error("Cannot find a dataset at index " + datasetIndex);
            }
            return {
              datasetIndex,
              element: meta.data[index],
              index
            };
          });
          const changed = !_elementsEqual(lastActive, active);
          const positionChanged = this._positionChanged(active, eventPosition);
          if (changed || positionChanged) {
            this._active = active;
            this._eventPosition = eventPosition;
            this._ignoreReplayEvents = true;
            this.update(true);
          }
        }
        handleEvent(e, replay, inChartArea = true) {
          if (replay && this._ignoreReplayEvents) {
            return false;
          }
          this._ignoreReplayEvents = false;
          const options = this.options;
          const lastActive = this._active || [];
          const active = this._getActiveElements(e, lastActive, replay, inChartArea);
          const positionChanged = this._positionChanged(active, e);
          const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
          if (changed) {
            this._active = active;
            if (options.enabled || options.external) {
              this._eventPosition = {
                x: e.x,
                y: e.y
              };
              this.update(true, replay);
            }
          }
          return changed;
        }
        _getActiveElements(e, lastActive, replay, inChartArea) {
          const options = this.options;
          if (e.type === "mouseout") {
            return [];
          }
          if (!inChartArea) {
            return lastActive.filter((i) => this.chart.data.datasets[i.datasetIndex] && this.chart.getDatasetMeta(i.datasetIndex).controller.getParsed(i.index) !== void 0);
          }
          const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
          if (options.reverse) {
            active.reverse();
          }
          return active;
        }
        _positionChanged(active, e) {
          const { caretX, caretY, options } = this;
          const position = positioners[options.position].call(this, active, e);
          return position !== false && (caretX !== position.x || caretY !== position.y);
        }
      }
      __publicField(Tooltip, "positioners", positioners);
      var plugin_tooltip = {
        id: "tooltip",
        _element: Tooltip,
        positioners,
        afterInit(chart, _args, options) {
          if (options) {
            chart.tooltip = new Tooltip({
              chart,
              options
            });
          }
        },
        beforeUpdate(chart, _args, options) {
          if (chart.tooltip) {
            chart.tooltip.initialize(options);
          }
        },
        reset(chart, _args, options) {
          if (chart.tooltip) {
            chart.tooltip.initialize(options);
          }
        },
        afterDraw(chart) {
          const tooltip = chart.tooltip;
          if (tooltip && tooltip._willRender()) {
            const args = {
              tooltip
            };
            if (chart.notifyPlugins("beforeTooltipDraw", {
              ...args,
              cancelable: true
            }) === false) {
              return;
            }
            tooltip.draw(chart.ctx);
            chart.notifyPlugins("afterTooltipDraw", args);
          }
        },
        afterEvent(chart, args) {
          if (chart.tooltip) {
            const useFinalPosition = args.replay;
            if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
              args.changed = true;
            }
          }
        },
        defaults: {
          enabled: true,
          external: null,
          position: "average",
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          titleFont: {
            weight: "bold"
          },
          titleSpacing: 2,
          titleMarginBottom: 6,
          titleAlign: "left",
          bodyColor: "#fff",
          bodySpacing: 2,
          bodyFont: {},
          bodyAlign: "left",
          footerColor: "#fff",
          footerSpacing: 2,
          footerMarginTop: 6,
          footerFont: {
            weight: "bold"
          },
          footerAlign: "left",
          padding: 6,
          caretPadding: 2,
          caretSize: 5,
          cornerRadius: 6,
          boxHeight: (ctx, opts) => opts.bodyFont.size,
          boxWidth: (ctx, opts) => opts.bodyFont.size,
          multiKeyBackground: "#fff",
          displayColors: true,
          boxPadding: 0,
          borderColor: "rgba(0,0,0,0)",
          borderWidth: 0,
          animation: {
            duration: 400,
            easing: "easeOutQuart"
          },
          animations: {
            numbers: {
              type: "number",
              properties: [
                "x",
                "y",
                "width",
                "height",
                "caretX",
                "caretY"
              ]
            },
            opacity: {
              easing: "linear",
              duration: 200
            }
          },
          callbacks: defaultCallbacks
        },
        defaultRoutes: {
          bodyFont: "font",
          footerFont: "font",
          titleFont: "font"
        },
        descriptors: {
          _scriptable: (name) => name !== "filter" && name !== "itemSort" && name !== "external",
          _indexable: false,
          callbacks: {
            _scriptable: false,
            _indexable: false
          },
          animation: {
            _fallback: false
          },
          animations: {
            _fallback: "animation"
          }
        },
        additionalOptionScopes: [
          "interaction"
        ]
      };
      const addIfString = (labels, raw, index, addedLabels) => {
        if (typeof raw === "string") {
          index = labels.push(raw) - 1;
          addedLabels.unshift({
            index,
            label: raw
          });
        } else if (isNaN(raw)) {
          index = null;
        }
        return index;
      };
      function findOrAddLabel(labels, raw, index, addedLabels) {
        const first = labels.indexOf(raw);
        if (first === -1) {
          return addIfString(labels, raw, index, addedLabels);
        }
        const last = labels.lastIndexOf(raw);
        return first !== last ? index : first;
      }
      const validIndex = (index, max) => index === null ? null : _limitValue(Math.round(index), 0, max);
      function _getLabelForValue(value) {
        const labels = this.getLabels();
        if (value >= 0 && value < labels.length) {
          return labels[value];
        }
        return value;
      }
      class CategoryScale extends Scale {
        constructor(cfg) {
          super(cfg);
          this._startValue = void 0;
          this._valueRange = 0;
          this._addedLabels = [];
        }
        init(scaleOptions) {
          const added = this._addedLabels;
          if (added.length) {
            const labels = this.getLabels();
            for (const { index, label } of added) {
              if (labels[index] === label) {
                labels.splice(index, 1);
              }
            }
            this._addedLabels = [];
          }
          super.init(scaleOptions);
        }
        parse(raw, index) {
          if (isNullOrUndef(raw)) {
            return null;
          }
          const labels = this.getLabels();
          index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
          return validIndex(index, labels.length - 1);
        }
        determineDataLimits() {
          const { minDefined, maxDefined } = this.getUserBounds();
          let { min, max } = this.getMinMax(true);
          if (this.options.bounds === "ticks") {
            if (!minDefined) {
              min = 0;
            }
            if (!maxDefined) {
              max = this.getLabels().length - 1;
            }
          }
          this.min = min;
          this.max = max;
        }
        buildTicks() {
          const min = this.min;
          const max = this.max;
          const offset = this.options.offset;
          const ticks = [];
          let labels = this.getLabels();
          labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
          this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
          this._startValue = this.min - (offset ? 0.5 : 0);
          for (let value = min; value <= max; value++) {
            ticks.push({
              value
            });
          }
          return ticks;
        }
        getLabelForValue(value) {
          return _getLabelForValue.call(this, value);
        }
        configure() {
          super.configure();
          if (!this.isHorizontal()) {
            this._reversePixels = !this._reversePixels;
          }
        }
        getPixelForValue(value) {
          if (typeof value !== "number") {
            value = this.parse(value);
          }
          return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
        }
        getPixelForTick(index) {
          const ticks = this.ticks;
          if (index < 0 || index > ticks.length - 1) {
            return null;
          }
          return this.getPixelForValue(ticks[index].value);
        }
        getValueForPixel(pixel) {
          return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
        }
        getBasePixel() {
          return this.bottom;
        }
      }
      __publicField(CategoryScale, "id", "category");
      __publicField(CategoryScale, "defaults", {
        ticks: {
          callback: _getLabelForValue
        }
      });
      const INTERVALS = {
        millisecond: {
          common: true,
          size: 1,
          steps: 1e3
        },
        second: {
          common: true,
          size: 1e3,
          steps: 60
        },
        minute: {
          common: true,
          size: 6e4,
          steps: 60
        },
        hour: {
          common: true,
          size: 36e5,
          steps: 24
        },
        day: {
          common: true,
          size: 864e5,
          steps: 30
        },
        week: {
          common: false,
          size: 6048e5,
          steps: 4
        },
        month: {
          common: true,
          size: 2628e6,
          steps: 12
        },
        quarter: {
          common: false,
          size: 7884e6,
          steps: 4
        },
        year: {
          common: true,
          size: 3154e7
        }
      };
      const UNITS = /* @__PURE__ */ Object.keys(INTERVALS);
      function sorter(a, b) {
        return a - b;
      }
      function parse(scale, input) {
        if (isNullOrUndef(input)) {
          return null;
        }
        const adapter = scale._adapter;
        const { parser, round: round2, isoWeekday } = scale._parseOpts;
        let value = input;
        if (typeof parser === "function") {
          value = parser(value);
        }
        if (!isNumberFinite(value)) {
          value = typeof parser === "string" ? adapter.parse(value, parser) : adapter.parse(value);
        }
        if (value === null) {
          return null;
        }
        if (round2) {
          value = round2 === "week" && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, "isoWeek", isoWeekday) : adapter.startOf(value, round2);
        }
        return +value;
      }
      function determineUnitForAutoTicks(minUnit, min, max, capacity) {
        const ilen = UNITS.length;
        for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
          const interval = INTERVALS[UNITS[i]];
          const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
          if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
            return UNITS[i];
          }
        }
        return UNITS[ilen - 1];
      }
      function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
        for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
          const unit = UNITS[i];
          if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
            return unit;
          }
        }
        return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
      }
      function determineMajorUnit(unit) {
        for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
          if (INTERVALS[UNITS[i]].common) {
            return UNITS[i];
          }
        }
      }
      function addTick(ticks, time, timestamps) {
        if (!timestamps) {
          ticks[time] = true;
        } else if (timestamps.length) {
          const { lo, hi } = _lookup(timestamps, time);
          const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
          ticks[timestamp] = true;
        }
      }
      function setMajorTicks(scale, ticks, map2, majorUnit) {
        const adapter = scale._adapter;
        const first = +adapter.startOf(ticks[0].value, majorUnit);
        const last = ticks[ticks.length - 1].value;
        let major, index;
        for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
          index = map2[major];
          if (index >= 0) {
            ticks[index].major = true;
          }
        }
        return ticks;
      }
      function ticksFromTimestamps(scale, values, majorUnit) {
        const ticks = [];
        const map2 = {};
        const ilen = values.length;
        let i, value;
        for (i = 0; i < ilen; ++i) {
          value = values[i];
          map2[value] = i;
          ticks.push({
            value,
            major: false
          });
        }
        return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map2, majorUnit);
      }
      class TimeScale extends Scale {
        constructor(props) {
          super(props);
          this._cache = {
            data: [],
            labels: [],
            all: []
          };
          this._unit = "day";
          this._majorUnit = void 0;
          this._offsets = {};
          this._normalized = false;
          this._parseOpts = void 0;
        }
        init(scaleOpts, opts = {}) {
          const time = scaleOpts.time || (scaleOpts.time = {});
          const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
          adapter.init(opts);
          mergeIf(time.displayFormats, adapter.formats());
          this._parseOpts = {
            parser: time.parser,
            round: time.round,
            isoWeekday: time.isoWeekday
          };
          super.init(scaleOpts);
          this._normalized = opts.normalized;
        }
        parse(raw, index) {
          if (raw === void 0) {
            return null;
          }
          return parse(this, raw);
        }
        beforeLayout() {
          super.beforeLayout();
          this._cache = {
            data: [],
            labels: [],
            all: []
          };
        }
        determineDataLimits() {
          const options = this.options;
          const adapter = this._adapter;
          const unit = options.time.unit || "day";
          let { min, max, minDefined, maxDefined } = this.getUserBounds();
          function _applyBounds(bounds) {
            if (!minDefined && !isNaN(bounds.min)) {
              min = Math.min(min, bounds.min);
            }
            if (!maxDefined && !isNaN(bounds.max)) {
              max = Math.max(max, bounds.max);
            }
          }
          if (!minDefined || !maxDefined) {
            _applyBounds(this._getLabelBounds());
            if (options.bounds !== "ticks" || options.ticks.source !== "labels") {
              _applyBounds(this.getMinMax(false));
            }
          }
          min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
          max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
          this.min = Math.min(min, max - 1);
          this.max = Math.max(min + 1, max);
        }
        _getLabelBounds() {
          const arr = this.getLabelTimestamps();
          let min = Number.POSITIVE_INFINITY;
          let max = Number.NEGATIVE_INFINITY;
          if (arr.length) {
            min = arr[0];
            max = arr[arr.length - 1];
          }
          return {
            min,
            max
          };
        }
        buildTicks() {
          const options = this.options;
          const timeOpts = options.time;
          const tickOpts = options.ticks;
          const timestamps = tickOpts.source === "labels" ? this.getLabelTimestamps() : this._generate();
          if (options.bounds === "ticks" && timestamps.length) {
            this.min = this._userMin || timestamps[0];
            this.max = this._userMax || timestamps[timestamps.length - 1];
          }
          const min = this.min;
          const max = this.max;
          const ticks = _filterBetween(timestamps, min, max);
          this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
          this._majorUnit = !tickOpts.major.enabled || this._unit === "year" ? void 0 : determineMajorUnit(this._unit);
          this.initOffsets(timestamps);
          if (options.reverse) {
            ticks.reverse();
          }
          return ticksFromTimestamps(this, ticks, this._majorUnit);
        }
        afterAutoSkip() {
          if (this.options.offsetAfterAutoskip) {
            this.initOffsets(this.ticks.map((tick) => +tick.value));
          }
        }
        initOffsets(timestamps = []) {
          let start = 0;
          let end = 0;
          let first, last;
          if (this.options.offset && timestamps.length) {
            first = this.getDecimalForValue(timestamps[0]);
            if (timestamps.length === 1) {
              start = 1 - first;
            } else {
              start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
            }
            last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
            if (timestamps.length === 1) {
              end = last;
            } else {
              end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
            }
          }
          const limit = timestamps.length < 3 ? 0.5 : 0.25;
          start = _limitValue(start, 0, limit);
          end = _limitValue(end, 0, limit);
          this._offsets = {
            start,
            end,
            factor: 1 / (start + 1 + end)
          };
        }
        _generate() {
          const adapter = this._adapter;
          const min = this.min;
          const max = this.max;
          const options = this.options;
          const timeOpts = options.time;
          const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
          const stepSize = valueOrDefault(options.ticks.stepSize, 1);
          const weekday = minor === "week" ? timeOpts.isoWeekday : false;
          const hasWeekday = isNumber(weekday) || weekday === true;
          const ticks = {};
          let first = min;
          let time, count;
          if (hasWeekday) {
            first = +adapter.startOf(first, "isoWeek", weekday);
          }
          first = +adapter.startOf(first, hasWeekday ? "day" : minor);
          if (adapter.diff(max, min, minor) > 1e5 * stepSize) {
            throw new Error(min + " and " + max + " are too far apart with stepSize of " + stepSize + " " + minor);
          }
          const timestamps = options.ticks.source === "data" && this.getDataTimestamps();
          for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
            addTick(ticks, time, timestamps);
          }
          if (time === max || options.bounds === "ticks" || count === 1) {
            addTick(ticks, time, timestamps);
          }
          return Object.keys(ticks).sort(sorter).map((x) => +x);
        }
        getLabelForValue(value) {
          const adapter = this._adapter;
          const timeOpts = this.options.time;
          if (timeOpts.tooltipFormat) {
            return adapter.format(value, timeOpts.tooltipFormat);
          }
          return adapter.format(value, timeOpts.displayFormats.datetime);
        }
        format(value, format) {
          const options = this.options;
          const formats = options.time.displayFormats;
          const unit = this._unit;
          const fmt = format || formats[unit];
          return this._adapter.format(value, fmt);
        }
        _tickFormatFunction(time, index, ticks, format) {
          const options = this.options;
          const formatter = options.ticks.callback;
          if (formatter) {
            return callback(formatter, [
              time,
              index,
              ticks
            ], this);
          }
          const formats = options.time.displayFormats;
          const unit = this._unit;
          const majorUnit = this._majorUnit;
          const minorFormat = unit && formats[unit];
          const majorFormat = majorUnit && formats[majorUnit];
          const tick = ticks[index];
          const major = majorUnit && majorFormat && tick && tick.major;
          return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
        }
        generateTickLabels(ticks) {
          let i, ilen, tick;
          for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            tick = ticks[i];
            tick.label = this._tickFormatFunction(tick.value, i, ticks);
          }
        }
        getDecimalForValue(value) {
          return value === null ? NaN : (value - this.min) / (this.max - this.min);
        }
        getPixelForValue(value) {
          const offsets = this._offsets;
          const pos = this.getDecimalForValue(value);
          return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
        }
        getValueForPixel(pixel) {
          const offsets = this._offsets;
          const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
          return this.min + pos * (this.max - this.min);
        }
        _getLabelSize(label) {
          const ticksOpts = this.options.ticks;
          const tickLabelWidth = this.ctx.measureText(label).width;
          const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
          const cosRotation = Math.cos(angle);
          const sinRotation = Math.sin(angle);
          const tickFontSize = this._resolveTickFontOptions(0).size;
          return {
            w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
            h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
          };
        }
        _getLabelCapacity(exampleTime) {
          const timeOpts = this.options.time;
          const displayFormats = timeOpts.displayFormats;
          const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
          const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
            exampleTime
          ], this._majorUnit), format);
          const size = this._getLabelSize(exampleLabel);
          const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
          return capacity > 0 ? capacity : 1;
        }
        getDataTimestamps() {
          let timestamps = this._cache.data || [];
          let i, ilen;
          if (timestamps.length) {
            return timestamps;
          }
          const metas = this.getMatchingVisibleMetas();
          if (this._normalized && metas.length) {
            return this._cache.data = metas[0].controller.getAllParsedValues(this);
          }
          for (i = 0, ilen = metas.length; i < ilen; ++i) {
            timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
          }
          return this._cache.data = this.normalize(timestamps);
        }
        getLabelTimestamps() {
          const timestamps = this._cache.labels || [];
          let i, ilen;
          if (timestamps.length) {
            return timestamps;
          }
          const labels = this.getLabels();
          for (i = 0, ilen = labels.length; i < ilen; ++i) {
            timestamps.push(parse(this, labels[i]));
          }
          return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
        }
        normalize(values) {
          return _arrayUnique(values.sort(sorter));
        }
      }
      __publicField(TimeScale, "id", "time");
      __publicField(TimeScale, "defaults", {
        bounds: "data",
        adapters: {},
        time: {
          parser: false,
          unit: false,
          round: false,
          isoWeekday: false,
          minUnit: "millisecond",
          displayFormats: {}
        },
        ticks: {
          source: "auto",
          callback: false,
          major: {
            enabled: false
          }
        }
      });
      function interpolate(table, val, reverse) {
        let lo = 0;
        let hi = table.length - 1;
        let prevSource, nextSource, prevTarget, nextTarget;
        if (reverse) {
          if (val >= table[lo].pos && val <= table[hi].pos) {
            ({ lo, hi } = _lookupByKey(table, "pos", val));
          }
          ({ pos: prevSource, time: prevTarget } = table[lo]);
          ({ pos: nextSource, time: nextTarget } = table[hi]);
        } else {
          if (val >= table[lo].time && val <= table[hi].time) {
            ({ lo, hi } = _lookupByKey(table, "time", val));
          }
          ({ time: prevSource, pos: prevTarget } = table[lo]);
          ({ time: nextSource, pos: nextTarget } = table[hi]);
        }
        const span = nextSource - prevSource;
        return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
      }
      class TimeSeriesScale extends TimeScale {
        constructor(props) {
          super(props);
          this._table = [];
          this._minPos = void 0;
          this._tableRange = void 0;
        }
        initOffsets() {
          const timestamps = this._getTimestampsForTable();
          const table = this._table = this.buildLookupTable(timestamps);
          this._minPos = interpolate(table, this.min);
          this._tableRange = interpolate(table, this.max) - this._minPos;
          super.initOffsets(timestamps);
        }
        buildLookupTable(timestamps) {
          const { min, max } = this;
          const items = [];
          const table = [];
          let i, ilen, prev, curr, next;
          for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
            curr = timestamps[i];
            if (curr >= min && curr <= max) {
              items.push(curr);
            }
          }
          if (items.length < 2) {
            return [
              {
                time: min,
                pos: 0
              },
              {
                time: max,
                pos: 1
              }
            ];
          }
          for (i = 0, ilen = items.length; i < ilen; ++i) {
            next = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (Math.round((next + prev) / 2) !== curr) {
              table.push({
                time: curr,
                pos: i / (ilen - 1)
              });
            }
          }
          return table;
        }
        _generate() {
          const min = this.min;
          const max = this.max;
          let timestamps = super.getDataTimestamps();
          if (!timestamps.includes(min) || !timestamps.length) {
            timestamps.splice(0, 0, min);
          }
          if (!timestamps.includes(max) || timestamps.length === 1) {
            timestamps.push(max);
          }
          return timestamps.sort((a, b) => a - b);
        }
        _getTimestampsForTable() {
          let timestamps = this._cache.all || [];
          if (timestamps.length) {
            return timestamps;
          }
          const data = this.getDataTimestamps();
          const label = this.getLabelTimestamps();
          if (data.length && label.length) {
            timestamps = this.normalize(data.concat(label));
          } else {
            timestamps = data.length ? data : label;
          }
          timestamps = this._cache.all = timestamps;
          return timestamps;
        }
        getDecimalForValue(value) {
          return (interpolate(this._table, value) - this._minPos) / this._tableRange;
        }
        getValueForPixel(pixel) {
          const offsets = this._offsets;
          const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
          return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
        }
      }
      __publicField(TimeSeriesScale, "id", "timeseries");
      __publicField(TimeSeriesScale, "defaults", TimeScale.defaults);
      const CommonProps = {
        data: {
          type: Object,
          required: true
        },
        options: {
          type: Object,
          default: () => ({})
        },
        plugins: {
          type: Array,
          default: () => []
        },
        datasetIdKey: {
          type: String,
          default: "label"
        },
        updateMode: {
          type: String,
          default: void 0
        }
      };
      const A11yProps = {
        ariaLabel: {
          type: String
        },
        ariaDescribedby: {
          type: String
        }
      };
      const Props = {
        type: {
          type: String,
          required: true
        },
        destroyDelay: {
          type: Number,
          default: 0
          // No delay by default
        },
        ...CommonProps,
        ...A11yProps
      };
      const compatProps = version$1[0] === "2" ? (internals, props) => Object.assign(internals, {
        attrs: props
      }) : (internals, props) => Object.assign(internals, props);
      function toRawIfProxy(obj) {
        return isProxy(obj) ? toRaw(obj) : obj;
      }
      function cloneProxy(obj) {
        let src = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : obj;
        return isProxy(src) ? new Proxy(obj, {}) : obj;
      }
      function setOptions(chart, nextOptions) {
        const options = chart.options;
        if (options && nextOptions) {
          Object.assign(options, nextOptions);
        }
      }
      function setLabels(currentData, nextLabels) {
        currentData.labels = nextLabels;
      }
      function setDatasets(currentData, nextDatasets, datasetIdKey) {
        const addedDatasets = [];
        currentData.datasets = nextDatasets.map((nextDataset) => {
          const currentDataset = currentData.datasets.find((dataset) => dataset[datasetIdKey] === nextDataset[datasetIdKey]);
          if (!currentDataset || !nextDataset.data || addedDatasets.includes(currentDataset)) {
            return {
              ...nextDataset
            };
          }
          addedDatasets.push(currentDataset);
          Object.assign(currentDataset, nextDataset);
          return currentDataset;
        });
      }
      function cloneData(data, datasetIdKey) {
        const nextData = {
          labels: [],
          datasets: []
        };
        setLabels(nextData, data.labels);
        setDatasets(nextData, data.datasets, datasetIdKey);
        return nextData;
      }
      const Chart = defineComponent({
        props: Props,
        setup(props, param) {
          let { expose, slots } = param;
          const canvasRef = ref(null);
          const chartRef = shallowRef(null);
          expose({
            chart: chartRef
          });
          const renderChart = () => {
            if (!canvasRef.value) return;
            const { type, data, options, plugins, datasetIdKey } = props;
            const clonedData = cloneData(data, datasetIdKey);
            const proxiedData = cloneProxy(clonedData, data);
            chartRef.value = new Chart$1(canvasRef.value, {
              type,
              data: proxiedData,
              options: {
                ...options
              },
              plugins
            });
          };
          const destroyChart = () => {
            const chart = toRaw(chartRef.value);
            if (chart) {
              if (props.destroyDelay > 0) {
                setTimeout(() => {
                  chart.destroy();
                  chartRef.value = null;
                }, props.destroyDelay);
              } else {
                chart.destroy();
                chartRef.value = null;
              }
            }
          };
          const update = (chart) => {
            chart.update(props.updateMode);
          };
          onMounted(renderChart);
          onUnmounted(destroyChart);
          watch([
            () => props.options,
            () => props.data
          ], (param2, param1) => {
            let [nextOptionsProxy, nextDataProxy] = param2, [prevOptionsProxy, prevDataProxy] = param1;
            const chart = toRaw(chartRef.value);
            if (!chart) {
              return;
            }
            let shouldUpdate = false;
            if (nextOptionsProxy) {
              const nextOptions = toRawIfProxy(nextOptionsProxy);
              const prevOptions = toRawIfProxy(prevOptionsProxy);
              if (nextOptions && nextOptions !== prevOptions) {
                setOptions(chart, nextOptions);
                shouldUpdate = true;
              }
            }
            if (nextDataProxy) {
              const nextLabels = toRawIfProxy(nextDataProxy.labels);
              const prevLabels = toRawIfProxy(prevDataProxy.labels);
              const nextDatasets = toRawIfProxy(nextDataProxy.datasets);
              const prevDatasets = toRawIfProxy(prevDataProxy.datasets);
              if (nextLabels !== prevLabels) {
                setLabels(chart.config.data, nextLabels);
                shouldUpdate = true;
              }
              if (nextDatasets && nextDatasets !== prevDatasets) {
                setDatasets(chart.config.data, nextDatasets, props.datasetIdKey);
                shouldUpdate = true;
              }
            }
            if (shouldUpdate) {
              nextTick(() => {
                update(chart);
              });
            }
          }, {
            deep: true
          });
          return () => {
            return h("canvas", {
              role: "img",
              ariaLabel: props.ariaLabel,
              ariaDescribedby: props.ariaDescribedby,
              ref: canvasRef
            }, [
              h("p", {}, [
                slots.default ? slots.default() : ""
              ])
            ]);
          };
        }
      });
      function createTypedChart(type, registerables) {
        Chart$1.register(registerables);
        return defineComponent({
          props: CommonProps,
          setup(props, param) {
            let { expose } = param;
            const ref2 = shallowRef(null);
            const reforwardRef = (chartRef) => {
              ref2.value = chartRef == null ? void 0 : chartRef.chart;
            };
            expose({
              chart: ref2
            });
            return () => {
              return h(Chart, compatProps({
                ref: reforwardRef
              }, {
                type,
                ...props
              }));
            };
          }
        });
      }
      const Doughnut = /* @__PURE__ */ createTypedChart("doughnut", DoughnutController);
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
      const useSettingsStore = defineStore("settings", {
        state: () => ({
          apiKey: "",
          apiHost: "https://api.openai.com",
          aiProvider: "openai",
          apiModel: "gpt-3.5-turbo",
          customApiModel: "",
          customPrompt: "",
          advancedSettingsVisible: false
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
      const useDiagnosisStore = defineStore("diagnosis", {
        state: () => ({
          diagnosisState: {
            running: false,
            progress: 0,
            message: ""
          },
          diagnosisReport: null,
          diagnosisConfig: {
            maxConcurrentAnalysis: 3,
            dynamicBatchSize: true,
            minVideosPerCategory: 3,
            enableSemanticMerge: true,
            strictFormatMatching: true
          }
        }),
        getters: {
          isDiagnosisRunning: (state) => {
            return state.diagnosisState.running;
          },
          diagnosisProgress: (state) => {
            return state.diagnosisState.progress;
          },
          diagnosisMessage: (state) => {
            return state.diagnosisState.message;
          },
          hasDiagnosisReport: (state) => {
            return state.diagnosisReport !== null;
          }
        },
        actions: {
          setDiagnosisState(state) {
            this.diagnosisState = { ...this.diagnosisState, ...state };
          },
          setDiagnosisReport(report) {
            this.diagnosisReport = report;
          },
          updateDiagnosisConfig(config) {
            this.diagnosisConfig = { ...this.diagnosisConfig, ...config };
          },
          startDiagnosis() {
            this.diagnosisState = {
              running: true,
              progress: 0,
              message: "初始化..."
            };
            this.diagnosisReport = null;
          },
          updateProgress(progress, message) {
            this.diagnosisState.progress = progress;
            if (message) {
              this.diagnosisState.message = message;
            }
          },
          completeDiagnosis() {
            this.diagnosisState.running = false;
            this.diagnosisState.progress = 100;
            this.diagnosisState.message = "诊断完成";
          },
          resetDiagnosis() {
            this.diagnosisState = {
              running: false,
              progress: 0,
              message: ""
            };
            this.diagnosisReport = null;
          },
          updateGroupSelection(index, selected) {
            if (this.diagnosisReport && this.diagnosisReport.newGroups) {
              const newReport = JSON.parse(JSON.stringify(this.diagnosisReport));
              newReport.newGroups[index].selected = selected;
              this.diagnosisReport = newReport;
            }
          },
          getSelectedGroups() {
            if (!this.diagnosisReport || !this.diagnosisReport.newGroups) {
              return [];
            }
            return this.diagnosisReport.newGroups.filter((g) => g.selected);
          }
        }
      });
      const useUIStore = defineStore("ui", {
        state: () => ({
          visible: false,
          activeTab: "settings",
          mid: null,
          analyticsData: []
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
          switchToDiagnoseTab() {
            this.activeTab = "diagnose";
          },
          switchToAnalyticsTab() {
            this.activeTab = "analytics";
          },
          loadAnalyticsData() {
            try {
              const rawData = GM.getValue("bfc-analytics-data", "[]");
              const data = JSON.parse(rawData);
              const dataArray = Array.isArray(data) ? data : [];
              this.analyticsData = dataArray.map((item) => ({
                ...item,
                timestamp: new Date(item.timestamp)
              }));
            } catch (error) {
              console.error("加载分析数据失败:", error);
              this.analyticsData = [];
            }
          },
          addAnalyticsRecord(record) {
            const data = JSON.parse(GM.getValue("bfc-analytics-data", "[]"));
            data.push(record);
            GM.setValue("bfc-analytics-data", JSON.stringify(data));
            this.loadAnalyticsData();
          },
          getFilteredAnalyticsData(period) {
            const now = /* @__PURE__ */ new Date();
            let filteredData = [];
            switch (period) {
              case "daily":
                filteredData = this.analyticsData.filter((item) => {
                  const itemDate = item.timestamp;
                  return itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() === now.getMonth() && itemDate.getDate() === now.getDate();
                });
                break;
              case "weekly":
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                filteredData = this.analyticsData.filter((item) => item.timestamp >= startOfWeek);
                break;
              case "monthly":
                filteredData = this.analyticsData.filter((item) => {
                  return item.timestamp.getFullYear() === now.getFullYear() && item.timestamp.getMonth() === now.getMonth();
                });
                break;
              case "yearly":
                filteredData = this.analyticsData.filter((item) => {
                  return item.timestamp.getFullYear() === now.getFullYear();
                });
                break;
            }
            return filteredData;
          }
        }
      });
      function retry(fn, { maxRetries = 3, initialDelay = 1e3, onRetry = () => {
      } } = {}) {
        return new Promise((resolve2, reject) => {
          let attempt = 0;
          const tryRequest = () => {
            fn().then(resolve2).catch((err) => {
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
          return retry(() => new Promise((resolve2, reject) => {
            GM_xmlhttpRequest({
              method: "POST",
              url: "https://api.bilibili.com/x/v3/fav/folder/add",
              headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
              data: `title=${encodeURIComponent(name)}&public=0&csrf=${token}`,
              onload: (response) => {
                try {
                  const result = JSON.parse(response.responseText);
                  if (result.code === 0) {
                    resolve2(result);
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
          return retry(() => new Promise((resolve2, reject) => {
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
                    resolve2(JSON.parse(jsonContent));
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
          return retry(() => new Promise((resolve2, reject) => {
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
                    resolve2(JSON.parse(jsonContent));
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
            return retry(() => new Promise((resolve2, reject) => {
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
                      resolve2(folderName);
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
          return retry(() => new Promise((resolve2, reject) => {
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
                      resolve2(folderName);
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
          return retry(() => new Promise((resolve2, reject) => {
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
                    resolve2(JSON.parse(jsonContent));
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
                await new Promise((resolve2) => setTimeout(resolve2, 1e3));
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
                await new Promise((resolve2) => setTimeout(resolve2, 500));
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
      class DiagnosisService {
        constructor() {
          this.diagnosisStore = null;
          this.classificationStore = null;
          this.settingsStore = null;
        }
        // 获取 store 实例（延迟初始化）
        getDiagnosisStore() {
          if (!this.diagnosisStore) {
            this.diagnosisStore = useDiagnosisStore();
          }
          return this.diagnosisStore;
        }
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
        // 开始诊断
        async startDiagnosis() {
          const classificationStore = this.getClassificationStore();
          const diagnosisStore = this.getDiagnosisStore();
          classificationStore.addLog("开始收藏夹智能诊断...", "info");
          diagnosisStore.startDiagnosis();
          try {
            const allFolderIds = classificationStore.allFolders.map((f) => f.id);
            if (allFolderIds.length === 0) {
              throw new Error("未能获取到任何收藏夹。");
            }
            diagnosisStore.updateProgress(0, `正在从 ${allFolderIds.length} 个收藏夹中获取所有视频...`);
            const allVideos = await BilibiliAPI.getAllVideosFromFavoritesParallel(
              allFolderIds,
              (fetchedCount, isDone) => {
                if (!isDone) {
                  diagnosisStore.updateProgress(
                    Math.min(50, fetchedCount / 100 * 50),
                    // 限制进度到50%
                    `已获取 ${fetchedCount} 个视频...`
                  );
                }
              }
            );
            classificationStore.addLog(`共获取到 ${allVideos.length} 个视频，准备进行AI分析。`, "info");
            if (allVideos.length === 0) {
              classificationStore.addLog("未找到任何视频，诊断结束。", "info");
              diagnosisStore.completeDiagnosis();
              return;
            }
            const formatInfo = this.analyzeExistingFolderFormats(classificationStore.allFolders);
            classificationStore.addLog(`检测到主导格式: ${formatInfo.dominantFormat}`, "info");
            diagnosisStore.updateProgress(50, "正在分析视频内容...");
            let allClusters = await this.analyzeVideosInParallel(allVideos, formatInfo);
            diagnosisStore.updateProgress(80, "正在进行语义合并...");
            let mergedClusters = await this.mergeSimilarClusters(allClusters);
            mergedClusters = mergedClusters.filter(
              (cluster) => cluster.video_titles.length >= diagnosisStore.diagnosisConfig.minVideosPerCategory
            );
            diagnosisStore.setDiagnosisReport({ newGroups: mergedClusters });
            classificationStore.addLog(`诊断报告已生成！共建议创建 ${mergedClusters.length} 个新收藏夹。`, "success");
            diagnosisStore.completeDiagnosis();
          } catch (error) {
            classificationStore.addLog(`诊断过程中发生错误: ${error.message}`, "error");
            diagnosisStore.completeDiagnosis();
          }
        }
        // 分析现有收藏夹格式
        analyzeExistingFolderFormats(folders) {
          const patterns = [];
          const formatCounts = {};
          for (const folder of folders) {
            const name = folder.title;
            let format = "单一类别";
            if (name.includes(" - ")) format = "主类别 - 子类别";
            else if (name.includes("：")) format = "主类别：子类别";
            else if (name.includes("|")) format = "主类别|子类别";
            patterns.push({ pattern: format, example: name });
            formatCounts[format] = (formatCounts[format] || 0) + 1;
          }
          const dominantFormat = Object.keys(formatCounts).length > 0 ? Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0][0] : "主类别 - 子类别";
          return { dominantFormat, patterns, formatCounts };
        }
        // 并行分析视频
        async analyzeVideosInParallel(allVideos, formatInfo) {
          const settingsStore = this.getSettingsStore();
          const diagnosisStore = this.getDiagnosisStore();
          const classificationStore = this.getClassificationStore();
          const modelName = settingsStore.getModelName;
          const avgContentLength = allVideos.reduce((sum, video) => sum + video.title.length + (video.intro || "").length, 0) / (allVideos.length || 1);
          const dynamicBatchSize = diagnosisStore.diagnosisConfig.dynamicBatchSize && avgContentLength > 200 ? 30 : 50;
          const chunks = [];
          for (let i = 0; i < allVideos.length; i += dynamicBatchSize) {
            chunks.push(allVideos.slice(i, i + dynamicBatchSize));
          }
          const results = [];
          const maxConcurrent = diagnosisStore.diagnosisConfig.maxConcurrentAnalysis;
          let running = 0;
          let completed = 0;
          return new Promise((resolve2) => {
            function run() {
              while (running < maxConcurrent && chunks.length > 0) {
                running++;
                const chunk = chunks.shift();
                AIClassifier.analyzeVideosForClustering(
                  chunk,
                  settingsStore.apiKey,
                  settingsStore.apiHost,
                  modelName,
                  formatInfo,
                  diagnosisStore.diagnosisConfig.minVideosPerCategory
                ).then((clusters) => {
                  results.push(...clusters);
                  completed++;
                  const progress = 50 + completed / (chunks.length + completed) * 30;
                  diagnosisStore.updateProgress(progress, `正在分析视频... ${Math.round(progress)}%`);
                }).catch((error) => {
                  classificationStore.addLog(`一个分析批次失败: ${error.message}`, "error");
                }).finally(() => {
                  running--;
                  if (chunks.length === 0 && running === 0) {
                    resolve2(results);
                  } else {
                    run.call(this);
                  }
                });
              }
            }
            run.call(this);
          });
        }
        // 合并相似集群
        async mergeSimilarClusters(clusters) {
          const diagnosisStore = this.getDiagnosisStore();
          const settingsStore = this.getSettingsStore();
          const classificationStore = this.getClassificationStore();
          if (clusters.length <= 1 || !diagnosisStore.diagnosisConfig.enableSemanticMerge) {
            return clusters;
          }
          diagnosisStore.updateProgress(80, "正在进行语义合并...");
          const clusterNames = clusters.map((c) => c.category_name);
          const modelName = settingsStore.getModelName;
          try {
            const mergeSuggestions = await AIClassifier.getMergeSuggestions(
              clusterNames,
              settingsStore.apiKey,
              settingsStore.apiHost,
              modelName
            );
            const mergedClusters = [];
            const processedNames = /* @__PURE__ */ new Set();
            if (mergeSuggestions.merge_groups) {
              for (const group of mergeSuggestions.merge_groups) {
                const sourceClusters = clusters.filter(
                  (c) => group.source_names.includes(c.category_name)
                );
                if (sourceClusters.length > 0) {
                  mergedClusters.push({
                    category_name: group.target_name,
                    video_titles: sourceClusters.flatMap((c) => c.video_titles),
                    selected: true
                  });
                  group.source_names.forEach((name) => processedNames.add(name));
                }
              }
            }
            clusters.forEach((cluster) => {
              if (!processedNames.has(cluster.category_name)) {
                mergedClusters.push({ ...cluster, selected: true });
              }
            });
            return mergedClusters;
          } catch (error) {
            classificationStore.addLog(`语义合并失败: ${error.message}`, "error");
            return clusters.map((c) => ({ ...c, selected: true }));
          }
        }
        // 应用诊断建议
        async applyDiagnosis() {
          const diagnosisStore = this.getDiagnosisStore();
          const classificationStore = this.getClassificationStore();
          if (!diagnosisStore.hasDiagnosisReport || !diagnosisStore.diagnosisReport.newGroups) {
            classificationStore.addLog("没有可应用的诊断建议。", "error");
            return;
          }
          const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
          const csrf = csrfMatch ? csrfMatch[1] : null;
          if (!csrf) {
            classificationStore.addLog("无法执行优化：缺少CSRF Token。", "error");
            return;
          }
          const selectedGroups = diagnosisStore.getSelectedGroups();
          if (selectedGroups.length === 0) {
            classificationStore.addLog("请至少选择一个要创建的分组。", "info");
            return;
          }
          classificationStore.addLog(`准备执行优化，将创建 ${selectedGroups.length} 个新收藏夹...`, "info");
          for (const group of selectedGroups) {
            try {
              classificationStore.addLog(`正在创建收藏夹: 「${group.category_name}」...`, "info");
              await BilibiliAPI.createFolder(group.category_name, csrf);
              classificationStore.addLog(`收藏夹 「${group.category_name}」 创建成功！`, "success");
              await new Promise((resolve2) => setTimeout(resolve2, 500));
            } catch (error) {
              classificationStore.addLog(`创建收藏夹 「${group.category_name}」 失败: ${error.message}`, "error");
            }
          }
          classificationStore.addLog("选定的优化操作已执行完毕！请刷新页面查看新的收藏夹。", "success");
          diagnosisStore.setDiagnosisReport(null);
        }
        // 更新诊断配置
        updateDiagnosisConfig(config) {
          const diagnosisStore = this.getDiagnosisStore();
          diagnosisStore.updateDiagnosisConfig(config);
        }
        // 更新分组选择
        updateGroupSelection(index, selected) {
          const diagnosisStore = this.getDiagnosisStore();
          diagnosisStore.updateGroupSelection(index, selected);
        }
        // 重置诊断
        resetDiagnosis() {
          const diagnosisStore = this.getDiagnosisStore();
          diagnosisStore.resetDiagnosis();
        }
      }
      class AnalyticsService {
        constructor() {
          this.uiStore = null;
        }
        // 获取 uiStore 实例（延迟初始化）
        getUIStore() {
          if (!this.uiStore) {
            this.uiStore = useUIStore();
          }
          return this.uiStore;
        }
        // 加载分析数据
        loadAnalyticsData() {
          this.getUIStore().loadAnalyticsData();
        }
        // 处理数据并生成图表数据
        processAnalyticsData(period) {
          const uiStore = this.getUIStore();
          const filteredData = uiStore.getFilteredAnalyticsData(period);
          if (filteredData.length === 0) {
            return null;
          }
          const folderCounts = filteredData.reduce((acc, item) => {
            const folderName = item.targetFolderName || "未知";
            acc[folderName] = (acc[folderName] || 0) + 1;
            return acc;
          }, {});
          const labels = Object.keys(folderCounts);
          const data = Object.values(folderCounts);
          return {
            labels,
            datasets: [
              {
                backgroundColor: [
                  "#fb7299",
                  "#00a1d6",
                  "#ffc107",
                  "#28a745",
                  "#6c757d",
                  "#17a2b8",
                  "#fd7e14",
                  "#6610f2"
                ],
                data
              }
            ]
          };
        }
        // 获取总收藏数
        getTotalCount(period) {
          const uiStore = this.getUIStore();
          const filteredData = uiStore.getFilteredAnalyticsData(period);
          return filteredData.length;
        }
        // 添加分析记录
        addAnalyticsRecord(record) {
          this.getUIStore().addAnalyticsRecord(record);
        }
        // 获取分析数据
        getAnalyticsData() {
          const uiStore = this.getUIStore();
          return uiStore.analyticsData;
        }
        // 获取按时间段过滤的数据
        getFilteredData(period) {
          const uiStore = this.getUIStore();
          return uiStore.getFilteredAnalyticsData(period);
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
        async batchCreateFolders(names2, csrf) {
          const results = [];
          for (let i = 0; i < names2.length; i++) {
            const name = names2[i];
            try {
              const result = await this.createFolder(name, csrf);
              results.push({ name, success: true, result });
              await new Promise((resolve2) => setTimeout(resolve2, 500));
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
      const diagnosisService = new DiagnosisService();
      const analyticsService = new AnalyticsService();
      const folderService = new FolderService();
      class EventBus {
        constructor() {
          this.events = {};
        }
        // 注册事件监听器
        on(event, callback2) {
          if (!this.events[event]) {
            this.events[event] = [];
          }
          this.events[event].push(callback2);
        }
        // 移除事件监听器
        off(event, callback2) {
          if (!this.events[event]) return;
          if (!callback2) {
            this.events[event] = [];
          } else {
            this.events[event] = this.events[event].filter((cb) => cb !== callback2);
          }
        }
        // 触发事件
        emit(event, data) {
          if (!this.events[event]) return;
          this.events[event].forEach((callback2) => {
            callback2(data);
          });
        }
        // 只触发一次的事件
        once(event, callback2) {
          const onceCallback = (data) => {
            callback2(data);
            this.off(event, onceCallback);
          };
          this.on(event, onceCallback);
        }
      }
      const eventBus = new EventBus();
      const SettingsServiceKey = Symbol("settingsService");
      const ClassificationServiceKey = Symbol("classificationService");
      const DiagnosisServiceKey = Symbol("diagnosisService");
      const AnalyticsServiceKey = Symbol("analyticsService");
      const FolderServiceKey = Symbol("folderService");
      const SettingsStoreKey = Symbol("settingsStore");
      const ClassificationStoreKey = Symbol("classificationStore");
      const DiagnosisStoreKey = Symbol("diagnosisStore");
      const UIStoreKey = Symbol("uiStore");
      const EventBusKey = Symbol("eventBus");
      function provideAppServices() {
        provide(SettingsServiceKey, settingsService);
        provide(ClassificationServiceKey, classificationService);
        provide(DiagnosisServiceKey, diagnosisService);
        provide(AnalyticsServiceKey, analyticsService);
        provide(FolderServiceKey, folderService);
        provide(SettingsStoreKey, useSettingsStore());
        provide(ClassificationStoreKey, useClassificationStore());
        provide(DiagnosisStoreKey, useDiagnosisStore());
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
          const visible = computed(() => uiStore.isVisible);
          function closePanel() {
            window.close();
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
      const _hoisted_2$a = { class: "bfc-panel-header" };
      const _hoisted_3$9 = { class: "icons" };
      const _hoisted_4$9 = { class: "bfc-panel-body" };
      function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
        return $setup.visible ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
          createElementVNode("div", _hoisted_2$a, [
            _cache[1] || (_cache[1] = createElementVNode("h2", null, "AI分类助手", -1)),
            createElementVNode("div", _hoisted_3$9, [
              createElementVNode("span", {
                id: "bfc-close-panel",
                title: "关闭页面",
                onClick: _cache[0] || (_cache[0] = (...args) => $setup.closePanel && $setup.closePanel(...args))
              }, "❌")
            ])
          ]),
          createElementVNode("div", _hoisted_4$9, [
            renderSlot(_ctx.$slots, "default")
          ]),
          _cache[2] || (_cache[2] = createElementVNode("div", { class: "bfc-panel-footer" }, " Made with ❤️ by Roo ", -1))
        ])) : createCommentVNode("", true);
      }
      const MainLayout = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
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
          function switchToDiagnoseTab() {
            uiStore.switchToDiagnoseTab();
          }
          function switchToAnalyticsTab() {
            uiStore.switchToAnalyticsTab();
          }
          return {
            activeTab,
            switchToSettingsTab,
            switchToClassifyTab,
            switchToDiagnoseTab,
            switchToAnalyticsTab
          };
        }
      };
      const _hoisted_1$a = { class: "bfc-tabs" };
      function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
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
            class: normalizeClass({ active: $setup.activeTab === "diagnose" }),
            onClick: _cache[2] || (_cache[2] = (...args) => $setup.switchToDiagnoseTab && $setup.switchToDiagnoseTab(...args))
          }, " 智能诊断 ", 2),
          createElementVNode("button", {
            class: normalizeClass({ active: $setup.activeTab === "analytics" }),
            onClick: _cache[3] || (_cache[3] = (...args) => $setup.switchToAnalyticsTab && $setup.switchToAnalyticsTab(...args))
          }, " 数据分析 ", 2)
        ]);
      }
      const TabNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
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
      const _hoisted_2$9 = {
        id: "bfc-log",
        ref: "logContainer",
        class: "bfc-log-panel"
      };
      function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$9, [
          createElementVNode("div", _hoisted_2$9, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.logs, (log, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["bfc-log-item", log.type])
              }, toDisplayString(log.message), 3);
            }), 128))
          ], 512)
        ]);
      }
      const LogPanel = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-5e6e74b4"]]);
      const _sfc_main$9 = {
        name: "SettingsView",
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
        emits: ["update:settings", "save-settings", "toggle-advanced", "restore-prompt"]
      };
      const _hoisted_1$8 = { id: "bfc-settings-view" };
      const _hoisted_2$8 = { class: "bfc-form-group" };
      const _hoisted_3$8 = ["value"];
      const _hoisted_4$8 = { class: "bfc-form-group" };
      const _hoisted_5$8 = ["value"];
      const _hoisted_6$7 = { class: "bfc-form-group" };
      const _hoisted_7$5 = ["value"];
      const _hoisted_8$5 = { class: "bfc-form-group" };
      const _hoisted_9$5 = ["value"];
      const _hoisted_10$4 = ["value"];
      const _hoisted_11$2 = {
        class: "bfc-advanced-settings-toggle",
        style: { "margin-top": "15px", "text-align": "center" }
      };
      const _hoisted_12$2 = { class: "bfc-form-group" };
      const _hoisted_13$2 = ["value"];
      function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$8, [
          _cache[18] || (_cache[18] = createElementVNode("h3", null, "AI 设置", -1)),
          createElementVNode("div", _hoisted_2$8, [
            _cache[9] || (_cache[9] = createElementVNode("label", { for: "bfc-api-key" }, "API Key", -1)),
            createElementVNode("input", {
              type: "password",
              id: "bfc-api-key",
              class: "bfc-input",
              placeholder: "请输入你的API Key",
              value: $props.settings.apiKey,
              onInput: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:settings", { ...$props.settings, apiKey: $event.target.value }))
            }, null, 40, _hoisted_3$8)
          ]),
          createElementVNode("div", _hoisted_4$8, [
            _cache[10] || (_cache[10] = createElementVNode("label", { for: "bfc-api-host" }, "API Host", -1)),
            createElementVNode("input", {
              type: "text",
              id: "bfc-api-host",
              class: "bfc-input",
              placeholder: "例如: https://api.openai.com",
              value: $props.settings.apiHost,
              onInput: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:settings", { ...$props.settings, apiHost: $event.target.value }))
            }, null, 40, _hoisted_5$8)
          ]),
          createElementVNode("div", _hoisted_6$7, [
            _cache[12] || (_cache[12] = createElementVNode("label", { for: "bfc-ai-provider" }, "AI 提供商", -1)),
            createElementVNode("select", {
              id: "bfc-ai-provider",
              class: "bfc-select",
              value: $props.settings.aiProvider,
              onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:settings", { ...$props.settings, aiProvider: $event.target.value }))
            }, _cache[11] || (_cache[11] = [
              createElementVNode("option", { value: "openai" }, "OpenAI", -1),
              createElementVNode("option", { value: "zhipu" }, "智谱AI", -1)
            ]), 40, _hoisted_7$5)
          ]),
          createElementVNode("div", _hoisted_8$5, [
            _cache[14] || (_cache[14] = createElementVNode("label", { for: "bfc-model-select" }, "AI 模型", -1)),
            createElementVNode("select", {
              id: "bfc-model-select",
              class: "bfc-select",
              value: $props.settings.apiModel,
              onChange: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:settings", { ...$props.settings, apiModel: $event.target.value }))
            }, _cache[13] || (_cache[13] = [
              createElementVNode("option", { value: "gpt-3.5-turbo" }, "gpt-3.5-turbo", -1),
              createElementVNode("option", { value: "gpt-4" }, "gpt-4", -1),
              createElementVNode("option", { value: "gpt-4o" }, "gpt-4o", -1),
              createElementVNode("option", { value: "custom" }, "自定义", -1)
            ]), 40, _hoisted_9$5)
          ]),
          createElementVNode("div", {
            id: "bfc-custom-model-group",
            class: normalizeClass(["bfc-form-group", { "bfc-hidden": $props.settings.apiModel !== "custom" }])
          }, [
            _cache[15] || (_cache[15] = createElementVNode("label", { for: "bfc-custom-model" }, "自定义模型名称", -1)),
            createElementVNode("input", {
              type: "text",
              id: "bfc-custom-model",
              class: "bfc-input",
              placeholder: "请输入模型名称",
              value: $props.settings.customApiModel,
              onInput: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("update:settings", { ...$props.settings, customApiModel: $event.target.value }))
            }, null, 40, _hoisted_10$4)
          ], 2),
          createElementVNode("div", _hoisted_11$2, [
            createElementVNode("a", {
              href: "#",
              id: "bfc-advanced-toggle-link",
              onClick: _cache[5] || (_cache[5] = withModifiers(($event) => _ctx.$emit("toggle-advanced"), ["prevent"])),
              style: { "color": "#00a1d6", "text-decoration": "none", "font-size": "14px" }
            }, toDisplayString($props.advancedSettingsVisible ? "高级设置 ▲" : "高级设置 ▼"), 1)
          ]),
          createElementVNode("div", {
            id: "bfc-advanced-settings",
            class: normalizeClass({ "bfc-hidden": !$props.advancedSettingsVisible }),
            style: { "margin-top": "15px" }
          }, [
            createElementVNode("div", _hoisted_12$2, [
              _cache[16] || (_cache[16] = createElementVNode("label", { for: "bfc-custom-prompt" }, "自定义Prompt模板", -1)),
              createElementVNode("textarea", {
                id: "bfc-custom-prompt",
                class: "bfc-input",
                rows: "8",
                style: { "height": "auto", "resize": "vertical" },
                placeholder: "使用占位符: {videoTitle}, {videoIntro}, {videoUpperName}, {folderList}",
                value: $props.settings.customPrompt,
                onInput: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("update:settings", { ...$props.settings, customPrompt: $event.target.value }))
              }, null, 40, _hoisted_13$2),
              _cache[17] || (_cache[17] = createElementVNode("small", { style: { "display": "block", "margin-top": "5px", "color": "#999" } }, "占位符: {videoTitle}, {videoIntro}, {videoUpperName}, {folderList}", -1))
            ]),
            createElementVNode("button", {
              id: "bfc-restore-prompt-btn",
              class: "bfc-button",
              onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("restore-prompt")),
              style: { "background-color": "#6c757d" }
            }, "恢复默认Prompt")
          ], 2),
          createElementVNode("button", {
            id: "bfc-save-settings-btn",
            class: "bfc-button",
            onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("save-settings")),
            style: { "margin-top": "15px" }
          }, "保存设置")
        ]);
      }
      const SettingsView = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
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
      const _hoisted_2$7 = { class: "transfer-list-panel" };
      const _hoisted_3$7 = { class: "transfer-list-header" };
      const _hoisted_4$7 = { class: "transfer-list-items" };
      const _hoisted_5$7 = ["onClick"];
      const _hoisted_6$6 = { class: "transfer-list-panel" };
      const _hoisted_7$4 = { class: "transfer-list-header" };
      const _hoisted_8$4 = { class: "transfer-list-items" };
      const _hoisted_9$4 = ["onClick"];
      function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$7, [
          createElementVNode("div", _hoisted_2$7, [
            createElementVNode("div", _hoisted_3$7, [
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
            createElementVNode("ul", _hoisted_4$7, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.filteredLeftItems, (item) => {
                return openBlock(), createElementBlock("li", {
                  key: item.id,
                  onClick: ($event) => $setup.moveToRight(item)
                }, toDisplayString(item.title) + " (" + toDisplayString(item.media_count) + ") ", 9, _hoisted_5$7);
              }), 128))
            ])
          ]),
          _cache[4] || (_cache[4] = createElementVNode("div", { class: "transfer-list-actions" }, [
            createElementVNode("span", null, "↔️")
          ], -1)),
          createElementVNode("div", _hoisted_6$6, [
            createElementVNode("div", _hoisted_7$4, [
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
            createElementVNode("ul", _hoisted_8$4, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.filteredRightItems, (item) => {
                return openBlock(), createElementBlock("li", {
                  key: item.id,
                  onClick: ($event) => $setup.moveToLeft(item)
                }, toDisplayString(item.title) + " (" + toDisplayString(item.media_count) + ") ", 9, _hoisted_9$4);
              }), 128))
            ])
          ])
        ]);
      }
      const TransferList = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-6b0f69a3"]]);
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
      const _hoisted_2$6 = { class: "bfc-steps-indicator" };
      const _hoisted_3$6 = { class: "bfc-form-group" };
      const _hoisted_4$6 = { class: "bfc-checkbox-item" };
      const _hoisted_5$6 = ["checked"];
      const _hoisted_6$5 = { class: "bfc-form-group" };
      const _hoisted_7$3 = ["value"];
      const _hoisted_8$3 = { class: "bfc-action-buttons" };
      const _hoisted_9$3 = { class: "bfc-step-navigation" };
      const _hoisted_10$3 = {
        id: "bfc-log",
        ref: "logContainer",
        style: { "margin-top": "10px", "height": "200px", "overflow-y": "scroll", "background": "#fff", "border": "1px solid #e3e5e7", "padding": "10px", "border-radius": "6px" }
      };
      function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_TransferList = resolveComponent("TransferList");
        return openBlock(), createElementBlock("div", _hoisted_1$6, [
          createElementVNode("div", _hoisted_2$6, [
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
            createElementVNode("div", _hoisted_3$6, [
              createElementVNode("div", _hoisted_4$6, [
                createElementVNode("input", {
                  type: "checkbox",
                  id: "bfc-force-reclassify",
                  checked: $props.forceReclassify,
                  onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:forceReclassify", $event.target.checked))
                }, null, 40, _hoisted_5$6),
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
            createElementVNode("div", _hoisted_6$5, [
              _cache[17] || (_cache[17] = createElementVNode("label", { for: "batch-size-input" }, "每批处理视频数", -1)),
              createElementVNode("input", {
                type: "number",
                id: "batch-size-input",
                class: "bfc-input",
                value: $props.batchSize,
                onInput: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("update:batchSize", parseInt($event.target.value, 10)))
              }, null, 40, _hoisted_7$3)
            ]),
            createElementVNode("div", _hoisted_8$3, [
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
          createElementVNode("div", _hoisted_9$3, [
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
          createElementVNode("div", _hoisted_10$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($props.logs, (log, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["bfc-log-item", log.type])
              }, toDisplayString(log.message), 3);
            }), 128))
          ], 512)
        ]);
      }
      const ClassifyView = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
      const _sfc_main$6 = {
        name: "DiagnoseView",
        props: {
          diagnosisState: {
            type: Object,
            required: true
          },
          diagnosisReport: {
            type: Object,
            default: null
          }
        },
        emits: ["start-diagnosis", "apply-diagnosis", "update:diagnosisReport"],
        setup(props, { emit }) {
          const updateGroupSelection = (index, selected) => {
            const newReport = JSON.parse(JSON.stringify(props.diagnosisReport));
            newReport.newGroups[index].selected = selected;
            emit("update:diagnosisReport", newReport);
          };
          return {
            updateGroupSelection
          };
        }
      };
      const _hoisted_1$5 = { id: "bfc-diagnose-view" };
      const _hoisted_2$5 = { class: "bfc-action-buttons" };
      const _hoisted_3$5 = ["disabled"];
      const _hoisted_4$5 = { key: 0 };
      const _hoisted_5$5 = { class: "bfc-progress-bar" };
      const _hoisted_6$4 = {
        key: 1,
        id: "bfc-diagnose-report"
      };
      const _hoisted_7$2 = { class: "bfc-report-section" };
      const _hoisted_8$2 = ["checked", "onChange"];
      const _hoisted_9$2 = { key: 0 };
      const _hoisted_10$2 = {
        class: "bfc-action-buttons",
        style: { "margin-top": "20px" }
      };
      function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$5, [
          _cache[4] || (_cache[4] = createElementVNode("h3", null, "收藏夹智能诊断", -1)),
          _cache[5] || (_cache[5] = createElementVNode("p", null, "此功能会扫描您所有的收藏夹，并由AI分析视频内容，为您提供创建新分组、合并收藏夹等优化建议。", -1)),
          createElementVNode("div", _hoisted_2$5, [
            createElementVNode("button", {
              id: "bfc-start-diagnose-btn",
              class: "bfc-button",
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("start-diagnosis")),
              disabled: $props.diagnosisState.running
            }, toDisplayString($props.diagnosisState.running ? "诊断中..." : "开始诊断"), 9, _hoisted_3$5)
          ]),
          $props.diagnosisState.running || $props.diagnosisState.progress > 0 ? (openBlock(), createElementBlock("div", _hoisted_4$5, [
            createElementVNode("p", null, toDisplayString($props.diagnosisState.message), 1),
            createElementVNode("div", _hoisted_5$5, [
              createElementVNode("div", {
                class: "bfc-progress",
                style: normalizeStyle({ width: $props.diagnosisState.progress + "%" })
              }, null, 4)
            ])
          ])) : createCommentVNode("", true),
          $props.diagnosisReport ? (openBlock(), createElementBlock("div", _hoisted_6$4, [
            _cache[3] || (_cache[3] = createElementVNode("h4", null, "诊断报告", -1)),
            createElementVNode("div", _hoisted_7$2, [
              _cache[2] || (_cache[2] = createElementVNode("h5", null, "建议创建的新分组", -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList($props.diagnosisReport.newGroups, (group, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: "bfc-report-item"
                }, [
                  createElementVNode("input", {
                    type: "checkbox",
                    checked: group.selected,
                    onChange: ($event) => $setup.updateGroupSelection(index, $event.target.checked)
                  }, null, 40, _hoisted_8$2),
                  createElementVNode("strong", null, toDisplayString(group.category_name), 1),
                  createTextVNode(" (" + toDisplayString(group.video_titles.length) + "个视频) ", 1),
                  createElementVNode("ul", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(group.video_titles.slice(0, 3), (title) => {
                      return openBlock(), createElementBlock("li", { key: title }, toDisplayString(title), 1);
                    }), 128)),
                    group.video_titles.length > 3 ? (openBlock(), createElementBlock("li", _hoisted_9$2, "...等")) : createCommentVNode("", true)
                  ])
                ]);
              }), 128))
            ]),
            createElementVNode("div", _hoisted_10$2, [
              createElementVNode("button", {
                id: "bfc-apply-diagnosis-btn",
                class: "bfc-button",
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("apply-diagnosis"))
              }, "一键执行优化")
            ])
          ])) : createCommentVNode("", true)
        ]);
      }
      const DiagnoseView = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
      Chart$1.register(plugin_title, plugin_tooltip, plugin_legend, ArcElement, CategoryScale);
      const _sfc_main$5 = {
        name: "ResultsView",
        components: {
          Doughnut
        },
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
      const _hoisted_1$4 = { id: "bfc-results-view" };
      const _hoisted_2$4 = { class: "bfc-results-summary" };
      const _hoisted_3$4 = { class: "bfc-chart-container" };
      const _hoisted_4$4 = { class: "bfc-results-stats" };
      const _hoisted_5$4 = { class: "success" };
      const _hoisted_6$3 = { class: "info" };
      const _hoisted_7$1 = { class: "error" };
      const _hoisted_8$1 = { class: "bfc-results-table-container" };
      const _hoisted_9$1 = { class: "bfc-results-table" };
      const _hoisted_10$1 = ["href"];
      const _hoisted_11$1 = ["onUpdate:modelValue"];
      const _hoisted_12$1 = ["value"];
      const _hoisted_13$1 = {
        class: "bfc-action-buttons",
        style: { "margin-top": "20px" }
      };
      function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_Doughnut = resolveComponent("Doughnut");
        return openBlock(), createElementBlock("div", _hoisted_1$4, [
          _cache[7] || (_cache[7] = createElementVNode("h3", null, "分类结果", -1)),
          createElementVNode("div", _hoisted_2$4, [
            createElementVNode("div", _hoisted_3$4, [
              $props.chartData ? (openBlock(), createBlock(_component_Doughnut, {
                key: 0,
                data: $props.chartData
              }, null, 8, ["data"])) : createCommentVNode("", true)
            ]),
            createElementVNode("div", _hoisted_4$4, [
              createElementVNode("p", null, [
                _cache[2] || (_cache[2] = createElementVNode("strong", null, "总计:", -1)),
                createTextVNode(" " + toDisplayString($props.classificationResults.length) + " 个视频", 1)
              ]),
              createElementVNode("p", _hoisted_5$4, [
                _cache[3] || (_cache[3] = createElementVNode("strong", null, "成功:", -1)),
                createTextVNode(" " + toDisplayString($props.summary.success), 1)
              ]),
              createElementVNode("p", _hoisted_6$3, [
                _cache[4] || (_cache[4] = createElementVNode("strong", null, "跳过:", -1)),
                createTextVNode(" " + toDisplayString($props.summary.skipped), 1)
              ]),
              createElementVNode("p", _hoisted_7$1, [
                _cache[5] || (_cache[5] = createElementVNode("strong", null, "失败:", -1)),
                createTextVNode(" " + toDisplayString($props.summary.failed), 1)
              ])
            ])
          ]),
          createElementVNode("div", _hoisted_8$1, [
            createElementVNode("table", _hoisted_9$1, [
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
                      }, toDisplayString(result.video.title), 9, _hoisted_10$1)
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
                          }, toDisplayString(folder.title), 9, _hoisted_12$1);
                        }), 128))
                      ], 8, _hoisted_11$1), [
                        [vModelSelect, result.correctedTargetFolderId]
                      ])
                    ])
                  ]);
                }), 128))
              ])
            ])
          ]),
          createElementVNode("div", _hoisted_13$1, [
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
      const ResultsView = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
      Chart$1.register(plugin_title, plugin_tooltip, plugin_legend, ArcElement, CategoryScale);
      const _sfc_main$4 = {
        name: "AnalyticsView",
        components: {
          Doughnut
        },
        data() {
          return {
            period: "daily",
            // daily, weekly, monthly, yearly
            analyticsData: [],
            totalCount: 0,
            chartData: null,
            chartOptions: {
              responsive: true,
              maintainAspectRatio: false
            }
          };
        },
        methods: {
          setPeriod(period) {
            this.period = period;
            this.processData();
          },
          loadAnalyticsData() {
            try {
              const rawData = GM.getValue("bfc-analytics-data", "[]");
              const data = JSON.parse(rawData);
              const dataArray = Array.isArray(data) ? data : [];
              this.analyticsData = dataArray.map((item) => ({
                ...item,
                timestamp: new Date(item.timestamp)
              }));
              this.processData();
            } catch (error) {
              console.error("加载分析数据失败:", error);
              this.analyticsData = [];
              this.processData();
            }
          },
          processData() {
            const now = /* @__PURE__ */ new Date();
            let filteredData = [];
            switch (this.period) {
              case "daily":
                filteredData = this.analyticsData.filter((item) => {
                  const itemDate = item.timestamp;
                  return itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() === now.getMonth() && itemDate.getDate() === now.getDate();
                });
                break;
              case "weekly":
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                filteredData = this.analyticsData.filter((item) => item.timestamp >= startOfWeek);
                break;
              case "monthly":
                filteredData = this.analyticsData.filter((item) => {
                  return item.timestamp.getFullYear() === now.getFullYear() && item.timestamp.getMonth() === now.getMonth();
                });
                break;
              case "yearly":
                filteredData = this.analyticsData.filter((item) => {
                  return item.timestamp.getFullYear() === now.getFullYear();
                });
                break;
            }
            this.totalCount = filteredData.length;
            if (filteredData.length === 0) {
              this.chartData = null;
              return;
            }
            const folderCounts = filteredData.reduce((acc, item) => {
              const folderName = item.targetFolderName || "未知";
              acc[folderName] = (acc[folderName] || 0) + 1;
              return acc;
            }, {});
            const labels = Object.keys(folderCounts);
            const data = Object.values(folderCounts);
            this.chartData = {
              labels,
              datasets: [
                {
                  backgroundColor: ["#fb7299", "#00a1d6", "#ffc107", "#28a745", "#6c757d", "#17a2b8", "#fd7e14", "#6610f2"],
                  data
                }
              ]
            };
          }
        },
        mounted() {
          this.loadAnalyticsData();
        }
      };
      const _hoisted_1$3 = { id: "bfc-analytics-view" };
      const _hoisted_2$3 = { class: "bfc-analytics-controls" };
      const _hoisted_3$3 = { class: "bfc-analytics-chart-container" };
      const _hoisted_4$3 = { key: 1 };
      const _hoisted_5$3 = { class: "bfc-analytics-summary" };
      function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_Doughnut = resolveComponent("Doughnut");
        return openBlock(), createElementBlock("div", _hoisted_1$3, [
          _cache[4] || (_cache[4] = createElementVNode("h3", null, "数据分析", -1)),
          createElementVNode("div", _hoisted_2$3, [
            createElementVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => $options.setPeriod("daily")),
              class: normalizeClass({ active: $data.period === "daily" })
            }, "每日", 2),
            createElementVNode("button", {
              onClick: _cache[1] || (_cache[1] = ($event) => $options.setPeriod("weekly")),
              class: normalizeClass({ active: $data.period === "weekly" })
            }, "每周", 2),
            createElementVNode("button", {
              onClick: _cache[2] || (_cache[2] = ($event) => $options.setPeriod("monthly")),
              class: normalizeClass({ active: $data.period === "monthly" })
            }, "每月", 2),
            createElementVNode("button", {
              onClick: _cache[3] || (_cache[3] = ($event) => $options.setPeriod("yearly")),
              class: normalizeClass({ active: $data.period === "yearly" })
            }, "每年", 2)
          ]),
          createElementVNode("div", _hoisted_3$3, [
            $data.chartData ? (openBlock(), createBlock(_component_Doughnut, {
              key: 0,
              data: $data.chartData,
              options: $data.chartOptions
            }, null, 8, ["data", "options"])) : (openBlock(), createElementBlock("p", _hoisted_4$3, "暂无数据"))
          ]),
          createElementVNode("div", _hoisted_5$3, [
            createElementVNode("p", null, "总收藏数: " + toDisplayString($data.totalCount), 1)
          ])
        ]);
      }
      const AnalyticsView = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
      Chart$1.register(plugin_title, plugin_tooltip, plugin_legend, ArcElement, CategoryScale);
      const _sfc_main$3 = {
        name: "App",
        components: {
          Doughnut,
          MainLayout,
          TabNavigation,
          LogPanel,
          SettingsView,
          ClassifyView,
          DiagnoseView,
          ResultsView,
          AnalyticsView
        },
        setup() {
          provideAppServices();
          const settingsStore = useSettingsStore();
          const classificationStore = useClassificationStore();
          const diagnosisStore = useDiagnosisStore();
          const uiStore = useUIStore();
          const visible = computed(() => uiStore.isVisible);
          const activeTab = computed(() => uiStore.currentTab);
          const settings = computed(() => settingsStore);
          const advancedSettingsVisible = computed(() => settingsStore.advancedSettingsVisible);
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
          const diagnosisState = computed(() => diagnosisStore.diagnosisState);
          const diagnosisReport = computed(() => diagnosisStore.diagnosisReport);
          const taskSummary = computed(() => classificationStore.taskSummary);
          const availableTargetFolders = computed(() => classificationStore.availableTargetFolders);
          onMounted(async () => {
            if (window.location.hash === "#bfc-settings") {
              uiStore.setVisible(true);
              await settingsService.loadSettings();
              await initSettingsPage();
              checkForUnfinishedTask();
            }
          });
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
          function startDiagnosis() {
            diagnosisService.startDiagnosis();
          }
          function applyDiagnosis() {
            diagnosisService.applyDiagnosis();
          }
          function updateDiagnosisReport(report) {
            diagnosisStore.setDiagnosisReport(report);
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
            diagnosisState,
            diagnosisReport,
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
            startDiagnosis,
            applyDiagnosis,
            updateDiagnosisReport,
            batchCreate
          };
        }
      };
      function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_TabNavigation = resolveComponent("TabNavigation");
        const _component_SettingsView = resolveComponent("SettingsView");
        const _component_LogPanel = resolveComponent("LogPanel");
        const _component_ClassifyView = resolveComponent("ClassifyView");
        const _component_DiagnoseView = resolveComponent("DiagnoseView");
        const _component_ResultsView = resolveComponent("ResultsView");
        const _component_AnalyticsView = resolveComponent("AnalyticsView");
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
            withDirectives(createVNode(_component_DiagnoseView, {
              "diagnosis-state": $setup.diagnosisState,
              "diagnosis-report": $setup.diagnosisReport,
              "onUpdate:diagnosisReport": $setup.updateDiagnosisReport,
              onStartDiagnosis: $setup.startDiagnosis,
              onApplyDiagnosis: $setup.applyDiagnosis
            }, {
              default: withCtx(() => [
                createVNode(_component_LogPanel)
              ]),
              _: 1
            }, 8, ["diagnosis-state", "diagnosis-report", "onUpdate:diagnosisReport", "onStartDiagnosis", "onApplyDiagnosis"]), [
              [vShow, $setup.activeTab === "diagnose"]
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
            withDirectives(createVNode(_component_AnalyticsView, null, null, 512), [
              [vShow, $setup.activeTab === "analytics"]
            ])
          ]),
          _: 1
        });
      }
      const App$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
      const _sfc_main$2 = {
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
      const _hoisted_1$2 = {
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
      function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
        return $data.isVisible ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
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
      const VideoPagePopup = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-4f559ce1"]]);
      const _sfc_main$1 = {
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
      const _hoisted_1$1 = {
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
      function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        return $setup.visible ? (openBlock(), createElementBlock("div", {
          key: 0,
          id: "bfc-floating-recommendation",
          class: normalizeClass(["floating-recommendation", {
            "slide-in": $setup.animateIn && $setup.isPanelExpanded,
            "collapsed": !$setup.isPanelExpanded
          }])
        }, [
          $setup.loading ? (openBlock(), createElementBlock("div", _hoisted_1$1, _cache[5] || (_cache[5] = [
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
      const FloatingRecommendation = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-e66bf753"]]);
      const _sfc_main = {
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
      const _hoisted_1 = { class: "ai-icon" };
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
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["side-button", $setup.buttonClasses]),
          onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleClick && $setup.handleClick(...args)),
          onMouseenter: _cache[1] || (_cache[1] = ($event) => $setup.isHovered = true),
          onMouseleave: _cache[2] || (_cache[2] = ($event) => $setup.isHovered = false)
        }, [
          createElementVNode("div", _hoisted_1, [
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
      const SideButton = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cb0d2287"]]);
      const UIManager = {
        popupVM: null,
        appInstance: null,
        // 保存 Vue 应用实例
        floatingRecommendationVM: null,
        // 悬浮推荐组件实例
        sideButtonVM: null,
        // 侧边按钮组件实例
        init: function(isSettingsPage = false) {
          if (isSettingsPage) {
            this.injectVueApp();
          } else {
            this.injectFAB();
          }
        },
        injectVueApp: function() {
          let appContainer = document.getElementById("bfc-app-container");
          if (this.appInstance) {
            this.appInstance.unmount();
            this.appInstance = null;
          }
          if (appContainer) {
            appContainer.remove();
          }
          appContainer = document.createElement("div");
          appContainer.id = "bfc-app-container";
          document.body.appendChild(appContainer);
          const app = createApp(App$1);
          const pinia2 = window.__bfc_pinia || createPinia();
          app.use(pinia2);
          this.appInstance = app.mount("#bfc-app-container");
        },
        injectFAB: function() {
          const fab = document.createElement("div");
          fab.id = "bfc-fab";
          fab.innerHTML = "<span>AI</span>";
          fab.addEventListener("click", () => {
            const cleanUrl = window.location.href.split("#")[0];
            window.open(cleanUrl + "#bfc-settings", "_blank");
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
          const app = createApp(VideoPagePopup, {});
          const pinia2 = window.__bfc_pinia || createPinia();
          app.use(pinia2);
          this.popupVM = app.mount(popupContainer);
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
          const app = createApp(FloatingRecommendation);
          const pinia2 = window.__bfc_pinia || createPinia();
          app.use(pinia2);
          this.floatingRecommendationVM = app.mount(floatingContainer);
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
          const app = createApp(SideButton);
          const pinia2 = window.__bfc_pinia || createPinia();
          app.use(pinia2);
          this.sideButtonVM = app.mount(sideButtonContainer);
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
      const pinia = createPinia();
      const getStores = () => {
        return __vitePreload(() => Promise.resolve().then(() => indexCr6whXI3), void 0 ).then((stores) => ({
          useClassificationStore: stores.useClassificationStore,
          useFloatingRecommendationStore: stores.useFloatingRecommendationStore,
          useSettingsStore: stores.useSettingsStore
        }));
      };
      const App = {
        isProcessing: false,
        init: async function() {
          this.initPinia();
          if (window.location.hash === "#bfc-settings") {
            this.initSettingsPage();
          } else if (window.location.href.includes("space.bilibili.com")) {
            this.initSpacePage();
          } else if (window.location.href.includes("www.bilibili.com/video/")) {
            this.initVideoPageListeners();
          }
        },
        // 新增：初始化 Pinia
        initPinia: function() {
          const tempDiv = document.createElement("div");
          tempDiv.style.display = "none";
          document.body.appendChild(tempDiv);
          const { createApp: createApp2 } = Vue;
          const app = createApp2({});
          app.use(pinia);
          app.mount(tempDiv);
          window.__bfc_pinia = pinia;
        },
        initSettingsPage: function() {
          document.body.classList.add("bfc-settings-mode");
          UIManager.init(true);
        },
        initSpacePage: function() {
          UIManager.init(false);
        },
        initVideoPageListeners: async function() {
          UIManager.initFloatingRecommendationUI();
          UIManager.initSideButtonUI();
          this.initRealtimeVideoDetection();
        },
        initRealtimeVideoDetection: async function() {
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
        detectAndProcessVideo: async function() {
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
      (async () => {
        await App.init();
      })();

      const indexCr6whXI3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        useClassificationStore,
        useDiagnosisStore,
        useFloatingRecommendationStore,
        useSettingsStore,
        useUIStore
      }, Symbol.toStringTag, { value: 'Module' }));

    })
  };
}));

System.import("./__entry.js", "./");