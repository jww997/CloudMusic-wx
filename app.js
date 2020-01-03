//app.js
App({

  // 全局变量
  globalData: {

    playing: {
      id: null, // 歌曲ID
      url: null, // 音乐地址
      image: null, // 图片地址
      title: null, // 歌名
      singer: null, // 歌手
      lyric: null, // 歌词
    }, // 当前播放的歌曲
    playlist: [], // 播放列表
    playIndex: -1, // 当前歌曲在播放列表中的index

    isPlayState: false, // 播放&暂停
    isShowPlayBar: false, // 显示&隐藏 底部栏
    isShowPlaylist: false, // 显示&隐藏 播放列表

    BackgroundAudioManager: wx.getBackgroundAudioManager(),
    VideoContext: wx.createVideoContext('video'),



    // curPlayId: null,     // 歌曲ID,保存方便跳转
    // curPlayUrl: null,    // 音乐地址
    // curPlayPicUrl: null, // 图片地址
    // curPlaySong: null,   // 歌名
    // curPlayAuthor: null, // 歌手

  },

})