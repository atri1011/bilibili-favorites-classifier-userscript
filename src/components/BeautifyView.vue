<template>
  <div class="beautify-view">
    <h3>美化设置</h3>
    <div class="bfc-form-group">
      <label for="blur-intensity">毛玻璃模糊度: {{ blurIntensity }}px</label>
      <input
        id="blur-intensity"
        type="range"
        min="0"
        max="50"
        step="1"
        v-model.number="blurIntensity"
        class="bfc-slider"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingsStore } from '../stores/index.js';

const settingsStore = useSettingsStore();

const blurIntensity = computed({
  get: () => settingsStore.blurIntensity,
  set: (value) => {
    settingsStore.blurIntensity = value;
  },
});
</script>

<style scoped>
.beautify-view {
  padding: 20px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.bfc-form-group {
  margin-bottom: 20px;
}

.bfc-form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.bfc-slider {
  width: 100%;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .bfc-form-group label {
    color: #f0f0f0;
  }
}
</style>