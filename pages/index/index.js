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
      album: null // 专辑
    }, // 当前播放的歌曲
    playlist: [], // 播放列表
    playIndex: -1, // 当前歌曲在播放列表中的index

    isPlayState: false, // 播放&暂停
    isShowPlayBar: false, // 显示&隐藏 底部栏
    isShowPlaylist: false, // 显示&隐藏 播放列表
    showNewList: 1, // 1新碟2新歌
    showHomeIndex: 1, // 导航下标

    songlist: {

      image: null, // 图片地址
      title: null, //歌单名
      writer: null, // 歌单主人
      writerImage: null, // 主人头像
      description: null, // 简单的介绍文本

      playCount: null, // 播放量
      commentCount: null, // 评论量
      shareCount: null, // 分享量
      collectCount: null, // 收藏量

    }, // 选择的歌单

    banners: [], // 轮播图
    recommends: [], // 推荐歌单
    newDiscs: [], // 新碟
    newSongs: [], // 新歌

  },

  // 跳转公共方法
  toPages: function(event) {
    // console.log(event);
    let that = this;
    let to = event.currentTarget.dataset.to;
    let id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;
    let type = event.currentTarget.dataset.type || 'recommends';

    console.log('-------------------event------------------------');
    console.log('to=' + to);
    console.log('id=' + id);
    console.log('index=' + index);
    console.log('type=' + type);

    let {
      playing,
      playlist,
      playIndex,
      isPlayState,
      isShowPlayBar,
    } = app.globalData;

    console.log('-------------------app.globalData------------------------');
    console.log('playing=');
    console.log(playing);
    console.log('playlist=');
    console.log(playlist);
    console.log('playIndex=' + playIndex);
    console.log('isPlayState=' + isPlayState);
    console.log('isShowPlayBar=' + isShowPlayBar);

    switch (to) {
      case 'songListSquare': // 歌单广场页
        util.navigateTo('/pages/songListSquare/songListSquare');
        break;
      case 'songListDetail': // 歌单详情页
        util.navigateTo('/pages/songListDetail/songListDetail?type=' + type + '&id=' + id);
        break;
      case 'search': // 搜索页
        util.navigateTo('/pages/search/search');
        break;
      case 'rankingList': // 排行榜
        util.navigateTo('/pages/rankingList/rankingList');
        break;
      case 'player': // 音乐播放页
        util.getdata("check/music?id=" + id, res => {
          if (res.data.success) {

            let newSongs = that.data.newSongs;
            if (!playlist.length) {

              // console.log('11111111111111111111111111111111111111111111');
              // 包装数组 播放列表
              let ids = '';
              newSongs.map(value => {
                ids += value.id + ',';
              });
              util.getdata("song/url?id=" + ids.substring(',', ids.length - 1), res => {
                for (var i = 0; i < newSongs.length; i++) {
                  for (var j = 0; j < res.data.data.length; j++) {
                    if (newSongs[i].id == res.data.data[j].id) {
                      newSongs[i].url = res.data.data[j].url;
                      break;
                    };
                  };
                };
                playing = newSongs[index];

                // console.log(index);

                // console.log(playing.url);
                if (playing.url) {
                  //更新局部
                  that.setData({
                    isPlayState: true,
                    isShowPlayBar: true,
                    playing: playing, // 当前播放的歌曲
                    playlist: newSongs, // 歌单列表
                  });
                  // 更新全局
                  app.globalData.playing = playing;
                  app.globalData.playlist = newSongs;
                  app.globalData.isShowPlayBar = true;
                  app.globalData.isPlayState = true;
                  app.globalData.playIndex = index;

                  util.navigateTo('/pages/player/player');
                };

              });
            } else {
              // console.log('2222222222222222222222222222222222222222222');
              index = !index ? playIndex : index;
              playing = newSongs[index];

              // console.log(index);

              if (playing.url) {
                //更新局部
                that.setData({
                  isPlayState: true,
                  isShowPlayBar: true,
                  playing: playing, // 当前播放的歌曲
                });
                // 更新全局
                app.globalData.playing = playing;
                app.globalData.isShowPlayBar = true;
                app.globalData.isPlayState = true;
                app.globalData.playIndex = index;

                util.navigateTo('/pages/player/player');
              };

            };
          };
        }, res => {
          wx.showToast({
            title: '暂无版权',
            icon: 'none',
          });
        });
        break;
      case 'mv': // 视频页
        util.navigateTo('/pages/mv/mv');
        break;
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this;
    let {
      banners,
      recommends,
      newDiscs,
      newSongs,
    } = that.data;

    // --------------获取数据---------------
    // 轮播图
    util.getdata('banner', function(res) {
      let result = res.data.banners;
      result.forEach((value, index) => {
        let {
          imageUrl
        } = value;
        banners.push({
          image: imageUrl
        });
      });
      that.setData({
        banners
      });
    });
    // 推荐歌单
    util.getdata('personalized?limit=' + 6, function(res) {
      let result = res.data.result;
      result.forEach((value, index) => {
        let {
          id,
          name,
          picUrl,
          playCount
        } = value;
        recommends.push({
          id: id,
          title: name,
          image: picUrl,
          playCount: util.dealPlayCount(playCount)
        });
      });
      that.setData({
        recommends
      });
    });
    // 新碟
    util.getdata('album/newest', function(res) {
      let result = res.data.albums;
      result.forEach((value, index) => {
        let {
          id,
          name,
          artists,
          picUrl,
          playCount,
        } = value;
        let singers = '';
        artists.forEach((value, index) => {
          if (index > 0) {
            singers += '/' + value.name;
          } else {
            singers = value.name;
          };
        });
        newDiscs.push({
          id,
          title: name,
          singer: singers,
          image: picUrl,
          playCount
        });
      });
      that.setData({
        newDiscs
      });
    });
    // 新歌
    util.getdata('top/song?type=0', function(res) {
      let result = res.data.data;
      result.forEach((value, index) => {
        let {
          id,
          name,
          album,
          artists,
        } = value;
        let singers = '';
        artists.forEach((value, index) => {
          if (index > 0) {
            singers += '/' + value.name;
          } else {
            singers = value.name;
          };
        });
        newSongs.push({
          id: id,
          title: name,
          singer: singers,
          image: album.blurPicUrl,
        });
      });
      that.setData({
        newSongs
      });
    });

    // 监听后台音乐状态
    BackgroundAudioManager.onPlay(() => {
      that.setData({ isPlayState: true });
      app.globalData.isPlayState = true;
    });
    BackgroundAudioManager.onPause(() => {
      that.setData({ isPlayState: false });
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
      BackgroundAudioManager.src = playing.url;
      BackgroundAudioManager.title = playing.title;
      BackgroundAudioManager.coverImgUrl = playing.image;
      BackgroundAudioManager.singer = playing.singer;
      that.setData({
        isPlayState: true,
        playing: playing
      });
      app.globalData.isPlayState = true;
      app.globalData.playIndex = playIndex;
    });

  },

  // 监听事件
  onToggleHomeIndex: function(event) { // 导航切换
    let that = this;
    if (typeof event.detail.current === 'number') { // 拖拽
      let current = event.detail.current;
      that.setData({
        showHomeIndex: current
      });
    } else { // 点击
      let index = event.currentTarget.dataset.index;
      let showHomeIndex = that.data.homeIndex;
      if (showHomeIndex != index) {
        that.setData({
          showHomeIndex: index
        });
      };
    };
  },
  onToggleNewList: function(event) { // 新碟&新歌
    let that = this;
    let id = event.currentTarget.dataset.id;
    let showNewList = this.data.showNewList;
    if (showNewList !== id) {
      that.setData({
        showNewList: id
      });
    };
  },
  onTogglePlayState: function(event) { // 播放状态切换
    let that = this;
    let {
      isPlayState
    } = app.globalData;
    if (!isPlayState) {
      BackgroundAudioManager.play();
    } else {
      BackgroundAudioManager.pause();
    };
    that.setData({
      isPlayState: !isPlayState
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
      isPlayState, // 播放&暂停
      isShowPlayBar, // 显示&隐藏 底部栏
    } = app.globalData;
    // 更新局部
    that.setData({
      playing, // 当前播放的歌曲
      isPlayState, // 播放&暂停
      isShowPlayBar, // 显示&隐藏 底部栏
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