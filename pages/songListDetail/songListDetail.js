var baseUrl = require("../../utils/api.js");
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

  },

  // 跳转公共方法
  toPages: function(event) {
    // console.log(event);
    let to = event.currentTarget.dataset.to;
    console.log('to=' + to);
    let id = event.currentTarget.dataset.id;
    console.log('id=' + id);
    let type = event.currentTarget.dataset.type || 'recommends';
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
            let that = this;

            util.navigateTo('/pages/player/player');

          };
        }, res => {
          wx.showToast({
            title: '暂无版权',
            icon: 'none',
          });
        });
        break;
      case 'mv': // 视频页
        util.navigateTo('/pages/mv/mv?id=' + id);
        break;
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this;
    let {
      id,
      type
    } = options;

    console.log('id=' + id);
    console.log('type=' + type);

    // ----------获取数据--------------
    switch (type) {
      case 'recommends': // 热门推荐
        util.getdata('playlist/detail?id=' + id, function(res) {
          console.log(res);

          let {
            coverImgUrl, // 图片地址
            name, //歌单名
            creator, // 主人,对象
            description, // 简单的介绍文本
            playCount, // 播放量
            commentCount, // 评论量
            shareCount, // 分享量
            subscribedCount, // 收藏量
            tracks // 歌单列表
          } = res.data.playlist;
          let privileges = res.data.privileges;
          let ids = '';

          // 更新局部
          that.setData({
            songlist: {

              image: coverImgUrl, // 图片地址
              title: name, //歌单名
              writer: creator.nickname, // 歌单主人
              writerImage: creator.avatarUrl, // 主人头像
              description: description, // 简单的介绍文本
              playCount: util.dealPlayCount(playCount), // 播放量
              commentCount: util.dealPlayCount(commentCount), // 评论量
              shareCount: util.dealPlayCount(shareCount), // 分享量
              collectCount: util.dealPlayCount(subscribedCount), // 收藏量

            },
          });

          // 包装列表数组
          tracks = tracks.map((value, index) => {
            ids += value.id + ',';
            return {
              id: value.id, // 歌曲ID
              mv: value.mv, // 视频ID
              image: value.al.picUrl, // 图片URL
              title: value.name, // 歌名
              singer: value.ar[0].name, // 歌手
              album: value.al.name, // 专辑
              exclusive: false, // 独家音乐标识
              vip: false, // 网易云会员标识
              sq: privileges[index].maxbr == 999000, // 无损音质标识
            };
          });
          util.getdata("song/url?id=" + ids.substring(',', ids.length - 1), res => {
            for (var i = 0; i < tracks.length; i++) {
              for (var j = 0; j < res.data.data.length; j++) {
                if (tracks[i].id == res.data.data[j].id) {
                  tracks[i].url = res.data.data[j].url;
                  break;
                };
              };
            };
            //更新局部
            that.setData({
              playlist: tracks, // 歌单列表
            });
            // 更新全局
            app.globalData.playlist = tracks;
          });
        });
        break;
      case 'newDiscs': // 新碟
        util.getdata('album?id=' + id, function(res) {
          console.log(res);

          let {
            album, // 专辑
            songs // 歌单列表
          } = res.data;
          let ids = '';


          // 更新局部
          that.setData({

            songlist: {

              image: album.picUrl, // 图片地址
              title: album.name, // 歌单名
              writer: album.artist.name, // 歌手名
              writerImage: album.artist.picUrl, // 歌手照片
              description: album.description, // 简单的介绍文本
              commentCount: util.dealPlayCount(album.info.commentCount), // 歌单评论次数
              shareCount: util.dealPlayCount(album.info.shareCount), // 歌单评论次数
              collectCount: util.dealPlayCount(album.info.likedCount), // 歌单收藏次数

            },
          });

          // 包装列表数组
          songs = songs.map(value => {
            ids += value.id + ',';
            return {
              id: value.id, // 歌曲ID
              mv: value.mv, // 视频ID
              image: value.al.picUrl, // 图片URL
              title: value.name, // 歌名
              singer: value.ar[0].name, // 歌手
              album: value.al.name, // 专辑
              exclusive: false, // 独家音乐标识
              vip: false, // 网易云会员标识
              sq: value.privilege.maxbr == 999000, // 无损音质标识
            };
          });
          util.getdata("song/url?id=" + ids.substring(',', ids.length - 1), res => {
            for (var i = 0; i < songs.length; i++) {
              for (var j = 0; j < res.data.data.length; j++) {
                if (songs[i].id == res.data.data[j].id) {
                  songs[i].url = res.data.data[j].url;
                  break;
                };
              };
            };
            //更新局部
            that.setData({
              playlist: songs, // 歌单列表
            });
            // 更新全局
            app.globalData.playlist = songs;
          });
        });
        break;
      case "rankingList": // 排行榜
        console.log(11111111111111111111111111);
        break;
    };

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

      let {
        playIndex,
        playlist,
        playing,
        isPlayState
      } = app.globalData;

      playIndex++;
      playing = playlist[playIndex];
      console.log(playing);
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
  onChangePlaying: function(event) { // 列表切歌，切在播的歌跳转

    let that = this;
    let {
      id,
      index
    } = event.currentTarget.dataset;

    console.log('-------------------event------------------------');
    console.log('id=' + id);
    console.log('index=' + index);

    let {
      playing,
      playlist,
      playIndex,
      isShowPlayBar
    } = that.data;

    console.log('-------------------that.data------------------------');
    console.log('playing=');
    console.log(playing);
    console.log('playlist=');
    console.log(playlist);
    console.log('playIndex=' + playIndex);
    console.log('isShowPlayBar=' + isShowPlayBar);

    if (playIndex != index) {
      playing = playlist[index];
      if (playing.url) {
        BackgroundAudioManager.src = playing.url;
        BackgroundAudioManager.title = playing.title;
        BackgroundAudioManager.coverImgUrl = playing.image;
        BackgroundAudioManager.singer = playing.singer;
        // 更新局部
        that.setData({
          playing,
          playIndex: index,
          isShowPlayBar: true
        });
        // 更新全局
        app.globalData.playing = playing;
        app.globalData.playIndex = index;
        app.globalData.isShowPlayBar = true;
      } else {
        wx.showToast({
          title: '你该充钱了',
          icon: 'none'
        });
      };
    } else { // 点第二下跳转页面
      util.navigateTo('../player/player');
    };
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
  onShowPlaylist: function(event) { // 列表显示
    // 局部更新
    this.setData({
      isShowPlaylist: true
    });
    // 更新全局
    app.globalData.isShowPlaylist = true;
  },
  onHidePlaylist: function(event) { // 列表隐藏
    // 局部更新
    this.setData({
      isShowPlaylist: false
    });
    // 更新全局
    app.globalData.isShowPlaylist = false;
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