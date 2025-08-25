import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import VideoPagePopup from './VideoPagePopup.vue';
import FloatingRecommendation from './components/FloatingRecommendation.vue';
import SideButton from './components/SideButton.vue';
import ModalContainer from './components/ModalContainer.vue';
import { useUIStore } from './stores/uiStore.js';

const UIManager = {
    popupVM: null,
    appInstance: null, // 保存 Vue 应用实例
    floatingRecommendationVM: null, // 悬浮推荐组件实例
    sideButtonVM: null, // 侧边按钮组件实例
    modalInstance: null, // 模态窗口实例
    modalAppInstance: null, // 保存模态框的 Vue 应用实例

    init: function(isSettingsPage = false) {
        // The settings page logic is now handled by the modal
        if (!isSettingsPage) {
            this.injectFAB();
        }
    },

    openAppInModal: function() {
        if (this.modalInstance) {
            return; // Modal is already open
        }

        const modalContainer = document.createElement('div');
        modalContainer.id = 'bfc-modal-container';
        document.body.appendChild(modalContainer);

        const pinia = window.__bfc_pinia || createPinia();
        const uiStore = useUIStore(pinia);

        const uiManagerInstance = this;
        const modalApp = createApp({
            render() {
                const { h } = Vue;
                return h(ModalContainer, {
                    onClose: () => uiManagerInstance.closeAppModal()
                }, {
                    default: () => h(App)
                });
            }
        });
        
        modalApp.use(pinia);
        this.modalAppInstance = modalApp;
        this.modalInstance = modalApp.mount(modalContainer);
        uiStore.openModal();
    },

    closeAppModal: function() {
        if (this.modalAppInstance) {
            this.modalAppInstance.unmount();
            this.modalAppInstance = null;
            this.modalInstance = null;
            const modalContainer = document.getElementById('bfc-modal-container');
            if (modalContainer) {
                document.body.removeChild(modalContainer);
            }
            const pinia = window.__bfc_pinia;
            if (pinia) {
                const uiStore = useUIStore(pinia);
                uiStore.closeModal();
            }
        }
    },

    injectFAB: function() {
        const fab = document.createElement('div');
        fab.id = 'bfc-fab';
        fab.innerHTML = '<span>AI</span>';
        fab.addEventListener('click', () => {
            this.openAppInModal();
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