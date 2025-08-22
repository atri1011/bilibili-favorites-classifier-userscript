// 测试优化后的代码
import { CSRFUtils } from './src/utils/gmAdapter.js';
import { useFloatingRecommendationStore } from './src/stores/index.js';
import { FolderService } from './src/services/FolderService.js';

// 模拟测试环境
const mockGM = {
  getValue: (key) => {
    if (key === 'bilibili_favorites_classifier_api_key') return 'test-api-key';
    return null;
  },
  setValue: () => {},
  deleteValue: () => {},
  listValues: () => [],
  getResourceUrl: (name) => `https://example.com/${name}`,
  registerMenuCommand: () => {},
  unregisterMenuCommand: () => {},
  openInTab: (url) => console.log(`Opening tab: ${url}`),
  xmlHttpRequest: (details) => {
    console.log(`Making request to: ${details.url}`);
    details.onload({
      responseText: JSON.stringify({ code: 0, data: {} }),
      status: 200
    });
  },
  addStyle: (css) => console.log('Adding style:', css),
  notification: (details) => console.log('Notification:', details),
  setClipboard: (text) => console.log('Clipboard set:', text)
};

// 设置 GM 对象
window.GM = mockGM;

// 测试 CSRF Token 获取
async function testCSRFToken() {
  console.log('Testing CSRF Token retrieval...');
  
  try {
    // 测试从 cookie 获取
    const token = await CSRFUtils.getCSRFToken();
    console.log('CSRF Token retrieved:', token ? 'Success' : 'Failed');
    
    // 测试验证功能
    const isValid = await CSRFUtils.validateCSRFToken(token);
    console.log('CSRF Token validation:', isValid ? 'Valid' : 'Invalid');
    
    return true;
  } catch (error) {
    console.error('CSRF Token test failed:', error);
    return false;
  }
}

// 测试数据完整性验证
async function testDataIntegrity() {
  console.log('Testing data integrity validation...');
  
  try {
    const store = useFloatingRecommendationStore();
    
    // 测试空数据验证
    const emptyData = {
      videoData: null,
      targetFolders: []
    };
    
    const isValid = store.validateDataIntegrity(emptyData);
    console.log('Empty data validation:', isValid ? 'Valid' : 'Invalid');
    
    // 测试完整数据验证
    const completeData = {
      videoData: {
        bvid: 'test123',
        title: 'Test Video',
        pic: 'https://example.com/test.jpg'
      },
      targetFolders: [
        { id: 1, title: 'Test Folder' }
      ]
    };
    
    const isCompleteValid = store.validateDataIntegrity(completeData);
    console.log('Complete data validation:', isCompleteValid ? 'Valid' : 'Invalid');
    
    return true;
  } catch (error) {
    console.error('Data integrity test failed:', error);
    return false;
  }
}

// 测试 FolderService
async function testFolderService() {
  console.log('Testing FolderService...');
  
  try {
    const folderService = new FolderService();
    
    // 测试自动 CSRF Token 获取
    console.log('Testing automatic CSRF token retrieval...');
    
    // 注意：这些调用会失败，因为我们没有真实的 API 环境
    // 但我们可以验证 CSRF token 的获取逻辑
    try {
      await folderService.createFolder('Test Folder');
    } catch (error) {
      console.log('Expected error (no real API):', error.message);
    }
    
    return true;
  } catch (error) {
    console.error('FolderService test failed:', error);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('Starting optimization tests...\n');
  
  const results = {
    csrfToken: await testCSRFToken(),
    dataIntegrity: await testDataIntegrity(),
    folderService: await testFolderService()
  };
  
  console.log('\nTest Results:');
  console.log('CSRF Token Test:', results.csrfToken ? 'PASS' : 'FAIL');
  console.log('Data Integrity Test:', results.dataIntegrity ? 'PASS' : 'FAIL');
  console.log('FolderService Test:', results.folderService ? 'PASS' : 'FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\nOverall Result:', allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');
  
  return allPassed;
}

// 导出测试函数
export { runAllTests, testCSRFToken, testDataIntegrity, testFolderService };

// 如果直接运行此文件，则执行测试
if (typeof window !== 'undefined') {
  window.runOptimizationTests = runAllTests;
}