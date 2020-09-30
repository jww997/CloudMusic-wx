/**
 * @Author: Gavin
 * @Begin: 2020-07-24 14:15:3
 * @Update: 2020-07-24 14:15:3
 * @Update log: 更新日志
 */
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const common = require("../../utils/common.js");
const apiwx = require("../../utils/apiwx.js");
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
  toggleHomeSwiperIndex: function (event) { // 容器下标切换
    const that = this;
    let id = event.currentTarget.dataset.id;
    let current = event.detail.current;
    let homeSwiperIndex = id || current ? id || current : 0;
    if (homeSwiperIndex == that.data.homeSwiperIndex) return;
    that.setData({
      homeSwiperIndex,
    });
    that.getdata();
  },
  toggleDiscoverFreshIndex: function (event) { // 列表切换[1新碟 2新歌]
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

    api.getAlbumNewest().then(res => { // 新碟上架
      let arr = new Array();
      res.data.albums.forEach(item => {
        arr.push({
          id: item.id,
          title: item.name,
          singer: util.formatArtists(item.artists),
          image: item.picUrl,
        });
      });
      newDiscs.push(...util.arrSlice(arr, 3));
      that.setData({
        discover,
      });
    });
  },
  toggleNewSongs: function (event) { // 播放新歌
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


  getVideo: function (event) { // 获取视频
    const that = this;
    let {
      video,
      video: {
        group,
      },
    } = that.data;
    // 标签列表
    util.getdata('video/group/list', function (res) {
      that.setData({
        video: {
          ...video,
          group: res.data.data,
        },
      });
    });


  },
  toggleVideoGroupIndex: function (event) {
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
    api.getVideoGroup({
      id,
    }).then(res => {
      console.log(res);


      that.setData({
        video: {
          ...video,
          index: id,
        },
      });
    });
  },

  getFM: function () {
    const that = this;
    api.getHomePersonalFM();
  },






  getdata: function () {
    const that = this;
    let homeSwiperIndex = that.data.homeSwiperIndex;
    if (homeSwiperIndex == 0) {
      that.gatMine();
    } else if (homeSwiperIndex == 1) {
      that.getDiscover();
    };
  },
  gatMine: function () {
    const that = this;
    api.getUserDetail({
      uid: apiwx.getStorageSync("account").id,
    }).then(res => {
      that.setData({
        mine: {
          menus: that.data.mine.menus,
          ...res.data,
        },
      });
    });
  },
  getDiscover: function () {
    const that = this;
    let discover = that.data.discover;
    api.getBanner().then(res => { // 轮播图
      discover.banners = res.data.banners;
      return api.getPersonalized(); // 推荐歌单
    }).then(res => {
      res.data.result.forEach(item => {
        item.playCount = util.formatPlayCount(item.playCount);
      });
      discover.recommend = res.data.result;
      return api.getTopSong(); // 新歌速递
    }).then(res => {
      let arr = new Array();
      res.data.data.forEach(item => {
        arr.push({
          id: item.id,
          title: item.name,
          singer: util.formatArtists(item.artists),
          image: item.album.blurPicUrl,
        });
      });
      discover.fresh.newSongs.push(...util.arrSlice(arr, 3));
      that.setData({
        discover,
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
      recommend: [], // 推荐歌单
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
  onLoad: function (options) {
    const that = this;
    let index = options.index;
    index ? that.setData({
      homeSwiperIndex: options.index,
    }) : "";

    that.getdata();
    apiwx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    app.initAudio(that);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})