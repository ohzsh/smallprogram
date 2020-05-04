// 开发环境URL
const BASE_URL_DEV = 'https://api-cn.faceplusplus.com'
// 生产环境URL
const BASE_URL_PROD = 'http://120.55.234.38/api'

// 根据node环境确定URL
export default (process.env.NODE_ENV === 'production'
  ? BASE_URL_PROD
  : BASE_URL_DEV
)
