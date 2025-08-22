import { ref } from 'vue';

// 创建一个简单的事件总线
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
      // 如果没有提供回调函数，则移除该事件的所有监听器
      this.events[event] = [];
    } else {
      // 移除特定的回调函数
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  // 触发事件
  emit(event, data) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
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

// 创建单例实例
const eventBus = new EventBus();

// 创建一个Vue组合式API的hook，用于在组件中使用事件总线
export function useEventBus() {
  return {
    on: eventBus.on.bind(eventBus),
    off: eventBus.off.bind(eventBus),
    emit: eventBus.emit.bind(eventBus),
    once: eventBus.once.bind(eventBus)
  };
}

// 导出事件总线实例
export default eventBus;