<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { provide } from 'vue';

export default {
  name: 'ModalContainer',
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    provide('closeModal', close);

    return {
      close
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background-color: rgba(255, 255, 255, 0.3); /* 修改：降低不透明度以增强毛玻璃效果 */
  backdrop-filter: blur(var(--blur-intensity));
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90vw;
  height: 80vh;
  max-width: 1200px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.modal-close-button:hover {
  color: #000;
}

@media (prefers-color-scheme: dark) {
  .modal-content {
    background-color: rgba(30, 30, 30, 0.5); /* 修改：同步调整暗色模式下的透明度 */
    color: #f0f0f0;
  }
  .modal-close-button {
    color: #aaa;
  }
  .modal-close-button:hover {
    color: #fff;
  }
}
</style>