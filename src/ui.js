import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import VideoPagePopup from './VideoPagePopup.vue';
import FloatingRecommendation from './components/FloatingRecommendation.vue';
import SideButton from './components/SideButton.vue';

const UIManager = {
    popupVM: null,
    appInstance: null, // 保存 Vue 应用实例
    floatingRecommendationVM: null, // 悬浮推荐组件实例
    sideButtonVM: null, // 侧边按钮组件实例

    init: function(isSettingsPage = false) {
        if (isSettingsPage) {
            this.injectVueApp();
        } else {
            this.injectFAB();
        }
    },
    injectVueApp: function() {
        // 检查是否已经挂载了应用
        let appContainer = document.getElementById('bfc-app-container');
        
        // 如果已经存在应用实例，先卸载
        if (this.appInstance) {
            this.appInstance.unmount();
            this.appInstance = null;
        }
        
        // 如果已经存在容器，先移除
        if (appContainer) {
            appContainer.remove();
        }
        
        // 创建新的容器
        appContainer = document.createElement('div');
        appContainer.id = 'bfc-app-container';
        document.body.appendChild(appContainer);
        
        // 创建新的 Vue 应用实例，使用全局 Pinia 实例
        const app = createApp(App);
        const pinia = window.__bfc_pinia || createPinia();
        app.use(pinia);
        this.appInstance = app.mount('#bfc-app-container');
    },
    injectFAB: function() {
        const fab = document.createElement('div');
        fab.id = 'bfc-fab';
        fab.innerHTML = '<span>AI</span>';
        fab.addEventListener('click', () => {
            const cleanUrl = window.location.href.split('#')[0];
            window.open(cleanUrl + '#bfc-settings', '_blank');
        });
        document.body.appendChild(fab);
    },
    initPopupUI: function() {
        // 检查是否已经存在弹窗容器
        let popupContainer = document.getElementById('bfc-popup-container');
        
        // 如果已经存在弹窗实例，先卸载
        if (this.popupVM) {
            if (this.popupVM.$ && this.popupVM.$.appContext && this.popupVM.$.appContext.app) {
                this.popupVM.$.appContext.app.unmount();
            }
            this.popupVM = null;
        }
        
        // 如果已经存在容器，先移除
        if (popupContainer) {
            popupContainer.remove();
        }
        
        // 创建新的容器
        popupContainer = document.createElement('div');
        popupContainer.id = 'bfc-popup-container';
        document.body.appendChild(popupContainer);
        
        // 创建新的 Vue 应用实例，使用全局 Pinia 实例
        const app = createApp(VideoPagePopup, {});
        const pinia = window.__bfc_pinia || createPinia();
        app.use(pinia);
        this.popupVM = app.mount(popupContainer);
    },

    initFloatingRecommendationUI: function() {
        let floatingContainer = document.getElementById('bfc-floating-recommendation-container');

        if (this.floatingRecommendationVM) {
            this.floatingRecommendationVM.unmount();
            this.floatingRecommendationVM = null;
        }

        if (floatingContainer) {
            floatingContainer.remove();
        }

        floatingContainer = document.createElement('div');
        floatingContainer.id = 'bfc-floating-recommendation-container';
        document.body.appendChild(floatingContainer);

        const app = createApp(FloatingRecommendation);
        const pinia = window.__bfc_pinia || createPinia();
        app.use(pinia);
        this.floatingRecommendationVM = app.mount(floatingContainer);
    },

    initSideButtonUI: function() {
        let sideButtonContainer = document.getElementById('bfc-side-button-container');

        if (this.sideButtonVM) {
            this.sideButtonVM.unmount();
            this.sideButtonVM = null;
        }

        if (sideButtonContainer) {
            sideButtonContainer.remove();
        }

        sideButtonContainer = document.createElement('div');
        sideButtonContainer.id = 'bfc-side-button-container';
        document.body.appendChild(sideButtonContainer);

        const app = createApp(SideButton);
        const pinia = window.__bfc_pinia || createPinia();
        app.use(pinia);
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

export default UIManager;