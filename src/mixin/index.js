/*
 * @Author: json
 * @Date: 2020-05-22 16:10:50
 * @LastEditTime: 2020-06-10 13:47:35
 * @LastEditors: json
 * @Description:全局混入
 * @FilePath: /smallprogram/src/mixin/index.js
 */
export default {
  data() {
    return {
      origin_url: process.env.VUE_APP_IMG_URL
    };
  },
  methods: {
    showToast(title, opt) {
      return uni.showToast({
        ...{
          title,
          icon: "none"
        },
        ...opt
      });
    },
    /**
     * @description: 获取数据库集合的引用
     * @param {String} collection: 集合名称
     * @return: 数据库的引用
     */
    getDB(collection = "") {
      let db = wx.cloud
        .database({
          env: "yun-development-r7n89"
        })
        .collection(collection);
      return db;
    },
    navigateTo(url) {
      //跳转新页面
      uni.navigateTo({
        url
      });
    },
    redirectTo(url) {
      //新页面替换当前页面
      uni.redirectTo({
        url
      });
    },
    navigateBack() {
      //返回上一页
      uni.navigateBack();
    },
    switchTab(url) {
      uni.switchTab({
        //tab页跳转
        url
      });
    },
    /**
     * 封装try catch
     */
    async try(asyncFunc, title) {
      try {
        let res = await asyncFunc();
        return [null, res];
      } catch (e) {
        console.log("error=>", title || JSON.stringify(asyncFunc));
        return [e, null];
      }
    },
    downloadFile(url) {
      uni.downloadFile({
        url,
        success: res => {
          if (res.statusCode === 200) {
            console.log("下载成功");
          }
        }
      });
    }
  }
};
