import AIClassifier from './ai';

global.GM_xmlhttpRequest = jest.fn();
global.GM_getValue = jest.fn();

describe('AIClassifier', () => {
  afterEach(() => {
    GM_xmlhttpRequest.mockClear();
    GM_getValue.mockClear();
  });

  const video = {
    title: '测试视频',
    intro: '这是一个测试视频',
    upper: { name: '测试UP主' },
  };
  const targetFolders = [{ title: '收藏夹1' }, { title: '收藏夹2' }];

  test('classify should call OpenAI API and return folder name on success', async () => {
    GM_getValue.mockReturnValueOnce('openai'); // Mock aiProvider
    const mockResponse = {
      status: 200,
      responseText: JSON.stringify({
        choices: [{ message: { content: '收藏夹1' } }],
      }),
    };
    GM_xmlhttpRequest.mockImplementationOnce(({ onload }) => {
      onload(mockResponse);
    });

    const folderName = await AIClassifier.classify(
      video,
      targetFolders,
      'test-key',
      'https://api.example.com',
      'gpt-3.5-turbo'
    );

    expect(folderName).toBe('收藏夹1');
    expect(GM_xmlhttpRequest).toHaveBeenCalledTimes(1);
  });

  test('classify should call Zhipu AI API and return folder name on success', async () => {
    GM_getValue.mockReturnValueOnce('zhipu'); // Mock aiProvider
    const mockResponse = {
      status: 200,
      responseText: JSON.stringify({
        choices: [{ message: { content: '收藏夹2' } }],
      }),
    };
    GM_xmlhttpRequest.mockImplementationOnce(({ onload }) => {
      onload(mockResponse);
    });

    const folderName = await AIClassifier.classify(
      video,
      targetFolders,
      'test-key-zhipu'
    );

    expect(folderName).toBe('收藏夹2');
    expect(GM_xmlhttpRequest).toHaveBeenCalledTimes(1);
  });

  test('classify should throw an error on API failure', async () => {
    GM_getValue.mockReturnValueOnce('openai');
    const mockResponse = {
      status: 500,
      responseText: JSON.stringify({
        error: { message: 'Internal Server Error' },
      }),
    };
    GM_xmlhttpRequest.mockImplementationOnce(({ onload }) => {
      onload(mockResponse);
    });

    await expect(
      AIClassifier.classify(
        video,
        targetFolders,
        'test-key',
        'https://api.example.com',
        'gpt-3.5-turbo'
      )
    ).rejects.toThrow('API请求失败 (状态: 500): Internal Server Error');
  });
});