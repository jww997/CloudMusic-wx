const util = require("../../utils/util.js");
const common = require("../../utils/common.js");
const app = getApp();
const backgroundAudioManager = app.globalData.backgroundAudioManager;
const videoContext = app.globalData.videoContext;

Page({

  // 公共事件
  toPages: app.toPages,

  /**
   * 页面的初始数据
   */
  data: {

    video: {

      id: null, // 歌曲ID
      url: null, // 视频地址
      title: null, // 歌名
      singer: null, // 歌手
      singerImage: null, // 主人头像
      description: null, // 简单的介绍文本
      publishTime: null, // 发布时间


      playCount: null, // 播放量
      likeCount: null, // 点赞量
      commentCount: null, // 评论量
      shareCount: null, // 分享量
      collectCount: null, // 收藏量

    }, // 当前播放的视频

    relatedMusic: [], // 相关音乐
    relatedVideo: [], // 相关视频
    hotComment: [], // 精彩评论
    newComment: [], // 最新评论

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    
    let {
      id
    } = options;
    // 暂停播放的音乐
    backgroundAudioManager.pause();
    // 获取对应 MV 数据, 数据包含 mv 名字, 歌手, 发布时间, mv 视频地址等数据, 其中 mv 视频 网易做了防盗链处理, 可能不能直接播放, 需要播放的话需要调用 ' mv 地址' 接口
    util.getdata('mv/detail?mvid=' + id, function(res) {
      // console.log(res);

      let {

        id, // 歌曲ID
        brs, // 视频地址
        name, // 歌名
        artistName, // 歌手
        singerImage, // 主人头像,未找到
        desc, // 简单的介绍文本
        publishTime, // 发布时间

        playCount, // 播放量
        likeCount, // 点赞量
        commentCount, // 评论量
        shareCount, // 分享量
        subCount, // 收藏量




      } = res.data.data;

      // 标题
      util.setNavigationBarTitle(name);
      // 更新局部
      that.setData({

        video: {
          id, // 歌曲ID
          url: brs[1080] || brs[720] || brs[480] || brs[240], // 视频地址
          title: name, // 歌名
          singer: artistName, // 歌手
          singerImage: null, // 主人头像
          description: desc, // 简单的介绍文本
          publishTime, // 发布时间

          playCount: util.formatPlayCount(playCount), // 播放量
          likeCount, // 点赞量
          commentCount, // 评论量
          shareCount, // 分享量
          collectCount: subCount, // 收藏量
        }

      });

    });

    // 相关视频
    util.getdata('related/allvideo?id=' + id, function(res) {
      console.log(res);

      let {

        relatedMusic, // 相关音乐
        relatedVideo, // 相关视频

      } = that.data;

      res.data.data.forEach(value => {

        let {
          title, // 歌名
          creator, // 歌手
          coverUrl, // 图片
          durationms, // 总时长
          playTime, // 播放量
          type, // 0带MV标识1不带
        } = value;

        relatedVideo.push({
          title, // 歌名
          singer: creator[0].userName, // 歌手
          image: coverUrl, // 图片
          duration: util.formatTime(durationms), // 总时长
          playCount: util.formatPlayCount(playTime), // 播放量
          type, // 0带MV标识1不带
        });

      });

      // 更新局部
      that.setData({
        relatedVideo, // 相关视频
      });
    });

    // 精彩评论
    util.getdata('comment/mv?id='+id, res => {
      console.log(res);

      let {
        hotComments, // 精彩评论
        comments, // 最新评论
        total, // 总数
      } = res.data;

      let {
        hotComment, // 精彩评论
        newComment, // 最新评论
      } = that.data;

      // 包装精彩评论
      hotComments.forEach(value => {
        hotComment.push({
          image: value.user.avatarUrl, // 头像
          name: value.user.nickname, // 用户名
          time: util.formatDate(value.time), // 时间
          content: value.content, // 内容
          likedCount: value.likedCount, // 点赞量
        });
      });
      comments.forEach(value => {
        newComment.push({
          image: value.user.avatarUrl, // 头像
          name: value.user.nickname, // 用户名
          time: util.formatDate(value.time), // 时间
          content: value.content, // 内容
          likedCount: value.likedCount, // 点赞量
        });
      });

      // 更新局部
      that.setData({
        hotComment, // 精彩评论
        newComment, // 最新评论
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})