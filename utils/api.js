/**
 * @Author: Gavin
 * @Begin: 2020-07-24 13:56:31
 * @Update: 2020-08-19 16:54:31
 * @Update log: 更新日志
 */
const apiwx = require("./apiwx");
const common = require("./common");
// const API_BASE_URL = "http://neteasecloudmusicapi.zhaoboy.com/"
// const API_BASE_URL = "http://musicapi.leanapp.cn/"
// const API_BASE_URL = "http://192.168.2.113:3000/"
// const API_BASE_URL = "http://192.168.2.113:8088/"
// const API_BASE_URL = "https://netease.lzcdev.xyz/"
// const API_BASE_URL = "http://localhost:3000/"


const API_BASE_URL = "http://49.234.76.196:3000/"


/**
 * 发起 HTTPS 网络请求
 * @param {String} url 开发者服务器接口地址
 * @param {Object} parameter 请求的参数
 * @param {Boolean} isShowLoading 是否展示加载中提示
 */
const request = (url, parameter, isShowLoading = true) => {
  console.log(`request =${!isShowLoading? '>': ''} ${url}, parameter = `, parameter);
  return new Promise((resolve, reject) => {
    isShowLoading ? apiwx.showLoading() : '';
    apiwx.request(API_BASE_URL + url, parameter, 'GET', res => {
      console.log(`request ${!isShowLoading? '-': '='} ${url}, res = `, res);
      resolve && resolve(res);
    }, res => {
      reject && reject(res);
    }, () => {
      isShowLoading ? apiwx.hideLoading() : '';
    });
  });
}
module.exports = { // 前缀 => get获取 add修改 pay支付 upload上传 init初始化 delete删除
  // home =====================================
  getBanner: parameter => { // 轮播图
    return request("banner", parameter);
  },
  getPersonalized: parameter => { // 推荐歌单
    return request("personalized", parameter);
  },
  getTopSong: parameter => { // 新歌速递
    return request("top/song", parameter);
  },
  getAlbumNewest: parameter => { // 新碟上架
    return request("album/newest", parameter);
  },










  getHomepageDragonBall: parameter => { // APP首页圆形图标入口列表
    return request("homepage/dragon/ball", parameter);
  },




  getVideoGroup: parameter => { // 
    return request("video/group", parameter);
  },
  getSongUrl: parameter => { // 
    return request("song/url", parameter);
  },




  // ranking =====================================
  getToplistDetail: parameter => { // 排行榜
    return request("toplist/detail", parameter);
  },


  // list =====================================
  getPlaylistDetail: parameter => { // 热门推荐列表
    return request("playlist/detail", parameter);
  },
  getAlbum: parameter => { // 专辑
    return request("album", parameter);
  },
  getTopList: parameter => { // 
    return request("top/list", parameter);
  },





  getLyric: parameter => { // 
    return request("lyric", parameter);
  },
  getMvDetail: parameter => { // 
    return request("mv/detail", parameter);
  },
  getMvUrl: parameter => { // 
    return request("mv/url", parameter);
  },
  getRelatedAllvideo: parameter => { // 相关视频
    return request("related/allvideo", parameter);
  },
  getCommentMv: parameter => { // 最新评论
    return request("comment/mv", parameter);
  },








  getTopPlaylistHighquality: parameter => { // 
    return request("top/playlist/highquality", parameter);
  },
  getTopPlaylist: parameter => { // 
    return request("top/playlist", parameter);
  },
  getPlaylistCatlist: parameter => { // 
    return request("playlist/catlist", parameter);
  },


  getComment: (parameter, port) => { // 
    return request(`comment/${port}`, parameter);
  },



  getLoginCellphone: parameter => { // 手机号登录
    return request(`login/cellphone`, parameter);
  },





  getRecommendResource: parameter => { // 每日推荐歌单 ( 需要登录 )
    return request(`recommend/resource`, parameter);
  },









}






















































// const uploadFile = (url, parameter, filePath, isShowLoading = true) => { // 文件上传请求
//   console.log(`upload =${!isShowLoading? '>': ''} ${url}, filePath = ${filePath}, parameter = `, parameter);
//   return new Promise((resolve, reject) => {
//     isShowLoading ? apiwx.showLoading() : '';
//     apiwx.uploadFile(API_BASE_URL + url, filePath, 'file', {}, parameter, 3000, res => {
//       console.log(`request ${!isShowLoading? '-': '='} ${url}, res = `, res);
//       typeof res.data == 'string' ? res.data = JSON.parse(res.data) : '';
//       resolve && resolve(res);
//     }, res => {
//       reject && reject(res);
//     }, () => {
//       isShowLoading ? apiwx.hideLoading() : '';
//     });
//   });
// }
// const getSharePoster = (url, parameter) => { // 分享海报
//   return `${API_BASE_URL}${url}/${parameter}`;
// }