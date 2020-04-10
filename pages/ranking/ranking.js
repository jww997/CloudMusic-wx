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

    // 排行榜
    ranking: {
      officialList: { // 官方榜
        name: '官方榜',
        list: [],
      },
      unofficialLists: [{ // 非官方榜单
          name: '推荐榜',
          list: [],
        },
        {
          name: '全球榜',
          list: [],
        },
        {
          name: '更多榜单',
          list: [],
        },
      ],
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    let {
      ranking: {
        officialList, // 官方榜
        unofficialLists, // 非官方榜单
      },
    } = that.data;
    // 获取所有榜单内容摘要
    util.getdata('toplist/detail', res => {
      let {
        list,
        artistToplist, // 云音乐歌手榜
        rewardToplist, // 云音乐赞赏榜
      } = res.data;
      list.forEach(item => {
        let {
          updateFrequency,
          coverImgUrl,
          name,
          tracks,
          id,
        } = item, idx;
        switch (name) {
          case "云音乐新歌榜":
            idx = 0;
            break;
          case "云音乐热歌榜":
            idx = 1;
            break;
          case "网易原创歌曲榜":
            idx = 2;
            break;
          case "云音乐飙升榜":
            idx = 3;
            break;
          case "云音乐国电榜":
            idx = 4;
            break;
          case "UK排行榜周榜":
            idx = 5;
            break;
          case "美国Billboard周榜":
            idx = 6;
            break;
          case "KTV唛榜":
            idx = 7;
            break;
          case "iTunes榜":
            idx = 8;
            break;
          case "Hit FM Top榜":
            idx = 9;
            break;
          case "日本Oricon周榜":
            idx = 10;
            break;
            // case "韩国Melon排行榜周榜":
            //   idx = 11;
            //   break;
            // case "韩国Mnet排行榜周榜":
            //   idx = 12;
            //   break;
            // case "韩国Melon原声周榜":
            //   idx = 13;
            //   break;
            // case "中国TOP排行榜(港台榜)":
            //   idx = 14;
            //   break;
            // case "中国TOP排行榜(内地榜)":
            //   idx = 15;
            //   break;
            // case "香港电台中文歌曲龙虎榜":
            //   idx = 16;
            //   break;
            // case "华语金曲榜":
            //   idx = 17;
            //   break;
            // case "中国嘻哈榜":
            //   idx = 18;
            //   break;
          case "法国 NRJ Vos Hits 周榜":
            idx = 19;
            break;
          case "台湾Hito排行榜":
            idx = 20;
            break;
          case "Beatport全球电子舞曲榜":
            idx = 21;
            break;
          case "云音乐ACG音乐榜":
            idx = 22;
            break;
          case "云音乐说唱榜":
            idx = 23;
            break;
          case "云音乐古典音乐榜":
            idx = 24;
            break;
          case "云音乐电音榜":
            idx = 25;
            break;
          case "抖音排行榜":
            idx = 26;
            break;
          case "新声榜":
            idx = 27;
            break;
          case "云音乐韩语榜":
            idx = 28;
            break;
          case "英国Q杂志中文版周榜":
            idx = 29;
            break;
          case "电竞音乐榜":
            idx = 30;
            break;
          case "云音乐欧美热歌榜":
            idx = 31;
            break;
          case "云音乐欧美新歌榜":
            idx = 32;
            break;
            // case "说唱TOP榜":
            //   idx = 33;
            //   break;
        };
        item = {
          id,
          idx,
          updateFrequency,
          coverImgUrl,
          name,
          tracks,
        };
        if (idx == 0 || idx == 1 || idx == 2 || idx == 3) {
          officialList.list.push(item);
        } else if (idx == 23 || idx == 25 || idx == 32 || idx == 24 || idx == 26 || idx == 22) {
          unofficialLists[0].list.push(item);
        } else if (idx == 5 || idx == 6 || idx == 21 || idx == 10 || idx == 8 || idx == 29) {
          unofficialLists[1].list.push(item);
        } else {
          unofficialLists[2].list.push(item);
        };
      });
      that.setData({
        ranking: {
          officialList, // 官方榜
          unofficialLists, // 非官方榜单
        },
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