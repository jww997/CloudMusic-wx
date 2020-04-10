const util = require("../../utils/util.js");
const common = require("../../utils/common.js");
const app = getApp();
const backgroundAudioManager = app.globalData.backgroundAudioManager;

Component({
  behaviors: [],
  properties: { // 属性定义
    playing: {
      type: Object,
      value: {},
    },
    playlist: {
      type: Array,
      value: [],
    },
    isShowPlaylist: {
      type: Boolean,
      value: false,
    },
  },

  data: { // 私有数据，可用于模板渲染
    modeIndex: app.globalData.modeIndex,
    modeList: app.globalData.modeList,
  },

  lifetimes: { // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: { // 组件所在页面的生命周期函数
    show: function() {
      const that = this;
      // app.initAudio(that);
    },
    hide: function() {},
    resize: function() {},
  },

  methods: {
    // 公共事件
    toPages: app.toPages,
    togglePlayingCut: common.togglePlayingCut, // 列表切歌
    togglePlayingState: common.togglePlayingState, // 播放状态
    togglePlayingListShow: common.togglePlayingListShow, // 播放列表显示
    toggleModeIndex: common.toggleModeIndex, // 播放顺序
  }
})