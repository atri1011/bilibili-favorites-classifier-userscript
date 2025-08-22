import BilibiliAPI from './api';

global.fetch = jest.fn();

describe('BilibiliAPI', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  test('getAllFavorites should return a list of favorites on success', async () => {
    const mockData = {
      code: 0,
      data: {
        list: [{ id: 1, title: '默认收藏夹' }],
      },
    };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const favorites = await BilibiliAPI.getAllFavorites('123');
    expect(favorites).toEqual([{ id: 1, title: '默认收藏夹' }]);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=123',
      { headers: { 'Accept': 'application/json' }, credentials: 'include' }
    );
  });

  test('getAllFavorites should throw an error on failure', async () => {
    const mockData = {
      code: -1,
      message: '请求错误',
    };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await expect(BilibiliAPI.getAllFavorites('123')).rejects.toThrow(
      '获取收藏夹列表失败: 请求错误'
    );
  });

  test('getFavoriteVideos should return videos and hasMore on success', async () => {
    const mockData = {
      code: 0,
      data: {
        medias: [{ id: 1, title: '视频1' }],
        has_more: true,
      },
    };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await BilibiliAPI.getFavoriteVideos('456', 20, 1);
    expect(result).toEqual({
      videos: [{ id: 1, title: '视频1' }],
      hasMore: true,
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.bilibili.com/x/v3/fav/resource/list?media_id=456&pn=1&ps=20&order=mtime',
      { headers: { 'Accept': 'application/json' }, credentials: 'include' }
    );
  });

  test('getFavoriteVideos should throw an error on failure', async () => {
    const mockData = {
      code: -1,
      message: '请求错误',
    };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await expect(BilibiliAPI.getFavoriteVideos('456', 20, 1)).rejects.toThrow(
      '获取收藏夹视频失败 (Code: -1): 请求错误'
    );
  });
});