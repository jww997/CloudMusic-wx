import "api.js";

var baseUrl = require("./api.js");
var app = getApp();

// 保留当前页面，跳转到应用内的某个页面
function navigateTo(url) {
  wx.navigateTo({
    url: url,
  });
}

// 调用网易云音乐API接口，获取数据
function getdata(parameter, fn, fn2) {
  wx.request({
    url: baseUrl + parameter,
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      // console.log(res);
      if (res.statusCode === 200) {
        fn(res);
      } else {
        fn2 ? fn2(res) : '';
      };
    }
  });
}

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
function parseLyric(content) {
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







// 处理歌单被播放所有次数单位
function dealPlayCount(countArr) {
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

// 歌单歌单列表
function playList(playUrl, playImgUrl, playTitle, playAuthor, playId) {
  let isPlayState = app.globalData.isPlayState;
  init();

  // console.log(' app.globalData.curPlayId=' + app.globalData.curPlayId + ',playId=' + playId);

  if (app.globalData.curPlayId != playId) {

    play(playUrl, playImgUrl, playTitle, playAuthor, playId);

  } else { // 点第二下会暂停，改成跳转页面

    // pause(playUrl, playImgUrl, playTitle, playAuthor, playId);
    console.log('跳转');

  };


}

// 监听后台音乐状态
function listenbackgroundState(that) {
  // console.log(that);
  wx.onBackgroundAudioPlay(that => {
    that.setData({
      isPlayState: true,
      isShowPlayBar: true
    });
  });
  wx.onBackgroundAudioPause(that => {
    that.setData({
      isPlayState: false,
      isShowPlayBar: false
    });
  });
  wx.onBackgroundAudioStop(that => {
    that.setData({
      isPlayState: false,
      isShowPlayBar: false
    });
  });
}

// 控制歌曲的播放暂停
function toggle(playUrl, playImgUrl, playTitle, playAuthor, playId) {
  let isPlayState = app.globalData.isPlayState;
  init();

  if (!isPlayState) {
    play(playUrl, playImgUrl, playTitle, playAuthor, playId);
  } else {
    pause();
  };
}

function init() {
  wx.onBackgroundAudioPlay(function() {
    app.globalData.isPlayState = true;
  });
  wx.onBackgroundAudioPause(function() {
    app.globalData.isPlayState = false;
  });
  wx.onBackgroundAudioStop(function() {
    app.globalData.isPlayState = false;
  });
}

function play(playUrl, playImgUrl, playTitle, playAuthor, playId) {
  getdata("check/music?id=" + playId, res => {
    if (res.data.success) {
      wx.playBackgroundAudio({
        dataUrl: playUrl,
        title: playTitle + "-" + playAuthor,
        coverImgUrl: playImgUrl
      });
      wx.setNavigationBarTitle({
        title: playTitle + "-" + playAuthor
      });
      app.globalData.isPlayState = true;
      app.globalData.curPlayId = playId;
      app.globalData.curPlayUrl = playUrl;
      app.globalData.curPlaySong = playTitle;
      app.globalData.curPlayPicUrl = playImgUrl;
      app.globalData.curPlayAuthor = playAuthor;
    };

  }, res => {
    wx.showToast({
      title: '暂无版权',
      icon: 'none',
    });
  });
}

function pause() {
  wx.pauseBackgroundAudio();
  app.globalData.isPlayState = false;
}




// 跳转公共方法
function toPages(event) {
  // console.log(event);
  let to = event.currentTarget.dataset.to;
  let id = event.currentTarget.dataset.id;
  let type = event.currentTarget.dataset.type || 'recommends';
  switch (to) {
    case 'songListSquare': // 歌单广场页
      util.navigateTo('/pages/songListSquare/songListSquare');
      break;
    case 'songListDetail': // 歌单详情页
      util.navigateTo('/pages/songListDetail/songListDetail?type=' + type + '&id=' + id);
      break;
    case 'player': // 音乐播放页
      util.getdata("check/music?id=" + id, res => {
        // console.log('查询版权');
        // console.log(res.data.success);

        util.navigateTo('/pages/player/player?id=' + id);

      }, res => {
        // console.log(res);
        wx.showToast({
          title: '亲,暂无版权',
          image: '/images/cm2_discover_icn_3@2x.png',
          duration: 1000,
          mask: true //是否有透明蒙层，默认为false 
          //如果有透明蒙层，弹窗的期间不能点击文档内容 
        });
      });
      break;
    case 'search': // 搜索页
      util.navigateTo('/pages/search/search');
      break;
  };
}


module.exports = {

  getdata: getdata, // 获取数据
  formatTime: formatTime, // 格式化分秒
  formatDate: formatDate, // 格式化年月日
  parseLyric: parseLyric, // 歌词转化


  toPages: toPages,
  navigateTo: navigateTo,
  dealPlayCount: dealPlayCount,
  listenbackgroundState: listenbackgroundState,
  playList: playList,
  toggle: toggle,
  pause: pause,
  play: play,
  init: init,

}