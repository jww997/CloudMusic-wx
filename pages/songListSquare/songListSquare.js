var util = require("../../utils/util.js");
var app = getApp();

Page({

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
    };
  },

  /**
   * 页面的初始数据
   */
  data: {


    categories: [], // 导航集合






    playlists: [], // 歌单列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // --------------获取数据---------------
    var that = this;


    util.getdata('playlist/catlist', function(res) {
      console.log(res);
    });

    util.getdata('playlist/hot', function(res) {
      console.log(res);
    });

    util.getdata('top/playlist?limit=10&order=new', function(res) {
      console.log(res);
    });








    // 歌单列表
    util.getdata('top/playlist', function(res) {
      that.setData({
        playlists: res.data.playlists
      });
      let playlists = that.data.playlists,
        playCounts = new Array();
      playlists.forEach(value => {
        playCounts.push(value.playCount);
      });
      playCounts = util.dealPlayCount(playCounts);
      playlists.forEach(value => {
        value.playCount = playCounts.shift();
      });
      that.setData({
        playlists: playlists
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