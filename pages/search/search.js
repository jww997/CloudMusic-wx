/**
 * @Author: Gavin
 * @Begin: 2020-08-19 16:2:21
 * @Update: 2020-08-19 16:2:21
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
  onTogglePlayState: function(event) { // 播放状态切换
    let that = this;
    let isPlayState = app.globalData.isPlayState;
    let curPlayId = app.globalData.curPlayId;
    let curPlayUrl = app.globalData.curPlayUrl;
    let curPlayPicUrl = app.globalData.curPlayPicUrl;
    let curPlaySong = app.globalData.curPlaySong;
    let curPlayAuthor = app.globalData.curPlayAuthor;

    util.toggle(curPlayUrl, curPlayPicUrl, curPlaySong, curPlayAuthor, curPlayId);

    that.setData({
      isPlayState: !isPlayState,
    });
  },
  search: function(event) { // 搜索触发
    const that = this;
    let {
      searchHistory,
    } = that.data;
    let {
      word,
    } = event.currentTarget.dataset;
    let searchResult = new Array();
    let value = event.detail.value ? event.detail.value : word;
    util.getdata(`search?keywords=${value}`, res => {
      let {
        result: {
          songs,
        },
      } = res.data;
      songs ? songs.forEach(item => {
        searchResult.push({
          id: item.id,
          title: item.name,
          singer: util.formatArtists(item.artists),
          image: item.album.artist.img1v1Url,
        });
      }) : '';
      that.setData({
        searchResult,
      });
      if (!searchHistory.includes(value)) {
        searchHistory.push(value);
        console.log(searchHistory);
        wx.setStorage({
          key: "history",
          data: {
            history: searchHistory
          }
        });
      };
    });
    // }, 500);

  },
  clear: function(event) { // 清空历史记录
    const that = this;

    let {
      searchHistory,
    } = that.data;
    if (!searchHistory.length) return false;
    wx.removeStorage({
      key: "history",
      success(res) {
        console.log(res)
        that.setData({
          searchHistory: [],
        });
      }
    });
  },
  toggleSonglistPlaying: function(event) {
    const that = this;
    let {
      id,
      index,
    } = event.currentTarget.dataset;
    let {
      playing,
      playlist,
      playIndex,
      isShowPlayBar,
      isPlayState,
    } = that.data;
    let list = that.data.searchResult;


    if (playIndex != index) {
      util.getdata('song/url?id=' + list[index].id, function(res) {
        let url = res.data.data[0].url;
        if (url) {
          backgroundAudioManager.src = url;
          backgroundAudioManager.title = list[index].title;
          backgroundAudioManager.coverImgUrl = list[index].image;
          backgroundAudioManager.singer = list[index].singer;
          that.setData({
            playing: { ...list[index],
              url
            },
            playIndex: index,
            playlist: list,
            isShowPlayBar: true,
            isPlayState: true,
          });
          app.globalData.playing = { ...list[index],
            url
          };
          app.globalData.playIndex = index;
          app.globalData.playlist = list;
          app.globalData.isShowPlayBar = true;
          app.globalData.isPlayState = true;
        } else {
          apiwx.vibrateShort();
          apiwx.showToast('你该充钱了');
        };
      });
    } else { // 点第二下跳转页面
      util.navigateTo('../player/player');
    };
  },

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

    modeIndex: 1, // 播放模式下标
    modeList: [], // 播放模式列表

    searchDefault: {}, // 默认搜索
    searchResult: [], // 搜索结果
    searchHistory: [], // 历史记录
    searchHots: [], // 热搜榜
    isSearching: false, // 延迟搜索

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    app.initAudio(that);

    // 历史记录缓存
    wx.getStorage({
      key: "history",
      success(res) {
        that.setData({
          searchHistory: res.data.history,
        });
      }
    });
    // 默认搜索关键词
    util.getdata('search/default', res => {
      that.setData({
        searchDefault: res.data.data,
      });
    });
    // 热搜列表(详细)
    util.getdata('search/hot/detail', res => {
      console.log('/search/hot/detail=', res);

      that.setData({
        searchHots: res.data.data,
      });
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