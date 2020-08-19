const util = require("./util.js");
const apiwx = require("./apiwx.js");
const api = require("./api.js");

module.exports = {
  // --------------------------------- 播放操作
  togglePlaying, // 下一首&下一首
  togglePlayingCut, // 切歌
  togglePlayingState, // 播放状态
  togglePlayingListShow, // 播放列表显示
  toggleModeIndex, // 播放顺序
  // --------------------------------- 网易云API
  getSongUrl, // 获取歌曲地址
  getLyric, // 获取歌词



  getTimestampMistiming, // 获取时间戳与当前时间戳之差
  getNowFormatDate, // 获取当前时间
  addZero, // 补零
}






// 获取当前时间
function getNowFormatDate(separator = '-') {
  let date = new Date();
  return `${date.getFullYear()}${separator}${addZero(date.getMonth() + 1)}${separator}${addZero(date.getDate())}`;
}

// 获取时间戳与当前时间戳之差
function getTimestampMistiming(timestamp) {
  return timestamp ? Math.abs(new Date().getTime() - Number.parseInt(timestamp)) : '';
}

// 补零
function addZero(num) {
  return num < 10 ? '0' + num : num;
}















// 上一首&下一首
function togglePlaying(direction = 1) { // 1 next & -1 prev
  const that = this;
  const app = getApp();
  let {
    playlist,
    playIndex,
    modeIndex, // 1顺序播放 2单曲播放 3随机播放
  } = app.globalData;
  if (modeIndex == 3) { // 随机播放
    playIndex = Math.floor(Math.random() * playlist.length);
  } else {
    if (playIndex >= playlist.length - 1 && direction == 1) {
      playIndex = 0;
    } else if (playIndex <= 0 && direction == -1) {
      playIndex = playlist.length - 1;
    } else {
      playIndex += direction;
      apiwx.showToast(direction == -1 ? '上一首' : '下一首', 'success');
    };
  };
  getSongUrl(playlist[playIndex].id, url => {
    let playing = {
      ...playlist[playIndex],
      url,
    };
    if (app.globalData.isShowLyric) {
      getLyric.call(that, playlist[playIndex].id);
    };
    apiwx.setNavigationBarTitle(`${playing.title}-${playing.singer}`);
    that.setData({
      playIndex,
      playing,
    });
    app.globalData.playIndex = playIndex;
    app.globalData.playing = playing;
    app.initAudio(that);
  }, () => {
    console.log(`%c跳过成功, %c你该充钱了...`, `color: purple;`, `color: inherit;`);
    apiwx.vibrateShort();
    app.globalData.playIndex = playIndex;
    setTimeout(() => {
      togglePlaying.call(that, direction);
    }, 2200);
  });
}

// 列表切歌
function togglePlayingCut(event) {
  const that = this;
  const app = getApp();
  // let id = event.currentTarget.dataset.id;
  let id = event.detail;
  // console.log(event);
  // debugger;
  let {
    playIndex,
    playlist,
  } = app.globalData;
  if (playIndex == id) return;
  getSongUrl(playlist[id].id, url => {
    let playing = {
      ...playlist[id],
      url,
    };
    // that.setData({
    //   playIndex: id,
    //   playing,
    // });
    app.globalData.playIndex = id;
    app.globalData.playing = playing;
    if (app.globalData.isShowLyric) {
      getLyric.call(that, playing.id);
    };
    app.initAudio(that);
    // app.update(that);
  });
}

// 播放状态
function togglePlayingState(event) {
  const that = this;
  const app = getApp();
  let {
    isPlayState
  } = app.globalData;
  if (!isPlayState) {
    app.globalData.backgroundAudioManager.play();
  } else {
    app.globalData.backgroundAudioManager.pause();
  };
  that.setData({
    isPlayState: !isPlayState
  });
  app.globalData.isPlayState = !isPlayState;
}

// 播放列表显示
function togglePlayingListShow(event) {
  const that = this;
  const app = getApp();
  let {
    type,
  } = event.currentTarget.dataset;
  switch (type) {
    case 'show':
      that.setData({
        isShowPlaylist: true
      });
      app.globalData.isShowPlaylist = true;
      break;
    case 'hide':
      that.setData({
        isShowPlaylist: false
      });
      app.globalData.isShowPlaylist = false;
      break;
  };
}

// 播放顺序
function toggleModeIndex(event) {
  const that = this;
  const app = getApp();
  let {
    modeIndex,
    modeList,
  } = that.data;
  modeIndex++;
  modeIndex = modeIndex != (modeList.length + 1) ? modeIndex : 1;
  apiwx.showToast(modeList[modeIndex - 1].name);
  that.setData({
    modeIndex,
  });
  app.globalData.modeIndex = modeIndex;
}








// 使用歌单详情接口后,能得到的音乐的id,但不能得到的音乐url,调用此接口,传入的音乐id(可多个,用逗号隔开),可以获取对应的音乐的url(不需要登录)
// 注:部分用户反馈获取的url会403,hwaphon找到的解决方案是当获取到音乐的id后，将 https://music.163.com/song/media/outer/url?id=id.mp3以src赋予Audio即可播放
function getSongUrl(id, resolve, reject) {
  const api = require("./api.js");
  api.getSongUrl({
    id,
  }).then(res => {
    let url = res.data.data[0].url;
    if (url) {
      resolve && resolve(url);
    } else {
      apiwx.vibrateShort();
      apiwx.showToast('你该充钱了');
      reject && reject();
    };
  });
}

// 调用此接口,传入音乐id可获得对应音乐的歌词(不需要登录)
function getLyric(id, resolve, reject) {
  const that = this;
  const app = getApp();
  const util = require("./util.js");
  const api = require("./api.js");
  let content = [];
  api.getLyric({
    id,
  }).then(res => {
    let {
      lrc,
      nolyric,
    } = res.data;
    if (!nolyric) {
      resolve && resolve();
      util.formatLyric(lrc.lyric).forEach(item => {
        content.push(item);
      });
      let lyric = {
        ...that.data.lyric,
        index: 0,
        content,
        nolyric: nolyric ? true : false,
      };
      clearInterval(that.data.lyric ? that.data.lyric.timer : '');
      that.setData({
        lyric: {
          ...lyric,
          timer: that.setTimer(),
        }
      });
      app.globalData.lyric = lyric;
    } else {
      reject && reject();
      clearInterval(that.data.lyric ? that.data.lyric.timer : '');
      let lyric = {
        nolyric: nolyric ? true : false,
      };
      that.setData({
        lyric,
      });
      app.globalData.lyric = lyric;
    };
  });
}