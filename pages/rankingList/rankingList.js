var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    officialList: [], // 官方榜
    recommendList: [], // 推荐榜
    globalList: [], // 全球榜
    moreList: [], // 更多榜单

  },

  // 跳转公共方法
  toPages: function (event) {
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

    // --------------获取数据---------------
    let that = this;
    let {
      officialList, // 官方榜
      recommendList, // 推荐榜
      globalList, // 全球榜
      moreList, // 更多榜单
    } = that.data;
    // 获取所有榜单内容摘要
    util.getdata('toplist/detail', res => {
      // console.log(res.data);

      let {
        artistToplist,
        rewardToplist,
        list
      } = res.data;

      for (let i in list) {

        let name = list[i].name;

        if (name == "云音乐飙升榜" || name == "云音乐新歌榜" || name == "云音乐热歌榜" || name == "网易原创歌曲榜") {
          officialList.push(list[i]);
        } else if (name == "云音乐说唱榜" || name == "云音乐电音榜" || name == "云音乐欧美新歌榜" || name == "抖音排行榜" || name == "云音乐ACG音乐榜" || name == "抖音排行榜") {
          recommendList.push(list[i]);
        } else if (name == "美国Billboard周榜" || name == "UK排行榜周榜" || name == "Beatport全球电子舞曲榜" || name == "日本Oricon周榜" || name == "iTunes榜" || name == "英国Q杂志中文版周榜") {
          globalList.push(list[i]);
        } else {
          moreList.push(list[i]);
        };
      };

      // moreList.push(artistToplist);
      // moreList.push(rewardToplist);

      that.setData({
        officialList, // 官方榜
        recommendList, // 推荐榜
        globalList, // 全球榜
        moreList, // 更多榜单
      });

    });

    // 获取排行榜中的歌手榜
    // util.getdata('toplist/artist', res => {
    //   console.log(res);
    // });

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