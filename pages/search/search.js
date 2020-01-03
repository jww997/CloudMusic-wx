var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    searchValue: '', // 搜索内容
    searchList: [], // 搜索结果

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
            util.getdata("song/url?id=" + id, res => {
              let curPlayId = id; // 歌曲ID,保存方便跳转
              let curPlayUrl = res.data.data[0].url; // 音乐URL
              util.getdata('song/detail?ids=' + id, res => {
                // console.log(res.data);
                let curPlaySong = res.data.songs[0].name;
                let curPlayPicUrl = res.data.songs[0].al.picUrl;
                let curPlayAuthor = res.data.songs[0].ar[0].name;
                // 传递给全局
                app.globalData.isShowPlayBar = true;
                app.globalData.isPlayState = true; // 播放状态
                app.globalData.curPlayId = curPlayId; // 歌曲ID,保存方便跳转
                app.globalData.curPlayUrl = curPlayUrl; // 音乐URL
                app.globalData.curPlayPicUrl = curPlayPicUrl; // 图片URL
                app.globalData.curPlaySong = curPlaySong; // 歌名
                app.globalData.curPlayAuthor = curPlayAuthor; // 歌手
                that.setData({
                  isPlayState: true,
                  curPlayId: curPlayId,
                  curPlayUrl: curPlayUrl,
                  curPlayPicUrl: curPlayPicUrl,
                  curPlaySong: curPlaySong,
                  curPlayAuthor: curPlayAuthor,
                });
                util.play(curPlayUrl, curPlayPicUrl, curPlaySong, curPlayAuthor, curPlayId);
                util.navigateTo('/pages/player/player');
              });

            });
          };
        }, res => {
          wx.showToast({
            title: '暂无版权',
            icon: 'none',
          });
        });
        break;
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  // 监听事件
  onTogglePlayState: function() { // 播放状态切换
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
  onSearch: function(event) { // 搜索触发
    // console.log(event);
    let searchValue = event.detail.value;
    util.getdata('search?keywords=' + searchValue, res => {
      // console.log(res);
      this.setData({
        searchList: res.data.result.songs
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