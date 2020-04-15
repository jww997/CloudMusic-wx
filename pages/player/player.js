const util = require("../../utils/util.js");
const common = require("../../utils/common.js");
const app = getApp();
const backgroundAudioManager = app.globalData.backgroundAudioManager;

Page({

  // 公共事件
  toPages: app.toPages,
  togglePlayingCut: common.togglePlayingCut, // 列表切歌
  togglePlayingState: common.togglePlayingState, // 播放状态
  togglePlayingListShow: common.togglePlayingListShow, // 播放列表显示
  toggleModeIndex: common.toggleModeIndex, // 播放顺序
  togglePlaying: function(event) { // 上一首&下一首
    const that = this;
    let id = parseInt(event.currentTarget.dataset.id);
    common.togglePlaying.call(that, id);
  },

  // 局部事件
  dragProgressBar: function(event) { // 拖动进度条
    const position = event.detail.value;
    backgroundAudioManager.seek(position);
    this.setData({
      currentTime: util.formatTime(position * 1000), // 进度时长
      sliderValue: position, // 当前滑块值
    });
  },
  fullImage: function(event) { // 长按查看原图
    let current = event.currentTarget.dataset.imgurl;
    util.previewImage([current]);
  },
  toggleLyricShow: function(event) { // 显示&隐藏 歌词
    const that = this;
    let {
      isGetedLyric,
      playing,
      lyric,
    } = that.data;
    let {
      isShowLyric,
    } = app.globalData;

    that.setData({
      isShowLyric: !isShowLyric,
      isGetedLyric: true,
    });
    app.globalData.isShowLyric = !isShowLyric;
    app.globalData.isGetedLyric = true;

    if (!!isShowLyric) {
      that.clearTimer.call(that);
    } else {
      that.setData({
        lyric: {
          ...app.globalData.lyric,
          timer: that.setTimer(),
        }
      });
      if (!isGetedLyric) {
        common.getLyric.call(that, playing.id);
      };
    };

  },
  setTimer: function(event) {
    return setInterval(() => {
      const that = this;
      console.log(`%c倒计时开始`, `color: green`);
      let {
        lyric,
      } = that.data;
      if (!lyric.content.length) {
        that.clearTimer.call(that);
        return false;
      };
      for (let i in lyric.content) {
        if (lyric.content[i].sec < backgroundAudioManager.currentTime) {
          lyric = {
            ...lyric,
            index: i,
          };
        };
      };
      that.setData({
        lyric,
      });
      app.globalData.lyric = lyric;
    }, 1000);
  },
  clearTimer: function(event) {
    const that = this;
    let {
      lyric: {
        timer,
      },
    } = that.data;
    clearInterval(timer ? timer : '');
    console.log(`%c倒计时结束`, `color: green`);
  },


  /**
   * 页面的初始数据
   */
  data: {

    playing: {
      id: null, // 歌曲ID
      url: null, // 音乐地址
      image: null, // 图片地址
      title: null, // 歌名
      singer: null, // 歌手
    }, // 当前播放的歌曲
    playlist: [], // 播放列表
    playIndex: 0, // 当前歌曲在播放列表中的index

    modeIndex: 1, // 播放模式下标
    modeList: [], // 播放模式列表

    isPlayState: false, // 播放&暂停
    isShowPlayBar: false, // 显示&隐藏 底部栏
    isShowPlaylist: false, // 显示&隐藏 播放列表
    isShowLyric: false, // 显示&隐藏 歌词
    isScrollLyric: false, // 歌词能否滚动
    isGetedLyric: false, // 记录是否获取过歌词

    currentTime: '00:00', // 进度时长
    duration: '00:00', // 总时长
    sliderValue: 0, // 当前滑块值
    sliderMax: 0, // 滑块最大值

    curLrcStartHeight: 0, // 滑动初始高度
    curLrcScrolledHeight: 0, // 滑动高度

    lyric: { // 歌词
      index: 0, // 下标
      content: [], // 内容
      timer: '', // 计时器 
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    app.initAudio(that);

    backgroundAudioManager.onTimeUpdate(function() {
      that.setData({
        currentTime: util.formatTime(backgroundAudioManager.currentTime * 1000), // 进度时长
        duration: util.formatTime(backgroundAudioManager.duration * 1000), // 总时长
        sliderValue: backgroundAudioManager.currentTime, // 当前滑块值
        sliderMax: backgroundAudioManager.duration, // 滑块最大值
      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    const that = this;
    that.clearTimer.call(that);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    const that = this;
    that.clearTimer.call(that);
    that.setData({
      isGetedLyric: false,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },



  onStartLyric: function(event) { // 开始拖动歌词
    const that = this;
    let {
      curLrcStartHeight
    } = that.data;
    let clientY = event.changedTouches[0].clientY;

    that.setData({
      isScrollLyric: true,
      curLrcStartHeight: clientY
    });

  },
  onMoveLyric: function(event) { // 正在拖动歌词

    const that = this;
    let {
      curLrcStartHeight,
    } = that.data;

    let clientY = event.changedTouches[0].clientY;

    that.setData({
      isScrollLyric: true,
      curLrcScrolledHeight: curLrcStartHeight - clientY
    });


  },
  onEndLyric: function(event) { // 结束拖动歌词
    const that = this;
    let {
      curLrcScrolledHeight
    } = that.data;

    let clientY = event.changedTouches[0].clientY;

    setTimeout(function() {
      that.setData({
        isScrollLyric: false,
        curLrcStartHeight: clientY
      });
    }, 2000);

  },
})