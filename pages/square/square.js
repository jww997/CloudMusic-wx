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
  onToggleLabel: function(event) { // 显示&隐藏 歌单标签
    let that = this;
    let {
      isShowLabel
    } = that.data;
    that.setData({
      isShowLabel: !isShowLabel
    });
    util.setNavigationBarTitle(!isShowLabel ? '歌单标签' : '歌单广场');
  },
  onToggleNavIndex: function(event) { // 点击&拖拽 切换导航内容
    // console.log(event);
    let that = this;
    let id = event.currentTarget.dataset.id;
    let current = event.detail.current;
    let navIndex = current || id ? current || id : 0;
    let {
      limit,
      mytabs,
    } = that.data;
    that.setData({
      navIndex, // 导航下标
    });

    if (mytabs[navIndex].name == '精品') {
      util.getdata('top/playlist/highquality?limit=' + limit, function(res) {
        // console.log(res);
        mytabs[navIndex].list = mytabs[navIndex].list || new Array();
        if (mytabs[navIndex].list.length == 0) {
          res.data.playlists.forEach(value => {
            mytabs[navIndex].list.push({
              name: value.name, // 歌单名字
              playCount: util.formatPlayCount(value.playCount), // 播放量
              picUrl: value.coverImgUrl, // 背景图片
              id: value.id, // 跳转参数
              updateTime: value.updateTime, // 分页参数
            });
          });
        };
        that.setData({
          mytabs,
        });
      });
    } else {
      util.getdata('top/playlist?limit=' + limit + '&cat=' + mytabs[navIndex].name, function(res) {
        // console.log(res);
        mytabs[navIndex].list = mytabs[navIndex].list || new Array();
        if (mytabs[navIndex].list.length == 0) {
          res.data.playlists.forEach(value => {
            mytabs[navIndex].list.push({
              name: value.name, // 歌单名字
              playCount: util.formatPlayCount(value.playCount), // 播放量
              picUrl: value.coverImgUrl, // 背景图片
              id: value.id, // 跳转参数
              updateTime: value.updateTime, // 分页参数
            });
          });
        };
        that.setData({
          mytabs,
        });
      });
    };

  },
  onLoadMore: function(event) { // 到达底部，加载更多
    let that = this;
    let id = event.currentTarget.dataset.id;
    let {
      limit,
      mytabs,
    } = that.data;
    util.getdata('top/playlist/highquality?before=' + mytabs[id].list[mytabs[id].list.length - 1].updateTime + '&limit=' + limit, function(res) {
      // console.log(res);
      res.data.playlists.forEach(value => {
        mytabs[id].list.push({
          name: value.name, // 歌单名字
          playCount: util.formatPlayCount(value.playCount), // 播放量
          picUrl: value.coverImgUrl, // 背景图片
          id: value.id, // 跳转参数
          updateTime: value.updateTime, // 分页参数
        });
      });

      that.setData({
        mytabs,
      });
    });
  },

  editLabel: function(event) { // 编辑标签
    const that = this;
    let {
      id,
      index,
      ishot,
      name,
    } = event.currentTarget.dataset;
    let {
      mytabs,
    } = that.data;
    console.log(`id = ${id}, index = ${index}, ishot = ${ishot}, name = ${name}`);
    if (id == '-1') { // 删除
      index ? mytabs.splice(index, 1) : '';
      util.showToast('删除成功', 'success');
    } else { // 增加
      if (mytabs.length >= 8) {
        util.showToast('标签已满');
        return false;
      };
      let mytab = {
        name,
        isHot: ishot,
      };
      if (JSON.stringify(mytabs).indexOf(JSON.stringify(mytab)) == -1) {
        mytabs.push(mytab);
        util.showToast('添加成功', 'success');
      } else {
        util.showToast('标签已有');
      };
    };
    that.setData({
      mytabs,
    });
  },



  /**
   * 页面的初始数据
   */
  data: {

    limit: 30, // 加载数量
    navIndex: 0, // 导航下标
    isShowLabel: false, // 显示&隐藏 歌单标签列表
    label: [], // 歌单标签
    mytabs: [{
      name: "推荐",
      isHot: false
    }, {
      name: "官方",
      isHot: false
    }, {
      name: "精品",
      isHot: false
    }, {
      name: "华语",
      isHot: true
    }, {
      name: "民谣",
      isHot: true
    }, {
      name: "电子",
      isHot: true
      // }, {
      //   name: "R&B/Soul",
      //   isHot: false
    }, {
      name: "说唱",
      isHot: false
    }, {
      name: "日语",
      isHot: false
    }], // 我的歌单广场

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;

    let {
      label,
      mytabs,
    } = that.data;

    // 歌单分类
    util.getdata('playlist/catlist', function(res) {
      // console.log(res);
      let categories = res.data.categories;
      let sub = res.data.sub;
      for (var i in categories) {
        label.push({
          title: categories[i],
          tags: [],
        });
        sub.forEach(value => {
          if (value.category == i) {
            label[i].tags.push({
              name: value.name, // 标签名字
              isHot: value.hot, // 热门标志
            });
          };
        });
      };
      that.setData({
        label, // 歌单标签
      });
    });

    // 歌单列表
    util.getdata('top/playlist?limit=30', function(res) {
      let {
        mytabs,
      } = that.data;
      mytabs[0].list = new Array();
      res.data.playlists.forEach(value => {
        mytabs[0].list.push({
          name: value.name, // 歌单名字
          playCount: util.formatPlayCount(value.playCount), // 播放量
          picUrl: value.coverImgUrl, // 背景图片
          id: value.id, // 跳转参数
          updateTime: value.updateTime, // 分页参数
        });
      });
      that.setData({
        mytabs,
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