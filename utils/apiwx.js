/**
 * @Author: change, Gavin
 * @Begin: 2020-07-24 14:15:35
 * @Update: 2020-07-24 14:15:35
 * @Update log: 更新日志
 */

module.exports = {

  login, // 调用接口获取登录凭证（code）
  request, // 发起 HTTPS 网络请求

  switchTab, // 跳转到tabBar页面，并关闭其他所有非tabBar页面
  reLaunch, // 关闭所有页面，打开到应用内的某个页面
  redirectTo, // 关闭当前页面，打开到应用内的某个页面
  navigateTo, // 关闭当前页面，打开到应用内的某个页面
  navigateBack, // 关闭当前页面，返回上一页面或多级页面

  getClipboardData, // 获取系统剪贴板的内容
  setClipboardData, // 设置系统剪贴板的内容
  showLoading, // 显示loading提示框
  hideLoading, // 隐藏loading提示框
  getStorage, // 从本地缓存中异步获取指定key的内容
  setStorage, // 将数据存储在本地缓存中指定的key中
  getStorageSync, // getStorage的同步版本
  setStorageSync, // setStorage的同步版本
  showShareMenu, // 显示当前页面的转发按钮
  hideShareMenu, // 隐藏转发按钮
  showToast, // 显示消息提示框
  hideToast, // 隐藏消息提示框
  showModal, // 显示模态对话框
  showNavigationBarLoading, // 在当前页面显示导航条加载动画
  hideNavigationBarLoading, // 在当前页面隐藏导航条加载动画

  setNavigationBarTitle, // 动态设置当前页面的标题
  previewImage, // 在新页面中全屏预览图片
  makePhoneCall, // 拨打电话
  pageScrollTo, // 将页面滚动到目标位置
  hideKeyboard, // 收起键盘
  downloadFile, // 下载文件资源到本地
  saveImageToPhotosAlbum, // 保存图片到系统相册
  openSetting, // 调起客户端小程序设置界面
  requestPayment, // 发起微信支付
  requestSubscribeMessage, // 调起客户端小程序订阅消息界面
  stopPullDownRefresh, // 停止当前页面下拉刷新
  openLocation, // 使用微信内置地图查看位置
  vibrateShort, // 使手机发生较短时间的振动（15 ms）
  getNetworkType, // 获取网路类型
  onNetworkStatusChange, // 监听网络状态变化事件
  getExtConfigSync, // getExtConfig 的同步版本

  chooseImage, // 从本地相册选择图片或使用相机拍照
  chooseVideo, // 拍摄视频或从手机相册中选视频
  uploadFile, // 将本地资源上传到服务器

  startRecord, // 开始录音

  playVoice,
  pauseVoice,
  stopVoice,
  getAvailableAudioSources,
}

// 开始录音。当主动调用 wx.stopRecord，或者录音超过1分钟时自动结束录音。当用户离开小程序时，此接口无法调用。
function startRecord(success, fail, complete) {
  wx.startRecord({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 拍摄视频或从手机相册中选视频
function chooseVideo(sourceType = ['album', 'camera'], compressed = true, maxDuration = 60, camera = 'back', success, fail, complete) {
  wx.chooseVideo({
    sourceType, //	视频选择的来源	
    compressed, //	是否压缩所选择的视频文件	1.6.0
    maxDuration, // 拍摄视频最长拍摄时间， 单位秒
    camera, // 默认拉起的是前置或者后置摄像头。 部分 Android 手机下由于系统 ROM 不支持无法生效
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 从本地相册选择图片或使用相机拍照
function chooseImage(count = 9, sizeType = ['original', 'compressed'], sourceType = ['album', 'camera'], success, fail, complete) {
  wx.chooseImage({
    count, //	最多可以选择的图片张数
    sizeType, // 所选的图片的尺寸
    sourceType, //  选择图片的来源
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res);
    }
  });
}

// 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。
function uploadFile(url, filePath, name, header = {}, formData = {}, timeout = 3000, success, fail, complete) {
  wx.uploadFile({
    url, //开发者服务器地址	
    filePath, // 要上传文件资源的路径 (本地路径)	
    name, // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容	
    header, // HTTP 请求 Header，Header 中不能设置 Referer	
    formData, // HTTP 请求中其他额外的 form data	
    timeout, //  超时时间，单位为毫秒
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 动态设置当前页面的标题
function setNavigationBarTitle(title = '', success, fail, complete) {
  wx.setNavigationBarTitle({
    title,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 发起 HTTPS 网络请求
function request(url, parameter, method = 'GET', success, fail, complete) {
  wx.request({
    url, // 开发者服务器接口地址
    data: parameter, // 请求的参数
    method, // HTTP 请求方法
    header: { // 设置请求的 header，header 中不能设置 Referer。 content-type 默认为 application/json
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 显示消息提示框
function showToast(title, icon = 'success', duration = 2000, success, fail, complete) {
  wx.showToast({
    title,
    icon,
    duration,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  })
}

// 隐藏消息提示框
function hideToast(success, fail, complete) {
  wx.hideToast({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  })
}

// 拨打电话
function makePhoneCall(phoneNumber, success, fail, complete) {
  wx.makePhoneCall({
    phoneNumber, // 需要拨打的电话号码
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 使用微信内置地图查看位置
function openLocation(latitude, longitude, scale = 18, name = '', address = '', success, fail, complete) {
  wx.openLocation({
    latitude, // 纬度， 范围为 -90~90， 负数表示南纬。 使用 gcj02 国测局坐标系
    longitude, // 经度， 范围为 -180~180， 负数表示西经。 使用 gcj02 国测局坐标系
    scale, // 缩放比例， 范围5~18
    name, // 位置名
    address, // 地址的详细说明
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
function showLoading(mask = false, title = "数据加载中", success, fail, complete) {
  wx.showLoading({
    title,
    mask,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 隐藏 loading 提示框
function hideLoading(success, fail, complete) {
  wx.hideLoading({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
function switchTab(url, success, fail, complete) {
  wx.switchTab({
    url,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 关闭所有页面，打开到应用内的某个页面
function reLaunch(url, success, fail, complete) {
  wx.reLaunch({
    url,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 关闭当前页面，打开到应用内的某个页面
function redirectTo(url, success, fail, complete) {
  wx.redirectTo({
    url,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
function navigateTo(url, events = {}, success, fail, complete) {
  wx.navigateTo({
    url,
    events,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  })
}

// 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
function navigateBack(delta = 1, success, fail, complete) {
  wx.navigateBack({
    delta,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
function previewImage(current = '', urls = [], success, fail, complete) {
  wx.previewImage({
    current,
    urls,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
function setStorage(key, data, success, fail, complete) {
  wx.setStorage({
    key, // 本地缓存中指定的 key
    data, // 需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象。
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 开始播放语音。同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。
function playVoice(filePath, duration = 60, success, fail, complete) {
  wx.playVoice({
    filePath,
    duration,
    success: res => {
      success && success(res);
    },
    fail: res => {
      console.log(res);
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 暂停正在播放的语音。再次调用 wx.playVoice 播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 wx.stopVoice。
function pauseVoice(success, fail, complete) {
  wx.pauseVoice({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 结束播放语音。
function stopVoice(success, fail, complete) {
  wx.stopVoice({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 获取当前支持的音频输入源
function getAvailableAudioSources(success, fail, complete) {
  wx.getAvailableAudioSources({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 隐藏转发按钮
function hideShareMenu(success, fail, complete) {
  wx.hideShareMenu({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 发起微信支付。了解更多信息，请查看微信支付接口文档
function requestPayment(timeStamp, nonceStr, packagee, signType = 'MD5', paySign, success, fail, complete) {
  wx.requestPayment({
    timeStamp,
    nonceStr,
    package: packagee, // package关键词不能用
    signType,
    paySign,
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 获取系统剪贴板的内容
function getClipboardData(success, fail, complete) {
  wx.getClipboardData({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
function setClipboardData(data, success, fail, complete) {
  wx.setClipboardData({
    data, // 剪贴板的内容
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 从本地缓存中异步获取指定 key 的内容
function getStorage(key, success, fail, complete) {
  wx.getStorage({
    key, // 本地缓存中指定的 key
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。更多使用方法详见 小程序登录。
function login(timeout = 3000, success, fail, complete) {
  wx.login({
    timeout, // 超时时间，单位ms
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// wx.getStorage 的同步版本
function getStorageSync(key) {
  return wx.getStorageSync(key);
}

// wx.setStorage 的同步版本
function setStorageSync(key, data) {
  return wx.setStorageSync(key, data);
}

// 将页面滚动到目标位置，支持选择器和滚动距离两种方式定位
function pageScrollTo(target, duration = 300, success, fail, complete) {
  let obj = {
    // scrollTop, // 滚动到页面的目标位置，单位 px
    duration, // 滚动动画的时长，单位 ms
    // selector, // 选择器
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  };
  typeof target == 'number' ? obj.scrollTop = target : obj.selector = target;
  wx.pageScrollTo(obj);
}

// 显示当前页面的转发按钮
function showShareMenu(withShareTicket = false, success, fail, complete) {
  wx.showShareMenu({
    withShareTicket, // 是否使用带 shareTicket 的转发
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
function hideKeyboard(success, fail, complete) {
  wx.hideKeyboard({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径 (本地路径)，单次下载允许的最大文件为 50MB。使用前请注意阅读相关说明。
// 注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。
function downloadFile(url, header = {}, timeout = 1000, filePath = "", success, fail, complete) {
  wx.downloadFile({
    url, // 下载资源的 url
    header, // HTTP 请求的 Header，Header 中不能设置 Referer
    timeout, // 超时时间，单位为毫秒
    filePath, //	指定文件下载后存储的路径 (本地路径）
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 保存图片到系统相册。
function saveImageToPhotosAlbum(filePath, success, fail, complete) {
  wx.saveImageToPhotosAlbum({
    filePath, // 图片文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
function openSetting(withSubscriptions = false, success, fail, complete) {
  wx.openSetting({
    withSubscriptions, // 是否同时获取用户订阅消息的订阅状态，默认不获取。注意：withSubscriptions 只返回用户勾选过订阅面板中的“总是保持以上选择，不再询问”的订阅消息。
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 显示模态对话框
function showModal(title = "", content = "", showCancel = true, cancelText = "取消", cancelColor = "#000", confirmText = "确定", confirmColor = "#576B95", success, fail, complete) {
  wx.showModal({
    title, //	提示的标题
    content, // 提示的内容
    showCancel, // 是否显示取消按钮
    cancelText, // 取消按钮的文字，最多 4 个字符
    cancelColor, //	取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
    confirmText, //	确认按钮的文字，最多 4 个字符
    confirmColor, //	确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 调起客户端小程序订阅消息界面，返回用户订阅消息的操作结果。当用户勾选了订阅面板中的“总是保持以上选择，不再询问”时，模板消息会被添加到用户的小程序设置页，通过 wx.getSetting 接口可获取用户对相关模板消息的订阅状态。
function requestSubscribeMessage(tmplIds = [], success, fail, complete) {
  // 一次性模板 id 和永久模板 id 不可同时使用。
  // 低版本基础库2.4.4~2.8.3 已支持订阅消息接口调用，仅支持传入一个一次性 tmplId / 永久 tmplId。
  // 2.8.2 版本开始，用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。
  // 2.10.0 版本开始，开发版和体验版小程序将禁止使用模板消息 formId
  wx.requestSubscribeMessage({
    tmplIds, // 需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 在当前页面显示导航条加载动画
function showNavigationBarLoading(success, fail, complete) {
  wx.showNavigationBarLoading({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 在当前页面隐藏导航条加载动画
function hideNavigationBarLoading(success, fail, complete) {
  wx.hideNavigationBarLoading({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 停止当前页面下拉刷新
function stopPullDownRefresh(success, fail, complete) {
  wx.stopPullDownRefresh({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
function vibrateShort(success, fail, complete) {
  wx.vibrateShort({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

// 获取网络类型
function getNetworkType(success, fail, complete) {
  wx.getNetworkType({
    success: res => {
      success && success(res);
    },
    fail: res => {
      fail && fail(res)
    },
    complete: res => {
      complete && complete(res)
    }
  });
}

/// 监听网络状态变化事件
function onNetworkStatusChange(callback) {
  wx.onNetworkStatusChange(callback);
}

// getExtConfig 的同步版本
function getExtConfigSync() {
  // 本接口暂时无法通过 wx.canIUse 判断是否兼容，开发者需要自行判断 wx.getExtConfigSync 是否存在来兼容
  return wx.getExtConfigSync ? wx.getExtConfigSync() : {};
}