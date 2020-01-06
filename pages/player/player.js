var util = require("../../utils/util.js");
var app = getApp();

const BackgroundAudioManager = app.globalData.BackgroundAudioManager;

Page({

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
      lyric: null, // 歌词
    }, // 当前播放的歌曲
    playlist: [], // 播放列表
    playIndex: 0, // 当前歌曲在播放列表中的index

    isPlayState: false, // 播放&暂停
    isShowPlayBar: false, // 显示&隐藏 底部栏
    isShowPlaylist: false, // 显示&隐藏 播放列表
    isShowlyric: false, // 显示&隐藏 歌词
    isScrollLyric: false, // 歌词能否滚动

    currentTime: '00:00', // 进度时长
    duration: '00:00', // 总时长
    sliderValue: 0, // 当前滑块值
    sliderMax: 0, // 滑块最大值
    curLrcIndex: 0, // 当前歌词下标
    curLrcStartHeight: 0, // 滑动初始高度
    curLrcScrolledHeight: 0, // 滑动高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  // 监听事件
  onChangeProgress: function(event) { // 拖动进度条
    // console.log('当前位置' + event.detail.value);
    const position = event.detail.value;
    BackgroundAudioManager.seek(position);
    this.setData({
      currentTime: util.formatTime(position * 1000), // 进度时长
      sliderValue: position, // 当前滑块值
    });
  },
  onChangePlaying: function(event) { // 上一首&下一首

    let that = this;

    console.log(event);

    let {
      id,
      type
    } = event.currentTarget.dataset;

    let {
      playIndex,
      playlist,
      playing,
    } = app.globalData;


    if (type) {
      playIndex = playIndex + Number(id); // 上下一首
      console.log(playIndex);
    } else {
      playIndex = Number(id); // 列表切歌
    };

    if (playIndex < 0 || playIndex >= playlist.length) return;

    playing = playlist[playIndex];
    console.log(playing);

    // 获取歌词
    util.getdata('lyric?id=' + playing.id, function(res) {
      // 更新局部
      that.setData({
        playing: {
          ...playing,
          lyric: util.parseLyric(res.data.lrc.lyric), // 歌词
        }, // 当前播放的歌曲
      });
      // 更新全局
      app.globalData.playing.lyric = util.parseLyric(res.data.lrc.lyric);
    });

    if (playing.url) {

      BackgroundAudioManager.src = playing.url;
      BackgroundAudioManager.title = playing.title;
      BackgroundAudioManager.coverImgUrl = playing.image;
      BackgroundAudioManager.singer = playing.singer;

      that.setData({
        playing: playing, // 当前播放的歌曲
        playIndex: playIndex, // 当前歌曲在播放列表中的index
      });

      app.globalData.playing = playing;
      app.globalData.playIndex = playIndex;


      // 设置标题
      wx.setNavigationBarTitle({
        title: `${playing.title}-${playing.singer}`
      });

    } else {
      wx.showToast({
        title: '你该充钱了',
        icon: 'none',
        duration: 1500
      });
      // this.onChangePlaying(event);
    };

  },
  onChangeOrder: function(event) { // 顺序&随机&单曲

  },
  onTogglePlayState: function(event) { // 播放&暂停

    let that = this;
    let {
      isPlayState
    } = that.data;

    console.log('-------------------that.data------------------------');
    console.log('isPlayState=' + isPlayState);

    if (!isPlayState) {
      BackgroundAudioManager.play();
    } else {
      BackgroundAudioManager.pause();
    };
    isPlayState = !isPlayState;
    // 更新局部
    that.setData({
      isPlayState
    });
    // 更新全局
    app.globalData.isPlayState = isPlayState;

  },
  onToggleShowlyric: function(event) { // 显示&隐藏 歌词
    let isShowlyric = this.data.isShowlyric;
    this.setData({
      isShowlyric: !isShowlyric
    });
  },
  onShowPlaylist: function(event) { // 列表显示
    this.setData({
      isShowPlaylist: true
    });
  },
  onHidePlaylist: function(event) { // 列表隐藏
    this.setData({
      isShowPlaylist: false
    });
  },
  onStartLyric: function(event) { // 开始拖动歌词
    let that = this;
    let {
      curLrcStartHeight
    } = that.data;

    console.log(curLrcStartHeight);

    let clientY = event.changedTouches[0].clientY;

    that.setData({
      isScrollLyric: true,
      curLrcStartHeight: clientY
    });

  },
  onMoveLyric: function(event) { // 正在拖动歌词

    let that = this;
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
    let that = this;
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
  onFullPic: function(event) { // 长按查看原图
    let current = event.currentTarget.dataset.imgurl;
    wx.previewImage({
      current: current,
      urls: [current]
    });
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

    let that = this;
    let {
      playing, // 当前播放的歌曲
      playlist, // 播放列表
      playIndex, // 当前歌曲在播放列表中的index
      isPlayState, // 播放&暂停
      isShowPlayBar, // 显示&隐藏 底部栏
      isShowPlaylist, // 显示&隐藏 播放列表
      isShowlyric, // 显示&隐藏 歌词
    } = app.globalData;
    let {
      curLrcIndex,
    } = that.data;

    console.log(playing);
    console.log(isPlayState);
    console.log(playIndex);

    let secArr = new Array();
    // 获取歌词
    util.getdata('lyric?id=' + playing.id, function (res) {
      let lyric = util.parseLyric(res.data.lrc.lyric);
      lyric.forEach((value, index) => {
        secArr.push(value.sec);
      });

      // 更新局部
      that.setData({
        playing: {
          ...playing,
          lyric: lyric, // 歌词
        }, // 当前播放的歌曲
        isPlayState: isPlayState, // 播放状态
      });
      // 更新全局
      app.globalData.isShowPlayBar = true;
      app.globalData.playing.lyric = lyric;

    });


    if (playing.url) {
      BackgroundAudioManager.src = playing.url;
      BackgroundAudioManager.title = playing.title;
      BackgroundAudioManager.coverImgUrl = playing.image;
      BackgroundAudioManager.singer = playing.singer;
    };

    // 歌词位置更新
    if (!isPlayState) {
      clearTimeout(lrcUpdate);
    } else {
      lrcUpdate;
    }
    let lrcUpdate = setInterval(function() {
      let {
        playing: {
          lyric
        },
      } = that.data;
      if (!lyric.length) return;
      for (let i in lyric) {
        if (lyric[i].sec < BackgroundAudioManager.currentTime) {
          curLrcIndex = i
        };
      };
      // if (curLrcIndex != i) return;
      that.setData({
        curLrcIndex, // 
      });
    }, 2000);


    // 时刻更新
    BackgroundAudioManager.onTimeUpdate(function() {


      that.setData({

        currentTime: util.formatTime(BackgroundAudioManager.currentTime * 1000), // 进度时长
        duration: util.formatTime(BackgroundAudioManager.duration * 1000), // 总时长
        sliderValue: BackgroundAudioManager.currentTime, // 当前滑块值
        sliderMax: BackgroundAudioManager.duration, // 滑块最大值

        playlist: playlist, // 播放列表
        // isPlayState: isPlayState, // 播放状态

        // playing: playing, // 当前播放的歌曲
        playIndex: playIndex, // 当前歌曲在播放列表中的index

        // curLrcIndex: i, // 当前秒数

      });

      // console.log(secArr);

      // for (var i = 0; i < secArr.length; i++) {
      //   console.log(secArr[i]);
      //   // if (secArr[i] <= BackgroundAudioManager.currentTime) {
      //   //   that.setData({
      //   //     curLrcIndex: i, // 当前秒数
      //   //   });
      //   //   continue;
      //   // }
      // }

    });



    // 监听后台音乐状态
    BackgroundAudioManager.onPlay(() => {
      that.setData({
        isPlayState: true
      });
      app.globalData.isPlayState = true;
    });
    BackgroundAudioManager.onPause(() => {
      that.setData({
        isPlayState: false
      });
      app.globalData.isPlayState = false;
    });
    BackgroundAudioManager.onEnded(() => {
      // this.onChangePlaying();

      let that = this;
      let {
        playIndex,
        playlist,
        playing,
        isPlayState
      } = app.globalData;

      playIndex++;
      playing = playlist[playIndex];
      console.log(playing);
      if (playing.url) {
        BackgroundAudioManager.src = playing.url;
        BackgroundAudioManager.title = playing.title;
        BackgroundAudioManager.coverImgUrl = playing.image;
        BackgroundAudioManager.singer = playing.singer;
      };
      that.setData({
        isPlayState: true,
        playing: playing
      });
      app.globalData.isPlayState = true;
      app.globalData.isShowPlayBar = true;
      app.globalData.playIndex = playIndex;
    });
    // 设置标题
    wx.setNavigationBarTitle({
      title: `${playing.title}-${playing.singer}`
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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

  }
})