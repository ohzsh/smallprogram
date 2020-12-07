/*
 * @Author: json
 * @Date: 2020-05-26 23:17:30
 * @LastEditTime: 2020-06-01 11:28:00
 * @LastEditors: json
 * @Description: 请求封装，通用请求
 */ 
const db = wx.cloud.database({
    env: 'yun-development-r7n89'
  })
const API_METHODS = {
    add()
}
module.exports = function ({collection = 'group_info', methods = 'where', parmse = ''}) {
    const currentDb = db.collection(collection)
    return new Promise((resolve, reject) => {
        currentDb[methods](parmse).get({
            
        })
    })
}
