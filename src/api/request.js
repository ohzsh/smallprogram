import baseURL from "../../config/baseURL";

let witheList = ["/facepp/v1/skinanalyze"];

export default function request(
  url,
  method = "POST",
  data = {},
  status = "new"
) {
  // 请求Token验证
  const Token = null;

  // 开始正式请求
  return new Promise((resolve, reject) => {
    console.group(
      `%c${method}请求:${baseURL + url} seesion: ${Token || "TEST"}`,
      "color: white; font-size: q4px; background: #409EFF; padding: 3px"
    );
    console.group(
      "%c请求体",
      "color: white; font-size: q4px; background: #67C23A; padding: 3px"
    );
    console.log(data);
    console.groupEnd(
      "%c请求体",
      "color: white; font-size: q4px; background: #67C23A; padding: 3px"
    );

    let requestHeader = {
      "content-type": witheList.includes(url)
        ? "multipart/form-data"
        : "application/json",
      appid: "MOBILE_WX"
    };

    wx.request({
      url: baseURL + url,
      method,
      data,
      header: requestHeader,
      async success(data) {
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        console.group(
          "%c响应报文",
          "color: white; font-size: q4px; background: #67C23A; padding: 3px"
        );
        console.log(data);
        console.groupEnd(
          "%c响应报文",
          "color: white; font-size: q4px; background: #67C23A; padding: 3px"
        );

        // http code
        if (data.statusCode !== 200) {
          wx.showModal({
            title: "请求错误",
            content: data.data.msg || data.data.error,
            showCancel: false
          });
          reject(data);
        }
        resolve(data);
      },
      fail(e) {
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        console.log(`接口请求失败，原因：${e}`);
        reject(e);
      },
      complete() {
        setTimeout(() => {
          console.log("complete" + url);
          wx.hideLoading();
        }, 1000);
      }
    });
  }).catch(() => {
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  });
}
