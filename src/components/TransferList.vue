<template>
  <div class="transfer-list">
    <div class="transfer-list-panel">
      <div class="transfer-list-header">
        <span>{{ leftTitle }}</span>
        <button @click="selectAll" class="transfer-list-select-all">全选</button>
      </div>
      <input type="text" v-model="leftFilter" class="transfer-list-filter" placeholder="搜索...">
      <ul class="transfer-list-items">
        <li v-for="item in filteredLeftItems" :key="item.id" @click="moveToRight(item)">
          {{ item.title }} ({{ item.media_count }})
        </li>
      </ul>
    </div>
    <div class="transfer-list-actions">
      <span>↔️</span>
    </div>
    <div class="transfer-list-panel">
      <div class="transfer-list-header">
        <span>{{ rightTitle }}</span>
        <button @click="deselectAll" class="transfer-list-select-all">全不选</button>
      </div>
      <input type="text" v-model="rightFilter" class="transfer-list-filter" placeholder="搜索...">
      <ul class="transfer-list-items">
        <li v-for="item in filteredRightItems" :key="item.id" @click="moveToLeft(item)">
          {{ item.title }} ({{ item.media_count }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'TransferList',
  props: {
    items: {
      type: Array,
      required: true
    },
    leftTitle: {
      type: String,
      default: '可用列表'
    },
    rightTitle: {
      type: String,
      default: '已选列表'
    }
  },
  emits: ['update:selected'],
  setup(props, { emit }) {
    const leftItems = ref([]);
    const rightItems = ref([]);
    const leftFilter = ref('');
    const rightFilter = ref('');

    watch(() => props.items, (newItems) => {
      leftItems.value = [...newItems];
      rightItems.value = [];
    }, { immediate: true });

    const filteredLeftItems = computed(() =>
      leftItems.value.filter(item =>
        item.title.toLowerCase().includes(leftFilter.value.toLowerCase())
      )
    );

    const filteredRightItems = computed(() =>
      rightItems.value.filter(item =>
        item.title.toLowerCase().includes(rightFilter.value.toLowerCase())
      )
    );

    function moveToRight(item) {
      rightItems.value.push(item);
      leftItems.value = leftItems.value.filter(i => i.id !== item.id);
      emit('update:selected', rightItems.value.map(i => i.id));
    }

    function moveToLeft(item) {
      leftItems.value.push(item);
      rightItems.value = rightItems.value.filter(i => i.id !== item.id);
      emit('update:selected', rightItems.value.map(i => i.id));
    }

    function selectAll() {
      rightItems.value.push(...leftItems.value);
      leftItems.value = [];
      emit('update:selected', rightItems.value.map(item => item.id));
    }

    function deselectAll() {
      leftItems.value.push(...rightItems.value);
      rightItems.value = [];
      emit('update:selected', rightItems.value.map(item => item.id));
    }

    return {
      leftFilter,
      rightFilter,
      filteredLeftItems,
      filteredRightItems,
      moveToRight,
      moveToLeft,
      selectAll,
      deselectAll,
    };
  }
};
</script>

<style scoped>
.transfer-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.transfer-list-panel {
  width: 45%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: transparent;
  border-radius: 6px;
  height: 300px;
  display: flex;
  flex-direction: column;
}
.transfer-list-header {
  padding: 8px 12px;
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.transfer-list-select-all {
    background: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
}
.transfer-list-filter {
  width: calc(100% - 20px);
  margin: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.transfer-list-items {
  list-style: none;
  margin: 0;
  padding: 0 10px 10px;
  overflow-y: auto;
  flex-grow: 1;
}
.transfer-list-items li {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}
.transfer-list-items li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.transfer-list-items li.selected {
  background-color: #bbdefb;
}
.transfer-list-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.transfer-list-actions button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f4f5f7;
  cursor: pointer;
}
.transfer-list-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>