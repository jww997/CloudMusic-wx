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


  /**
   * 页面的初始数据
   */
  data: {

    radioStation: {
      banner: [], // 轮播图 
      menus: [{
        name: '电台分类',
        iconClass: 'icon-radioStation-classify',
        dataTo: '',
      }, {
        name: '电台排行',
        iconClass: 'icon-radioStation-ranking',
        dataTo: '',
      }, {
        name: '付费精品',
        iconClass: 'icon-radioStation-payBoutique',
        dataTo: '',
      }, {
        name: '主播学院',
        iconClass: 'icon-radioStation-anchorSchool',
        dataTo: '',
      }], // 菜单栏
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;

    let {
      radioStation, // 电台
      radioStation: {
        banner, // 轮播图
      }
    } = that.data;

    // 电台轮播图
    util.getdata('dj/banner', function(res) {
      // console.log(res);
      res.data.data.forEach(value => {
        let {
          pic,
          url,
          typeTitle,
        } = value;
        banner.push({
          title: typeTitle,
          image: pic,
          url,
        });
        that.setData({
          radioStation: {
            banner,
            ...radioStation,
          }
        });
      });
    });

    // 电台推荐
    util.getdata('dj/recommend', function(res) {
      console.log(res);

      // res.data.data.forEach(value => {
      //   let {
      //     pic,
      //     url,
      //     typeTitle,
      //   } = value;
      //   banner.push({
      //     title: typeTitle,
      //     image: pic,
      //     url,
      //   });
      //   that.setData({
      //     radioStation: {
      //       banner,
      //       ...radioStation,
      //     }
      //   });
      // });

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