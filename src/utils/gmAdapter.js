/**
 * GM API 适配器
 * 在开发环境中提供 GM API 的模拟实现，在生产环境（Tampermonkey）中使用真实的 GM API
 */

// 本地存储的键前缀
const STORAGE_PREFIX = 'bfc_';

// 延迟检查是否在 Tampermonkey/Greasemonkey 环境中
// 使用函数来避免在模块加载时直接检查 GM_getValue
// 缓存环境检测结果，避免重复检查
let _isUserscriptEnv = null;
const isUserscriptEnv = () => {
  if (_isUserscriptEnv !== null) {
    return _isUserscriptEnv;
  }
  _isUserscriptEnv = typeof GM_getValue !== 'undefined' && typeof GM_setValue !== 'undefined';
  return _isUserscriptEnv;
};

// 本地存储实现
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

// 导出适配器
export const GM = {
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
    if (isUserscriptEnv() && typeof GM_listValues !== 'undefined') {
      return GM_listValues();
    } else {
      return localStorageImpl.listValues();
    }
  },
  
  // 添加样式
  addStyle: function(css) {
    if (isUserscriptEnv() && typeof GM_addStyle !== 'undefined') {
      GM_addStyle(css);
    } else {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  },
  
  // XML HTTP 请求
  xmlhttpRequest: function(details) {
    if (isUserscriptEnv() && typeof GM_xmlhttpRequest !== 'undefined') {
      return GM_xmlhttpRequest(details);
    } else {
      // 简单的 fetch 实现
      const controller = new AbortController();
      const signal = controller.signal;
      
      const fetchOptions = {
        method: details.method || 'GET',
        headers: details.headers || {},
        signal: signal
      };
      
      if (details.data) {
        if (details.headers && details.headers['Content-Type'] === 'application/json') {
          fetchOptions.body = JSON.stringify(details.data);
        } else {
          fetchOptions.body = details.data;
        }
      }
      
      fetch(details.url, fetchOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text().then(text => {
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
        })
        .catch(error => {
          if (details.onerror) {
            details.onerror(error);
          }
        });
      
      // 返回一个简单的 abort 方法
      return {
        abort: () => controller.abort()
      };
    }
  },
  
  // 检查是否在用户脚本环境中
  isUserscriptEnv: () => isUserscriptEnv()
};

// 为了向后兼容，也导出单个函数
// 直接实现，避免循环调用
export const GM_getValue = (key, defaultValue) => {
  if (isUserscriptEnv()) {
    // 使用全局 GM_getValue 函数，通过 window 对象访问但先检查是否存在
    if (typeof window.GM_getValue !== 'undefined') {
      return window.GM_getValue(key, defaultValue);
    }
    // 如果 window.GM_getValue 不存在，回退到 localStorage
    return localStorageImpl.getValue(key, defaultValue);
  } else {
    return localStorageImpl.getValue(key, defaultValue);
  }
};

export const GM_setValue = (key, value) => {
  if (isUserscriptEnv()) {
    // 使用全局 GM_setValue 函数，通过 window 对象访问但先检查是否存在
    if (typeof window.GM_setValue !== 'undefined') {
      window.GM_setValue(key, value);
    } else {
      localStorageImpl.setValue(key, value);
    }
  } else {
    localStorageImpl.setValue(key, value);
  }
};

export const GM_deleteValue = (key) => {
  if (isUserscriptEnv()) {
    // 使用全局 GM_deleteValue 函数，通过 window 对象访问但先检查是否存在
    if (typeof window.GM_deleteValue !== 'undefined') {
      window.GM_deleteValue(key);
    } else {
      localStorageImpl.deleteValue(key);
    }
  } else {
    localStorageImpl.deleteValue(key);
  }
};

export const GM_listValues = () => {
  if (isUserscriptEnv() && typeof window.GM_listValues !== 'undefined') {
    return window.GM_listValues();
  } else {
    return localStorageImpl.listValues();
  }
};

export const GM_addStyle = (css) => {
  if (isUserscriptEnv() && typeof window.GM_addStyle !== 'undefined') {
    window.GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
};

export const GM_xmlhttpRequest = (details) => {
  if (isUserscriptEnv() && typeof window.GM_xmlhttpRequest !== 'undefined') {
    return window.GM_xmlhttpRequest(details);
  } else {
    // 简单的 fetch 实现
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchOptions = {
      method: details.method || 'GET',
      headers: details.headers || {},
      signal: signal
    };
    
    if (details.data) {
      if (details.headers && details.headers['Content-Type'] === 'application/json') {
        fetchOptions.body = JSON.stringify(details.data);
      } else {
        fetchOptions.body = details.data;
      }
    }
    
    fetch(details.url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text().then(text => {
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
      })
      .catch(error => {
        if (details.onerror) {
          details.onerror(error);
        }
      });
    
    // 返回一个简单的 abort 方法
    return {
      abort: () => controller.abort()
    };
  }
};

// 添加CSRF Token获取工具
export const CSRFUtils = {
  /**
   * 安全获取B站CSRF Token
   * 在用户脚本环境中，这是最可靠的方式，因为B站API需要此token进行验证
   * @returns {string|null} CSRF Token或null
   */
  getCSRFToken: function() {
    try {
      // 从cookie中获取bili_jct token
      const csrfMatch = document.cookie.match(/bili_jct=([^;]+)/);
      const csrf = csrfMatch ? csrfMatch[1] : null;
      
      if (!csrf) {
        console.warn('[BFC] 未找到CSRF token，请确保已登录B站');
        return null;
      }
      
      return csrf;
    } catch (error) {
      console.error('[BFC] 获取CSRF token时出错:', error);
      return null;
    }
  },
  
  /**
   * 验证CSRF Token是否有效
   * @param {string} token - 要验证的token
   * @returns {boolean} 是否有效
   */
  validateCSRFToken: function(token) {
    // B站的bili_jct token通常是32位字符
    return token && typeof token === 'string' && token.length === 32;
  }
};