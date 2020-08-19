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

  pageScrollTo: util.pageScrollTo(0, 1500), // 返回顶部

  // 局部事件
  onPageScroll: function(event) {
    const that = this;
    util.getSystemInfo(res => {
      if (event.scrollTop > res.screenHeight) {
        that.setData({
          isShowBacktotop: true
        });
      } else {
        that.setData({
          isShowBacktotop: false
        });
      };
    });
  },

  /**
   * 页面的初始数据
   */
  data: {

    comment: { // 评论
      recent: [], // 近期评论
      wonderful: [], // 精彩评论
      newest: [], // 最新评论
      total: '', // 总数
    },
    isShowBacktotop: false, // 返回顶部按钮显示

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    let {
      id,
      type, // 1歌曲评论 2专辑评论 3歌单评论 4mv评论 5电台节目评论 6视频评论
    } = options, typeName;
    let {
      playing,
    } = app.globalData;

    switch (type) {
      case '1':
        typeName = 'music';
        break;
      case '2':
        typeName = 'album';
        break;
      case '3':
        typeName = 'playlist';
        break;
      case '4':
        typeName = 'mv';
        break;
      case '5':
        typeName = 'dj';
        break;
      case '6':
        typeName = 'video';
        break;
    };

    util.getdata(`comment/${typeName}?id=${id}`, function(res) {
      let {
        topComments,
        hotComments,
        comments,
        total,
      } = res.data;
      apiwx.setNavigationBarTitle(`评论（${total}）`);
      let recent = topComments.map(item => {
        return { ...item,
          date: util.formatDate(item.time)
        }
      });
      let wonderful = hotComments.map(item => {
        return { ...item,
          date: util.formatDate(item.time)
        }
      });
      let newest = comments.map(item => {
        return { ...item,
          date: util.formatDate(item.time)
        }
      });
      that.setData({
        id,
        comment: {
          recent,
          wonderful,
          newest,
          total,
        },
        playing,
        typeName,
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
    const that = this;
    let {
      id,
      comment,
      comment: {
        newest,
        total,
      },
      typeName,
    } = that.data;
    if (newest.length == total) return false; 
    util.getdata(`comment/${typeName}?id=${id}&before=${newest[newest.length-1].time}`, function(res) {
      res.data.comments.map(item => {
        newest.push({ ...item,
          date: util.formatDate(item.time),
        });
      });
      that.setData({
        comment: {
          ...comment,
          newest,
        },
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})