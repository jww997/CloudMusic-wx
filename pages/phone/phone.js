/**
 * @Author: Gavin
 * @Begin: 2020-08-19 16:2:21
 * @Update: 2020-08-19 16:2:21
 * @Update log: 更新日志
 */
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const common = require("../../utils/common.js");
const apiwx = require("../../utils/apiwx.js");
const app = getApp();
const backgroundAudioManager = app.globalData.backgroundAudioManager;

Page({

  // 监听事件
  formSubmit: function (event) { // 提交表单
    let {
      phone,
      password,
    } = event.detail.value;

    if (!phone && !password) {
      apiwx.showToast('手机号与密码不能为空');
      return false;
    } else if (!phone) {
      apiwx.showToast('手机号不能为空');
      return false;
    } else if (!password) {
      apiwx.showToast('密码不能为空');
      return false;
    };

    console.log(phone);
    console.log(password);


    api.getLoginCellphone({
      phone,
      password,
    }).then(res => {

      if (res.data.code == 200) {
        
        apiwx.setStorageSync("account", res.data.account);
        apiwx.setStorageSync("cookie", res.data.cookie);
        util.redirectTo(`/pages/home/home?index=0`);
      } else {
        apiwx.showToast('用户名或者密码错误');
      };
    });
  },
  getCaptcha: function () { // 发送验证码
    let that = this;
    let phone = that.data.phone;
    if (!phone) return;
    console.log(phone);
    util.getdata('captcha/sent?phone=' + phone, function (res) {
      console.log(res);
    });

  },

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})