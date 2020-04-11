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

  // 局部事件
  toggleHomeSwiperIndex: function(event) { // 容器下标切换
    const that = this;
    let id = event.currentTarget.dataset.id;
    let current = event.detail.current;
    let homeSwiperIndex = id || current ? id || current : 0;
    if (homeSwiperIndex == that.data.homeSwiperIndex) return;
    that.setData({
      homeSwiperIndex,
    });
  },
  toggleDiscoverFreshIndex: function(event) { // 列表切换[1新碟 2新歌]
    const that = this;
    let id = event.currentTarget.dataset.id;
    let {
      discoverFreshIndex,
      discover,
      discover: {
        fresh: {
          newDiscs, // 新碟
        },
      },
    } = that.data;
    if (discoverFreshIndex == id) return false;
    that.setData({
      discoverFreshIndex: id,
    });

    if (newDiscs.length) return false;
    util.getdata('album/newest', function(res) { // 新碟
      let arr = new Array();
      res.data.albums.forEach(value => {
        arr.push({
          id: value.id,
          title: value.name,
          singer: util.formatArtists(value.artists),
          image: value.picUrl,
        });
      });
      newDiscs.push(...util.arrSlice(arr, 3));
      that.setData({
        discover,
      });
    });
  },
  toggleNewSongs: function(event) { // 播放新歌
    const that = this;
    let {
      id,
      index,
      index2,
    } = event.currentTarget.dataset;
    let {
      discover: {
        fresh: {
          newSongs,
        },
      },
    } = that.data;
    common.getSongUrl(id, url => {
      let playing = {
        ...newSongs[index][index2],
        url,
        album: null,
        exclusive: false,
        mv: null,
        sq: false,
        vip: false,
      };
      that.setData({
        playing,
        playIndex: index * 3 + index2,
        playlist: util.arrUnfold(newSongs),
        isShowPlayBar: true,
        isPlayState: true,
      });
      app.globalData.playing = playing;
      app.globalData.playIndex = index * 3 + index2;
      app.globalData.playlist = util.arrUnfold(newSongs);
      app.globalData.isShowPlayBar = true;
      app.globalData.isPlayState = true;
      app.initAudio(that);
    });
  },


  getVideo: function(event) { // 获取视频
    const that = this;
    let {
      video,
      video: {
        group,
      },
    } = that.data;
    // 标签列表
    util.getdata('video/group/list', function(res) {
      that.setData({
        video: {
          ...video,
          group: res.data.data,
        },
      });
    });


  },
  toggleVideoGroupIndex: function(event) {
    const that = this;
    let {
      id,
      index,
    } = event.currentTarget.dataset;
    let {
      video,
      // video: {
      //   index,
      // },
    } = that.data;
    util.getdata(`video/group?id=${id}`, res => {
      console.log(res);


      that.setData({
        video: {
          ...video,
          index: id,
        },
      });
    });
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
      album: null // 专辑
    }, // 当前播放的歌曲
    playlist: [], // 播放列表
    playIndex: -1, // 当前歌曲在播放列表中的index

    modeIndex: 1, // 播放模式下标
    modeList: [], // 播放模式列表

    isPlayState: false, // 播放&暂停
    isShowPlayBar: false, // 显示&隐藏 底部栏
    isShowPlaylist: false, // 显示&隐藏 播放列表
    homeSwiperIndex: 1, // 容器下标
    discoverFreshIndex: 1, // 列表切换[1新碟 2新歌]

    // 我的
    mine: {
      menus: [{
        name: '本地音乐',
        iconClass: 'icon-localMusic',
        dataTo: '',
      }, {
        name: '下载管理',
        iconClass: 'icon-download',
        dataTo: '',
      }, {
        name: '我的电台',
        iconClass: 'icon-myRadio',
        dataTo: '',
      }, {
        name: '我的收藏',
        iconClass: 'icon-myFavorite',
        dataTo: '',
      }, {
        name: '关注新歌',
        iconClass: 'icon-focusNewSong',
        dataTo: '',
      }],
    },

    // 发现
    discover: {
      banners: [], // 轮播图
      menus: [{
        name: '每日推荐',
        iconClass: 'icon-dailySpecial',
        dataTo: '',
      }, {
        name: '歌单',
        iconClass: 'icon-songList',
        dataTo: 'square',
      }, {
        name: '排行榜',
        iconClass: 'icon-ranking',
        dataTo: 'ranking',
      }, {
        name: '电台',
        iconClass: 'icon-radioStation',
        dataTo: 'radioStation',
      }, {
        name: '私人FM',
        iconClass: 'icon-FM',
        dataTo: '',
      }], // 菜单栏
      recommends: [], // 推荐歌单
      fresh: {
        date: `${new Date().getMonth() + 1}月${new Date().getDate()}日`, // 日期
        newSongs: [], // 新歌 1
        newDiscs: [], // 新碟 2
      },
    },

    // 视频
    video: {
      group: [], // 标签
      index: 0, // 选中下标
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;

    wx.getStorage({ // 账户缓存
      key: 'account',
      success(res) {
        that.setData({
          account: res.data,
        });
        app.globalData.account = res.data;
      }
    });

    let {
      account, // 账户

      discover, // 发现
      discover: {
        banners, // 轮播图
        recommends, // 推荐歌单
        fresh: {
          newIndex, // 下标
          newSongs, // 新歌
        },
      },
    } = that.data;


    // 轮播图
    util.getdata('banner', function(res) {
      res.data.banners.forEach(value => {
        banners.push({
          image: value.imageUrl,
          title: value.typeTitle,
        });
      });
      that.setData({
        discover,
      });
    });
    // 推荐歌单
    util.getdata('personalized', function(res) {
      res.data.result.forEach((value, index) => {
        recommends.push({
          id: value.id,
          title: value.name,
          image: value.picUrl,
          playCount: util.formatPlayCount(value.playCount),
        });
      });
      that.setData({
        discover,
      });
    });
    // 新歌
    util.getdata('top/song', function(res) {
      let arr = new Array();
      res.data.data.forEach(value => {
        arr.push({
          id: value.id,
          title: value.name,
          singer: util.formatArtists(value.artists),
          image: value.album.blurPicUrl,
        });
      });
      newSongs.push(...util.arrSlice(arr, 3));
      that.setData({
        discover,
      });
    });




    // that.getVideo(); // 视频

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