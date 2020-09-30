/**
 * @Author: Gavin
 * @Begin: 2020-09-29 17:19:48
 * @Update: 2020-09-29 17:19:48
 * @Update log: 更新日志
 */
const api = require("../../../../../../utils/api.js");
const util = require("../../../../../../utils/util.js");
const common = require("../../../../../../utils/common.js");
const apiwx = require("../../../../../../utils/apiwx.js");
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    soul: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPages: app.toPages,
  }
})