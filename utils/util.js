const baseUrl = require("./api.js");

// 格式化时间 传入毫秒，输出分秒
function formatTime(time) {
  time = new Date(time);

  function _formatNumber(number) {
    // 方法一：数值处理
    return number / 10 < 1 ? "0" + number : number;
    // 方法二：字符串处理
    // number = number.toString();
    // return number[1] ? number : '0' + number;
  }
  return `${_formatNumber(time.getMinutes())}:${_formatNumber(time.getSeconds())}`;
}

// 格式化时间 传入毫秒，输出年月日
function formatDate(time) {
  let date = new Date(time);
  return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
}

// 格式化歌词 输入字符串，输出数组
function formatLyric(content) {
  let newArr = new Array();
  let rowArr = content.split('\n');
  for (var row of rowArr) {
    if (row.indexOf(']') == "-1" && row) {
      row && newArr.push({
        lrc: row
      });
    } else if (row.indexOf(']') != "-1") {
      let time = row.split(']').shift().substr(1, 8);
      if (row.split(']').pop()) {
        row && newArr.push({
          lrc: row.split(']').pop(),
          sec: parseInt(time.split(':')[0] * 60 + time.split(':')[1] * 1)
        });
      };
    };
  };
  return newArr;
}

// 格式化播放量 输入数字数组，输出带单位的数组
function formatPlayCount(countArr) {
  let newCountArr = new Array();
  if (countArr instanceof Array) {
    countArr.forEach(count => {
      if (count >= 1000000000) {
        newCountArr.push(`${(count / 100000000).toFixed(0)}亿`);
      } else if (count >= 100000000) {
        newCountArr.push(`${(count / 100000000).toFixed(1)}亿`);
      } else if (count >= 100000) {
        newCountArr.push(`${(count / 10000).toFixed(0)}万`);
      } else {
        newCountArr.push(count);
      };
    });
    return newCountArr;

  } else {
    let count = countArr;
    if (count > 300000000) {
      count = `${(count / 100000000).toFixed(0)}亿`;
    } else if (count >= 100000000) {
      count = `${(count / 100000000).toFixed(1)}亿`;
    } else if (count >= 100000) {
      count = `${(count / 10000).toFixed(0)}万`;
    } else {
      count = count;
    };
    return count;
  };
}

// 格式化歌手 输入数组，输出字符串
function formatArtists(arr) {
  let singers = '';
  arr.forEach((value, index) => {
    if (index > 0) {
      singers += '/' + value.name;
    } else {
      singers = value.name;
    };
  });
  return singers;
}

// 数组切割 [{},{},{},{},{},{}] => [[{},{},{}],[{},{},{}]]
function arrSlice(arr, subGroupLength, index = 0) {
  let arr_new = new Array();
  while (index < arr.length) {
    arr_new.push(arr.slice(index, index += subGroupLength));
  };
  return arr_new;
}

// 数组展开 [[{},{},{}],[{},{},{}]] => [{},{},{},{},{},{}] 
function arrUnfold(arr) {
  let arr_new = new Array();
  arr.forEach(item => {
    arr_new.push(...item);
  });
  return arr_new;
}

// 清除定时器
// function clearInterval() {
//   clearInterval();
// }

module.exports = {
  // --------------------------------- 自定义处理
  formatTime, // 格式化分秒
  formatDate, // 格式化年月日
  formatLyric, // 格式化歌词
  formatPlayCount, // 格式化单位
  formatArtists, // 格式化歌手
  arrSlice, // 数组切割
  arrUnfold, // 数组展开
  // --------------------------------- 微信官方API
  getdata, // 发起 HTTPS 网络请求
  navigateTo, // 保留当前页面，跳转到应用内的某个页面
  redirectTo, // 关闭当前页面，跳转到应用内的某个页面
  showToast, // 显示消息提示框
  vibrateShort, // 短振动
  setNavigationBarTitle, // 动态设置当前页面的标题
  previewImage, // 在新页面中全屏预览图片
  pageScrollTo, // 将页面滚动到目标位置
  getSystemInfo, // 获取系统信息
  saveImageToPhotosAlbum, // 保存图片到系统相册
  downloadFile, // 下载文件资源到本地
  getSetting, // 获取用户的当前设置
  getUserInfo, // 获取用户信息。
}

// 发起 HTTPS 网络请求
function getdata(api, resolve, reject) {
  wx.request({
    url: baseUrl + api,
    header: {
      'Content-Type': 'application/json',
      'token': '64d65234a8d5b854577c48c7fce60174f288f2a8bb4b3a54120b691dd1d7964afae782bf2ffa385e88fe4d29196311f77e358852ab2752ce',
    },
    success: function(res) {
      if (res.statusCode === 200) {
        resolve ? resolve(res) : '';
      } else {
        reject ? reject(res) : '';
      };
    }
  });
}

// 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
function navigateTo(url) {
  wx.navigateTo({
    url: url,
  });
}

// 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
function redirectTo(url) {
  wx.redirectTo({
    url: url,
  });
}

// 显示消息提示框
function showToast(title, icon = 'none', duration = 1500) {
  wx.showToast({
    title,
    icon,
    duration,
  });
}

// 使手机发生较短时间的振动（15 ms）
function vibrateShort() {
  wx.vibrateShort();
}

// 动态设置当前页面的标题
function setNavigationBarTitle(title) {
  wx.setNavigationBarTitle({
    title,
  });
}

// 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作
function previewImage(urls = [], current = '') {
  wx.previewImage({
    current, // 当前显示图片的http链接
    urls // 需要预览的图片http链接列表
  });
}

// 将页面滚动到目标位置，支持选择器和滚动距离两种方式定位
function pageScrollTo(scrollTop, duration) {
  return () => {
    wx.pageScrollTo({
      scrollTop: scrollTop ? scrollTop : 0,
      duration: duration ? duration : 3000,
    });
  }
}

// 获取系统信息
function getSystemInfo(resolve, reject) {
  wx.getSystemInfo({
    success(res) {
      resolve && resolve(res);
    },
    fail(res) {
      reject && reject(res);
    }
  });
}

// 保存图片到系统相册
function saveImageToPhotosAlbum(filePath = '', resolve, reject) {
  wx.saveImageToPhotosAlbum({
    filePath,
    success(res) {
      resolve && resolve(res);
    },
    fail(res) {
      reject && reject(res);
    }
  });
}

// 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径(本地路径) ，单次下载允许的最大文件为 50MB。使用前请注意阅读相关说明。
// 注意：请在服务端响应的 header 中指定合理的 Content - Type 字段，以保证客户端正确处理文件类型。
function downloadFile(url = '', resolve, reject) {
  wx.downloadFile({
    url,
    // filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.jpg',
    header: {
      "Content-Type": 'image/jpg',
    },
    success(res) {
      resolve && resolve(res);
    },
    fail(res) {
      reject && reject(res);
    }
  });
}

// 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
function getSetting(resolve, reject) {
  wx.getSetting({
    success(res) {
      resolve && resolve(res);
    },
    fail(res) {
      reject && reject(res);
    }
  });
}

// 获取用户信息。
function getUserInfo(resolve, reject) {
  wx.getUserInfo({
    success(res) {
      resolve && resolve(res);
    },
    fail(res) {
      reject && reject(res);
    }
  });
}