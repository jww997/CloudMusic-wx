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
  toggleSonglistPlaying: function(event) { // 歌单列表切歌
    const that = this;
    let {
      id,
      index
    } = event.currentTarget.dataset;
    let {
      playing,
      playlist,
      playIndex,
      isShowPlayBar,
      isPlayState,
      songlist: {
        list,
      }
    } = that.data;
    if (playIndex != index) {
      common.getSongUrl(list[index].id, url => {
        let playing = {
          ...list[index],
          url,
        };
        that.setData({
          playing,
          playIndex: index,
          playlist: list,
          isShowPlayBar: true,
          isPlayState: true,
        });
        app.globalData.playing = playing;
        app.globalData.playIndex = index;
        app.globalData.playlist = list;
        app.globalData.isShowPlayBar = true;
        app.globalData.isPlayState = true;
        app.initAudio(that);
      });
    } else { // 点第二下跳转页面
      util.navigateTo('../player/player');
    };
  },
  toggleMessageShow: function(event) {
    const that = this;
    let {
      type,
    } = event.currentTarget.dataset;
    switch (type) {
      case "1":
        that.setData({
          isShowMessage: true,
        });
        break;
      case "0":
        that.setData({
          isShowMessage: false,
        });
        break;
    };
  },
  saveImage: function(event) { // 保存封面
    const that = this;
    let {
      songlist: {
        image,
        title,
      },
    } = that.data;
    if (!image) return false;
    util.getSetting(res => {
      console.log(res);
      util.downloadFile(image, res => {
        console.log(res);
        util.saveImageToPhotosAlbum(res.tempFilePath, res => {
          console.log(res);
          util.showToast('保存成功');
        });
      });
    });
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
    isShowMessage: false, // 列表信息显示

    modeIndex: 1, // 播放模式下标
    modeList: [], // 播放模式列表

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
      type: 1, // 1 热门推荐 & 排行榜 2 新碟 
      list: [], // 播放列表
      tags: [], // 标签

    }, // 选择的歌单

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;

    let id = options.id;
    let type = options.type != 'undefined' ? options.type : '1';

    util.setNavigationBarTitle(type == 2 ? '专辑' : '歌单');
    switch (type) { // 1 热门推荐 2 新碟 3 排行榜
      case '1':
        util.getdata('playlist/detail?id=' + id, function(res) {

          let {
            playlist: {
              id, // 歌单ID
              coverImgUrl, // 图片地址
              name, // 歌单名
              creator, // 主人,对象
              description, // 简单的介绍文本
              playCount, // 播放量
              commentCount, // 评论量
              shareCount, // 分享量
              subscribedCount, // 收藏量
              tracks, // 歌单列表
              tags, // 标签
            },
            privileges,
          } = res.data;

          tracks = tracks.map((value, index) => { // 包装
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

          that.setData({
            songlist: {
              id, // 歌单ID
              image: coverImgUrl, // 图片地址
              title: name, // 歌单名
              writer: creator.nickname, // 歌单主人
              writerImage: creator.avatarUrl, // 主人头像
              description: description, // 简单的介绍文本
              playCount: util.formatPlayCount(playCount), // 播放量
              commentCount: util.formatPlayCount(commentCount), // 评论量
              shareCount: util.formatPlayCount(shareCount), // 分享量
              collectCount: util.formatPlayCount(subscribedCount), // 收藏量
              list: tracks, // 歌单列表
              tags, // 标签
            },
          });
          app.globalData.playlist = tracks; // 播放列表

        });
        break;
      case '2':
        util.getdata('album?id=' + id, function(res) {

          let {
            album,
            songs,
          } = res.data;

          console.log(res.data);

          songs = songs.map(value => { // 包装
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

          that.setData({
            songlist: {
              id: album.id, // 专辑ID
              image: album.picUrl, // 图片地址
              title: album.name, // 歌单名
              writer: album.artist.name, // 歌手名
              writerImage: album.artist.picUrl, // 歌手照片
              description: album.description, // 简单的介绍文本
              commentCount: util.formatPlayCount(album.info.commentCount), // 歌单评论次数
              shareCount: util.formatPlayCount(album.info.shareCount), // 歌单评论次数
              collectCount: util.formatPlayCount(album.info.likedCount), // 歌单收藏次数
              list: songs, // 播放列表
              type: 2,
            },
          });
          app.globalData.playlist = songs; // 歌单列表

        });
        break;
      case '3':
        util.getdata('top/list?idx=' + id, function(res) {
          let {
            playlist: {
              id, // 歌单ID
              coverImgUrl, // 图片地址
              name, // 歌单名
              creator, // 主人,对象
              description, // 简单的介绍文本
              playCount, // 播放量
              commentCount, // 评论量
              shareCount, // 分享量
              subscribedCount, // 收藏量
              tracks, // 歌单列表
              tags, // 标签
            },
            privileges,
          } = res.data;

          tracks = tracks.map((value, index) => { // 包装
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

          that.setData({
            songlist: {
              id, // 歌单ID
              image: coverImgUrl, // 图片地址
              title: name, // 歌单名
              writer: creator.nickname, // 歌单主人
              writerImage: creator.avatarUrl, // 主人头像
              description: description, // 简单的介绍文本
              playCount: util.formatPlayCount(playCount), // 播放量
              commentCount: util.formatPlayCount(commentCount), // 评论量
              shareCount: util.formatPlayCount(shareCount), // 分享量
              collectCount: util.formatPlayCount(subscribedCount), // 收藏量
              list: tracks, // 歌单列表
              tags, // 标签
            },
          });
          app.globalData.playlist = tracks; // 播放列表

        });
        break;
    };

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