const util = require("utils/util.js");
const common = require("utils/common.js");

App({

  // 跳转方法
  toPages(event) {
    const that = this;
    let {
      to,
      id,
      index,
      type,
    } = event.currentTarget.dataset;
    console.log(`%c页面跳转, %cto=${to}, id=${id}, index=${index}, type=${type}`, `color: orange;`, `color: inherit;`);
    switch (to) {
      case 'login': // 登录
        util.navigateTo(`/pages/login/login`);
        break;
      case 'search': // 搜索
        util.navigateTo(`/pages/search/search`);
        break;
      case 'square': // 歌单广场
        util.navigateTo(`/pages/square/square`);
        break;
      case 'ranking': // 排行榜
        util.navigateTo(`/pages/ranking/ranking`);
        break;
      case 'radioStation': // 电台
        util.navigateTo(`/pages/radioStation/radioStation`);
        break;
      case 'player': // 播放器
        util.navigateTo(`/pages/player/player`);
        break;
      case 'mv': // 视频
        util.navigateTo(`/pages/mv/mv?id=${id}`);
        break;
      case 'list': // 列表
        util.navigateTo(`/pages/list/list?id=${id}&type=${type ? type: '1'}`);
        break;
      case 'comment': // 评论
        util.navigateTo(`/pages/comment/comment?id=${id}&type=${type ? type : '1'}`);
        break;
    };
  },

  // 初始化背景音频
  initAudio(that) {
    const {
      playing,
      modeIndex,
      backgroundAudioManager,
    } = this.globalData;
    console.log(that);
    console.log(`%c初始开始, %cplaying.url => ${playing.url}`, `color: #74b9ff;`, `color: inherit;`);
    this.update(that);
    if (playing.url && (playing.url != backgroundAudioManager.src || modeIndex == 2)) {
      console.log(`%c初始成功, %cplaying.id => ${playing.id} `, `color: #0984e3;`, `color: inherit;`);
      // 音频的数据源（2.2.3 开始支持云文件ID）。默认为空字符串，当设置了新的 src 时，会自动开始播放，目前支持的格式有 m4a, aac, mp3, wav
      backgroundAudioManager.src = playing.url;
      // 音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值
      backgroundAudioManager.title = playing.title;
      // 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
      backgroundAudioManager.epname = ` - ${playing.album}`;
      // 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
      backgroundAudioManager.singer = playing.singer;
      // 封面图 URL，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图
      backgroundAudioManager.coverImgUrl = playing.image;
    };
    // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
    backgroundAudioManager.onCanplay(() => {
      backgroundAudioManager.play();
    });


    // 监听背景音频播放事件
    backgroundAudioManager.onPlay(() => {
      that.setData({
        isPlayState: true
      });
      this.globalData.isPlayState = true;
      console.log(`%c播放成功, %c音频长度 => ${backgroundAudioManager.duration}s, 音频数据源 => ${backgroundAudioManager.src}`, `color: #0f0;`, `color: inherit;`);
    });

    // 监听背景音频暂停事件
    backgroundAudioManager.onPause(() => {
      that.setData({
        isPlayState: false
      });
      this.globalData.isPlayState = false;
      console.log(`%c暂停成功, %c缓冲时间 => ${backgroundAudioManager.buffered}s, 是否暂停&停止 => ${backgroundAudioManager.paused}`, `color: #f00;`, `color: inherit;`);
    });

    // 监听背景音频自然播放结束事件
    backgroundAudioManager.onEnded(() => {
      let {
        modeIndex,
      } = that.data;
      if (modeIndex == 2) { // 单曲循环
        this.skipAudio(that, 0);
      } else {
        common.togglePlaying.call(that);
      };
    });

    // 监听背景音频停止事件
    backgroundAudioManager.onStop(() => {
      console.log(`%c停止成功`, `color: red;`);
      backgroundAudioManager.pause();
      that.setData({
        isPlayState: false,
        isShowPlayBar: false
      });
      this.globalData.isPlayState = false;
      this.globalData.isShowPlayBar = false;
    });

    // 监听背景音频播放错误事件
    backgroundAudioManager.onError(() => {

    });



  },

  // 跳转音频指定位置
  skipAudio(that, position) {
    const {
      playing,
      backgroundAudioManager,
    } = this.globalData;
    wx.seekBackgroundAudio({
      position: Math.floor(position / 1000),
      success: () => {
        this.initAudio(that);
      }
    });
  },

  // 更新播放数据
  update(that) {

    let {
      account, // 账号
      playing, // 当前播放的歌曲
      playlist, // 当前播放的歌曲列表
      isPlayState, // 播放&暂停
      isShowPlayBar, // 显示&隐藏 底部栏
      modeIndex, // 播放模式下标
      modeList, // 播放模式列表
    } = this.globalData;
    if (!playing.url) return false;
    that.setData({
      account: account ? account : {}, // 账号
      playing, // 当前播放的歌曲
      playlist, // 当前播放的歌曲列表
      isPlayState, // 播放&暂停
      isShowPlayBar, // 显示&隐藏 底部栏
      modeIndex, // 播放模式下标
      modeList, // 播放模式列表
    });
    console.log(`%c更新成功, %cdata => `, `color: #00cec9;`, `color: inherit;`, {
      account: account ? account : {}, // 账号
      playing, // 当前播放的歌曲
      playlist, // 当前播放的歌曲列表
      isPlayState, // 播放&暂停
      isShowPlayBar, // 显示&隐藏 底部栏
      modeIndex, // 播放模式下标
      modeList, // 播放模式列表
    });

  },

  // 全局变量
  globalData: {

    backgroundAudioManager: wx.getBackgroundAudioManager(), // 全局唯一的背景音频管理器
    videoContext: wx.createVideoContext('video'), // 创建 video 上下文 VideoContext 对象

    playing: {
      id: null, // 歌曲ID
      mv: null, // 视频ID
      url: null, // 音乐地址
      image: null, // 图片地址
      title: null, // 歌名
      singer: null, // 歌手
      album: null, // 专辑
      exclusive: false, // 独家音乐标识
      vip: false, // 网易云会员标识
      sq: false, // 无损音质标识
    }, // 当前播放的歌曲
    playlist: [], // 播放列表
    playIndex: -1, // 当前歌曲在播放列表中的index

    isPlayState: false, // 播放&暂停
    isShowPlayBar: false, // 显示&隐藏 底部栏
    isShowPlaylist: false, // 显示&隐藏 播放列表
    isShowLyric: false, // 歌词显示

    modeIndex: 1, // 播放模式下标
    modeList: [{ // 播放模式列表
      id: 1,
      name: '顺序播放',
      iconClass: 'icon-orderPlay',
    }, {
      id: 2,
      name: '单曲播放',
      iconClass: 'icon-singlePlay',
    }, {
      id: 3,
      name: '随机播放',
      iconClass: 'icon-randomPlay',
    }],

    // mode: { // 播放模式
    //   index: 1, // 下标
    //   list: [{ // 列表
    //     id: 1,
    //     name: '顺序播放',
    //     iconClass: 'icon-orderPlay',
    //   }, {
    //     id: 2,
    //     name: '单曲播放',
    //     iconClass: 'icon-singlePlay',
    //   }, {
    //     id: 3,
    //     name: '随机播放',
    //     iconClass: 'icon-randomPlay',
    //   }],
    // },

  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },

});